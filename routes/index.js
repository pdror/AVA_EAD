var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const { isUser, isStudent, isTeacher } = require('../helpers/isAdmin')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Open Class' })
})

module.exports = router;
