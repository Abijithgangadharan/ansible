const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    const db = client.db('visitdb');
    const counterCollection = db.collection('counters');

    app.get('/', async (req, res) => {
      const visitData = await counterCollection.findOneAndUpdate(
        { _id: 'visit-counter' },
        { $inc: { count: 1 } },
        { upsert: true, returnOriginal: false }
      );

      const count = visitData.value.count;
      res.send(`Number of visits: ${count}`);
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
