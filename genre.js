const express = require("express");
const app = express();
const genreController = require('./controller/genre');
const morgan = require("morgan");
const Joi = require("joi");

const port = process.env.PORT || 3000;

app.listen(port, ()=>console.log(`The app is running on port ${port}`));

app.use(express.json());
app.use(morgan("dev"));

app.use('/api/genres', genreController);