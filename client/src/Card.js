const Card = ({ type, width, clicked, className }) => {
    const map = {
      'Cockroach': "./cards/card_cockroach.png",
      'Bat': "./cards/card_bat.png",
      'Fly': "./cards/card_fly.png",
      'Toad': "./cards/card_toad.png",
      'Rat': "./cards/card_rat.png",
      'Scorpion': "./cards/card_scorpion.png",
      'Spider': "./cards/card_spider.png",
      'Stink Bug': "./cards/card_stinkbug.png"
    };
    
    const classNames = ['face-card'];
  
    if (clicked) {
      classNames.push('clicked');
    }
  
    if (className) {
      classNames.push(className);
    }
  
    const combinedClassName = classNames.join(' ');
  
    return <img className={combinedClassName} style={{ width: width }} src={map[type]} alt={type} />;
  };
  
  export default Card;
  