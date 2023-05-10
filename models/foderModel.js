const mongoose = require('mongoose');
const categoryModel = require('./categoryModel');


const categorySchema = new mongoose.Schema({
    
    category_id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category'
    }],
    
    folder_name:{
        type:String,
        required:true,
        unique: true,
    },
    folder_no:{
        type:String,
        required:true,
        unique: true,
    },
    
    folder_date:{
        type:Date,
        required:true 
    }
})

module.exports= mongoose.model("folders",categorySchema)