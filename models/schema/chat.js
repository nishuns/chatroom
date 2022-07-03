const chatSchema= new mongoose.Schema([{
  id: String,
  chat:[{
    name: String,
    message: String
  }]
}]);

module.exports = chatSchema;