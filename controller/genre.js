const express = require('express');
const router = express.Router();

const genres = [
    {id: 1, genreType: "HipHop Music"},
    {id: 2, genreType: "Pop Music"},
    {id: 3, genreType: "Rock"},
    {id: 4, genreType: "Classical Music"}
];

router.get('/', (req, res, next)=>{
    res.send(genres);
});

router.get('/:id', (req, res, next)=>{
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) res.status(404).send("The genre with the specified Id not found");

    res.send(genre);
})

router.post('/', (req, res, next)=>{
    const { error } = validateGenre(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    };
    const genre = {
        id: genres.length + 1,
        genreType: req.body.genreType
    };

    genres.push(genre);
    res.send(genres);
})

router.put('/:id', (req, res, next)=>{
    //find genre
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) res.status(404).send("The inputted ID was not found");

    //validate genre
    const { error } = validateGenre(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    };

    //update genre
    genre.genreType = req.body.genreType;
    res.send(genres);
})

router.delete('/:id', (req, res, next)=>{
    //find genre
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) res.status(404).send("The inputted ID was not found");

    //delete genre
    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    //send deleted genre
    res.send(genre);
})

function validateGenre(genre){
    const schema = {
        genreType: Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema);
}

module.exports = router;