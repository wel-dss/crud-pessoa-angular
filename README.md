# TesteDeBd


## Introdução

Este projeto foi gerado usando HTML 5, CSS 3, JavaScript, TypeScript, Angular CLI v19.0.7, Node v22.12.0, Bootstrap, Express e MySQL 8.0.
Temos um webapp que faz um crud com uma API REST.

## Possíveis configurações necessárias

O sistema não se dá bem com o novo método de autenticação do MySQL. Mude para a versão legado atraves do MySQL Installer (MySQL Server Reconfigure > next > Use Legacy...) ou no Workbench execute os comandos (forma recomendada):
```shell
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Colocar a sua Senha';
FLUSH PRIVILEGES;
```

## Execução

* No arquivo index.js em node-express-mysql-rest-api, edite adequadamente nomeDeHost, usuario e senha de acordo com o seu banco de dados. Se necessário mude também port, nesse caso não esqueça de também mudar a porta em pessoa.service.ts.

* Para iniciar o servidor, na pasta node-express-mysql-rest-api, execute:
```shell
node index.js
```
* Para iniciar a aplicação, na pasta raiz, execute:
```shell
ng serve
```

## Observação

Pode haver problemas quanto a tradução do navegador, é recomendado desativá-la.
