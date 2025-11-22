/***********************
 * Script: interação
 ***********************/
(function(){
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const cvBtn = document.getElementById('cvBtn');

  /* ==========================
     MENU MOBILE (com proteção)
     ========================== */
  function updateMenuVisibility(){
    const navLinksEl = document.getElementById('navLinks');
    if (!menuToggle || !navLinksEl) return; // página sem menu → ignora

    if(window.innerWidth < 720){
      menuToggle.style.display = 'inline-flex';
      navLinksEl.style.display = 'none';
    } else {
      menuToggle.style.display = 'none';
      navLinksEl.style.display = 'flex';
    }
  }

  updateMenuVisibility();
  window.addEventListener('resize', updateMenuVisibility);

  // Toggle do menu mobile
  if (menuToggle) {
    menuToggle.addEventListener('click', function(){
      const navLinksEl = document.getElementById('navLinks');
      if (!navLinksEl) return;

      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !expanded);

      navLinksEl.style.display =
        navLinksEl.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  /* ==========================
     TEMA (light/dark + persistência)
     ========================== */
  const LS_THEME = 'pref-theme';

  function setTheme(theme){
    if(theme === 'light'){
      html.setAttribute('data-theme', 'light');
    } else {
      html.removeAttribute('data-theme');
    }
    themeBtn?.setAttribute('aria-pressed', theme === 'dark');
    localStorage.setItem(LS_THEME, theme);
  }

  const saved = localStorage.getItem(LS_THEME) || 'dark';
  setTheme(saved);

  // Botão de tema
  if (themeBtn) {
    themeBtn.addEventListener('click', function(){
      const isLight = html.getAttribute('data-theme') === 'light';
      setTheme(isLight ? 'dark' : 'light');
    });
  }

    /* ==========================
               pop-up
     ========================== */
     const avatarImg = document.querySelector(".avatar img");
const modal = document.getElementById("fotoModal");
const modalImg = document.getElementById("fotoModalImg");
const fecharBtn = modal.querySelector(".modal-fechar");

function abrirModal() {
  modal.classList.add("ativo");
  modal.setAttribute("aria-hidden", "false");
  modalImg.src = avatarImg.src;
  modalImg.alt = avatarImg.alt;
  document.body.style.overflow = "hidden";
}

function fecharModal() {
  modal.classList.remove("ativo");
  modal.setAttribute("aria-hidden", "true");
  modalImg.src = "";
  document.body.style.overflow = "";
}

avatarImg.style.cursor = "zoom-in";
avatarImg.addEventListener("click", abrirModal);

// fecha no X
fecharBtn.addEventListener("click", fecharModal);

// fecha clicando fora da imagem
modal.addEventListener("click", (e) => {
  if (e.target === modal) fecharModal();
});

// fecha no ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("ativo")) {
    fecharModal();
  }
});

  /* ==========================
     SMOOTH SCROLL PARA ÂNCORAS
     ========================== */
  document.addEventListener('click', function(e){
    const a = e.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href') || '';

    if(href.startsWith('#')){
      e.preventDefault();
      const id = href.slice(1);
      const el = document.getElementById(id);
      if(el){
        el.scrollIntoView({behavior:'smooth', block:'start'});

        if(window.innerWidth < 720){
          const navLinksEl = document.getElementById('navLinks');
          if(navLinksEl) navLinksEl.style.display = 'none';
        }
      }
    }
  });

  /* ==========================
     FORMULÁRIO (FormSubmit)
     ========================== */
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  const sendBtn = document.getElementById('sendBtn');

  if (form) {
    form.addEventListener('submit', function() {
      if (formMsg) formMsg.textContent = 'Enviando...';
      if (sendBtn) sendBtn.disabled = true;

      setTimeout(() => {
        if (sendBtn) {
          sendBtn.disabled = false;
          sendBtn.textContent = 'Enviar mensagem';
        }
      }, 3000);
    });
  }

  /* ==========================
     DOWNLOAD DO CV
     ========================== */
  window.downloadCV = function(){
    const cvPath = './cv.pdf';

    fetch(cvPath, {method:'HEAD'})
      .then(res => {
        if(res.ok) window.open(cvPath, '_blank');
        else throw new Error();
      })
      .catch(()=>{
        const text = "CV de Ítalo\n\nSubstitua este arquivo 'cv.pdf' pela versão real.";
        const blob = new Blob([text], {type:'text/plain'});
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      });
  };

})(); // <-- Fecha o IIFE corretamente

/*****************************************
 * Barras de skill
 *****************************************/
document.querySelectorAll('.bar > i').forEach(el => {
  const lvl = parseInt(el.getAttribute('data-level') || '0', 10);
  el.style.width = Math.max(0, Math.min(lvl, 100)) + '%';
});

/*****************************************
 * HIGHLIGHT DA SEÇÃO ATIVA
 *****************************************/
const sections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll("nav a[href^='#']");

function highlightCurrent(){
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (scrollY >= sectionTop) {
      current = section.id;
    }
  });

  navAnchors.forEach(link => {
    link.removeAttribute("aria-current");
    if (link.getAttribute("href") === `#${current}`) {
      link.setAttribute("aria-current", "page");
    }
  });
}

window.addEventListener("scroll", highlightCurrent, { passive: true });
highlightCurrent(); // marca já ao carregar
