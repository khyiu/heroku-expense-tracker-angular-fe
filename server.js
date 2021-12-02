const express = require("express");
const app = express();

app.use(express.static("./dist/heroku-expense-tracker"));

// Does redirect all /** request to /, but then, path location strategy isn't working
// app.get("*", (req, res) => {
//   res.redirect("/");
// });

const path = require('path');
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/heroku-expense-tracker/index.html'));
});

app.listen(process.env.PORT || 8080);
