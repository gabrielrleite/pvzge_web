/*
 * PvZ2 Gardendless - Plant Match: dates as scenes.
 *
 * Inviting a match opens the date planner: where (6 places, some for
 * partners only), your look and a gift (some cost likes). The date is then
 * a scene on the phone: the place, the plant animated, a mood meter and her
 * lines. You can touch her (tap, pet, hold her leaf, tickle) and drag her
 * snacks; you answer twice (romantic, funny, sincere or bold: each
 * personality likes one style and dislikes another) and the talk branches
 * (a secret after a good answer, an apology after a bad one); two
 * mini-games (the place's own: sun shower, flying popcorn, sandcastle, latte
 * art, zombie shooting, build the plate; plus quiz, dance, photo or suns);
 * most dates have a surprise (a zombie raid, rain, a spill, her ex) to
 * answer fast; then free talk (she understands keywords) and goodbye. The final mood gives 0-3 stars: with a star the plant
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

  function placeLock(id, r, code) {
    var need = SC.places[id].need;
    if (need == null) return '';
    if (!r) return L(TXT.dateNeedPartner);
    if (I.relStage(r) < need) return L(TXT.dateNeed, { stage: I.stageLabel(need) });
    if (id === 'proposal') {
      if (r.married || (I.proposedTo && I.proposedTo(code))) return L(SC.prog.proposed);
      if (!(I.hasRing && I.hasRing())) return L(SC.prog.needRing);
    }
    return '';
  }

  // Texts of a place with the world of the trip filled in.
  function placeVars(s) {
    return s && s.world ? { world: L(s.world), icon: s.world.icon } : {};
  }

  /* --------------------------------------------------------- the planner */

  I.plan = null;

  I.datePicker = function datePicker(p) {
    var r = I.partners()[p.code];
    if (!I.plan || I.plan.code !== p.code) I.plan = { code: p.code, tab: 'scene', place: 'garden', look: 'casual', gift: '' };
    var plan = I.plan;
    var U = SC.ui;
    if (plan.inviting || plan.result) return inviteCard(p, plan);
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
    if (I.progBar) sheet.appendChild(I.progBar(plan));
    if (plan.tab === 'adventure') {
      sheet.appendChild(el('p.pvzx-small', { text: L(U.adventureDesc) }));
      return I.adventureList(p, sheet);
    }
    if (plan.tab === 'shop' && I.shopList) return I.shopList(sheet);
    if (plan.tab === 'missions' && I.missionList) return I.missionList(sheet);
    if (!(I.ownsLook ? I.ownsLook(plan.look) : SC.looks[plan.look])) plan.look = 'casual';
    if (plan.gift && I.ownsGift && !I.ownsGift(plan.gift)) plan.gift = '';
    sheet.appendChild(el('p.pvzx-small', { text: L(TXT.inviteDesc, { name: p.name }) }));
    sheet.appendChild(el('p.pvzx-small', { text: '✨ ' + L(U.games2) }));
    // 1. Where
    sheet.appendChild(el('h4', { text: L(U.where) }));
    Object.keys(SC.places).forEach(function (id) {
      var pl = SC.places[id];
      var lock = placeLock(id, r, p.code);
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
            el('span', { text: SC.games[pl.game].icon + ' ' + L(SC.games[pl.game]) + ' + 🎲' + (best ? ' · ' + L(TXT.dateBest, { stars: I.starsText(best) }) : '') }),
            el('small', { text: lock || L(U.hint, { who: who }) }),
          ]),
        ]),
      );
    });
    // 2. Look
    sheet.appendChild(el('h4', { text: L(U.look) }));
    sheet.appendChild(
      I.choiceChips(Object.keys(SC.looks).filter(function (v) {
        return I.ownsLook ? I.ownsLook(v) : !SC.looks[v].shop;
      }), plan.look, function (v) {
        plan.look = v;
        I.render();
      }, function (v) {
        return SC.looks[v].icon + ' ' + L(SC.looks[v]);
      }),
    );
    // 3. Gift
    sheet.appendChild(el('h4', { text: L(U.gift) + ' (♥ ' + I.likesLeft() + ')' }));
    sheet.appendChild(
      I.choiceChips([''].concat(Object.keys(SC.gifts).filter(function (v) {
        return I.ownsGift ? I.ownsGift(v) : !SC.gifts[v].shop;
      })), plan.gift, function (v) {
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
        el('button.mp-btn.mp-green', { text: L(U.go), disabled: tired || !!maxLock || !!placeLock(plan.place, r, p.code), onclick: function () {
          I.inviteDate(p, plan);
        } }),
      ]),
    );
    return sheet;
  };

  /* ------------------------------------------------------- the invite */

  // She may say no: it depends on how the chat went, the place, whether she
  // liked you first, her personality and the relationship.
  function acceptChance(p, place) {
    var r = I.partners()[p.code];
    var c = I.chats[p.code];
    var sess = c && c.s;
    if (sess && sess.ghost) return { p: 0, why: 'ghost' };
    var feel = placeFeel(p, place);
    if (r) return { p: [0.85, 0.93, 0.97, 0.99][I.relStage(r)] - (feel === 'hate' ? 0.15 : 0), why: feel === 'hate' ? 'place' : 'busy' };
    var aff = sess ? sess.affinity : 0;
    var pr = 0.5 + aff * 0.13 + (p.likedYou ? 0.1 : 0) + (feel === 'love' ? 0.1 : feel === 'hate' ? -0.2 : 0) - (persOf(p) === 'shy' ? 0.1 : 0);
    return { p: Math.max(0.05, Math.min(0.97, pr)), why: feel === 'hate' ? 'place' : aff === 0 && !(sess && sess.done) ? 'tooSoon' : 'busy' };
  }

  I.inviteDate = function inviteDate(p, plan) {
    plan.inviting = true;
    plan.result = null;
    I.render();
    var ch = acceptChance(p, plan.place);
    setTimeout(function () {
      if (I.plan !== plan) return;
      plan.inviting = false;
      var R = SC.reject;
      if (Math.random() < ch.p) {
        plan.result = { ok: true, text: I.gfix(Lp(R.accepted), p.gender) };
        I.render();
        setTimeout(function () {
          if (I.plan !== plan) return;
          plan.result = null;
          I.startScene(p, plan.place, plan.look, plan.gift);
        }, 1100);
      } else {
        countDate(p.code);
        var text =
          ch.why === 'ghost'
            ? ''
            : I.gfix(Lp(ch.why === 'place' ? R.place : ch.why === 'tooSoon' ? R.tooSoon : R.busy, { place: L(SC.places[plan.place].name) }), p.gender);
        if (text) I.pushMsg(p.code, 'them', text);
        else I.pushMsg(p.code, 'sys', L(R.seenNoReply, { name: p.name }));
        plan.result = { ok: false, text: text || L(R.seenNoReply, { name: p.name }) };
        I.render();
      }
    }, 1600 + Math.random() * 900);
  };

  function inviteCard(p, plan) {
    var R = SC.reject;
    var res = plan.result;
    var kids = [
      el('div.pvzx-invite-pic' + (res && !res.ok ? '.pvzx-a-away' : res ? '.pvzx-a-happy' : ''), null, [p.photos && p.photos.idle ? I.animImg(p.photos.idle) : el('img', { src: p.packet, alt: '' })]),
      el('b', { text: p.name }),
      el('div.pvzx-bubble.pvzx-from-me', { text: '💐 ' + L(SC.places[plan.place].name) + ' ?' }),
    ];
    if (!res) kids.push(el('div.pvzx-bubble.pvzx-from-them.pvzx-typing', { text: L(R.sending) + ' ' + L(TXT.typing) }));
    else kids.push(el('div.pvzx-bubble.pvzx-from-them', { text: res.text }));
    if (res && !res.ok) {
      kids.push(el('p.pvzx-seek', { text: L(R.refused, { name: p.name }) }));
      var left = datesToday(p.code) < DATES_PER_DAY;
      kids.push(
        el('div.pvzx-file-actions', null, [
          left
            ? btn('mp-btn.mp-small.mp-blue', L(R.tryOther), function () {
                plan.result = null;
                I.render();
              })
            : null,
          btn('mp-btn.mp-small.mp-brown', L(SC.ui.back), function () {
            plan.result = null;
            I.view.datePick = null;
            I.render();
          }),
        ]),
      );
    }
    return el('div.pvzx-mview.pvzx-dates.pvzx-invite', null, kids);
  }

  /* ----------------------------------------------------------- the scene */

  // Steps of a date: arrive, beat1, branch (a secret or an apology), game 1
  // (the place's), a surprise event (most dates), beat2, game 2 (another),
  // free talk, goodbye, result. She can be touched and fed between steps.
  I.scene = null;
  I.sceneEl = null;

  var SECOND_GAMES = ['quiz', 'rhythm', 'photo'];
  // Surprises that fit each place (no zombie raid in the movies).
  var EVENTS_AT = {
    garden: ['zombie', 'rain', 'ex'],
    cinema: ['spill', 'ex'],
    beach: ['zombie', 'rain', 'ex'],
    dinner: ['spill', 'ex'],
    park: ['zombie', 'rain', 'spill', 'ex'],
    cafe: ['rain', 'spill', 'ex'],
    aquarium: ['spill', 'ex'],
    festival: ['zombie', 'rain', 'spill', 'ex'],
    museum: ['spill', 'ex'],
    trip: ['zombie', 'rain', 'ex'],
    proposal: ['rain'],
    honeymoon: ['rain', 'zombie'],
  };
  // Looks from the shop each personality loves.
  var PLOOK_SHOP = { sweet: 'necklace', shy: 'scarf', sassy: 'crown', nerd: 'scarf', brave: 'mask', drama: 'crown' };
  // Gifts each personality dislikes (she gives them back).
  var PGIFT_HATE = { sweet: 'book', shy: 'choc', sassy: 'water', nerd: 'plush', brave: 'flowers', drama: 'water' };
  var PTOUCH = {
    sweet: { love: 'pet', hate: 'tickle' },
    shy: { love: 'hold', hate: 'tickle' },
    sassy: { love: 'tickle', hate: 'pet' },
    nerd: { love: 'hold', hate: 'tickle' },
    brave: { love: 'tickle', hate: 'hold' },
    drama: { love: 'hold', hate: 'poke' },
  };

  function snackFav(p) {
    if (p.roles && p.roles.sun) return 'sunbit';
    if (p.family === 'Cold' || p.family === 'Poison') return 'dew';
    return 'cookie';
  }

  function sfx(name) {
    if (I.sfx) I.sfx(name);
  }

  // A real pose of the plant for a moment (attack, food, water…), when the
  // photo shoot got it.
  function posePlay(s, name, ms) {
    var p = s.p;
    if (!(p.photos && p.photos[name])) return;
    s.pose = name;
    clearTimeout(s.poseTimer);
    s.poseTimer = setTimeout(function () {
      if (I.scene !== s || s.pose !== name) return;
      s.pose = 'idle';
      if (!s.playing) I.sceneRender();
    }, ms || 1500);
  }

  function say(s, text, from) {
    s.lines.push({ from: from || 'them', text: I.gfix(text, s.p.gender) });
  }

  I.startScene = function startScene(p, place, look, gift) {
    if (gift && SC.gifts[gift].cost) I.useLike(SC.gifts[gift].cost);
    countDate(p.code);
    I.view.datePick = null;
    var pl = SC.places[place];
    var second = shuffle(
      SECOND_GAMES.filter(function (g) {
        return g !== pl.game;
      }),
    )[0];
    var event = Math.random() < 0.75 ? pick(EVENTS_AT[place] || ['ex']) : null;
    var steps = ['arrive', 'beat1', 'branch', 'game0', 'event', 'beat2', 'game1', 'talk', 'end', 'result'].filter(function (st) {
      return st !== 'event' || event;
    });
    var world = null;
    if (place === 'trip' && SC.worlds) {
      var wid = pick(Object.keys(SC.worlds));
      world = Object.assign({ id: wid }, SC.worlds[wid]);
    }
    var s = (I.scene = {
      world: world,
      p: p, place: place, look: look, gift: gift, mood: 30, steps: steps, pos: 0, step: 'arrive', sub: null,
      hl: [], lines: [], chat: 0, games: [pl.game, second], gamePts: [], event: event,
      touches: {}, touchTotal: 0, touchScore: 0, snacks: 0, taps: [], pose: 'idle',
      talkCount: 0, talkScore: 0, talkSeen: {},
    });
    var pers = persOf(p);
    say(s, L(pl.arrive, placeVars(s)));
    var feel = placeFeel(p, place);
    if (feel === 'love') {
      mood(15);
      say(s, L(SC.react.placeLove));
      s.hl.push(L(SC.hl.placeLove, { icon: pl.icon }));
    } else if (feel === 'hate') {
      mood(-10);
      say(s, L(SC.react.placeHate));
      s.hl.push(L(SC.hl.placeHate, { icon: pl.icon }));
    } else {
      mood(5);
      s.hl.push(L(SC.hl.placeOk, { icon: pl.icon }));
    }
    var lk = SC.looks[look];
    if (PLOOK_SHOP[pers] === look) {
      mood(14);
      say(s, L(SC.react.lookLove, { look: low(L(lk)) }));
      s.hl.push(L(SC.hl.lookLove, { icon: lk.icon }));
    } else if (PLOOK[pers].good === look) {
      mood(10);
      say(s, L(SC.react.lookLove, { look: low(L(lk)) }));
      s.hl.push(L(SC.hl.lookLove, { icon: lk.icon }));
    } else if (PLOOK[pers].bad === look) {
      mood(-5);
      say(s, L(SC.react.lookHate, { look: low(L(lk)) }));
      s.hl.push(L(SC.hl.lookHate, { icon: lk.icon }));
    }
    var lovesGifts = p.love === 'gifts';
    if (gift) {
      var g = SC.gifts[gift];
      say(s, g.icon + ' ' + L(g), 'me');
      if (PGIFT_HATE[pers] === gift && favGift(p) !== gift) {
        mood(-8);
        say(s, L(SC.reject.giftHate, { gift: low(L(g)) }));
        s.hl.push(L(SC.reject.giftHateHl, { icon: g.icon }));
        s.giftBack = g.icon;
      } else if (favGift(p) === gift || (g.loves && g.loves.indexOf(pers) >= 0)) {
        mood(12 + (lovesGifts ? 5 : 0));
        say(s, L(SC.react.giftLove, { gift: low(L(g)) }));
        s.hl.push(L(SC.hl.giftLove, { icon: g.icon }));
      } else {
        mood(5 + (lovesGifts ? 5 : 0));
        say(s, L(SC.react.giftOk));
        s.hl.push(L(SC.hl.giftOk, { icon: g.icon }));
      }
    } else if (lovesGifts) {
      mood(-8);
      s.hl.push(L(SC.hl.giftNone));
    }
    say(s, L(SC.ui.touchHint), 'sys');
    s.started = true;
    if (I.sceneMusic) I.sceneMusic(place, world && world.music);
    if (I.zombieWarm) I.zombieWarm();
    sfx('playWorldEnterWind');
    if (!I.sceneEl) I.sceneEl = el('div.pvzx-scene');
    if (I.node && I.sceneEl.parentNode !== I.node) I.node.appendChild(I.sceneEl);
    I.render();
    I.sceneRender();
  };

  // Mood changes show as a pop-up and a reaction of the plant (played after
  // the next render). Below 6 she walks out.
  function mood(n) {
    var s = I.scene;
    if (!s) return;
    s.mood = Math.max(0, Math.min(100, s.mood + n));
    if (!n) return;
    s.fx = s.fx || [];
    s.fx.push({ text: n > 0 ? '❤️ +' + n : '💔 ' + n, kind: n >= 6 ? 'happy' : n <= -5 ? 'angry' : n > 0 ? 'blush' : 'away' });
    if (s.mood <= 5 && !s.walking && s.step !== 'result' && s.started) walkout(s);
  }

  // She has had enough: says so, walks out of the scene and the date ends.
  function walkout(s) {
    s.walking = true;
    s.hl.push(L(SC.reject.walkoutHl));
    // After the reaction to what made her leave.
    setTimeout(function () {
      if (I.scene !== s) return;
      say(s, Lp(SC.reject.walkout));
      s.fx = (s.fx || []).concat([{ kind: 'walkout' }]);
      I.sceneRender();
    }, 60);
    setTimeout(function () {
      if (I.scene !== s) return;
      s.playing = false;
      finish(s, 'walkout');
      I.sceneRender();
    }, 1800);
  }

  // Reactions: classes on the plant and particles over it.
  var FX_PARTICLES = { happy: ['❤️', '💕', '✨'], blush: ['💗'], angry: ['💢', '💔'], away: ['💦'], walkout: ['💨', '👋'], slap: ['👋', '💥'], swoon: ['💖', '💞', '✨'] };
  var FX_SOUND = { happy: 'playPlantGrow', angry: 'playCardChooseFailed', walkout: 'playLevelTaskFail', slap: 'playArmorHitShield', swoon: 'playLevelTaskComplete', blush: 'playRhythmHit' };
  I.playFx = function playFx(s) {
    var box = I.sceneEl;
    if (!box || !s.fx || !s.fx.length) return;
    var plant = box.querySelector('.pvzx-scene-plant');
    s.fx.forEach(function (f, i) {
      setTimeout(function () {
        if (f.text) {
          var pop = el('div.pvzx-scene-fx', { text: f.text });
          box.appendChild(pop);
          setTimeout(function () {
            pop.remove();
          }, 1200);
        }
        if (f.kind) sfx(FX_SOUND[f.kind]);
        if (!plant || !f.kind) return;
        plant.classList.remove('pvzx-a-happy', 'pvzx-a-angry', 'pvzx-a-blush', 'pvzx-a-away', 'pvzx-a-swoon');
        void plant.offsetWidth;
        plant.classList.add('pvzx-a-' + f.kind);
        if (f.kind === 'slap') box.classList.add('pvzx-a-shake');
        setTimeout(function () {
          box.classList.remove('pvzx-a-shake');
        }, 500);
        var r = plant.getBoundingClientRect();
        var b = box.getBoundingClientRect();
        (FX_PARTICLES[f.kind] || []).forEach(function (emo, k) {
          for (var j = 0; j < 2; j++) {
            var pt = el('span.pvzx-particle', { text: emo });
            pt.style.left = r.left - b.left + r.width / 2 + 'px';
            pt.style.top = r.top - b.top + r.height * 0.3 + 'px';
            pt.style.setProperty('--dx', Math.round((Math.random() - 0.5) * 160) + 'px');
            pt.style.setProperty('--dy', -Math.round(60 + Math.random() * 90) + 'px');
            pt.style.animationDelay = (k * 2 + j) * 70 + 'ms';
            box.appendChild(pt);
            setTimeout(function () {
              pt.remove();
            }, 1500);
          }
        });
      }, i * 180);
    });
    s.fx = [];
  };

  // Moves to the next step and says what that step starts with.
  function next(s) {
    if (s.walking) return;
    s.pos++;
    s.step = s.steps[s.pos];
    s.sub = null;
    var p = s.p;
    var pl = SC.places[s.place];
    var r = I.partners()[p.code];
    if (s.step === 'beat1' || s.step === 'beat2') say(s, L(pl.beats[s.step === 'beat1' ? 0 : 1].line, placeVars(s)));
    else if (s.step === 'branch') {
      if (s.b1 === 'good') {
        var list = SC.branch.secrets[persOf(p)];
        s.secretIdx = ((r && r.secrets) || []).length % list.length;
        say(s, L(SC.branch.secretIntro, { secret: L(list[s.secretIdx]) }));
        s.branchKind = 'secret';
      } else if (s.b1 === 'bad') {
        say(s, L(SC.branch.coldIntro));
        s.branchKind = 'cold';
      } else return next(s);
    } else if (s.step === 'game0') say(s, L(SC.react.gameIntro));
    else if (s.step === 'event') {
      var ev = SC.events[s.event];
      var exName = X.plantName(pick(MP.allPlants()));
      say(s, ev.icon + ' ' + L(ev.line, { ex: exName, name: p.name }), 'sys');
      s.eventStart = Date.now();
      sfx({ zombie: 'playAwooga', rain: 'playSkyThunderSound', spill: 'playWaterSplash', ex: 'playZombieTooCloseWarn' }[s.event]);
      if (s.event === 'rain') posePlay(s, 'water', 2500);
    } else if (s.step === 'talk') say(s, L(SC.ui.talkTitle), 'sys');
    else if (s.step === 'end') say(s, L(s.place === 'proposal' ? SC.propose.endQ : SC.react.endQ));
    else if (s.step === 'result') finish(s, false);
    if (s.step === 'event' && s.event === 'rain') s.weather = 'rain';
    else if (s.step === 'beat2' || s.step === 'end') s.weather = '';
    walkTo(s);
    I.sceneRender();
  }

  function answerStyle(s, opt) {
    var pref = PSTYLE[persOf(s.p)];
    var P = PERS[persOf(s.p)];
    say(s, opt.text, 'me');
    var res;
    if (opt.style === pref.good) {
      mood(12);
      s.chat++;
      say(s, Lp(P.good));
      res = 'good';
    } else if (opt.style === pref.bad) {
      mood(-12);
      s.chat--;
      say(s, Lp(P.bad));
      res = 'bad';
    } else {
      mood(3);
      say(s, Lp(CHAT.react.meh));
      res = 'meh';
    }
    if (s.step === 'beat1') s.b1 = res;
    s.sub = 'done';
    I.sceneRender();
  }

  function answerBranch(s, o) {
    say(s, L(o), 'me');
    if (s.branchKind === 'secret') {
      if (o.k === 'share') {
        mood(10);
        s.secretShared = true;
        s.hl.push(L(SC.hl.secret));
        say(s, Lp(SC.events.good));
      } else if (o.k === 'joke') {
        mood(2);
        say(s, Lp(SC.events.meh));
      } else {
        mood(-8);
        say(s, Lp(SC.events.bad));
      }
    } else if (o.k === 'sorry') {
      mood(8);
      say(s, Lp(PERS[persOf(s.p)].good));
    } else if (o.k === 'joke') {
      mood(0);
      say(s, Lp(SC.events.meh));
    } else {
      mood(-10);
      say(s, Lp(PERS[persOf(s.p)].bad));
    }
    s.sub = 'done';
    I.sceneRender();
  }

  // Choices of the surprise events: [mood, 'good' | 'meh' | 'bad'].
  function eventEffect(s, k) {
    var pers = persOf(s.p);
    var fire = s.p.family === 'Fire';
    var bold = ['brave', 'drama', 'sassy'].indexOf(pers) >= 0;
    switch (k) {
      case 'share':
        return s.mood >= 50 ? [10, 'good'] : [4, 'meh'];
      case 'run':
        return fire ? [8, 'good'] : [2, 'meh'];
      case 'dance':
        return fire ? [-8, 'bad'] : bold ? [10, 'good'] : [-4, 'bad'];
      case 'laugh':
        return pers === 'sassy' || pers === 'brave' ? [8, 'good'] : [3, 'meh'];
      case 'clean':
        return pers === 'sweet' || pers === 'shy' || pers === 'nerd' ? [8, 'good'] : [3, 'meh'];
      case 'angry':
        return pers === 'sassy' ? [2, 'meh'] : [-10, 'bad'];
      case 'polite':
        return pers === 'drama' ? [2, 'meh'] : [6, 'good'];
      case 'claim':
        return s.mood >= 60 ? [10, 'good'] : [-6, 'bad'];
      case 'ignore':
        return pers === 'drama' ? [-6, 'bad'] : [3, 'meh'];
    }
    return [0, 'meh'];
  }

  function eventDone(s, delta, kind) {
    var ev = SC.events[s.event];
    mood(delta);
    if (kind !== 'slow') say(s, Lp(SC.events[kind]));
    s.hl.push(L(kind === 'good' ? SC.hl.eventGood : SC.hl.eventBad, { icon: ev.icon }));
    s.sub = 'done';
    I.sceneRender();
  }

  function answerEvent(s, o) {
    if (s.sub === 'done') return;
    clearTimeout(s.eventTimer);
    say(s, L(o), 'me');
    var e = eventEffect(s, o.k);
    eventDone(s, e[0], e[1]);
  }

  /* --------------------------------------------- touching the plant */

  I.touchPlant = function touchPlant(kind, snack) {
    var s = I.scene;
    if (!s || s.step === 'result' || s.walking) return;
    var p = s.p;
    var T = SC.touch;
    var pers = persOf(p);
    var pref = PTOUCH[pers];
    s.touchTotal++;
    var pose = function (name) {
      if (!(p.photos && p.photos[name])) return;
      s.pose = name;
      clearTimeout(s.poseTimer);
      s.poseTimer = setTimeout(function () {
        if (I.scene !== s) return;
        s.pose = 'idle';
        I.sceneRender();
      }, 1300);
    };
    if (kind === 'snack') {
      var sn = T.snacks[snack];
      say(s, sn.icon + ' ' + L(sn), 'me');
      s.snacks++;
      if (s.snacks > 2) {
        mood(-2);
        say(s, Lp(T.full));
      } else if (snack === snackFav(p)) {
        mood(6);
        s.touchScore++;
        say(s, Lp(T.snackLove));
        pose('food');
        if (I.progEvent) I.progEvent('snack');
      } else {
        mood(3);
        say(s, Lp(T.snackOk));
        pose('food');
      }
      return I.sceneRender();
    }
    var kd = T.kinds[kind];
    say(s, kd.icon + ' ' + L(kd), 'sys');
    if (s.touchTotal > 8) {
      mood(-3);
      s.touchScore--;
      say(s, Lp(T.tooMuch));
      return I.sceneRender();
    }
    var n = (s.touches[kind] = (s.touches[kind] || 0) + 1);
    var intimate = kind === 'pet' || kind === 'hold';
    if (intimate && s.mood < (pers === 'shy' ? 65 : 50)) {
      mood(-5);
      s.touchScore--;
      say(s, Lp(T.early));
    } else if (kind === pref.hate) {
      mood(-5);
      s.touchScore--;
      say(s, Lp(T.hate));
    } else if (n > 2) {
      say(s, Lp(T.ok));
    } else if (kind === pref.love) {
      mood(6);
      s.touchScore++;
      say(s, Lp(kind === 'tickle' ? T.tickle : T.love));
      pose(kind === 'tickle' ? 'attack' : 'idle');
    } else if (kind === 'poke') {
      mood(n === 1 ? 1 : -2);
      say(s, Lp(T.ok));
    } else {
      mood(3);
      say(s, Lp(kind === 'tickle' ? T.tickle : T.love));
      if (kind === 'tickle') pose('attack');
    }
    I.sceneRender();
  };

  // Gestures on the plant: tap (poke), 3 quick taps (tickle), drag (pet),
  // press and hold (hold her leaf).
  function attachTouch(node, s) {
    var start = null;
    node.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      start = { x: e.clientX, y: e.clientY, t: Date.now(), dist: 0, lx: e.clientX, ly: e.clientY };
      var move = function (ev) {
        if (!start) return;
        start.dist += Math.abs(ev.clientX - start.lx) + Math.abs(ev.clientY - start.ly);
        start.lx = ev.clientX;
        start.ly = ev.clientY;
      };
      var up = function () {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        if (!start) return;
        var dur = Date.now() - start.t;
        var dist = start.dist;
        start = null;
        if (dist > 80) return I.touchPlant('pet');
        if (dur > 600) return I.touchPlant('hold');
        var now = Date.now();
        s.taps = s.taps.filter(function (x) {
          return now - x < 900;
        });
        s.taps.push(now);
        clearTimeout(s.tapTimer);
        if (s.taps.length >= 3) {
          s.taps = [];
          return I.touchPlant('tickle');
        }
        s.tapTimer = setTimeout(function () {
          if (s.taps.length) {
            s.taps = [];
            I.touchPlant('poke');
          }
        }, 420);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    });
  }

  // Snacks dragged from the tray onto the plant.
  function snackTray(s, plantNode) {
    return el(
      'div.pvzx-snacks',
      null,
      Object.keys(SC.touch.snacks).map(function (k) {
        var sn = SC.touch.snacks[k];
        var b = el('button.pvzx-snack', { text: sn.icon, title: L(sn) });
        b.addEventListener('pointerdown', function (e) {
          e.preventDefault();
          var ghost = el('div.pvzx-snack-ghost', { text: sn.icon });
          document.body.appendChild(ghost);
          var place = function (ev) {
            ghost.style.left = ev.clientX - 20 + 'px';
            ghost.style.top = ev.clientY - 20 + 'px';
          };
          place(e);
          var up = function (ev) {
            window.removeEventListener('pointermove', place);
            window.removeEventListener('pointerup', up);
            ghost.remove();
            var r = plantNode.getBoundingClientRect();
            if (ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom) I.touchPlant('snack', k);
          };
          window.addEventListener('pointermove', place);
          window.addEventListener('pointerup', up);
        });
        return b;
      }),
    );
  }

  /* ---------------------------------------------------------- free talk */

  function norm(text) {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  }

  // What she understands of a free message: [category, vars].
  function classify(s, text) {
    var W = SC.talk.words;
    var tx = ' ' + norm(text) + ' ';
    var has = function (k) {
      return W[k].some(function (w) {
        return tx.indexOf(w) >= 0;
      });
    };
    var thing = (s.p.likes || []).find(function (x) {
      var n = norm(x);
      return n.length > 3 && tx.indexOf(n) >= 0;
    });
    if (has('insult')) return ['insult'];
    if (thing) return ['remember', { thing: thing.toLowerCase() }];
    if (has('compliment')) return ['compliment'];
    if (has('joke')) return ['joke'];
    if (has('age')) return ['age', { age: s.p.age || '?' }];
    if (has('sign')) return ['sign', { sign: L(TRAITS.signs[s.p.sign]) }];
    if (has('job')) return ['job', { job: I.gfix(L(s.p.job), s.p.gender).toLowerCase() }];
    if (has('like') && tx.indexOf('?') >= 0) return ['like', { likes: (s.p.likes || []).slice(0, 2).join(', ').toLowerCase() }];
    if (has('zombie')) return ['zombie'];
    if (has('food')) return ['food'];
    if (tx.indexOf('?') >= 0) return ['question'];
    if (has('hello')) return ['hello'];
    return ['other'];
  }

  function talkScore(s, cat) {
    var pers = persOf(s.p);
    switch (cat) {
      case 'insult':
        return -15;
      case 'remember':
        return 8;
      case 'compliment':
        return ['sweet', 'drama', 'shy'].indexOf(pers) >= 0 ? 7 : 4;
      case 'joke':
        return pers === 'sassy' || pers === 'brave' ? 6 : 2;
      case 'age':
      case 'sign':
      case 'job':
      case 'like':
        return 3;
      default:
        return cat === 'other' ? 1 : 2;
    }
  }

  function sendTalk(s, text) {
    text = String(text || '').trim().slice(0, 160);
    if (!text || s.talkCount >= 3 || s.talkWait) return;
    s.talkCount++;
    s.talkDraft = '';
    say(s, text, 'me');
    var c = classify(s, text);
    var cat = c[0];
    var repeated = s.talkSeen[cat] && cat !== 'insult';
    s.talkSeen[cat] = true;
    var delta = repeated ? 0 : talkScore(s, cat);
    s.talkWait = true;
    s.typing = true;
    I.sceneRender();
    setTimeout(function () {
      if (I.scene !== s) return;
      s.talkWait = false;
      s.typing = false;
      mood(delta);
      s.talkScore += delta;
      say(s, Lp(SC.talk.reply[repeated ? 'repeat' : cat], c[1]));
      I.sceneRender();
    }, 700 + Math.random() * 700);
  }

  /* ------------------------------------------------------------ ending */

  // The proposal: a yes needs a good date; a no keeps the ring.
  function propose(s) {
    var PR = SC.propose;
    say(s, L(PR.kneel), 'me');
    if (s.mood >= 55) {
      mood(10);
      say(s, L(PR.yes));
      s.hl.push(L(PR.hlYes));
      s.zoom = true;
      s.proposedOk = true;
      posePlay(s, 'food', 3000);
      s.fx = (s.fx || []).concat([{ kind: 'swoon' }, { kind: 'happy' }]);
    } else {
      mood(-10);
      say(s, L(PR.no));
      s.hl.push(L(PR.hlNo));
    }
    s.sub = 'done';
    I.sceneRender();
  }

  function goodbye(s, kind) {
    if (kind === 'propose') return propose(s);
    var R = SC.react;
    say(s, L(kind === 'kiss' ? R.endKiss : kind === 'hug' ? R.endHug : R.endShake), 'me');
    var high = s.mood >= 70;
    var reply;
    if (kind === 'kiss') {
      if (high) {
        mood(6);
        reply = R.endKissYes;
        s.zoom = true;
        if (I.progEvent) I.progEvent('kiss');
        posePlay(s, 'food', 2600);
        s.fx = (s.fx || []).concat([{ kind: 'swoon' }]);
      } else if (s.mood < 40) {
        // Way too soon: a slap.
        mood(-10);
        reply = SC.reject.slap;
        posePlay(s, 'attack', 1200);
        s.fx = (s.fx || []).concat([{ kind: 'slap' }]);
      } else {
        mood(-8);
        reply = R.endKissNo;
      }
    } else if (kind === 'hug') {
      if (s.mood < 30) {
        mood(-3);
        reply = SC.reject.dodge;
      } else {
        mood(s.mood >= 45 ? 4 : -2);
        reply = R.endHugYes;
      }
    } else {
      mood(high ? -4 : 2);
      reply = high ? R.endShakeHigh : R.endShakeLow;
    }
    say(s, L(reply));
    s.hl.push(L(SC.hl.end, { txt: L(kind === 'kiss' ? R.endKiss : kind === 'hug' ? R.endHug : R.endShake) }));
    s.sub = 'done';
    I.sceneRender();
  }

  function starsOf(m) {
    return m >= 85 ? 3 : m >= 65 ? 2 : m >= 45 ? 1 : 0;
  }

  function finish(s, quit) {
    if (s.step === 'result' && s.stars != null) return;
    var p = s.p;
    var stars = quit ? 0 : starsOf(s.mood);
    s.stars = stars;
    s.step = 'result';
    if (!quit) sfx(stars > 0 ? 'playLevelNodeFinish' : 'playLevelTaskFail');
    if (s.chat > 0) s.hl.push(L(SC.hl.chatGood));
    else if (s.chat < 0) s.hl.push(L(SC.hl.chatBad));
    if (s.touchScore > 0) s.hl.push(L(SC.hl.touchGood));
    else if (s.touchScore < 0) s.hl.push(L(SC.hl.touchBad));
    if (s.talkCount) s.hl.push(L(s.talkScore > 0 ? SC.hl.talkGood : SC.hl.talkBad));
    if (stars > 0) {
      var pts = s.gamePts.reduce(function (a, b) {
        return a + b;
      }, 0);
      s.fresh = I.dateSuccess(p.code, s.place, stars, false, { place: s.place, stars: stars, at: Date.now(), game: pts, world: s.world ? s.world.id : undefined });
      if (I.progEvent) {
        s.tickets = I.progEvent('date', { place: s.place, stars: stars });
        if (s.talkCount && s.talkScore > 0) I.progEvent('talk');
      }
      if (s.proposedOk && I.acceptProposal) {
        I.acceptProposal(p.code);
        I.later(p.code, L(SC.propose.msg), 5000);
      }
      if (s.secretShared) {
        var ps = I.partners();
        var r = ps[p.code];
        if (r) {
          r.secrets = (r.secrets || []).concat([{ pers: persOf(p), i: s.secretIdx }]).slice(-9);
          I.savePartners(ps);
        }
      }
      I.later(p.code, Lp(CHAT.dateWonMsg), 4000 + Math.random() * 6000);
    } else {
      I.later(p.code, Lp(CHAT.dateLostMsg), 4000 + Math.random() * 6000);
      var rr = I.partners()[p.code];
      if (quit === 'walkout' && rr) I.addXp(p.code, -2);
      else if (quit && rr && I.relStage(rr) >= 1) I.addXp(p.code, -1);
      // A bad first date can end the match.
      if (!rr && (quit === 'walkout' || Math.random() < 0.5)) {
        s.unmatched = true;
        if (I.round) {
          var at = I.round.matches.indexOf(p);
          if (at < 0) at = I.round.matches.findIndex(function (m) {
            return m.code === p.code;
          });
          if (at >= 0) I.round.matches.splice(at, 1);
        }
        I.later(p.code, L(SC.reject.unmatched, { name: p.name }), 6000, '', 'sys');
      }
    }
    I.flushStats();
  }

  // The secrets a partner told you (Partners tab, profile).
  I.secretsOf = function secretsOf(r, gender) {
    return (r.secrets || []).map(function (x) {
      var list = SC.branch.secrets[x.pers] || [];
      return list[x.i] ? I.gfix(L(list[x.i]), gender) : '';
    }).filter(Boolean);
  };

  I.closeScene = function closeScene() {
    var s = I.scene;
    if (s) {
      clearTimeout(s.eventTimer);
      clearTimeout(s.poseTimer);
      clearTimeout(s.tapTimer);
    }
    I.scene = null;
    if (I.sceneMusic) I.sceneMusic(null);
    if (I.sceneEl) I.sceneEl.remove();
    I.sceneEl = null;
    I.render();
  };

  function plantPic(p, pose) {
    if (pose && pose !== 'idle' && p.photos && p.photos[pose]) return el('img', { src: p.photos[pose], alt: '' });
    return p.photos && p.photos.idle ? I.animImg(p.photos.idle) : el('img', { src: p.packet, alt: '' });
  }

  function btn(cls, text, fn) {
    return el('button.' + cls, { text: text, onclick: fn });
  }

  // The illustrated place (one canvas per date, kept between redraws).
  function sceneArt(s) {
    if (!I.sceneArt) return el('div.pvzx-scene-deco', { text: SC.places[s.place].deco });
    if (!s.art) {
      s.art = I.sceneArt(s.place, { landmark: s.world && s.world.icon, alive: function () {
        return I.scene === s;
      } });
    }
    return s.art;
  }

  // Between steps the two of you walk a little: the scene scrolls and both
  // bob; the new step's talk and choices fade in after it.
  var WALK_STEPS = { beat1: 1, game0: 1, beat2: 1, talk: 1, end: 1 };
  function walkTo(s) {
    if (!WALK_STEPS[s.step] || !I.artWalk) return;
    I.artWalk(1300);
    s.walkFx = Date.now() + 1300;
    sfx('playCameraMove');
  }

  I.sceneRender = function sceneRender() {
    var s = I.scene;
    var box = I.sceneEl;
    if (!s || !box) return;
    var p = s.p;
    var pl = SC.places[s.place];
    var U = SC.ui;
    box.style.background = pl.bg;
    if (s.step === 'result') {
      box.replaceChildren(resultView(s));
      return;
    }
    var meter = el('div.pvzx-scene-top', null, [
      el('span', { text: pl.icon + ' ' + L(pl.name) }),
      el('div.pvzx-mood', { title: L(U.mood) }, [el('i', { style: 'width:' + s.mood + '%' }), el('b', { text: '❤️ ' + s.mood })]),
      btn('pvzx-x', '×', function () {
        if (!window.confirm(L(U.quitAsk))) return;
        finish(s, true);
        I.sceneRender();
      }),
    ]);
    var stage;
    var actions = el('div.pvzx-scene-actions' + (s.walking ? '.pvzx-off' : ''));
    var next1 = function () {
      actions.appendChild(btn('mp-btn.mp-green', L(U.next), function () {
        next(s);
      }));
    };
    var gameIdx = s.step === 'game0' ? 0 : s.step === 'game1' ? 1 : -1;
    if (s.playing) stage = s.gameEl;
    else {
      var plantNode = el('div.pvzx-scene-plant.pvzx-touchable', null, [plantPic(p, s.pose)]);
      attachTouch(plantNode, s);
      stage = el('div.pvzx-scene-stage', null, [
        sceneArt(s),
        plantNode,
        el('div.pvzx-scene-you', { text: '🧑‍🌾' + SC.looks[s.look].icon + (s.gift ? SC.gifts[s.gift].icon : '') }),
        snackTray(s, plantNode),
      ]);
    }
    if (s.step === 'arrive') next1();
    else if (s.step === 'beat1' || s.step === 'beat2') {
      if (s.sub === 'done') next1();
      else {
        var beat = pl.beats[s.step === 'beat1' ? 0 : 1];
        if (s.optsFor !== s.step) {
          s.optsFor = s.step;
          s.opts = shuffle(STYLES.slice()).slice(0, 3);
        }
        s.opts.forEach(function (style) {
          var text = I.gfix(L(beat[style]), p.gender);
          actions.appendChild(btn('pvzx-chat-opt', text, function () {
            answerStyle(s, { style: style, text: text });
          }));
        });
      }
    } else if (s.step === 'branch') {
      if (s.sub === 'done') next1();
      else {
        (s.branchKind === 'secret' ? SC.branch.secretOpts : SC.branch.coldOpts).forEach(function (o) {
          actions.appendChild(btn('pvzx-chat-opt', I.gfix(L(o), p.gender), function () {
            answerBranch(s, o);
          }));
        });
      }
    } else if (gameIdx >= 0) {
      var gid = s.games[gameIdx];
      var g = SC.games[gid];
      if (s.gamePts[gameIdx] != null) next1();
      else if (!s.playing) {
        actions.appendChild(el('div.pvzx-bubble.pvzx-from-sys', { text: g.icon + ' ' + L(g) + ': ' + L(g.how, { name: p.name }) }));
        actions.appendChild(btn('mp-btn.mp-green', g.icon + ' ' + L(U.play), function () {
          s.playing = true;
          s.gameEl = el('div.pvzx-scene-stage.pvzx-game');
          I.sceneRender();
          GAMES[gid](s.gameEl, p, function (points) {
            if (I.scene !== s || s.walking) return;
            s.playing = false;
            s.gamePts[gameIdx] = points;
            mood(Math.round(points));
            s.hl.push(L(SC.hl.game, { icon: g.icon, game: L(g), n: points }));
            say(s, L(points >= 12 ? SC.react.gameGood : SC.react.gameMeh));
            if (points >= 12) {
              sfx('playLevelTaskComplete');
              posePlay(s, 'food', 1800);
            }
            if (I.progEvent) I.progEvent('game', points);
            I.sceneRender();
          }, ctxOf(s));
        }));
      }
    } else if (s.step === 'event') {
      var ev = SC.events[s.event];
      if (s.sub === 'done') next1();
      else if (s.event === 'zombie') {
        if (!s.playing) {
          actions.appendChild(el('div.pvzx-bubble.pvzx-from-sys', { text: L(ev.how) }));
          actions.appendChild(btn('mp-btn.mp-red', '🧟 ' + L(U.hurry), function () {
            s.playing = true;
            s.gameEl = el('div.pvzx-scene-stage.pvzx-game');
            I.sceneRender();
            zombieRaid(s.gameEl, p, function (won) {
              if (I.scene !== s) return;
              s.playing = false;
              say(s, L(won ? ev.win : ev.lose));
              if (won) posePlay(s, 'attack', 1600);
              eventDone(s, won ? 10 : -8, won ? 'good' : 'bad');
            });
          }));
        }
      } else {
        // A choice against the clock (6 s).
        var left = Math.max(0, 6000 - (Date.now() - s.eventStart));
        actions.appendChild(el('div.pvzx-timer', null, [el('i', { style: 'animation-duration:' + left + 'ms' })]));
        ev.opts.forEach(function (o) {
          actions.appendChild(btn('pvzx-chat-opt', I.gfix(L(o), p.gender), function () {
            answerEvent(s, o);
          }));
        });
        clearTimeout(s.eventTimer);
        s.eventTimer = setTimeout(function () {
          if (I.scene !== s || s.sub === 'done') return;
          say(s, Lp(SC.events.slow));
          eventDone(s, -5, 'slow');
        }, left);
      }
    } else if (s.step === 'talk') {
      if (s.talkCount < 3) {
        var input = el('input.pvzx-input', { type: 'text', maxlength: 160, placeholder: L(U.talkPh), 'data-keep': 'talk', enterkeyhint: 'send' });
        input.value = s.talkDraft || '';
        input.addEventListener('input', function () {
          s.talkDraft = input.value;
        });
        input.addEventListener('keydown', function (e) {
          e.stopPropagation();
          if (e.key === 'Enter') {
            e.preventDefault();
            s.refocus = true;
            sendTalk(s, input.value);
          }
        });
        actions.appendChild(
          el('div.pvzx-pm-foot.pvzx-talk', null, [
            input,
            btn('mp-btn.mp-small.mp-green', '➤', function () {
              s.refocus = true;
              sendTalk(s, input.value);
            }),
          ]),
        );
        if (s.refocus) {
          setTimeout(function () {
            input.focus();
          }, 0);
        }
      }
      actions.appendChild(btn('mp-btn.mp-small.mp-brown', L(U.talkEnd) + ' (' + s.talkCount + '/3)', function () {
        s.refocus = false;
        next(s);
      }));
    } else if (s.step === 'end') {
      if (s.sub === 'done') next1();
      else {
        var ends = [['kiss', SC.react.endKiss], ['hug', SC.react.endHug], ['shake', SC.react.endShake]];
        if (s.place === 'proposal') ends = [['propose', SC.propose.kneel], ['hug', SC.propose.wait]];
        ends.forEach(function (k) {
          actions.appendChild(btn('pvzx-chat-opt', L(k[1]), function () {
            goodbye(s, k[0]);
          }));
        });
      }
    }
    var talk = el('div.pvzx-scene-talk');
    talk.addEventListener('wheel', function (e) {
      e.stopPropagation();
    });
    s.lines.slice(-6).forEach(function (m) {
      talk.appendChild(el('div.pvzx-bubble.pvzx-from-' + m.from, { text: m.text }));
    });
    if (s.typing) talk.appendChild(el('div.pvzx-bubble.pvzx-from-them.pvzx-typing', { text: L(TXT.typing) }));
    box.replaceChildren(meter, stage, talk, actions);
    box.classList.toggle('pvzx-playing', !!s.playing);
    var walking = !s.playing && s.walkFx && Date.now() < s.walkFx;
    stage.classList.toggle('pvzx-walking', !!walking);
    if (walking) {
      actions.classList.add('pvzx-late');
      clearTimeout(s.walkTimer);
      s.walkTimer = setTimeout(function () {
        if (stage.isConnected) stage.classList.remove('pvzx-walking');
      }, s.walkFx - Date.now());
    }
    if (s.zoom && !s.playing) stage.classList.add('pvzx-zoom');
    setTimeout(function () {
      talk.scrollTop = talk.scrollHeight;
    }, 0);
    // She walks in at the start; reactions queued by the last action play now.
    if (!s.entered && !s.playing) {
      s.entered = true;
      var pn = box.querySelector('.pvzx-scene-plant');
      if (pn) pn.classList.add('pvzx-a-enter');
      if (s.giftBack) {
        var gb = el('span.pvzx-giftback', { text: s.giftBack });
        box.appendChild(gb);
        setTimeout(function () {
          gb.remove();
        }, 1600);
      }
    }
    if (!s.playing) I.playFx(s);
  };

  // What a mini-game can use from the scene: the mood (some moments depend on
  // it), a line in the talk and an immediate reaction.
  function ctxOf(s) {
    return {
      s: s,
      mood: function () {
        return s.mood;
      },
      pers: persOf(s.p),
      say: function (text, from) {
        say(s, text, from);
      },
    };
  }

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
          return el('li', { text: I.gfix(h, s.p.gender) });
        }),
      ),
      s.fresh ? el('p.pvzx-good', { text: L(TXT.dateWon, { name: s.p.name }) }) : null,
      s.tickets ? el('p.pvzx-good', { text: L(SC.prog.won, { n: s.tickets }) }) : null,
      s.unmatched ? el('p.pvzx-seek', { text: L(SC.reject.unmatched, { name: s.p.name }) }) : null,
      btn('mp-btn.mp-green', L(U.back), I.closeScene),
    ]);
  }

  // The zombie event: 3 zombies walk to her; 3 taps each stop them.
  function zombieRaid(area, p, done) {
    var plant = el('div.pvzx-scene-plant.pvzx-raid-plant', null, [plantPic(p)]);
    area.appendChild(plant);
    var zs = [];
    var t0 = performance.now();
    var prev = t0;
    var over = false;
    [0, 1300, 2600].forEach(function (delay, i) {
      zs.push({ at: t0 + delay, hp: 3, x: null, row: i });
    });
    (function frame(now) {
      if (!alive(area) || over) return;
      var dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      var w = area.clientWidth || 300;
      var goal = w * 0.28;
      zs.forEach(function (z) {
        if (now < z.at || z.hp <= 0) return;
        if (!z.node) {
          z.x = w - 10;
          z.node = el('button.pvzx-zombie', { style: 'top:' + (18 + z.row * 22) + '%' });
          if (I.zombieArt) I.zombieArt(['tutorial', 'tutorial_armor1', 'tutorial_armor2'][z.row % 3], z.node);
          else z.node.textContent = '🧟';
          z.node.addEventListener('pointerdown', function (e) {
            e.preventDefault();
            sfx(z.hp > 1 ? 'playArmorHitPlastic' : 'playZombieLimbPop');
            z.hp--;
            z.node.classList.add('pvzx-hit');
            setTimeout(function () {
              if (z.node) z.node.classList.remove('pvzx-hit');
            }, 120);
            if (z.hp <= 0) {
              z.node.classList.add('pvzx-pop');
              setTimeout(function () {
                z.node.remove();
              }, 200);
            }
          });
          area.appendChild(z.node);
        }
        z.x -= 48 * dt;
        z.node.style.left = z.x + 'px';
        if (z.x <= goal) {
          over = true;
          done(false);
        }
      });
      if (!over && zs.every(function (z) {
        return z.hp <= 0;
      })) {
        over = true;
        return done(true);
      }
      requestAnimationFrame(frame);
    })(t0);
  }

  /* --------------------------------------------------------- mini-games */

  function alive(node) {
    return !!(node && node.isConnected && I.scene);
  }

  var GAMES = {
    // Popcorn jumps out of the bucket in arcs; tap it before it lands (2 each).
    popcorn: function (area, p, done) {
      var label = el('div.pvzx-game-score', { text: L(SC.ui.score, { n: 0 }) });
      var bucket = el('div.pvzx-bucket', { text: '🍿' });
      area.appendChild(label);
      area.appendChild(bucket);
      var caught = 0;
      var pops = [];
      var end = Date.now() + 12000;
      var last = 0;
      var prev = performance.now();
      (function frame(now) {
        if (!alive(area)) return;
        var dt = Math.min(0.05, (now - prev) / 1000);
        prev = now;
        var w = area.clientWidth || 300;
        var h = area.clientHeight || 300;
        if (now - last > 430 && Date.now() < end) {
          last = now;
          var k = { x: w / 2 - 18, y: h - 70, vx: (Math.random() - 0.5) * 260, vy: -(330 + Math.random() * 200) };
          k.node = el('button.pvzx-kernel', { text: Math.random() < 0.15 ? '⭐' : '🍿' });
          k.star = k.node.textContent === '⭐';
          k.node.addEventListener('pointerdown', function (e) {
            e.preventDefault();
            if (k.done) return;
            k.done = true;
            caught += k.star ? 2 : 1;
            label.textContent = L(SC.ui.score, { n: caught * 2 });
            k.node.classList.add('pvzx-pop');
            setTimeout(function () {
              k.node.remove();
            }, 200);
          });
          area.appendChild(k.node);
          pops.push(k);
        }
        pops.forEach(function (k) {
          if (k.done) return;
          k.vy += 520 * dt;
          k.x += k.vx * dt;
          k.y += k.vy * dt;
          if (k.x < 0 || k.x > w - 36) k.vx = -k.vx;
          k.node.style.left = k.x + 'px';
          k.node.style.top = k.y + 'px';
          if (k.y > h) {
            k.done = true;
            k.node.remove();
          }
        });
        if (Date.now() >= end && pops.every(function (k) {
          return k.done;
        })) return done(Math.min(20, caught * 2));
        requestAnimationFrame(frame);
      })(prev);
    },

    // A sandcastle: each floor slides; tap to drop it on the one below. What
    // hangs over falls off; 6 floors, points by how much stays.
    sandcastle: function (area, p, done) {
      var label = el('div.pvzx-game-score', { text: '🏰 0/6' });
      area.appendChild(label);
      var w = area.clientWidth || 300;
      var H = 24;
      var floors = [];
      var base = { x: w * 0.2, w: w * 0.6 };
      var cur = null;
      var kept = 0;
      var dir = 1;
      var speed = 150;
      var baseNode = el('div.pvzx-sand.pvzx-sand-base', { style: 'left:' + base.x + 'px;width:' + base.w + 'px;bottom:8px' });
      area.appendChild(baseNode);
      function spawn() {
        var below = floors.length ? floors[floors.length - 1] : base;
        cur = { x: 0, w: below.w, node: el('div.pvzx-sand', { text: floors.length === 5 ? '🚩' : '' }) };
        cur.node.style.width = cur.w + 'px';
        cur.node.style.bottom = 8 + (floors.length + 1) * H + 'px';
        area.appendChild(cur.node);
      }
      var tap = el('button.pvzx-tap', { text: '⬇' });
      tap.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        if (!cur) return;
        var below = floors.length ? floors[floors.length - 1] : base;
        var left = Math.max(cur.x, below.x);
        var right = Math.min(cur.x + cur.w, below.x + below.w);
        var ow = right - left;
        if (ow <= 4) {
          cur.node.classList.add('pvzx-pop');
          cur = null;
          return done(Math.round((kept / 6) * 20));
        }
        cur.x = left;
        cur.w = ow;
        cur.node.style.left = left + 'px';
        cur.node.style.width = ow + 'px';
        floors.push(cur);
        kept += ow / below.w;
        label.textContent = '🏰 ' + floors.length + '/6';
        cur = null;
        speed += 35;
        if (floors.length >= 6) return setTimeout(function () {
          done(Math.round((kept / 6) * 20));
        }, 400);
        spawn();
      });
      area.appendChild(tap);
      spawn();
      var prev = performance.now();
      (function frame(now) {
        if (!alive(area) || floors.length >= 6) return;
        var dt = Math.min(0.05, (now - prev) / 1000);
        prev = now;
        if (cur) {
          // A wave (x-match-games.js) shakes the floor and speeds it up.
          var wave = area.classList.contains('pvzx-waving');
          cur.x += dir * speed * (wave ? 1.5 : 1) * dt + (wave ? (Math.random() - 0.5) * 10 : 0);
          if (cur.x < 0) {
            cur.x = 0;
            dir = 1;
          } else if (cur.x + cur.w > w) {
            cur.x = w - cur.w;
            dir = -1;
          }
          cur.node.style.left = cur.x + 'px';
        }
        if (cur || floors.length < 6) requestAnimationFrame(frame);
      })(prev);
    },

    // Latte art: draw the dotted heart; points by how much of it you covered
    // and how little you drew outside it.
    latte: function (area, p, done) {
      var size = Math.min(area.clientWidth || 260, (area.clientHeight || 260) - 60, 260);
      var cv = el('canvas.pvzx-latte', { width: size, height: size });
      var ctx = cv.getContext('2d');
      var heart = [];
      for (var i = 0; i < 48; i++) {
        var a = (i / 48) * Math.PI * 2;
        var hx = 16 * Math.pow(Math.sin(a), 3);
        var hy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a));
        heart.push([size / 2 + hx * size * 0.024, size / 2 + hy * size * 0.024]);
      }
      var drawn = [];
      function paint() {
        ctx.clearRect(0, 0, size, size);
        ctx.fillStyle = '#6b3b1f';
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,240,220,0.45)';
        heart.forEach(function (pt) {
          ctx.beginPath();
          ctx.arc(pt[0], pt[1], 2.5, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      paint();
      var drawing = false;
      var lastPt = null;
      function pos(e) {
        var r = cv.getBoundingClientRect();
        return [((e.clientX - r.left) / r.width) * size, ((e.clientY - r.top) / r.height) * size];
      }
      cv.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        drawing = true;
        lastPt = pos(e);
        try {
          cv.setPointerCapture(e.pointerId);
        } catch (err) {}
      });
      cv.addEventListener('pointermove', function (e) {
        if (!drawing) return;
        var pt = pos(e);
        ctx.strokeStyle = '#fff3e0';
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(lastPt[0], lastPt[1]);
        ctx.lineTo(pt[0], pt[1]);
        ctx.stroke();
        drawn.push(pt);
        lastPt = pt;
      });
      cv.addEventListener('pointerup', function () {
        drawing = false;
      });
      var finished = false;
      function finish() {
        if (finished || !alive(area)) return;
        finished = true;
        var near = function (pt, list, d) {
          return list.some(function (q) {
            return Math.abs(q[0] - pt[0]) + Math.abs(q[1] - pt[1]) < d;
          });
        };
        var cover = heart.filter(function (pt) {
          return near(pt, drawn, size * 0.07);
        }).length / heart.length;
        var prec = drawn.length
          ? drawn.filter(function (pt) {
              return near(pt, heart, size * 0.09);
            }).length / drawn.length
          : 0;
        done(Math.round(20 * Math.min(1, cover * 0.7 + prec * 0.3 * (cover > 0.2 ? 1 : 0))));
      }
      area.appendChild(el('div.pvzx-game-score', { text: '☕ ' + L(SC.games.latte) }));
      area.appendChild(cv);
      area.appendChild(btn('mp-btn.mp-small.mp-green.pvzx-latte-done', L(SC.ui.done), finish));
      setTimeout(finish, 15000);
    },

    // Whack-a-zombie: zombies and sunflowers pop out of 9 holes for 14 s.
    targets: function (area, p, done) {
      var label = el('div.pvzx-game-score', { text: L(SC.ui.score, { n: 0 }) });
      var grid = el('div.pvzx-holes');
      var holes = [];
      for (var i = 0; i < 9; i++) {
        var hole = el('button.pvzx-hole');
        holes.push(hole);
        grid.appendChild(hole);
      }
      area.appendChild(label);
      area.appendChild(grid);
      var score = 0;
      var end = Date.now() + 14000;
      holes.forEach(function (h) {
        h.addEventListener('pointerdown', function (e) {
          e.preventDefault();
          if (!h.dataset.k) return;
          score += h.dataset.k === 'z' ? 2 : -2;
          label.textContent = L(SC.ui.score, { n: Math.max(0, score) });
          h.classList.add(h.dataset.k === 'z' ? 'pvzx-hit' : 'pvzx-miss');
          h.dataset.k = '';
          h.textContent = h.classList.contains('pvzx-hit') ? '💥' : '😢';
          setTimeout(function () {
            h.classList.remove('pvzx-hit');
            h.classList.remove('pvzx-miss');
            h.textContent = '';
          }, 250);
        });
      });
      (function tick() {
        if (!alive(area)) return;
        if (Date.now() >= end) return done(Math.max(0, Math.min(20, score)));
        var free = holes.filter(function (h) {
          return !h.dataset.k;
        });
        if (free.length) {
          var h = pick(free);
          var z = Math.random() < 0.72;
          h.dataset.k = z ? 'z' : 'f';
          h.textContent = z ? '🧟' : '🌻';
          setTimeout(function () {
            if (h.dataset.k) {
              h.dataset.k = '';
              h.textContent = '';
            }
          }, 850);
        }
        setTimeout(tick, 520);
      })();
    },

    // Build the plate: memorize her order, then tap it in the same order.
    plate: function (area, p, done) {
      var FOOD = ['🥗', '🍄', '🌽', '🍅', '🥕', '🧀'];
      var round = 0;
      var right = 0;
      var label = el('div.pvzx-game-score', { text: '1/3' });
      area.appendChild(label);
      var box = el('div.pvzx-quiz');
      area.appendChild(box);
      (function play() {
        if (!alive(area)) return;
        if (round >= 3) return done(Math.min(20, Math.round(right * 6.67)));
        label.textContent = round + 1 + '/3';
        var order = [];
        for (var i = 0; i < round + 2; i++) order.push(pick(FOOD));
        box.replaceChildren(el('b', { text: I.gfix(L(SC.ui.order, { items: order.join(' ') }), p.gender) }));
        setTimeout(function () {
          if (!alive(area)) return;
          var got = [];
          var shown = el('div.pvzx-plate', { text: '🍽' });
          box.replaceChildren(
            el('b', { text: L(SC.ui.yourTurn) }),
            shown,
            el(
              'div.pvzx-food',
              null,
              FOOD.map(function (f) {
                return btn('pvzx-food-btn', f, function () {
                  got.push(f);
                  shown.textContent = '🍽 ' + got.join(' ');
                  var ok = got[got.length - 1] === order[got.length - 1];
                  if (!ok || got.length === order.length) {
                    if (ok) right++;
                    shown.textContent += ok ? ' ✔' : ' ✘';
                    box.querySelectorAll('.pvzx-food-btn').forEach(function (b) {
                      b.disabled = true;
                    });
                    round++;
                    setTimeout(play, 800);
                  }
                });
              }),
            ),
          );
        }, 1400 + order.length * 450);
      })();
    },

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
