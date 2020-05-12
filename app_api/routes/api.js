// Import modules
const express = require("express");
const multer = require("multer");
const routerFrontend = express.Router();
const routerBackend = express.Router();

// Import controllers
const ctrlUI = require("../controllers/frontend");
const ctrlUpload = require("../controllers/backend");

// Multer parameters
const multer_storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, process.env.IMG_PATH)
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
});

const upload = multer({ storage: multer_storage });

// Web UI pages
routerFrontend.route("/dashboard").get(ctrlUI.getDashboard);
routerFrontend.route("/map").get(ctrlUI.getMap);
routerFrontend.route("/about").get(ctrlUI.getAbout);

// Data sent from Edge Server
routerBackend.route("/upload").post(upload.array('images'), ctrlUpload.uploadSensorData);

module.exports = {
    routerFrontend,
    routerBackend
};
