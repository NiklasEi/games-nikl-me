function keyDown(e) {
    if(e.keyCode === 32) {
        if(awaitInput && (currentTile =! currentTiles.length)) return;
        startRound();
        return;
    }
    const tile = document.querySelector(`.tile[data-key="${e.keyCode}"]`);
    if(!tile) return;
    onClick(tile);
}

function onClick(element) {
    if(!awaitInput) return;
    activateTile(element);
}

function activateTile(element) {
    if(!element.dataset.key) return;
    if(awaitInput) {
        if(!element.dataset.tile) return;
        if(!(currentTiles[currentTile] == element.dataset.tile)) {
            lost();
            return;
        }
        currentTile++;
        if(currentTile === currentTiles.length) {
            nextRound();
            rules.innerText = "Press space to start the round";
            awaitInput = false;
            currentTile = 0;
        }
    }
    playSound(element.dataset.key)
}

function playSound(dataKey) {
    const audio =  document.querySelector(`audio[data-key="${dataKey}"]`);
    if(!audio) return;
    audio.currentTime = 0;
    audio.play();
    const tile = document.querySelector(`.tile[data-key="${dataKey}"]`);
    if(!tile) return;
    tile.classList.add('clicked');
}

function lost() {
    rules.innerText = "Lost in round " + currentRound;
    // block any further actions
    roundRunning = true;
    awaitInput = false;
}

function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    this.classList.remove('clicked');
}

let roundRunning = false;
function startRound() {
    if(roundRunning) return;
    rules.innerText = "Remember the pattern";
    roundRunning = true;
    nextTile();
}

function nextRound() {
    currentRound++;
    head.innerText = "Round: " + currentRound;
}

let awaitInput = false;
let currentRound = 1;
let currentTile = 0;
let currentTiles = [];
function nextTile() {
    let tileNr;
    if(currentTile === currentTiles.length) {
        tileNr = Math.floor((Math.random() * 4) + 1);
        currentTiles.push(tileNr);
    } else {
        tileNr = currentTiles[currentTile];
    }
    const tile = document.querySelector(`.tile[data-tile="${tileNr}"]`);
    activateTile(tile);
    currentTile ++;
    if (currentTile >= currentRound) {
        currentTile = 0;
        roundRunning = false;
        awaitInput = true;
        rules.innerText = "Repeat the pattern";
        return;
    }
    setTimeout(nextTile, 1000);
}

const tiles = document.querySelectorAll('.tile');
tiles.forEach(tile => tile.addEventListener('transitionend', removeTransition));

const head = document.getElementById("head");
const rules = document.getElementById("rules");

function start() {
    window.addEventListener('keydown', keyDown);
    head.innerText = "Round: " + currentRound;
    rules.innerText = "Press space to start the round";
}
window.onload = start;