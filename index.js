const { render } = require("ejs");
const express = require("express");
const app = express();
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

connection
    .authenticate()
    .then(() => {
        console.log("Conexão com o banco realizada com sucesso!");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

//estou dizendo para o Express usar o EJS como View engine.
app.set('view engine','ejs');
//carregar arquivos estaticos como CSS, Javascript do front.
app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get("/",(req,res) => {//carrega o arquivo dentro da pasta views
    Pergunta.findAll({ raw: true,order:[ //order é para criterio de ordenação
        ['id','DESC'] // ordena de forma  decrescente pelo id
    ]}).then(perguntas => { // select *
        res.render("index",{
            perguntas: perguntas
        });
    }) 
    
});

app.get("/perguntar",(req,res)=>{
    res.render("perguntar");
});

app.post("/salvarpergunta",(req,res) =>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({ //insert
        titulo: titulo,
        descricao: descricao
    }).then(() =>{
        res.redirect("/");
    })
});

app.get("/pergunta/:id",(req,res) =>{
    var id = req.params.id;
    Pergunta.findOne({ // select ... where id = @id
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined)
        {
            Resposta.findAll({
                where : {perguntaId: pergunta.id},
                order:[
                     ['id','DESC']  ]
            }).then(respostas =>{
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas : respostas
                });
            }); 
        }else{
            res.redirect("/");
        }
    });
});

app.post("/responder",(req,res) =>{
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaID: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId);
    });
});

app.listen(3000,()=>{
    console.log("App rodando!");
});

