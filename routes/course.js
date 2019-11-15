var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
require('../models/Course')
const Course = mongoose.model('courses')
require('../models/User')
const User = mongoose.model('users')
require('../models/Module')
const Module = mongoose.model('modules')
require('../models/Lesson')
const Lesson = mongoose.model('lessons')
const { isUser, isStudent, isTeacher } = require('../helpers/isAdmin')
const { slugify, idify } = require('../helpers/slugify')
const randomString = require('../helpers/randomString')

/* Exibir página inicial de cursos */
router.get('/', isUser, (req, res) => {
  if(req.user.isTeacher){
    console.log('sou professor')
    Course.find({ instructor: req.user._id }).then((cursos) => {
      console.log(cursos)
      res.render('course/explore', { title: 'Meus cursos', cursos: cursos, user: req.user });
    }).catch((err) => {
      req.flash('error_msg', 'Não foi possível obter a lista de cursos')
    })
  } else if(!req.user.isTeacher) {
    console.log('sou estudante')
    Course.find({ enrolledStudents: {"$in": [req.user._id]} }).then((cursos) => {
      console.log('entrei no find')
      console.log(cursos)
      res.render('course/explore', { title: 'Meus cursos', cursos: cursos, user: req.user });
    }).catch((err) => {
      req.flash('error_msg', 'Não foi possível obter a lista de cursos')
    })
  }
});

router.get('/new', isTeacher, (req, res) => {
  res.render('course/new', { title: 'Novo Curso' })
})

/* Criar novo curso */
router.post('/new', isTeacher, (req, res) => {
  const novoCurso = {
    title: req.body.title,
    description: req.body.description,
    slug: slugify(req.body.title),
    shareId: (randomString(6)),
    instructor: req.user.id
  }

  console.log(novoCurso)

  new Course(novoCurso).save().then(() => {
    req.flash('success_msg', 'Que legal! Você criou um novo curso!')
    res.redirect('/course')
  }).catch((err) => {
    req.flash('error_msg', 'Não foi possível criar este curso.')
    res.redirect('/course/new')
  })
})

/* ALUNO: matricular em curso */
router.post('/enroll', isStudent, (req, res) => {
  Course.findOne({_id: req.body.code}).then(curso => {
    curso.enrolledStudents.push(req.user._id)
    curso.save().then(() => {
      req.flash('success_msg', 'Matricula realizada')
      res.redirect('/course')
    }).catch((err) => {
      req.flash('error_msg', 'Não foi possível realizar a matrícula')
      res.redirect('/course')
    })
  }).catch((err) => {
    req.flash('error_msg', 'Não existe um curso com este código')
    res.redirect('/course')
  })
})

/* Exibir página do curso */
router.get('/view/:id', isUser, (req, res) => {
  console.log(req.params.id)
  Course.findOne({ _id: req.params.id }).then((curso) => {
    Module.find({ courseId: req.params.id}).then((modules) => {
      res.render('course/course', { title: 'Curso', course: curso , enrolled: curso.enrolledStudents, modules: modules})
    })
  }).catch((err) => {
    req.flash('error_msg', 'Não é possível exibir este curso')
    res.redirect('/course/explore')
  })
})

/* Adicionar novo módulo */
router.post('/module/new', (req, res) => {
  Course.findOne({ _id: req.body.courseId }).then((course) => {
    const newModule = {
      courseId: req.body.courseId,
      title: req.body.title
    }
    console.log(newModule)
    new Module(newModule).save().then(() => {
      req.flash('success_msg', 'Novo módulo adicionado')
      res.redirect('/course/view/' + req.body.courseId)
    }).catch((err) => {
      req.flash('error_msg', 'Não foi possível fazer isso')
      res.redirect('/course/view/' + req.body.courseId)
    })
  }).catch((err) => {
    req.flash('error_msg', 'Não foi possível criar o módulo')
    res.redirect('/course/view/' + req.body.courseId)
  })
})

/* Deletar módulo */
router.post('/module/delete', (req, res) => {
  console.log(randomString(6))
})

/* Adicionar aula */
router.post('/lesson/new', (req, res) => {
  console.log(req.body)
  Module.findOne({ _id : req.body.moduleId }).then((module) => {
    const newLesson = {
      title: req.body.title,
      content: req.body.content
    }
    module.lessons.push(newLesson)
    module.save().then(() => {
      req.flash('success_msg', 'Nova aula criada')
      res.redirect('/course/view/' + req.body.courseId)
    }).catch((err) => {
      req.flash('error_msg', 'Não foi possível fazer isso')
      res.redirect('/course/view/' + req.body.courseId)
    })
  }).catch((err) => {
    console.log("affffffff")
    req.flash('error_msg', 'Não foi possível encontrar o objeto de destino')
  })
  
})

router.post('/delete', (req, res, next) => {
  console.log(req.body)
  Course.remove({_id : req.body.idDelete}).then(() => {
    req.flash('success_msg', 'Curso deletado')
    res.redirect('/course')
  }).catch((err) => {
    req.flash('error_msg', 'Não foi possível deletar este curso')
    res.redirect('/course')
  })
})

router.get('/users/logout', (req, res, next) => {
  req.logout()
  res.redirect('/')
})

module.exports = router;