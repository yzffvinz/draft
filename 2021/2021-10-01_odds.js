function range(oddsX, oddsY, bets) {
    const lowX = 1 / oddsX;
    const highX = 1 - 1 / oddsY;
    const low = +((lowX).toFixed(3));
    const high = +(highX).toFixed(3);
    
    console.log(high > low ? '可行' : '不行', `${oddsX}的投注比例需要在：`, low, '~', high);
    const benifitX = highX * oddsX - 1;
    const benifitY = (1 - lowX) * oddsY - 1;
    console.log(`收益率：0 ~ ${benifitX > benifitY ? benifitX : benifitY}`);
    const betX = ((low + high) / 2 * bets).toFixed(0);
    const betY = bets - betX;
    console.log(`投注金额: ${oddsX} => ${betX},   |   ${oddsY} => ${betY}`);
    console.log(`预期收益: ${(oddsX * betX - bets).toFixed(2)},   |   ${(oddsY * betY - bets).toFixed(2)}`);

}

range(1.97, 2.14, 19000);