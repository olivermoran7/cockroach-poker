import { GAME_STATE } from '../../common/src/socket-constants';
import { Server } from 'socket.io';

let io: Server;

function setIo(_io: Server) {
    io = _io;
}
