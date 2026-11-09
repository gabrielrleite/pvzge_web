/*
 * PvZ2 Gardendless - Plant Match: progression of the dates.
 *
 * Tickets (🎟) are won with the stars of the dates and the weekly missions,
 * and spent in the shop: looks (yours for good), gifts (unlocked in the
 * planner, where they still cost ♥) and the engagement ring, used up by the
 * proposal. Three missions a week, picked from the week number, so every
 * player has the same ones. Kept in 'matchProg' (synced like the rest of the
 * Match progress):
 *   {tickets, owned: {'look:crown': 1}, rings, proposed: {code: at},
 *    week, m: {mission: count}, claimed: {mission: 1}, claimedTotal,
 *    weekPlaces: [], places: {place: bestStars}}
 */
(function () {
  'use strict';

  var MP = window.PvZMP;
  var X = window.PvZX;
  var el = MP.util.el;
  var I = X.matchI;
  var MT = X.matchText;
  var SC = MT.SCENE;
  var PERS = MT.PERS;
  var L = I.L;

  var KEY = 'matchProg';
  var FRESH = ['aquarium', 'festival', 'museum', 'trip'];
  var PER_WEEK = 3;

  // Weeks start on Monday (day 0 of the epoch was a Thursday).
  I.weekId = function weekId(now) {
    return Math.floor(((now || Date.now()) / 86400000 + 3) / 7);
  };

  function seeded(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), a | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  I.weekMissions = function weekMissions(week) {
    var r = seeded((week || I.weekId()) * 7919);
    var ids = Object.keys(SC.missions);
    for (var i = ids.length - 1; i > 0; i--) {
      var j = Math.floor(r() * (i + 1));
      var x = ids[i];
      ids[i] = ids[j];
      ids[j] = x;
    }
    return ids.slice(0, PER_WEEK);
  };

  I.prog = function prog() {
    var pr = X.store.get(KEY, null) || {};
    pr.tickets = Math.max(0, pr.tickets | 0);
    pr.owned = pr.owned || {};
    pr.rings = Math.max(0, pr.rings | 0);
    pr.proposed = pr.proposed || {};
    pr.places = pr.places || {};
    pr.claimedTotal = pr.claimedTotal | 0;
    var week = I.weekId();
    if (pr.week !== week) {
      pr.week = week;
      pr.m = {};
      pr.claimed = {};
      pr.weekPlaces = [];
    }
    pr.m = pr.m || {};
    pr.claimed = pr.claimed || {};
    pr.weekPlaces = pr.weekPlaces || [];
    return pr;
  };
  I.saveProg = function saveProg(pr) {
    X.store.set(KEY, pr);
  };

  I.ownsLook = function ownsLook(id) {
    var lk = SC.looks[id];
    return !!lk && (!lk.shop || !!I.prog().owned['look:' + id]);
  };
  I.ownsGift = function ownsGift(id) {
    var g = SC.gifts[id];
    if (!g || g.only) return false;
    return !g.shop || !!I.prog().owned['gift:' + id];
  };
  I.hasRing = function hasRing() {
    return I.prog().rings > 0;
  };
  I.proposedTo = function proposedTo(code) {
    return !!I.prog().proposed[code];
  };
  // The proposal said yes: the ring is hers now.
  I.acceptProposal = function acceptProposal(code) {
    var pr = I.prog();
    pr.rings = Math.max(0, pr.rings - 1);
    pr.proposed[code] = Date.now();
    I.saveProg(pr);
    I.unlock(['match_proposal']);
  };

  function bump(pr, id, n) {
    pr.m[id] = (pr.m[id] || 0) + (n == null ? 1 : n);
  }

  // Something happened on a date; returns the tickets won (the stars).
  I.progEvent = function progEvent(kind, v) {
    var pr = I.prog();
    var won = 0;
    if (kind === 'date' && v && v.stars > 0) {
      won = v.stars + (v.stars >= 3 ? 1 : 0);
      pr.tickets += won;
      bump(pr, 'dates');
      if (v.stars >= 3) bump(pr, 'perfect');
      if (pr.weekPlaces.indexOf(v.place) < 0) pr.weekPlaces.push(v.place);
      pr.m.places = pr.weekPlaces.length;
      if (FRESH.indexOf(v.place) >= 0) bump(pr, 'fresh');
      pr.places[v.place] = Math.max(pr.places[v.place] || 0, v.stars);
      if (Object.keys(pr.places).length >= 8) I.unlock(['match_places']);
      if (v.place === 'honeymoon') I.unlock(['match_honeymoon']);
    } else if (kind === 'game') {
      if (v >= 15) bump(pr, 'game');
    } else if (kind === 'kiss' || kind === 'snack' || kind === 'talk' || kind === 'duo') {
      bump(pr, kind);
      if (kind === 'duo') I.unlock(['match_duo']);
    } else return 0;
    I.saveProg(pr);
    return won;
  };

  I.claimMission = function claimMission(id) {
    var pr = I.prog();
    var ms = SC.missions[id];
    if (!ms || pr.claimed[id] || (pr.m[id] || 0) < ms.n || I.weekMissions(pr.week).indexOf(id) < 0) return 0;
    pr.claimed[id] = 1;
    pr.tickets += ms.reward;
    pr.claimedTotal++;
    I.saveProg(pr);
    if (pr.claimedTotal >= 5) I.unlock(['match_missions']);
    return ms.reward;
  };

  I.buyItem = function buyItem(kind, id) {
    var pr = I.prog();
    var item = (kind === 'look' ? SC.looks : SC.gifts)[id];
    if (!item || !item.shop) return false;
    if (id !== 'ring' && pr.owned[kind + ':' + id]) return false;
    if (id === 'ring' && pr.rings > 0) return false;
    if (pr.tickets < item.shop) return false;
    pr.tickets -= item.shop;
    if (id === 'ring') pr.rings++;
    else pr.owned[kind + ':' + id] = Date.now();
    I.saveProg(pr);
    I.unlock(['match_shop']);
    return true;
  };

  /* --------------------------------------------------------------- views */

  function daysLeft() {
    var next = (I.weekId() + 1) * 7 - 3;
    return Math.max(1, Math.ceil(next - Date.now() / 86400000));
  }

  // The ticket count and the shop / missions buttons (top of the planner).
  I.progBar = function progBar(plan) {
    var P = SC.prog;
    var pr = I.prog();
    var ready = I.weekMissions(pr.week).filter(function (id) {
      return !pr.claimed[id] && (pr.m[id] || 0) >= SC.missions[id].n;
    }).length;
    var tab = function (id, text) {
      return el('button.pvzx-chip.pvzx-chip-btn' + (plan.tab === id ? '.pvzx-on' : ''), { text: text, onclick: function () {
        plan.tab = plan.tab === id ? 'scene' : id;
        I.render();
      } });
    };
    return el('div.pvzx-prog-bar', null, [
      el('b.pvzx-tickets', { text: L(P.tickets, { n: pr.tickets }) }),
      tab('shop', L(P.shop)),
      tab('missions', L(P.missions) + (ready ? ' (' + ready + ')' : '')),
    ]);
  };

  function who(list) {
    return (list || [])
      .map(function (k) {
        return PERS[k].icon + ' ' + I.gfix(L(PERS[k].name), 'f');
      })
      .join(', ');
  }

  I.shopList = function shopList(sheet) {
    var P = SC.prog;
    var pr = I.prog();
    sheet.appendChild(el('p.pvzx-small', { text: L(P.shopDesc) }));
    var row = function (kind, id, item) {
      var owned = id === 'ring' ? pr.rings > 0 : !!pr.owned[kind + ':' + id];
      var sub = item.only ? L(P.onlyProposal) : item.loves ? L(P.loves, { who: who(item.loves) }) : '';
      return el('div.pvzx-shop-item' + (owned ? '.pvzx-owned' : ''), null, [
        el('span.pvzx-shop-icon', { text: item.icon }),
        el('span.pvzx-date-text', null, [el('b', { text: L(item) }), sub ? el('small', { text: sub }) : null]),
        owned
          ? el('span.pvzx-shop-owned', { text: id === 'ring' ? L(P.ringOwned) : L(P.owned) })
          : el('button.mp-btn.mp-small' + (pr.tickets >= item.shop ? '.mp-green' : '.mp-brown'), { text: '🎟 ' + item.shop, onclick: function () {
              if (!I.buyItem(kind, id)) {
                if (MP.ui) MP.ui.toast(L(P.notEnough), 'bad');
                return;
              }
              I.sfx && I.sfx('playGiftboxOpenSound');
              if (MP.ui) MP.ui.toast(L(P.bought, { item: item.icon + ' ' + L(item) }), 'good');
              I.render();
            } }),
      ]);
    };
    sheet.appendChild(el('h4', { text: L(P.looks) }));
    Object.keys(SC.looks).forEach(function (id) {
      if (SC.looks[id].shop) sheet.appendChild(row('look', id, SC.looks[id]));
    });
    sheet.appendChild(el('h4', { text: L(P.gifts) }));
    Object.keys(SC.gifts).forEach(function (id) {
      if (SC.gifts[id].shop) sheet.appendChild(row('gift', id, SC.gifts[id]));
    });
    return sheet;
  };

  I.missionList = function missionList(sheet) {
    var P = SC.prog;
    var pr = I.prog();
    sheet.appendChild(el('h4', { text: L(P.missionsTitle) }));
    I.weekMissions(pr.week).forEach(function (id) {
      var ms = SC.missions[id];
      var n = Math.min(ms.n, pr.m[id] || 0);
      var done = n >= ms.n;
      sheet.appendChild(
        el('div.pvzx-shop-item' + (pr.claimed[id] ? '.pvzx-owned' : ''), null, [
          el('span.pvzx-shop-icon', { text: done ? '✅' : '📋' }),
          el('span.pvzx-date-text', null, [
            el('b', { text: L(ms) }),
            el('div.pvzx-mission-bar', null, [el('i', { style: 'width:' + Math.round((n / ms.n) * 100) + '%' })]),
            el('small', { text: n + '/' + ms.n + ' · 🎟 ' + ms.reward }),
          ]),
          pr.claimed[id]
            ? el('span.pvzx-shop-owned', { text: L(P.claimed) })
            : el('button.mp-btn.mp-small' + (done ? '.mp-green' : '.mp-brown'), { text: L(P.claim), disabled: !done, onclick: function () {
                var got = I.claimMission(id);
                if (!got) return;
                I.sfx && I.sfx('playLevelTaskComplete');
                if (MP.ui) MP.ui.toast(L(P.won, { n: got }), 'good');
                I.render();
              } }),
        ]),
      );
    });
    sheet.appendChild(el('p.pvzx-small', { text: L(P.missionsReset, { d: daysLeft() }) }));
    var visited = Object.keys(pr.places).length;
    sheet.appendChild(el('p.pvzx-small', { text: '🗺 ' + L(P.album, { n: visited, total: Object.keys(SC.places).length }) }));
    return sheet;
  };
})();
