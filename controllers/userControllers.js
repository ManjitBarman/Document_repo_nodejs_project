const User =require("../models/userModel");


//login user method started
const loginLoad=async(req,resp)=>{
        
    try{
        resp.render("login");
    }catch(error){
        console.log(error.message);
    }
}

//verify login credinals
const verifyLogin= async(req,resp)=>{

    try{
        const email= req.body.email;
        const password= req.body.password;
        // console.log(req.body.email)
        
        const userData= await User.findOne({email:email});
        // console.log(userData.password)

       //checking of userdata
       if(userData){
        if(password === userData.password){
            if(userData.is_verified === 0){
                resp.render('login',{message:"Please verify your mail"})
            }else{
               resp.redirect("dashboard")
            }
        }else{
            resp.render('login',{message:"Email and password are incorect"});
        }
            
       }else{
        resp.render('login',{message:"Email and password are incorect"});
       }


    }catch(error){
        console.log(error.message);
    }
}

//dshboard load
const getDashboard= async(req,resp)=>{
    try{
        resp.render("dashboard")
    }catch{
        console.log(error.message);
    }

}


module.exports={
    loginLoad,
    verifyLogin,
    getDashboard
}