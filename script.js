/* Leggett Capital Partners — interactions */
(function () {
  'use strict';

  // --- Sticky nav state ---
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Mobile menu ---
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const setMenu = (open) => {
    links.classList.toggle('open', open);
    nav.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  // --- Reveal on scroll ---
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          const sibs = [...e.target.parentElement.children].filter((c) => c.classList.contains('reveal'));
          const idx = sibs.indexOf(e.target);
          e.target.style.transitionDelay = Math.min(idx, 5) * 80 + 'ms';
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  // --- Count-up stats ---
  const nums = document.querySelectorAll('.stat__num[data-count]');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur = 1500;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target + suffix;
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { animateCount(e.target); so.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    nums.forEach((n) => so.observe(n));
  }
})();

/* ---- team member "about" modal ---- */
(function () {
  'use strict';
  // college.colleges: array of { name, logo } — logos live in assets/colleges/
  const MEMBERS = {
    john: {
      name: 'John Leggett', title: 'Founder & Managing Partner', company: 'Leggett Capital Partners',
      photo: 'assets/team/john.jpg',
      colleges: [{ name: 'University of North Carolina at Chapel Hill', logo: 'assets/colleges/unc.png' }],
      bio: [
        `Founder and Managing Partner of Houston-based private equity firm Leggett Capital Partners, John Leggett is an avid entrepreneur and investor. With an extensive portfolio spanning real estate, energy and alternatives, the Leggett Capital Partners portfolio has a total asset value in excess of $350 million. John is the co-founder of multiple portfolio companies including oil & gas investment firm Cannon Field, commercial real estate firm NewFound Partners, nationally recognized building firm On Point Custom Homes, and Frontier Title, which operates 17 locations across Texas, Florida, North Carolina, Utah and Tennessee.`,
        `John started his career in investment banking as an analyst with Deutsche Bank and then in equity research with Credit Lyonnais, both covering the oil & gas industry. His passion for real estate turned into a full-time job when he launched On Point Custom Homes and left investment banking in 2004. From there, John's investment endeavors continued to expand, venturing into title, oil & gas, renewables and commercial real estate across the United States.`,
        `John graduated from the University of North Carolina at Chapel Hill, where he earned a BS in Business and a Master's in Accounting. His accolades include being named to the Houston Business Journal's 40 Under 40, with multiple businesses named to the Inc. 5000, Houston's Best Places to Work, and Houston's Fastest-Growing Companies.`,
      ],
    },
    ashley: {
      name: 'Ashley Tucker Zatcoff', title: 'Partner, Chief Operating Officer & Chief Compliance Officer', company: 'Leggett Capital Partners',
      photo: 'assets/team/ashley.jpg',
      colleges: [{ name: 'University of South Carolina', logo: 'assets/colleges/south-carolina.png' }],
      bio: [
        `Ashley is a Partner and the Chief Operating Officer at Leggett Capital Partners, supporting operational success across all LV portfolio companies and investments. With an extensive background in project management and communication, she works closely with internal and external parties to ensure our projects are completed efficiently and with high-quality outcomes.`,
        `She serves as the primary contact for investor communications and manages all investor onboarding and reporting via the Leggett Capital Partners investor portal. With a passion for organization and results, she manages the team and daily workflow to ensure our investment goals are met through strategic, integrated operations. Ashley is a Houston native who graduated from the University of South Carolina with a BA in Public Relations and Business.`,
      ],
    },
    earl: {
      name: 'Earl Correll', title: 'Partner & CEO, On Point Custom Homes', company: 'On Point Custom Homes',
      photo: 'assets/team/earl.jpg',
      colleges: [{ name: 'University of North Carolina at Chapel Hill', logo: 'assets/colleges/unc.png' }],
      bio: [
        `Earl has worked alongside John for over twenty years and serves as Partner and CEO of On Point Custom Homes as part of Leggett Capital Partners. He plays a critical role in all investment projects, particularly managing projects through every phase of the development cycle: feasibility, design, pre-construction and construction.`,
        `As CEO and President of On Point Custom Homes, a nationally and locally recognized custom homebuilding firm, Earl started his career in residential real estate as a project manager and now holds Graduate Master Builder and Certified Green Professional designations from the National Association of Home Builders. He was recently named one of Houston's Most Admired CEOs by the Houston Business Journal and serves as President of the Briargrove Homeowners Association.`,
      ],
    },
    brian: {
      name: 'Brian Weinberg', title: 'Partner & CEO, Cannon Field', company: 'Cannon Field',
      photo: 'assets/team/brian.jpg',
      colleges: [{ name: 'Virginia Tech', logo: 'assets/colleges/virginia-tech.png' }],
      bio: [
        `Brian serves as a Partner and CEO of the Oil & Gas and Minerals Investment Group within Leggett Capital Partners, managing a diverse portfolio spanning oil & gas, from upstream, downstream and petrochemical to mineral projects. After more than ten years at ExxonMobil, one of the world's largest oil & gas companies, Brian brought his diversified experience across upstream, downstream and petrochemicals to lead the expansion of mineral investment opportunities at Leggett Capital Partners.`,
        `He is instrumental in project management, negotiation, operations, and financial & data analysis. Brian's extensive industry experience, paired with his enthusiasm for big-data analysis and financial modeling, gives him a unique perspective for creating low-risk, high-return mineral opportunities for our investors. Brian earned a degree in Chemical Engineering from Virginia Tech.`,
      ],
    },
    brad: {
      name: 'Brad Elmore', title: 'Managing Principal, NewFound Partners', company: 'NewFound Partners',
      photo: 'assets/team/brad.jpg',
      colleges: [
        { name: 'University of Tennessee', logo: 'assets/colleges/tennessee.png' },
        { name: 'Rice University (MBA)', logo: 'assets/colleges/rice.png' },
      ],
      bio: [
        `Brad serves as Managing Principal and Head of the Commercial Real Estate Investment Group within Leggett Capital Partners, overseeing all commercial assets, land acquisitions, new-market opportunities and investment strategies. He brings more than 15 years of experience across a broad spectrum of commercial real estate asset classes to the team.`,
        `Prior to joining NewFound Partners to focus on principal-side investments, Brad worked at NewQuest Properties and HFF LP, where he closed over 300 real estate transactions with an aggregate value of more than $3 billion. A regular recipient of CoStar's "Power Broker" and the Houston Business Journal's "Heavy Hitter" awards, he serves on the boards of the Houston Racquet Club and Harris County Improvement District 14. Brad received a BA in Economics from the University of Tennessee and an MBA from Rice University, where he served as President of his class.`,
      ],
    },
    eric: {
      name: 'Eric Kline', title: 'Managing Principal, Starlight Campgrounds', company: 'Starlight Campgrounds',
      photo: 'assets/team/eric.jpg',
      colleges: [{ name: 'University of North Carolina at Chapel Hill', logo: 'assets/colleges/unc.png' }],
      bio: [
        `Eric Kline is a Managing Principal of Starlight Campgrounds, the firm's recreational-RV platform, a growing network of premium outdoor RV destinations across the Midwest.`,
      ],
    },
    andrew: {
      name: 'Andrew Herrick', title: 'Senior Accountant', company: 'Leggett Capital Partners',
      photo: 'assets/team/placeholder.png',
      colleges: [
        { name: 'University of Houston', logo: 'assets/colleges/houston.png' },
        { name: 'United States Marine Corps', logo: 'assets/badges/marine-corps.png' },
      ],
      bio: [
        `Andrew Herrick is a Senior Accountant at Leggett Capital Partners, where he manages the accounting and financial analysis for various partnerships in our Oil & Gas and Opportunities Groups. In this role, he oversees financial reporting, budgeting, operational analysis, and accounting processes that support strategic decision-making and long-term growth.`,
        `Prior to joining Leggett Capital Partners, Andrew worked in public accounting at Reimer McGuinness Hess, where he provided accounting, tax, and advisory services to a diverse portfolio of businesses, developing expertise in financial reporting, tax compliance, and client consulting. He also served as a Senior Accountant with Safety Vision, further expanding his experience in corporate accounting, financial statement preparation, and multi-state tax reporting.`,
        `Before beginning his career in accounting, Andrew proudly served in the United States Marine Corps, where he developed the discipline, leadership, and commitment to excellence that continue to shape his professional approach today.`,
      ],
    },
    hiba: {
      name: 'Hiba Alkhuzaie', title: 'Operations Coordinator', company: 'Leggett Capital Partners',
      photo: 'assets/team/hiba.jpg',
      colleges: [{ name: 'University of Illinois', logo: 'assets/colleges/illinois.png' }],
      bio: [
        `Hiba Alkhuzaie is an Operations Coordinator at Leggett Capital Partners, where she supports the firm's day-to-day operations across its portfolio companies and investments. She helps keep projects, reporting, and internal workflows running smoothly so the team can stay focused on serving investors and executing on new opportunities. Hiba is a graduate of the University of Illinois.`,
      ],
    },
    seslee: {
      name: 'Seslee Skrabanek', title: 'Senior Accountant', company: 'Leggett Capital Partners',
      photo: 'assets/team/seslee.jpg',
      colleges: [{ name: 'Texas A&M University', logo: 'assets/colleges/texas-am.png' }],
      bio: [
        `Seslee Skrabanek is a Senior Accountant at Leggett Capital Partners, where she manages accounting and financial reporting across the firm's partnerships and portfolio companies. She supports budgeting, reconciliations, and the accounting processes that keep the firm's investments accurate and well documented. Seslee is a graduate of Texas A&M University.`,
      ],
    },
  };

  // Merge CMS-edited titles/bios (from content/site.json) over the defaults above.
  function applySiteTeam(S) {
    if (!S || !S.team) return;
    Object.keys(S.team).forEach(function (k) {
      if (!MEMBERS[k]) return;
      if (S.team[k].modalTitle) MEMBERS[k].title = S.team[k].modalTitle;
      if (S.team[k].bio) MEMBERS[k].bio = S.team[k].bio;
      if (S.team[k].photo) MEMBERS[k].photo = S.team[k].photo;
    });
  }
  if (window.SITE) applySiteTeam(window.SITE);
  document.addEventListener('site:ready', function (e) { applySiteTeam(e.detail); });

  const modal = document.getElementById('memberModal');
  if (!modal) return;
  const $ = (id) => modal.querySelector(id);
  let lastFocus = null;

  function chipHTML(list) { // white circle chips for the dark team card
    if (!list || !list.length) return '';
    return list.filter((c) => c.logo)
      .map((c) => '<span class="cchip"><img src="' + c.logo + '" alt="' + c.name + '" /></span>').join('');
  }
  function eduHTML(list) { // logos for the light modal
    if (!list || !list.length) return '';
    return list.map((c) => c.logo
      ? '<span class="mm__clogo"><img src="' + c.logo + '" alt="' + c.name + '" /></span>'
      : '<span>' + c.name + '</span>').join('');
  }

  // fill each card's college slot + wire open
  document.querySelectorAll('.member[data-member]').forEach((card) => {
    const m = MEMBERS[card.dataset.member];
    if (!m) return;
    const slot = card.querySelector('[data-college]');
    const html = chipHTML(m.colleges);
    if (slot) { if (html) slot.innerHTML = html; else slot.remove(); }
    const open = () => openModal(card.dataset.member, card);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });

  // "led by [name]" links anywhere on the page open that person's bio modal
  document.querySelectorAll('[data-bio]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const id = el.dataset.bio;
      if (MEMBERS[id]) { e.preventDefault(); openModal(id, el); }
    });
  });

  function openModal(id, source) {
    const m = MEMBERS[id];
    if (!m) return;
    lastFocus = source || document.activeElement;
    $('#mmPhoto').src = m.photo; $('#mmPhoto').alt = m.name;
    $('#mmCompany').textContent = m.company;
    $('#mmName').textContent = m.name;
    $('#mmTitle').textContent = m.title;
    const edu = eduHTML(m.colleges);
    $('#mmEdu').style.display = edu ? 'flex' : 'none';
    $('#mmCollege').innerHTML = edu;
    $('#mmBio').innerHTML = m.bio.map((p) => '<p>' + p + '</p>').join('');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.mm__close').focus();
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();

/* ---- portfolio sector tabs ---- */
(function () {
  'use strict';
  const tabs = document.querySelectorAll('.pf__tab');
  const panels = document.querySelectorAll('.pf__panel');
  if (!tabs.length) return;
  function select(id) {
    tabs.forEach((t) => {
      const on = t.dataset.tab === id;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
    });
    panels.forEach((p) => {
      const on = p.dataset.panel === id;
      p.classList.toggle('is-active', on);
      p.hidden = !on;
    });
  }
  tabs.forEach((t) => t.addEventListener('click', () => select(t.dataset.tab)));
})();

/* ---- active-section nav highlight + back-to-top ---- */
(function () {
  'use strict';
  const links = [...document.querySelectorAll('.nav__links a[href^="#"]')];
  const map = {};
  links.forEach((a) => { const id = a.getAttribute('href').slice(1); if (id) map[id] = a; });
  const sections = Object.keys(map).map((id) => document.getElementById(id)).filter(Boolean);
  const btn = document.getElementById('toTop');

  function onScroll() {
    const y = window.scrollY + 140; // offset for the fixed header
    let currentId = null;
    sections.forEach((s) => { if (s.offsetTop <= y) currentId = s.id; });
    links.forEach((a) => a.classList.toggle('is-current', currentId != null && map[currentId] === a));
    if (btn) btn.classList.toggle('show', window.scrollY > 640);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  if (btn) btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ---- request access form (email / mailto) ---- */
(function () {
  'use strict';
  const form = document.getElementById('requestForm');
  if (!form) return;
  const status = document.getElementById('requestStatus');
  const say = (msg, err) => {
    if (!status) return;
    status.hidden = false;
    status.textContent = msg;
    status.classList.toggle('is-error', !!err);
  };
  const val = (n) => { const el = form.elements[n]; return el && el.value ? el.value.trim() : ''; };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = val('name');
    const email = val('email');
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      say('Please enter your name and a valid email address.', true);
      return;
    }
    const body = [
      'Name: ' + name,
      'Email: ' + email,
      'Firm / Company: ' + (val('firm') || '—'),
      'Investor type: ' + val('type'),
      'Accredited investor: ' + (form.elements['accredited'].checked ? 'Yes' : 'Not indicated'),
      '',
      'Message:',
      (val('message') || '—'),
    ].join('\r\n');
    const href = 'mailto:investors@leggettventures.com'
      + '?subject=' + encodeURIComponent('Investor inquiry — ' + name)
      + '&body=' + encodeURIComponent(body);
    window.location.href = href;
    say('Thanks, ' + name.split(' ')[0] + ' — your email is ready to send in your mail app. If it didn’t open, email investors@leggettventures.com directly.', false);
  });
})();
