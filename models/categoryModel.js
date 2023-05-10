const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    
    category_id:{
        type:String,
        required:true,
        unique: true,
    },
    category_name:{
        type:String,
        required:true,
        unique: true,
    },
    category_date:{
        type:Date,
        required:true
    }
})

module.exports= mongoose.model("category",categorySchema)