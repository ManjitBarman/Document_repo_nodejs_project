const express=require('express');
admin_route= express();
const adminController= require("../controllers/adminControllers");

const auth=require('../middleware/adminAuth');


//session
const session = require('express-session');
const config=require("../config/session");
admin_route.use(session({secret:config.sessionSecret,resave: false,saveUninitialized: false}));

//set template engine
admin_route.set('view engine','ejs');
admin_route.set('views', './views/admin');

//body parser
const bodyParser = require('body-parser');
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

//multer setting
const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({

    destination:function (req,file,cb){
        cb(null,path.join(__dirname,'../public/uploadedFile'),function(error,success){
            if(error) throw error
        });

    },
    filename:function (req,file,cb){
        const name= Date.now() +'-'+ file.originalname;
        cb(null,name,function(error1,success1){
            if(error1) throw error1
        });
 
    }
});

const fileFilter = (req,file,cb)=>{
    (file.mimetype ==='application/msword'||file.mimetype ==='application/pdf'||file.mimetype ==='image/jpg'
    ||file.mimetype ==='image/jpeg')?cb(null ,true):cb(null,false)

};
const upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15MB file size limit
      },
})
// file validation 
const {docValidation} = require('../helper/validation')

//admin route
admin_route.get('/admin_login',auth.isLogout,adminController.loginLoad);
admin_route.post('/admin_login',adminController.verifyLogin);
admin_route.get('/admin_profile',auth.isLogin,adminController.profile_Load);
admin_route.get('/admin_logout',auth.isLogin,adminController.adminLogout);

admin_route.get('/add_user',auth.isLogin,adminController.addUserLoad);
admin_route.get('/add_one_user',auth.isLogin,adminController.addOneUserLoad);
admin_route.post('/add_one_user',adminController.addUser);
admin_route.get('/verify',adminController.verifyMail);
admin_route.get('/show_user_list',auth.isLogin,adminController.userListLoad);

admin_route.get('/edit_user',auth.isLogin,adminController.editUserLoad);
admin_route.get('/delete_user/:id',auth.isLogin,adminController.deleteUser);

admin_route.get('/add_category',auth.isLogin,adminController.CategoryLoad);
admin_route.post('/add_category',adminController.addCategory);
admin_route.get('/add_folder',auth.isLogin,adminController.folderLoad);
admin_route.post('/add_folder',adminController.addFolder); 

admin_route.get('/admin_upload',auth.isLogin,adminController.uploadDocLoad);
admin_route.get('/get_folders/:categoryId',auth.isLogin,adminController.getFoldersByCategory)
admin_route.post('/admin_upload',upload.single('docname'),docValidation,adminController.adminUpload);

admin_route.get('/doc_details',auth.isLogin,adminController.docDetailsLoad);
admin_route.get('/category_details',auth.isLogin,adminController.categoryDetailsLoad);
admin_route.get('/folder_details',auth.isLogin,adminController.folderDetailsLoad);

admin_route.get('/admin_search',auth.isLogin,adminController.adminSearchLoad);
admin_route.post('/search_by_docno',adminController.searchByDocumentNo);
admin_route.post('/search_by_keyword',adminController.searchByKeyword);
admin_route.post('/search_by_filename',adminController.searchByFilename);

admin_route.get('/view_file/:id', auth.isLogin, adminController.viewDocLoad).set('name', 'view_file');
admin_route.get('/delete_file/:id',auth.isLogin,adminController.deleteFile);






// admin_route.get('/search_result',auth.isLogin,adminController.searchResultsLoad);




admin_route.get('*',function(req,resp){
    resp.redirect('admin_login');
});




module.exports= admin_route;