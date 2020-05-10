// Import modules
const express = require("express");
const multer = require("multer");
var upload = multer({ dest: '../../views/img/' });
const routerFrontend = express.Router();
const routerBackend = express.Router();

// Import controllers
const ctrlUI = require("../controllers/frontend");
const ctrlUpload = require("../controllers/backend");

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
