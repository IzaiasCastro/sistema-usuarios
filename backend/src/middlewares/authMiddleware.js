import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_iel_2026';

/**
 * Middleware que intercepta requisições protegidas e valida o Token JWT.
 */
export function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decodificado = jwt.verify(token, JWT_SECRET);
    req.usuarioLogado = decodificado;
    next();
  } catch (error) {
    return res.status(403).json({ erro: 'Sessão expirada ou token inválido.' });
  }
}