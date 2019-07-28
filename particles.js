var   canvas = document.querySelector('canvas'),
         ctx = canvas.getContext('2d');

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame   ||
  window.mozRequestAnimationFrame      ||
  function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();

var colors = ['#f8c471', '#5dade2', '#e74c3c', '#ff33fc'];
var particles = [];
var numParticles = 200;
var gravity = .25;

function Particle(){
  this.x = Math.random() * 1000;
  this.y = Math.random() * 100 - Math.random() * 200;
  this.radius = Math.random() * 5;
  this.vy = 0;
  this.vx = Math.random() - .5;
}

function init(){
  for (var i = 0; i < numParticles; i++){
    particles.push(new Particle());
  }
}

function draw(){

  //clear canvas before drawing each frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < numParticles; i++){

    //check bounds
    if (particles[i].y > 500){
      particles[i].y = 500;
      particles[i].vy *=  -(particles[i].radius/6);
    }

    particles[i].vx *= .99;
    particles[i].vy += gravity;

    //move
    particles[i].y += particles[i].vy;
    particles[i].x += particles[i].vx;

    //draw
    ctx.beginPath();
    ctx.arc(particles[i].x, particles[i].y, particles[i].radius, 0, Math.PI*2, true);
    ctx.strokeStyle = colors[i%colors.length];
    ctx.fillStyle = colors[i%colors.length];
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }
}

function run(){

  var fps = 60;

  window.setTimeout(function(){
    draw();
    window.requestAnimFrame(run());
  }, 1000/fps);
}

init();
run();
