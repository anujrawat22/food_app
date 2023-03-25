const { MenuModel } = require("../models/menu.model");
const { RestaurantModel } = require("../models/resturant.model");

exports.allrestaurants = async (req, res) => {
  try {
    const restaurants = await RestaurantModel.find();
    res
      .status(201)
      .send({ message: "All Restaurants Data", data: restaurants });
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};

exports.restaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await RestaurantModel.findById({ _id: id });
    if (restaurant) {
      res
        .status(200)
        .send({ message: `Restaurant with id - ${id}`, data: restaurant });
    } else {
      res.status(404).send({ message: `Restaurant with id - ${id} not found` });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};

exports.menu = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await MenuModel.find({ restaurant_id: id });
    if (menu.length > 0) {
      res
        .status(200)
        .send({
          message: `Menu data of restaurant with id - ${id}`,
          data: menu,
        });
    } else {
      res
        .status(404)
        .send({ message: `No menu data found for restaurant with id - ${id}` });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};

exports.create_resturant = async (req, res) => {
  try {
    const { name, address} = req.body;
    const UserId  = req.body.UserId
    const restaurant = await new RestaurantModel({
      name,
      address,
      owner_id: UserId,
    });
    restaurant.save();
    res.status(201).send({ message: "Restaurant created sucessfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};

exports.create_menu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, UserId } = req.body;

    const restaurant = await RestaurantModel.findOne({ _id: id });

    if (restaurant) {
        
        const owner_id = restaurant.owner_id.toHexString()
        console.log(owner_id,UserId)
      if (owner_id === UserId) {
        const menu = await new MenuModel({
          name,
          description,
          price,
          image,
          restaurant_id: id,
        });
        menu.save();
        return res
          .status(201)
          .send({
            message: `Menu for restaurant with id - ${id} created sucessfully`,
          });
      } else {
        return res.status(401).send({ message: "Unauthorized" });
      }
    } else {
      res.status(404).send({ message: `Restaurant with id - ${id} not found` });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};

exports.delete_menu = async (req, res) => {
  try {
    const { restaurantid, menuid } = req.params;
    const { UserId } = req.body;

    const restaurant = await RestaurantModel.findOne({ _id: restaurantid });

    if (restaurant) {
        const owner_id = restaurant.owner_id.toHexString()
      if (owner_id === UserId) {
        await MenuModel.findOneAndDelete({ _id: menuid });
        return res
          .status(202)
          .send({ message: `Menu with id - ${menuid} deleted sucessfully` });
      } else {
        return res.status(401).send({ message: "Unauthorized" });
      }
    } else {
      res.status(404).send({ message: `Restaurant with id - ${id} not found` });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};
