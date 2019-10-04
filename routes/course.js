var express = require('express');
var router = express.Router();

/* GET course page. */
router.get('/', function(req, res, next) {
  res.render('course', { title: 'Curso' });
});

/* POST course form */
router.post('/course/new', (req, res, next) => {
})

module.exports = router;