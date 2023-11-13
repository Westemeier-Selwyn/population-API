const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

const csvFilePath = "LU1_DF_B1100_1.0.csv";

app.use(express.json());

app.get('/population', (req, res) => {
    const { date } = req.query;
  
    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }
  
    let entriesBefore = [];
    let entriesAfter = [];
  
    const readStream = fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        if (row["SPECIFICATION: Specification"] === 'C01: Total population') {
          if (row["TIME_PERIOD: Time period"] === date) {
            // Found an exact match
            readStream.destroy();  // Close the stream to stop further processing
            res.json({ date, totalPopulation: parseInt(row["OBS_VALUE"]) });
          } else if (row["TIME_PERIOD: Time period"] < date) {
            entriesBefore.push({
              date: row["TIME_PERIOD: Time period"],
              totalPopulation: parseInt(row["OBS_VALUE"]),
            });
          } else {
            entriesAfter.push({
              date: row["TIME_PERIOD: Time period"],
              totalPopulation: parseInt(row["OBS_VALUE"]),
            });
          }
        }
      })
      .on('end', () => {
        if (!res.headersSent) {  // Check if response has already been sent
          if (entriesBefore.length === 0 && entriesAfter.length === 0) {
            res.status(404).json({ error: 'Population data not found for the given date' });
          } else {
            entriesBefore.sort((a, b) => b.date.localeCompare(a.date));
            entriesAfter.sort((a, b) => a.date.localeCompare(b.date));
  
            const closestBefore = entriesBefore[0];
            const closestAfter = entriesAfter[0];
  
            res.json({
              date,
              closestBefore,
              closestAfter,
              message: 'Population data not found for the given date. Showing closest available entries.',
            });
          }
        }
      });
  });
  
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});