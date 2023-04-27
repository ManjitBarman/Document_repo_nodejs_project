const mongoose =require('mongoose');

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
   
    password:{
        type:String,
        required:true
    },

    is_admin:{
        type:Number,
        default:true
    },
    is_varified:{
        type:Number,
        default:1
    },
    phone:{
        type:Number,
        required:true,
        unique: true,
        maxlength: [10, 'Phone number cannot be longer than 10 digits.']
    },

})

module.exports= mongoose.model("user",userSchema)