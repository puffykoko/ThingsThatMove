//globals
var   canvas = document.querySelector('canvas'),
         ctx = canvas.getContext('2d');

var ball = null;
var box = null;
var direction = 0;
var ground = canvas.height - 100;
var gravity = .25;
var maxSpeed = 10;

//requestAnimationFrame with CSS vendor prefixes
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame   ||
  window.mozRequestAnimationFrame      ||
  function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();

function Ball(){
  this.radius = 15;
  this.vx = 0;
  this.vy = 0;
  this.x = canvas.width/4;
  this.y = ground-this.radius;
}

function Box(){
  this.width = 100;
  this.height = 100;
  this.x = canvas.width/2 - this.width/2;
  this.y = ground- this.height;
  this.vx = 0;
}

function draw(){

   //clear canvas before drawing each frame
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   //draw ball
   ctx.beginPath();
   ctx.strokeStyle = '#f8c471';
   ctx.fillStyle = '#f8c471';
   ctx.arc(ball.x, ball.y, ball.radius , 0, Math.PI*2, true);
   ctx.stroke();
   ctx.fill();
   ctx.closePath();

   //draw box
   ctx.strokeStyle = 'LightSalmon';
   ctx.fillStyle = 'LightSalmon';
   ctx.fillRect(box.x , box.y , box.width, box.height);

}


function init(){
  ball = new Ball();
  box = new Box();
}

//update ball's velocity
function updateVelocity(){
  //gravity
  ball.vy += gravity;

  switch(direction) {
    case 0:
      //deccelerate when no key pressed
      ball.vx *= .95;
      break;
    case 1:
      //accelerate left
      ball.vx -= .25;
      break;
    case 2:
      //accelerate right
      ball.vx += .25;
      break;
    case 3:
      //deccelerate in x direction when up is pressed
      ball.vy -= .45;
      ball.vx *= .95;
      break;

  }
}

//update ball's position
function updatePosition(){
  ball.x += ball.vx;
  ball.y += ball.vy;
}

//sets bounds on speed of ball
function checkVelocity(){
  if (ball.vy > maxSpeed) {
    ball.vy = maxSpeed;
  }
  else if (ball.vx > maxSpeed){
    ball.vx = maxSpeed;
  }
  else if (ball.vy < -maxSpeed ){
    ball.vy = -10;
  }
  else if (ball.vx < -maxSpeed){
    ball.vx = -maxSpeed;
  }
}

//keep ball on screen
function checkPosition(){

  if (ball.x < 0 ){
    ball.x = canvas.width;
  }
  else if (ball.x > canvas.width){
    ball.x = 0;
  }
  else if (ball.y - ball.radius <= 0 ){
    ball.vy = 0;
    ball.y = ball.radius;
  }
  else if (ball.y >= ground - ball.radius){
    ball.vy *= -.5;
    ball.y = ground - ball.radius;
  }
}

//keep ball from sinking into box
function boxBounds(){

  //find distance
  var toLeft = 0;
  var toRight = 0;
  var toTop = 0;

  //from center of Ball to left side of Box
  toLeft = Math.abs(ball.x - box.x);
  //from center of Ball to right side of Box
  toRight = Math.abs(ball.x - (box.x + box.width));
  //from center of Ball to top side of Box
  toTop = Math.abs(ball.y - box.y);

  //top boundary
  if (toTop < ball.radius && ball.x > box.x - 5 && ball.x < box.x + box.width + 5){
    ball.y = box.y - ball.radius;
    ball.vy *= -.5;
  }
  //left boundary
  else if (toLeft < ball.radius && (ball.y + ball.radius > box.y)  && ball.vx > 0){
    ball.vx *= -.5;
    ball.x = box.x - ball.radius;
  }
  //right boundary
  else if (toRight < ball.radius && (ball.y + ball.radius > box.y ) && ball.vx < 0){
    ball.x = box.x + box.width + ball.radius;
    ball.vx *= -.5;
  }
  //give ball horizontal speed when rolling off corner
  else if (toLeft < ball.radius && ball.vx < 0){
    ball.vx -= .1;
  }
  else if (toRight < ball.radius && ball.vx > 0){
    ball.vx += .1;
  }

}

document.addEventListener('keydown', function(event) {

      switch(event.key){
        case 'ArrowLeft':
        direction = 1;
        break;
        case 'ArrowRight':
        direction = 2;
        break;
        case 'ArrowUp':
        direction = 3;
        break;
      }

}, true);

document.addEventListener('keyup', function(event) {
      direction = 0;
}, true);

function run(){

  var fps = 60;

  window.setTimeout(function(){
    updateVelocity();
    updatePosition();
    checkVelocity();
    checkPosition();
    boxBounds();
    draw();
    window.requestAnimFrame(run());
  }, 1000/fps);
}

init();
run();
