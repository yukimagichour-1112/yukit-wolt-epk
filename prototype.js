'use strict';
// SoundCloud is contacted only after a deliberate click. Direct links always work.
document.querySelectorAll('[data-player]').forEach((button) => {
  button.hidden = false;
  let timeout;
  const initialLabel = button.querySelector('[data-button-text]').textContent;
  button.addEventListener('click', () => {
    const card = button.closest('.set-card');
    const slot = card.querySelector('.player-slot');
    const status = card.querySelector('.player-status');
    if (slot.childElementCount) {
      window.clearTimeout(timeout);
      slot.replaceChildren();
      status.textContent = '';
      button.setAttribute('aria-expanded', 'false');
      button.querySelector('[data-button-text]').textContent = initialLabel;
      return;
    }
    const frame = document.createElement('iframe');
    frame.title = button.dataset.title;
    frame.src = button.dataset.player;
    frame.allow = 'autoplay';
    frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    status.textContent = button.dataset.loading;
    button.setAttribute('aria-expanded', 'true');
    button.querySelector('[data-button-text]').textContent = button.dataset.loaded;
    slot.append(frame);
    timeout = window.setTimeout(() => { status.textContent = button.dataset.fallback; }, 12000);
    frame.addEventListener('load', () => {
      window.clearTimeout(timeout);
      // A loaded cross-origin frame does not establish that audio playback works.
      if (frame.isConnected) status.textContent = button.dataset.ready;
    }, {once:true});
  });
});
// Preserve the current section when changing language.
document.querySelectorAll('.epk-language').forEach((link) => {
  link.addEventListener('click', () => { if (location.hash) link.hash = location.hash; });
});
// Native scrolling and visible content work with JavaScript disabled.
if ('IntersectionObserver' in window) {
  const links = Array.from(document.querySelectorAll('.epk-links a'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, {rootMargin:'-120px 0px -50% 0px',threshold:0});
  links.forEach((link) => {const target=document.querySelector(link.hash);if(target)observer.observe(target);});
  const hero=document.querySelector('#top');
  if(hero)observer.observe(hero);
}
