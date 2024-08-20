// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Leaderboard from './components/Leaderboard';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

function App() {
  const [username, setUsername] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [isRunning, setIsRunning] = useState(false); // State to track if the timer is running
  const [time, setTime] = useState(0); // State to track elapsed time in seconds
  const timerRef = useRef(null); // Ref to store the timer interval

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const response = await axios.get(`${BACKEND_URL}/leaderboard`);
    setLeaderboard(response.data);
  };

  const startTimer = async () => {
    await axios.post(`${BACKEND_URL}/start`, { username });
    setIsRunning(true);
    setTime(0); // Reset time to 0
    timerRef.current = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000); // Increment the timer every second
  };

  const stopTimer = async () => {
    await axios.post(`${BACKEND_URL}/stop`, { username });
    setIsRunning(false);
    clearInterval(timerRef.current); // Stop the timer
    fetchLeaderboard();
  };

  // Convert time from seconds to MM:SS format
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="app">
      <div className="frame-bulbs">
        <div className="bulbs bulbs-top">
          {Array.from({ length: 10 }).map((_, i) => (
            <div className="bulb" style={{ '--i': i }} key={i}></div>
          ))}
        </div>
        <div className="bulbs bulbs-bottom">
          {Array.from({ length: 10 }).map((_, i) => (
            <div className="bulb" style={{ '--i': i }} key={i}></div>
          ))}
        </div>
        <div className="bulbs bulbs-left">
          {Array.from({ length: 5 }).map((_, i) => (
            <div className="bulb" style={{ '--i': i }} key={i}></div>
          ))}
        </div>
        <div className="bulbs bulbs-right">
          {Array.from({ length: 5 }).map((_, i) => (
            <div className="bulb" style={{ '--i': i }} key={i}></div>
          ))}
        </div>
      </div>
      <header className="app-header">
        The Frontegg Challenge
      </header>
      <div className="input-container">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          className="input-box"
        />
        <div className="button-container">
          {isRunning ? (
            <button className="button" onClick={stopTimer}>Stop</button>
          ) : (
            <button className="button" onClick={startTimer}>Start</button>
          )}
        </div>
        {isRunning && (
          <div className="timer">
            {formatTime(time)}
          </div>
        )}
      </div>
      <Leaderboard leaderboard={leaderboard} />
    </div>
  );
}

export default App;