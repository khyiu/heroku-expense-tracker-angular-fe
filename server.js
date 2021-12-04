const express = require('express');
const app = express();

app.use(express.static('./dist/heroku-expense-tracker'));
// hide the "x-powered-by" response header that gives up the app is being served by ExpressJS
app.disable('x-powered-by');

const path = require('path');
app.get('/*', function (req, res) {
  res.sendFile(
    path.join(__dirname + '/dist/heroku-expense-tracker/index.html')
  );
});

app.listen(process.env.PORT || 8080);
