import GameState from 'common/src/gameState';
import { GAME_STATE } from '../../common/src/socket-constants';
import { Server } from 'socket.io';

export class GameService {
    private _io: Server;
    private _gameState: GameState;
    
    constructor(io: Server,
        gameState: GameState)
    {
        this._io = io;
        this._gameState = gameState;
    }

    public addClient(socketId: string) {
        if (socketId) {
            //const defaultName = 'user' + makeId();
            
        }
    }

    public emitGameState(gameState: GameState) {
        this._io.sockets.emit(GAME_STATE, gameState)
    }
}