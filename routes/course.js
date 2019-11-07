var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
require('../models/Course')
const Course = mongoose.model('courses')
require('../models/User')
const User = mongoose.model('users')
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
    // User.findOne({_id: req.user._id}).then(usuario => {
    //   usuario.enrolled.push(req.body.code)
    //   usuario.save().then(() => {
    //     req.flash('success_msg', 'Matricula realizada')
    //     res.redirect('/course')
    //   }).catch((erro) => {
    //     req.flash('error_msg', 'Erro interno')
    //     res.redirect('/course')
    //   })
    // }).catch((erro) => {
    //   req.flash('error_msg', 'Erro interno')
    //   res.redirect('/course')
    // })
  }).catch((err) => {
    req.flash('error_msg', 'Não existe um curso com este código')
    res.redirect('/course')
  })
})

/* Exibir página do curso */
router.get('/view/:id', isUser, (req, res) => {
  console.log(req.params.id)
  Course.findOne({ _id: req.params.id }).then((curso) => {
    console.log(curso)
    res.render('course/course', { title: 'Curso', course: curso , enrolled: curso.enrolledStudents})
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

/* Deletar módulo */
router.post('/module/delete', (req, res) => {
  console.log(randomString(6))
})

/* Adicionar aula */
router.post('/lesson/new', (req, res) => {
  Course.findOne({ _id: req.body.id }).then((course) => {
    course.modules.lessons.push({ title: req.body.title, content: req.body.content })
    course.save().then(() => {
      req.flash('success_msg', 'Nova aula criada')
      res.redirect('/course/view/' + req.body.id, {modules: course.modules})
    }).catch((err) => {
      req.flash('error_msg', 'Não foi possível fazer isso')
      res.redirect('/course/view/' + req.body.id)
    })
  }).catch((err) => {
    req.flash('error_msg', 'Não foi possível criar a aula')
    res.redirect('/course/view/' + req.body.id)
  })
})

router.get('/users/logout', (req, res, next) => {
  req.logout()
  res.redirect('/')
})

module.exports = router;