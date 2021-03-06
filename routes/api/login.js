'use strict';

const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

router.post('/', async function(req, res, next) {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({ username });
    console.log("llega user", user);
    if (!user || !bcrypt.compareSync(password, user.password)){
        const error = new Error('Invalid credentials');
        next(error);
    }
    const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET, {
        expiresIn: '2d'
    });

    res.cookie('token', token);
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
