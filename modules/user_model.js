const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

mongoose.connect('mongodb://localhost/myDb');

// let db = mongoose.connection;

const Schema = mongoose.Schema;
const UserSchema= new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
})

let User = module.exports = mongoose.model('User', UserSchema);

module.exports.checkIfUserExist = function(userEmail, callback) {
    User.findOne({email: userEmail}, callback);
}

module.exports.createUser = function(newUser, cb) {
    bcrypt.hash(newUser.password, null, null, function(err, hash) {
        // Store hash in your password DB.
        if (err) throw err;
        newUser.password = hash;
        newUser.save(cb);
    });
}

module.exports.getUserByUsername = function(username, callback) {
    var query = {username: username}
    User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}


module.exports.comparePassword = function(userPassword, hash, callback) {
    bcrypt.compare(userPassword, hash, function(err, isMatch) {
        if (err) throw err;
        callback(null, isMatch)
    });   
    
}




