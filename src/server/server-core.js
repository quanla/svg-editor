const bodyParser = require("body-parser");
const express = require("express");

const ServerCore = {
    start: async ({port}) => {
        const app = express();

        app.use(express.static(__dirname + "/public"));
        app.use(express.static(__dirname + "/../../dist"));

        app.use("/api", bodyParser.json());

        app.listen(port, () => {
            console.log(`Server started on ${port}`);
        });
    }
};

exports.ServerCore = ServerCore;