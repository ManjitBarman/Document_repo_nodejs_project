const User = require("../models/userModel");
const Category= require("../models/categoryModel");
const Folder = require("../models/foderModel");
const Document=require("../models/documentModel")
const bcrypt = require('bcrypt');
const {validationResult}= require('express-validator');


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

const uploadDocLoad = async (req, resp) => {
    try {

      const categories = await Category.find();
      const folders = await Folder.find();
      const success = req.query.success === 'true';
      resp.render('staffUpload', { categories, folders,success });
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

const staffUpload = async (req, resp) => {
    try {
        const errors = validationResult(req);

        const categories = await Category.find(); // to fix error 
        if (!errors.isEmpty()) {
            return resp.render('staffUpload', { message:'Please upload docx, jpeg, jpg or pdf',categories});
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
            return resp.render('staffUpload', { message: 'Category or folder not found',categories });
        } 
        else {

            if(docCount > 0){

                return resp.render('staffUpload', { message: 'document number already exist',categories });

            }else{
                const document = new Document({
                    category_id: folder.category_id,
                    folder_id: folder._id,
                    doc_name: docName,
                    doc_title: docTitle,
                    document_no: docNo,
                    keyword: keyword,
                    document_date: docDate,
                    file_path: docPath,
                    doc_size: docSize
                });
    
                const documentData = await document.save();
    
                if (documentData) {
    
                    return resp.render('staffUpload', { sucess: 'File uploaded sucessfully',categories });
    
                } else {
    
                    return resp.render('staffUpload', { message: 'Try again, something went wrong' });
                }
            }

           
          }
        
     }catch (error) {
        console.log(error.message);
    }

       
};

const staffSearchLoad = async(req,resp)=>{
    try {
        resp.render('staffSearch')
        
    } catch (error) {
        console.log(error.message);
    }
}

//staff view 

const staffViewLoad= async(req,resp)=>{
    try {

        return resp.render('staffView')
        
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loginLoad,
    verifyLogin,
    getProfile,
    staffLogout,
    uploadDocLoad,
    staffUpload,
    getFoldersByCategory,
    staffSearchLoad,
    staffViewLoad
    
}