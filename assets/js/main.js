$(document).ready(function() {
  var g = parseFloat($('input[name=gravity]').val());
  var w = parseFloat($('input[name=wind]').val());
  var dt = 1;
  var frameDrawSpeed = 33.4;
  var go = undefined;

  //canvaaaaaaaaaaas--------------------------------------------------------------
  //initialise canvas
  var c = document.getElementById("canvas");
  var cheight = $('canvas').height();
  var cwidth = $('canvas').width();

  function Ball(posx, posy, velx, vely, accx, accy, forcex, forcey, radius, mass, kinEnergyx, kinEnergyy, potEnergyx, potEnergyy, energyx, energyy) {
  this.x = posx;
  this.y = posy;
  this.vx = velx;
  this.vy = vely;
  this.ax = accx;
  this.ay = accy;
  this.fx = forcex;
  this.fy = forcey;
  this.r = radius;
  this.m = mass;
  this.Ekx = kinEnergyx;
  this.Ux = potEnergyx;
  this.Ex = energyx;
  this.Eky = kinEnergyy;
  this.Uy = potEnergyy;
  this.Ey = energyy;
}


  var cball1 = c.getContext("2d");
  var ball1 = new Ball(250, 250, parseFloat($('input[name=velocityx]').val()), parseFloat($('input[name=velocityy]').val()), w, g, 0, 0, 20, 1, 0, 0, 0, 0, 0, 0);


  var cball2 = c.getContext("2d");
  var ball2 = new Ball(100, 250, parseFloat($('input[name=velocityx]').val()), parseFloat($('input[name=velocityy]').val()), w, g, 0, 0, 10, 0.5, 0, 0, 0, 0, 0, 0);


  var graphx = [];
  var graphy = [];
  var graphi = 0;
  var graphLimit = 100;

  cball1.beginPath();
  cball1.arc(ball1.x, ball1.y, ball1.r, 0, 2 * Math.PI);
  cball1.fillStyle = "red";
  cball1.fill();
  cball1.stroke();

  cball2.beginPath();
  cball2.arc(ball2.x, ball2.y, ball2.r, 0, 2 * Math.PI);
  cball2.fillStyle = "green";
  cball2.fill();
  cball2.stroke();

  function playCanvas() {
    //calculate new position for the balls
    ball1.y = calculatePos(ball1.y, ball1.vy, ball1.ay, dt);
    ball1.vy = calculateV(ball1.vy, ball1.ay, dt);
    ball1.ay = calculateA(ball1.ay, ball1.fy, ball1.m, g);
    ball1.x = calculatePos(ball1.x, ball1.vx, ball1.ax, dt);
    ball1.vx = calculateV(ball1.vx, ball1.ax, dt);
    ball1.ax = calculateA(ball1.ax, ball1.fx, ball1.m, w);

    ball2.y = calculatePos(ball2.y, ball2.vy, ball2.ay, dt);
    ball2.vy = calculateV(ball2.vy, ball2.ay, dt);
    ball2.ay = calculateA(ball2.ay, ball2.fy, ball2.m, g);
    ball2.x = calculatePos(ball2.x, ball2.vx, ball2.ax, dt);
    ball2.vx = calculateV(ball2.vx, ball2.ax, dt);
    ball2.ax = calculateA(ball2.ax, ball2.fx, ball2.m, w);


    // graphx[graphi] = ball1.x;
    // graphy[graphi] = ball1.y;
    // graphi += 1;

    // if (graphi >= graphLimit) {
    //   graphi = 0;
    // }
    // myChart.update();

    ball1.Eky = calcEk(ball1.vy, ball1.m);
    ball1.Uy = calcU(ball1.y, g, ball1.m);
    ball1.Ey = calculateEnergy1d(ball1.Eky, ball1.Uy);
    ball1.Ekx = calcEk(ball1.vx, ball1.m);
    ball1.Ux = calcU(ball1.x, w, ball1.m);
    ball1.Ex = calculateEnergy1d(ball1.Ekx, ball1.Ux);

    ball2.Eky = calcEk(ball2.vy, ball2.m);
    ball2.Uy = calcU(ball2.y, g, ball2.m);
    ball2.Ey = calculateEnergy1d(ball2.Eky, ball2.Uy);
    ball2.Ekx = calcEk(ball2.vx, ball2.m);
    ball2.Ux = calcU(ball2.x, w, ball2.m);
    ball2.Ex = calculateEnergy1d(ball2.Ekx, ball2.Ux);

    boundCheck(ball1);
    boundCheck(ball2);

    //draw new position
    cball1.clearRect(0, 0, cwidth, cheight);
    cball1.beginPath();
    cball1.arc(ball1.x, ball1.y, ball1.r, 0, 2 * Math.PI);
    cball1.fillStyle = "red";
    cball1.fill();
    cball1.stroke();

    cball2.beginPath();
    cball2.arc(ball2.x, ball2.y, ball2.r, 0, 2 * Math.PI);
    cball1.fillStyle = "green";
    cball2.fill();
    cball2.stroke();
  }

function boundCheck(ball){
  if (ball.y > cheight - ball.r) {
    ball.y -= 2 * (ball.y + ball.r - cheight);
    ball.vy = -Math.sqrt(2 * (ball.Ey - calcU(ball.y, g, ball.m)) / ball.m);
  }
  if (ball.y < ball.r) {
    ball.y = -1 * ball.y + 2 * ball.r;
    ball.vy = Math.sqrt(2 * (ball.Ey - calcU(ball.y, g, ball.m)) / ball.m);
  }
  if (ball.x > cwidth - ball.r) {
    ball.x -= 2 * (ball.x + ball.r - cwidth);
    ball.vx = -Math.sqrt(2 * (ball.Ex - calcU(ball.x, w, ball.m)) / ball.m);
  }
  if (ball.x < ball.r) {
    ball.x = -1 * ball.x + 2 * ball.r;
    ball.vx = Math.sqrt(2 * (ball.Ex - calcU(ball.x, w, ball.m)) / ball.m);
  }
}

  //click drag n shoot------------------------------------------------------------
/*
  function allowDrop(ev) {
    ev.preventDefault();
  }


  function ballshoot(event) {
    event.dataTransfer.setData("number", event.target.offsetX);
    console.log("hoi");
    if (bx - cballHeight + 1 < event.offsetX && event.offsetX < bx + cballHeight + 1 && by - cballHeight + 1 < event.offsetY && event.offsetY < by + cballHeight + 1) {
      console.log("hoi");
      var lineIndicator = c.getContext("2d");
      lineIndicator.beginPath();
      lineIndicator.moveTo(bx, by);
      lineIndicator.lineTo(event.offsetX, event.offsetY);
      lineIndicator.stroke();
    }
  }
  c.addEventListener("drag", ballshoot);
*/
  //movement functions------------------------------------------------------------
  function calculatePos(x, vx, ax, dt) {
    return x + dt * vx + dt * dt * ax / 2;
  }

  function calculateV(vx, ax, dt) {
    return vx + dt * ax;
  }

  function calculateA(ay, fx, m, f) {
    return (fx / m +f);
  }

  function calcU(h, f, m) {
    if (f > 0) {
      return m * f * (cheight - h);
    } else {
      return m * -f * h;
    }
  }

  function calcEk(v, m) {
    return 0.5 * m * v * v;
  }

  function calculateEnergy1d(Ek, U) {
    return Ek + U;
  }
  //pausing and stuff-------------------------------------------------------------
  function pause() {
    if (go != undefined) {
      clearInterval(go);
      go = undefined;
    } else {
      go = setInterval(playCanvas, frameDrawSpeed);
    }
  }

  function keyevent(event) {
    switch (event.keyCode) {
      case 32:
        pause();
        break;
    }
  }

  function changeForce() {
    g = parseFloat($('input[name=gravity]').val());
    w = parseFloat($('input[name=wind]').val());
  }

  function setVelocity() {
    ball1.vx = parseFloat($('input[name=velocityx]').val());;
    ball1.vy = parseFloat($('input[name=velocityy]').val());;
    ball2.vx = parseFloat($('input[name=velocityx]').val());;
    ball2.vy = parseFloat($('input[name=velocityy]').val());;
  }

  function reset() {
    ball1.x = 250;
    ball1.y = 250;
    ball1.vx = parseFloat($('input[name=velocityx]').val());;
    ball1.vy = parseFloat($('input[name=velocityy]').val());;
    ball1.ax = w;
    ball1.ay = g;
    ball1.fx = 0;
    ball1.fy = 0;
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



//   var ctx = document.getElementById("myChart").getContext('2d');
//   var myChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//       labels: ["Red"],
//       datasets: [{
//         label: 'tr',
//         data: graphx,
//         backgroundColor: [
//           'rgba(255, 99, 132, 0)'
//         ],
//         borderColor: [
//           'rgba(255,99,132,1)'
//         ],
//         borderWidth: 1
//       }]
//     },
//     options: {
//       scales: {
//         yAxes: [{
//           ticks: {
//             beginAtZero: true
//           }
//         }]
//       }
//     }
//   });
//
});
