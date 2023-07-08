import card from "./card";
import connection from "./connection";

export default interface player {
    id: string,
    name: string,
    connection: connection,
    cardsInHand: card[],
    cardsFaceUp: card[]
}

