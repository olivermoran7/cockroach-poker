const Card = ({type}) => {
    const map = {
        'Cockroach': "./cards/card_cockroach.png",
        'Bat': "./cards/card_bat.png",
        'Fly': "./cards/card_fly.png",
        'Toad': "./cards/card_toad.png",
        'Rat': "./cards/card_rat.png",
        'Scorpion': "./cards/card_scorpion.png",
        'Spider': "./cards/card_spider.png",
        'Stink Bug': "./cards/card_stinkbug.png"
    }
    return <img style={{width: "32px"}} src={map[type]} alt={type}></img>
} 

export default Card;