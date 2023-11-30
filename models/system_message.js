const {Schema} = require("mongoose") // класс Схемы (Аналогия с type в typescript или же просто задание типов)
const mongoose = require("mongoose") // сам монгус



const systemMessageModelSchema = new Schema({
  guild_id: {
    type: String,
    required: true
  },
  channel_id: {
    type: String,
    required: true
  }
}) // тут просто схему это определяь

const systemAnketaEmbedSchema = new Schema ({
  guild_id: {
    type: String,
    require: true,
    unique: true
  },
  title: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  color: {
    type: String,
    require: true
  },
  imageLink: {
    type: String,
    require: false
  }
}) // тут просто схему это определяь

const systemAnketaRecrutChannelSchema = new Schema({
  guild_id: {
    type: String,
    required: true
  },
  channel_id: {
    type: String,
    required: true
  } 
}) // тут просто схему это определяь 

const systemMessageModel = mongoose.model("SystemMessageModel", systemMessageModelSchema) // создаст коллекцию. Первы аргумент название коллекции, второй схема
const systemAnketaEmbed = mongoose.model("SystemAnketaEmbed", systemAnketaEmbedSchema) // создаст коллекцию. Первы аргумент название коллекции, второй схема
const systemAnketaRecrutChannel = mongoose.model("SystemAnketaRecrutChannel", systemAnketaRecrutChannelSchema) // создаст коллекцию. Первы аргумент название коллекции, второй схема

module.exports = {
  systemMessageModel,
  systemAnketaEmbed,
  systemAnketaRecrutChannel  
}; // эксопртируй для переиспользования