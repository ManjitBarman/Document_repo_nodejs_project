const mongoose = require('mongoose');
const categorytModel = require('./categoryModel');
const folderModel = require('./foderModel');


const documentSchema = new mongoose.Schema({
    
    category_id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category'
    }],

    folder_id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'folder'
    }], 

    doc_name:{
        type:String,
        required:true
    },
    
    doc_title:{
        type:String,
        required:true,
    },
    document_no:{
        type:String,
        unique: true,
    },

    keyword:{
        type:String
    },
    
    document_date:{
        type:Date,
        required:true 
    },

    file_path:{
        type:String,
    },
    doc_size:{
        type:String
    }

})

module.exports= mongoose.model("document",documentSchema)