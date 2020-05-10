// Import modules
const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const apiRouter = require("./app_api/routes/api");

// Express app
const app = express();

// Some server config
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')))

// Routes
app.use("/", apiRouter.routerFrontend);
app.use("/api", apiRouter.routerBackend);

// Handle the 404 page
app.use((req, res, next) => {
  res.status(404);

  if (req.accepts('html')) {
    res.render('html/404');
    return;
  }
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
