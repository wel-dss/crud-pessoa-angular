export function criar(req, res, db) {
    const { status, cpf, nome, email, senha } = req.body;
    db.query(
        'SELECT * FROM pessoa WHERE cpf = ?',
        cpf,
        (err, result) => {
            if (err) {
                res.status(500).send('Erro ao verificar se pessoa já existe.');
                return;
            }

            if (result.length > 0) {
                // Se a pessoa (cpf) existe e está ativa, então, nada...
                if (result[0].status == true) {
                    res.status(409).send('CPF ativo já cadastrado.');
                    return;
                } else

                // Se a pessoa (cpf) existe e está inativa, então atualiza
                if (result[0].status == false) {
                    db.query(
                        'UPDATE pessoa SET status = ?, cpf = ?, nome = ?, email = ?, senha = ? WHERE id = ?',
                        [status, cpf, nome, email, senha, result[0].id], err => {
                            if (err) {
                                res.status(500).send('Erro ao atualizar pessoa.');
                                return;
                            }
                            db.query('SELECT * FROM pessoa WHERE id = ?', result[0].id, (err, result) => {
                                if (err) {
                                    res.status(500).send('Erro ao encontrar pessoa atualizada.');
                                    return;
                                }
                                res.status(201).json(result[0]);
                            });
                        }
                    );
                }
            }
            
            // Se a pessoa (cpf) não existe, tenta inserir
            else {
                db.query(
                    'INSERT INTO pessoa (status, cpf, nome, email, senha) VALUES (?, ?, ?, ?, ?)',
                    [status, cpf, nome, email, senha],
                    (err, result) => {
                        if (err) {
                            if (err.code === 'ER_DUP_ENTRY') {
                                // Retorna 409 (Conflict) se o email já estiver cadastrado, já que não poderá ser o cpf
                                res.status(409).send('E-mail já cadastrado.');
                            } else {
                                res.status(500).send('Erro ao criar Pessoa.');
                            }
                            return;
                        }
                        const pessoaId = result.insertId;
                        db.query(
                            'SELECT * FROM pessoa WHERE id = ?',
                            pessoaId,
                            (err, result) => {
                                if (err) {
                                    res.status(500).send('Erro ao buscar pessoa criada.');
                                    return;
                                }
                                res.status(201).json(result[0]);
                            }
                        );
                    }
                );
            }
        }
    );
}