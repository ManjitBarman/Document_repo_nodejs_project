const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Folder = require("../models/foderModel");
const bcrypt = require('bcrypt');
const randomString = require("randomstring");
const nodemailer = require('nodemailer');



//method for hash password
const securePassword = async (password) => {
    try {

        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash;

    } catch (error) {
        console.log(erro.message)
    }
}

//for send mail

const addUserMail = async (name, email, password, user_id) => {

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'manjitbarman2017@gmail.com',
                pass: 'ktxzqrrqilqyfqyg'
            }
        })
        const mailOptions = {
            from: 'manjitbarman2016@gmail.com',
            to: email,
            subject: 'Admin add you into CSE Repository system and verify your mail',
            html: '<P>Hii ' + name + ',please click here to <a href="http://127.0.0.1:3000/CSE/admin/verify?id=' + user_id + '">verify</a> your mail</p> <br> <b>Email:- </b> ' + email + '<br><b>Password:-</b>' + password + ''
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log("Email has been sent:- ", info.response);
                render('addOneUser', { info: 'Email has been sent to user' })
            }
        })

    } catch (error) {
        console.log(error.message)
    }

}


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

                    req.session.user_id = userData._id;
                    resp.redirect(302, 'admin_dashboard');
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

        const adminData = await User.findById({ _id: req.session.user_id });
        resp.render('adminProfile', { user: adminData })  //data send to user profile
    } catch {
        console.log(error.message);
    }

}

// load addUser

const addUserLoad = async (req, resp) => {
    try {

        resp.render('addUser')  //data send to user profile
    } catch {
        console.log(error.message);
    }

}



const addOneUserLoad = async (req, resp) => {
    try {

        resp.render('addOneUser')
    } catch {
        console.log(error.message);
    }

}


const addUser = async (req, resp) => {
    try {
        const name = req.body.username;
        const email = req.body.email;
        const phone = req.body.phone;
        const role = req.body.role;
        // console.log(role);
        const password = randomString.generate(8);

        const spassword = await securePassword(password);

        const existData = await User.findOne({ email: email });
        // console.log(existData.email);

        if (existData) {

            resp.render('addUser', { message: 'email or password is already exist' });

        } else {

            const user = new User({
                username: name,
                email: email,
                password: spassword,
                is_admin: 'false',
                phone: phone,
                role: role
            });

            const userData = await user.save();
            // console.log(userData)

            if (userData) {
                addUserMail(name, email, password, userData._id);
                resp.redirect(302, 'add_user');
            } else {
                resp.render('addUser', { message: 'something wrong' });
            }

        }



    } catch (error) {
        console.log(error.message);
    }

}


//verify mail

const verifyMail = async (req, resp) => {
    try {

        const updateInfo = await User.updateOne({ _id: req.query.id }, { $set: { is_verified: 'true' } });

        console.log(updateInfo);
        resp.render("email-verified");

    } catch (error) {
        console.log(eror.message);
    }
}

//Load userlist
const userListLoad = async (req, resp) => {
    try {
        const usersData = await User.find({ is_admin: 'false' })
        resp.render('userList', { users: usersData });

    } catch (error) {
        console.log(error.message);
    }
}

//load editUser

const editUserLoad = async (req, resp) => {
    try {

        resp.render('editUser');
        // const id= req.query.id;
        // console.log(id);

        // const userData = await User.findById(ObjectId(id));

        // if(userData){
        //     resp.render('editUser',{user:userData});
        // }else{
        //     return resp.redirect('show_user_list');
        // }
        // id= <%- users[i]._id %>" for to send id through url

    } catch (error) {
        console.log(error.message)
    }
}


//admin logout
const adminLogout = async (req, resp) => {
    try {

        req.session.destroy();
        resp.redirect('/CSE');

    } catch (error) {

        console.log(error.message)
    }
}


// add_category LOad 

const CategoryLoad = async (req, resp) => {
    try {
        resp.render('category');
    } catch (error) {
        console.log(error.message)
    }
}

// Add category

const addCategory = async (req, resp) => {
    try {
        const catName = req.body.catName;
        const catNumber = req.body.catId;
        const date = req.body.date;
        // console.log(catName);

        const existCatName = await Category.findOne({ category_name: catName });
        const existCatId = await Category.findOne({ category_name: catName });


        if (existCatName || existCatId) {

            resp.render('category', { message: 'Category name or number already exist' });

        } else {

            const category = new Category({
                category_id: catNumber,
                category_name: catName,
                category_date: date

            });

            const categoryData = await category.save();

            if (categoryData) {

                resp.redirect(302, 'add_category');
            } else {

                resp.render('category', { message: 'try again something wrong ' })
            }
        }

    } catch (error) {
        console.log(error.message)
    }
}



const folderLoad = async (req, resp) => {
    try {
        const data = await Category.find()
        resp.render('addFolder', { result: data });
    } catch (error) {
        console.log(error.message)
    }
}

const addFolder = async (req, resp) => {
    try {

        const foldName = req.body.folderName;
        const foldNo = req.body.folderNo;
        const folDate = req.body.date
        const catName = req.body.catId
        const categoryId = await Category.findOne({ category_name: catName });

        //check data existance

        const existFolder_name = await Folder.findOne({ folder_name: foldName });
        const existFolder_no = await Folder.findOne({folder_no: foldNo});
        console.log(existFolder_no)

        //for fix error 
        const result =await Category.find();

        if (existFolder_name || existFolder_no) {

             return resp.render('addFolder', { message: 'Folder name or folder No already exist',result })
        } else {

            const folder = new Folder({
                category_id: categoryId._id,
                folder_name: foldName,
                folder_no: foldNo,
                folder_date:folDate
            })

            const folderData = await folder.save();

            if (folderData) {
                resp.redirect(302, 'add_user')

            } else {
               return resp.render('addFolder', { message: 'try again something wrong ' })
            }

        }



    } catch (error) {
        console.log(error.message)
    }
}


module.exports = {
    loginLoad,
    verifyLogin,
    profile_Load,
    adminLogout,
    addUser,
    verifyMail,
    addUserMail,
    addUserLoad,
    addOneUserLoad,
    userListLoad,
    editUserLoad,
    CategoryLoad,
    addCategory,
    folderLoad,
    addFolder
}