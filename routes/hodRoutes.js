const express=require('express');
hod_route= express();
const hodController= require("../controllers/hodController");

const auth=require('../middleware/hodAuth');


//session
const session = require('express-session');
const config=require("../config/session");
hod_route.use(session({secret:config.sessionSecret,resave: false,saveUninitialized: false}));

//set template engine
hod_route.set('view engine','ejs');
hod_route.set('views', './views/hod');

//body parser
const bodyParser = require('body-parser');
hod_route.use(bodyParser.json());
hod_route.use(bodyParser.urlencoded({extended:true}));

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
hod_route.get('/hod_login',auth.isLogout,hodController.loginLoad);
hod_route.post('/hod_login',hodController.verifyLogin);

hod_route.get('/hod_profile',auth.isLogin,hodController.profile_Load);
hod_route.get('/hod_logout',auth.isLogin,hodController.hodLogout);
hod_route.get('/add_user',auth.isLogin,hodController.addUserLoad);

hod_route.get('/add_user',auth.isLogin,hodController.addUserLoad);
hod_route.get('/add_user',auth.isLogin,hodController.addUserLoad);
hod_route.post('/add_user',hodController.addUser);

hod_route.get('/verify',hodController.verifyMail);
hod_route.get('/show_user_list',auth.isLogin,hodController.userListLoad);

hod_route.get('/hod_upload',auth.isLogin,hodController.uploadDocLoad);
hod_route.get('/get_folders/:categoryId',auth.isLogin,hodController.getFoldersByCategory)
hod_route.post('/hod_upload',upload.single('docname'),docValidation,hodController.hodUpload);

hod_route.get('/hod_view',auth.isLogin,hodController.hodViewLoad);
hod_route.post('/hod_view',auth.isLogin,hodController.hodView);

hod_route.get('/hod_search',auth.isLogin,hodController.hodSearchLoad);
hod_route.post('/search_by_docno',hodController.searchByDocumentNo);
hod_route.post('/search_by_keyword',hodController.searchBykeyword);
hod_route.post('/search_by_filename',hodController.searchByFilename);

hod_route.get('/hod_dashboard',auth.isLogin,hodController.dashboardLoad)






module.exports= hod_route;