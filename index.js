const express = require('express');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let messageQueue = '';
let lastRequestTime = 0;

app.post('/send-to-discord', async (req, res) => {
    const { message } = req.body;
    messageQueue += message;
    lastRequestTime = Date.now();
    res.send('Message received');
});

const checkAndSendToDiscord = () => {
    setInterval(async () => {
        if (Date.now() - lastRequestTime >= 5000 && messageQueue) {
            const filename = 'message.txt';
            messageQueue = 'return [[\n' + messageQueue + '\n]]'
            fs.writeFileSync(filename, messageQueue);

            const formData = new FormData();
            formData.append('file', fs.createReadStream(filename));

            try {
                await axios.post('https://discord.com/api/webhooks/1362192718218006580/NeJsmRKwktwr6jzvGcW7fsofLIoOGoSvReQfjKkXongWIZabiZIAppiNX5i_7s2m9piL', formData, {
                    headers: formData.getHeaders()
                });
                console.log('Messages sent to Discord');
            } catch (err) {
                console.error('Error sending to Discord:', err);
            }
            messageQueue = '';
        }
    }, 5000);
};

checkAndSendToDiscord();

// Use environment variable for port (Railway will assign the correct port)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
