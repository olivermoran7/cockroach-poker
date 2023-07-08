import express, { Request, Response } from 'express';
import gameState from 'common/src/gameState';
import { Server } from 'socket.io';
import http from 'http';
import { GameService } from './game-service/game-service';
import { SET_NAME, CHAT_MESSAGE, PLAYER_DISCONNECT, SPECTATOR_DISCONNECT } from 'common/src/socket-constants';

// Create Express app
const app = express();
const port = 6969;

const server = http.createServer(app);
const io = new Server(server);

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
  })

  socket.on(CHAT_MESSAGE, (message) => {
    console.log('Received message:', message);
    // Broadcast the message to all connected clients
    io.emit(CHAT_MESSAGE, message);
  });

  socket.on(PLAYER_DISCONNECT, () => {
    _gameService.removePlayer(socket.id)
  })

  socket.on(SPECTATOR_DISCONNECT, () => {
    _gameService.removeSpectator(socket.id)
  })
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
