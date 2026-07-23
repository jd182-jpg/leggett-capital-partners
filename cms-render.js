/* Reads content/site.json and fills editable content into the page.
   The HTML already contains the current content as a fallback, so if this
   file or the JSON ever fails to load, the site still renders normally. */
(function () {
  'use strict';
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function set(sel, val, html) {
    var el = document.querySelector(sel);
    if (!el || val == null) return;
    if (html) el.innerHTML = val; else el.textContent = val;
  }
  function fill(el, val, html) {
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

      // Stats (set data-* before the count-up observer fires)
      if (S.stats) {
        var statEls = document.querySelectorAll('.stats .stat');
        S.stats.forEach(function (st, i) {
          if (!statEls[i]) return;
          var num = statEls[i].querySelector('.stat__num');
          if (num) {
            if (st.count != null) num.setAttribute('data-count', st.count);
            num.setAttribute('data-prefix', st.prefix || '');
            num.setAttribute('data-suffix', st.suffix || '');
            num.textContent = (st.prefix || '') + (st.count != null ? st.count : '') + (st.suffix || '');
          }
          var lab = statEls[i].querySelector('.stat__label');
          if (lab && st.label != null) lab.textContent = st.label;
        });
      }

      // Approach
      if (S.approach) {
        set('#approach .section__head .section__title', S.approach.title);
        set('#approach .section__head .section__lead', S.approach.lead, true);
        var pillars = document.querySelectorAll('#approach .pillars .pillar');
        (S.approach.pillars || []).forEach(function (p, i) {
          if (!pillars[i]) return;
          fill(pillars[i].querySelector('h3'), p.heading);
          fill(pillars[i].querySelector('p'), p.text);
        });
      }

      // Why
      if (S.why) {
        set('#why .section__head .section__title', S.why.title);
        var items = document.querySelectorAll('#why .why .why__item');
        (S.why.items || []).forEach(function (it, i) {
          if (!items[i]) return;
          fill(items[i].querySelector('h3'), it.heading);
          fill(items[i].querySelector('p'), it.text);
        });
      }

      // Portfolio
      if (S.portfolio) {
        var P = S.portfolio;
        set('#portfolio .section__head .section__title', P.section_title);
        set('#portfolio .section__head .section__lead', P.section_lead);
        set('#portfolio [data-panel="oil"] .pf__intro p', P.oil_intro, true);
        var ostats = document.querySelectorAll('#portfolio [data-panel="oil"] .pf__stats > div');
        (P.oil_stats || []).forEach(function (s, i) {
          if (!ostats[i]) return;
          fill(ostats[i].querySelector('b'), s.num);
          fill(ostats[i].querySelector('span'), s.label);
        });
        var funds = document.querySelectorAll('#portfolio [data-panel="oil"] .pf__fund');
        (P.oil_funds || []).forEach(function (f, i) {
          if (!funds[i]) return;
          fill(funds[i].querySelector('p'), f.desc);
          fill(funds[i].querySelector('.pf__fund-status'), f.status);
        });
        set('#portfolio [data-panel="re"] .pf__intro p', P.re_intro, true);
        var reSmalls = document.querySelectorAll('#portfolio [data-panel="re"] .pf__logos .pf__logo small');
        (P.re_labels || []).forEach(function (t, i) { if (reSmalls[i]) reSmalls[i].innerHTML = t; });
        set('#portfolio [data-panel="strat"] .pf__intro p', P.opp_intro, true);
        var oppSmalls = document.querySelectorAll('#portfolio [data-panel="strat"] .pf__logos .pf__logo small');
        (P.opp_labels || []).forEach(function (t, i) { if (oppSmalls[i]) oppSmalls[i].innerHTML = t; });
      }

      // Story / Timeline
      if (S.story) {
        set('#story .section__head .section__title', S.story.title);
        set('#story .section__head .section__lead', S.story.lead, true);
        var nodes = document.querySelectorAll('#story .tl__node');
        (S.story.milestones || []).forEach(function (m, i) {
          if (!nodes[i]) return;
          fill(nodes[i].querySelector('.tl__year'), m.year);
          fill(nodes[i].querySelector('.tl__event b'), m.name);
          fill(nodes[i].querySelector('.tl__event span'), m.category, true);
          var link = nodes[i].querySelector('.tl__link');
          if (link && m.url) link.setAttribute('href', m.url);
        });
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

      // Team cards (title lines + photo). Bios/modal handled in script.js via window.SITE.
      if (S.team) {
        Object.keys(S.team).forEach(function (key) {
          var m = S.team[key];
          var card = document.querySelector('#team .member[data-member="' + key + '"]');
          if (!card) return;
          var p = card.querySelector('p');
          if (p) {
            var html = esc(m.role) + '<br /><span>' + esc(m.company) + '</span>';
            if (m.extra) html += '<br />' + esc(m.extra);
            p.innerHTML = html;
          }
          var img = card.querySelector('.member__photo img');
          if (img && m.photo) img.setAttribute('src', m.photo);
        });
      }

      document.dispatchEvent(new CustomEvent('site:ready', { detail: S }));
    })
    .catch(function () { /* keep baked-in HTML fallback */ });
})();
