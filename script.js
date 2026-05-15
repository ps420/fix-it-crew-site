const BUSINESS_CONFIG = {
  // Replace business details here
  businessName: 'Fix-It Crew',
  tagline: 'Premium Maintenance & Construction',
  phoneRaw: '+27XXXXXXXXX', // Replace with real phone number for click-to-call
  phoneDisplay: '+27 XX XXX XXXX', // Replace with real visible phone number
  whatsAppNumber: '27XXXXXXXXX', // Replace with real WhatsApp number, numbers only
  whatsAppDisplay: '+27 XX XXX XXXX', // Replace with real visible WhatsApp number
  email: 'info@fixitcrew.co.za', // Replace with real email address
  serviceArea: 'Johannesburg and surrounding areas',
  serviceAreaShort: 'Johannesburg',
  businessHours: 'Mon - Sat: 7:00 AM - 6:00 PM<br />Emergency call-outs available',
  businessHoursText: 'Mon - Sat: 7:00 AM - 6:00 PM',
  googleMapsUrl: 'https://maps.google.com/?q=Johannesburg', // Replace with your real map pin/link
  socialLinks: {
    facebook: '#', // Replace social link later
    instagram: '#', // Replace social link later
    linkedin: '#', // Replace social link later
  },
};

const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const revealItems = document.querySelectorAll('.reveal');
const quoteForm = document.querySelector('#quoteForm');
const whatsAppQuoteLink = document.querySelector('#whatsAppQuoteLink');
const emailQuoteLink = document.querySelector('#emailQuoteLink');
const formStatus = document.querySelector('#formStatus');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(nav.classList.contains('open')));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function applyBusinessConfig() {
  const textBindings = {
    businessName: BUSINESS_CONFIG.businessName,
    tagline: BUSINESS_CONFIG.tagline,
    phoneDisplay: BUSINESS_CONFIG.phoneDisplay,
    whatsAppDisplay: BUSINESS_CONFIG.whatsAppDisplay,
    email: BUSINESS_CONFIG.email,
    serviceArea: BUSINESS_CONFIG.serviceArea,
    serviceAreaShort: BUSINESS_CONFIG.serviceAreaShort,
    businessHoursText: BUSINESS_CONFIG.businessHoursText,
  };

  Object.entries(textBindings).forEach(([key, value]) => {
    document.querySelectorAll(`[data-config="${key}"]`).forEach((node) => {
      node.textContent = value;
    });
  });

  document.querySelectorAll('[data-config="businessHours"]').forEach((node) => {
    node.innerHTML = BUSINESS_CONFIG.businessHours;
  });

  document.querySelectorAll('[data-link="phone"]').forEach((node) => {
    node.setAttribute('href', `tel:${BUSINESS_CONFIG.phoneRaw}`);
  });
  document.querySelectorAll('[data-link="email"]').forEach((node) => {
    node.setAttribute('href', `mailto:${BUSINESS_CONFIG.email}`);
  });
  document.querySelectorAll('[data-link="whatsapp"]').forEach((node) => {
    node.setAttribute('href', `https://wa.me/${BUSINESS_CONFIG.whatsAppNumber}`);
  });
  document.querySelectorAll('[data-link="maps"]').forEach((node) => {
    node.setAttribute('href', BUSINESS_CONFIG.googleMapsUrl);
  });
  Object.entries(BUSINESS_CONFIG.socialLinks).forEach(([key, value]) => {
    document.querySelectorAll(`[data-link="${key}"]`).forEach((node) => {
      node.setAttribute('href', value);
    });
  });
}

function setActiveNav() {
  if (!navLinks.length) return;
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    const normalized = href === './' ? 'index.html' : href.split('#')[0] || currentPath;
    const isIndexAnchor = currentPath === 'index.html' && href.startsWith('#');
    const isCurrent = normalized === currentPath || (currentPath === '' && normalized === 'index.html') || isIndexAnchor;
    if (isCurrent) link.classList.add('active');
  });

  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const sectionMap = new Map();
  navLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('#')) sectionMap.set(href.replace('#', ''), link);
  });

  if (!sections.length || !sectionMap.size) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionMap.forEach((link) => link.classList.remove('active'));
        const activeLink = sectionMap.get(entry.target.id);
        if (activeLink) activeLink.classList.add('active');
      });
    },
    { rootMargin: '-35% 0px -50% 0px', threshold: 0.05 }
  );

  sections.forEach((section) => observer.observe(section));
}

