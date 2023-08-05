// to check file type without extension

const { validationResult } = require('express-validator');
const FileType = require('file-type');
const Category = require('../models/category.model');
const Folder = require('../models/folder.model');
const Document = require('../models/document.model');

const adminUpload = async (req, resp) => {
  try {
    const errors = validationResult(req);

    const categories = await Category.find();

    if (!errors.isEmpty()) {
      return resp.render('adminUpload', { message: 'Please upload docx, jpeg, jpg, or pdf', categories });
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
    const docCount = await Document.countDocuments({ document_no: docNo });

    if (!folder || fileSize > maxFileSize) {
      // Handle the case where category or folder is not found, or file size exceeds the limit
      return resp.render('adminUpload', { message: 'Category or folder not found or file size exceeds the limit', categories });
    }

    const buffer = req.file.buffer;
    const fileType = await FileType.fromBuffer(buffer);

    if (!fileType || (fileType.mime !== 'image/jpeg' && fileType.mime !== 'image/jpg' && fileType.mime !== 'application/pdf')) {
      // Invalid file type
      return resp.render('adminUpload', { message: 'Invalid file type. Please upload JPEG, JPG, or PDF files.', categories });
    }

    if (docCount > 0) {
      return resp.render('adminUpload', { message: 'Document number already exists', categories });
    }

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
      return resp.render('adminUpload', { success: 'File uploaded successfully', categories });
    } else {
      return resp.render('adminUpload', { message: 'Try again, something went wrong' });
    }
  } catch (error) {
    console.error(error.message);
    return resp.render('adminUpload', { message: 'An error occurred during file upload' });
  }
};

module.exports = {
  adminUpload
};
