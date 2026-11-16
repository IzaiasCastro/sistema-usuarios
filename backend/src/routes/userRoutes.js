// backend/src/routes/userRoutes.js
import { Router } from 'express';
import { listarUsuarios, atualizarUsuario, excluirUsuario } from '../controllers/userController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Todas as rotas abaixo exigem autenticação via Token JWT
router.use(verificarToken);

router.get('/', listarUsuarios);
router.put('/:id', atualizarUsuario);
router.delete('/:id', excluirUsuario);

export default router;