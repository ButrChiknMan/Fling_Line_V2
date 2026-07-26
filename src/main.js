import './style.css'
import p5 from 'p5';

window.p5 = p5;

let showColorWheel = false;
let color_wheel; 
let value_wheel;
let satu_wheel;

let wheelsize;
let wheel_deploy_x;
let wheel_deploy_y;
let showValueWheel = false;
let showSatuWheel = false;

let currentHue;
let currentValue = 100;
let currentSatu = 90;

let wheelX = 0;
let wheelY = 0;
const wheelRadius = 200;


let currentTool = 'none'; 

let crtShader;
let uilayer;
let canvasLayer;


let MatrixMode = false;

let level = 1;
let exp = 0;
let cursors = [['c_1.png','c_2.png'],['c_3.png','c_4.png'],['c_5.png','c_6.png']]



const cs = [[[0],[255]],[[10,50,100],[10,200,40]]];


let ballLag = 2;
let ballPos;       
let ballVel;       
let ballPrevPos;   
let isDraggingBall = false;
let gravity = 0.5;   
let bounce = -0.75;  
let ballRadius = 20;
let ballcolor = 0;
let trailWeight = 15;
let pongTrail = false;
let dragEasing = 0.20;

let ballHistory = [];
const ballAncestor = 10;

let uiElement;


// window.preload = function() {
//   color_wheel = loadImage(color_wheel_url); 
//   value_wheel = loadImage('/value_wheel.png');
// };


window.setup = async function(){

  pixelDensity(1);
  createCanvas(displayWidth, displayHeight);
  colorMode(RGB);

  color_wheel = await loadImage('color_wheel.png'); 
  value_wheel = await loadImage('value_wheel.png');

  uilayer = createGraphics(displayWidth, displayHeight);
  canvasLayer = createGraphics(displayWidth, displayHeight);
  canvasLayer.background(255); 
  
  
  ballPos = createVector(width / 2, height / 2);
  ballVel = createVector(0, 0);
  ballPrevPos = ballPos.copy();

  uiElement = select('#shortcut-ui');
  noCursor()
  // cursor('color/'+ cursors[-1+level][0]);
  
}


