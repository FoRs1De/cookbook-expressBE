const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const fs = require('fs');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');

  const rawData = fs.readFileSync(filePath, 'utf8');
  const existingData = JSON.parse(rawData);

  res.json(existingData);
});

app.post('/', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');

  const rawData = fs.readFileSync(filePath, 'utf8');
  const existingData = JSON.parse(rawData);

  const bodyData = req.body;

  const newData = [...existingData, bodyData];

  fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));

  res.send(`Data written to data.json
  ${JSON.stringify(bodyData)}
  `);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
