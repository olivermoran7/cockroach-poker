import card from "./card";

export default interface player {
    name: string,
    connection: string,
    cardsInHand: card[],
    cardsFaceUp: card[]
}

