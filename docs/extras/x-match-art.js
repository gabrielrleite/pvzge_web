/*
 * PvZ2 Gardendless - Plant Match: illustrated date scenes.
 *
 * I.sceneArt(place) returns a canvas that draws the place with layers in
 * parallax (sky, far, near), light and particles (clouds, butterflies, sea
 * waves, candle flames, fireworks, fish and bubbles, rain…) for as long as
 * it is on the page. Between the steps of a date the two of you walk:
 * the layers scroll faster (I.artWalk). Rain is drawn when the weather says
 * so (a surprise). Times come from performance.now(), so a canvas created
 * again by a redraw continues where the previous one was.
 */
(function () {
  'use strict';

  var X = window.PvZX;
  var I = X.matchI;

  var walk = { until: 0, offset: 0, last: 0 };
  // Scroll offset: slow drift, fast while walking.
  function scroll(now) {
    var dt = Math.min(0.05, (now - (walk.last || now)) / 1000);
    walk.last = now;
    walk.offset += dt * (now < walk.until ? 160 : 8);
    return walk.offset;
  }

  I.artWalk = function artWalk(ms) {
    walk.until = performance.now() + (ms || 1400);
  };
  I.artWalking = function artWalking() {
    return performance.now() < walk.until;
  };

  function rnd(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), a | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function grad(c, h, stops) {
    var g = c.createLinearGradient(0, 0, 0, h);
    stops.forEach(function (s) {
      g.addColorStop(s[0], s[1]);
    });
    return g;
  }

  function emoji(c, e, x, y, size, alpha) {
    c.globalAlpha = alpha == null ? 1 : alpha;
    c.font = size + 'px sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(e, x, y);
    c.globalAlpha = 1;
  }

  // Repeating layer of shapes scrolled by `off`.
  function band(c, w, off, gap, fn) {
    var start = -((off % gap) + gap);
    for (var x = start; x < w + gap; x += gap) fn(x, Math.floor((x + off) / gap));
  }

  function hills(c, w, h, off, y, amp, color, freq) {
    c.fillStyle = color;
    c.beginPath();
    c.moveTo(0, h);
    for (var x = 0; x <= w; x += 8) c.lineTo(x, y + Math.sin((x + off) * freq) * amp + Math.sin((x + off) * freq * 2.3) * amp * 0.4);
    c.lineTo(w, h);
    c.fill();
  }

  function clouds(c, w, h, off, t, color) {
    var r = rnd(7);
    for (var i = 0; i < 6; i++) {
      var y = h * (0.08 + r() * 0.25);
      var speed = 0.3 + r() * 0.5;
      var x = ((r() * w * 2 - (off * speed + t * 6 * speed)) % (w + 160)) + w + 80;
      x = (((x % (w + 160)) + w + 160) % (w + 160)) - 80;
      c.fillStyle = color;
      [[0, 0, 22], [20, -8, 18], [38, 0, 20], [18, 6, 20]].forEach(function (b) {
        c.beginPath();
        c.arc(x + b[0], y + b[1], b[2], 0, Math.PI * 2);
        c.fill();
      });
    }
  }

  function rain(c, w, h, t) {
    c.strokeStyle = 'rgba(200,220,255,0.55)';
    c.lineWidth = 1.5;
    var r = rnd(3);
    for (var i = 0; i < 90; i++) {
      var x = (r() * w + t * 60) % w;
      var y = (r() * h + t * 520 * (0.8 + r() * 0.4)) % h;
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x - 4, y + 12);
      c.stroke();
    }
    c.fillStyle = 'rgba(40,60,90,0.18)';
    c.fillRect(0, 0, w, h);
  }

  function fireflies(c, w, h, t, color) {
    var r = rnd(11);
    for (var i = 0; i < 18; i++) {
      var bx = r() * w;
      var by = h * (0.2 + r() * 0.6);
      var x = bx + Math.sin(t * (0.5 + r()) + i) * 20;
      var y = by + Math.cos(t * (0.7 + r()) + i) * 14;
      var a = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i));
      c.fillStyle = color || 'rgba(255,240,140,' + a + ')';
      c.beginPath();
      c.arc(x, y, 2.4, 0, Math.PI * 2);
      c.fill();
    }
  }

  function stars(c, w, h, t) {
    var r = rnd(5);
    for (var i = 0; i < 50; i++) {
      var a = 0.4 + 0.6 * Math.abs(Math.sin(t * (0.5 + r()) + i));
      c.fillStyle = 'rgba(255,255,255,' + a + ')';
      c.fillRect(r() * w, r() * h * 0.6, 1.6, 1.6);
    }
  }

  // Each place: draw(c, w, h, t, off, opts)
  var PLACES = {
    garden: function (c, w, h, t, off) {
      c.fillStyle = grad(c, h, [[0, '#8fdcff'], [0.6, '#d6f6ff'], [1, '#e9ffd2']]);
      c.fillRect(0, 0, w, h);
      // sun and its rays
      c.save();
      c.translate(w * 0.82, h * 0.16);
      c.rotate(t * 0.15);
      c.fillStyle = 'rgba(255,230,120,0.35)';
      for (var k = 0; k < 12; k++) {
        c.rotate(Math.PI / 6);
        c.fillRect(-3, 24, 6, 26);
      }
      c.restore();
      c.fillStyle = '#ffd93b';
      c.beginPath();
      c.arc(w * 0.82, h * 0.16, 20, 0, Math.PI * 2);
      c.fill();
      clouds(c, w, h, off * 0.2, t, 'rgba(255,255,255,0.9)');
      hills(c, w, h, off * 0.3, h * 0.55, 14, '#9ed98a', 0.012);
      hills(c, w, h, off * 0.6, h * 0.68, 10, '#78c45a', 0.02);
      // trees on the far hill
      band(c, w, off * 0.45, 120, function (x) {
        emoji(c, '🌳', x, h * 0.55, 34);
      });
      // flowers in front, swaying
      c.fillStyle = '#5fb247';
      c.fillRect(0, h * 0.8, w, h * 0.2);
      band(c, w, off, 46, function (x, i) {
        c.save();
        c.translate(x, h * 0.86);
        c.rotate(Math.sin(t * 2 + i) * 0.15);
        emoji(c, i % 3 ? '🌼' : '🌷', 0, 0, 18);
        c.restore();
      });
      // picnic blanket
      c.fillStyle = '#e8484c';
      c.beginPath();
      c.moveTo(w * 0.18, h * 0.9);
      c.lineTo(w * 0.82, h * 0.9);
      c.lineTo(w * 0.72, h * 0.78);
      c.lineTo(w * 0.28, h * 0.78);
      c.fill();
      c.fillStyle = 'rgba(255,255,255,0.7)';
      for (var bx = 0; bx < 6; bx++) c.fillRect(w * 0.27 + bx * w * 0.09, h * 0.78, w * 0.03, h * 0.12);
      // butterflies
      for (var b = 0; b < 3; b++) emoji(c, '🦋', ((t * 30 + b * 140) % (w + 60)) - 30, h * (0.3 + b * 0.1) + Math.sin(t * 3 + b) * 12, 16);
    },
    cinema: function (c, w, h, t) {
      c.fillStyle = grad(c, h, [[0, '#1a0d1f'], [1, '#05030a']]);
      c.fillRect(0, 0, w, h);
      // screen glow
      var flick = 0.85 + Math.sin(t * 13) * 0.05 + Math.sin(t * 3.1) * 0.05;
      c.fillStyle = 'rgba(160,190,255,' + 0.22 * flick + ')';
      c.fillRect(w * 0.1, h * 0.06, w * 0.8, h * 0.34);
      c.strokeStyle = 'rgba(200,215,255,0.35)';
      c.strokeRect(w * 0.1, h * 0.06, w * 0.8, h * 0.34);
      // projector beam with dust
      var g = c.createLinearGradient(w * 0.5, h, w * 0.5, h * 0.1);
      g.addColorStop(0, 'rgba(255,255,230,0.18)');
      g.addColorStop(1, 'rgba(255,255,230,0)');
      c.fillStyle = g;
      c.beginPath();
      c.moveTo(w * 0.47, h * 0.98);
      c.lineTo(w * 0.15, h * 0.08);
      c.lineTo(w * 0.85, h * 0.08);
      c.lineTo(w * 0.53, h * 0.98);
      c.fill();
      fireflies(c, w, h, t * 0.4, 'rgba(255,255,230,0.35)');
      // rows of seats
      for (var row = 0; row < 3; row++) {
        c.fillStyle = ['#4b1828', '#3a1220', '#2a0c17'][row];
        var y = h * (0.62 + row * 0.12);
        for (var x = -10 + (row % 2) * 16; x < w + 20; x += 32) {
          c.beginPath();
          c.arc(x, y, 14, Math.PI, 0);
          c.fillRect(x - 14, y, 28, 14);
          c.fill();
        }
      }
    },
    beach: function (c, w, h, t, off) {
      c.fillStyle = grad(c, h, [[0, '#ffb26b'], [0.35, '#ffd9a0'], [0.5, '#9fdcff']]);
      c.fillRect(0, 0, w, h * 0.5);
      // setting sun with reflection
      c.fillStyle = '#ff7b3d';
      c.beginPath();
      c.arc(w * 0.7, h * 0.42, 26, 0, Math.PI * 2);
      c.fill();
      clouds(c, w, h, off * 0.15, t, 'rgba(255,240,230,0.8)');
      // sea with waves
      c.fillStyle = grad(c, h, [[0.45, '#2fa9e0'], [0.7, '#69d0f2']]);
      c.fillRect(0, h * 0.45, w, h * 0.3);
      for (var k = 0; k < 4; k++) {
        c.strokeStyle = 'rgba(255,255,255,' + (0.5 - k * 0.1) + ')';
        c.lineWidth = 2;
        c.beginPath();
        for (var x = 0; x <= w; x += 6) {
          var y = h * (0.5 + k * 0.06) + Math.sin(x * 0.04 + t * (1.5 + k * 0.3) + off * 0.01) * 3;
          if (x === 0) c.moveTo(x, y);
          else c.lineTo(x, y);
        }
        c.stroke();
      }
      c.fillStyle = 'rgba(255,220,160,0.6)';
      for (var r2 = 0; r2 < 5; r2++) c.fillRect(w * 0.7 - 20 + Math.sin(t * 3 + r2) * 6, h * (0.48 + r2 * 0.04), 40 - r2 * 6, 2);
      // shore foam that comes and goes
      var shore = h * 0.75 + Math.sin(t * 1.2) * 5;
      c.fillStyle = '#f6dd9b';
      c.fillRect(0, shore, w, h - shore);
      c.fillStyle = 'rgba(255,255,255,0.8)';
      c.fillRect(0, shore - 3, w, 4);
      band(c, w, off * 0.8, 170, function (x2) {
        c.save();
        c.translate(x2, h * 0.78);
        c.rotate(Math.sin(t * 1.4) * 0.05);
        emoji(c, '🌴', 0, -30, 60);
        c.restore();
      });
      for (var g2 = 0; g2 < 2; g2++) emoji(c, '🕊', ((t * 25 + g2 * 200) % (w + 80)) - 40, h * (0.18 + g2 * 0.08), 14, 0.8);
    },
    dinner: function (c, w, h, t) {
      c.fillStyle = grad(c, h, [[0, '#2a0f1c'], [1, '#14070d']]);
      c.fillRect(0, 0, w, h);
      // window with moon and stars
      c.fillStyle = '#0d1636';
      c.fillRect(w * 0.12, h * 0.08, w * 0.34, h * 0.36);
      c.save();
      c.beginPath();
      c.rect(w * 0.12, h * 0.08, w * 0.34, h * 0.36);
      c.clip();
      stars(c, w, h, t);
      c.restore();
      emoji(c, '🌙', w * 0.36, h * 0.17, 26);
      c.strokeStyle = '#6b3a24';
      c.lineWidth = 5;
      c.strokeRect(w * 0.12, h * 0.08, w * 0.34, h * 0.36);
      c.beginPath();
      c.moveTo(w * 0.29, h * 0.08);
      c.lineTo(w * 0.29, h * 0.44);
      c.stroke();
      // string lights
      for (var i = 0; i < 14; i++) {
        var x = (i / 13) * w;
        var y = h * 0.05 + Math.sin(i * 0.9) * 6 + 10;
        var on = Math.sin(t * 3 + i) > -0.3;
        c.fillStyle = on ? 'rgba(255,214,120,0.95)' : 'rgba(255,214,120,0.3)';
        c.beginPath();
        c.arc(x, y, 3.5, 0, Math.PI * 2);
        c.fill();
      }
      // table and candles
      c.fillStyle = '#f3e6e0';
      c.fillRect(0, h * 0.74, w, h * 0.26);
      c.fillStyle = '#d9c6be';
      c.fillRect(0, h * 0.74, w, 4);
      [0.3, 0.7].forEach(function (cx, j) {
        var fx = w * cx;
        var fy = h * 0.66;
        c.fillStyle = '#fff6e0';
        c.fillRect(fx - 4, fy, 8, h * 0.08);
        var fl = 1 + Math.sin(t * 17 + j) * 0.12 + Math.sin(t * 7) * 0.08;
        var g = c.createRadialGradient(fx, fy - 6, 1, fx, fy - 6, 40 * fl);
        g.addColorStop(0, 'rgba(255,220,120,0.55)');
        g.addColorStop(1, 'rgba(255,200,100,0)');
        c.fillStyle = g;
        c.beginPath();
        c.arc(fx, fy - 6, 40 * fl, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = '#ffb02e';
        c.beginPath();
        c.ellipse(fx, fy - 7, 3.5, 7 * fl, 0, 0, Math.PI * 2);
        c.fill();
      });
      emoji(c, '🌹', w * 0.5, h * 0.7, 22);
    },
    park: function (c, w, h, t, off) {
      c.fillStyle = grad(c, h, [[0, '#ff9fd0'], [0.55, '#ffd6a0'], [1, '#ffe8c4']]);
      c.fillRect(0, 0, w, h);
      clouds(c, w, h, off * 0.2, t, 'rgba(255,255,255,0.7)');
      // ferris wheel turning
      var cx = w * 0.3 - (off * 0.3) % (w * 1.4);
      cx = ((cx % (w * 1.4)) + w * 1.4) % (w * 1.4) - w * 0.2;
      var cy = h * 0.4;
      var R = h * 0.26;
      c.strokeStyle = '#7a4a9e';
      c.lineWidth = 3;
      c.beginPath();
      c.arc(cx, cy, R, 0, Math.PI * 2);
      c.stroke();
      for (var k = 0; k < 8; k++) {
        var a = t * 0.4 + (k * Math.PI) / 4;
        c.beginPath();
        c.moveTo(cx, cy);
        c.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
        c.stroke();
        c.fillStyle = ['#ff5a7a', '#ffc23c', '#5ac8ff', '#7ce07c'][k % 4];
        c.fillRect(cx + Math.cos(a) * R - 7, cy + Math.sin(a) * R, 14, 12);
      }
      c.beginPath();
      c.moveTo(cx - 30, h * 0.8);
      c.lineTo(cx, cy);
      c.lineTo(cx + 30, h * 0.8);
      c.stroke();
      // coaster track
      c.strokeStyle = '#c0436b';
      c.beginPath();
      for (var x = 0; x <= w; x += 6) {
        var y = h * 0.42 + Math.sin((x + off * 0.5) * 0.03) * h * 0.12;
        if (x === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();
      // lights and balloons
      for (var i = 0; i < 16; i++) {
        c.fillStyle = 'hsla(' + ((i * 40 + t * 120) % 360) + ',90%,60%,' + (0.6 + 0.4 * Math.sin(t * 5 + i)) + ')';
        c.beginPath();
        c.arc((i / 15) * w, h * 0.72 + Math.sin(i) * 4, 3, 0, Math.PI * 2);
        c.fill();
      }
      for (var b = 0; b < 3; b++) emoji(c, '🎈', w * (0.2 + b * 0.3), h - ((t * 30 + b * 90) % (h + 60)), 22);
      c.fillStyle = '#e7c48e';
      c.fillRect(0, h * 0.8, w, h * 0.2);
    },
    cafe: function (c, w, h, t, off, o) {
      c.fillStyle = grad(c, h, [[0, '#f3dcc0'], [1, '#d4ab7f']]);
      c.fillRect(0, 0, w, h);
      // big window to the street
      c.fillStyle = o && o.rain ? '#6c7f96' : '#a9dcff';
      c.fillRect(w * 0.08, h * 0.08, w * 0.84, h * 0.42);
      c.save();
      c.beginPath();
      c.rect(w * 0.08, h * 0.08, w * 0.84, h * 0.42);
      c.clip();
      clouds(c, w, h, off * 0.3, t, 'rgba(255,255,255,0.8)');
      band(c, w, off * 0.6, 90, function (x) {
        c.fillStyle = '#8fa3b8';
        c.fillRect(x, h * 0.28, 60, h * 0.25);
      });
      if (o && o.rain) rain(c, w, h * 0.5, t);
      c.restore();
      c.strokeStyle = '#7a4a25';
      c.lineWidth = 6;
      c.strokeRect(w * 0.08, h * 0.08, w * 0.84, h * 0.42);
      // hanging lamps
      [0.25, 0.5, 0.75].forEach(function (lx, i) {
        var sw = Math.sin(t * 1.5 + i) * 4;
        c.strokeStyle = '#3b2a1a';
        c.lineWidth = 1.5;
        c.beginPath();
        c.moveTo(w * lx, 0);
        c.lineTo(w * lx + sw, h * 0.1);
        c.stroke();
        var g = c.createRadialGradient(w * lx + sw, h * 0.12, 2, w * lx + sw, h * 0.12, 50);
        g.addColorStop(0, 'rgba(255,220,140,0.6)');
        g.addColorStop(1, 'rgba(255,220,140,0)');
        c.fillStyle = g;
        c.beginPath();
        c.arc(w * lx + sw, h * 0.12, 50, 0, Math.PI * 2);
        c.fill();
        emoji(c, '💡', w * lx + sw, h * 0.11, 16);
      });
      // counter with cups and steam
      c.fillStyle = '#8a5a35';
      c.fillRect(0, h * 0.76, w, h * 0.24);
      [0.2, 0.8].forEach(function (cx, i) {
        emoji(c, '☕', w * cx, h * 0.72, 22);
        for (var s2 = 0; s2 < 3; s2++) {
          var p = (t * 0.6 + s2 / 3 + i * 0.5) % 1;
          c.fillStyle = 'rgba(255,255,255,' + (0.5 - p * 0.5) + ')';
          c.beginPath();
          c.arc(w * cx + Math.sin(p * 6 + i) * 5, h * 0.66 - p * 40, 4 + p * 4, 0, Math.PI * 2);
          c.fill();
        }
      });
      emoji(c, '🪴', w * 0.92, h * 0.68, 28);
    },
    aquarium: function (c, w, h, t, off) {
      c.fillStyle = grad(c, h, [[0, '#0b4f8a'], [0.6, '#1286b8'], [1, '#0c3d66']]);
      c.fillRect(0, 0, w, h);
      // light rays from the surface
      for (var r = 0; r < 5; r++) {
        c.fillStyle = 'rgba(180,230,255,' + (0.07 + 0.04 * Math.sin(t + r)) + ')';
        c.beginPath();
        var x = w * (0.1 + r * 0.2) + Math.sin(t * 0.5 + r) * 20;
        c.moveTo(x, 0);
        c.lineTo(x + 40, 0);
        c.lineTo(x + 90, h);
        c.lineTo(x + 20, h);
        c.fill();
      }
      var fish = ['🐠', '🐟', '🐡', '🦈', '🐙', '🐢'];
      var rr = rnd(21);
      for (var i = 0; i < 9; i++) {
        var sp = 20 + rr() * 40;
        var dir = rr() < 0.5 ? 1 : -1;
        var y = h * (0.15 + rr() * 0.6);
        var fx = ((rr() * w + t * sp * dir + off * 0.4) % (w + 80) + w + 80) % (w + 80) - 40;
        c.save();
        c.translate(fx, y + Math.sin(t * 2 + i) * 6);
        if (dir > 0) c.scale(-1, 1);
        emoji(c, fish[i % fish.length], 0, 0, 20 + (i % 3) * 6);
        c.restore();
      }
      // bubbles
      for (var b = 0; b < 20; b++) {
        var bx = (rr() * w + Math.sin(t + b) * 6) % w;
        var by = h - ((t * (30 + rr() * 30) + rr() * h) % h);
        c.strokeStyle = 'rgba(255,255,255,0.6)';
        c.beginPath();
        c.arc(bx, by, 2 + rr() * 3, 0, Math.PI * 2);
        c.stroke();
      }
      c.fillStyle = '#d9c58e';
      c.fillRect(0, h * 0.88, w, h * 0.12);
      band(c, w, off * 0.7, 60, function (x2, i2) {
        emoji(c, i2 % 2 ? '🪸' : '🌿', x2, h * 0.86, 24);
      });
    },
    festival: function (c, w, h, t, off) {
      c.fillStyle = grad(c, h, [[0, '#0b0a2a'], [0.7, '#2a1a4a'], [1, '#4a2050']]);
      c.fillRect(0, 0, w, h);
      stars(c, w, h, t);
      // fireworks every ~1.6 s
      for (var f = 0; f < 3; f++) {
        var cyc = (t + f * 0.55) % 1.6;
        var rr = rnd(Math.floor((t + f * 0.55) / 1.6) * 7 + f);
        var fx = w * (0.15 + rr() * 0.7);
        var fy = h * (0.12 + rr() * 0.25);
        var hue = Math.floor(rr() * 360);
        if (cyc < 0.5) {
          c.fillStyle = 'hsl(' + hue + ',90%,70%)';
          c.fillRect(fx - 1, h - (h - fy) * (cyc / 0.5), 2, 8);
        } else {
          var p = (cyc - 0.5) / 1.1;
          for (var k = 0; k < 18; k++) {
            var a = (k / 18) * Math.PI * 2;
            c.fillStyle = 'hsla(' + hue + ',90%,65%,' + (1 - p) + ')';
            c.beginPath();
            c.arc(fx + Math.cos(a) * 50 * p, fy + Math.sin(a) * 50 * p + p * p * 20, 2.5, 0, Math.PI * 2);
            c.fill();
          }
        }
      }
      // lanterns
      for (var l = 0; l < 6; l++) emoji(c, '🏮', ((l * 90 - off * 0.3) % (w + 60) + w + 60) % (w + 60) - 30, h * 0.48 + Math.sin(t * 2 + l) * 5, 20);
      // stalls
      band(c, w, off * 0.7, 120, function (x, i) {
        c.fillStyle = i % 2 ? '#c9403a' : '#e3b13a';
        c.fillRect(x, h * 0.62, 90, 14);
        c.fillStyle = '#5a2a1a';
        c.fillRect(x + 4, h * 0.66, 82, h * 0.2);
        emoji(c, ['🍡', '🍢', '🎏', '🍭'][((i % 4) + 4) % 4], x + 45, h * 0.72, 20);
      });
      c.fillStyle = '#2a1830';
      c.fillRect(0, h * 0.86, w, h * 0.14);
    },
    museum: function (c, w, h, t, off) {
      c.fillStyle = grad(c, h, [[0, '#ece7df'], [1, '#cfc6b8']]);
      c.fillRect(0, 0, w, h);
      band(c, w, off * 0.5, 150, function (x, i) {
        // pillar
        c.fillStyle = '#ddd5c8';
        c.fillRect(x, h * 0.06, 26, h * 0.72);
        c.fillStyle = '#c4b9a8';
        c.fillRect(x - 4, h * 0.06, 34, 8);
        // painting with a plant and a spotlight
        var px = x + 50;
        var g = c.createRadialGradient(px + 30, h * 0.15, 2, px + 30, h * 0.3, 70);
        g.addColorStop(0, 'rgba(255,250,220,0.6)');
        g.addColorStop(1, 'rgba(255,250,220,0)');
        c.fillStyle = g;
        c.fillRect(px - 20, h * 0.05, 100, h * 0.5);
        c.fillStyle = '#b8862b';
        c.fillRect(px - 4, h * 0.2, 68, 58);
        c.fillStyle = '#fff8e8';
        c.fillRect(px, h * 0.2 + 4, 60, 50);
        emoji(c, ['🌻', '🌵', '🍄', '🌹', '🎃', '🌽'][((i % 6) + 6) % 6], px + 30, h * 0.2 + 29, 30);
      });
      c.fillStyle = '#9a8e7c';
      c.fillRect(0, h * 0.78, w, h * 0.22);
      c.fillStyle = 'rgba(255,255,255,0.15)';
      for (var k = 0; k < w; k += 40) c.fillRect(k, h * 0.78, 2, h * 0.22);
    },
    trip: function (c, w, h, t, off) {
      c.fillStyle = grad(c, h, [[0, '#ffb0c8'], [0.5, '#ffd9b0'], [1, '#a8dcff']]);
      c.fillRect(0, 0, w, h);
      c.fillStyle = '#ffef9a';
      c.beginPath();
      c.arc(w * 0.5, h * 0.55, 40, 0, Math.PI * 2);
      c.fill();
      clouds(c, w, h, off * 0.3, t, 'rgba(255,255,255,0.85)');
      // floating islands (Sky City)
      band(c, w, off * 0.5, 160, function (x, i) {
        var y = h * 0.42 + Math.sin(t + i) * 8;
        c.fillStyle = '#7cc15a';
        c.beginPath();
        c.ellipse(x + 50, y, 50, 12, 0, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = '#8a5a35';
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x + 100, y);
        c.lineTo(x + 50, y + 40);
        c.fill();
        emoji(c, i % 2 ? '🏰' : '🌳', x + 50, y - 18, 26);
      });
      // sea of clouds below
      c.fillStyle = 'rgba(255,255,255,0.95)';
      for (var x2 = -40; x2 < w + 40; x2 += 36) {
        c.beginPath();
        c.arc(x2 + ((off * 0.9) % 36), h * 0.84 + Math.sin(x2 + t) * 3, 30, 0, Math.PI * 2);
        c.fill();
      }
      emoji(c, '✈️', ((t * 40) % (w + 80)) - 40, h * 0.15, 20);
    },
  };
  PLACES.honeymoon = PLACES.beach;
  PLACES.proposal = PLACES.beach;

  /* ------------------------------------------------ the game's own assets */

  var MP = window.PvZMP;

  // A sound of the game (cosmetic: never fails).
  I.sfx = function sfx(name) {
    try {
      if (MP.game && MP.game.play) MP.game.play(name);
    } catch (e) {}
  };

  // The game's music for each place: [world, part]. The trip plays the music
  // of the world you went to.
  var MUSIC = {
    garden: ['Modern', 'MG'], cinema: ['Dark', 'MG'], beach: ['Beach', 'UB'], dinner: ['Ballad', 'MG'],
    park: ['Pop', 'UB'], cafe: ['Lostcity', 'MG'], aquarium: ['Beach', 'MG'], festival: ['Kongfu', 'UB'],
    museum: ['Egypt', 'MG'], honeymoon: ['Sky', 'MG'], proposal: ['Ballad', 'UB'], duo: ['Pop', 'MG'],
  };
  var musicOn = false;
  function soundManager() {
    if (!window.System || !System.import) return Promise.resolve(null);
    return System.import('chunks:///_virtual/SoundManager.ts')
      .then(function (m) {
        return m && m.SoundManager && m.SoundManager.component;
      })
      .catch(function () {
        return null;
      });
  }
  // Plays the music of a place (or of a world: {world}); null stops it.
  I.sceneMusic = function sceneMusic(place, world) {
    var pick = world ? [world, 'MG'] : place && MUSIC[place];
    if (!pick && !musicOn) return;
    soundManager().then(function (c) {
      if (!c) return;
      try {
        if (pick) {
          musicOn = true;
          c.switchMusic(pick[0], pick[1], true);
        } else {
          musicOn = false;
          c.stopMusic();
          // The menu has no music: forget the track so a level starts its own.
          c.currentWorldMusic = null;
          c.currentMusicSort = null;
          c.nextToPlay = null;
          c.nextSortToPlay = null;
        }
      } catch (e) {}
    });
  };

  // A zombie of the game: its packet art when it is ready, 🧟 until then.
  I.zombieArt = function zombieArt(type, node) {
    var url = MP.cards && MP.cards.ready ? MP.cards.zombie(type) : null;
    if (url) {
      node.textContent = '';
      node.classList.add('pvzx-zart');
      node.appendChild(Object.assign(document.createElement('img'), { src: url, alt: '', draggable: false }));
      return node;
    }
    if (!node.textContent) node.textContent = '🧟';
    if ((node._tries = (node._tries || 0) + 1) < 8) {
      setTimeout(function () {
        if (node.isConnected || node._tries < 2) zombieArt(type, node);
      }, 350);
    }
    return node;
  };
  // Starts drawing the packets a date will need.
  I.zombieWarm = function zombieWarm(types) {
    if (!MP.cards || !MP.cards.ready) return;
    (types || ['tutorial', 'tutorial_armor1', 'tutorial_armor2']).forEach(function (t) {
      MP.cards.zombie(t);
    });
  };

  I.sceneArt = function sceneArt(place, opts) {
    var cv = document.createElement('canvas');
    cv.className = 'pvzx-art';
    var c = cv.getContext('2d');
    var draw = PLACES[place] || PLACES.garden;
    var o = opts || {};
    var born = performance.now();
    (function frame(now) {
      if (!cv.isConnected) {
        // Off the page: wait while its owner says it may come back (a date
        // during a mini-game), else up to 10 s for the first time.
        if (o.alive ? o.alive() : !cv._started && now - born < 10000) requestAnimationFrame(frame);
        return;
      }
      cv._started = true;
      var w = cv.clientWidth || 320;
      var h = cv.clientHeight || 260;
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
      }
      var t = now / 1000;
      var off = scroll(now);
      try {
        draw(c, w, h, t, off, o);
        if (o.rain || (I.scene && I.scene.weather === 'rain' && place !== 'cafe')) rain(c, w, h, t);
        if (o.fireflies) fireflies(c, w, h, t);
        if (o.landmark) emoji(c, o.landmark, w * 0.8, h * 0.3 + Math.sin(t) * 4, 44, 0.95);
      } catch (e) {}
      requestAnimationFrame(frame);
    })(performance.now());
    return cv;
  };
})();