if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

function formValue(form, name) {
  return String(new FormData(form).get(name) || '').trim();
}

function buildQuoteMessage(form) {
  const fullName = formValue(form, 'fullName');
  const phone = formValue(form, 'phone');
  const email = formValue(form, 'email');
  const service = formValue(form, 'service');
  const location = formValue(form, 'location');
  const message = formValue(form, 'message');

  return [
    `Hi ${BUSINESS_CONFIG.businessName}, I would like to request a quote.`,
    '',
    `Full name: ${fullName}`,
    `Phone: ${phone}`,
    `Email: ${email || 'Not provided'}`,
    `Service needed: ${service}`,
    `Location: ${location}`,
    `Message: ${message}`,
  ].join('\n');
}

function buildWhatsAppUrl(form) {
  return `https://wa.me/${BUSINESS_CONFIG.whatsAppNumber}?text=${encodeURIComponent(buildQuoteMessage(form))}`;
}

function buildMailtoUrl(form) {
  const subject = encodeURIComponent(`${BUSINESS_CONFIG.businessName} Quote Request`);
  const body = encodeURIComponent(buildQuoteMessage(form));
  return `mailto:${BUSINESS_CONFIG.email}?subject=${subject}&body=${body}`;
}

function showStatus(message, type) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = `form-status show ${type}`;
}

function clearFieldErrors() {
  document.querySelectorAll('.field-error').forEach((node) => {
    node.textContent = '';
  });
  document.querySelectorAll('#quoteForm input, #quoteForm select, #quoteForm textarea').forEach((field) => {
    field.classList.remove('invalid');
  });
}

function setFieldError(name, message) {
  const field = quoteForm?.querySelector(`[name="${name}"]`);
  const error = document.querySelector(`[data-error-for="${name}"]`);
  if (field) field.classList.add('invalid');
  if (error) error.textContent = message;
}

function validateForm(form) {
  clearFieldErrors();
  const errors = {};
  const fullName = formValue(form, 'fullName');
  const phone = formValue(form, 'phone');
  const email = formValue(form, 'email');
  const service = formValue(form, 'service');
  const location = formValue(form, 'location');
  const message = formValue(form, 'message');

  if (!fullName) errors.fullName = 'Please enter your full name.';
  if (!phone) errors.phone = 'Please enter your phone number.';
  if (!service) errors.service = 'Please select the service you need.';
  if (!location) errors.location = 'Please enter your location/suburb.';
  if (!message) errors.message = 'Please describe the work you need done.';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  Object.entries(errors).forEach(([name, text]) => setFieldError(name, text));
  return errors;
}

function syncLinks() {
  if (quoteForm && whatsAppQuoteLink) whatsAppQuoteLink.href = buildWhatsAppUrl(quoteForm);
  if (quoteForm && emailQuoteLink) emailQuoteLink.href = buildMailtoUrl(quoteForm);
}

applyBusinessConfig();
setActiveNav();

const currentYear = document.querySelector('#currentYear');
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

if (quoteForm && whatsAppQuoteLink && emailQuoteLink) {
  quoteForm.addEventListener('input', syncLinks);
  quoteForm.addEventListener('change', syncLinks);
  syncLinks();

  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const errors = validateForm(quoteForm);
    if (Object.keys(errors).length > 0) {
      showStatus('Please fix the highlighted fields before sending your quote request.', 'error');
      return;
    }

    syncLinks();
    showStatus('Quote request ready — opening WhatsApp now with your prefilled message.', 'success');
    setTimeout(() => {
      window.open(buildWhatsAppUrl(quoteForm), '_blank', 'noopener,noreferrer');
    }, 450);
  });
}
