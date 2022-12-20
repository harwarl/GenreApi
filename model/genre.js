const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://127.0.0.1:27017/genre')
    .then(()=>console.log('Connected To DB'))
    .catch(err=>console.log(err));

const genreSchema = new Schema({
    genreType: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 25
    }
});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;