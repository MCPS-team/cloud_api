// Import modules
require("dotenv/config");

const getDashboard = (req, res) => {
  res.render('html/dashboard');
}

const getMap = (req, res) => {
  // Read pothole from mongodb
  const pothole1 = {'lat': 43.709969, 'long': 10.399870}
  const pothole2 = {'lat': 43.708969, 'long': 10.399870}
  const pothole3 = {'lat': 43.707969, 'long': 10.399870}
  const pothole4 = {'lat': 43.706969, 'long': 10.399870}
  const pothole5 = {'lat': 43.705969, 'long': 10.399870}

  const potholes = [pothole1, pothole2, pothole3, pothole4, pothole5];

  res.render('html/map', {'potholes': potholes});
}

const getAbout = (req, res) => {
  res.render('html/about');
}

module.exports = {
  getDashboard,
  getMap,
  getAbout
};