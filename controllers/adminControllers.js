const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Folder = require("../models/foderModel");
const Document = require("../models/documentModel")
const bcrypt = require('bcrypt');
const randomString = require("randomstring");
const nodemailer = require('nodemailer');
const {validationResult}= require('express-validator');
// const mongoose= require('mongoose')



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
                    return resp.render('adminLogin', { message: "Please verify your mail" })
                } else {

                    req.session.user_id = userData._id;
                    return resp.redirect(302, 'admin_profile');
                }

            } else {
                return resp.render('adminLogin', { message: "Email and password are incorect" });
            }

        } else {
            return resp.render('adminLogin', { message: "Email and password are incorect" });
        }


    } catch (error) {
        console.log(error.message);
    }
}

//dshboard load
const profile_Load = async (req, resp) => {
    try {

        const adminData = await User.findById({ _id: req.session.user_id });
        return resp.render('adminProfile', { user: adminData })  //data send to user profile
    } catch {
        console.log(error.message);
    }

}

// load addUser

const addUserLoad = async (req, resp) => {
    try {

        return resp.render('addUser')  //data send to user profile
    } catch {
        console.log(error.message);
    }

}



const addOneUserLoad = async (req, resp) => {
    try {

        return resp.render('addOneUser')
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

            return resp.render('addOneUser', { message: 'email or password is already exist' });

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
                return resp.render('addOneUser',{sucess:'User created and email has been sent'});
            } else {
                return resp.render('addOneUser', { message: 'something wrong try again' });
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
        return resp.render("email-verified");

    } catch (error) {
        console.log(eror.message);
    }
}

//delete uaer 

const deleteUser = async (req, resp) => {
    try {
      const userId = req.params.id;

      const result= await User.deleteOne({_id: userId });
      return resp.redirect("/CSE/admin/show_user_list");
  
    } catch (error) {
      console.log(error.message);
    }
  };

//Load userlist
const userListLoad = async (req, resp) => {
    try {
        const usersData = await User.find({ is_admin: 'false' })
        return resp.render('userList', { users: usersData });

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
        return resp.redirect('/CSE');

    } catch (error) {

        console.log(error.message)
    }
}


// add_category LOad 

const CategoryLoad = async (req, resp) => {
    try {
        return resp.render('category');
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

            return resp.render('category', { message: 'Category name or number already exist' });

        } else {

            const category = new Category({
                category_id: catNumber,
                category_name: catName,
                category_date: date

            });

            const categoryData = await category.save();

            if (categoryData) {

                return resp.redirect(302, 'add_category');
            } else {

                return resp.render('category', { message: 'try again something wrong ' })
            }
        }

    } catch (error) {
        console.log(error.message)
    }
}



const folderLoad = async (req, resp) => {
    try {
        const data = await Category.find()
        return resp.render('addFolder', { result: data });
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

        // check data existance

        const count = await Folder.countDocuments({
            $and: [
              { category_id: { $eq: categoryId._id } },
              { $or: [ { folder_name: { $eq: foldName } }, { folder_no: { $eq: foldNo } } ] }
            ]
          });

        //   console.log()

        // const existFolder_no = await Folder.findOne({
        //     $and: [
        //       { category_id: { $eq:categoryId._id } },
        //       { folder_no: { $eq: foldNo } }
        //     ]
        //   })
          
        if (count > 0) {

             const result =await Category.find();// to fix error
             return resp.render('addFolder', { message: 'Folder name already exist',result });

        } else{
            const folder = new Folder({
                category_id: categoryId._id,
                folder_name: foldName,
                folder_no: foldNo,
                folder_date:folDate
            })

            const folderData = await folder.save();

            if (folderData) {
                return resp.redirect(302, 'add_user')

            } else {
               return resp.render('addFolder', { message: 'try again something wrong ' })
            }

        } 

    } catch (error) {
        console.log(error.message)
    }
}

// upload document 

