import GameState from 'common/src/gameState';
import { GAME_STATE } from '../../common/src/socket-constants';
import { Server } from 'socket.io';
import connection from 'common/src/connection';

export class GameService {
    private _io: Server;
    private _gameState: GameState; 
    private clients = {};
    
    constructor(io: Server,
        gameState: GameState)
    {
        this._io = io;
        this._gameState = gameState;
    }

    public addClient(socketId: connection) {
        if (socketId) {
            const defaultName = 'user' //+ makeId();
            
            const newPlayer = {
                name: defaultName,
                connection: socketId,
                cardsInHand: [],
                cardsFaceUp: []
            }

            this._gameState.players.push(newPlayer);
            console.log(`Added new client ${defaultName} with connection ${socketId}`);
        }
    }

    public emitGameState(gameState: GameState) {
        this._io.sockets.emit(GAME_STATE, gameState)
    }
}
