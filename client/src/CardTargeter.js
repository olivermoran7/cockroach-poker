import { useState } from "react";
import allCards from "./allCards";
import Card from "./Card";

var CardTargeter = ({players, onConfirm}) => {
    var [card, setCard] = useState(null);
    var [targetPlayer, setPlayer] = useState(null);

    var onClickConfirm = () => {
        if (card && targetPlayer) {
            onConfirm(card, targetPlayer);
        }
    }
    return (
        <>
        <div style={{display: "flex"}}>
            {allCards.map(card => <div style={{cursor: "pointer"}} onClick={() => setCard(card)}><Card type={card.type} width={"64px"}/></div>)}
        </div>
        <div style={{display: "flex"}}>
            {players.map(player => <div className="player-target" style={{cursor: "pointer", "margin": 10}}  onClick={() => setPlayer(player)}>{player.name}</div>)}
        </div>
        <button onClick={onClickConfirm}>Confirm</button>
        </>

    )
}

export default CardTargeter;