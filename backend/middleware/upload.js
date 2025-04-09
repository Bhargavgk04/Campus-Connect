const multer = require('multer');
const path = require('path');

// Configure storage for different types of uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine the destination based on the field name
    let uploadPath;
    if (file.fieldname === 'profilePicture') {
      uploadPath = path.join(__dirname, '../uploads/profiles/');
    } else if (file.fieldname === 'image') {
      uploadPath = path.join(__dirname, '../uploads/colleges/');
    } else if (file.fieldname === 'studentIdCard' || file.fieldname === 'facultyIdCard') {
      uploadPath = path.join(__dirname, '../uploads/verification/');
    } else {
      uploadPath = path.join(__dirname, '../uploads/');
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow image and PDF files for verification documents
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'studentIdCard' || file.fieldname === 'facultyIdCard') {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Please upload only images or PDF files for verification documents.'), false);
    }
  } else if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

module.exports = upload; 