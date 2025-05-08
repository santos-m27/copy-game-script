const express = require('express');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data'); // Required to send the file to Discord

const app = express();
app.use(express.json());

let messageQueue = ''; // Accumulated messages
let lastRequestTime = 0; // Time of last /send request

// Endpoint to handle the incoming /send-to-discord request
app.post('/send-to-discord', async (req, res) => {
    const { message } = req.body;

    // Append the new message to the message queue
    messageQueue += message;

    // Update the last request time to the current time
    lastRequestTime = Date.now();

    res.send('Message received');
});

// Function to check if 5 seconds have passed since the last request
const checkAndSendToDiscord = () => {
    setInterval(async () => {
        // If 5 seconds have passed since the last request and there are messages in the queue
        if (Date.now() - lastRequestTime >= 5000 && messageQueue) {
            // Create a temporary file with the accumulated messages
            const filename = 'message.txt';
            fs.writeFileSync(filename, messageQueue);

            const formData = new FormData();
            formData.append('file', fs.createReadStream(filename));

            try {
                // Send the file to Discord via webhook
                await axios.post('https://discord.com/api/webhooks/1362192718218006580/NeJsmRKwktwr6jzvGcW7fsofLIoOGoSvReQfjKkXongWIZabiZIAppiNX5i_7s2m9piL', formData, {
                    headers: formData.getHeaders()
                });

                console.log('Messages sent to Discord');
            } catch (err) {
                console.error('Error sending to Discord:', err);
            }

            // Clear the message queue after sending
            messageQueue = '';
        }
    }, 5000); // Check every 5 seconds
};

// Start the interval to check for sending messages to Discord
checkAndSendToDiscord();

// Start the Express server
app.listen(3000, () => {
    console.log('Listening on port 3000');
});
