const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const User = require('../model/user').User;
const validateUser = require('../model/user').validateUser;


router.get('/me', auth, async(req, res, next)=>{
    const presentUser = await User.findOne({_id: req.user._id}).select('-password');  
    return res.json({'message': presentUser});
})

router.post('/', async(req, res, next)=>{
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({'status': true, 'message': error.details[0].message});

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).json({'status': true, 'message': 'User already exists'});

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    
    await user.save();
    // return res.status(200).json({'status': true, 'message': 'Registration Successful'})
    const token = user.generateAuthToken();

    return res.header('x-auth-token', token).send(_.pick(user, ['name', 'email']));
});

module.exports = router;