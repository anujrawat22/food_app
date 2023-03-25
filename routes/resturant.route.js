const express = require("express");
const { allrestaurants, restaurant, menu, create_menu, create_resturant, delete_menu } = require("../controller/restaurant");
const { authenticate } = require("../middleware/authenticate");
const RestaurantRouter = express.Router();

RestaurantRouter.get("/", allrestaurants);

RestaurantRouter.get("/:id",restaurant)

RestaurantRouter.post("/create",authenticate,create_resturant)

RestaurantRouter.get("/:id/menu",menu)

RestaurantRouter.post("/:id/menu",authenticate,create_menu)

RestaurantRouter.delete("/:restaurantid/menu/:menuid",authenticate,delete_menu)

module.exports = { RestaurantRouter };
