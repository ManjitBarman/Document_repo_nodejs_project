const express = require('express');
const connectDB = require("./db/connectdb");
const app = express();
const port = process.env.PORT || '3000'
const DATABASE_URL= process.env.DATABASE_URL || "mongodb://127.0.0.1:27017";

const homeRoute = require("./routes/homeRoute");
const userRoute = require("./routes/userRoute")

//database connection 
connectDB(DATABASE_URL);

app.use(express.json());

//static file use 
app.use('/public',express.static('public'))

//for load usrer route
app.use('/CSE',homeRoute);
app.use('/CSE',userRoute);

app.listen(port, ()=>{
    console.log(`Server listen at http://localhost:${port}`)
})
