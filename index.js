const express = require('express');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
app.use(express.json());

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1362192718218006580/NeJsmRKwktwr6jzvGcW7fsofLIoOGoSvReQfjKkXongWIZabiZIAppiNX5i_7s2m9piL';

app.post('/send', async (req, res) => {
    const { message } = req.body;

    const filename = 'message.txt';
    fs.writeFileSync(filename, message);

    const form = new FormData();
    form.append('file', fs.createReadStream(filename));

    try {
        await axios.post(DISCORD_WEBHOOK_URL, form, {
            headers: form.getHeaders()
        });
        res.send('File sent to Discord.');
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Error sending to Discord');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
