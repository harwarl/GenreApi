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
    const schema = {
        genreType: Joi.string().min(2).required()
    };
    const result = Joi.validate(req.body, schema);
    if(result.error){
        res.status(400).send(result.error);
        return;
    };
    const genre = {
        id: genres.length + 1,
        genreType: req.body.genreType
    };

    genres.push(genre);
    res.send(genres);
})