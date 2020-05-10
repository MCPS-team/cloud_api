// Import modules
require("dotenv/config");
const mongo = require('mongodb').MongoClient;
const assert = require('assert');

const uploadSensorData = (req, res) => {
  const edge_values = req.body;
  var err = false;

  // Remove useless data
  assert.notEqual(undefined, edge_values);
  assert.notEqual(undefined, edge_values.data);

  if (edge_values.data.length >= 1) {
    edge_values.data.forEach(pothole => {

      assert.notEqual(undefined, pothole.attached_images);
      assert.notEqual(undefined, pothole.attached_images[0].filename);
      assert.notEqual(undefined, pothole.attached_images[0].probability);

      pothole.filename = pothole.attached_images[0].filename;
      pothole.probability = parseFloat(pothole.attached_images[0].probability);

      delete pothole.attached_images;

      assert.notEqual(undefined, pothole.attached_sensors_data);
      if (pothole.attached_sensors_data.length >= 1) {
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
    db.collection("potholes").insertMany(edge_values.data, (err, result) => {
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