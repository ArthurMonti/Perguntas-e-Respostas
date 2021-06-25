const Sequelize = require("sequelize");
const connection = require("./database");

const Resposta = connection.define('resposta',{
    corpo:{
        type: Sequelize.TEXT,
        allowNULL: false
    },
    perguntaID:{
        type: Sequelize.INTEGER,
        allowNULL: false
    }
});

Resposta.sync({force: false}).then(()=> {

});


module.exports = Resposta;