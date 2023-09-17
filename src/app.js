const express = require("express");
const compression = require("compression");

const app = express();
const port = 3000;

app.use(express.static(__dirname + '/public'))
app.use(compression());

app.listen(port, () => {
    console.log("Listening on port:" + port);
});