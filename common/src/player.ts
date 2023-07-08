import card from "./card";
import connection from "./connection";

export default interface player {
    name: string,
    connection: connection,
    cardsInHand: card[],
    cardsFaceUp: card[]
}

