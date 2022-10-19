
function rollDice(eyes) {
    return Math.floor(Math.random()*eyes + 1);
}

function selectRandom(array) {
    return array[rollDice(array.length) - 1];
}

