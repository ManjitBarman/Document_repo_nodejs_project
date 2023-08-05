const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Folder = require("../models/foderModel");
const Document = require("../models/documentModel")
const {validationResult}= require('express-validator');
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

const uploadDocLoad = async (req, resp) => {
    try {

    //   const categories = await Category.find();
      const category= await Category.findOne({category_name:'PERSIONAL_FILES'})
      const folders = await Folder.find({category_id:category._id});
      const success = req.query.success === 'true';

      return resp.render('facultyUpload', {folders,success });
    } catch (error) {
      console.log(error.message);
    }
  };

  // faculty uoload document document

  const facultyUpload = async (req, resp) => {
    try {
        const errors = validationResult(req);

        

        
        if (!errors.isEmpty()) {
            return resp.render('facultyUpload', { message:'Please upload docx, jpeg, jpg or pdf',folders});
          }

        const categoryName = req.body.catName;
        const folderId = req.body.foldId;
        const docTitle = req.body.title;
        const docNo = req.body.documentNo;
        const docName = req.file.filename;
        const keyword = req.body.keyword;
        const docDate = req.body.date;
        const docPath = req.file.path;
        const docSize = req.file.size; 

        // to fix error of ejs when load folders

        const category = await Category.find({category_name:categoryName});
        const folders = await Folder.find({category_id:category._id});

        // Check file size (in bytes)
        const maxFileSize = 16 * 1024 * 1024; // 16 MB
        const fileSize = req.file.size;

        const folder = await Folder.findOne({ _id: folderId });
        const docCount= await Document.countDocuments({document_no:docNo})

        if ( (!folder) && (fileSize > maxFileSize) ) {
            // Handle the case where category or folder is not found
            return resp.render('facultyUpload', { message: 'Category or folder not found',folders });
        } 
        else {

            if(docCount > 0){

                return resp.render('facultyUpload', { message: 'document number already exist',folders });

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
    
                    return resp.render('facultyUpload', { sucess: 'File uploaded sucessfully',folders});
    
                } else {
    
                    return resp.render('facultyUpload', { message: 'Try again, something went wrong',folders });
                }
            }

           
          }
        
     }catch (error) {
        console.log(error.message);
    }

       
};

// faculty search 
const facultySearchLoad = async(req,resp)=>{
    try {
        resp.render('facultySearch')
        
    } catch (error) {
        console.log(error.message);
    }
}

const searchByDocumentNo = async (req, resp) => {
    try {
      const documentNo = req.body.docNo;

      const documentData = await Document.find({ document_no: documentNo }).populate({
        path: 'folder_id',
        populate: {
          path: 'category_id',
          model: 'category',
        },
      });

      if(!documentData){

        return resp.render('facultySearch', { message:'Enter a valid document number' });

      }else{
        return resp.render('facultySearch', {documentInfo:documentData, });

      }
  
      
    } catch (error) {
      console.log(error.message);
    }
  };

// view document
  const facultyViewLoad= async(req,resp)=>{
    try {

        const categories = await Category.find();
        return resp.render('facultyView',{categories})
        
    } catch (error) {
        console.log(error.message);
    }
}

// for dynamic loading
const getFoldersByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const folders = await Folder.find({ category_id: categoryId }).exec();

        res.setHeader('Content-Type', 'application/json');
    
        return res.status(200).json({ folders });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

// fetch view document based on category and folder
const facultyView= async(req,resp)=>{
    try {

        const categoryId= req.body.catId;
        const folderId= req.body.foldId;
        const categories = await Category.find(); //to fix error

        // console.log(folderId);

        const documentInfo = await Document.find({ folder_id: folderId }).populate({
            path: 'folder_id',
            populate: {
              path: 'category_id',
              model: 'category',
            },
          })

         return resp.render('facultyView',{documentInfo,categories})      
        
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loginLoad,
    verifyLogin,
    getProfile,
    facultyLogout,
    uploadDocLoad,
    facultyUpload,
    facultySearchLoad,
    searchByDocumentNo,
    facultyViewLoad,
    getFoldersByCategory,
    facultyView
}