import player from './player';
import play from './play';
import connection from './connection';

export default interface GameState {
    players: player[],
    spectators: connection[]
    play: play | null,
    inLobby: boolean
}


