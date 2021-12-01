const express = require('express');
const app = express();

app.use(express.static('./dist/heroku-expense-tracker'));
app.use((req, res) => {
  res.render('index');
})
app.listen(process.env.PORT || 8080);
