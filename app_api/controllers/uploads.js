const multer = require("multer");
require("dotenv/config");

var Storage = multer.diskStorage({
  destination: (req, file, callback) => {
      callback(null, "./Images");
  },
  filename: (req, file, callback) => {
      callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});

const upload = multer({
  storage: Storage
}).array("imgUploader", process.env.MAX_IMAGES_UPLOAD); //Field name and max count


const uploadsSaveImages = (req, res) => {
  upload(req, res, err => {
    if (err) {
        console.log(err)
        return res.end("Something went wrong!");
    }
    return res.end("File uploaded sucessfully!.");
  });
};

const uploadsGetForm = (req, res) => {
  res.sendFile(__dirname + "/index.html");
}


module.exports = {
  uploadsSaveImages,
  uploadsGetForm
};
