import GameState from 'common/src/gameState';
import { GAME_STATE } from '../../common/src/socket-constants';
import { Server } from 'socket.io';
import { CardType } from 'common/src/enums/card-type';
import Card from 'common/src/card';
import Player from 'common/src/player';

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

    public newGame() {
        // reset the game state
        this.removePlayerCards();

        // create and shuffle cards
        let cards = this.createAndShuffleCards();

        // assign cards to players
        this.distributeCards(this._gameState.players, cards);     
    }

    private removePlayerCards(): void {
        this._gameState.players.forEach((player: Player) => {
          player.cardsInHand = [];
          player.cardsFaceUp = [];
        });
      }

    private createAndShuffleCards(): Card[] {
        const cardTypes: CardType[] = [
          CardType.Cockroach,
          CardType.Bat,
          CardType.Fly,
          CardType.Toad,
          CardType.Rat,
          CardType.Scorpion,
          CardType.Spider,
          CardType.StinkBug,
        ];
      
        const cards: Card[] = [];
      
        // Create 8 objects for each card type
        for (let i = 0; i < 8; i++) {
          cardTypes.forEach((cardType) => {
            cards.push({ type: cardType });
          });
        }
      
        // Shuffle the cards using Fisher-Yates algorithm
        for (let i = cards.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [cards[i], cards[j]] = [cards[j], cards[i]];
        }
      
        return cards;
      }

      private distributeCards(players: Player[], cards: Card[]): void {
        const numPlayers = players.length;
        const numCardsPerPlayer = Math.floor(cards.length / numPlayers);
      
        for (let i = 0; i < numPlayers; i++) {
          const player = players[i];
          player.cardsInHand = cards.slice(i * numCardsPerPlayer, (i + 1) * numCardsPerPlayer);
        }
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

    public isGameOver() {
        // Check if the game is over
    }

    public removePlayer(player: Player) {
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
