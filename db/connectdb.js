const mongoose = require('mongoose');

const connectDB = async(DATABASE_URL)=>{
    try{
        const DB_OPTIONS={
            dbName: "document_repo",
        };
        await mongoose.connect(DATABASE_URL,DB_OPTIONS);
        console.log("connnected succesfuly...");
    }catch(err){
        console.log(err);
    }
};

module.exports = connectDB;