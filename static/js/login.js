const formBox = document.getElementById('formBox');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const toRegister = document.getElementById('toRegister');
const toLogin = document.getElementById('toLogin');
const flash = document.getElementById('flash');

// NEW: force this page to remain in light-mode.
// 1) remove any existing dark-mode class on load
// 2) monkey-patch classList.add on documentElement to ignore attempts to add 'dark-mode'
(function(){
  try{
    document.documentElement.classList.remove('dark-mode');
    const root = document.documentElement;
    const origAdd = root.classList.add.bind(root);
    root.classList.add = function(...args){
      if(args.includes('dark-mode')) return;
      return origAdd(...args);
    };
  }catch(e){}
})();

window.addEventListener('DOMContentLoaded', ()=> {
  formBox.classList.add('enter');
  setTimeout(()=> formBox.classList.remove('enter'), 900);
});

function showFlash(text, type='success') {
  flash.textContent = text;
  flash.className = 'flash-message ' + type;
  flash.setAttribute('aria-hidden','false');
  clearTimeout(showFlash._t);
  showFlash._t = setTimeout(()=> {
    flash.style.opacity = '0';
    flash.setAttribute('aria-hidden','true');
  }, 3000);
  flash.style.opacity = '1';
}

function switchTo(formOut, formIn) {
  formBox.classList.add('switch');
  formOut.classList.add('slide-out');
  setTimeout(()=> {
    formOut.classList.add('hidden');
    formOut.classList.remove('slide-out','active');
    formIn.classList.remove('hidden');
    formIn.classList.add('slide-in','active');
  }, 220);
  setTimeout(()=> {
    formIn.classList.remove('slide-in');
    formBox.classList.remove('switch');
  }, 520);
}

toRegister.addEventListener('click', e=>{
  e.preventDefault();
  switchTo(loginForm, registerForm);
});
toLogin.addEventListener('click', e=>{
  e.preventDefault();
  switchTo(registerForm, loginForm);
});

loginForm.addEventListener('submit', e=>{
  e.preventDefault();
  // Guardamos el usuario en localStorage para que otras páginas (JS-only) puedan leerlo
  try{
    const uname = loginForm.querySelector('input[name="username"]').value || '';
    localStorage.setItem('user.name', JSON.stringify(uname));
  }catch(e){}
  showFlash('Inicio de sesión correcto', 'success');
    // Redirigir al index (ahora el panel se accede desde "Cuenta")
    setTimeout(()=> location.href = 'index.html', 800);
});

registerForm.addEventListener('submit', e=>{
  e.preventDefault();
  const pwd = document.getElementById('regPassword').value;
  const conf = document.getElementById('regConfirm').value;
  if (pwd !== conf) {
    showFlash('Las contraseñas no coinciden', 'error');
    return;
  }
  // Guardar nombre al registrarse
  try{
    const runame = registerForm.querySelector('input[name="reg_username"]').value || '';
    localStorage.setItem('user.name', JSON.stringify(runame));
  }catch(e){}
  showFlash('Registro correcto', 'success');
  setTimeout(()=> switchTo(registerForm, loginForm), 900);
});
