const Task = require('../models/tasksM')

class TaskModel{
    static find(req, res){
        Task.find({'userId': req.params.idUser})
        .then(data=>{
            res.status(201).send({message: "data has been found", data: data})
        })
        .catch(err=>{
            res.status(500).send({message: "data not found", error: err})
        })
    }

    static create(req, res){
        let objTask = {
            todo: req.body.todo,
            userId: req.params.idUser,
            isDone: false
        }
        Task.create(objTask)
        .then(data=>{
            res.status(201).send({message: "Task has been created", data: objTask})
        })
        .catch(err=>{
            res.status(500).send({message: "Error", error: err})
        })
    }

    static update(req, res){
        Task.findOne({'_id' : req.params.idTask})
        .then(data=>{
                let objTask = {
                    todo: req.body.todo || data.todo,
                    isDone: req.body.isDone 
                }
            Task.update({'_id': req.params.idTask}, objTask)
            .then(dataTask=>{
                res.status(201).send({message: "data has been updated", data: dataTask, objTask: objTask})
            })
            .catch(error=>{
                res.status(500).send({message: "data can't be updated", error: error})
            })
        })
        .catch(err=>{
            res.status(404).send({message: "data not found", error: err})
        })
    }
    
    static delete(req, res){
        Task.deleteOne({'_id': req.params.idTask})
        .then(data=>{
            res.status(200).send({message: "data has been deleted", data: data})
        })
        .catch(err=>{
            res.status(200).send({message: "data cannot be deleted cause by error"})
        })
    }
    
}

module.exports = TaskModel