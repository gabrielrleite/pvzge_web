/*
 * PvZ2 Gardendless - Plant Match: dates as scenes.
 *
 * Inviting a match opens the date planner: where (6 places, some for
 * partners only), your look and a gift (some cost likes). The date is then
 * a scene on the phone: the place, the plant animated, a mood meter and her
 * lines; you answer twice (romantic, funny, sincere or bold: each
 * personality likes one style and dislikes another), play one mini-game
 * that depends on the place (sun shower, couple quiz, dance, perfect photo)
 * and say goodbye. The final mood gives 0-3 stars: with a star the plant
 * becomes (or stays) your partner and the date goes to the album. Each
 * plant goes out at most twice a day. The dates played as a level are
 * still there, as "Adventure" (the wedding is one).
 */
(function () {
  'use strict';

  var MP = window.PvZMP;
  var X = window.PvZX;
  var t = X.t;
  var el = MP.util.el;
  var I = X.matchI;
  var MT = X.matchText;
  var TXT = MT.TXT;
  var CHAT = MT.CHAT;
  var PERS = MT.PERS;
  var TRAITS = MT.TRAITS;
  var SC = MT.SCENE;
  var L = I.L;
  var Lp = I.Lp;
  var shuffle = I.shuffle;
  var pick = I.pick;
  var today = I.today;

  var STYLES = ['romantic', 'funny', 'sincere', 'bold'];
  // Style each personality likes / dislikes.
  var PSTYLE = {
    sweet: { good: 'romantic', bad: 'bold' },
    shy: { good: 'sincere', bad: 'bold' },
    sassy: { good: 'funny', bad: 'sincere' },
    nerd: { good: 'sincere', bad: 'romantic' },
    brave: { good: 'bold', bad: 'sincere' },
    drama: { good: 'romantic', bad: 'funny' },
  };
  var PLOOK = {
    sweet: { good: 'flower', bad: 'shades' },
    shy: { good: 'casual', bad: 'hat' },
    sassy: { good: 'shades', bad: 'casual' },
    nerd: { good: 'glasses', bad: 'bow' },
    brave: { good: 'hat', bad: 'glasses' },
    drama: { good: 'bow', bad: 'casual' },
  };
  var PGIFT = { sweet: 'plush', shy: 'flowers', sassy: 'choc', nerd: 'book', brave: 'water', drama: 'flowers' };
  var FGIFT = { Sun: 'flowers', Cold: 'water', Fire: 'choc', Magic: 'book' };
  var DATES_PER_DAY = 2;

  // Names inside an English sentence go lowercase; Portuguese lines start with them.
  function low(s) {
    return MP.lang === 'en' ? s.toLowerCase() : s;
  }

  function persOf(p) {
    return PERS[p.pers] ? p.pers : 'sweet';
  }

  function placeFeel(p, id) {
    var pl = SC.places[id];
    var has = function (x, key, v) {
      return !!(x && x[key] && x[key].indexOf(v) >= 0);
    };
    if (has(pl.loves, 'pers', persOf(p)) || has(pl.loves, 'fam', p.family)) return 'love';
    if (has(pl.hates, 'pers', persOf(p)) || has(pl.hates, 'fam', p.family)) return 'hate';
    return 'ok';
  }

  function favGift(p) {
    return FGIFT[p.family] || PGIFT[persOf(p)];
  }

  function datesToday(code) {
    var d = X.store.get('matchSceneDays', {});
    var e = d[code];
    return e && e.day === today() ? e.n : 0;
  }

  function countDate(code) {
    var d = X.store.get('matchSceneDays', {});
    var e = d[code] && d[code].day === today() ? d[code] : { day: today(), n: 0 };
    e.n++;
    d[code] = e;
    X.store.set('matchSceneDays', d);
  }

  function placeLock(id, r) {
    var need = SC.places[id].need;
    if (need == null) return '';
    if (!r) return L(TXT.dateNeedPartner);
    if (I.relStage(r) < need) return L(TXT.dateNeed, { stage: I.stageLabel(need) });
    return '';
  }

  /* --------------------------------------------------------- the planner */

  I.plan = null;

  I.datePicker = function datePicker(p) {
    var r = I.partners()[p.code];
    if (!I.plan || I.plan.code !== p.code) I.plan = { code: p.code, tab: 'scene', place: 'garden', look: 'casual', gift: '' };
    var plan = I.plan;
    var U = SC.ui;
    var sheet = el('div.pvzx-mview.pvzx-dates', null, [
      el('button.pvzx-x', { text: '←', title: t('close'), onclick: function () {
        I.view.datePick = null;
        I.render();
      } }),
      el('h3', { text: '💐 ' + L(U.planTitle) + ' · ' + p.name }),
      el('div.pvzx-msub.pvzx-plan-tabs', null, [
        el('button' + (plan.tab === 'scene' ? '.pvzx-on' : ''), { text: L(U.tabScene), onclick: function () {
          plan.tab = 'scene';
          I.render();
        } }),
        el('button' + (plan.tab === 'adventure' ? '.pvzx-on' : ''), { text: L(U.tabAdventure), onclick: function () {
          plan.tab = 'adventure';
          I.render();
        } }),
      ]),
    ]);
    sheet.addEventListener('wheel', function (e) {
      e.stopPropagation();
    });
    if (plan.tab === 'adventure') {
      sheet.appendChild(el('p.pvzx-small', { text: L(U.adventureDesc) }));
      return I.adventureList(p, sheet);
    }
    sheet.appendChild(el('p.pvzx-small', { text: L(TXT.inviteDesc, { name: p.name }) }));
    // 1. Where
    sheet.appendChild(el('h4', { text: L(U.where) }));
    Object.keys(SC.places).forEach(function (id) {
      var pl = SC.places[id];
      var lock = placeLock(id, r);
      var who = (pl.loves.pers || [])
        .map(function (k) {
          return PERS[k].icon + ' ' + I.gfix(L(PERS[k].name), 'f');
        })
        .concat(
          (pl.loves.fam || []).map(function (f) {
            return t('family_' + f.toLowerCase());
          }),
        )
        .join(', ');
      var best = r && r.dates[id];
      sheet.appendChild(
        el('button.pvzx-date' + (plan.place === id ? '.pvzx-picked' : '') + (lock ? '.pvzx-locked' : ''), { disabled: !!lock, onclick: function () {
          plan.place = id;
          I.render();
        } }, [
          el('span.pvzx-date-icon', { text: pl.icon }),
          el('span.pvzx-date-text', null, [
            el('b', { text: L(pl.name) }),
            el('span', { text: SC.games[pl.game].icon + ' ' + L(SC.games[pl.game]) + (best ? ' · ' + L(TXT.dateBest, { stars: I.starsText(best) }) : '') }),
            el('small', { text: lock || L(U.hint, { who: who }) }),
          ]),
        ]),
      );
    });
    // 2. Look
    sheet.appendChild(el('h4', { text: L(U.look) }));
    sheet.appendChild(
      I.choiceChips(Object.keys(SC.looks), plan.look, function (v) {
        plan.look = v;
        I.render();
      }, function (v) {
        return SC.looks[v].icon + ' ' + L(SC.looks[v]);
      }),
    );
    // 3. Gift
    sheet.appendChild(el('h4', { text: L(U.gift) + ' (♥ ' + I.likesLeft() + ')' }));
    sheet.appendChild(
      I.choiceChips([''].concat(Object.keys(SC.gifts)), plan.gift, function (v) {
        if (v && SC.gifts[v].cost > I.likesLeft()) {
          if (MP.ui) MP.ui.toast(L(U.notEnough), 'bad');
          return;
        }
        plan.gift = v;
        I.render();
      }, function (v) {
        if (!v) return L(U.noGift);
        var g = SC.gifts[v];
        return g.icon + ' ' + L(g) + (g.cost ? ' (♥' + g.cost + ')' : '');
      }),
    );
    var tired = datesToday(p.code) >= DATES_PER_DAY;
    var maxLock = !r && Object.keys(I.partners()).length >= I.MAX_PARTNERS ? L(TXT.maxPartners, { n: I.MAX_PARTNERS }) : '';
    if (tired || maxLock) sheet.appendChild(el('p.pvzx-small.pvzx-seek', { text: maxLock || L(U.tired, { name: p.name }) }));
    sheet.appendChild(
      el('div.pvzx-file-actions', null, [
        el('button.mp-btn.mp-green', { text: L(U.go), disabled: tired || !!maxLock || !!placeLock(plan.place, r), onclick: function () {
          I.startScene(p, plan.place, plan.look, plan.gift);
        } }),
      ]),
    );
    return sheet;
  };

  /* ----------------------------------------------------------- the scene */

  I.scene = null;
  I.sceneEl = null;

  I.startScene = function startScene(p, place, look, gift) {
    if (gift && SC.gifts[gift].cost) I.useLike(SC.gifts[gift].cost);
    countDate(p.code);
    I.view.datePick = null;
    var pl = SC.places[place];
    var s = (I.scene = { p: p, place: place, look: look, gift: gift, mood: 30, step: 'arrive', hl: [], lines: [], chat: 0, game: 0, gameDone: false });
    var pers = persOf(p);
    var me = I.gfix;
    // Arrival: the place, your look, the gift.
    s.lines.push({ from: 'them', text: me(L(pl.arrive), p.gender) });
    var feel = placeFeel(p, place);
    if (feel === 'love') {
      mood(15);
      s.lines.push({ from: 'them', text: me(L(SC.react.placeLove), p.gender) });
      s.hl.push(L(SC.hl.placeLove, { icon: pl.icon }));
    } else if (feel === 'hate') {
      mood(-10);
      s.lines.push({ from: 'them', text: me(L(SC.react.placeHate), p.gender) });
      s.hl.push(L(SC.hl.placeHate, { icon: pl.icon }));
    } else {
      mood(5);
      s.hl.push(L(SC.hl.placeOk, { icon: pl.icon }));
    }
    var lk = SC.looks[look];
    if (PLOOK[pers].good === look) {
      mood(10);
      s.lines.push({ from: 'them', text: me(L(SC.react.lookLove, { look: low(L(lk)) }), p.gender) });
      s.hl.push(L(SC.hl.lookLove, { icon: lk.icon }));
    } else if (PLOOK[pers].bad === look) {
      mood(-5);
      s.lines.push({ from: 'them', text: me(L(SC.react.lookHate, { look: low(L(lk)) }), p.gender) });
      s.hl.push(L(SC.hl.lookHate, { icon: lk.icon }));
    }
    var lovesGifts = p.love === 'gifts';
    if (gift) {
      var g = SC.gifts[gift];
      s.lines.push({ from: 'me', text: g.icon + ' ' + L(g) });
      if (favGift(p) === gift) {
        mood(12 + (lovesGifts ? 5 : 0));
        s.lines.push({ from: 'them', text: me(L(SC.react.giftLove, { gift: low(L(g)) }), p.gender) });
        s.hl.push(L(SC.hl.giftLove, { icon: g.icon }));
      } else {
        mood(5 + (lovesGifts ? 5 : 0));
        s.lines.push({ from: 'them', text: me(L(SC.react.giftOk), p.gender) });
        s.hl.push(L(SC.hl.giftOk, { icon: g.icon }));
      }
    } else if (lovesGifts) {
      mood(-8);
      s.hl.push(L(SC.hl.giftNone));
    }
    if (!I.sceneEl) I.sceneEl = el('div.pvzx-scene');
    if (I.node && I.sceneEl.parentNode !== I.node) I.node.appendChild(I.sceneEl);
    I.render();
    I.sceneRender();
  };

  function mood(n) {
    var s = I.scene;
    if (!s) return;
    s.mood = Math.max(0, Math.min(100, s.mood + n));
    if (n && I.sceneEl) {
      var fx = el('div.pvzx-scene-fx', { text: n > 0 ? '❤️ +' + n : '💔 ' + n });
      I.sceneEl.appendChild(fx);
      setTimeout(function () {
        fx.remove();
      }, 1200);
    }
  }

  function choices(s, beat) {
    if (!s.opts || s.optsFor !== s.step) {
      s.optsFor = s.step;
      s.opts = shuffle(STYLES.slice()).slice(0, 3);
    }
    return s.opts.map(function (style) {
      return { style: style, text: I.gfix(L(beat[style]), s.p.gender) };
    });
  }

  function answer(s, opt) {
    var pref = PSTYLE[persOf(s.p)];
    var P = PERS[persOf(s.p)];
    s.lines.push({ from: 'me', text: opt.text });
    if (opt.style === pref.good) {
      mood(12);
      s.chat++;
      s.lines.push({ from: 'them', text: I.gfix(Lp(P.good), s.p.gender) });
    } else if (opt.style === pref.bad) {
      mood(-12);
      s.chat--;
      s.lines.push({ from: 'them', text: I.gfix(Lp(P.bad), s.p.gender) });
    } else {
      mood(3);
      s.lines.push({ from: 'them', text: I.gfix(Lp(CHAT.react.meh), s.p.gender) });
    }
  }

  var ORDER = ['arrive', 'beat1', 'game', 'beat2', 'end', 'result'];
  function next(s) {
    s.step = ORDER[ORDER.indexOf(s.step) + 1];
    if (s.step === 'game') s.lines.push({ from: 'them', text: I.gfix(L(SC.react.gameIntro), s.p.gender) });
    if (s.step === 'end') s.lines.push({ from: 'them', text: I.gfix(L(SC.react.endQ), s.p.gender) });
    if (s.step === 'result') finish(s, false);
    I.sceneRender();
  }

  function goodbye(s, kind) {
    var R = SC.react;
    s.lines.push({ from: 'me', text: L(kind === 'kiss' ? R.endKiss : kind === 'hug' ? R.endHug : R.endShake) });
    var high = s.mood >= 70;
    var reply;
    if (kind === 'kiss') {
      mood(high ? 6 : -8);
      reply = high ? R.endKissYes : R.endKissNo;
    } else if (kind === 'hug') {
      mood(s.mood >= 45 ? 4 : -2);
      reply = R.endHugYes;
    } else {
      mood(high ? -4 : 2);
      reply = high ? R.endShakeHigh : R.endShakeLow;
    }
    s.lines.push({ from: 'them', text: I.gfix(L(reply), s.p.gender) });
    s.hl.push(L(SC.hl.end, { txt: L(kind === 'kiss' ? R.endKiss : kind === 'hug' ? R.endHug : R.endShake) }));
    s.step = 'bye';
    I.sceneRender();
  }

  function starsOf(m) {
    return m >= 85 ? 3 : m >= 65 ? 2 : m >= 45 ? 1 : 0;
  }

  function finish(s, quit) {
    var p = s.p;
    var stars = quit ? 0 : starsOf(s.mood);
    s.stars = stars;
    s.step = 'result';
    if (s.chat > 0) s.hl.push(L(SC.hl.chatGood));
    else if (s.chat < 0) s.hl.push(L(SC.hl.chatBad));
    if (stars > 0) {
      s.fresh = I.dateSuccess(p.code, s.place, stars, false, { place: s.place, stars: stars, at: Date.now(), game: s.game });
      I.later(p.code, Lp(CHAT.dateWonMsg), 4000 + Math.random() * 6000);
    } else {
      I.later(p.code, Lp(CHAT.dateLostMsg), 4000 + Math.random() * 6000);
      var r = I.partners()[p.code];
      if (quit && r && I.relStage(r) >= 1) I.addXp(p.code, -1);
    }
    I.flushStats();
  }

  I.closeScene = function closeScene() {
    I.scene = null;
    if (I.sceneEl) I.sceneEl.remove();
    I.sceneEl = null;
    I.render();
  };

  function plantPic(p) {
    return p.photos && p.photos.idle ? I.animImg(p.photos.idle) : el('img', { src: p.packet, alt: '' });
  }

  I.sceneRender = function sceneRender() {
    var s = I.scene;
    var box = I.sceneEl;
    if (!s || !box) return;
    var p = s.p;
    var pl = SC.places[s.place];
    var U = SC.ui;
    box.style.background = pl.bg;
    var meter = el('div.pvzx-scene-top', null, [
      el('span', { text: pl.icon + ' ' + L(pl.name) }),
      el('div.pvzx-mood', { title: L(U.mood) }, [el('i', { style: 'width:' + s.mood + '%' }), el('b', { text: '❤️ ' + s.mood })]),
      s.step !== 'result'
        ? el('button.pvzx-x', { text: '×', title: L(U.quit), onclick: function () {
            if (!window.confirm(L(U.quitAsk))) return;
            finish(s, true);
            I.sceneRender();
          } })
        : null,
    ]);
    var stage = el('div.pvzx-scene-stage', null, [
      el('div.pvzx-scene-deco', { text: pl.deco }),
      el('div.pvzx-scene-plant', null, [plantPic(p)]),
      el('div.pvzx-scene-you', { text: '🧑‍🌾' + SC.looks[s.look].icon + (s.gift ? SC.gifts[s.gift].icon : '') }),
    ]);
    var talk = el('div.pvzx-scene-talk');
    talk.addEventListener('wheel', function (e) {
      e.stopPropagation();
    });
    s.lines.slice(-6).forEach(function (m) {
      talk.appendChild(el('div.pvzx-bubble.pvzx-from-' + m.from, { text: m.text }));
    });
    var actions = el('div.pvzx-scene-actions');
    if (s.step === 'arrive') actions.appendChild(el('button.mp-btn.mp-green', { text: L(U.next), onclick: function () {
      next(s);
    } }));
    else if (s.step === 'beat1' || s.step === 'beat2') {
      var beat = pl.beats[s.step === 'beat1' ? 0 : 1];
      if (s.asked !== s.step) {
        s.asked = s.step;
        s.lines.push({ from: 'them', text: I.gfix(L(beat.line), p.gender) });
        talk.appendChild(el('div.pvzx-bubble.pvzx-from-them', { text: I.gfix(L(beat.line), p.gender) }));
      }
      choices(s, beat).forEach(function (o) {
        actions.appendChild(el('button.pvzx-chat-opt', { text: o.text, onclick: function () {
          answer(s, o);
          s.step = s.step === 'beat1' ? 'beat1done' : 'beat2done';
          I.sceneRender();
        } }));
      });
    } else if (s.step === 'beat1done' || s.step === 'beat2done') {
      actions.appendChild(el('button.mp-btn.mp-green', { text: L(U.next), onclick: function () {
        s.step = s.step === 'beat1done' ? 'beat1' : 'beat2';
        next(s);
      } }));
    } else if (s.step === 'game') {
      var g = SC.games[pl.game];
      if (s.gameDone) {
        actions.appendChild(el('button.mp-btn.mp-green', { text: L(U.next), onclick: function () {
          next(s);
        } }));
      } else if (s.playing) {
        // The mini-game owns the stage while it runs.
        stage = s.gameEl;
      } else {
        talk.appendChild(el('div.pvzx-bubble.pvzx-from-sys', { text: g.icon + ' ' + L(g) + ': ' + L(g.how, { name: p.name }) }));
        actions.appendChild(el('button.mp-btn.mp-green', { text: g.icon + ' ' + L(U.play), onclick: function () {
          s.playing = true;
          s.gameEl = el('div.pvzx-scene-stage.pvzx-game');
          I.sceneRender();
          GAMES[pl.game](s.gameEl, p, function (points) {
            s.playing = false;
            s.gameDone = true;
            s.game = points;
            mood(Math.round(points));
            s.hl.push(L(SC.hl.game, { icon: g.icon, game: L(g), n: points }));
            s.lines.push({ from: 'them', text: I.gfix(L(points >= 12 ? SC.react.gameGood : SC.react.gameMeh), p.gender) });
            I.sceneRender();
          });
        } }));
      }
    } else if (s.step === 'end') {
      [['kiss', SC.react.endKiss], ['hug', SC.react.endHug], ['shake', SC.react.endShake]].forEach(function (k) {
        actions.appendChild(el('button.pvzx-chat-opt', { text: L(k[1]), onclick: function () {
          goodbye(s, k[0]);
        } }));
      });
    } else if (s.step === 'bye') {
      actions.appendChild(el('button.mp-btn.mp-green', { text: L(U.next), onclick: function () {
        s.step = 'end';
        next(s);
      } }));
    } else if (s.step === 'result') {
      box.replaceChildren(resultView(s));
      return;
    }
    box.replaceChildren(meter, stage, talk, actions);
    setTimeout(function () {
      talk.scrollTop = talk.scrollHeight;
    }, 0);
  };

  function resultView(s) {
    var U = SC.ui;
    var title = s.stars >= 3 ? U.resultGreat : s.stars > 0 ? U.resultOk : U.resultFail;
    return el('div.pvzx-scene-result', null, [
      el('h3', { text: L(U.resultTitle) }),
      el('div.pvzx-scene-plant.pvzx-small-plant', null, [plantPic(s.p)]),
      el('div.pvzx-scene-stars', { text: I.starsText(s.stars) }),
      el('b', { text: L(title) }),
      el('p', { text: '❤️ ' + s.mood + '/100' }),
      el(
        'ul',
        null,
        s.hl.map(function (h) {
          return el('li', { text: h });
        }),
      ),
      s.fresh ? el('p.pvzx-good', { text: L(TXT.dateWon, { name: s.p.name }) }) : null,
      el('button.mp-btn.mp-green', { text: L(U.back), onclick: I.closeScene }),
    ]);
  }

  /* --------------------------------------------------------- mini-games */

  function alive(node) {
    return !!(node && node.isConnected && I.scene);
  }

  var GAMES = {
    // Tap the suns falling for 12 s; 2 points each (max 20).
    suns: function (area, p, done) {
      var score = 0;
      var end = Date.now() + 12000;
      var last = 0;
      var suns = [];
      var label = el('div.pvzx-game-score', { text: L(SC.ui.score, { n: 0 }) });
      area.appendChild(label);
      var prev = performance.now();
      (function frame(now) {
        if (!alive(area)) return;
        var dt = (now - prev) / 1000;
        prev = now;
        var h = area.clientHeight || 300;
        var w = area.clientWidth || 300;
        if (now - last > 520 && Date.now() < end) {
          last = now;
          var sun = { y: -40, x: 10 + Math.random() * (w - 60), v: 80 + Math.random() * 90 };
          sun.node = el('button.pvzx-sun', { text: '☀️', style: 'left:' + sun.x + 'px;top:-40px' });
          sun.node.addEventListener('pointerdown', function (e) {
            e.preventDefault();
            if (sun.hit) return;
            sun.hit = true;
            score++;
            label.textContent = L(SC.ui.score, { n: score * 2 });
            sun.node.classList.add('pvzx-pop');
            setTimeout(function () {
              sun.node.remove();
            }, 200);
          });
          area.appendChild(sun.node);
          suns.push(sun);
        }
        suns.forEach(function (sn) {
          if (sn.hit) return;
          sn.y += sn.v * dt;
          sn.node.style.top = sn.y + 'px';
          if (sn.y > h) {
            sn.hit = true;
            sn.node.remove();
          }
        });
        if (Date.now() >= end && suns.every(function (sn) {
          return sn.hit;
        })) return done(Math.min(20, score * 2));
        requestAnimationFrame(frame);
      })(prev);
    },

    // Three questions about the plant; 7 points each (max 20).
    quiz: function (area, p, done) {
      var Q = SC.quiz;
      var all = [
        { q: Q.cost, right: '☀ ' + p.cost, wrong: ['☀ ' + (p.cost + 25), '☀ ' + Math.max(0, p.cost - 25 || p.cost + 50)] },
        { q: Q.family, right: t('family_' + p.family.toLowerCase()), wrong: shuffle(X.match.FAMILIES.filter(function (f) {
          return f !== p.family;
        })).slice(0, 2).map(function (f) {
          return t('family_' + f.toLowerCase());
        }) },
        { q: Q.like, right: p.likes[0] || '?', wrong: I.otherLikes(p, 2) },
        { q: Q.sign, right: L(TRAITS.signs[p.sign]), wrong: shuffle(TRAITS.signs.filter(function (x, i) {
          return i !== p.sign;
        })).slice(0, 2).map(function (x) {
          return L(x);
        }) },
      ];
      var qs = shuffle(all).slice(0, 3);
      var i = 0;
      var right = 0;
      (function ask() {
        if (!alive(area)) return;
        if (i >= qs.length) return done(Math.min(20, right * 7));
        var q = qs[i];
        var opts = shuffle([q.right].concat(q.wrong));
        var feedback = el('div.pvzx-game-score', { text: (i + 1) + '/3' });
        area.replaceChildren(
          feedback,
          el('div.pvzx-quiz', null, [
            el('b', { text: L(q.q) }),
            el(
              'div.pvzx-quiz-opts',
              null,
              opts.map(function (o) {
                return el('button.pvzx-chat-opt', { text: o, onclick: function () {
                  var ok = o === q.right;
                  if (ok) right++;
                  feedback.textContent = L(ok ? Q.right : Q.wrong) + (ok ? '' : ' (' + q.right + ')');
                  area.querySelectorAll('.pvzx-quiz-opts button').forEach(function (b) {
                    b.disabled = true;
                  });
                  i++;
                  setTimeout(ask, ok ? 700 : 1300);
                } });
              }),
            ),
          ]),
        );
      })();
    },

    // Eight notes cross a line; tap ♪ when one is on it (2.5 points a hit).
    rhythm: function (area, p, done) {
      var lane = el('div.pvzx-lane', null, [el('i.pvzx-lane-line')]);
      var label = el('div.pvzx-game-score', { text: '0/8' });
      var hits = 0;
      var notes = [];
      var start = performance.now() + 600;
      var TRAVEL = 1900;
      for (var k = 0; k < 8; k++) notes.push({ t: start + k * 760 + Math.random() * 200, node: null, done: false });
      var btn = el('button.pvzx-tap', { text: '♪' });
      btn.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        var w = lane.clientWidth || 300;
        var target = w * 0.2;
        var best = null;
        notes.forEach(function (n) {
          if (!n.node || n.done) return;
          var d = Math.abs(n.x - target);
          if (!best || d < best.d) best = { n: n, d: d };
        });
        if (best && best.d < 26) {
          best.n.done = true;
          hits++;
          best.n.node.classList.add('pvzx-pop');
          label.textContent = hits + '/8';
        } else {
          btn.classList.add('pvzx-miss');
          setTimeout(function () {
            btn.classList.remove('pvzx-miss');
          }, 150);
        }
      });
      area.appendChild(label);
      area.appendChild(el('div.pvzx-scene-plant.pvzx-dance', null, [plantPic(p)]));
      area.appendChild(lane);
      area.appendChild(btn);
      (function frame(now) {
        if (!alive(area)) return;
        var w = lane.clientWidth || 300;
        notes.forEach(function (n) {
          var f = (now - n.t) / TRAVEL; // 0 at the right edge, 1 at the left
          if (f < 0 || n.gone) return;
          if (!n.node) {
            n.node = el('span.pvzx-note', { text: '🎵' });
            lane.appendChild(n.node);
          }
          n.x = w * (1 - f);
          n.node.style.left = n.x - 12 + 'px';
          if (f > 1.05) {
            n.gone = true;
            n.node.remove();
          }
        });
        if (notes.every(function (n) {
          return n.gone || (n.done && n.node);
        }) && now > notes[notes.length - 1].t + TRAVEL) return done(Math.min(20, Math.round(hits * 2.5)));
        requestAnimationFrame(frame);
      })(performance.now());
    },

    // A frame sweeps the stage; tap 📸 when it is centered (best of 3).
    photo: function (area, p, done) {
      var frameEl = el('div.pvzx-photo-frame');
      var label = el('div.pvzx-game-score', { text: '📸 3' });
      var tries = 3;
      var best = 0;
      var t0 = performance.now();
      var x = 0;
      var btn = el('button.pvzx-tap', { text: '📸' });
      area.appendChild(label);
      area.appendChild(el('div.pvzx-scene-plant', null, [plantPic(p)]));
      area.appendChild(frameEl);
      area.appendChild(btn);
      btn.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        if (tries <= 0) return;
        tries--;
        var w = area.clientWidth || 300;
        var amp = w * 0.28;
        var acc = Math.max(0, 1 - Math.abs(x) / amp);
        best = Math.max(best, acc);
        area.classList.add('pvzx-flash');
        setTimeout(function () {
          area.classList.remove('pvzx-flash');
        }, 180);
        label.textContent = '📸 ' + Math.round(acc * 100) + '% · ' + tries;
        if (!tries) setTimeout(function () {
          done(Math.round(best * 20));
        }, 600);
      });
      (function frame(now) {
        if (!alive(area) || tries <= 0) return;
        var w = area.clientWidth || 300;
        var speed = 2.2 + (3 - tries) * 0.6;
        x = Math.sin(((now - t0) / 1000) * speed) * w * 0.28;
        frameEl.style.transform = 'translateX(' + x + 'px)';
        requestAnimationFrame(frame);
      })(performance.now());
    },
  };
  I.DATE_GAMES = GAMES;
})();
