var express = require('express');
var router = express.Router();
var UserModel = require('../controllers/usersC')
var TaskModel = require('../controllers/tasksC')
var authenticate = require('../helpers/authentication.js')


/* GET users listing. */
router.get('/', UserModel.find)
router.post('/', UserModel.create);
router.get('/time', UserModel.time)
router.get('/newsapi', UserModel.newsAPI)
router.get('/:idUser', UserModel.findById)
router.put('/:idUser', UserModel.update)
router.delete('/:idUser', UserModel.delete)
router.post('/signin', UserModel.signIn)  // Set JWT dan headers disini
router.post('/facebook', UserModel.facebookLog)


router.get('/:idUser/tasks',authenticate, TaskModel.find)
router.post('/:idUser/tasks', authenticate,TaskModel.create)
router.put('/:idUser/tasks/:idTask',authenticate,TaskModel.update)
router.delete('/:idUser/tasks/:idTask', authenticate, TaskModel.delete)
module.exports = router;
