import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import cors from 'cors';
import { inicializacao } from './inicializacao.js';
import { criar } from './criar.js';

const app = express();
const port = 3000;
const nomeDeHost = 'localhost';
const usuario = '';
const senha = '';
const nomeDeBD = "e_terapia";

let configInicial = false;

const db = mysql.createConnection({
    host: nomeDeHost,
    user: usuario,
    password: senha,
    database: nomeDeBD
  });


if (!configInicial) {
  try {
    await inicializacao(nomeDeHost, usuario, senha, nomeDeBD);
  } catch (err) {
    console.error('Erro ao configurar o banco de dados:', err);
  }
  configInicial = true;
}

db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('Conectado ao BD.');
});

app.use(bodyParser.json());
app.use(cors());

app.get('/pessoas', (req, res) => {
    db.query('SELECT * FROM pessoa', (err, results) => {
        if (err) {
            res.status(500).send('Erro ao buscar pessoas.');
            return;
        }
        res.json(results);
    });
});

app.post('/pessoas/create', (req, res) => {
    criar(req, res, db);
});

app.get('/pessoas/:id', (req, res) => {
    const pessoaId = req.params.id;
    db.query('SELECT * FROM pessoa WHERE id = ?', pessoaId, (err, result) => {
        if (err) {
            res.status(500).send('Erro ao buscar pessoa.');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Pessoa não encontrada.');
            return;
        }
        res.json(result[0]);
    });
});

app.put('/pessoas/:id', (req, res) => {
    const pessoasId = req.params.id;
    const { status, cpf, nome, email, senha } = req.body;
    db.query(
        'UPDATE pessoa SET status = ?, cpf = ?, nome = ?, email = ?, senha = ? WHERE id = ?',
        [status, cpf, nome, email, senha, pessoasId], err => {
            if (err) {
                res.status(500).send('Erro ao atualizar pessoa.');
                return;
            }
            db.query('SELECT * FROM pessoa WHERE id = ?', pessoasId, (err, result) => {
                if (err) {
                    res.status(500).send('Erro ao encontrar pessoa atualizada.');
                    return;
                }
                res.json(result[0]);
            });
        }
    );
});

app.delete('/pessoas/:id', (req, res) => {
    const pessoaId = req.params.id;
    db.query('DELETE FROM pessoa WHERE id = ?', pessoaId, err => {
        if (err) {
            res.status(500).send('Erro ao deletar pessoa.');
            return;
        }
        res.status(200).json({ msg: 'Pessoa deletada com sucesso.' });
    });
});

app.listen(port, () => {
    console.log(`Servirdor rodando na porta ${port}`);
});


/*

create schema e_terapia;
use e_terapia;

CREATE TABLE Pessoa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `status` BOOLEAN NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

*/
