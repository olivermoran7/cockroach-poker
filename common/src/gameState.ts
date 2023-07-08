import player from './player';
import play from './play';

export default interface GameState {
    players: player[],
    spectators: string[]
    play: play | null,
    inLobby: boolean
}


