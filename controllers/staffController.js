const User = require("../models/userModel");
const bcrypt = require('bcrypt');


//login staff method started
const loginLoad = async (req, resp) => {

    try {
        resp.render("staffLogin");
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
            if (passwordMatch && userData.role ==='staff') {

                if (!userData.is_verified ) {
                    resp.render('staffLogin', { message: "Please verify your mail" })
                } else {
                    
                    req.session.user_id= userData._id;
                    resp.redirect(302,'staff_profile');
                }

            } else {
                resp.render('staffLogin', { message: "Email and password are incorect" });
            }

        } else {
            resp.render('staffLogin', { message: "Email and password are incorect" });
        }


    } catch (error) {
        console.log(error.message);
    }
}

//admin logout
const staffLogout=async(req,resp)=>{
    try {

        req.session.destroy();
        resp.redirect('/CSE');

    } catch (error) {

        console.log(error.message)   
    }
}

//Profile load
const getProfile = async (req, resp) => {
    try {

        const staffData= await User.findById({_id:req.session.user_id});
        resp.render('staffProfile',{user:staffData})
    } catch {
        console.log(error.message);
    }

}


module.exports = {
    loginLoad,
    verifyLogin,
    getProfile,
    staffLogout
}