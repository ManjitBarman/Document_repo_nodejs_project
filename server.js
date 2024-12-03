const express = require('express');
const connectDB = require("./db/connectdb");
const app = express();
const port = process.env.PORT || '5000'
const DATABASE_URL= process.env.DATABASE_URL || "mongodb://127.0.0.1:27017";


const homeRoute = require("./routes/homeRoute");
const adminRoute = require("./routes/adminRoute");
const staffRoute = require("./routes/staffRoute");
const facultyRoute = require("./routes/facultyRoute");
const hodRoute = require("./routes/hodRoutes");


//database connection 
connectDB(DATABASE_URL);

app.use(express.json());  

//static file use 
app.use('/public',express.static('public'))

//static file for bootstrap

// app.use("/css",express.static("node_modules/bootstrap/dist/css"));
// app.use("/js",express.static("node_modules/bootstrap/dist/js"));

//for load usrer route
app.use('/CSE',homeRoute);
app.use('/CSE/admin',adminRoute);
app.use('/CSE/staff',staffRoute);
app.use('/CSE/faculty',facultyRoute);
app.use('/CSE/hod',hodRoute);

console.log(performance.now());

app.listen(port, ()=>{
    console.log(`Server listen at http://localhost:${port}`)
})


