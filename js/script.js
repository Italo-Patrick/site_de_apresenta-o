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
    if(theme === 'dark') html.setAttribute('data-theme', 'dark');
    else html.removeAttribute('data-theme');
    themeBtn.setAttribute('aria-pressed', theme === 'dark');
    localStorage.setItem(LS_THEME, theme);
  }
  const saved = localStorage.getItem(LS_THEME) || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(saved);

  themeBtn.addEventListener('click', function(){
    const current = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
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

  // simple contact form validation + fake "send"
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  const sendBtn = document.getElementById('sendBtn');

  form.addEventListener('submit', function(e){
    e.preventDefault();
    formMsg.textContent = '';
    sendBtn.disabled = true;
    sendBtn.textContent = 'Enviando...';

    // validações básicas
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if(!name || !email || !message){
      formMsg.textContent = 'Preencha todos os campos.';
      sendBtn.disabled = false;
      sendBtn.textContent = 'Enviar mensagem';
      return;
    }
    // simular envio (substitua aqui por fetch para backend)
    setTimeout(()=>{
      formMsg.textContent = 'Mensagem enviada! Responderei por e-mail em breve.';
      form.reset();
      sendBtn.disabled = false;
      sendBtn.textContent = 'Enviar mensagem';
    }, 900);
  });

  // função para "baixar" CV (placeholder)
  window.downloadCV = function(){
    // se tiver um arquivo CV em /cv.pdf, abre; senão mostra alerta
    const cvPath = './cv.pdf';
    fetch(cvPath, {method:'HEAD'}).then(res=>{
      if(res.ok) window.open(cvPath, '_blank');
      else {
        // se não houver arquivo, gera um “pseudo-PDF” como fallback
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

  // atalho: tecla "t" alterna o tema
  document.addEventListener('keydown', function(e){
    if(e.key === 't' && !e.ctrlKey && !e.metaKey){
      themeBtn.click();
    }
  });

})();
