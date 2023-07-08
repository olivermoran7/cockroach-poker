import card from "./card";

export default interface Player {
    name: string,
    connection: string,
    cardsInHand: card[],
    cardsFaceUp: card[]
}

