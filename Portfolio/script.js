const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');
const siteHeader = document.querySelector('.site-header');
const backToTop = document.querySelector('#back-to-top');
const currentYear = document.querySelector('#current-year');

function closeMenu() {
  navMenu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation menu');
  document.body.classList.remove('menu-open');
}

menuToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  document.body.classList.toggle('menu-open', isOpen);
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

sections.forEach((section) => sectionObserver.observe(section));

window.addEventListener('scroll', () => {
  siteHeader.classList.toggle('scrolled', window.scrollY > 20);
  backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
currentYear.textContent = new Date().getFullYear();

const form = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const fields = {
  name: { input: document.querySelector('#name'), error: document.querySelector('#name-error'), message: 'Please enter your name.' },
  email: { input: document.querySelector('#email'), error: document.querySelector('#email-error'), message: 'Please enter a valid email address.' },
  message: { input: document.querySelector('#message'), error: document.querySelector('#message-error'), message: 'Please enter a message.' }
};

function validateForm() {
  let isValid = true;
  Object.values(fields).forEach(({ input, error }) => {
    error.textContent = '';
    input.removeAttribute('aria-invalid');
  });

  if (!fields.name.input.value.trim()) {
    fields.name.error.textContent = fields.name.message;
    fields.name.input.setAttribute('aria-invalid', 'true');
    isValid = false;
  }
  if (!/^\S+@\S+\.\S+$/.test(fields.email.input.value.trim())) {
    fields.email.error.textContent = fields.email.message;
    fields.email.input.setAttribute('aria-invalid', 'true');
    isValid = false;
  }
  if (!fields.message.input.value.trim()) {
    fields.message.error.textContent = fields.message.message;
    fields.message.input.setAttribute('aria-invalid', 'true');
    isValid = false;
  }
  return isValid;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  formStatus.className = 'form-status';
  formStatus.textContent = '';
  if (!validateForm()) {
    formStatus.textContent = 'Please review the highlighted fields.';
    formStatus.classList.add('error');
    return;
  }
  formStatus.textContent = 'Thanks for reaching out. Your message passed validation and is ready to send.';
  formStatus.classList.add('success');
  form.reset();
});
