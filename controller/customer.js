const express = require('express');
const router = express.Router();
const Customer = require('../model/customer');
const Joi = require('joi');

router.get('/', async(req, res, next)=>{
    const customer = await Customer.find()
    .select('name phone');
    res.send(customer);
});

router.get('/:id', async(req, res, next)=>{
    const customer = await Customer.findById(req.params.id)
    .select('name phone');
    if(!customer) return res.status(404).send('The customer with the specified Id was not found');
    res.send(customer);
});

router.post('/', async(req, res, next)=>{
    const { error } = validateCustomer(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    const customer = new Customer({
        name : req.body.name,
        phone : req.body.phone,
        isGold : req.body.isGold
    });

    const result = await customer.save();
    res.send(result);
});

router.put('/:id', async(req, res, next)=>{
    const { error } = validateCustomer(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    };

    const customer = await Customer.findByIdAndUpdate({_id: req.params.id}, {
            $set: {
                name : req.body.name,
                phone : req.body.phone,
                isGold : req.body.isGold
            }
        });
        if(!result) return res.status(404).send(err.message);
        res.send(customer);
});

router.delete('/:id', async(req, res, next)=>{
    const result = await Genre.findByIdAndRemove({_id: req.params.id})
    if(!result) return res.status(404).send(err.message);
    res.send(genre);
});

function validateCustomer(customer){
    const schema ={
     name : Joi.string().min(3).max(50).required(),
     phone : Joi.string().min(3).max(50).required(),
     isGold : Joi.boolean()
     };
     return Joi.validate(customer, schema);
 };

 module.exports = router;