window.draw = function() {

  
  if (MatrixMode === false) {
     image(canvasLayer, 0, 0);
  }
  
  
  let currentSpeed;
  let headingAngle = 0;
  
  if (isDraggingBall) {

    cursor('c_3.png');

    ballHistory.push([mouseX, mouseY]);

    if(ballHistory.length > ballAncestor){
      ballHistory.shift();
    } 
    

    let dx = mouseX - ballPos.x;
    let dy = mouseY - ballPos.y;
    let dmag = sqrt((dx*dx)+(dy*dy));
    
    ballPos.x += dx * dragEasing;
    ballPos.y += dy * dragEasing;
    
    currentSpeed = dist(ballPos.x, ballPos.y, mouseX, mouseY);
    headingAngle = atan2(dy, dx); 

    if (pongTrail === true && dmag>20){
      exp += (0.1/(level*level));
    }
    
    
  } else {

    // cursor(cursors[-1+level][1]);
    
    ballVel.y += gravity; 
    ballPos.add(ballVel); 
    
    currentSpeed = ballVel.mag(); 
    headingAngle = ballVel.heading(); 
    
    
    if (ballPos.x > width - ballRadius)  { ballPos.x = width - ballRadius;  ballVel.x *= bounce; }
    if (ballPos.x < ballRadius)          { ballPos.x = ballRadius;          ballVel.x *= bounce; }
    if (ballPos.y > height - ballRadius) { ballPos.y = height - ballRadius; ballVel.y *= bounce; }
    if (ballPos.y < ballRadius)          { ballPos.y = ballRadius;          ballVel.y *= bounce; }
  }
  
  if (pongTrail === true){
    if (ballVel.mag()>7){
      exp += (0.1/(level*level));
    }
    canvasLayer.stroke(ballcolor);
    canvasLayer.strokeWeight(trailWeight);
    canvasLayer.line(ballPrevPos.x, ballPrevPos.y, ballPos.x, ballPos.y);
  }
  
  ballPrevPos.set(ballPos);
  
  let stretchFactor = map(currentSpeed, 0, 30, 0, ballRadius * 1.1);
  stretchFactor = constrain(stretchFactor, 0, ballRadius * 1.1);
  
  let w = (ballRadius * 2) + stretchFactor; 
  let h = (ballRadius * 2) - stretchFactor; 
  
  push(); 
  translate(ballPos.x, ballPos.y); 
  rotate(headingAngle);
  fill(ballcolor);
  ellipse(0, 0, w, h); 
  strokeWeight(10);
  pop(); 

  

  if (showColorWheel) {
      
    colorMode(HSB, 360, 100, 100);
    noStroke();
  

    push();
    imageMode(CENTER);
    image(color_wheel, width / 2, height / 2);
    pop();

  
    
    let distance = dist(ballPos.x, ballPos.y, wheelX, wheelY);
    if (distance < wheelRadius*6) {
      let currentAngle = atan2(ballPos.y - wheelY, ballPos.x - wheelX);
      if (currentAngle < 0) currentAngle += TWO_PI; 
      
      currentHue = map(currentAngle, 0, TWO_PI, 0, 360);
      
      ballcolor = color(currentHue, currentSatu, currentValue);
    }
    colorMode(RGB);
   
  }else if (showValueWheel){

    colorMode(HSB, 360, 100, 100);
    noStroke();
    
    push();
    imageMode(CENTER);
    image(value_wheel, width / 2, height / 2);
    pop();

    let distance = dist(ballPos.x, ballPos.y, wheelX, wheelY);
    if (distance < wheelRadius*6) {
      
      let currentAngle = atan2(ballPos.y - wheelY, ballPos.x - wheelX);
      if (currentAngle < 0) currentAngle += TWO_PI; 
      
      currentValue= map(currentAngle, 0, TWO_PI, 0, 100);
      
      ballcolor = color(currentHue, currentSatu, currentValue);
    }
    colorMode(RGB);

  }
  
  if (exp > 100){
    level += 1;
    exp = 0;
  }
}



window.mousePressed = function() {

  isDraggingBall = true;
  ballVel.set(0, 0); 

  wheel_deploy_x = mouseX;
  wheel_deploy_y = mouseY;  
}  


window.mouseReleased =function() {

  if (isDraggingBall) {
    isDraggingBall = false;
    
    ballVel.x = (mouseX - ballHistory[0][0])/(ballHistory.length);
    ballVel.y = (mouseY - ballHistory[0][1])/(ballHistory.length);
  }
}


window.keyPressed = function() {
  let k = key.toLowerCase();
  
  if (k === ' '){
    if(pongTrail === false){
      pongTrail = true;
    } else{
      pongTrail = false;
    }
  }

  if (k === 's'){
    saveCanvas();
  }
  
  if (k === 'x') {
    canvasLayer.filter(INVERT);
    ballcolor = 255 - ballcolor;
  }
  
  if (k === 'c') {
    canvasLayer.background(255); 
  }
  
  if (key === 'q') {
    trailWeight -= 2;
    ballRadius -= 1; 
  }

  if (key === 'e') {
    trailWeight += 2;
    ballRadius +=1; 
  }

  if (key.toLowerCase() === 't') {
    uiElement.addClass('visible');
    document.querySelector('.onetime').textContent = '';
    return false; 
  }

  if (k === '1') {
    showColorWheel = true;
    wheelX = displayWidth/2; 
    wheelY = displayHeight/2;
  }

  if (k === '2') {
    showValueWheel = true;
    wheelX = displayWidth/2; 
    wheelY = displayHeight/2;
  }

  if (k === '3') {
    showSatuWheel = true;
    wheelX = displayWidth/2; 
    wheelY = displayHeight/2;
  }

}

window.keyReleased = function() {
  if (key.toLowerCase() === 't') {
    uiElement.removeClass('visible');
    return false;
  }

  if (key.toLowerCase() === '1') {
    showColorWheel = false;
  }

  if (key.toLowerCase() === '2') {
    showValueWheel = false;
   
  }

  if (key.toLowerCase() === '3') {
    showSatuWheel = false;
  }
}

new p5();
