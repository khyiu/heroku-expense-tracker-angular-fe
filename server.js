const express = require('express');
const app = express();

// app.use(express.static('./dist/heroku-expense-tracker'));
app.get('/*', (req, res) => {
  res.sendFile('./dist/heroku-expense-tracker/index.html');
})
app.listen(process.env.PORT || 8080);
