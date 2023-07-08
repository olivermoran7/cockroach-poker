import GameState from 'common/src/gameState';
import { GAME_STATE } from '../../common/src/socket-constants';
import { Server } from 'socket.io';
import player from 'common/src/player';
import { CardType } from 'common/src/enums/card-type';

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

	public addSpectator(socketId: string){
		if (socketId){
			this._gameState.spectators.push(socketId);
            console.log(`Added new spectator with socket Id ${socketId}`);
		}
	}

    public moveSpectatorToPlayer(socketId: string) {
        if (socketId) {
            const defaultName = 'user' + this.makeId(6);
            
            const newPlayer = {
                name: defaultName,
                connection: socketId,
                cardsInHand: [],
                cardsFaceUp: []
            }

            this._gameState.players.push(newPlayer);
            console.log(`Added new player ${defaultName} with connection ${socketId}`);

			this.removeSpectator(socketId);
        }
    }

    public emitGameState(gameState: GameState) {
        this._io.sockets.emit(GAME_STATE, gameState)
    }

	public setName(socketId: string, name: string){
		const player = this._gameState.players.filter(o => o.connection == socketId)[0];

		player.name = name;
	}

    public isGameOver(): boolean {
        // Check if the game is over
		this._gameState.players.forEach(i => {
			const cardTypes = Object.values(CardType);

			cardTypes.forEach(j => {
				var numberOfCardsOfThisTypeFaceUp = i.cardsFaceUp.filter(o => o.type == j).length;

				if (this._gameState.players.length > 2 && numberOfCardsOfThisTypeFaceUp >= 4 ||
					numberOfCardsOfThisTypeFaceUp >= 5){
					return true
				}
			})
		})
		
		return false;
    }

    public removePlayer(player: player) {
        const indexToRemove = this._gameState.players.findIndex(p => p === player)
        if (indexToRemove !== -1) {
            this._gameState.players.splice(indexToRemove, 1);
        }
    }

	private makeId(length: number) {
		var result = '';
		var characters = '0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
	   return result;
	}
    
	private removeSpectator(socketId: string){
		const index = this._gameState.spectators.indexOf(socketId);
		if (index > -1) {
			this._gameState.spectators.splice(index, 1);
			console.log(`Removed spectator with socket Id ${socketId}`)
		}
	}
}
