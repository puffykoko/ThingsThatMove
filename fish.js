const fish = document.querySelectorAll('.fish');

for (var i = 0; i < fish.length; i++) {
  var time = Math.random()*50;
  fish[i].style.setProperty('--animation-delay', time +'s');
}
