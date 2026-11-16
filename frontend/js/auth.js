import { apiRequest } from './api.js';

// Redireciona automaticamente se já houver sessão ativa
if (localStorage.getItem('auth_token')) {
  window.location.href = 'dashboard.html';
}

const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');
const feedbackBox = document.getElementById('feedback-box');

function exibirMensagem(texto, tipo = 'erro') {
  feedbackBox.textContent = texto;
  feedbackBox.className = `alert ${tipo}`;
}

tabLogin.addEventListener('click', () => {
  tabLogin.classList.add('active');
  tabRegister.classList.remove('active');
  formLogin.classList.remove('hidden');
  formRegister.classList.add('hidden');
  feedbackBox.className = 'alert hidden';
});

tabRegister.addEventListener('click', () => {
  tabRegister.classList.add('active');
  tabLogin.classList.remove('active');
  formRegister.classList.remove('hidden');
  formLogin.classList.add('hidden');
  feedbackBox.className = 'alert hidden';
});

// Envio do Cadastro
formRegister.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('reg-nome').value;
  const email = document.getElementById('reg-email').value;
  const cargo = document.getElementById('reg-cargo').value;
  const senha = document.getElementById('reg-senha').value;

  try {
    const res = await apiRequest('/auth/register', 'POST', { nome, email, cargo, senha });
    exibirMensagem(res.mensagem + ' Faça login para continuar.', 'sucesso');
    formRegister.reset();
    setTimeout(() => tabLogin.click(), 1200);
  } catch (erro) {
    exibirMensagem(erro.message, 'erro');
  }
});

// Envio do Login
formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const senha = document.getElementById('login-senha').value;

  try {
    const res = await apiRequest('/auth/login', 'POST', { email, senha });
    localStorage.setItem('auth_token', res.token);
    localStorage.setItem('auth_user', JSON.stringify(res.usuario));
    window.location.href = 'dashboard.html';
  } catch (erro) {
    exibirMensagem(erro.message, 'erro');
  }
});