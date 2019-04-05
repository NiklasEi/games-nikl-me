function keyDown(e) {
    playSound(e.keyCode);
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

function onClick(element) {
    if(!element.dataset.key) return;
    playSound(element.dataset.key)
}

function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    this.classList.remove('clicked');
}

function nextRound() {
    currentRound++;
    head.innerText = "Round: " + currentRound;
}

function playCombo() {
    let count = 0;
    for roun
}

const tiles = document.querySelectorAll('.tile');
window.addEventListener('keydown', keyDown);
tiles.forEach(tile => tile.addEventListener('transitionend', removeTransition));

let currentRound = 1;

const head = document.getElementById("head");
head.innerText = "Round: " + currentRound;