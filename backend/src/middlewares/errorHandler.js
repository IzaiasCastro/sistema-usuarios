// backend/src/middlewares/errorHandler.js
export function errorHandler(err, req, res, next) {
  console.error('[Erro Interno]:', err.stack);
  res.status(500).json({
    erro: 'Erro interno no servidor. Tente novamente mais tarde.'
  });
}