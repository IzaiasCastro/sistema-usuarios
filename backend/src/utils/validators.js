/**
 * Valida formato de e-mail e requisitos mínimos de senha e nome.
 */
export function validarCadastro({ nome, email, senha }) {
  const erros = [];

  if (!nome || nome.trim().length < 3) {
    erros.push('O nome deve ter pelo menos 3 caracteres.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    erros.push('Informe um endereço de e-mail válido.');
  }

  if (!senha || senha.length < 6) {
    erros.push('A senha deve ter no mínimo 6 caracteres.');
  }

  return erros;
}