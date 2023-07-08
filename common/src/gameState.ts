import player from './player';
import play from './play';
import connection from './connection';

export default interface gameState {
    players: player[],
    spectators: connection[]
    play: play | null,
    inLobby: boolean
}


