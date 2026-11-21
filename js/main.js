// Individual Development Fund — интерактив
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // Тексты интерфейса по языку страницы (<html lang="...">)
  const pageLang = document.documentElement.lang;
  const lang = ['en', 'kk'].includes(pageLang) ? pageLang : 'ru';
  const t = {
    kk: { locale: 'kk-KZ', badEmail: 'Дұрыс e-mail мекенжайын енгізіңіз.', ok: 'Рақмет! Сіз қор жаңалықтарына жазылдыңыз.' },
    ru: { locale: 'ru-RU', badEmail: 'Пожалуйста, введите корректный e-mail.', ok: 'Спасибо! Вы подписаны на новости фонда.' },
    en: { locale: 'en-US', badEmail: 'Please enter a valid email address.', ok: 'Thank you! You are now subscribed to foundation news.' },
  }[lang];

  // Год в подвале
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  // Объявление
  const announce = $('#announce');
  $('.announce__close')?.addEventListener('click', () => announce.classList.add('is-hidden'));

  // Тень шапки при скролле
  const header = $('#header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Мобильное меню
  const burger = $('#burger');
  const nav = $('#nav');
  const toggleMenu = (open) => {
    // Меню открывается ровно под шапкой (над ней может быть полоса объявления)
    if (open) nav.style.setProperty('--nav-top', Math.max(0, header.getBoundingClientRect().bottom) + 'px');
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggleMenu(!nav.classList.contains('is-open')));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => toggleMenu(false)));

  // Фильтр событий
  const chips = $$('.chip');
  const events = $$('.event');
  const empty = $('#eventsEmpty');
  const applyFilter = (dir) => {
    chips.forEach((c) => c.classList.toggle('is-active', c.dataset.filter === dir));
    let shown = 0;
    events.forEach((e) => {
      const ok = dir === 'all' || e.dataset.dir === dir;
      e.classList.toggle('is-hidden', !ok);
      if (ok) shown++;
    });
    empty.hidden = shown > 0;
  };
  chips.forEach((c) => c.addEventListener('click', () => applyFilter(c.dataset.filter)));
  // Ссылки из карточек направлений сразу фильтруют события
  $$('.dir-card__link').forEach((a) => a.addEventListener('click', () => applyFilter(a.dataset.filter)));

  // Счётчики
  const animateCount = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 1400;
    const start = performance.now();
    const step = (t) => {
      const p = Math.min((t - start) / dur, 1);
      const v = Math.round(target * (1 - Math.pow(1 - p, 3)));
      el.textContent = v.toLocaleString(t.locale) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Появление при скролле
  const revealTargets = $$('.section__head, .mission__text, .dir-card, .format, .event, .news-card, .pub, .join__card, .band__inner, .stat');
  revealTargets.forEach((el) => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-visible');
        const num = en.target.querySelector('[data-count]');
        if (num) animateCount(num);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
    $$('[data-count]').forEach(animateCount);
  }

  // Подписка (демо: подключить к сервису рассылок)
  const form = $('#subscribeForm');
  const msg = $('#subscribeMsg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.textContent = t.badEmail;
      return;
    }
    msg.textContent = t.ok;
    form.reset();
  });
})();
