// backend/index.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const leaderboardFilePath = path.join(__dirname, 'leaderboard.json');

// Function to read the leaderboard from the file
const readLeaderboardFromFile = () => {
  try {
    const data = fs.readFileSync(leaderboardFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading leaderboard file:', error);
    return [];
  }
};

// Function to write the leaderboard to the file
const writeLeaderboardToFile = (leaderboard) => {
  try {
    fs.writeFileSync(leaderboardFilePath, JSON.stringify(leaderboard, null, 2));
  } catch (error) {
    console.error('Error writing to leaderboard file:', error);
  }
};

// Initialize the leaderboard from the file
let leaderboard = readLeaderboardFromFile();
let timers = {};

app.post('/start', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).send('Username is required');
  }
  
  if (timers[username]) {
    return res.status(400).send('Timer is already running for this user');
  }

  timers[username] = Date.now();
  res.send(`Timer started for ${username}`);
});

app.post('/stop', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).send('Username is required');
  }

  const startTime = timers[username];
  if (!startTime) {
    return res.status(400).send('No timer running for this user');
  }

  const timeElapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(2); // Convert to minutes
  delete timers[username];

  leaderboard.push({ username, time: timeElapsed });
  leaderboard = leaderboard.sort((a, b) => a.time - b.time).slice(0, 100); // Keep only top 100

  writeLeaderboardToFile(leaderboard); // Write the updated leaderboard to the file

  res.send(`${username} finished in ${timeElapsed} minutes`);
});

app.get('/leaderboard', (req, res) => {
  res.json(leaderboard);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
