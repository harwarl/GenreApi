const express = require("express");
const app = express();
const genreController = require('./controller/genre');
const customerController = require('./controller/customer');
const morgan = require("morgan");
const Joi = require("joi");
const Customer = require("./model/customer");

const port = process.env.PORT || 3000;

app.listen(port, ()=>console.log(`The app is running on port ${port}`));

app.use(express.json());
app.use(morgan("dev"));

app.use('/api/genres', genreController);
app.use('/api/customers', customerController);