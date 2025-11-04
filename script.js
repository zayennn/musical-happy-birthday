const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const notes = [
  {f:262,d:.5,t:"Hap",p:p1},
  {f:262,d:.5,t:"py&nbsp",p:p1},
  {f:294,d:1,t:"Birth",p:p1},
  {f:262,d:1,t:"day&nbsp",p:p1},
  {f:349,d:1,t:"To&nbsp",p:p1},
  {f:330,d:2,t:"You",p:p1},
  
  {f:262,d:.5,t:"Hap",p:p2},
  {f:262,d:.5,t:"py&nbsp",p:p2},
  {f:294,d:1,t:"Birth",p:p2},
  {f:262,d:1,t:"day&nbsp",p:p2},
  {f:392,d:1,t:"To&nbsp;",p:p2},
  {f:349,d:2,t:"You",p:p2},
  
  {f:262,d:.5,t:"Hap",p:p3},
  {f:262,d:.5,t:"py&nbsp;",p:p3},
  {f:523,d:1,t:"Birth",p:p3},
  {f:440,d:1,t:"day&nbsp;",p:p3},
  {f:349,d:1,t:"Dear&nbsp;",p:p3},
  {f:330,d:1,t:"Frie",p:p3},
  {f:294,d:3,t:"nd",p:p3},
  
  {f:466,d:.5,t:"Hap",p:p4},
  {f:466,d:.5,t:"py&nbsp;",p:p4},
  {f:440,d:1,t:"Birth",p:p4},
  {f:349,d:1,t:"day&nbsp;",p:p4},
  {f:392,d:1,t:"To&nbsp;",p:p4},
  {f:349,d:2,t:"You",p:p4},
];

//DOM
notes.map((n) => createSpan(n));

function createSpan(n){
  n.sp = document.createElement("span");
  n.sp.innerHTML = n.t;
  n.p.appendChild(n.sp);
}

// SOUND
let speed = inputSpeed.value;
let flag = false;
let sounds = [];

class Sound{
  constructor(freq,dur,i){
    this.stop = true;
    this.frequency = freq;
    this.waveform = "triangle";
    this.dur = dur;
    this.speed = this.dur*speed;
    this.initialGain = .15;
    this.index = i;
    this.sp = notes[i].sp
  }
  
  cease(){
    this.stop = true;
    this.sp.classList.remove("jump");
    if(this.index < sounds.length-1){sounds[this.index+1].play();}
    if(this.index == sounds.length-1){flag = false;}
  }
  
  play(){
   this.oscillator = audioCtx.createOscillator();
   this.gain = audioCtx.createGain();
   this.gain.gain.value = this.initialGain;
   this.oscillator.type = this.waveform;
   this.oscillator.frequency.value = this.frequency;
   this.gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + this.speed);
   this.oscillator.connect(this.gain);
   this.gain.connect(audioCtx.destination);
   this.oscillator.start(audioCtx.currentTime);
   this.sp.setAttribute("class", "jump");
   this.stop = false;
   this.oscillator.stop(audioCtx.currentTime + this.speed); 
   this.oscillator.onended = ()=> {this.cease();}
  }  
}

for(let i=0; i < notes.length; i++){
  let sound = new Sound(notes[i].f, notes[i].d,i);
  sounds.push(sound);
}


// EVENTS
wishes.addEventListener("click",function(e){
  if(e.target.id != "inputSpeed" && !flag){
  sounds[0].play();
  flag = true;}
  },false);
                        
                        
inputSpeed.addEventListener("input",function(e){
  speed = this.value;
  sounds.map((s) => {
    s.speed = s.dur*speed
  });
},false);

// CANVAS
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let cw = canvas.width = window.innerWidth,
  cx = cw / 2;
let ch = canvas.height = window.innerHeight,
  cy = ch / 2;

let requestId = null;

const colors = ["#93DFB8","#FFC8BA","#E3AAD6","#B5D8EB","#FFBDD8"];

class Particle{
  constructor(){
    this.x = Math.random() * cw;
    this.y = Math.random() * ch;
    this.r = 15 + ~~(Math.random() * 20);//radius of the circumcircle
    this.l = 3 + ~~(Math.random() * 2);//polygon sides
    this.a = 2*Math.PI/this.l;// angle between polygon vertices
    this.rot = Math.random()*Math.PI;// polygon rotation
    this.speed = .05 + Math.random()/2;
    this.rotSpeed = 0.005 + Math.random()*.005;
    this.color = colors[~~(Math.random() * colors.length)];
  }
  update(){
    if(this.y < -this.r){
      this.y = ch + this.r;
      this.x = Math.random() * cw;
    }
    this.y -= this.speed;
  }
  draw(){
    ctx.save();
    ctx.translate(this.x,this.y);
    ctx.rotate(this.rot);
    ctx.beginPath();
    for( let i = 0; i < this.l; i++ ){
		let x = this.r * Math.cos( this.a*i );
		let y = this.r * Math.sin( this.a*i );
		ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = this.color;
    ctx.stroke();
    
    ctx.restore();
  }
  
}

let particles = [];
for(let i = 0; i < 20; i++){
let p = new Particle();
particles.push(p)
}



function Draw() {
requestId = window.requestAnimationFrame(Draw);
//ctx.globalAlpha=0.65;
ctx.clearRect(0,0,cw,ch);
particles.map((p) => {
  p.rot += p.rotSpeed;
  p.update();
  p.draw();
})

}


function Init() {
	if (requestId) {
		window.cancelAnimationFrame(requestId);
		requestId = null;
}


cw = canvas.width = window.innerWidth,cx = cw / 2;
ch = canvas.height = window.innerHeight,cy = ch / 2;

Draw();
};

setTimeout(function() {
		Init();
		window.addEventListener('resize', Init, false);
}, 15);