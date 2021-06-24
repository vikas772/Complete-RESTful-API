const express = require("express");
const app = express();
require("./database/conn");
const port = process.env.port || 3000;


app.listen(port,() =>{
    console.log(`connection is live at port ${port}`);
})