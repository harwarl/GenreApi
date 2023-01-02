const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const userSchema = new Schema ({
    name: {
        type: String,
        minlength: 5,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }
});

const User = mongoose.model('User', userSchema);

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(30).required()
    });
    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;