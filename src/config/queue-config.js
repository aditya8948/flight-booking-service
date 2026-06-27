const amqplib = require('amqplib');

let channel , connection;

async function connectQueue(){
    try {
        connection = await amqplib.connect("amqp://localhost");
        channel = await connection.createChannel();
        await channel.assertQueue("noti-queue");

        // This service only sends notifications to the queue.
        // Do not create a consumer here unless you also provide a message handler.
    } catch (error) {
        console.log(error);
    }
}

async function sendData(data){
    try {
        await channel.sendToQueue("noti-queue", Buffer.from(JSON.stringify(data)));
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    connectQueue,
    sendData

}