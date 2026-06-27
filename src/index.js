const express = require("express");


const {serverConfig, Logger, Queue } = require("./config");
const app = express();

const apiRoutes = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes)


app.listen(serverConfig.PORT , async() => {
    console.log(`Server is running on port ${serverConfig.PORT}`);
    Logger.info("succesfully started the server ", "root", {})

    await Queue.connectQueue();
    console.log("queue connected")
}); 
 
