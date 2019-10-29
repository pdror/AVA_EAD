var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
require('../models/Course')
const Course = mongoose.model('courses')
const { isUser, isTeacher } = require('../helpers/isAdmin')
const { slugify, idify } = require('../helpers/slugify')

/* Exibir página inicial de cursos */
router.get('/', isUser, (req, res) => {
  Course.find({ instructor: req.user._id }).then((cursos) => {
    console.log("id do usuario: " + req.user._id)
    console.log("id passado por parametro: " + cursos.instructor)
    res.render('course/explore', { title: 'Meus cursos', cursos: cursos });
  }).catch((err) => {
    req.flash('error_msg', 'Não foi possível obter a lista de cursos')
  })
});

router.get('/new', isTeacher, (req, res) => {
  res.render('course/new', { title: 'Novo Curso' })
})

/* Criar novo curso */
router.post('/new', isTeacher, (req, res) => {
  console.log('im here')
  const novoCurso = {
    title: req.body.title,
    description: req.body.description,
    slug: slugify(req.body.title),
    instructor: req.user.id
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

/* Exibir página do curso */
router.get('/view/:id', isUser, (req, res) => {
  console.log(req.params.id)
  Course.findOne({ _id: req.params.id }).then((curso) => {
    console.log(curso)
    res.render('course/course', { title: 'Curso', course: curso })
  }).catch((err) => {
    req.flash('error_msg', 'Não é possível exibir este curso')
    res.redirect('/course/explore')
  })
})

/* Adicionar novo módulo */
router.post('/module/new', (req, res) => {
  Course.findOne({ _id: req.body.id }).then((course) => {
    course.modules.push({ title: req.body.title })
    course.save().then(() => {
      req.flash('success_msg', 'Novo módulo adicionado')
      res.redirect('/course/view/' + req.body.id, {modules: course.modules})
    }).catch((err) => {
      req.flash('error_msg', 'Não foi possível fazer isso')
      res.redirect('/course/view/' + req.body.id)
    })
  }).catch((err) => {
    req.flash('error_msg', 'Não foi possível criar o módulo')
    res.redirect('/course/view/' + req.body.id)
  })
})

/* Adicionar aula */
router.post('/lesson/new', (req, res) => {
  
})

module.exports = router;