const express = require('express');
const axios = require('axios'); // For sending messages to Discord webhook
const app = express();
const port = 3000;

// Variable to hold the accumulated messages
let messageQueue = '';

// Variable to track the time of the last request
let lastRequestTime = 0;

// Discord webhook URL (replace with your actual webhook URL)
const discordWebhookUrl = 'https://discord.com/api/webhooks/1362192718218006580/NeJsmRKwktwr6jzvGcW7fsofLIoOGoSvReQfjKkXongWIZabiZIAppiNX5i_7s2m9piL';

app.use(express.json());

app.post('/send', (req, res) => {
    // Get the message from the request body
    const message = req.body.message;

    // Append the message to the message queue
    messageQueue += message + '\n';

    // Update the last request time to the current time
    lastRequestTime = Date.now();

    res.send('Message received');
});

// Function to check and send the message to Discord after 5 seconds
const checkAndSendToDiscord = () => {
    // Wait for 5 seconds
    setTimeout(async () => {
        // Check if no new /send request was made within 5 seconds
        if (Date.now() - lastRequestTime >= 5000) {
            if (messageQueue) {
                try {
                    // Send the accumulated messages to Discord
                    await axios.post(discordWebhookUrl, {
                        content: messageQueue,
                    });

                    console.log('Messages sent to Discord');
                } catch (error) {
                    console.error('Error sending to Discord:', error);
                }
                
                // Clear the message queue after sending
                messageQueue = '';
            }
        }
    }, 5000);
};

// Run the check every 5 seconds (to be in sync with the /send requests)
setInterval(checkAndSendToDiscord, 5000);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
