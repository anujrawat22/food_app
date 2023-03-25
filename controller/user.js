const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
const salt = +process.env.salt;

exports.register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    const userexists = await UserModel.findOne({ email });

    if (userexists) {
      return res
        .status(409)
        .send({ message: "User already exists , Please Login" });
    }

    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        console.log(err);
        return res.status(401).send({ Error: err });
      } else {
        const user = await new UserModel({
          name,
          email,
          password: hash,
          address,
        });
        user.save();
        res.status(201).send({ message: "User registered sucessfully" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .send({ message: "User dosen't exists, Please Signup" });
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(401).send({ Error: err });
        }

        if (result) {
          const UserId = user._id;
          const name = user.name;
          const token = jwt.sign(
            { UserId, name, email },
            process.env.Tokensecret,
            { expiresIn: 60 * 60 * 24 * 7 }
          );
          res.cookie("token", token);
          res.status(201).send({ message: "Login Sucessful", token });
        } else {
          res
            .status(401)
            .send({ message: "Incorrect credentials , Please login again" });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};

exports.resetpassword = async (req, res) => {
  try {
    const { password, newpassword, UserId } = req.body;
    const { id } = req.params;
    if (password === newpassword) {
      return res
        .status(409)
        .send({ message: "new password same as old password" });
    }
    if (UserId !== id) {
      return res.status(401).send({ message: "Unauthorized" });
    } else {
      const user = await UserModel.findOne({ _id: id });
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          console.log(err);
          return res.status(401).send({ Error: err });
        }

        if (result) {
          bcrypt.hash(newpassword, salt, async function (err, hash) {
            if (err) {
              return res.status(401).send({ Error: err });
            }
            await UserModel.findByIdAndUpdate(
              { _id: id },
              { $set: { password: hash } }
            );
            res.status(204).send({ message: " password updated sucessfully" });
          });
        } else {
          res.status(401).send({ message: "Incorrect password" });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};
