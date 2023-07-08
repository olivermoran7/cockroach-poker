"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const game_service_1 = require("./game-service/game-service");
const socket_constants_1 = require("common/src/socket-constants");
// Create Express app
const app = (0, express_1.default)();
const port = 6969;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const state = {
    inLobby: true,
    players: [],
    spectators: [],
    play: null,
    playerTurn: []
};
let _gameService = new game_service_1.GameService(io, state);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
io.on('connection', (socket) => {
    _gameService.addSpectator(socket.id);
    // AddClient();
    //_gameService.addClient(socket.id);
    // Emit game state
    _gameService.emitGameState(state);
    // Set name
    socket.on(socket_constants_1.SET_NAME, (name) => {
        _gameService.setName(socket.id, name);
    });
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
