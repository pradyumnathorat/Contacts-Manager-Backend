
const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema = new schema({
    email : {
        type : String ,
        required : true,
        unique : true
    },
    password : {
        type : String ,
        required : true
    }
})

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
