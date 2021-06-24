const express = require("express");
const app = express();
const MensRanking = require("./models/mens");
const router = require("./routers/mens");
const port = process.env.port || 3000;

app.use(express.json());
app.use(router);

require("./db/conn");


app.listen(port,() =>{
    console.log(`connection is live at port ${port}`);
})