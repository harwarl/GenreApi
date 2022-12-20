const express = require('express');
const router = express.Router();
const Genre = require('../model/genre');

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
    // if(!genre) res.status(404).send("The genre with the specified Id not found");
    try{
        const genre = await Genre.findById(req.params.id).select('genreType');
        res.send(genre);
    }
    catch(err){
        if(err) res.status(404).send('The genre with the specified Id was not found');
        return;
    }
})

router.post('/', async(req, res, next)=>{
    // const { error } = validateGenre(req.body);
    // if(error){
    //     res.status(400).send(error.details[0].message);
    //     return;
    // };
    // const genre = {
    //     id: genres.length + 1,
    //     genreType: req.body.genreType
    // };
    const genre = new Genre({
        genreType: req.body.genreType
    })
    try{
        const result = await genre.save();
        console.log(result);
        res.send(result);
    }
    catch(err){
        if(err){
            res.status(404).send(err.message);
            return;
        }
    }
})

router.put('/:id', async(req, res, next)=>{
    //find genre
    // const genre = genres.find(g => g.id === parseInt(req.params.id));
    // if(!genre) res.status(404).send("The inputted ID was not found");

    // //validate genre
    // const { error } = validateGenre(req.body);
    // if(error){
    //     res.status(400).send(error.details[0].message);
    //     return;
    // };

    //update genre
    try{
        const genre = await Genre.findByIdAndUpdate({_id: req.params.id}, {
            $set: {
                genreType: req.body.genreType
            }
        });
        res.send(genre);
    }
    catch(err){
        if(err)res.status(400).send(err.message);
        return;
    }
});

router.delete('/:id', async(req, res, next)=>{
    //find genre
    // const genre = genres.find(g => g.id === parseInt(req.params.id));
    // if(!genre) res.status(404).send("The inputted ID was not found");

    // //delete genre
    // const index = genres.indexOf(genre);
    // genres.splice(index, 1);

    // //send deleted genre

    res.send(genre);
})

module.exports = router;