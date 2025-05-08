const express = require('express');
const fs = require('fs');
const axios = require('axios');
const multer = require('multer');
const app = express();

app.use(express.json());

app.post('/send-to-discord', async (req, res) => {
    const { message } = req.body;
    const filename = 'message.txt';

    fs.writeFileSync(filename, message);

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filename));

    try {
        await axios.post('https://discord.com/api/webhooks/1362192718218006580/NeJsmRKwktwr6jzvGcW7fsofLIoOGoSvReQfjKkXongWIZabiZIAppiNX5i_7s2m9piL', formData, {
            headers: formData.getHeaders()
        });
        res.send('Sent successfully');
    } catch (err) {
        res.status(500).send('Error sending to Discord');
    }
});

app.listen(3000, () => console.log('Listening on port 3000'));
