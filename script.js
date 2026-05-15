const BUSINESS_CONFIG = {
  businessName: 'Fix-It Crew', // Replace business name here
  phoneRaw: '+27XXXXXXXXX', // Replace with real phone number for click-to-call
  phoneDisplay: '+27 XX XXX XXXX', // Replace with real visible phone number
  whatsAppNumber: '27XXXXXXXXX', // Replace with real WhatsApp number, numbers only
  whatsAppDisplay: '+27 XX XXX XXXX', // Replace with real visible WhatsApp number
  email: 'info@fixitcrew.co.za', // Replace with real email address
  serviceArea: 'Johannesburg and surrounding areas', // Replace if needed
  serviceAreaShort: 'Johannesburg',
  businessHours: 'Mon - Sat: 7:00 AM - 6:00 PM<br />Emergency call-outs available',
};

const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

function applyBusinessConfig() {
  document.querySelectorAll('[data-config="businessName"]').forEach((node) => {
    node.textContent = BUSINESS_CONFIG.businessName;
  });
  document.querySelectorAll('[data-config="phoneDisplay"]').forEach((node) => {
    node.textContent = BUSINESS_CONFIG.phoneDisplay;
  });
  document.querySelectorAll('[data-config="whatsAppDisplay"]').forEach((node) => {
    node.textContent = BUSINESS_CONFIG.whatsAppDisplay;
  });
  document.querySelectorAll('[data-config="email"]').forEach((node) => {
    node.textContent = BUSINESS_CONFIG.email;
  });
  document.querySelectorAll('[data-config="serviceArea"]').forEach((node) => {
    node.textContent = BUSINESS_CONFIG.serviceArea;
  });
  document.querySelectorAll('[data-config="serviceAreaShort"]').forEach((node) => {
    node.textContent = BUSINESS_CONFIG.serviceAreaShort;
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
}

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

const quoteForm = document.querySelector('#quoteForm');
const whatsAppQuoteLink = document.querySelector('#whatsAppQuoteLink');
const emailQuoteLink = document.querySelector('#emailQuoteLink');
const formStatus = document.querySelector('#formStatus');

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
  if (quoteForm && whatsAppQuoteLink) {
    whatsAppQuoteLink.href = buildWhatsAppUrl(quoteForm);
  }
  if (quoteForm && emailQuoteLink) {
    emailQuoteLink.href = buildMailtoUrl(quoteForm);
  }
}

applyBusinessConfig();

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
    }, 500);
  });
}
