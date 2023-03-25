const express = require("express")
const { place_order, get_order, update_order } = require("../controller/order")
const { authenticate } = require("../middleware/authenticate")


const OrderRouter = express.Router()

OrderRouter.post("/create",place_order)


OrderRouter.get("/:id",authenticate,get_order)

OrderRouter.patch("/:id",authenticate,update_order)



module.exports = {OrderRouter}