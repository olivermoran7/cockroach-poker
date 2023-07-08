import express, { Request, Response } from 'express';
import gameState from 'common/src/gameState';
import { Server } from 'socket.io';
import http from 'http';
import { GameService } from './game-service/game-service';

// Create Express app
const app = express();
const port = 6969;

const server = http.createServer(app);
const io = new Server(server);

let _gameService = new GameService(io);

const state: gameState = {
  inLobby: true,
  players: [],
  spectators: [],
  play: null
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

io.on('connection', (socket) => {
  // Add a client when someone connects
  state.spectators.push({socketId: socket.id});

  // Emit game state
  
  // Set name
  
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
