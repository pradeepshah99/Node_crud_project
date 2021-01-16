var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

let schema = mongoose.Schema;

let user = new schema(
{
    fullname : {type:String},
    
    email: {type:String},
    password : {type:String},
    
    mobile : {type:String},
    city : {type:String},
    state : {type:String},
    country : {type:String},


},
{collation: "user"}
);

user.pre('save', async function(next){
    try{
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(this.password, salt);

        next();
    }
    catch(error)
    {
        next(error);
    }
});


user.methods.isValid = function(hashedpassword){
    return  bcrypt.compareSync(hashedpassword, this.password);
}
mongoose.set('useFindAndModify',false);

module.exports = mongoose.model('user', user);