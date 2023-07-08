import GameState from '../gameState';
import { GAME_STATE } from '../socket-constants';
import { Server } from 'socket.io';
import Card from '../card';
import Player from '../player';
import Play from '../play';

export class GameService {
    private _io: Server;
    private _gameState: GameState; 
    private readonly _cardPerType = 8;
    private _cardTypes: Array<'Cockroach' | 'Bat' | 'Fly' | 'Toad' | 'Rat' | 'Scorpion' | 'Spider' | 'Stink Bug'> = [
        'Cockroach',
        'Bat',
        'Fly',
        'Toad',
        'Rat',
        'Scorpion',
        'Spider',
        'Stink Bug',
      ];

    
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

    public purge() {
        for (let p of this._gameState.players) this.removePlayer(p.connection)
        for (let s of this._gameState.spectators) this.removeSpectator(s)
    }

    private removePlayerCards(): void {
        this._gameState.players.forEach((player: Player) => {
          player.cardsInHand = [];
          player.cardsFaceUp = [];
        });
      }

    private createAndShuffleCards(): Card[] {
        const cards: Card[] = [];
      
        for (const type of this._cardTypes) {
            for (let i = 0; i < this._cardPerType; i++) {
            cards.push({ type });
            }
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

    public isGameOver(): boolean {
        // Check if the game is over
		this._gameState.players.forEach(i => {
			const cardTypes = Object.values(this._cardTypes);

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

	public addCardToPlay(actualCard: Card, purportedCard: Card, playerAddingCardToPlay: Player, playerCardIsSentTo: Player){
		this.removeCardFromHand(actualCard, playerAddingCardToPlay.connection);
        this.setInitialPlay(actualCard, purportedCard, playerCardIsSentTo);
		this.sendCardToPlayer(purportedCard, playerCardIsSentTo);
	}

	public sendCardToPlayer(purportedCard: Card, playerReceivingCard: Player){
        const playerWhoSentCard = this._gameState.playerTurn[-1]
		this._gameState.playerTurn.push(playerWhoSentCard);

		this._gameState.play!.purportedCard = purportedCard;
        this._gameState.play!.targetPlayerConnectionId = playerReceivingCard.connection;
	}

    private setInitialPlay(actualCard: Card, purportedCard: Card, playerReceivingCard: Player){
        const play:Play = {
			targetPlayerConnectionId: playerReceivingCard.connection,
			actualCard: actualCard,
			purportedCard: purportedCard
		}

        this._gameState.play = play;
    }

	private removeCardFromHand(card: Card, playerId: string){
		const player = this._gameState.players.filter(o => o.connection == playerId)[0];

		const index = player.cardsInHand.indexOf(card);
		if (index > -1) {
			player.cardsInHand.splice(index, 1);
			console.log(`Removed card of type ${card.type} from player with Id ${playerId}`)
		}
	}

    public removePlayer(connection: string) {
        const indexToRemove = this._gameState.players.findIndex(p => p.connection === connection)
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

	public removeSpectator(connection: string){
		const index = this._gameState.spectators.indexOf(connection);
		if (index > -1) {
			this._gameState.spectators.splice(index, 1);
			console.log(`Removed spectator with socket Id ${connection}`)
		}
	}
}
