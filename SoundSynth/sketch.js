let windNoise, windFilter, windLFO, windPanner, windEnv;
let windImage;
let isPlaying = false;
let playButton;

function preload(){
  windImage = loadImage("media/wind.png");
}

function setup() {
  createCanvas(400, 400);
  background(220);

  textAlign(CENTER, CENTER);
  textSize(23);
  text("Left Click!!!!", height/2, width/2);

  windNoise = new Tone.Noise("pink").start();

  windEnv = new Tone.AmplitudeEnvelope({
    attack: 1.5, 
    decay: 2, 
    sustain: 0.8, 
    release: 3
  });
  windFilter = new Tone.Filter({
    type: "bandpass", 
    frequency: 500, 
    Q: 0.5
  });

  windLFO = new Tone.LFO({
    frequency: 0.2, 
    min: 300, 
    max: 1200
  }).connect(windFilter.frequency);

  windPanner = new Tone.AutoPanner({
    frequency: 0.1, 
    depth: 0.8
  }).start();

  windNoise.connect(windFilter);
  windFilter.connect(windEnv);
  windEnv.connect(windPanner);
  windPanner.connect(Tone.Destination);
}

function mousePressed(){
  if(Tone.context.state != 'running'){
    Tone.start();
  }

  if(!isPlaying){
    background(220);
   
  
  if(windImage){
    imageMode(CENTER);
    image(windImage, width/2, height/2, 300, 300);
  } 

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(24);

    isPlaying = true; 
    windLFO.start();
    windEnv.triggerAttack();
    createWindGust();
} else { 
  isPlaying = false;
  windEnv.triggerRelease();

  background(220);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("Left Click!!!!", width/2, height/2);
}
}
function createWindGust(){
  const noiseTypes = ["pink", "white"];

  for(let i = 0; i < 5; i++){
    let time = Tone.now() + (i * 2);
    let randomNoiseType = noiseTypes[Math.floor(Math.random() * noiseTypes.length)];
    windNoise.type = randomNoiseType;
  }

  const qValues = new Float32Array([0.5, 1, 2, 0.8, 0.3, 0.7, 1.5]);
  windFilter.Q.setValueCurveAtTime(qValues, Tone.now(), 10);

  windPanner.frequency.setValueCurveAtTime(
    new Float32Array([0.1, 0.5, 0.3, 0.8, 0.2, 0.4]), 
    Tone.now(),
    12
  );

  windNoise.volume.setValueCurveAtTime(
    new Float32Array([-20, -15, -10, -12, -8, -15, -12]),
    Tone.now(),
    14
  );
}