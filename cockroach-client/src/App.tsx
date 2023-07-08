import React, { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import { GAME_STATE } from 'common/src/socket-constants'

import gameState from 'common/src/gameState';

function App() {

  const [gameState, setGameState] = useState<gameState | undefined>(undefined);

  useEffect(() => {
    // Create a Socket.IO client instance
    const socket = io('http://localhost:6969'); 

    // Event handler for receiving messages
    socket.on("GAME_STATE", (message: string) => {
      var newGameState: gameState = JSON.parse(message);
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
      </>
    );
  }
}

export default App;
