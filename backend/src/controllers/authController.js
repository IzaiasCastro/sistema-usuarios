import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validarCadastro } from '../utils/validators.js';
import { JWT_SECRET } from '../middlewares/authMiddleware.js';

/**
 * Cadastra um novo usuário com senha criptografada via bcrypt.
 */
export async function registrar(req, res, next) {
  try {
    const { nome, email, senha, cargo } = req.body;
    const erros = validarCadastro({ nome, email, senha });

    if (erros.length > 0) {
      return res.status(400).json({ erro: erros.join(' ') });
    }

    const db = req.app.locals.db;
    const emailLimpo = email.trim().toLowerCase();

    // Verifica integridade: impede duplicidade de e-mail
    const usuarioExistente = await db.get('SELECT id FROM users WHERE email = ?', [emailLimpo]);
    if (usuarioExistente) {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
    }

    // Proteção de senha: gera salt e hash
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const resultado = await db.run(
      'INSERT INTO users (nome, email, senha_hash, cargo) VALUES (?, ?, ?, ?)',
      [nome.trim(), emailLimpo, senhaHash, cargo || 'Usuário']
    );

    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso!',
      id: resultado.lastID
    });
  } catch (erro) {
    next(erro);
  }
}

/**
 * Autentica o usuário e retorna um Token JWT válido por 2 horas.
 */
export async function login(req, res, next) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }

    const db = req.app.locals.db;
    const usuario = await db.get('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);

    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email, cargo: usuario.cargo },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      mensagem: 'Login realizado com sucesso!',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cargo: usuario.cargo
      }
    });
  } catch (erro) {
    next(erro);
  }
}