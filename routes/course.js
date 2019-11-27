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
  if (req.user.isTeacher) {
    Course.find({ instructor: req.user._id }).then((cursos) => {
      console.log(cursos)
      res.render('course/explore', { title: 'Meus cursos', cursos: cursos, user: req.user });
    }).catch((err) => {
      req.flash('error_msg', 'Não foi possível obter a lista de cursos')
    })
  } else if (!req.user.isTeacher) {
    Course.find({ enrolledStudents: { "$in": [req.user._id] } }).then((cursos) => {
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
  Course.findOne({ _id: req.body.code }).then(curso => {
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
  Course.findOne({ _id: req.params.id }).then((curso) => {
    Module.find({ courseId: req.params.id }).then((modules) => {
      User.find({ _id: curso.enrolledStudents }).populate().then((users) => {
        console.log("teacher id: " + req.user._id)
        console.log("course instructor id: " + curso.instructor)
        if (req.user._id == curso.instructor) {
          let owner = true
          console.log('is course owner ' + owner)
          res.render('course/course', { title: curso.name, course: curso, enrolled: curso.enrolledStudents, modules: modules, users: users, owner })
        } else {
          let owner = false
          console.log('is course owner ' + owner)
          res.render('course/course', { title: curso.name, course: curso, enrolled: curso.enrolledStudents, modules: modules, users: users, owner })
        }
      })
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
  Module.findOne({ _id: req.body.moduleId }).then((module) => {
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
    req.flash('error_msg', 'Não foi possível encontrar o objeto de destino')
  })
})

/* Atribuir tutor */
router.post('/tutor/new', (req, res) => {
  User.findOneAndUpdate({ email: req.body.email }, { "$push": { "tutored": req.body.courseId } }).then((foundUser) => {
    Course.findById(req.body.courseId).then((course) => {
      course.tutor = foundUser._id
      course.tutorName = foundUser.name
      course.tutorEmail = foundUser.email
      course.save().then(() => {
        req.flash('success_msg', foundUser.name + " agora é um Tutor")
        res.redirect('/course/view/' + req.body.courseId)
      }).catch((err) => {
        req.flash('error_msg', 'Não foi possível fazer isto')
        res.redirect('/course/view/' + req.body.courseId)
      })
    }).catch((err) => {
      req.flash('error_msg', 'Não foi possível encontrar esse usuário')
      res.redirect('/course/view/' + req.body.courseId)
    })
  })
})

/* Deletar aula */
router.post('/lesson/delete', (req, res) => {
  console.log("module id: " + req.body.moduleId)
  console.log("lesson id: " + req.body.lessonId)
  console.log("course id: " + req.body.courseId)
  Module.update({ _id: req.body.moduleId }, { "$pull": { "lessons": { "_id": req.body.lessonId } } }).then(() => {
    req.flash('success_msg', 'Aula deletada')
    res.redirect('/course/view/' + req.body.courseId)
  }).catch(() => {
    req.flash('error_msg', 'Não foi possível deletar a aula')
    res.redirect('/course/view/' + req.body.courseId)
  })
})

/* Exibir página de edição de aula */
router.get('/lesson/edit/:id', isTeacher, (req, res) => {
  console.log("param id: " + req.params.id)
  Module.findOne({ "lessons._id": { "$in": [req.params.id] } }).then((module) => {
    const foundLesson = module.lessons.find(lesson => lesson._id == req.params.id)
    console.log(foundLesson)
    res.render('course/edit-lesson', { lesson: foundLesson, module: module })
  }).catch(() => {
    req.flash('error_msg', 'Não foi possível redirecionar para a página de edição')
    res.redirect('back')
  })
})

/* Editar aula */
router.post('/lesson/edit', isTeacher, (req, res) => {
  Module.findOne({ "lessons._id": { "$in": [req.body.lessonId] } }).then((module) => {
    const foundLesson = module.lessons.find(lesson => lesson._id == req.body.lessonId)
    foundLesson.title = req.body.title
    foundLesson.content = req.body.content
    module.save().then(() => {
      req.flash('success_msg', 'Aula editada')
      res.redirect('/course/view/' + req.body.courseId)
    }).catch((err) => {
      req.flash('error_msg', 'Não foi possível editar a aula')
      res.redirect('back')
    })
  }).catch(() => {
    req.flash('error_msg', 'Não foi possível fazer isto')
    res.redirect('back')
  })
})

/* Deletar curso */
router.post('/delete', (req, res) => {
  console.log(req.body)
  Course.remove({ _id: req.body.idDelete }).then(() => {
    req.flash('success_msg', 'Curso deletado')
    res.redirect('/course')
  }).catch((err) => {
    req.flash('error_msg', 'Não foi possível deletar este curso')
    res.redirect('/course')
  })
})

router.get('/users/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router;