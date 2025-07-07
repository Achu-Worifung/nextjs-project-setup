const express = require('express');
const axios = require('axios');
const Redis = require('redis');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Redis client
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL
});

redisClient.connect().catch(console.error);

// Cache middleware
const cache = async (req, res, next) => {
  try {
    const key = req.originalUrl;
    const data = await redisClient.get(key);
    
    if (data) {
      res.json(JSON.parse(data));
    } else {
      next();
    }
  } catch (error) {
    next();
  }
};

// Routes
app.get('/countries', cache, async (req, res) => {
  try {
    const response = await axios.get('https://countriesnow.space/api/v0.1/countries/positions');
    const countries = response.data.data.map(c => c.name);
    
    await redisClient.setEx(req.originalUrl, 3600, JSON.stringify(countries));
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/states', cache, async (req, res) => {
  try {
    const response = await axios.post(
      'https://countriesnow.space/api/v0.1/countries/states',
      { country: req.body.country }
    );
    const states = response.data.data.states.map(s => s.name);
    
    await redisClient.setEx(req.originalUrl, 3600, JSON.stringify(states));
    res.json(states);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/cities', cache, async (req, res) => {
  try {
    const response = await axios.post(
      'https://countriesnow.space/api/v0.1/countries/state/cities',
      {
        country: req.body.country,
        state: req.body.state
      }
    );
    const cities = response.data.data;
    
    await redisClient.setEx(req.originalUrl, 3600, JSON.stringify(cities));
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Location service listening at http://localhost:${port}`);
});
