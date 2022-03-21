//Global Constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var guessCounter = 0;
var mistakes = 0;
var progress = 0; 
var strike = 0;
var timeLeft = 0;
var volume = 0.5;
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var gamePlaying = false;
var tonePlaying = false;
var pattern;

function f() {
    var counter = strike;
    var display = "Strikes: " + counter;
  
    document.getElementById('text').innerHTML = display;
}

function startGame(){
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  mistakes = 0;
  
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  
  pattern = Array.from({length: 9}, () => Math.floor(Math.random() * 8));
  
  var index = pattern.indexOf(0);
  if (index !== -1) {
    pattern[index] = 3;
  }
  
  playClueSequence();
  createTimer();
  
  // pattern.forEach(function(entry) {
  // console.log(entry);
  // });
  
}

function stopGame(){
  gamePlaying = false;
  pattern = [];
  
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function winGame(){
  stopGame();
  alert("Game Over. You won!");
  pattern = [];
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
  pattern = [];
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}


function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  let timer = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms" + " / Strike Counter: " + strike + " / Time Left: " + timeLeft)
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay -= cluePauseTime;
    clueHoldTime -= 12
  }
}

function updateTimer() {
  timeLeft++;
}

function createTimer() {
  timeLeft = 0;
  setInterval(updateTimer(),1000)
  
}

function guess(btn){
  // console.log("user guessed: " + btn);
  if (!gamePlaying){
    return;
  }
  
  if (pattern[guessCounter] == btn){
    if (guessCounter == progress){
      if (progress == pattern.length - 1){
        winGame();
      } else {
        progress++;
        createTimer();
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  } else { 
      if (strike == 2 || timeLeft == 5) { 
        timeLeft = 0;
        strike = 0;
        loseGame();
      } else {
        strike++;
      }
    }
} 

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 501.3,
  6: 558,
  7: 604.6,
  8: 655
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)



