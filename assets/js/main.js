$( document ).ready(function() {
var $ball = $('.ball');
var $area = $(".playArea");
var g = parseFloat($('input[name=gravity]').val());
var w = parseFloat($('input[name=wind]').val());
var dt = 1;
var m = 1;
var frameDrawSpeed = 33.4;

var areaHeight = $area.height();
var areaWidth = $area.width();


//    var go = setInterval(play, 5);
//canvaaaaaaaaaaas--------------------------------------------------------------
//initialise canvas
var c = document.getElementById("canvas");
var cball = c.getContext("2d");
var cballHeight = 20;
var cx = 250;
var cy = 100;
var cvx = 0;
var cvy = 0;
var cax = 0;
var cay = 0;
var cfx = w;
var cfy = g;
var E = parseFloat(calculateEnergy(cx, cvx, cy, cvy));
console.log(E);

cball.beginPath();
cball.arc(cx, cy, cballHeight, 0, 2 * Math.PI);
cball.fillStyle = "red";
cball.fill();
cball.stroke();

  function playCanvas(){

    g = parseFloat($('input[name=gravity]').val());
    w = parseFloat($('input[name=wind]').val());
    E = calculateEnergy(cx, cvx, cy, cvy);
    console.log(E);
    //calculate new position
    cfy = g;
    cy = calculateY(cy, cvy, cay, dt);
    cvy = calculateVy(cvy, cay, dt);
    cay = calculateAy(cay, cfy, m);
    cfx = w;
    cx = calculateY(cx, cvx, cax, dt);
    cvx = calculateVy(cvx, cax, dt);
    cax = calculateAy(cax, cfx, m);

    if (cy > 500-cballHeight){
      cy -= 2*(cy+cballHeight-500);
      cvy = -Math.sqrt(2*(E-(500-cy)));
    }
    if (cy < cballHeight){
      cy = -1*cy + 2*cballHeight;
      cvy = Math.sqrt(2*(-Math.abs(E)+(500-cy)));
    }
    if (cx > 500-cballHeight){
      cx -= 2*(cx+cballHeight-500);
      cvx = -Math.sqrt(2*(E-(500-cx)));
    }
    if (cx < cballHeight){
      cx = -1*cx + 2*cballHeight;
      cvx = Math.sqrt(2*(E-(500-cx)));
    }




    //draw new position
    cball.clearRect(0, 0, 500, 500);
    cball.beginPath();
    cball.arc(cx, cy, cballHeight, 0, 2 * Math.PI);
    cball.fillStyle = "red";
    cball.fill();
    cball.stroke();
  }

var go = setInterval(playCanvas, frameDrawSpeed);

//click drag n shoot------------------------------------------------------------

function allowDrop(ev) {
  ev.preventDefault();
}


function ballshoot(event){
event.dataTransfer.setData("number", event.target.offsetX);
console.log("hoi");
if (cx-cballHeight+1 < event.offsetX && event.offsetX < cx+cballHeight+1 && cy-cballHeight+1 < event.offsetY  && event.offsetY < cy+cballHeight+1){
  console.log("hoi");
    var lineIndicator = c.getContext("2d");
    lineIndicator.beginPath();
    lineIndicator.moveTo(cx, cy);
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
  function calculateEnergy(cx, cvx, cy, cvy){
    console.log("velocity: " + cvy +"\nhoogte: " + cy + "\n");
    Eky = 0.5*m*cvy*cvy;
    Uy = m*g*(500-cy)
    console.log("kinetic energy: " + Eky +"\npot. energie: " + Uy + "\n");
    Ey = Eky+Uy;
    Ekx = 0.5*m*cvx*cvx;
    Ux = m*w*(500-cx);
    Ex = Ekx+Ux;
    return Ey+Ex;
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
  $('#pause').click(pause);
  window.addEventListener("keydown", keyevent);

/*
  function play(){
    var y = $ball.position().top;
    var x = $ball.position().left;

    var m = 1;

    ay = calculateAy(ay, fy, m);

    vy = calculateVy(vy, ay, dt);
    y = calculateY(y, vy, ay, dt);
    ax = calculateAy(ax, fx, m);
    vx = calculateVy(vx, ax, dt);
    x = calculateY(x, vx, ax, dt);

    if (y > areaHeight-$ball.height()){
      y -= 2*(y+$ball.height()-areaHeight);
      vy = -vy;
      ay = -ay;
    }

    $ball.css('top', y);
    $ball.css('left', x);

  }


  function forceMeter(ev){
    console.log('hey')
    x = ev.clientX;
    y = ev.clientY;
    console.log(x,y);
  }

  document.querySelector('.ball').addEventListener('drag', forceMeter);*/
});
