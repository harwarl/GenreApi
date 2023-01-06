const express = require('express');
const router = express.Router();
const Genre = require('../model/genre').Genre;
const Joi = require('joi');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, async(req, res, next)=>{
    const genres = await Genre.find()
    .select('genreType');
    res.send(genres);
});

router.get('/:id', auth, async(req, res, next)=>{
    const genre = await Genre.findById(req.params.id).select('genreType');
    if(!genre) return res.status(404).send('The genre with the specified Id was not found');
    res.send(genre);
})

router.post('/', auth, async(req, res, next)=>{
    const { error } = validateGenre(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    };
    const genre = new Genre({
        genreType: req.body.genreType
    })
    const result = await genre.save();
    if(!result) return res.status(404).send(err.message);
    res.send(result);
})

router.put('/:id', auth, async(req, res, next)=>{
    const { error } = validateGenre(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    };

    const genre = await Genre.findByIdAndUpdate({_id: req.params.id}, {
            $set: {
                genreType: req.body.genreType
            }
        });
        if(!result) return res.status(404).send(err.message);
        res.send(genre);
});

router.delete('/:id', [auth, admin], async(req, res, next)=>{
    //find genre
    // const genre = genres.find(g => g.id === parseInt(req.params.id));
    // if(!genre) res.status(404).send("The inputted ID was not found");

    // //delete genre
    // const index = genres.indexOf(genre);
    // genres.splice(index, 1);

    // //send deleted genre
    const result = await Genre.findByIdAndRemove({_id: req.params.id})
    if(!result) return res.status(404).json({'message': 'specified genre was not found...'});
    res.json('genre deleted by admin');
})

function validateGenre(genre){
    const schema = {
        genreType: Joi.string().min(3).max(25).required()
    };
    return Joi.validate(genre, schema);
}
module.exports = router;