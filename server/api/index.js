import express from 'express'
import mysql from 'mysql2' // usando lib mysql2 para maior compatibilidade no windows (usar mysql no linux)
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config({path: path.resolve('./.ENV')}); // configurando para uso do arquivo .ENV

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE

const db = mysql.createConnection({
    host:DB_HOST,
    user:DB_USER,
    password:DB_PASSWORD,
    database:DB_DATABASE
})

// Selecionar informações de todos automóveis
app.get('/automoveis', (req, res)=>{
    const query = `
    SELECT auto_id as id, auto_modelo as modelo, auto_preco as valor
    FROM automovel;
    `;
    db.query(query, (err,data)=>{
        if(err) return res.json(err);
        return res.status(200).json(data);
    })
})

// Selecionar informações de todos clientes
app.get('/clientes', (req, res)=>{
    const query = `
    SELECT cliente_id as id, cliente_nome as nome
    FROM cliente;
    `;
    db.query(query, (err,data)=>{
        if(err) return res.json(err);
        return res.status(200).json(data);
    })
})

// Selecionar informações de todos concessionarias
app.get('/concessionarias', (req, res)=>{
    const query = `
    SELECT conc_id as id, conc_nome as nome
    FROM concessionaria;
    `;
    db.query(query, (err,data)=>{
        if(err) return res.json(err);
        return res.status(200).json(data);
    })
})

// Selecionar informações de todos concessionarias 
// que tenham X carro
app.get('/concessionarias/:id', (req, res)=>{
    const autoId = req.params.id;
    const query = `
    SELECT a.alocacao_concessionaria as id, c.conc_nome as nome
    FROM alocacao as a
    JOIN concessionaria as c ON a.alocacao_concessionaria = c.conc_id
    WHERE a.alocacao_automovel = ?;
    `;

    db.query(query, autoId, (err,data)=>{
        if(err) return res.json(err);
        return res.status(200).json(data);
    })
})

app.get('/areas', (req, res)=>{
    // CAST utilizado pois SUM retorna NEWDECIMAL, tipo qual o JS converte para STRING
    // com o CAST para REAL o JS consegue utilizar o resultado de SUM como INTEGER
    // OBS -> CASO O SUM TENHA PARTES DECIMAIS, ELAS SERÃO ARREDONDADAS POR CAUSA DO CAST !
    const query = `
    SELECT alocacao_area as area,CAST(sum(alocacao_quantidade) AS real) as ocupacao
    FROM alocacao 
    GROUP BY alocacao_area 
    ORDER BY area ASC`;
    db.query(query, (err,data)=>{
        if(err) return res.json(err);
        return res.status(200).json(data);
    })
})

// Selecionar informações de todos automovéis presente em X área
app.get('/areas/:id', (req, res)=>{
    const areaId = req.params.id;
    const query = `
    SELECT auto_id as id, auto_modelo as modelo, auto_preco as preco, e.alocacao_quantidade as quantidade
     FROM alocacao as e
     JOIN automovel as a ON e.alocacao_automovel = a.auto_id
     WHERE e.alocacao_area = ?
     ORDER BY auto_preco;
    `;
    db.query(query, areaId ,(err,data)=>{
        if(err) return res.json(err);
        return res.status(200).json(data);
    })
})

// Selecionar informações de venda de automovel
app.get('/venda', (req, res) =>{
    const query = `
    SELECT venda_id as id, venda_automovel as auto, venda_cliente as cliente, venda_conc as conc, venda_data as data
    FROM venda;`;

    db.query(query ,(err,data)=>{
        if(err) return res.json(err);
        return res.status(200).json(data);
    })
})

// Adicionar informações de venda de automovel
app.post('/venda', (req, res) =>{
    const query = `
    INSERT INTO venda (venda_cliente, venda_conc, venda_automovel) VALUES (?)
    `;

    const values = [
        req.body.clienteId,
        req.body.concId,
        req.body.autoId,
    ];

    db.query(query, [values] ,(err,data)=>{
        if(err) return res.json(err);
        return res.status(201).json("Venda registrada!");
    })
})

// Selecionar quantidade de X automovel presente em X área
app.get('/automovelqtd', (req, res) =>{
    const query = `
    SELECT alocacao_quantidade 
    FROM estacionamento.alocacao 
    WHERE alocacao_automovel = ? AND alocacao_area = ?;`

    const values = [
        req.body.autoId,
        req.body.areaId,
    ];

    db.query(query, values ,(err,data)=>{
        if(err) return res.json(err);
        return res.status(200).json(data);
    })    
})

// Atualizar a quantidade do automovel vendido
app.put('/automovelqtd', (req, res) =>{
    const query = `
    UPDATE estacionamento.alocacao
    SET alocacao_quantidade = alocacao_quantidade-1
    WHERE alocacao_automovel = ? AND alocacao_area = ?;
    `;

    const values = [
        req.body.autoId,
        req.body.areaId,
    ];

    db.query(query, values ,(err,data)=>{
        if(err) return res.json(err);
        return res.status(201).json("Quantidade de automoveis modificada!");
    })    
})

// Rotas 404
app.use("*", (req, res) => {
    console.log(`\u001b[31m[ERR] Rota não existente: ${req.baseUrl}`);
  });



app.listen(8800, ()=>{
    console.log('Conectado com sucesso!')
})