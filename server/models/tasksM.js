var mongoose = require('mongoose')
var Schema = mongoose.Schema;

 var taskSchema = new Schema({
    todo: String,
    isDone: false,
    userId: [{ type: Schema.Types.ObjectId, ref: 'User' }]
 })

 var Task = mongoose.model('Task', taskSchema);

 module.exports = Task