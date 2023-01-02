const Movie = require('../model/genre').Movie;
const Genre = require('../model/genre').Genre;
const express = require('express');
const router = express.Router();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

router.get('/', async(req, res)=>{
    const movie = await Movie.find().sort('-numberInStock');
    if (!movie) return res.status(404).send('No Movie Found');
    res.send(movie);
})

router.post('/', async(req, res)=>{
    const {error} = validateMovie(req.body);
    if(error){
        return res.status(404).send(error.details[0].message);
    };
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send('Invalid genre');

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
           genreType: genre.genreType
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    const result = await movie.save();
    res.send(result);
})

function validateMovie(movie){
    const schema = {
        title: Joi.string().min(2).max(35).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required()
    };
    return Joi.validate(movie, schema);
}

module.exports = router;