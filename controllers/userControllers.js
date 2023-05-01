const User = require("../models/userModel");
const bcrypt = require('bcrypt');


//login user method started
const loginLoad = async (req, resp) => {

    try {
        resp.render("login");
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

                if (!userData.is_verified) {
                    resp.render('login', { message: "Please verify your mail" })
                } else {
                    
                    req.session.user_id=userData._id;
                    resp.redirect('dashboard')
                }

            } else {
                resp.render('login', { message: "Email and password are incorect" });
            }

        } else {
            resp.render('login', { message: "Email and password are incorect" });
        }


    } catch (error) {
        console.log(error.message);
    }
}

//user logout
const userLogout=async(req,resp)=>{
    try {

        req.session.destroy();
        resp.redirect('/CSE');

    } catch (error) {

        console.log(error.message)   
    }
}

//dshboard load
const getDashboard = async (req, resp) => {
    try {
        resp.render('dashboard')
    } catch {
        console.log(error.message);
    }

}


module.exports = {
    loginLoad,
    verifyLogin,
    getDashboard,
    userLogout
}