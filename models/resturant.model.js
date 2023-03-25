const mongoose = require("mongoose");

const restaurantSchema = mongoose.Schema({
    name: {type : String ,required: true},
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zip: String
    },
    owner_id : {type : mongoose.Schema.Types.ObjectId , ref : 'user'}
});

const RestaurantModel = mongoose.model("restaurant", restaurantSchema);

module.exports = { RestaurantModel };