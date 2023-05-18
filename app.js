const express = require('express');
const app = express();
const bc = require("./router/boardController.js")
const cors = require('cors')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use('/',bc)

const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})