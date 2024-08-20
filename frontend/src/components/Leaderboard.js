// src/components/Leaderboard.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './Leaderboard.css';
import axios from 'axios';

const Leaderboard = ({ leaderboard, onDelete }) => {
  // Sort leaderboard by time in ascending order
  const sortedLeaderboard = leaderboard.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));

  const handleDelete = async (username) => {
    await axios.post('http://localhost:5000/delete', { username });
    onDelete(username);
  };

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <ul>
        {sortedLeaderboard.map((player, index) => (
          <li key={index}>
            <span>{player.username}</span>
            <span>{player.time} minutes</span>
            {/* <FontAwesomeIcon 
              icon={faTimes} 
              className="delete-icon" 
              onClick={() => handleDelete(player.username)} 
            /> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
