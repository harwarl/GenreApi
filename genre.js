const express = require("express");
const config = require('config'); 
const app = express();
const genreController = require('./controller/genre');
const customerController = require('./controller/customer');
const movieController = require('./controller/movie');
const rentalController = require('./controller/rental');
const userController = require('./controller/user');
const authController = require('./controller/auth');
const morgan = require("morgan");

const port = process.env.PORT || 3000;

app.listen(port, ()=>console.log(`The app is running on port ${port}`));

app.use(express.json());
app.use(morgan("dev"));

app.use('/api/genres', genreController);
app.use('/api/customers', customerController);
app.use('/api/movies', movieController);
app.use('/api/rentals', rentalController);
app.use('/api/users', userController);
app.use('/api/auth', authController);