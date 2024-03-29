//Multer is a middleware used for handling multipart/form-data, which is primarily used for uploading files.
const multer = require("multer");

const storage = multer.diskStorage({
  // Specifies the directory where uploaded files will be stored.
  destination: function (req, file, cb) {
    if (file.fieldname === "productimg") {
      cb(null, "./public/images/uploads");
    }
  },
  // Specifies the naming convention for the uploaded files.
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
