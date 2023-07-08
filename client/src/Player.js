 var Player = ({ name, typeCount}) => {
    return <div style={{"margin": "1rem", "min-width": "150px" }}>
    <p>{name}</p>
    <img src="./cardback.png"></img>
    {typeCount.map(typeCount => {
        return <div>{typeCount.type}x{typeCount.count}</div>
    })}
  </div>
}

export default Player;