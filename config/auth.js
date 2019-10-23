const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Require User database
require('../models/User')
const User = mongoose.model('users')

module.exports = function(passport) {
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'password'}, (email, password, done) => {
        User.findOne({email: email}).then((user) => {
            if(user) {
                console.log('usuario encontrado na base de dados')
            }

            if(!user) {
                console.log('cheguei aqui')
                return done(null, false, {message: 'Não existe um usuário com este email'})
            }

            bcrypt.compare(password, user.password, (error, match) => {
                if(match) {
                    return done(null, user)
                } else {
                    return done(null, false, {message: 'Dados incorretos'})
                }
            })
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}