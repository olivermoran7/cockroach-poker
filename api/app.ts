import express, { Request, Response } from 'express';
import { Server } from 'socket.io';
import http from 'http';
import { GameService } from './src/game-service/game-service';
import { SET_NAME, CHAT_MESSAGE, PLAYER_DISCONNECT, SPECTATOR_DISCONNECT, SEND_CARD_TO_PLAYER, ADD_CARD_TO_PLAY, YOUR_CONNECTION, START_GAME } from './src/socket-constants';
import gameState from './src/gameState';
import { Socket } from 'dgram';

// Create Express app
const app = express();
const _apiPort = 6969;
const _uiPort = 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: `http://localhost:${_uiPort}`,
    methods: ['GET', 'POST'],
  },
});

const ADMIN_COMMANDS = {
  'purge': () => {
    _gameService.purge();
  }
}

const state: gameState = {
  inLobby: true,
  players: [],
  spectators: [],
  play: null,
  playerTurn: []
}

let _gameService = new GameService(io, state);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

io.on('connection', (socket) => {
  _gameService.addSpectator(socket.id);

  // Emit game state
  _gameService.emitGameState(state);

  // Set name
  socket.on(SET_NAME, (name) => {
    _gameService.setName(socket.id, name)
    _gameService.emitGameState(state);
  })

  socket.on(CHAT_MESSAGE, (message) => {
    console.log('Received message:', message);
    // Broadcast the message to all connected clients
    io.emit(CHAT_MESSAGE, message);
  });

  socket.on(PLAYER_DISCONNECT, () => {
    _gameService.removePlayer(socket.id)
    _gameService.emitGameState(state);
  })

  socket.on(SPECTATOR_DISCONNECT, () => {
    _gameService.removeSpectator(socket.id)
    _gameService.emitGameState(state);
  })

  // socket.on(SPECTATOR_BECOMES_PLAYER, () => {
  //   _gameService.moveSpectatorToPlayer(socket.id)
  // })

  socket.on(SEND_CARD_TO_PLAYER, (purportedCard, playerCardIsSentTo) =>{
    _gameService.sendCardToPlayer(purportedCard, playerCardIsSentTo)
    _gameService.emitGameState(state);
  })

  socket.on(ADD_CARD_TO_PLAY, (actualCard, purportedCard, playerSendingCard, playerCardIsSentTo) =>{
    _gameService.addCardToPlay(actualCard, purportedCard, playerSendingCard, playerCardIsSentTo)
    _gameService.emitGameState(state);
  })

  socket.on(START_GAME, () => {
    _gameService.newGame();
    _gameService.emitGameState(state);
  })

  io.emit(YOUR_CONNECTION, socket.id);
});

// Start the server
server.listen(_apiPort, () => {
  console.log(`Server is running on http://localhost:${_apiPort}`);
});
