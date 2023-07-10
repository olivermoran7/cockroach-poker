var Player = ({ name, typeCount, opponent, activePlayer }) => {
  if (opponent) {
    return (
      <div className="player-container opponent">
        <p className={activePlayer === name ? "player-name active" : "player-name"}>{name}</p>
        <img className="card-image" src="./cardback.png" alt="Card Back" />
        <img className="card-image" style={{"marginTop": "calc(var(--_width) * -1.72)"}} src="./cardback.png" />
        <img className="card-image" style={{"marginTop": "calc(var(--_width) * -1.72)"}} src="./cardback.png" />
        {typeCount.map((typeCount) => {
          return (
            <div key={typeCount.type}>
              {typeCount.type}x {typeCount.count}
            </div>
          );
        })}
      </div>
    );
  } else {
    return (
      <div className="player-container">
        <img className="card-image" src="./cardback.png" alt="Card Back" />
        <img className="card-image" style={{"marginTop": "calc(var(--_width) * -1.59)"}} src="./cardback.png" />
        <img className="card-image" style={{"marginTop": "calc(var(--_width) * -1.59)"}} src="./cardback.png" />
        {typeCount.map((typeCount) => {
          return (
            <div key={typeCount.type}>
              {typeCount.type}x {typeCount.count}
            </div>
          );
        })}
        <p className={activePlayer === name ? "player-name active" : "player-name"}>{name}</p>
      </div>
    );
  }
};

export default Player;
