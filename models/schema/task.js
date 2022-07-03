const taskSchema=new mongoose.Schema([{
  name: String,
  tasklist: [{
    task: String,
    read: Boolean
  }]
}]);

module.exports = taskSchema;