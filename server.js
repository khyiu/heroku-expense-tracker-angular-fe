const express = require('express');
const app = express();

app.use(express.static('./dist/heroku-expense-tracker'));
app.listen(process.env.PORT || 8080);
