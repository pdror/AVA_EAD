var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
require('../models/Course')
const Course = mongoose.model('courses')
const {isUser, isTeacher} = require('../helpers/isAdmin')
const {slugify, idify} = require('../helpers/slugify')

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
  console.log('im here')
  const novoCurso = {
    title: req.body.title,
    description: req.body.description,
    slug: slugify(req.body.title),
    quickId: idify(this.slug),
    instructor: {
      instructorId: req.user.id,
      name: req.user.name,
      email: req.user.email
    }
  }
  console.log('now im here')

  console.log(novoCurso)

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