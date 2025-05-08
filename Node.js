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
        await axios.post('YOUR_DISCORD_WEBHOOK_URL', formData, {
            headers: formData.getHeaders()
        });
        res.send('Sent successfully');
    } catch (err) {
        res.status(500).send('Error sending to Discord');
    }
});

app.listen(3000, () => console.log('Listening on port 3000'));
