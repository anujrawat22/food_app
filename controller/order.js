const { OrderModel } = require("../models/order.model");
const { RestaurantModel } = require("../models/resturant.model");

exports.place_order = async (req, res) => {
  try {
    const { items, totalPrice, deliveryAddress, UserId, restaurantId } =
      req.body;
    const order = await new OrderModel({
      user: UserId,
      restaurant: restaurantId,
      items,
      totalPrice,
      deliveryAddress,
      status: "placed",
    });
    order.save();
    res.status(201).send({ message: "Order placed sucessfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};

exports.get_order = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findOne({ _id: id });
    res.status(200).send({ message: `Order with id - ${id}`, order });
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};

exports.update_order = async (req, res) => {
  try {
    const { id } = req.params;
    const { UserId,status } = req.body;
    const restaurant = await RestaurantModel.findOne({owner_id : UserId})
    if(restaurant){
         const order = await OrderModel.findOne({_id : id})
         const order_restaurant_id = order.restaurant.toHexString()
         const restaurant_id = restaurant._id.toHexString()
         if(order_restaurant_id === restaurant_id){
           await OrderModel.findOneAndUpdate({_id : id},{$set : {status}})
           return res.status(204).send({message : "Status updated sucessfully"})
         }else{
            return res.status(401).send({message : "Unauthorized"})
         }
    }else{
        res.status(404).send({message : "Not found"})
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};
