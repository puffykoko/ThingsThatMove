var   canvas = document.querySelector('canvas'),
         ctx = canvas.getContext('2d');

//astronaut
var astronaut = null;
var img = document.getElementById('myAstronaut');
var imgWidth = canvas.width/15;
var imgHeight = imgWidth*1.5;
var direction = 0;

//bubbles
var bubbles = [];
var numBubbles = 5;
var colors = ['#f8c471', '#5dade2', '#e74c3c', '#ff33fc'];

//requestAnimationFrame with CSS vendor prefixes
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame   ||
  window.mozRequestAnimationFrame      ||
  function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();

function Projectile(){
  this.x = canvas.width/2 - imgWidth/2;
  this.y = canvas.height-150;
  this.vx = 0;
  this.vy = 0;
}

function draw(){

   //clear canvas before drawing each frame
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   //draw astronaut
   ctx.drawImage(img, astronaut.x, astronaut.y, imgWidth, imgHeight);

  //randomly reset bubbles
   if (direction != 0){
    for (var i = 0; i < numBubbles; i++){
      if (Math.random() < .5) {
         bubbles[i].y = astronaut.y + imgHeight + 5;
         bubbles[i].x = astronaut.x + imgWidth/2 + (Math.random()*10 - 5);
         bubbles[i].radius = Math.random()*imgWidth/10;
         bubbles[i].vy = 10;
        }
      }
    }

  //shoot bubbles
  for (var  i = 0; i < numBubbles; i++){
    if (bubbles[i].vy >= 0){
      ctx.beginPath();
      ctx.strokeStyle = colors[i%colors.length];
      ctx.fillStyle = colors[i%colors.length];
      ctx.arc(bubbles[i].x, bubbles[i].y, bubbles[i].radius, 0, Math.PI*2, true);
      bubbles[i].vy -= 1;
      bubbles[i].y += bubbles[i].vy;
      ctx.stroke();
      ctx.fill();
      ctx.closePath();
   }
 }

}

function init(){
  astronaut = new Projectile();

  for (var i = 0; i < numBubbles; i++){
    bubbles.push(new Projectile());
  }

}

function updateVelocity(){
  //gravity
  astronaut.vy += .25;

  switch(direction) {
    case 0:
      //deccelerate when no key pressed
      astronaut.vx *= .95;
      break;
    case 1:
      //accelerate left
      astronaut.vx -= .25;
      break;
    case 2:
      //accelerate right
      astronaut.vx += .25;
      break;
    case 3:
      //deccelerate in x direction when up is pressed
      astronaut.vy -= .45;
      astronaut.vx *= .95;
      break;

  }
}

function updatePosition(){
  astronaut.x += astronaut.vx;
  astronaut.y += astronaut.vy;
}

function checkVelocity(){
  if (astronaut.vy > 30) {
    astronaut.vy = 30;
  }
  else if (astronaut.vx > 12){
    astronaut.vx = 12;
  }
  else if (astronaut.vy < -12 ){
    astronaut.vy = -12;
  }
  else if (astronaut.vx < -12){
    astronaut.vx = -12;
  }
}

function checkPosition(){

  if (astronaut.x < -15 ){
    astronaut.x = canvas.width - 20;
  }
  else if (astronaut.x > canvas.width - 20){
    astronaut.x = -15;
  }
  else if (astronaut.y <= -10 ){
    astronaut.vy = 0;
    astronaut.y = -10;
  }
  else if (astronaut.y >= canvas.height - 150){
    astronaut.vy *= -.5;
    astronaut.y = canvas.height - 150;
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
    draw();
    window.requestAnimFrame(run());
  }, 1000/fps);
}

init();
run();
