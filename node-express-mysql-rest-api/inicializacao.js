import mysql from 'mysql';

/**
 * Criando o BD.
 */
export async function inicializacao(nomeDeHost, usuario, senha, nomeDeBD) {
  return new Promise((resolve, reject) => {

    const db = mysql.createConnection({
      host: nomeDeHost,
      user: usuario,
      password: senha,
    });

    db.query(`CREATE DATABASE IF NOT EXISTS ${nomeDeBD}`, (err, result) => {
      if (err) return reject(err);
      console.log('BD criado ou já existente.');

      db.query(`USE ${nomeDeBD}`, (err, result) => {
        if (err) return reject(err);
        console.log('DB selecionado');

        const createTableQuery = `
          CREATE TABLE IF NOT EXISTS Pessoa (
            id INT AUTO_INCREMENT PRIMARY KEY,
            status BOOLEAN NOT NULL,
            cpf VARCHAR(11) NOT NULL UNIQUE,
            nome VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            senha VARCHAR(255) NOT NULL
          )
        `;

        db.query(createTableQuery, (err, result) => {
          if (err) return reject(err);
          console.log('Tabelas criadas ou já existentes.\n');
          resolve();
        });
      });
    });
  });
}
