const express = require('express');
const router = express.Router();
const _ = require('lodash');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');  
const User = require('../model/user').User;

router.post('/', async(req, res, next)=>{
    const { error } = validate(req.body);
    if (error) return res.status(400).json({'status': true, 'message': error.details[0].message});

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).json({'status': true, 'message': 'Invalid Email or Password'});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).json({'status': true, 'message': 'Invalid Password'});

    const token = jwt.sign({_id: user._id}, process.env.PRIVATEKEY);

    res.status(200).json({'status': true, 'message': token});
});

function validate(request){
    const schema = Joi.object({
        email: Joi.string().email().min(10).max(255).required(),
        password: Joi.string().min(8).max(255).required()
    });
    return schema.validate(request);
}

module.exports = router;