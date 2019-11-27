const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')
require('../models/User')
const User = mongoose.model('users')
const { isUser, isStudent, isTeacher } = require('../helpers/isAdmin')

router.get('/form', function(req, res) {
    res.render('users/form', {title: 'Cadastro de Usuário'});
});

router.post('/new', (req, res, next) => {
    User.findOne({email: req.body.email}).then((user) => {
        if(user) {
            req.flash('error_msg', 'E-mail já utilizado')
            res.redirect('/users/form')
        } else {
            if(req.body.password != req.body.check) {
                req.flash('error_msg', 'As senhas não combinam')
                res.redirect('/users/form')
            }

            const newUser = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }

            if(req.body.role == 'TEACHER') {
                newUser.isTeacher = true
            }
        
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) {
                        req.flash('error_msg', 'Não foi possível criar usuário')
                        res.redirect('/')
                    }
                    newUser.password = hash
        
                    new User(newUser).save().then(() => {
                        req.flash('success_msg', 'Novo usuário cadastrado. Realize o login!')
                        res.redirect('/')
                    }).catch((err) => {
                        req.flash('error_msg', 'Não foi possível realizar seu cadastro!')
                        res.redirect('/users/form')
                    })
                })
            })
        }
    }).catch((err) => {
        req.flash('error_msg', 'Erro interno')
        res.redirect('/')
    }) 
})

router.get('/login', (req, res, next) => {
    if(isUser) {
        res.redirect('/course')
    } else {
        res.render('login')
    }
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/course',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res, next) => {
    req.logout()
    res.redirect('/')
})
module.exports = router;