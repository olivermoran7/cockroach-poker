import { useState } from "react";
import allCards from "./allCards";

var CardTargeter = ({players, onConfirm}) => {
    console.log(players)
    var [card, setCard] = useState(null);
    var [targetPlayer, setPlayer] = useState(null);

    var onClickConfirm = () => {
        if (card && targetPlayer) {
            onConfirm(card, targetPlayer);
        }
    }
    return (
    <div>
        {allCards.map(card => <div onClick={() => setCard(card)}>{card.type}</div>)}
        {players.map(player => <div onClick={() => setPlayer(player)}>{player.name}</div>)}
        <button onClick={onClickConfirm}>Confirm</button>
    </div>
    )
}

export default CardTargeter;