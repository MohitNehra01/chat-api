const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required: [true , 'user name is Required'],
        minLength : [5 , 'Name must be at least 5 char'],
        maxLength : [50 , 'Name must be less than 50 char'],
        trim : true
     },
     email:{
        type : String,
        required: [true , 'user email is required'],
        unique: true,
        lowercase : true , 
        unique: [true , 'alread registerd'],
        trim: true,
      //   match: [
      //      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/ , 'Pleae fill in a valid email address'
      //   ]
        match: [
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Pleae fill in a valid email address'
        ]
     },
     password :{
        type : String,
        required: [true , 'Password is required'],
        minLegth: [8 , 'Password must be at least 8 characters'],
        select : false,
      //   match: [
      //    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/,
      //    'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
      //   ]
     },
     avatar: {
        public_id: {
           type: 'String'
        },
        secure_url : {
           type: 'String'
        }
     },

},{
    timestamps:true
})
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }

    this.password = await bcrypt.hash(this.password , 10);
    return next();

})

userSchema.methods = {
    passwordCompare : async function(password){
        return  await bcrypt.compare(password , this.password)
      }  ,

    jwtToken: async ()=>{
        
        const payload = {
            id:this._id,
            email:this.email
        }
        const secretKey = process.env.JWT_SECRET;

        const option = {
            expiresIn : process.env.JWT_EXPIRY
        }
        return await JWT.sign(
        payload,secretKey,option
        )
    }
}
const User = mongoose.model('users',userSchema);

module.exports = User;