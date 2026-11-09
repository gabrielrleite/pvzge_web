/*
 * PvZ2 Gardendless - Plant Match: the date activities of each place.
 *
 * Each one is a small scene of its own, played with taps and drags, with
 * animations and her reactions on top of the score:
 *   movie       (cinema)  seats, a movie playing on the screen and timed
 *                         moments: leaves touching in the popcorn, a jump
 *                         scare, her whisper, leaning on her shoulder;
 *   stall       (park)    a shooting stall: pull the ball back and release
 *                         (a slingshot) to knock cans down and win her a prize;
 *   picnic      (garden)  catch suns with her (golden ones count double) and
 *                         shoo the bees away from the basket;
 *   cafe        (café)    guess her drink from her hints, then latte art;
 *   dinner      (dinner)  build the plate she ordered, then a toast timed
 *                         as the glasses meet;
 *   sandcastle  (beach)   now with waves that shake the floor being placed.
 * done(points) takes -10..20 (added to the mood). ctx gives the mood, her
 * personality and a way to say things in the talk.
 */
(function () {
  'use strict';

  var MP = window.PvZMP;
  var X = window.PvZX;
  var el = MP.util.el;
  var I = X.matchI;
  var MT = X.matchText;
  var SC = MT.SCENE;
  var L = I.L;
  var Lp = I.Lp;
  var shuffle = I.shuffle;
  var pick = I.pick;
  var G = I.DATE_GAMES;

  function alive(node) {
    return !!(node && node.isConnected && I.scene);
  }

  function plantImg(p) {
    return p.photos && p.photos.idle ? I.animImg(p.photos.idle) : el('img', { src: p.packet, alt: '' });
  }

  function btn(cls, text, fn) {
    var b = el('button.' + cls, { text: text });
    b.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      fn(e);
    });
    return b;
  }

  // A floating line over the game (her reaction to a moment).
  function pop(area, text, cls) {
    var n = el('div.pvzx-game-pop' + (cls ? '.' + cls : ''), { text: text });
    area.appendChild(n);
    setTimeout(function () {
      n.remove();
    }, 1600);
  }

  function clamp(v) {
    return Math.max(-10, Math.min(20, Math.round(v)));
  }

  /* ------------------------------------------------------------ movie */

  // Seat preferences by personality.
  var SEAT = { sweet: 'back', shy: 'middle', sassy: 'back', nerd: 'middle', brave: 'front', drama: 'back' };
  // Reactions to the jump scare and the whisper: [good, bad] option keys.
  var SCARE = { sweet: ['hold', 'laugh'], shy: ['hold', 'laugh'], sassy: ['laugh', 'scream'], nerd: ['laugh', 'hold'], brave: ['laugh', 'scream'], drama: ['scream', 'laugh'] };
  var WHISPER = { sweet: ['whisper', 'shh'], shy: ['whisper', 'spoil'], sassy: ['whisper', 'shh'], nerd: ['shh', 'whisper'], brave: ['whisper', 'spoil'], drama: ['whisper', 'spoil'] };

  G.movie = function (area, p, done, ctx) {
    var MV = SC.movie;
    var score = 0;
    var pers = ctx.pers;
    area.classList.add('pvzx-cinema');
    // 1. Seats
    var seatBox = el('div.pvzx-quiz', null, [
      el('b', { text: L(MV.seatsQ) }),
      el(
        'div.pvzx-quiz-opts',
        null,
        Object.keys(MV.seats).map(function (k) {
          return btn('pvzx-chat-opt', MV.seats[k].icon + ' ' + L(MV.seats[k]), function () {
            var good = SEAT[pers] === k;
            var bad = k === 'front' && pers !== 'brave';
            score += good ? 4 : bad ? -3 : 1;
            ctx.say(L(good ? MV.seatLove : bad ? MV.seatBad : MV.seatMeh));
            seatBox.remove();
            film();
          });
        }),
      ),
    ]);
    area.appendChild(seatBox);

    // 2. The film: a screen with a story, the two of you below and moments
    // with a short window to act.
    function film() {
      var subs = L(MV.subs);
      var screen = el('div.pvzx-screen', null, [el('div.pvzx-screen-sky'), el('span.pvzx-screen-zombie', { text: '🧟' }), el('span.pvzx-screen-flower', { text: '🌻' }), el('div.pvzx-screen-sub', { text: subs[0] })]);
      var row = el('div.pvzx-seats', null, [el('div.pvzx-seat-you', { text: '🧑‍🌾' }), el('div.pvzx-seat-bucket', { text: '🍿' }), el('div.pvzx-seat-her', null, [plantImg(p)])]);
      var acts = el('div.pvzx-movie-acts');
      area.appendChild(screen);
      area.appendChild(row);
      area.appendChild(acts);
      var sub = screen.querySelector('.pvzx-screen-sub');
      var her = row.querySelector('.pvzx-seat-her');
      var t0 = Date.now();
      var moments = [
        { at: 2500, run: popcorn },
        { at: 8000, run: scare },
        { at: 14000, run: whisper },
        { at: 20000, run: romance },
      ];
      var subAt = [0, 5000, 11000, 18500, 25500];
      var mi = 0;
      var si = 0;
      (function tick() {
        if (!alive(area)) return;
        var t = Date.now() - t0;
        if (si < subAt.length && t >= subAt[si]) {
          sub.textContent = subs[si] || '';
          screen.classList.toggle('pvzx-screen-love', si === 3);
          si++;
        }
        if (mi < moments.length && t >= moments[mi].at) moments[mi++].run();
        if (t >= 27000) return done(clamp(score));
        setTimeout(tick, 100);
      })();

      // A moment: buttons that close after `ms`; no answer = `late`.
      function moment(label, opts, ms, late) {
        acts.replaceChildren(el('div.pvzx-timer', null, [el('i', { style: 'animation-duration:' + ms + 'ms' })]), el('small', { text: label }));
        var answered = false;
        opts.forEach(function (o) {
          acts.appendChild(
            btn('pvzx-chat-opt', o.text, function () {
              if (answered) return;
              answered = true;
              acts.replaceChildren();
              o.fn();
            }),
          );
        });
        setTimeout(function () {
          if (answered || !alive(area)) return;
          answered = true;
          acts.replaceChildren();
          if (late) late();
        }, ms);
      }

      function popcorn() {
        her.classList.add('pvzx-reach');
        moment(I.gfix(L(MV.popcornNow), p.gender), [{ text: L(MV.grab), fn: function () {
          var warm = ctx.mood() >= 45;
          score += warm ? 6 : -3;
          pop(area, I.gfix(L(warm ? MV.touchHands : MV.touchAwk), p.gender), warm ? 'pvzx-pop-love' : 'pvzx-pop-bad');
          her.classList.add(warm ? 'pvzx-a-blush' : 'pvzx-a-away');
        } }], 1800);
        setTimeout(function () {
          her.classList.remove('pvzx-reach');
        }, 1900);
      }

      function scare() {
        screen.classList.add('pvzx-screen-scare');
        area.classList.add('pvzx-a-shake');
        setTimeout(function () {
          screen.classList.remove('pvzx-screen-scare');
          area.classList.remove('pvzx-a-shake');
        }, 700);
        var pref = SCARE[pers];
        moment(L(MV.scare), MV.scareOpts.map(function (o) {
          return { text: I.gfix(L(o), p.gender), fn: function () {
            var ok = o.k === pref[0];
            var bad = o.k === pref[1];
            if (o.k === 'hold' && ctx.mood() < 40) bad = true;
            score += ok && !bad ? 6 : bad ? -4 : 1;
            pop(area, ok && !bad ? '🥰' : bad ? '😒' : '🙂', ok && !bad ? 'pvzx-pop-love' : bad ? 'pvzx-pop-bad' : '');
            her.classList.add(ok && !bad ? 'pvzx-a-happy' : bad ? 'pvzx-a-angry' : 'pvzx-a-blush');
          } };
        }), 2600, function () {
          score -= 2;
          pop(area, '😶', 'pvzx-pop-bad');
        });
      }

      function whisper() {
        pop(area, I.gfix(L(MV.whisper), p.gender), '');
        var pref = WHISPER[pers];
        moment(L(MV.whisper), MV.whisperOpts.map(function (o) {
          return { text: I.gfix(L(o), p.gender), fn: function () {
            var ok = o.k === pref[0];
            var bad = o.k === pref[1] || o.k === 'spoil';
            score += ok ? 5 : bad ? -5 : 0;
            pop(area, ok ? '😊' : bad ? '😤' : '😐', ok ? 'pvzx-pop-love' : bad ? 'pvzx-pop-bad' : '');
            her.classList.add(ok ? 'pvzx-a-happy' : bad ? 'pvzx-a-angry' : 'pvzx-a-away');
          } };
        }), 3200);
      }

      function romance() {
        moment(L(MV.romance), [{ text: L(MV.lean), fn: function () {
          var yes = ctx.mood() >= 55;
          score += yes ? 7 : -6;
          pop(area, I.gfix(L(yes ? MV.leanYes : MV.leanNo), p.gender), yes ? 'pvzx-pop-love' : 'pvzx-pop-bad');
          row.classList.add(yes ? 'pvzx-lean' : 'pvzx-apart');
        } }], 3000);
      }
    }
  };

  /* ------------------------------------------------------------ stall */

  // Slingshot: drag the ball back from its rest point and release; the
  // further you pull, the stronger the throw. Cans fall when hit.
  G.stall = function (area, p, done) {
    var ST = SC.stall;
    var w = area.clientWidth || 340;
    var h = area.clientHeight || 300;
    var cv = el('canvas.pvzx-stall', { width: w, height: h });
    var ctx2 = cv.getContext('2d');
    area.appendChild(cv);
    var label = el('div.pvzx-game-score', { text: L(ST.balls, { n: 4 }) });
    area.appendChild(label);
    var rest = { x: w * 0.18, y: h * 0.72 };
    // Strength of the pull and gravity: every shelf can be reached.
    var POWER = 8.5;
    var GRAV = 520;
    var cans = [];
    // Three stacks of cans (pyramids of 3) on shelves.
    [[0.58, 0.42], [0.74, 0.62], [0.88, 0.36]].forEach(function (pos) {
      var bx = w * pos[0];
      var by = h * pos[1];
      [[-14, 0], [14, 0], [0, -26]].forEach(function (o) {
        cans.push({ x: bx + o[0], y: by + o[1], vx: 0, vy: 0, down: false, shelf: by + 13 });
      });
    });
    var balls = 4;
    var ball = null;
    var drag = null;
    var over = false;
    function draw() {
      ctx2.clearRect(0, 0, w, h);
      // shelves
      ctx2.fillStyle = '#8a5a2b';
      [[0.58, 0.42], [0.74, 0.62], [0.88, 0.36]].forEach(function (pos) {
        ctx2.fillRect(w * pos[0] - 30, h * pos[1] + 13, 60, 6);
      });
      // cans
      ctx2.font = '24px sans-serif';
      ctx2.textAlign = 'center';
      ctx2.textBaseline = 'middle';
      cans.forEach(function (c) {
        ctx2.save();
        ctx2.translate(c.x, c.y);
        if (c.down) ctx2.rotate(c.rot || 0);
        ctx2.fillStyle = c.down ? '#9aa' : '#e2453c';
        ctx2.fillRect(-11, -13, 22, 26);
        ctx2.fillStyle = '#fff';
        ctx2.fillRect(-11, -4, 22, 6);
        ctx2.restore();
      });
      // slingshot
      ctx2.strokeStyle = '#6b3f1d';
      ctx2.lineWidth = 6;
      ctx2.beginPath();
      ctx2.moveTo(rest.x - 16, rest.y - 22);
      ctx2.lineTo(rest.x, rest.y + 30);
      ctx2.lineTo(rest.x + 16, rest.y - 22);
      ctx2.stroke();
      var bp = drag ? drag : ball ? null : rest;
      if (bp) {
        ctx2.strokeStyle = '#3b2a1a';
        ctx2.lineWidth = 2;
        ctx2.beginPath();
        ctx2.moveTo(rest.x - 16, rest.y - 22);
        ctx2.lineTo(bp.x, bp.y);
        ctx2.lineTo(rest.x + 16, rest.y - 22);
        ctx2.stroke();
        if (balls > 0) {
          ctx2.font = '22px sans-serif';
          ctx2.fillText('⚾', bp.x, bp.y);
        }
      }
      if (drag) {
        // aim preview
        ctx2.fillStyle = 'rgba(255,255,255,0.7)';
        var vx = (rest.x - drag.x) * POWER;
        var vy = (rest.y - drag.y) * POWER;
        var x = rest.x;
        var y = rest.y;
        for (var k = 0; k < 14; k++) {
          x += vx * 0.04;
          vy += GRAV * 0.04;
          y += vy * 0.04;
          ctx2.fillRect(x - 1.5, y - 1.5, 3, 3);
        }
      }
      if (ball) {
        ctx2.font = '22px sans-serif';
        ctx2.fillText('⚾', ball.x, ball.y);
      }
    }
    function pos(e) {
      var r = cv.getBoundingClientRect();
      return { x: ((e.clientX - r.left) / r.width) * w, y: ((e.clientY - r.top) / r.height) * h };
    }
    cv.addEventListener('pointerdown', function (e) {
      if (ball || balls <= 0 || over) return;
      var q = pos(e);
      if (Math.abs(q.x - rest.x) + Math.abs(q.y - rest.y) > 70) return;
      e.preventDefault();
      drag = q;
      try {
        cv.setPointerCapture(e.pointerId);
      } catch (err) {}
    });
    cv.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var q = pos(e);
      var dx = q.x - rest.x;
      var dy = q.y - rest.y;
      var d = Math.sqrt(dx * dx + dy * dy);
      var max = 90;
      if (d > max) {
        dx *= max / d;
        dy *= max / d;
      }
      drag = { x: rest.x + dx, y: rest.y + dy };
    });
    cv.addEventListener('pointerup', function () {
      if (!drag) return;
      ball = { x: drag.x, y: drag.y, vx: (rest.x - drag.x) * POWER, vy: (rest.y - drag.y) * POWER, t: 0 };
      drag = null;
      balls--;
      label.textContent = L(ST.balls, { n: balls });
    });
    var prev = performance.now();
    (function frame(now) {
      if (!alive(area) || over) return;
      var dt = Math.min(0.04, (now - prev) / 1000);
      prev = now;
      if (ball) {
        ball.vy += GRAV * dt;
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
        ball.t += dt;
        cans.forEach(function (c) {
          if (!c.down && Math.abs(c.x - ball.x) < 18 && Math.abs(c.y - ball.y) < 20) {
            c.down = true;
            c.vx = ball.vx * 0.3 + (Math.random() - 0.5) * 80;
            c.vy = -160;
            ball.vx *= 0.7;
          }
        });
        if (ball.y > h + 30 || ball.x > w + 30 || ball.t > 3) ball = null;
      }
      cans.forEach(function (c) {
        if (!c.down) return;
        c.vy += 900 * dt;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.rot = (c.rot || 0) + c.vx * dt * 0.05;
        // knocks the cans standing on top
        cans.forEach(function (o) {
          if (!o.down && o !== c && Math.abs(o.x - c.x) < 20 && o.y < c.y && c.y - o.y < 40 && Math.abs(c.vx) > 20) {
            o.down = true;
            o.vx = c.vx * 0.5;
            o.vy = -60;
          }
        });
      });
      // a can loses its support when the ones under it fall
      cans.forEach(function (c) {
        if (c.down || c.y >= c.shelf - 14) return;
        var support = cans.some(function (o) {
          return !o.down && o !== c && o.y > c.y && Math.abs(o.x - c.x) < 20;
        });
        if (!support) {
          c.down = true;
          c.vx = (Math.random() - 0.5) * 60;
          c.vy = 0;
        }
      });
      draw();
      var fallen = cans.filter(function (c) {
        return c.down;
      }).length;
      if (!ball && (balls <= 0 || fallen === cans.length)) {
        over = true;
        setTimeout(function () {
          if (!alive(area)) return;
          var tier = fallen >= 9 ? 3 : fallen >= 6 ? 2 : fallen >= 3 ? 1 : 0;
          var prize = L(ST.prizes)[tier];
          pop(area, L(ST.won, { prize: prize }), tier ? 'pvzx-pop-love' : 'pvzx-pop-bad');
          setTimeout(function () {
            done(clamp(tier * 6 + (fallen % 3)));
          }, 1400);
        }, 500);
        return;
      }
      requestAnimationFrame(frame);
    })(prev);
  };

  /* ----------------------------------------------------------- picnic */

  // Catch suns with her (she catches some too); golden suns count double;
  // bees fly to the basket: tap them away or she gets upset.
  G.picnic = function (area, p, done) {
    var PC = SC.picnic;
    var basket = el('div.pvzx-basket', { text: '🧺' });
    var mini = el('div.pvzx-picnic-her', null, [plantImg(p)]);
    var label = el('div.pvzx-game-score', { text: L(SC.ui.score, { n: 0 }) });
    area.appendChild(label);
    area.appendChild(basket);
    area.appendChild(mini);
    var score = 0;
    var stings = 0;
    var end = Date.now() + 15000;
    var items = [];
    var last = 0;
    var lastBee = 0;
    var prev = performance.now();
    function add(n) {
      score += n;
      label.textContent = L(SC.ui.score, { n: Math.max(0, score) });
    }
    (function frame(now) {
      if (!alive(area)) return;
      var dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      var w = area.clientWidth || 300;
      var h = area.clientHeight || 300;
      var running = Date.now() < end;
      if (running && now - last > 520) {
        last = now;
        var gold = Math.random() < 0.12;
        var it = { kind: 'sun', gold: gold, x: 20 + Math.random() * (w - 70), y: -40, v: 70 + Math.random() * 80 };
        it.node = el('button.pvzx-sun' + (gold ? '.pvzx-gold' : ''), { text: '☀️' });
        it.node.addEventListener('pointerdown', function (e) {
          e.preventDefault();
          if (it.done) return;
          it.done = true;
          add(it.gold ? 2 : 1);
          if (it.gold) pop(area, L(PC.golden), 'pvzx-pop-love');
          it.node.classList.add('pvzx-pop');
          setTimeout(function () {
            it.node.remove();
          }, 200);
        });
        area.appendChild(it.node);
        items.push(it);
      }
      if (running && now - lastBee > 2600) {
        lastBee = now;
        var bee = { kind: 'bee', x: Math.random() < 0.5 ? -30 : w + 10, y: 40 + Math.random() * (h * 0.4) };
        bee.tx = w * 0.5 - 20;
        bee.ty = h - 70;
        bee.node = el('button.pvzx-bee', { text: '🐝' });
        bee.node.addEventListener('pointerdown', function (e) {
          e.preventDefault();
          if (bee.done) return;
          bee.done = true;
          bee.node.classList.add('pvzx-shoo');
          setTimeout(function () {
            bee.node.remove();
          }, 400);
        });
        area.appendChild(bee.node);
        items.push(bee);
      }
      items.forEach(function (it) {
        if (it.done) return;
        if (it.kind === 'sun') {
          it.y += it.v * dt;
          // she catches the suns that fall near her
          if (it.y > h - 110 && Math.abs(it.x - w * 0.75) < 45) {
            it.done = true;
            add(1);
            mini.classList.remove('pvzx-a-happy');
            void mini.offsetWidth;
            mini.classList.add('pvzx-a-happy');
            it.node.remove();
            return;
          }
          if (it.y > h) {
            it.done = true;
            it.node.remove();
          }
        } else {
          var dx = it.tx - it.x;
          var dy = it.ty - it.y;
          var d = Math.sqrt(dx * dx + dy * dy) || 1;
          it.x += (dx / d) * 60 * dt + Math.sin(now / 120) * 1.5;
          it.y += (dy / d) * 60 * dt;
          if (d < 14) {
            it.done = true;
            stings++;
            add(-3);
            pop(area, L(PC.bee), 'pvzx-pop-bad');
            mini.classList.add('pvzx-a-angry');
            it.node.remove();
            return;
          }
        }
        it.node.style.left = it.x + 'px';
        it.node.style.top = it.y + 'px';
      });
      if (!running && items.every(function (it) {
        return it.done;
      })) return done(clamp(score * 1.2 - stings * 2));
      requestAnimationFrame(frame);
    })(prev);
  };

  /* -------------------------------------------------------------- cafe */

  // Her favorite drink comes from her traits; she gives a hint.
  function drinkOf(p) {
    var keys = Object.keys(SC.cafe.drinks);
    return keys[X.hashSeed('drink:' + p.code) % keys.length];
  }

  G.cafe = function (area, p, done, ctx) {
    var CF = SC.cafe;
    var want = drinkOf(p);
    var score = 0;
    var box = el('div.pvzx-quiz', null, [
      el('div.pvzx-cafe-her', null, [plantImg(p)]),
      el('div.pvzx-bubble.pvzx-from-them', { text: I.gfix(L(CF.drinks[want].hint), p.gender) }),
      el(
        'div.pvzx-food',
        null,
        Object.keys(CF.drinks).map(function (k) {
          var d = CF.drinks[k];
          return btn('pvzx-food-btn.pvzx-drink', d.icon, function () {
            var ok = k === want;
            score += ok ? 8 : -2;
            ctx.say(d.icon + ' ' + L(d), 'me');
            ctx.say(L(ok ? CF.right : CF.wrong));
            pop(area, ok ? '😍' : '😅', ok ? 'pvzx-pop-love' : '');
            box.remove();
            setTimeout(art, 700);
          });
        }),
      ),
    ]);
    area.appendChild(box);
    function art() {
      if (!alive(area)) return;
      var sub = el('div.pvzx-scene-stage.pvzx-game');
      sub.style.position = 'absolute';
      sub.style.inset = '0';
      area.appendChild(sub);
      G.latte(sub, p, function (pts) {
        sub.remove();
        score += pts * 0.6;
        var good = pts >= 12;
        var sip = el('div.pvzx-cafe-her.pvzx-sip', null, [plantImg(p), el('span', { text: CF.drinks[want].icon })]);
        area.appendChild(sip);
        pop(area, I.gfix(L(good ? CF.sipLove : CF.sipOk), p.gender), good ? 'pvzx-pop-love' : '');
        setTimeout(function () {
          done(clamp(score));
        }, 1700);
      });
    }
  };

  /* ------------------------------------------------------------ dinner */

  // The plate (memory) and then a toast: two glasses slide towards each
  // other; tap when they meet.
  G.dinner = function (area, p, done) {
    var DN = SC.dinner;
    var score = 0;
    var sub = el('div.pvzx-scene-stage.pvzx-game');
    sub.style.position = 'absolute';
    sub.style.inset = '0';
    area.appendChild(sub);
    G.plate(sub, p, function (pts) {
      sub.remove();
      score += pts * 0.6;
      toast();
    });
    function toast() {
      if (!alive(area)) return;
      var tries = 2;
      var hits = 0;
      var a = el('span.pvzx-glass', { text: '🍷' });
      var b = el('span.pvzx-glass.pvzx-glass-her', { text: '🍷' });
      var help = el('div.pvzx-game-score', { text: L(DN.toast) });
      var tap = btn('pvzx-tap', '🥂', function () {
        if (tries <= 0) return;
        tries--;
        var gap = Math.abs(xb - xa);
        var ok = gap < 34;
        if (ok) hits++;
        pop(area, I.gfix(L(ok ? DN.clink : DN.spill), p.gender), ok ? 'pvzx-pop-love' : 'pvzx-pop-bad');
        area.classList.toggle('pvzx-a-shake', !ok);
        if (!tries) setTimeout(function () {
          done(clamp(score + hits * 4));
        }, 1300);
      });
      area.appendChild(help);
      area.appendChild(a);
      area.appendChild(b);
      area.appendChild(tap);
      var t0 = performance.now();
      var xa = 0;
      var xb = 0;
      (function frame(now) {
        if (!alive(area) || tries <= 0) return;
        var w = area.clientWidth || 300;
        var ph = ((now - t0) / 1000) * 2.4;
        // they swing towards each other and apart
        var d = (Math.cos(ph) * 0.5 + 0.5) * w * 0.32;
        xa = w / 2 - 20 - d;
        xb = w / 2 + 4 + d;
        a.style.left = xa + 'px';
        b.style.left = xb + 'px';
        requestAnimationFrame(frame);
      })(t0);
    }
  };

  /* -------------------------------------------------------- sandcastle */

  // The sandcastle with waves: every few seconds a wave rolls in and shakes
  // the floor being placed (it moves faster and jitters while the wave is
  // there). At the end she takes a photo.
  var baseSand = G.sandcastle;
  G.sandcastle = function (area, p, done) {
    var wave = el('div.pvzx-wave');
    area.appendChild(wave);
    var waving = false;
    var timer = setInterval(function () {
      if (!alive(area)) return clearInterval(timer);
      waving = true;
      area.classList.add('pvzx-waving');
      pop(area, L(SC.beach.wave), '');
      setTimeout(function () {
        waving = false;
        area.classList.remove('pvzx-waving');
      }, 1500);
    }, 4200);
    baseSand(area, p, function (pts) {
      clearInterval(timer);
      area.classList.add('pvzx-flash');
      pop(area, L(SC.beach.photo), 'pvzx-pop-love');
      setTimeout(function () {
        area.classList.remove('pvzx-flash');
        done(pts);
      }, 1300);
    });
    // While a wave is in, the sliding floor jitters (read by the CSS).
    void waving;
  };
})();