const uploadDocLoad = async (req, resp) => {
    try {

      const categories = await Category.find();
    //   const folders = await Folder.find();
      const success = req.query.success === 'true';
      return resp.render('adminUpload', { categories,success });
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
    
        return res.status(200).json({ folders });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
 
  // upload file and validation

const adminUpload = async (req, resp) => {
    try {
        const errors = validationResult(req);

        const categories = await Category.find(); // to fix error 
        if (!errors.isEmpty()) {
            return resp.render('adminUpload', { message:'Please upload docx, jpeg, jpg or pdf',categories});
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
            return resp.render('adminUpload', { message: 'Category or folder not found',categories });
        } 
        else {

            if(docCount > 0){

                return resp.render('adminUpload', { message: 'document number already exist',categories });

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
    
                    return resp.render('adminUpload', { sucess: 'File uploaded sucessfully',categories });
    
                } else {
    
                    return resp.render('adminUpload', { message: 'Try again, something went wrong' });
                }
            }

           
          }
        
     }catch (error) {
        console.log(error.message);
    }

       
};

const docDetailsLoad = async (req, resp) => {
    try {
        const categoryData = await Category.find();
        const folderData = await Folder.find().populate('category_id');   
        
        const documentData = await Document.find().populate({
            path: 'folder_id',
            populate: {
              path: 'category_id',
              model: 'category',
            },
          });
        //   console.log(documentData)

        return resp.render('docDetails', { categoryData, folderData,documentData });
    } catch (error) {
        console.log(error.message);
    }
};


//delete doc 
const deleteFile = async (req, resp) => {
    try {
      const docId = req.params.id;

      const result= await Document.deleteOne({_id: docId });
      return resp.redirect("/CSE/admin/doc_details");
  
    } catch (error) {
      console.log(error.message);
    }
  };

//category details
const categoryDetailsLoad = async (req, resp) => {
    try {
        const categoryData = await Category.find(); 
        //   console.log(documentData)

        return resp.render('categoryDetails', { categoryData });
    } catch (error) {
        console.log(error.message);
    }
};

const folderDetailsLoad = async (req, resp) => {
    try {

        const folderData = await Folder.find().populate('category_id');   
        return resp.render('folderDetails', { folderData });
    } catch (error) {
        console.log(error.message);
    }
};

// view file 
const viewDocLoad = async (req, resp) => {
    try {
        const documentId= req.params.id
        // console.log(documentId);
        const documentData = await Document.findOne({_id:documentId}).populate({
            path: 'folder_id',
            populate: {
              path: 'category_id',
              model: 'category',
            },
          });

          console.log(documentData);

       return resp.render('viewFile', {documentData });
    } catch (error) {
        console.log(error.message);
    }
};

// admin search 
const adminSearchLoad = async(req,resp)=>{
    try {
        resp.render('adminSearch')
        
    } catch (error) {
        console.log(error.message);
    }
}

// search by document no 

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

        return resp.render('adminSearch', { message:'Enter a valid document number' });

      }else{
        return resp.render('adminSearch', {documentInfo:documentData, });

      }
  
      
    } catch (error) {
      console.log(error.message);
    }
  };

  // search by Keyword

  const searchByKeyword = async (req, resp) => {
    try {
      const documentKeyword = req.body.keyword;

      const documentData = await Document.find({ keyword:documentKeyword  }).populate({
        path: 'folder_id',
        populate: {
          path: 'category_id',
          model: 'category',
        },
      });
  
      return resp.render('adminSearch', {documentInfo:documentData});
    } catch (error) {
      console.log(error.message);
    }
  };

  // search by filename

  const searchByFilename = async (req, resp) => {
    try {
      const documentKeyword = req.body.filename;
  
      const documentData = await Document.find({ doc_name: { $regex: documentKeyword, $options: 'i' } }).populate({
        path: 'folder_id',
        populate: {
          path: 'category_id',
          model: 'category',
        },
      });
  
      return resp.render('adminSearch', { documentInfo: documentData });
    } catch (error) {
      console.log(error.message);
    }
  };
  

const searchResultsLoad=async(req,resp)=>{
    try {
        return resp.render('searchResult');
    } catch (error) {
        console.log(error.message);
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
    addFolder,
    uploadDocLoad,
    adminUpload,
    getFoldersByCategory,
    docDetailsLoad,
    adminSearchLoad,
    searchByDocumentNo,
    searchResultsLoad,
    searchByKeyword,
    searchByFilename,
    categoryDetailsLoad,
    folderDetailsLoad,
    viewDocLoad,
    deleteUser,
    deleteFile
    
}