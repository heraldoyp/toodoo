var User = require('../models/usersM')
var jwt = require('jsonwebtoken');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('6d7d61d713524e58a3ff079a3b875e3d');
const moment = require('moment')

class UserModel {
    static create(req, res){
        let objUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }
        User.findOne({'username': req.body.username})
        .then(dataOne=>{
            if(dataOne){
                res.send({message: "used"})
            }else{
                User.create(objUser)
                .then(data=>{
                    res.status(201).send({message: "data has been created", data: objUser})
                })
                .catch(err=>{
                    res.status(500).send({message: 'data cannot be created', error: err})
                })
            }
        })
        .catch(errOne=>{

        })
        
    }  

    static find(req, res){
        User.find()
        .then(data=>{
            res.status(201).send({mesaage: "data found", data: data})
        })
        .catch(err=>{
            res.status(404).send({message: "data not found", error: err})
        })
    }

    static findById(req, res){
        User.findOne({'_id': req.params.idUser})
        .then(data=>{
            res.status(201).send({message: "data found", data: data})
        })
        .catch(err=>{
            res.status(404).send({message: "data not found", error: err})
        })
    }

    static update(req, res){
        let objUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }
        User.update({'_id': req.params.idUser}, objUser)
        .then(data=>{
            res.status(201).send({message: "data has been updated", data: objUser})
        })
        .catch(err=>{
            res.status(500).send({message: "data failed to update"})
        })
    }


    static delete(req, res){
        User.deleteOne({'_id': req.params.idUser})
        .then(data=>{
            res.status(200).send({message: "data has been deleted"})
        })
        .catch(err=>{
            res.status(500).send({message: "data cannot be deleted", error: err})
        })
    }

    static signIn(req, res){
        let objSignIn = {
            username: req.body.username,
            password: req.body.password
        }
        
        console.log('data server', objSignIn) 
        User.findOne({'username': req.body.username})
        .then(data=>{
            if(data.password === req.body.password){
                console.log('data server', data)
                jwt.sign({data: data}, 'heraldoyp', function(err, token) {
                    if(!err){
                        res.send({message: "correct", token: token, data: data})
                    }else{
                        console.log(err)
                    }
                }); 
            }else{
                res.send({message: 'wrong'})
            }
        })
        .catch(error=>{
            res.send({message: "wrong", error: error})
        })
    }

    static facebookLog(req, res){
        req.headers.token = null

        let objFacebook = {
            username: req.body.username,
            email: req.body.email,
        }
        // console.log("data dari server", objFacebook)
        User.findOne({username: req.body.username})
        .then(data=>{
            if(data){
                jwt.sign({data: data}, 'heraldoyp', function(err, token){
                    console.log("yang udah ada ",req.headers)
                    res.send({message: "facebookLog", token: token, data: data})
                })
            }else{
                User.create(objFacebook)
                .then(makeOne=>{
                    jwt.sign({data: data}, 'heraldoyp', function(err, token){
                        req.headers.token = token
                        console.log("buat baru ",req.headers.token)
                        res.send({message: "sign in done", token: req.headers.token})
                    })
                })
                .catch(error=>{
                    console.log("create ",error)
                })
            }
        })
        .catch(error=>{
            console.log('findOne ', error)
        })
    }

    static newsAPI(req, res){
        newsapi.v2.topHeadlines({
            country: 'id'
        })
        .then(response => {
            console.log(response);
            res.status(201).send({message: "news ready", news: response})
        })
    }   

    static time(req, res){
        let a = moment().format('llll')
        let splitTime = a.split(' ')
        console.log(splitTime)

        let hari = splitTime[0].split(',')
        let bulan = splitTime[1]
        let tanggal = splitTime[2].split(',')
        let tahun = splitTime[3]
        let jam = splitTime[4]
        let periode = splitTime[5]
        res.send({day: hari[0], month: bulan, date: tanggal[0], year: tahun, time: jam, period: periode})
    }
}

module.exports = UserModel