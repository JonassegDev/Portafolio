// --- TRANSLATION DATA ---
const translations = {
  es: {
    namePlaceholder: "Tu Nombre",
    emailPlaceholder: "Tu Correo Electrónico",
    subjectPlaceholder: "Asunto / Servicio de Interés",
    messagePlaceholder: "Cuéntame sobre tu proyecto o consulta...",
    roles: ["Data Analyst", "Paid Media Specialist", "Systems Engineering Student", "Frontend Developer"],
    sending: "Enviando mensaje...",
    success: "¡Mensaje enviado con éxito! Nos comunicaremos contigo pronto.",
    error: "Hubo un error al enviar el mensaje. Por favor, intenta de nuevo."
  },
  en: {
    namePlaceholder: "Your Name",
    emailPlaceholder: "Your Email Address",
    subjectPlaceholder: "Subject / Service of Interest",
    messagePlaceholder: "Tell me about your project or inquiry...",
    roles: ["Data Analyst", "Paid Media Specialist", "Systems Engineering Student", "Frontend Developer"],
    sending: "Sending message...",
    success: "Message sent successfully! I'll get back to you soon.",
    error: "There was an error sending your message. Please try again."
  }
};

let currentLang = localStorage.getItem('portfolio-lang') || 'es';
let typewriterTimeout = null;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
  initHeaderScroll();
  initMobileMenu();
  initActiveLinks();
  initContactForm();
  initModal();
});

// --- LANGUAGE CONTROLLER ---
function setLanguage(lang) {
  currentLang = lang;
  document.body.className = `lang-${lang}`;
  localStorage.setItem('portfolio-lang', lang);

  // Update Toggle Button Content
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.innerText = lang === 'es' ? 'EN' : 'ES';
  }

  // Update Input Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  // Re-initialize Typewriter with current language roles
  if (typewriterTimeout) {
    clearTimeout(typewriterTimeout);
  }
  const typewriterElement = document.getElementById('typewriter-text');
  if (typewriterElement) {
    typewriterElement.textContent = '';
    initTypewriter(translations[lang].roles);
  }
}

// Global language switcher function for HTML button trigger
window.toggleLanguage = () => {
  const newLang = currentLang === 'es' ? 'en' : 'es';
  setLanguage(newLang);
};

// --- TYPEWRITER EFFECT ---
function initTypewriter(words) {
  const element = document.getElementById('typewriter-text');
  if (!element) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      element.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      element.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 30 : 60;

    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at full word
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      // Pause before typing next word
      typeSpeed = 500;
    }

    typewriterTimeout = setTimeout(type, typeSpeed);
  }

  type();
}

// --- HEADER SCROLL STYLES ---
function initHeaderScroll() {
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// --- MOBILE MENU ---
function initMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const nav = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('nav ul a');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      nav.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        nav.classList.remove('active');
      });
    });
  }
}

// --- ACTIVE LINK INTERSECTION OBSERVER ---
function initActiveLinks() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav ul a');

  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // Trigger when section occupies the center of screen
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

// --- CONTACT FORM SUBMISSION ---
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('form-status');

  if (form && statusDiv) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Show Loading State
      statusDiv.className = 'form-status loading';
      statusDiv.innerHTML = `<span class="spinner"></span> ${translations[currentLang].sending}`;

      const formData = new FormData(form);
      
      // Formatear la fecha en la zona horaria local de Managua, Nicaragua (GMT-6)
      const localTimestamp = new Date().toLocaleString('es-NI', {
        timeZone: 'America/Managua',
        hour12: false
      });
      formData.append('timestamp', localTimestamp);
      const urlEncodedData = new URLSearchParams(formData).toString();

      // IMPORTANT: If user has not replaced the spreadsheet webapp url, we prompt/alert or send to default fallback.
      // We will read the action URL from form or fallback to a placeholder.
      const scriptUrl = form.action || '';

      if (!scriptUrl || scriptUrl.includes('YOUR_GOOGLE_SCRIPT_URL_HERE')) {
        // Fallback simulated submission for testing or guide trigger
        setTimeout(() => {
          statusDiv.className = 'form-status success';
          statusDiv.innerText = currentLang === 'es' 
            ? '¡Simulación exitosa! Conecta tu Google Sheets en el enlace inferior para recibir correos reales.' 
            : 'Simulated success! Connect your Google Sheets using the setup link below to receive real messages.';
          form.reset();
        }, 1500);
        return;
      }

      try {
        const response = await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors', // Solves typical CORS issues with Google Script redirection
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: urlEncodedData,
        });

        statusDiv.className = 'form-status success';
        statusDiv.innerText = translations[currentLang].success;
        form.reset();
      } catch (error) {
        console.error('Error submitting form:', error);
        statusDiv.className = 'form-status error';
        statusDiv.innerText = translations[currentLang].error;
      }
    });
  }
}

// --- MODAL CONTROLLER (GOOGLE SHEET SETUP) ---
function initModal() {
  const modal = document.getElementById('gs-modal');
  const trigger = document.getElementById('gs-trigger');
  const closeBtn = document.getElementById('close-modal');

  if (modal && trigger && closeBtn) {
    trigger.addEventListener('click', () => {
      modal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    // Close when clicking outside content
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}
