const User = require("../models/userModel");
const bcrypt = require('bcrypt');


//login admin method started
const loginLoad = async (req, resp) => {

    try {
        resp.render("facultyLogin");
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
            if (passwordMatch && userData.role ==='faculty') {

                if (!userData.is_verified) {
                    resp.render('facultyLogin', { message: "Please verify your mail" })
                } else {
                    
                    req.session.user_id= userData._id;
                    resp.redirect(302,'faculty_profile');
                }

            } else {
                resp.render('facultyLogin', { message: "Email and password are incorect or wrong login section" });
            }

        } else {
            resp.render('facultyLogin', { message: "Email and password are incorect" });
        }


    } catch (error) {
        console.log(error.message);
    }
}

//faculty logout
const facultyLogout=async(req,resp)=>{
    try {

        req.session.destroy();
        resp.redirect('/CSE');

    } catch (error) {

        console.log(error.message)   
    }
}

//profile load
const getProfile = async (req, resp) => {
    try {

        const facultyData= await User.findById({_id:req.session.user_id});
         //data send to user profile
        resp.render('facultyProfile', {user:facultyData});
    } catch {
        console.log(error.message);
    }

}


module.exports = {
    loginLoad,
    verifyLogin,
    getProfile,
    facultyLogout
}