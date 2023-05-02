const User = require("../models/userModel");
const bcrypt = require('bcrypt');


//login Hod method started
const loginLoad = async (req, resp) => {

    try {
        resp.render("hodLogin");
    } catch (error) {
        console.log(error.message); 
    }
}

//verify login credinals
const verifyLogin = async (req, resp) => {

    try {
        const email = req.body.email;
        const password = req.body.password;
        // console.log(req.body.email)

        const userData = await User.findOne({ email: email });
        //checking of userdata
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password)
            if (passwordMatch && userData.role==='hod') {

                if (!userData.is_verified) {
                    resp.render('hodLogin', { message: "Please verify your mail" })
                } else {
                    
                    req.session.user_id= userData._id;
                    resp.redirect(302,'hod_profile');
                }

            } else {
                resp.render('hodLogin', { message: "Email and password are incorect or wrong login panel" });
            }

        } else {
            resp.render('hodLogin', { message: "Email and password are incorect" });
        }


    } catch (error) {
        console.log(error.message);
    }
}

//dshboard load
const profile_Load = async (req, resp) => {
    try {

        const adminData= await User.findById({_id:req.session.user_id});
        resp.render('hodProfile',{user:adminData})  //data send to user profile
    } catch {
        console.log(error.message);
    }

}

const addUserLoad = async (req, resp) => {
    try {
        resp.render('addUser')
    } catch {
        console.log(error.message);
    }

}

//admin logout
const adminLogout=async(req,resp)=>{
    try {

        req.session.destroy();
        resp.redirect('/CSE');

    } catch (error) {

        console.log(error.message)   
    }
}

module.exports = {
    loginLoad,
    verifyLogin,
    profile_Load,
    adminLogout,
    addUserLoad
}