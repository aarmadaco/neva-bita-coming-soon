const canonicalUrl = "https://nevabitaexperience.com/";
const scriptURL = "https://script.google.com/a/macros/nevabitaexperience.com/s/AKfycbwcvDOhsl7E67jp2kQSpGz5f-Z88Qo9unn9Y9U0qzz9PbOuMakkBW23gHJkV93XndUQWg/exec";

const form = document.getElementById("waitlistForm");
const formMessage = document.getElementById("formMessage");
const tipoEscapada = document.getElementById("tipoEscapada");
const progressBar = document.querySelector(".page-progress");

if (window.location.hostname === "www.nevabitaexperience.com") {
  window.location.replace(canonicalUrl);
}

function cleanUrl() {
  if (window.location.pathname !== "/" || window.location.search !== "") {
    window.history.replaceState({}, document.title, "/" + window.location.hash);
  }
}

function scrollToTarget(targetId) {
  const target = document.querySelector(targetId);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateProgressBar() {
  if (!progressBar) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
}

function initSmoothNavigation() {
  document.querySelectorAll(".js-scroll").forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      event.preventDefault();
      scrollToTarget(href);
    });
  });
}

function initRevealAnimations() {
  const elements = document.querySelectorAll(".reveal-on-scroll");
  if (!elements.length) return;
  if (!("IntersectionObserver" in window)) {
    elements.forEach(element => element.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  elements.forEach(element => observer.observe(element));
}

function initPackCards() {
  document.querySelectorAll(".pack-card__toggle").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      const card = button.closest(".pack-card");
      if (card) card.classList.toggle("is-open");
    });
  });
}

function initSurveyOptions() {
  document.querySelectorAll(".survey-option").forEach(option => {
    option.addEventListener("click", () => {
      document.querySelectorAll(".survey-option").forEach(item => item.classList.remove("is-selected"));
      option.classList.add("is-selected");
      if (tipoEscapada) tipoEscapada.value = option.dataset.option;
      if (formMessage) {
        formMessage.textContent = "Genial, hemos marcado tu preferencia. Ahora déjanos tus datos para avisarte.";
        formMessage.classList.remove("form-message--error");
        formMessage.classList.add("form-message--success");
      }
      scrollToTarget("#lista-espera");
    });
  });
}


function initWaitlistForm() {
  if (!form || !formMessage) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    const submitButton = form.querySelector("button[type='submit']");
    const formData = new FormData(form);
    formMessage.textContent = "Enviando...";
    formMessage.classList.remove("form-message--error", "form-message--success");
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando';
    }
    fetch(scriptURL, { method: "POST", body: formData, mode: "no-cors" })
      .then(() => {
        form.reset();
        document.querySelectorAll(".survey-option").forEach(item => item.classList.remove("is-selected"));
        formMessage.textContent = "¡Gracias! Te hemos apuntado a la lista de interesados de Neva Bita.";
        formMessage.classList.add("form-message--success");
      })
      .catch(() => {
        formMessage.textContent = "Ups, algo ha fallado. Escríbenos a info@nevabitaexperience.com.";
        formMessage.classList.add("form-message--error");
      })
      .finally(() => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Apuntarme';
        }
      });
  });
}

cleanUrl();
initSmoothNavigation();
initRevealAnimations();
initPackCards();
initSurveyOptions();
initWaitlistForm();
updateProgressBar();
window.addEventListener("scroll", updateProgressBar, { passive: true });
window.addEventListener("resize", updateProgressBar);
