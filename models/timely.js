const {Schema} = require("mongoose") 
const mongoose = require("mongoose") 

const timely = new Schema({
  guild_id: {
    type: String,
    required: true
  },
  user_id : {
    type: String,
    required: true,
   },
 
})

const TimelyModel = mongoose.model("UsersTimely", timely)

module.exports = {
  TimelyModel
}