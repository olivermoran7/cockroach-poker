import React, { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import Player from './Player';
import CardTargeter from './CardTargeter';
import Card from './Card';
import ReactPlayer from 'react-player';
import ChatBox from './ChatBox';

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
  playerTurn: ["2"],
  play: {
    targetPlayer: "1",
    purportedCard: { type: 'Bat' },
    actualCard: { type: 'Bat' }
  },
  inLobby: false,
};

const startId = "1";

function App() {

  const [gameState, setGameState] = useState(startSate);
  const [myConnection, setMyConnection] = useState(startId);
  const [selectedCard, setSelectedCard] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Create a Socket.IO client instance
    const newSocket = io('http://localhost:6969');
    setSocket(newSocket);

    // Event handler for receiving messages
    newSocket.on("game state", (receivedGameState) => {
      setMyConnection(newSocket.id);
      var newGameState = receivedGameState  
      setGameState(newGameState);
    });

    // Clean up the socket connection on component unmount
    return () => {
      setSocket(null);
      newSocket.disconnect();
    };
  }, []);

  const onClickSelectCard = (card) => {
    if (meActivePlayer()) {
      setSelectedCard(card);
    }
  }

  const onClickStartGame = () => {
    socket.emit("start game");
  }

  const emitGame = () => {
    console.log(gameState);
    socket.emit("game state", gameState);
  }

  const onSendCard = (card, player) => {
    var newGameState = structuredClone(gameState);
    newGameState.play = {
      targetPlayer: player.connection,
      actualCard: selectedCard,
      purportedCard: card
    }
    console.log("before set", newGameState);
    setGameState(newGameState);
    console.log("after set", gameState);

    console.log("sending card to regan's stupid server")
    emitGame();
  }

  const onClickTrust = () => {
    if (gameState.play.actualCard.type === gameState.play.purportedCard.type) {
      moveCard(activePlayer().connection, activePlayer().connection, gameState.play.actualCard.type);
    } else {
      moveCard(activePlayer().connection, targetPlayer().connection, gameState.play.actualCard.type);
    }
  }

  const onClickCallBluff = () => {
    if (gameState.play.actualCard.type === gameState.play.purportedCard.type) {
      moveCard(activePlayer().connection, targetPlayer().connection, gameState.play.actualCard.type);
    } else {
      moveCard(activePlayer().connection, activePlayer().connection, gameState.play.actualCard.type);
    }
  }

  const moveCard = (fromPlayerConnection, toPlayerConnection, cardType) => {
    const newGameState = structuredClone(gameState);
    const fromPlayer = newGameState.players.find(player => player.connection === fromPlayerConnection);
    const indexToRemove = fromPlayer.cardsInHand.findIndex(card => card.type === cardType);
    fromPlayer.cardsInHand.splice(indexToRemove, 1);
    const toPlayer = newGameState.players.find(player => player.connection === toPlayerConnection);
    toPlayer.cardsFaceUp.push({ type: cardType });
    setGameState(newGameState);
    emitGame();
  }

  const meActivePlayer = () => activePlayer().connection === me().connection;
  const meTargeted = () => gameState.play && targetPlayer() && targetPlayer().connection === me().connection;

  const opponents = () => gameState.players.filter(player => player.connection !== myConnection);
  const me = () => gameState.players.find(player => player.connection === myConnection);

  const activePlayer = () => gameState.players.find(player => player.connection === gameState.playerTurn[gameState.playerTurn.length - 1]);
  const targetPlayer = () => gameState.players.find(player => player.connection === gameState.play.targetPlayer);
  const offeredCard = () => gameState.play.purportedCard;
  
  var [sniffin, setSniffin] = useState(true);
  if (gameState === undefined) {
    return <p>loading...</p>
  }
  else {
    if (sniffin) {
      return (
      <div className="lobby">
        <img
          className="background-image"
          src="./portsniffer.png" 
          alt="Fullscreen Image"
        />
        <ReactPlayer
          url="./Project 51.mp3"
          playing
          loop
          volume={0.8}
          width="0"
          height="0"
        />
      <button onClick={() => setSniffin(false)}>Start sniffin'</button>
      </div>
      )
    } else {
      return ( 
        <>
          {/* Start game */}
          {
            gameState.inLobby && gameState.players.length > 1 &&
            <button onClick={onClickStartGame}>Start game</button>
          }


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

          {/* <ChatBox></ChatBox> */}

          {/* Selector */}
          {
            selectedCard && <CardTargeter players={opponents()} onConfirm={onSendCard} />
          }

          {/* Responder */}
          {meTargeted() && 
          <div>
            <button onClick={onClickTrust}>Trust</button>
            <button onClick={onClickCallBluff}>Call bluff</button>
          </div>
        }

          {/* My state */}
          {me() &&
          <>
          <Player name = {me().name} typeCount={countCardTypes(me().cardsFaceUp)} />
          <div style={{display: "flex"}}>
            {me().cardsInHand.map(card => <div style={{cursor: "pointer"}} onClick={() => onClickSelectCard(card)}><Card type={card.type} /></div>)}
          </div>
          </>
          }

        </>
      );
    }
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
