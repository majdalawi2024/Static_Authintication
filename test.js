const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Fetch data from the API and store it in a text file
async function fetchDataAndStore() {
    try {
        const response = await axios.get('https://palcoin.cash/api/circulating_supply.php');
        const data = response.data; // JSON data from the API
        const text = JSON.stringify(data, null, 2); // Convert to readable format

        // Store data in a text file
        fs.writeFileSync(path.join(__dirname, 'data.txt'), text);
        console.log('Data fetched and saved to data.txt');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Route to serve HTML that includes the content of the text file
app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, 'data.txt'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading data from file');
        }

        // Parse the data and extract the value of "circulatingSupply"
        const jsonData = JSON.parse(data); // Parse JSON data
        const circulatingSupply = jsonData.circulatingSupply; // Extract value of "circulatingSupply"

        // Return HTML page displaying only the number
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>API Response</title>
            </head>
            <body>
                <h1>Circulating Supply Value Option A</h1>
                <p>The circulating supply is: <strong>${circulatingSupply}</strong></p>

                <h1>Circulating Supply Value Option B </h1>
                <p><strong>${circulatingSupply}</strong></p>

            </body>
            </html>
        `);
    });
});

// Run the server and fetch data when the server starts
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    fetchDataAndStore(); // Fetch data on startup and store it
});
