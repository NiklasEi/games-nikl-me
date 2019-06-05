let roundRunning = false;
let awaitInput = false;
let ignoreInput = false;
let currentRound = 1;
let currentTile = 0;
let currentTiles = [];

const tiles = document.querySelectorAll('.tile');
const head = document.getElementById("head");
const rules = document.getElementById("rules");

function start() {
    tiles.forEach(tile => {
        tile.addEventListener('transitionend', removeTransition, false);
        tile.addEventListener('click', clickTile, false);
        tile.addEventListener('touch', clickTile, false);
    });
    window.addEventListener('keydown', keyDown, false);
    window.addEventListener('click', startRound, false);
    window.addEventListener('touch', startRound, false)
    head.innerText = "Round: " + currentRound;
    rules.innerText = "Click to start";
}
window.onload = start;

function keyDown(e) {
    if( awaitInput && !ignoreInput ) {
        const tile = document.querySelector(`.tile[data-key="${e.keyCode}"]`);
        if(!tile) return;
        clickTile.call(tile);
    } else if (!roundRunning){
        startNextRound();
    }
}

let handled = false;
function clickTile(e) {
    if(!awaitInput || ignoreInput) return;
    if (!e) {
        // fired from keydown
        activateTile(this);
    } else if(e.type === "touch") {
        handled = true;
        activateTile(this);
    } else if(e.type === "click" && !handled) {
        activateTile(this);
    } else {
        handled = false;
    }
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
            awaitInput = false;
            rules.innerText = "Good job!";
            ignoreInput = true;
            setTimeout(
                () => {
                    nextRound();
                    rules.innerText = "Click to start the round";
                    currentTile = 0;
                    ignoreInput = false;
                },
                1500
            )
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
    ignoreInput = true;
    roundRunning = false;
    awaitInput = false;
}

function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    this.classList.remove('clicked');
}

function startRound(e) {
    if(roundRunning || awaitInput || ignoreInput) return;
    if(e.type === "touch") {
        handled = true;
        startNextRound();
    } else if(e.type === "click" && !handled) {
        startNextRound();
    } else {
        handled = false;
    }
}

function startNextRound() {
    rules.innerText = "Remember the pattern";
    roundRunning = true;
    nextTile();
}

function nextRound() {
    currentRound++;
    head.innerText = "Round: " + currentRound;
}

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

function sendHighScore() {
    const idHash = getUrlParameter("player");
    if(!idHash) return;
    const score = currentRound;
    // Submit high score to Telegram
    const xmlhttp = new XMLHttpRequest();
    const url = "https://tg-bot.nikl.me/setgamescore";
    xmlhttp.open("POST", url, true);
    const data = {
        "id_hash": idHash,
        "high_score": score
    };
    xmlhttp.send(JSON.stringify(data));
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
