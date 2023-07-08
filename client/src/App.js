import React, { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';

const startSate = {
  players: [
    {
      name: "Charlie",
      connection: { socketId: "1" },
      cardsFaceUp: [{ type: 'Bat' }, { type: 'Bat' }, { type: 'Cockroach' }],
      cardsInHand: [{ type: 'Bat' }, { type: 'Cockroach' }, { type: 'Fly' }],
    },
    {
      name: "Hugh",
      connection: { socketId: "2" },
      cardsFaceUp: [{ type: 'Stink Bug' }, { type: 'Scorpion' } ],
      cardsInHand: [{ type: 'Bat' }, { type: 'Cockroach' }, { type: 'Fly' }],
    },
  ],
  spectators: [],
  play: null,
  inLobby: false,
};

function App() {

  const [gameState, setGameState] = useState(startSate);

  useEffect(() => {
    // Create a Socket.IO client instance
    const socket = io('http://localhost:6969'); 

    // Event handler for receiving messages
    socket.on("game state", (message) => {
      var newGameState = JSON.parse(message);
      setGameState(newGameState);
    });

    // Clean up the socket connection on component unmount
    return () => {

      socket.disconnect();
    };
  }, []);

  if (gameState === undefined) {
    return <p>loading...</p>
  }
  else {
    return (
      <>
        <h1>{gameState.inLobby ? "Lobby" : "In game"}</h1>
        <div style={{"display": "flex", "justifyContent": "space-between" }}>
          {gameState.players.map(player => {
            return <div style={{"margin": "1rem", "min-width": "150px" }}>
              <p>{player.name}</p>
              <img src="./cardback.png"></img>
              {countCardTypes(player.cardsFaceUp).map(typeCount => {
                  return <div>{typeCount.type}x{typeCount.count}</div>
              })}
            </div>
          })}
        </div>
      </>
    );
  }
}

function countCardTypes(cardsFaceUp) {
  const countMap = {};
  
  for (const card of cardsFaceUp) {
    const { type } = card;
    if (countMap[type]) {
      countMap[type]++;
    } else {
      countMap[type] = 1;
    }
  }
  
  const output = [];
  
  for (const type in countMap) {
    output.push({ type, count: countMap[type] });
  }
  
  return output;
}

export default App;
