import { useState } from 'react';
import ReactPlayer from 'react-player';

const Lobby = () => {
    var [sniffin, setSniffin] = useState(false);
    if (sniffin) {
        return (
        <div className="lobby">
          <img
            className="background-image"
            src="./portsniffer.png" 
            alt="Fullscreen Image"
          />
          {/* <ReactPlayer
            url="./Project 51.mp3"
            playing
            loop
            volume={0.8}
            width="0"
            height="0"
          /> */}
        </div>
        )
    } else {
        return (
            <button onClick={() => setSniffin(true)}>Start sniffin'</button>
          );
    }
};

export default Lobby;
