var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
require('../models/Course')
const Course = mongoose.model('courses')
const {isUser, isTeacher} = require('../helpers/isAdmin')

/* GET course page. */
router.get('/', isUser, (req, res) => {
  Course.find().then((cursos) => {
    if(cursos.length >= 1) {
      console.log("Possuo cursos")
    } else {
      console.log("Não possuo cursos")
    }
    res.render('course/explore', { title: 'Cursos', cursos: cursos });
  }).catch((err) => {
    req.flash('error_msg', 'Não foi possível obter a lista de cursos')
  })
});

router.get('/new', isTeacher, (req, res) => {
  res.render('course/new', { title: 'Novo Curso' })
})

router.post('/new', isTeacher, (req, res) => {
  const novoCurso = {
    title: req.body.title,
    description: req.body.description
  }

  new Course(novoCurso).save().then(() => {
    req.flash('success_msg', 'Que legal! Você criou um novo curso!')
    res.redirect('/course')
  }).catch((err) => {
    req.flash('error_msg', 'Não foi possível criar este curso.')
    res.redirect('/course/new')
  })
})

router.get('/teste', (req, res) => {
  res.send('vdc')
})

module.exports = router;