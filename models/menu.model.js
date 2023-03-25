const mongoose = require('mongoose')

const menuSchema = mongoose.Schema({
    name : {type : String},
    description : {type : String},
    price : {type : Number},
    image : {type : String},
    restaurant_id : {type : mongoose.Schema.Types.ObjectId , ref : 'restaurant'}
})

const MenuModel = mongoose.model('menu',menuSchema)

module.exports = {MenuModel}