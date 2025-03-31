import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function CriarEPopulrTabelaUsuarios(nome, sobrenome, email, telefone, CPF, datanascimento){
    const db = await open({
        filename: './banco.db',
        driver: sqlite3.Database
    })
    
    db.run(
        'CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY, nome TEXT, sobrenome TEXT, email TEXT, telefone INTEGER, CPF INTEGER, datanascimento INTEGER)'
    );
    db.run('INSERT INTO usuarios(nome, sobrenome, email, telefone. CPF, datanascimento) VALUES ?,?', [
        nome,
        sobrenome,
        email,
        telefone,
        CPF,
        datanascimento
    ])
}

CriarEPopulrTabelaUsuarios();