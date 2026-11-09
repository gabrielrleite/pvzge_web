/*
 * PvZ2 Gardendless - Plant Match: double dates with another player.
 *
 * From a player's profile you invite them with one of your partner plants
 * and a place; they answer with one of theirs. The server keeps both in
 * sync (/api/match/duo): the step you are both on moves when both have
 * acted. Steps: arrive (both ready), a first choice (same pick = in sync),
 * a co-op sun shower (scores added), a toast (in sync again) and the result,
 * which counts as a date with your plant for each of you. A live chat runs
 * the whole time. Polled while the Match screen is open (fast during a date).
 */
(function () {
  'use strict';

  var MP = window.PvZMP;
  var X = window.PvZX;
  var el = MP.util.el;
  var I = X.matchI;
  var MT = X.matchText;
  var SC = MT.SCENE;
  var D = SC.duo;
  var L = I.L;
  var pm = I.pm;

  var STEPS = ['arrive', 'pick1', 'game', 'pick2', 'end'];
  var PLACES = ['park', 'festival', 'beach', 'cafe', 'aquarium', 'museum'];

  var duo = (I.duo = {
    cur: null, // the server's view
    plan: null, // {to, plant, place} while inviting
    closed: X.store.get('duoClosed', {}), // ids already dismissed
    timer: null,
    busy: false,
    ver: 0,
    el: null,
    input: null,
    game: null, // {area, score, done}
    applied: {},
    notified: {},
    lines: {},
  });

  function myPartners() {
    var ps = I.partners();
    return Object.keys(ps).filter(function (c) {
      return ps[c].xp >= 0;
    });
  }

  var picCache = {};
  function plantPic(code) {
    if (!code) return el('span', { text: '🌱' });
    if (!picCache[code]) {
      var cv = MP.cards && MP.cards.plantCanvas && MP.cards.plantCanvas(code);
      picCache[code] = cv ? cv.toDataURL() : '';
    }
    return picCache[code] ? el('img', { src: picCache[code], alt: '' }) : el('span', { text: '🌱' });
  }

  function errText(e) {
    var code = String((e && (e.code || e.message)) || '');
    var k = Object.keys(D.errors).find(function (x) {
      return code.indexOf(x) >= 0;
    });
    return k ? L(D.errors[k]) : code || '?';
  }

  function toast(text, kind) {
    if (MP.ui) MP.ui.toast(text, kind || 'good');
  }

  function close(id) {
    if (id) {
      duo.closed[id] = Date.now();
      // Keep the last few.
      var keys = Object.keys(duo.closed).sort(function (a, b) {
        return duo.closed[b] - duo.closed[a];
      });
      keys.slice(20).forEach(function (k) {
        delete duo.closed[k];
      });
      X.store.set('duoClosed', duo.closed);
    }
    duo.plan = null;
    duo.game = null;
    if (duo.el) duo.el.remove();
    duo.el = null;
    duo.art = null;
    if (I.sceneMusic) I.sceneMusic(null);
  }

  function active(d) {
    return d && !duo.closed[d.id] && (d.state === 'on' || d.state === 'invited' || d.me === 'a' || d.state === 'done');
  }

  /* ------------------------------------------------------------- polling */

  I.duoPoll = function duoPoll() {
    clearTimeout(duo.timer);
    if (!I.pmOn || !I.pmOn() || !pm.me || duo.busy) return schedule();
    duo.busy = true;
    var ver = duo.ver;
    X.api
      .duo()
      .then(function (d) {
        // An answer to something done meanwhile is newer than this.
        if (ver === duo.ver) apply(d);
      })
      .catch(function () {})
      .then(function () {
        duo.busy = false;
        schedule();
      });
  };

  function schedule() {
    clearTimeout(duo.timer);
    var d = duo.cur;
    var live = duo.el && d && (d.state === 'on' || d.state === 'invited');
    duo.timer = setTimeout(I.duoPoll, live ? 1500 : I.node ? 6000 : 30000);
  }

  function apply(d) {
    var prev = duo.cur;
    duo.cur = d;
    if (!d || duo.closed[d.id]) {
      if (duo.el && !duo.plan) close();
      return;
    }
    // A new invite for me.
    if (d.state === 'invited' && d.me === 'b' && !duo.notified[d.id]) {
      duo.notified[d.id] = true;
      if (I.sfx) I.sfx('playGiftboxOpenSound');
      if (!I.node) toast(L(D.toast, { name: d.a.name }));
    }
    if (!I.node) return;
    if (!active(d)) return;
    if (d.state === 'on' && (!prev || prev.state !== 'on' || prev.id !== d.id)) {
      if (I.sceneMusic) I.sceneMusic('duo');
      if (I.sfx) I.sfx('playWorldEnterWind');
    }
    if (prev && prev.id === d.id && prev.step !== d.step && I.artWalk) I.artWalk(1100);
    if (!prev || prev.updated !== d.updated || prev.state !== d.state || !duo.el || !duo.el.isConnected) render();
  }

  /* -------------------------------------------------------------- invite */

  // From a player's profile: pick your plant and the place.
  I.duoInvite = function duoInvite(name) {
    var mine = myPartners();
    duo.plan = { to: name, plant: mine[0] || '', place: 'park' };
    render();
  };

  function plannerView() {
    var plan = duo.plan;
    var mine = myPartners();
    var box = el('div.pvzx-duo-plan', null, [
      el('button.pvzx-x', { text: '×', onclick: function () {
        close();
      } }),
      el('h3', { text: L(D.planTitle, { name: plan.to }) }),
      el('p.pvzx-small', { text: L(D.planDesc) }),
    ]);
    if (!mine.length) {
      box.appendChild(el('p.pvzx-seek', { text: L(D.noPartner) }));
      return box;
    }
    box.appendChild(el('h4', { text: L(D.yourPlant) }));
    box.appendChild(
      I.choiceChips(mine, plan.plant, function (v) {
        plan.plant = v;
        render();
      }, function (v) {
        return X.plantName(v);
      }),
    );
    box.appendChild(el('h4', { text: L(D.where) }));
    box.appendChild(
      I.choiceChips(PLACES, plan.place, function (v) {
        plan.place = v;
        render();
      }, function (v) {
        return SC.places[v].icon + ' ' + L(SC.places[v].name);
      }),
    );
    box.appendChild(
      el('div.pvzx-file-actions', null, [
        el('button.mp-btn.mp-green', { text: L(D.send), onclick: function () {
          duo.ver++;
          X.api
            .duoInvite(plan.to, plan.plant, plan.place)
            .then(function (d) {
              duo.plan = null;
              duo.cur = d;
              render();
              schedule();
            })
            .catch(function (e) {
              toast(errText(e), 'bad');
            });
        } }),
      ]),
    );
    return box;
  }

  /* ---------------------------------------------------------------- date */

  function names(d) {
    var me = d.me === 'a' ? d.a : d.b;
    var them = d.me === 'a' ? d.b : d.a;
    return { me: me, them: them };
  }

  function act(value) {
    var d = duo.cur;
    if (!d) return;
    var key = String(d.step);
    d.acts[key] = d.acts[key] || {};
    d.acts[key][d.me] = value;
    duo.ver++;
    render();
    X.api
      .duoAct(d.id, { kind: 'act', step: d.step, value: value })
      .then(function (r) {
        apply(r);
      })
      .catch(function () {});
  }

  function say(text) {
    var d = duo.cur;
    text = String(text || '').trim();
    if (!d || !text) return;
    d.chat.push({ from: d.me, text: text, at: Date.now(), tmp: true });
    duo.input.value = '';
    duo.ver++;
    render();
    X.api
      .duoAct(d.id, { kind: 'say', text: text })
      .then(function (r) {
        apply(r);
      })
      .catch(function () {});
  }

  function leave() {
    var d = duo.cur;
    if (!d) return close();
    if (d.state === 'on' && d.step < STEPS.length - 1 && !window.confirm(L(D.leaveAsk))) return;
    X.api.duoAct(d.id, { kind: 'leave' }).catch(function () {});
    close(d.id);
  }

  function optsOf(list, d, salt) {
    // Same three options on both screens (from the date's seed).
    var arr = list.slice();
    var a = (d.seed + salt) >>> 0;
    for (var i = arr.length - 1; i > 0; i--) {
      a = (a * 1103515245 + 12345) >>> 0;
      var j = a % (i + 1);
      var x = arr[i];
      arr[i] = arr[j];
      arr[j] = x;
    }
    return arr.slice(0, 3);
  }

  function labelOf(list, k) {
    var o = list.find(function (x) {
      return x.k === k;
    });
    return o ? L(o) : k;
  }

  function syncCount(d) {
    var n = 0;
    [1, 3].forEach(function (st) {
      var a = d.acts[st];
      if (a && a.a !== undefined && a.a === a.b) n++;
    });
    return n;
  }

  function teamSuns(d) {
    var g = d.acts['2'] || {};
    return (Number(g.a) || 0) + (Number(g.b) || 0);
  }

  // Applied once per date and player: a date with your plant.
  function finishOnce(d) {
    if (duo.applied[d.id] || d.left) return;
    duo.applied[d.id] = true;
    var my = names(d).me;
    var sync = syncCount(d);
    var suns = teamSuns(d);
    var stars = Math.min(3, 1 + (sync >= 1 ? 1 : 0) + (suns >= 18 ? 1 : 0) + (sync >= 2 && suns >= 10 ? 1 : 0));
    duo.stars = stars;
    var code = my.plant && my.plant.code;
    if (code && I.partners()[code]) {
      I.dateSuccess(code, 'duo', stars, false, { place: d.place, stars: stars, at: Date.now(), duo: names(d).them.name });
      if (I.progEvent) {
        duo.tickets = I.progEvent('date', { place: d.place, stars: stars });
        I.progEvent('duo');
      }
      I.later(code, L(D.plantSays[2]), 5000);
    }
    if (I.sfx) I.sfx('playLevelNodeFinish');
  }

  // The co-op sun shower: 12 s of falling suns (golden ones are worth 3).
  function sunGame(area, onDone) {
    var score = 0;
    var label = el('div.pvzx-game-score', { text: L(D.mine, { n: 0 }) });
    area.appendChild(label);
    var end = Date.now() + 12000;
    var suns = [];
    var last = 0;
    var prev = performance.now();
    (function frame(now) {
      if (!area.isConnected) return;
      var dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      var w = area.clientWidth || 300;
      var h = area.clientHeight || 300;
      if (now - last > 380 && Date.now() < end) {
        last = now;
        var gold = Math.random() < 0.12;
        var s = { x: 10 + Math.random() * (w - 60), y: -40, v: 90 + Math.random() * 80, gold: gold };
        s.node = el('button.pvzx-sun' + (gold ? '.pvzx-gold' : ''), { text: '☀️' });
        s.node.addEventListener('pointerdown', function (e) {
          e.preventDefault();
          if (s.done) return;
          s.done = true;
          score += s.gold ? 3 : 1;
          label.textContent = L(D.mine, { n: score });
          if (I.sfx) I.sfx('playRhythmHit');
          s.node.classList.add('pvzx-pop');
          setTimeout(function () {
            s.node.remove();
          }, 200);
        });
        area.appendChild(s.node);
        suns.push(s);
      }
      suns.forEach(function (s) {
        if (s.done) return;
        s.y += s.v * dt;
        s.node.style.left = s.x + 'px';
        s.node.style.top = s.y + 'px';
        if (s.y > h) {
          s.done = true;
          s.node.remove();
        }
      });
      if (Date.now() >= end) return onDone(score);
      requestAnimationFrame(frame);
    })(prev);
  }

  function dateView(d) {
    var who = names(d);
    var them = who.them;
    var me = who.me;
    var place = SC.places[d.place];
    var step = STEPS[d.step];
    var mineDone = d.acts[d.step] && d.acts[d.step][d.me] !== undefined;
    var top = el('div.pvzx-scene-top', null, [
      el('span', { text: place.icon + ' ' + L(place.name) + ' · 👥 ' + them.name }),
      el('span.pvzx-duo-step', { text: d.state === 'on' ? d.step + 1 + '/' + STEPS.length : '' }),
      el('button.pvzx-x', { text: '×', onclick: leave }),
    ]);
    if (!duo.art && I.sceneArt) {
      duo.art = I.sceneArt(d.place, { alive: function () {
        return !!duo.el;
      } });
    }
    var couple = function (x, side) {
      return el('div.pvzx-duo-couple.pvzx-duo-' + side, null, [
        el('div.pvzx-duo-plant', null, [plantPic(x.plant && x.plant.code)]),
        el('small', { text: (x.plant ? X.plantName(x.plant.code) : '…') + ' & ' + x.name }),
      ]);
    };
    var stage;
    var actions = el('div.pvzx-scene-actions');
    if (duo.game && duo.game.id === d.id && d.step === 2 && !mineDone) {
      stage = duo.game.area;
    } else {
      stage = el('div.pvzx-scene-stage' + (I.artWalking && I.artWalking() ? '.pvzx-walking' : ''), null, [duo.art || null, couple(me, 'me'), couple(them, 'them')]);
    }
    var lines = [];
    var other = d.me === 'a' ? 'b' : 'a';
    var wait = function () {
      actions.appendChild(el('div.pvzx-bubble.pvzx-from-sys', { text: L(D.waitOther, { name: them.name }) }));
    };
    if (d.state === 'invited') {
      if (d.me === 'a') {
        actions.appendChild(el('div.pvzx-bubble.pvzx-from-sys', { text: L(D.waiting, { name: them.name }) }));
        actions.appendChild(el('button.mp-btn.mp-brown', { text: L(D.cancel), onclick: leave }));
      } else {
        var mine = myPartners();
        duo.answerPlant = duo.answerPlant && mine.indexOf(duo.answerPlant) >= 0 ? duo.answerPlant : mine[0];
        actions.appendChild(el('div.pvzx-bubble.pvzx-from-sys', { text: L(D.invited, { name: d.a.name, place: place.icon + ' ' + L(place.name), plant: X.plantName(d.a.plant.code) }) }));
        if (!mine.length) actions.appendChild(el('p.pvzx-seek', { text: L(D.noPartner) }));
        else {
          actions.appendChild(el('small', { text: L(D.yourPlant) }));
          actions.appendChild(
            I.choiceChips(mine, duo.answerPlant, function (v) {
              duo.answerPlant = v;
              render();
            }, function (v) {
              return X.plantName(v);
            }),
          );
        }
        actions.appendChild(
          el('div.pvzx-file-actions', null, [
            el('button.mp-btn.mp-green', { text: L(D.accept), disabled: !mine.length, onclick: function () {
              duo.ver++;
              X.api
                .duoAnswer(d.id, true, duo.answerPlant)
                .then(apply)
                .catch(function (e) {
                  toast(errText(e), 'bad');
                });
            } }),
            el('button.mp-btn.mp-brown', { text: L(D.decline), onclick: function () {
              X.api.duoAnswer(d.id, false).catch(function () {});
              close(d.id);
            } }),
          ]),
        );
      }
    } else if (d.state === 'declined' || d.state === 'cancelled') {
      actions.appendChild(el('div.pvzx-bubble.pvzx-from-sys', { text: L(D.declined, { name: them.name }) }));
      actions.appendChild(el('button.mp-btn.mp-green', { text: L(D.close), onclick: function () {
        close(d.id);
      } }));
    } else if (d.left || (d.state === 'done' && step !== 'end')) {
      actions.appendChild(el('div.pvzx-bubble.pvzx-from-sys', { text: L(D.left, { name: d.left === d.me ? me.name : them.name }) }));
      actions.appendChild(el('button.mp-btn.mp-green', { text: L(D.close), onclick: function () {
        close(d.id);
      } }));
    } else {
      // The script (same on both screens).
      lines.push({ from: 'sys', text: L(D.arrive, { a: d.a.name, b: d.b.name, pa: X.plantName(d.a.plant.code), pb: d.b.plant ? X.plantName(d.b.plant.code) : '' }) });
      [[1, D.a1, 11, D.q1], [3, D.a2, 23, D.q2]].forEach(function (q) {
        if (d.step < q[0]) return;
        lines.push({ from: 'sys', text: L(q[3]) });
        var a = d.acts[q[0]];
        if (a && a.a !== undefined && a.b !== undefined) {
          lines.push({ from: 'sys', text: a.a === a.b ? L(D.same, { pick: labelOf(q[1], a.a) }) : L(D.diff, { a: labelOf(q[1], a[d.me]), b: labelOf(q[1], a[other]) }) });
        }
      });
      if (d.step > 2) lines.push({ from: 'sys', text: L(D.team, { a: Number((d.acts['2'] || {})[d.me]) || 0, b: Number((d.acts['2'] || {})[other]) || 0, n: teamSuns(d) }) });
      if (step === 'arrive') {
        if (mineDone) wait();
        else actions.appendChild(el('button.mp-btn.mp-green', { text: L(D.ready), onclick: function () {
          act('ok');
        } }));
      } else if (step === 'pick1' || step === 'pick2') {
        if (mineDone) wait();
        else {
          var list = step === 'pick1' ? D.a1 : D.a2;
          optsOf(list, d, step === 'pick1' ? 11 : 23).forEach(function (o) {
            actions.appendChild(el('button.pvzx-chat-opt', { text: L(o), onclick: function () {
              act(o.k);
            } }));
          });
        }
      } else if (step === 'game') {
        if (mineDone) wait();
        else if (!duo.game || duo.game.id !== d.id) {
          actions.appendChild(el('div.pvzx-bubble.pvzx-from-sys', { text: L(D.game) }));
          actions.appendChild(el('button.mp-btn.mp-green', { text: L(D.play), onclick: function () {
            var area = el('div.pvzx-scene-stage.pvzx-game');
            duo.game = { id: d.id, area: area };
            render();
            sunGame(area, function (n) {
              act(n);
            });
          } }));
        }
      } else if (step === 'end') {
        finishOnce(d);
        var sync = syncCount(d);
        actions.appendChild(
          el('div.pvzx-scene-result.pvzx-duo-result', null, [
            el('h3', { text: L(D.resultTitle) }),
            el('div.pvzx-scene-stars', { text: I.starsText(duo.stars || 1) }),
            el('p', { text: L(D.resultSync, { n: sync, s: teamSuns(d) }) }),
            duo.tickets ? el('p.pvzx-good', { text: L(SC.prog.won, { n: duo.tickets }) }) : null,
            el('button.mp-btn.mp-green', { text: L(D.close), onclick: function () {
              X.api.duoAct(d.id, { kind: 'leave' }).catch(function () {});
              close(d.id);
            } }),
          ]),
        );
      }
    }
    // Chat: the script lines, then the players' messages.
    var talk = el('div.pvzx-scene-talk');
    talk.addEventListener('wheel', function (e) {
      e.stopPropagation();
    });
    lines.forEach(function (m) {
      talk.appendChild(el('div.pvzx-bubble.pvzx-from-sys', { text: m.text }));
    });
    (d.chat || []).forEach(function (m) {
      var mineMsg = m.from === d.me;
      talk.appendChild(el('div.pvzx-bubble.pvzx-from-' + (mineMsg ? 'me' : 'them'), { text: (mineMsg ? '' : them.name + ': ') + m.text }));
    });
    var foot = null;
    if (d.state === 'on' && !d.left) {
      if (!duo.input) {
        duo.input = el('input.pvzx-input', { type: 'text', maxlength: 160, enterkeyhint: 'send' });
        duo.input.addEventListener('keydown', function (e) {
          e.stopPropagation();
          if (e.key === 'Enter') {
            e.preventDefault();
            say(duo.input.value);
          }
        });
      }
      duo.input.placeholder = L(D.chatPh, { name: them.name });
      foot = el('div.pvzx-pm-foot.pvzx-talk', null, [
        duo.input,
        el('button.mp-btn.mp-small.mp-green', { text: '➤', onclick: function () {
          say(duo.input.value);
        } }),
      ]);
    }
    var focused = duo.input && document.activeElement === duo.input;
    var children = [top, stage, talk, actions];
    if (foot) children.push(foot);
    duo.el.replaceChildren.apply(duo.el, children);
    duo.el.classList.toggle('pvzx-playing', stage === (duo.game && duo.game.area));
    if (focused) duo.input.focus();
    setTimeout(function () {
      talk.scrollTop = talk.scrollHeight;
    }, 0);
    // New messages from them: a little sound.
    var n = (d.chat || []).filter(function (m) {
      return m.from !== d.me;
    }).length;
    if (duo.seenChat != null && n > duo.seenChat && I.sfx) I.sfx('playRhythmHit');
    duo.seenChat = n;
  }

  function render() {
    if (!I.node) return;
    if (!duo.el) {
      duo.el = el('div.pvzx-scene.pvzx-duo');
      duo.el.style.background = 'linear-gradient(#ffd6ea, #fff4e0)';
    }
    if (duo.el.parentNode !== I.node) I.node.appendChild(duo.el);
    if (duo.plan) duo.el.replaceChildren(plannerView());
    else if (duo.cur && active(duo.cur)) dateView(duo.cur);
    else close();
  }
  I.duoRender = render;

  // Start polling once the page has loaded the rest.
  setTimeout(I.duoPoll, 4000);
})();
