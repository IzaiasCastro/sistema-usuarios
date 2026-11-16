import bcrypt from 'bcryptjs';

/**
 * Lista todos os usuários (nunca retorna o campo senha_hash).
 */
export async function listarUsuarios(req, res, next) {
  try {
    const db = req.app.locals.db;
    const usuarios = await db.all(
      'SELECT id, nome, email, cargo, criado_em FROM users ORDER BY id DESC'
    );
    res.json(usuarios);
  } catch (erro) {
    next(erro);
  }
}

/**
 * Atualiza dados de um usuário existente.
 */
export async function atualizarUsuario(req, res, next) {
  try {
    const { id } = req.params;
    const { nome, email, cargo, senha } = req.body;
    const db = req.app.locals.db;

    const usuario = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    const novoNome = nome ? nome.trim() : usuario.nome;
    const novoEmail = email ? email.trim().toLowerCase() : usuario.email;
    const novoCargo = cargo || usuario.cargo;

    if (senha && senha.length >= 6) {
      const novoHash = await bcrypt.hash(senha, 10);
      await db.run(
        'UPDATE users SET nome = ?, email = ?, cargo = ?, senha_hash = ? WHERE id = ?',
        [novoNome, novoEmail, novoCargo, novoHash, id]
      );
    } else {
      await db.run(
        'UPDATE users SET nome = ?, email = ?, cargo = ? WHERE id = ?',
        [novoNome, novoEmail, novoCargo, id]
      );
    }

    res.json({ mensagem: 'Usuário atualizado com sucesso!' });
  } catch (erro) {
    if (erro.message.includes('UNIQUE')) {
      return res.status(409).json({ erro: 'E-mail já utilizado por outro usuário.' });
    }
    next(erro);
  }
}

/**
 * Exclui um usuário pelo ID.
 */
export async function excluirUsuario(req, res, next) {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;

    const resultado = await db.run('DELETE FROM users WHERE id = ?', [id]);
    if (resultado.changes === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    res.json({ mensagem: 'Usuário removido com sucesso!' });
  } catch (erro) {
    next(erro);
  }
}