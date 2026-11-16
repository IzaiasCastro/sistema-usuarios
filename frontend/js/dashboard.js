import { apiRequest } from './api.js';

// Proteção de rota no Front-end
const token = localStorage.getItem('auth_token');
const usuarioLogado = JSON.parse(localStorage.getItem('auth_user') || 'null');

if (!token || !usuarioLogado) {
  window.location.href = 'index.html';
}

document.getElementById('usuario-logado-nome').textContent =
  `Olá, ${usuarioLogado.nome} (${usuarioLogado.cargo})`;

const tabela = document.getElementById('tabela-usuarios');
const formUser = document.getElementById('form-user');
const feedback = document.getElementById('dash-feedback');
const btnCancelar = document.getElementById('btn-cancelar');
const formTitulo = document.getElementById('form-titulo');

function mostrarAlerta(msg, tipo = 'sucesso') {
  feedback.textContent = msg;
  feedback.className = `alert ${tipo}`;
  setTimeout(() => (feedback.className = 'alert hidden'), 4000);
}

// Carrega e renderiza os usuários dinamicamente
async function carregarUsuarios() {
  try {
    const usuarios = await apiRequest('/users');
    tabela.innerHTML = '';

    usuarios.forEach((user) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.nome}</td>
        <td>${user.email}</td>
        <td><span class="badge">${user.cargo}</span></td>
        <td>
          <button class="btn-edit" data-id="${user.id}" data-nome="${user.nome}" data-email="${user.email}" data-cargo="${user.cargo}">Editar</button>
          <button class="btn-delete" data-id="${user.id}">Excluir</button>
        </td>
      `;
      tabela.appendChild(tr);
    });
  } catch (erro) {
    mostrarAlerta(erro.message, 'erro');
  }
}

// Criar ou Atualizar usuário
formUser.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('user-id').value;
  const nome = document.getElementById('user-nome').value;
  const email = document.getElementById('user-email').value;
  const cargo = document.getElementById('user-cargo').value;
  const senha = document.getElementById('user-senha').value;

  try {
    if (id) {
      await apiRequest(`/users/${id}`, 'PUT', { nome, email, cargo, senha });
      mostrarAlerta('Usuário atualizado com sucesso!');
    } else {
      if (!senha || senha.length < 6) {
        return mostrarAlerta('Informe uma senha com no mínimo 6 caracteres.', 'erro');
      }
      await apiRequest('/auth/register', 'POST', { nome, email, cargo, senha });
      mostrarAlerta('Novo usuário criado com sucesso!');
    }

    resetarFormulario();
    carregarUsuarios();
  } catch (erro) {
    mostrarAlerta(erro.message, 'erro');
  }
});

// Delegação de eventos para Editar e Excluir
tabela.addEventListener('click', async (e) => {
  if (e.target.classList.contains('btn-edit')) {
    const { id, nome, email, cargo } = e.target.dataset;
    document.getElementById('user-id').value = id;
    document.getElementById('user-nome').value = nome;
    document.getElementById('user-email').value = email;
    document.getElementById('user-cargo').value = cargo;
    document.getElementById('user-senha').placeholder = 'Nova senha (opcional)';
    formTitulo.textContent = `Editando Usuário #${id}`;
    btnCancelar.classList.remove('hidden');
  }

  if (e.target.classList.contains('btn-delete')) {
    const id = e.target.dataset.id;
    if (confirm('Deseja realmente excluir este usuário?')) {
      try {
        await apiRequest(`/users/${id}`, 'DELETE');
        mostrarAlerta('Usuário excluído com sucesso!');
        carregarUsuarios();
      } catch (erro) {
        mostrarAlerta(erro.message, 'erro');
      }
    }
  }
});

function resetarFormulario() {
  formUser.reset();
  document.getElementById('user-id').value = '';
  document.getElementById('user-senha').placeholder = 'Senha (obrigatória ao criar)';
  formTitulo.textContent = 'Novo Usuário';
  btnCancelar.classList.add('hidden');
}

btnCancelar.addEventListener('click', resetarFormulario);

document.getElementById('btn-logout').addEventListener('click', () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  window.location.href = 'index.html';
});

// Inicialização
carregarUsuarios();