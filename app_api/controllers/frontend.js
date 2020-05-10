// Import modules
require("dotenv/config");
const path = require('path')
const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const getSize = require('get-folder-size');

const getDashboard = (req, res) => {
  var tot_num_potholes;
  var net_fidelity;
  var images_size;
  var db_size;
  const images_path = process.cwd().toString() + "/views/img";

  mongo.connect("mongodb://127.0.0.1:27017", (err, client) => {
    assert.equal(null, err);
   
    const db = client.db("mcps_project");

    // Get database size and number of potholes
    db.collection("potholes").stats((err, result) => {
      assert.equal(null, err);
      db_size = (result.size / 1024 / 1024).toFixed(2) + ' MB';
      tot_num_potholes = result.count;

      // Get neural network average fidelity
      const query = {
        "$group": {
          "_id": null,
          "ProbAvg": {
            "$avg": "$probability"
          }
        }
      };

      db.collection("potholes").aggregate(query, (err, cursor) => {
        assert.equal(null, err);
        cursor.toArray((e, documents) => {
          net_fidelity = documents[0].ProbAvg.toFixed(2).toString().substring(2, 4) + "%";

          // Images folder size
          getSize(images_path, (err, size) => {
            if (err) { throw err; }
            images_size = (size / 1024 / 1024).toFixed(2) + ' MB';

            const stats = {
              'num_potholes': tot_num_potholes,
              'net_avg_prob': net_fidelity,
              'images_size': images_size,
              'db_size': db_size
            }

            res.render('html/dashboard', { 'stats': stats });
          });
        });

        client.close();
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