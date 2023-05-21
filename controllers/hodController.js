const User = require("../models/userModel");
const Category = require('../models/categoryModel')
const Folder = require('../models/foderModel')
const Document = require("../models/documentModel")
const {validationResult}= require('express-validator');



const bcrypt = require('bcrypt');
const randomString = require("randomstring");
const nodemailer = require('nodemailer');

// for password Hash
const securePassword= async(password)=>{
    try {

        const passwordHash= await bcrypt.hash(password,10)
        return passwordHash;
        
    } catch (error) {
        console.log(erro.message)
    }
}

//for send mail

const addUserMail= async(name,email,password,user_id)=>{

    try {
        const transporter= nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:'manjitbarman2017@gmail.com',
                pass:'ktxzqrrqilqyfqyg'
            }
        })
        const mailOptions={
            from:'manjitbarman2017@gmail.com',
            to:email,
            subject:'Admin add you into CSE Repository system and verify your mail',
            html:'<P>Hii '+name+',please click here to <a href="http://127.0.0.1:3000/CSE/admin/verify?id='+user_id+'">verify</a> your mail</p> <br> <b>Email:- </b> '+email+'<br><b>Password:-</b>'+password+''
        }
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error)
            }else{
                console.log("Email has been sent:- ",info.response);
                render('addUser',{info:'Email has been sent to user'})
            }
        })
        
    } catch (error) {
        console.log(error.message)     
    }

}




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

// for add new user

const addUser= async (req, resp) => {
    try {
        const name= req.body.username;
        const email =req.body.email;
        const phone =req.body.phone;
        const role =req.body.role;
        // console.log(role);
        const password = randomString.generate(8);

        const spassword = await securePassword(password);

        const existData = await User.findOne({ email: email });
        // console.log(existData.email);

        if (existData){

            resp.render('addUser',{message:'email or password is already exist'});

        }else{

            const user= new User({
                username:name,
                email:email,
                password:spassword,
                is_admin:'false',
                phone:phone,
                role:role
            });
    
            const userData = await user.save();
            // console.log(userData)
    
            if(userData){
                addUserMail(name,email,password,userData._id);
                resp.redirect(302,'add_user');
            }else{
                resp.render('addUser',{message:'something wrong'});
            }

        }    

    } catch(error) {
        console.log(error.message);
    }

}

//verify mail

const verifyMail = async(req,resp)=>{
    try {

       const updateInfo= await User.updateOne({_id:req.query.id},{$set:{is_verified:'true'}});

       console.log(updateInfo);
       resp.render("email-verified");
        
    } catch (error) {
        console.log(eror.message);        
    }
}


//Load userlist
const userListLoad= async(req,resp)=>{
    try {
        const usersData= await User.find({is_admin:'false'})
        resp.render('userList',{users:usersData}); 
        
    } catch (error) {
        console.log(error.message);
    }
}

//admin logout
const hodLogout=async(req,resp)=>{
    try {

        req.session.destroy();
        resp.redirect('/CSE');

    } catch (error) {

        console.log(error.message)   
    }
}

const uploadDocLoad = async (req, resp) => {
    try {

      const categories = await Category.find();
      const folders = await Folder.find();
      const success = req.query.success === 'true';
      resp.render('hodUpload', { categories, folders,success });
    } catch (error) {
      console.log(error.message);
    }
  };

  // get folders by category
const getFoldersByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const folders = await Folder.find({ category_id: categoryId }).exec();

        res.setHeader('Content-Type', 'application/json');
    
        res.status(200).json({ folders });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
 
  // upload file and validation

const hodUpload = async (req, resp) => {
    try {
        const errors = validationResult(req);

        const categories = await Category.find(); // to fix error 
        if (!errors.isEmpty()) {
            return resp.render('hodUpload', { message:'Please upload doc,jpeg,jpg orpdf',categories});
          }


        const categoryId = req.body.catId;
        const folderId = req.body.foldId;
        const docTitle = req.body.title;
        const docNo = req.body.documentNo;
        const docName = req.file.filename;
        const keyword = req.body.keyword;
        const docDate = req.body.date;
        const docPath = req.file.path;
        const docSize = req.file.size;


        // Check file size (in bytes)
        const maxFileSize = 16 * 1024 * 1024; // 16 MB
        const fileSize = req.file.size;

        const folder = await Folder.findOne({ _id: folderId });
        const docCount= await Document.countDocuments({document_no:docNo})

        if ( (!folder) && (fileSize > maxFileSize) ) {
            // Handle the case where category or folder is not found
            return resp.render('hodUpload', { message: 'Category or folder not found',categories });
        } 
        else {

            if(docCount > 0){

                return resp.render('hodUpload', { message: 'document number already exist',categories });

            }else{
                const document = new Document({
                    category_id: folder.category_id,
                    folder_id: folder._id,
                    file_name: docName,
                    doc_title: docTitle,
                    document_no: docNo,
                    keyword: keyword,
                    document_date: docDate,
                    file_path: docPath,
                    file_size: docSize
                });
    
                const documentData = await document.save();
    
                if (documentData) {
    
                    return resp.render('hodUpload', { sucess: 'File uploaded sucessfully',categories });
    
                } else {
    
                    return resp.render('hodUpload', { message: 'Try again, something went wrong' });
                }
            }

           
          }
        
     }catch (error) {
        console.log(error.message);
    }

       
};

module.exports = {
    loginLoad,
    verifyLogin,
    profile_Load,
    hodLogout,
    addUserLoad,
    userListLoad,
    addUser,
    verifyMail,
    uploadDocLoad,
    getFoldersByCategory,
    hodUpload
    
    
}