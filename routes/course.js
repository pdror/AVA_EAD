var express = require('express');
var router = express.Router();

/* GET course page. */
router.get('/view', function(req, res) {
  res.render('course/course', { title: 'Curso' });
});

router.get('/teste', (req, res) => {
  res.send('vdc')
})

/* POST course form */
router.post('/course/new', (req, res, next) => {
})

module.exports = router;