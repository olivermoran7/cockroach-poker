import Card from './Card';

var Player = ({ name, typeCount, opponent, activePlayer, selectedCard }) => {
  if (opponent) {
    return (
      <div className="player-container opponent">
        <p className={activePlayer === name ? "player-name active" : "player-name"}>{name}</p>
        <img className="card-image" src="./cardback.png" alt="Card Back" />
        <img className="card-image" style={{"marginTop": "calc(var(--_width) * -1.72)"}} src="./cardback.png" />
        <img className="card-image" style={{"marginTop": "calc(var(--_width) * -1.72)", "box-shadow": "10px 11px 5px #0f0f0f85"}} src="./cardback.png" />
        {typeCount.map((typeCount) => {
          return (
            <div key={typeCount.type}>
              {typeCount.type} x{typeCount.count}
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
        <img className="card-image" style={{"marginTop": "calc(var(--_width) * -1.59)", "box-shadow": "16px 14px 5px #0f0f0f85"}} src="./cardback.png" />
        {typeCount.map((typeCount) => {
          return (
            <div key={typeCount.type}>
              {typeCount.type}x {typeCount.count}
            </div>
          );
        })}
        <p className={activePlayer === name ? "player-name active" : "player-name"}>{name}</p>

        {/* My selected card */}
        {selectedCard && (
          <div className="selected-card">
            <p>Selected card:</p>
            <div style={{ display: "flex"}}>
              <Card
              className={'no-margin'}
              type={selectedCard.type} width={"80px"} />
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default Player;
