const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../model/user').User;

router.post('/', async(req, res, next)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).json({'status': true, 'message': error.details[0].message});
    const { email } = req.body;

    const user = await User.findOne({email: email});
    if(!user) return res.status(400).json({'status': true, 'message': 'Email or password invalid'});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).json({'status': true, 'message': 'Password invalid'});

    //create a token when a user has signed in.
    console.log(user);
    const token = user.generateAuthToken();
    console.log(token);

    return res.status(200).json({'status': true, 'message': token});
})

function validate(req){
    const schema = Joi.object({
        email : Joi.string().email().required(),
        password: Joi.string().min(8).max(255).required()
    });
    return schema.validate(req);
}

module.exports = router;