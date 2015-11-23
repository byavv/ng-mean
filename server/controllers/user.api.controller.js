var mongoose = require("mongoose");

//di for testing
module.exports = function (user, jwt) {
    var User;
    if(!user){
        User = mongoose.model("User");
    }
    if(!jwt){
        
    }
    return {
       
    }
}