const express = require('express');
const app = express();
const bc = require("./controller/boardController.js")
const cors = require('cors')
const passport = require('passport');
const passportConfig = require('./config/passport.js');

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use('/board',bc)
app.use(passport.initialize());
passportConfig();


const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})