const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Student')
const Student = mongoose.model('students')

router.get('/new', function(req, res) {
    res.render('users/new', {title: 'Cadastro de Usuário'});
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
        console.log("Insertion failed: " + err)
    })
})

router.get('/teste', (req, res) => {
    res.send('isso')
})

module.exports = router;