/* Reads content/site.json and fills editable text into the page.
   The HTML already contains the current content as a fallback, so if this
   file or the JSON ever fails to load, the site still renders normally. */
(function () {
  'use strict';
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function set(sel, val, html) {
    const el = document.querySelector(sel);
    if (!el || val == null) return;
    if (html) el.innerHTML = val; else el.textContent = val;
  }

  fetch('content/site.json?cb=' + Date.now())
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function (S) {
      window.SITE = S;

      // Hero
      if (S.hero) {
        set('.hero__title', S.hero.title);
        set('.hero__sub', S.hero.subhead);
        set('.hero__tag', S.hero.tagline, true);
      }

      // Portfolio
      if (S.portfolio) {
        var P = S.portfolio;
        set('#portfolio [data-panel="oil"] .pf__intro p', P.oil_intro, true);
        var funds = document.querySelectorAll('#portfolio [data-panel="oil"] .pf__fund');
        (P.oil_funds || []).forEach(function (f, i) {
          if (!funds[i]) return;
          var p = funds[i].querySelector('p'); if (p && f.desc != null) p.textContent = f.desc;
          var st = funds[i].querySelector('.pf__fund-status'); if (st && f.status != null) st.textContent = f.status;
        });
        set('#portfolio [data-panel="re"] .pf__intro p', P.re_intro, true);
        var reSmalls = document.querySelectorAll('#portfolio [data-panel="re"] .pf__logos .pf__logo small');
        (P.re_labels || []).forEach(function (t, i) { if (reSmalls[i]) reSmalls[i].innerHTML = t; });
        set('#portfolio [data-panel="strat"] .pf__intro p', P.opp_intro, true);
        var oppSmalls = document.querySelectorAll('#portfolio [data-panel="strat"] .pf__logos .pf__logo small');
        (P.opp_labels || []).forEach(function (t, i) { if (oppSmalls[i]) oppSmalls[i].innerHTML = t; });
      }

      // Contact
      if (S.contact) {
        var blocks = document.querySelectorAll('.contact__right .contact__block');
        if (blocks[0] && S.contact.office != null) { var op = blocks[0].querySelector('p'); if (op) op.innerHTML = S.contact.office; }
        if (S.contact.email != null) {
          var a = document.querySelector('.contact__right .contact__block a[href^="mailto:"]');
          if (a) { a.textContent = S.contact.email; a.setAttribute('href', 'mailto:' + S.contact.email); }
        }
      }

      // Footer tagline
      if (S.footer) set('.footer__brand p', S.footer.tagline);

      // Team cards (visible title lines). Bios/modal handled in script.js via window.SITE.
      if (S.team) {
        Object.keys(S.team).forEach(function (key) {
          var m = S.team[key];
          var card = document.querySelector('#team .member[data-member="' + key + '"]');
          if (!card) return;
          var p = card.querySelector('p'); if (!p) return;
          var html = esc(m.role) + '<br /><span>' + esc(m.company) + '</span>';
          if (m.extra) html += '<br />' + esc(m.extra);
          p.innerHTML = html;
        });
      }

      document.dispatchEvent(new CustomEvent('site:ready', { detail: S }));
    })
    .catch(function () { /* keep baked-in HTML fallback */ });
})();
