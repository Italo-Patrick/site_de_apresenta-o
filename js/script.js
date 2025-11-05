/***********************
 * Script: interação
 ***********************/
(function(){
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const cvBtn = document.getElementById('cvBtn');

  // mostrar botão de menu em telas pequenas
  function updateMenuVisibility(){
    if(window.innerWidth < 720){
      menuToggle.style.display = 'inline-flex';
      document.getElementById('navLinks').style.display = 'none';
    } else {
      menuToggle.style.display = 'none';
      document.getElementById('navLinks').style.display = 'flex';
    }
  }
  updateMenuVisibility();
  window.addEventListener('resize', updateMenuVisibility);

  // menu mobile toggle
  menuToggle.addEventListener('click', function(){
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !expanded);
    if(navLinks.style.display === 'flex') navLinks.style.display = 'none';
    else navLinks.style.display = 'flex';
  });

  // theme (persist via localStorage)
  const LS_THEME = 'pref-theme';
  function setTheme(theme){
    if(theme === 'light') html.setAttribute('data-theme', 'light');
    else html.removeAttribute('data-theme');
    themeBtn.setAttribute('aria-pressed', theme === 'dark');
    localStorage.setItem(LS_THEME, theme);
  }
  const saved = localStorage.getItem(LS_THEME) || 'dark';
  setTheme(saved);

  themeBtn.addEventListener('click', function(){
    const current = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    setTheme(current === 'light' ? 'dark' : 'light');
  });

  // smooth scrolling for internal links
  document.addEventListener('click', function(e){
    const a = e.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href') || '';
    if(href.startsWith('#')) {
      e.preventDefault();
      const id = href.slice(1);
      const el = document.getElementById(id);
      if(el) {
        el.scrollIntoView({behavior:'smooth', block:'start'});
        // close mobile menu if open
        if(window.innerWidth < 720) navLinks.style.display = 'none';
      }
    }
  });

  // =============================
  // FORMULÁRIO DE CONTATO (FormSubmit)
  // =============================
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  const sendBtn = document.getElementById('sendBtn');

  if (form) {
    form.addEventListener('submit', function() {
      // Mostra uma mensagem visual antes do envio
      if (formMsg) formMsg.textContent = 'Enviando...';
      sendBtn.disabled = true;

      // Após 3 segundos, reativa o botão (apenas efeito visual)
      setTimeout(() => {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Enviar mensagem';
      }, 3000);
      // Importante: sem preventDefault, o FormSubmit envia o POST normalmente!
    });
  }

  // função para "baixar" CV (placeholder)
  window.downloadCV = function(){
    const cvPath = './cv.pdf';
    fetch(cvPath, {method:'HEAD'}).then(res=>{
      if(res.ok) window.open(cvPath, '_blank');
      else {
        const text = "CV de Ítalo\n\nSubstitua este arquivo 'cv.pdf' pela versão real.";
        const blob = new Blob([text], {type:'text/plain'});
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
    }).catch(()=>{
      const text = "CV de Ítalo\n\nSubstitua este arquivo 'cv.pdf' pela versão real.";
      const blob = new Blob([text], {type:'text/plain'});
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    });
  };

  // tecla "t" (tema) desativada
  /*document.addEventListener('keydown', function(e){
    if(e.key === 't' && !e.ctrlKey && !e.metaKey){
      themeBtn.click();
    }
  });*/
})();

// Preenche barras de skill com base no atributo data-level
document.querySelectorAll('.bar > i').forEach(el => {
  const lvl = parseInt(el.getAttribute('data-level') || '0', 10);
  el.style.width = Math.max(0, Math.min(lvl, 100)) + '%';
});

/* =====================================================
   Link ativo no menu (destaca a seção visível)
   - Usa aria-current="page" para acessibilidade
   - Inicia destacado já no carregamento
   - scroll-margin-top no CSS complementa a âncora
   ===================================================== */
const sections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll("nav a[href^='#']");

function highlightCurrent(){
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120; // ajuste fino (bata com o CSS)
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
