import card from './card';

export default interface play {
    targetPlayerConnectionId: string,
    actualCard: card,
    purportedCard: card
}