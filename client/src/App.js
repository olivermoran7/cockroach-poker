import React, { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import Player from './Player';
import CardTargeter from './CardTargeter';
import Card from './Card';

const startSate = {
  players: [
    {
      name: "Charlie",
      connection: "1",
      cardsFaceUp: [{ type: 'Bat' }, { type: 'Bat' }, { type: 'Cockroach' }],
      cardsInHand: [{ type: 'Bat' }, { type: 'Cockroach' }, { type: 'Fly' }],
    },
    {
      name: "Hugh",
      connection: "2",
      cardsFaceUp: [{ type: 'Stink Bug' }, { type: 'Scorpion' } ],
      cardsInHand: [{ type: 'Bat' }, { type: 'Cockroach' }, { type: 'Fly' }],
    },
  ],
  spectators: [],
  playerTurn: ["1"],
  play: null,
  inLobby: false,
};

const startId = "1";

function App() {

  const [gameState, setGameState] = useState(startSate);
  const [myConnection, setMyConnection] = useState(startId);
  const [selectedCard, setSelectedCard] = useState(null);

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

  const onClickSelectCard = (card) => {
    if (meActivePlayer()) {
      setSelectedCard(card);
    }
  }

  const onSendCard = (card, player) => {
    var newGameState = structuredClone(gameState);
    newGameState.play = {
      targetPlayer: player.connection,
      activePlayer: selectedCard,
      purportedCard: card
    }
    setGameState(newGameState);
  }

  const meActivePlayer = () => activePlayer().connection === me().connection;

  const opponents = () => gameState.players.filter(player => player.connection !== myConnection);
  const me = () => gameState.players.find(player => player.connection === myConnection);

  const activePlayer = () => gameState.players.find(player => player.connection === gameState.playerTurn[gameState.playerTurn.length - 1]);
  const targetPlayer = () => gameState.players.find(player => player.connection === gameState.play.targetPlayer);
  const offeredCard = () => gameState.play.purportedCard;

  if (gameState === undefined) {
    return <p>loading...</p>
  }
  else {
    return (
      <>
        {/* Opponents */}
        <h1>{gameState.inLobby ? "Lobby" : "In game"}</h1>
        <div style={{"display": "flex", "justifyContent": "space-between" }}>
          {opponents().map(player => {
            return <Player name = {player.name} typeCount={countCardTypes(player.cardsFaceUp)} />
          })
        }
        </div>

        {/* Play */}
        {
        gameState.play && 
        <div>
          <p>{activePlayer().name} offers {targetPlayer().name} a {offeredCard().type}</p>
        </div>
        }

        {/* Selector */}
        {
          selectedCard && <CardTargeter players={opponents()} onConfirm={onSendCard} />
        }


        {/* My state */}
        <Player name = {me().name} typeCount={countCardTypes(me().cardsFaceUp)} />
        <div style={{display: "flex"}}>
          {me().cardsInHand.map(card => <div style={{cursor: "pointer"}} onClick={() => onClickSelectCard(card)}><Card type={card.type} /></div>)}
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
