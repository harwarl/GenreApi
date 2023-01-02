const express = require('express');
const router = express.Router();
const Customer = require('../model/genre').Customer;
const Movie = require('../model/genre').Movie;
const Fawn = require('fawn'); //two phase commit 
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Rental = require('../model/genre').Rental;

Fawn.init('mongodb://127.0.0.1:27017/genre');

router.get('/', async(req, res, next)=>{
    const rental = await Rental.find()
    .select('-dateOut');
    res.send(rental);
});

router.post('/', async(req, res)=>{
    const { error } = validateRental(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(404).send('Invalid Movie');

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(404).send('Invalid Customer');

    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold
        },
        movie: {
            _id : movie._id,
            title: movie.title,
            numberInStock: movie.numberInStock,
            dailyRentalRate: movie.dailyRentalRate
        },
        rentalFee: req.body.rentalFee,
        dateReturned: req.body.dateReturned
    })
    
    //using Fawn
    
    try
    {
    new Fawn.Task()
    .save('rentals', rental) //saves new content to rentals collection
    .update('movies', { _id: movie._id }, {
        $inc: { numberInStock: -1 }
    })
    .run();
    console.log("Fawn task done");
    res.send(rental);
    }
    catch(err){
        return res.status(500).send("Something Failed");
    }
    // const result = await rental.save();
    // movie.numberInStock--;  //update number in stock for that particular movie
    // movie.save();  all done in fawn

})

function validateRental(rental){
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
        rentalFee: Joi.number().min(0)
    };
    return Joi.validate(rental, schema);
}

module.exports = router;