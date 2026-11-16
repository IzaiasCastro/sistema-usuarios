const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Função genérica reutilizável para chamadas HTTP (GET, POST, PUT, DELETE).
 * Injeta o Token JWT automaticamente e trata falhas de conexão ou HTTP.
 */
export async function apiRequest(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('auth_token');

  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    // Se o token expirou ou é inválido, força logout
    if (response.status === 401 || response.status === 403) {
      if (!endpoint.includes('/auth/login')) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = 'index.html';
      }
    }

    if (!response.ok) {
      throw new Error(data.erro || 'Erro ao processar requisição.');
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error('Falha de conexão com o servidor. Verifique se a API está rodando.');
    }
    throw error;
  }
}