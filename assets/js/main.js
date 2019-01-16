$( document ).ready(function() {
var g = parseFloat($('input[name=gravity]').val());
var w = parseFloat($('input[name=wind]').val());
var dt = 1;
var m = 1;
var frameDrawSpeed = 33.4;
var go = undefined;

//canvaaaaaaaaaaas--------------------------------------------------------------
//initialise canvas
var c = document.getElementById("canvas");
var cheight = 500;
var cwidth = 500;
var cball = c.getContext("2d");
var cballHeight = 20;
var bx = 250;
var by = 250;
var bvx = parseFloat($('input[name=velocityx]').val());;
var bvy = parseFloat($('input[name=velocityy]').val());;
var bax = 0;
var bay = 0;
var bfx = w;
var bfy = g;

cball.beginPath();
cball.arc(bx, by, cballHeight, 0, 2 * Math.PI);
cball.fillStyle = "red";
cball.fill();
cball.stroke();

function playCanvas(){
  //init canvas??
  var Eky;
  var Uy;
  var Ey;
  var Ekx;
  var Ux;
  var Ex;
  //calculate new position
  bfy = g;
  by = calculateY(by, bvy, bay, dt);
  bvy = calculateVy(bvy, bay, dt);
  bay = calculateAy(bay, bfy, m);
  bfx = w;
  bx = calculateY(bx, bvx, bax, dt);
  bvx = calculateVy(bvx, bax, dt);
  bax = calculateAy(bax, bfx, m);

  Eky = calcEk(bvy);
  Uy = calcU(by, g);
  Ey = calculateEnergy1d(Eky, Uy);
  Ekx = calcEk(bvx);
  Ux = calcU(bx, w);
  Ex = calculateEnergy1d(Ekx, Ux);

  console.log("x-as Energy: " + Ex + "\n");
  console.log("y-as Energy: " + Ey + "\n");
  if (by > cheight-cballHeight){
    by -= 2*(by+cballHeight-cheight);
    bvy = -Math.sqrt(2*(Ey-calcU(by,g)));
  }
  if (by < cballHeight){
    by = -1*by + 2*cballHeight;
    bvy = Math.sqrt(2*(Ey-calcU(by,g)));
  }
  if (bx > cwidth-cballHeight){
    bx -= 2*(bx+cballHeight-cwidth);
    bvx = -Math.sqrt(2*(Ex-calcU(bx,w)));
  }
  if (bx < cballHeight){
    bx = -1*bx + 2*cballHeight;
    bvx = Math.sqrt(2*(Ex-calcU(bx,w)));
  }

  //draw new position
  cball.clearRect(0, 0, cheight, cwidth);
  cball.beginPath();
  cball.arc(bx, by, cballHeight, 0, 2 * Math.PI);
  cball.fillStyle = "red";
  cball.fill();
  cball.stroke();
}


//click drag n shoot------------------------------------------------------------

function allowDrop(ev) {
  ev.preventDefault();
}


function ballshoot(event){
event.dataTransfer.setData("number", event.target.offsetX);
console.log("hoi");
if (bx-cballHeight+1 < event.offsetX && event.offsetX < bx+cballHeight+1 && by-cballHeight+1 < event.offsetY  && event.offsetY < by+cballHeight+1){
  console.log("hoi");
    var lineIndicator = c.getContext("2d");
    lineIndicator.beginPath();
    lineIndicator.moveTo(bx, by);
    lineIndicator.lineTo(event.offsetX, event.offsetY);
    lineIndicator.stroke();
}
}
c.addEventListener("drag", ballshoot);

//movement functions------------------------------------------------------------
  function calculateY(y, vy, ay, dt){
    return y + dt*vy + dt*dt*ay/2;
  }
  function calculateX(x, vx, ax, dt){
    return x + dt*vx + dt*dt*ax/2;
  }
  function calculateVy(vy, ay, dt){
    return vy + dt*ay;
  }
  function calculateVx(vx, ax, dt){
    return vx + dt*ax;
  }
  function calculateAy(ay, fy, m){
    return fy/m;
  }
  function calculateAx(ay, fx, m){
    return fx/m;
  }

  function calcU(c, f){
    if (f > 0){
      return m*f*(cheight-c);
    } else {
      return m*-f*c;
    }
  }
  function calcEk(cv){
    return 0.5*m*cv*cv;
  }

  function calculateEnergy1d(Ek, U){
    return  Ek+U;
  }
//pausing and stuff-------------------------------------------------------------
  function pause(){
    if (go != undefined) {
      clearInterval(go);
      go = undefined;
   } else {
     go = setInterval(playCanvas, frameDrawSpeed);
   }
  }
  function keyevent(event){
    switch (event.keyCode){
      case 32:
        pause();
        break;
    }
  }
  function changeForce(){
    g = parseFloat($('input[name=gravity]').val());
    w = parseFloat($('input[name=wind]').val());
  }
  function setVelocity(){
    bvx = parseFloat($('input[name=velocityx]').val());;
    bvy = parseFloat($('input[name=velocityy]').val());;
  }
  function reset(){
    bx = 250;
    by = 250;
    bvx = parseFloat($('input[name=velocityx]').val());;
    bvy = parseFloat($('input[name=velocityy]').val());;
    bax = 0;
    bay = 0;
    bfx = w;
    bfy = g;
  }

  $('#setVelocity').click(setVelocity)
  $('#change').click(changeForce);
  $('#pause').click(pause);
  $('#reset').click(reset);
  window.addEventListener("keydown", keyevent);

/*
  function forceMeter(ev){
    console.log('hey')
    x = ev.clientX;
    y = ev.clientY;
    console.log(x,y);
  }

  document.querySelector('.ball').addEventListener('drag', forceMeter);*/
});
