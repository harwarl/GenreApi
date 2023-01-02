const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const User = require('../model/user').User;
const validateUser = require('../model/user').validateUser;

router.post('/', async(req, res, next)=>{
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({'status': true, 'message': error.details[0].message});

    const { name } = req.body;
    const { email } = req.body;
    const { password } = req.body;

    let user = await User.findOne({email: email});
    if(user) return res.status(400).json({'status': true, 'message': 'User already exists'});

    // const user = new User({
    //     name : name,
    //     email : email,
    //     password : password
    // });

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    
    await user.save();
    console.log('Registration Successful');   
    // return res.status(200).json({'status': true, 'message': 'Registration Successful'})
    return res.status(200).send(_.pick(user, ['name', 'email']));
});

module.exports = router;