const express = require("express");
const app = express();

app.use(express.static("./dist/heroku-expense-tracker"));

const path = require('path');
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/heroku-expense-tracker/index.html'));
});

app.listen(process.env.PORT || 8080);
