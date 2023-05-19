// const {check}= require('express-validator');

// exports.docValidation=[
//     check('docname').custom((value,{req})=>{
//         if(req.file.mimetype==='application/msword'
//         ||file.mimetype ==='application/pdf'
//         ||file.mimetype ==='image/jpg'
//         ||file.mimetype ==='image/jpeg'){
//             return true;
//         }else{
//             return false;
//         }

//     }).withMessage('Please upload doc,jpeg,jpg or pdf file')
// ]

const { check } = require('express-validator');

exports.docValidation = [
  check('docname')
    .custom((value, { req }) => {
      const allowedMimeTypes = ['application/msword', 'application/pdf', 'image/jpg', 'image/jpeg'];
      const maxFileSize = 15 * 1024 * 1024; // 15MB

      if (allowedMimeTypes.includes(req.file.mimetype) && req.file.size <= maxFileSize) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage('Please upload doc, jpeg, jpg, or pdf file within 15MB size limit'),
];