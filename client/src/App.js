import React, { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import Player from './Player';
import CardTargeter from './CardTargeter';
import Card from './Card';
import ReactPlayer from 'react-player';
import ChatBox from './ChatBox';
import allCards from './allCards';

const startId = "1";

function App() {

  const [gameState, setGameState] = useState(null);
  const [myConnection, setMyConnection] = useState(startId);
  const [selectedCard, setSelectedCard] = useState(null);
  const [socket, setSocket] = useState(null);
  const [showLobby, setShowLobby] = useState(false);
  const [showGameOver, setShowGameOver] = useState(null);

  let turn = 1;

  useEffect(() => {
    // Create a Socket.IO client instance
    const newSocket = io('http://localhost:6969');
    setSocket(newSocket);

    // Event handler for receiving messages
    newSocket.on("game state", (receivedGameState) => {
      setMyConnection(newSocket.id);
      setGameState(receivedGameState);
    });

    // Show the lobby with a fade-in effect on page load
    const timer = setTimeout(() => {
      setShowLobby(true);
    }, 100); // Delay the fade-in effect for 100 milliseconds

    // Clean up the socket connection on component unmount
    return () => {
      console.log('cleaning up...')
      setSocket(null);
      newSocket.disconnect();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    console.log('checking if game is over')
    isGameOver();
  }, [gameState]);

  const onClickSelectCard = (card) => {
    if (meActivePlayer() && gameState.playerTurn.length == 1) {
      setSelectedCard(card);
    }
  }

  const onClickStartGame = () => {
    socket.emit("start game");
  }

  const onClickRestartGame = () => {
    // restart the game
    // TODO: Fix the bug here
    socket.emit("start game");
  }

  const emitGame = () => {
    if (gameState) {
      socket.emit("game state", gameState);
    }
  }

  const onSendCard = (card, player) => {
    gameState.play = {
      targetPlayerConnectionId: player.connection,
      actualCard: selectedCard,
      purportedCard: card
    }
    setGameState(gameState);
    emitGame();
  }

  const onClickTrust = () => {
    if (gameState.play.actualCard.type === gameState.play.purportedCard.type) {
      moveCard(activePlayer().connection, activePlayer().connection, gameState.play.actualCard.type);
    } else {
      moveCard(activePlayer().connection, targetPlayer().connection, gameState.play.actualCard.type);
    }

    nextTurn();
  }

  const onClickCallBluff = () => {
    if (gameState.play.actualCard.type === gameState.play.purportedCard.type) {
      moveCard(activePlayer().connection, targetPlayer().connection, gameState.play.actualCard.type);
    } else {
      moveCard(activePlayer().connection, activePlayer().connection, gameState.play.actualCard.type);
    }

    nextTurn();
  }

  const findLosingPlayer = () => {
    // Check if the game is over
    for (const player of gameState.players) {
      for (const possibleCard of allCards) {
        const numberOfCardsOfThisTypeFaceUp = player.cardsFaceUp.filter(card => card.type === possibleCard.type).length;
          if ((gameState.players.length > 2 && numberOfCardsOfThisTypeFaceUp >= 4) || numberOfCardsOfThisTypeFaceUp >= 5) {
            // Return the loser
            return player;
          }
        }
      }
    }

  const isGameOver = () => {
    if (gameState) {
      const losingPlayer = findLosingPlayer();
      if (losingPlayer) {
        setShowGameOver(losingPlayer)
      }  
    }  
  };

  const onClickPass = () => {
    // Add the current target's connection to the turn list
    gameState.playerTurn.push(gameState.play.targetPlayerConnectionId)

    // The selected card is the original player's card
    setSelectedCard(gameState.play.actualCard)
    
    emitGame();
  }

  const moveCard = (fromPlayerConnection, toPlayerConnection, cardType) => {

    const fromPlayer = gameState.players.find(player => player.connection === fromPlayerConnection);
    const indexToRemove = fromPlayer.cardsInHand.findIndex(card => card.type === cardType);
    fromPlayer.cardsInHand.splice(indexToRemove, 1);
    const toPlayer = gameState.players.find(player => player.connection === toPlayerConnection);
    toPlayer.cardsFaceUp.push({ type: cardType });
    setGameState(gameState);

    emitGame();
  }

  const nextTurn = () => {
    // The next turn is the one who last received the card
    gameState.playerTurn = [gameState.play.targetPlayerConnectionId];

    // Clean up
    setSelectedCard(null);
    gameState.play = null;

    setGameState(gameState);
    emitGame();
  }

  const meActivePlayer = () => activePlayer().connection === me().connection;
  const meTargeted = () => gameState.play && targetPlayer() && targetPlayer().connection === me().connection;

  const opponents = () => gameState.players.filter(player => player.connection !== myConnection);
  const me = () => gameState.players.find(player => player.connection === myConnection);

  const activePlayer = () => gameState.players.find(player => player.connection === gameState.playerTurn[gameState.playerTurn.length - 1]) ?? "";
  const targetPlayer = () => gameState.players.find(player => player.connection === gameState.play.targetPlayerConnectionId);
  const offeredCard = () => gameState.play.purportedCard;

  const canPass = () => (gameState.playerTurn.length +1 < gameState.players.length)
  
  var [sniffin, setSniffin] = useState(true);
  if (gameState === undefined) {
    return <p>loading...</p>
  }
  else {
    if (sniffin) {
      return (
        <div className={`lobby-container`} onClick={() => { setSniffin(false); setShowLobby(false); }}>
          <div className={`lobby-content ${showLobby ? 'fade-in' : ''}`}>
            <p style={{ margin: 10 }}>Brought to you by...</p>
            <p className="flashing-text">Click to begin!</p>
          </div>
        </div>
      )
    } else {
      return (
      <div className="app-container">
          <ReactPlayer
            url="./Project 51.mp3"
            playing
            loop
            volume={0.8}
            width="0"
            height="0"
          />
      {/* Start game */}
      {
        gameState.inLobby && gameState.players.length > 1 &&
        <button className="start-game-button" onClick={onClickStartGame}>Start game</button>
      }

      {/* Opponents */}
      <h1 className="title-text">{gameState.inLobby ? "Lobby" : "In game"}</h1>
      <div className="opponents-container">
        {opponents().map(player => {
          return <Player name={player.name} typeCount={countCardTypes(player.cardsFaceUp)} opponent={true} activePlayer={activePlayer().name}/>
        })}
      </div>

        {/* Play */}
        {
        gameState.play && 
        <div>
          <p>{activePlayer().name} offers {targetPlayer().name} a {offeredCard().type}</p>
          
        </div>


        }

        {/* Game over */}
        {showGameOver && (
          <div className="modal">
            <div className="modal-content">
              <h2>Game Over</h2>
              {<p>The game is over. {findLosingPlayer().name} has lost.</p>}
              <button onClick={onClickRestartGame}>Restart game</button>
            </div>
          </div>
        )}


        {/* <ChatBox></ChatBox> */}

        {/* Selector */}
        {
          meActivePlayer() && selectedCard && <CardTargeter players={opponents().filter(player => !gameState.playerTurn.includes(player.connection))} onConfirm={onSendCard} />
        }
        {/* Spacer */}
        {
          !selectedCard && <div style={{"height": "15%"}}></div>
        }
        {/* Responder */}
        {meTargeted() && !gameState.playerTurn.includes(me().connection) &&
          <div>
            <button onClick={onClickTrust}>Trust</button>
            <button onClick={onClickCallBluff}>Call bluff</button>
            {canPass() && <button onClick={onClickPass}>Pass</button>}
          </div>
        }

        {/* My state */}
        {me() &&
        <>
        <Player 
        name = {me().name} 
        typeCount={countCardTypes(me().cardsFaceUp)} 
        opponent={false} 
        activePlayer={activePlayer().name}
        selectedCard={selectedCard}/>
        <div style={{display: "flex"}}>
          {me().cardsInHand.map(card => <div style={{cursor: "pointer"}} onClick={() => onClickSelectCard(card)}>
            <Card type={card.type} width={"60px"} inset={true} /></div>)}
        </div>
        </>
        }

        </div>
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
