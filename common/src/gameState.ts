import player from './player';
import play from './play';

export interface gameState {
    players: player[],
    play: play | null
}


