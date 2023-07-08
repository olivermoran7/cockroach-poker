import express, { Request, Response } from 'express';
import gameState from 'common/src/gameState';
import { Server } from 'socket.io';
import http from 'http';

// Create Express app
const app = express();
const port = 6969;

const server = http.createServer(app);
const io = new Server(server);

const state: gameState = {
  inLobby: true,
  players: [],
  spectators: [],
  play: null
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

io.on('connection', (socket) => {
  state.spectators.push({socketId: socket.id});
  
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
