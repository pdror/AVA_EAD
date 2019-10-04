var express = require('express');
var router = express.Router();
require('./models/Student')

router.get('/', function(req, res, next) {
    res.render('newStudent', {title: 'Cadastro de Usuário'});
});

router.post('/newStudent', (req, res) => {
    const novoEstudante = {
        nome: req.body.nome,
        email: req.body.email,
        password: req.body.password
    }

    new Student(novoEstudante).save().then(() => { 
        console.log("New student inserted to the collection")
    }).catch((err) => {
        console.log("Insertion failed" + err)
    })
})

module.exports = router;