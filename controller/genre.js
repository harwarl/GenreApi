const express = require('express');
const router = express.Router();
const Genre = require('../model/genre');
const Customer = require('../model/customer');
const Joi = require('joi');

// const genres = [
//     {id: 1, genreType: "HipHop Music"},
//     {id: 2, genreType: "Pop Music"},
//     {id: 3, genreType: "Rock"},
//     {id: 4, genreType: "Classical Music"}
// ];

router.get('/', async(req, res, next)=>{
    const genres = await Genre.find()
    .select('genreType');
    res.send(genres);
});

router.get('/:id', async(req, res, next)=>{
    // const genre = genres.find(g => g.id === parseInt(req.params.id));
    // if(!genre) res.status(404).send("The genre with the specified Id not found")
    const genre = await Genre.findById(req.params.id).select('genreType');
    if(!genre) return res.status(404).send('The genre with the specified Id was not found');
    res.send(genre);
})

router.post('/', async(req, res, next)=>{
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

router.put('/:id', async(req, res, next)=>{
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

router.delete('/:id', async(req, res, next)=>{
    //find genre
    // const genre = genres.find(g => g.id === parseInt(req.params.id));
    // if(!genre) res.status(404).send("The inputted ID was not found");

    // //delete genre
    // const index = genres.indexOf(genre);
    // genres.splice(index, 1);

    // //send deleted genre
    const result = await Genre.findByIdAndRemove({_id: req.params.id})
    if(!result) return res.status(404).send(err.message);
    res.send(genre);
})

function validateGenre(genre){
    const schema = {
        genreType: Joi.string().min(3).max(25).required()
    };
    return Joi.validate(genre, schema);
}
module.exports = router;