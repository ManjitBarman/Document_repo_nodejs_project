const User = require("../models/userModel");
const bcrypt = require('bcrypt');


//login admin method started
const loginLoad = async (req, resp) => {

    try {
        resp.render("adminLogin");
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
            if (passwordMatch) {

                if (!userData.is_admin) {
                    resp.render('adminLogin', { message: "Please verify your mail" })
                } else {
                    
                    req.session.user_id= userData._id;
                    resp.redirect(302,'admin_dashboard');
                }

            } else {
                resp.render('adminLogin', { message: "Email and password are incorect" });
            }

        } else {
            resp.render('adminLogin', { message: "Email and password are incorect" });
        }


    } catch (error) {
        console.log(error.message);
    }
}

//dshboard load
const profile_Load = async (req, resp) => {
    try {

        const adminData= await User.findById({_id:req.session.user_id});
        resp.render('adminProfile',{user:adminData})  //data send to user profile
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