// Import modules
require("dotenv/config");
const mongo = require('mongodb').MongoClient;
const assert = require('assert');

const uploadSensorData = (req, res) => {
  var err = false;

  assert.notEqual(undefined, req.body);
  assert.notEqual(undefined, req.body.data);

  var edge_values = JSON.parse(req.body.data);

  if (edge_values.length >= 1) {
      edge_values.forEach(pothole => {

      delete pothole.start_at;
      delete pothole.end_at;

      assert.notEqual(undefined, pothole.attached_images);
      assert.notEqual(undefined, pothole.attached_images[0].filename);
      assert.notEqual(undefined, pothole.attached_images[0].probability);

      pothole.filename = pothole.attached_images[0].filename;
      pothole.probability = parseFloat(pothole.attached_images[0].probability);

      delete pothole.attached_images;

      assert.notEqual(undefined, pothole.attached_sensors_data);
      if (pothole.attached_sensors_data.length >= 1) {
        pothole.timestamp = pothole.attached_sensors_data[0].timestamp;
        pothole.attached_sensors_data.forEach(sensor_value => {
          delete sensor_value.latitude;
          delete sensor_value.longitude;
        });
      } else {
        err = true;
      }

    });
  }

  if (err) {
    res.sendStatus(400);
  }

  // Save data on mongodb
  mongo.connect("mongodb://127.0.0.1:27017", (err, client) => {
    assert.equal(null, err);
   
    const db = client.db("mcps_project");

    // Insert multiple documents
    db.collection("potholes").insertMany(edge_values, (err, result) => {
      assert.equal(null, err);
      
      if (result.insertedCount >= 1) {
        res.sendStatus(200);
      } else {
        res.sendStatus(500);
      }

      client.close();
    });
  });
}

module.exports = {
  uploadSensorData
};