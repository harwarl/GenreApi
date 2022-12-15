const express = require("express");
const app = express();
const morgan = require("morgan");
const Joi = require("joi");

const port = process.env.PORT || 3000;

app.listen(port, ()=>console.log(`The app is running on port ${port}`));

app.use(express.json());
app.use(morgan("dev"));

const genres = [
    {id: 1, genreType: "HipHop Music"},
    {id: 2, genreType: "Pop Music"},
    {id: 3, genreType: "Rock"},
    {id: 4, genreType: "Classical Music"}
];

app.get('/api/genres', (req, res, next)=>{
    res.send(genres);
});

app.post('/api/genres', (req, res, next)=>{
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

app.put('/api/genres/:id', (req, res, next)=>{
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

app.delete('/api/genres/:id', (req, res, next)=>{
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