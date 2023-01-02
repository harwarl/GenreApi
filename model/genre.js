const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

mongoose.connect('mongodb://127.0.0.1:27017/genre')
    .then(()=>console.log('Connected To DB'))
    .catch(err=>console.log(err));

const customerSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    phone: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    }
});

const genreSchema = new Schema({
    genreType: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 25
    }
});

const movieSchema = new Schema({
    title : {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 35
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
})

const rentalSchema = new Schema({
    customer : {
        type : new Schema({
            name : {
                type: String, 
                required: true,
                minlength: 5,
                maxlength: 50
            },
            phone : {
                type: String,
                minlength: 5,
                maxlength: 50
            },
            isGold: {
                type: Boolean,
                default: false
            }
        }),
        required: true
    },
    
    movie: {
        type: new Schema({  //movie selected schema
            title: {
                type: String,
                required: true,
                minlength: 2,
                maxlength: 35
            },
            numberInStock: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut : {
        type: Date,
        default: Date.now,
        required: true
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

const Customer = mongoose.model('Customer', customerSchema);
const Genre = mongoose.model('Genre', genreSchema);
const Movie = mongoose.model('Movie', movieSchema);
const Rental = mongoose.model('Rental', rentalSchema);

module.exports = { Genre, Customer, Movie, Rental};