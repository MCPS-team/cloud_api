// Import modules
require("dotenv").config();
const path = require('path')
const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const getSize = require('get-folder-size');

const getDashboard = (req, res) => {
  var tot_num_potholes;
  var images_size;
  var db_size;
  var stats = {}
  const images_path = process.cwd().toString() + "/views/img";

  mongo.connect(process.env.MONGO_URL, (err, client) => {
    assert.equal(null, err);
   
    const db = client.db(process.env.MONGO_DBNAME);

    // Get database size and number of potholes
    db.collection(process.env.MONGO_COLLECTION).stats((err, result) => {
      assert.equal(null, err);
      db_size = (result.size / 1024 / 1024).toFixed(2) + ' MB';
      tot_num_potholes = result.count;
      stats.db_size = db_size;
      stats.num_potholes = tot_num_potholes;

      // Get neural network average fidelity
      const query = {
        "$group": {
          "_id": null,
          "ProbAvg": {
            "$avg": "$probability"
          }
        }
      };

      // Images folder size
      getSize(images_path, (err, size) => {
        if (err) { throw err; }
        images_size = (size / 1024 / 1024).toFixed(2) + ' MB';
        stats.images_size = images_size;

        db.collection("potholes").aggregate(query, (err, cursor) => {
          assert.equal(null, err);
  
          cursor.toArray((e, documents) => {
            if (documents.length === 0) {
              stats.net_avg = "0%";
            } else {
              stats.net_avg = documents[0].ProbAvg.toFixed(2).toString().substring(2, documents[0].ProbAvg.length) + "%";
            }

            res.render('html/dashboard', { 'stats': stats });
            client.close();
          });
        });
      });
    });    
  });
}

const getMap = (req, res) => {
  // Read potholes from mongodb
  mongo.connect("mongodb://127.0.0.1:27017", (err, client) => {
    assert.equal(null, err);
   
    const db = client.db("mcps_project");

    // Insert multiple documents
    db.collection("potholes").find().toArray((err, result) => {
      assert.equal(null, err);

      res.render('html/map', {'potholes': result});
      client.close();
    });
  });
}

const getAbout = (req, res) => {
  res.render('html/about');
}

module.exports = {
  getDashboard,
  getMap,
  getAbout
};