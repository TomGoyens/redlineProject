$(document).ready(function() {
  var g = parseFloat($('input[name=gravity]').val());
  var w = parseFloat($('input[name=wind]').val());
  var dt = 1;
  var frameDrawSpeed = 33.4;
  var go = undefined;
  var objects = [];
  var clicked;
  var mousePos = [0, 0];

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
  objects.push(ball1);

  // var cball2 = c.getContext("2d");
  // var ball2 = new Ball(300, 245, parseFloat($('input[name=velocityx]').val()), parseFloat($('input[name=velocityy]').val()), w, g, 0, 0, 20, 1, 0, 0, 0, 0, 0, 0);
  // objects.push(ball2);

  var graphx = [];
  var graphy = [];
  var graphi = 0;
  var graphLimit = 100;

  cball1.beginPath();
  cball1.arc(ball1.x, ball1.y, ball1.r, 0, 2 * Math.PI);
  cball1.fillStyle = "red";
  cball1.fill();
  cball1.stroke();

  // cball2.beginPath();
  // cball2.arc(ball2.x, ball2.y, ball2.r, 0, 2 * Math.PI);
  // cball2.fillStyle = "green";
  // cball2.fill();
  // cball2.stroke();


  function playCanvas() {
    //calculate new position for the balls
    ball1.y = calculatePos(ball1.y, ball1.vy, ball1.ay, dt);
    ball1.vy = calculateV(ball1.vy, ball1.ay, dt);
    ball1.ay = calculateA(ball1.ay, ball1.fy, ball1.m, g);
    ball1.x = calculatePos(ball1.x, ball1.vx, ball1.ax, dt);
    ball1.vx = calculateV(ball1.vx, ball1.ax, dt);
    ball1.ax = calculateA(ball1.ax, ball1.fx, ball1.m, w);

    if (Math.sqrt(Math.pow(ball1.vx, 2)+Math.pow(ball1.vy, 2))>0.1){
      ball1.vx *= 0.95;
      ball1.vy *= 0.95;
    } else {
      ball1.vx = 0;
    }

    // ball2.y = calculatePos(ball2.y, ball2.vy, ball2.ay, dt);
    // ball2.vy = calculateV(ball2.vy, ball2.ay, dt);
    // ball2.ay = calculateA(ball2.ay, ball2.fy, ball2.m, g);
    // ball2.x = calculatePos(ball2.x, ball2.vx, ball2.ax, dt);
    // ball2.vx = calculateV(ball2.vx, ball2.ax, dt);
    // ball2.ax = calculateA(ball2.ax, ball2.fx, ball2.m, w);


    ball1.Eky = calcEk(ball1.vy, ball1.m);
    ball1.Uy = calcU(ball1.y, g, ball1.m);
    ball1.Ey = calculateEnergy1d(ball1.Eky, ball1.Uy);
    ball1.Ekx = calcEk(ball1.vx, ball1.m);
    ball1.Ux = calcU(ball1.x, w, ball1.m);
    ball1.Ex = calculateEnergy1d(ball1.Ekx, ball1.Ux);

    // ball2.Eky = calcEk(ball2.vy, ball2.m);
    // ball2.Uy = calcU(ball2.y, g, ball2.m);
    // ball2.Ey = calculateEnergy1d(ball2.Eky, ball2.Uy);
    // ball2.Ekx = calcEk(ball2.vx, ball2.m);
    // ball2.Ux = calcU(ball2.x, w, ball2.m);
    // ball2.Ex = calculateEnergy1d(ball2.Ekx, ball2.Ux);

    boundCheck(ball1, 0.50);
    // boundCheck(ball2);
    // collisionDetectBalls();
    // console.log(ball1.Ex, ball2.Ex);
    // console.log(ball1.Ex+ ball2.Ex);
    // console.log(ball1.Ey, ball2.Ey);
    // console.log(ball1.Ey+ ball2.Ey);

    //draw new position
    cball1.clearRect(0, 0, cwidth, cheight);
    cball1.beginPath();
    cball1.arc(ball1.x, ball1.y, ball1.r, 0, 2 * Math.PI);
    cball1.fillStyle = "red";
    cball1.fill();
    cball1.stroke();



    if(clicked == true){
      var aLengthX = mousePos[0]-3 - ball1.x;
      var aLengthY = mousePos[1]-2 - ball1.y;

      var aLength = Math.sqrt(Math.pow(aLengthX, 2) + Math.pow(aLengthY, 2)) - ball1.r;

      if (aLength > 100){
        aLength = 100;
      }
      if (aLength < 0){
        aLength = 0;
      }

      var arrow = c.getContext('2d');
      var gradient = arrow.createLinearGradient(ball1.x, ball1.y, ball1.x + 100, ball1.y + 100);
      gradient.addColorStop(0.2, "green");
      gradient.addColorStop(0.6, "red");

      arrow.save();
      arrow.translate(ball1.x, ball1.y);

      var rad = Math.atan2(aLengthY, aLengthX);
      arrow.rotate(rad);

      arrow.translate(-ball1.x, -ball1.y);

      arrow.beginPath();
      arrow.moveTo(ball1.x+ball1.r, ball1.y);
      arrow.lineTo(ball1.x+ball1.r+aLength/2, ball1.y+20);
      arrow.lineTo(ball1.x+ball1.r+aLength/2, ball1.y+5);
      arrow.lineTo(ball1.x+ball1.r+aLength, ball1.y+5);
      arrow.lineTo(ball1.x+ball1.r+aLength, ball1.y-5);
      arrow.lineTo(ball1.x+ball1.r+aLength/2, ball1.y-5);
      arrow.lineTo(ball1.x+ball1.r+aLength/2, ball1.y-20);
      arrow.fillStyle = gradient;
      arrow.fill();
      arrow.restore();




      var linePredict = c.getContext('2d');

      var gradient2 = linePredict.createLinearGradient(ball1.x, ball1.y, ball1.x - aLength*3, ball1.y);
      gradient2.addColorStop(0.6, "#000");
      gradient2.addColorStop(1, "white");

      linePredict.save();
      arrow.translate(ball1.x, ball1.y);
      linePredict.rotate(rad);
      arrow.translate(-ball1.x, -ball1.y);

      linePredict.beginPath();
      linePredict.moveTo(ball1.x-ball1.r, ball1.y);
      linePredict.lineTo(ball1.x-ball1.r-3*aLength, ball1.y);
      linePredict.strokeStyle = gradient2;
      linePredict.stroke();
      linePredict.restore();

//REFLECT ALONG X---------------------------------------------------------------
      if (aLengthX > 0 && 3*aLength > (ball1.x)/Math.cos(rad)){

        let pathBefore = (ball1.x)/Math.cos(rad);

        startReflect = ball1.x*Math.tan(rad);

        var reflect = c.getContext('2d');

        var gradient2 = linePredict.createLinearGradient(-pathBefore, startReflect, 3*aLength-pathBefore, startReflect);
        gradient2.addColorStop(0.6, "#000");
        gradient2.addColorStop(1, "white");

        reflect.save();
        arrow.translate(0, ball1.y - startReflect);
        reflect.rotate(-rad);
        arrow.translate(0, -(ball1.y - startReflect));

        reflect.beginPath();
        reflect.moveTo(0, ball1.y - startReflect);
        reflect.lineTo((3*aLength-pathBefore), ball1.y - startReflect);
        reflect.strokeStyle = gradient2;
        reflect.stroke();
        reflect.restore();
      } else if (aLengthX < 0 && 3*aLength > (cwidth - ball1.x)/Math.cos(Math.PI-rad)){

        let pathBefore = (cwidth - ball1.x)/Math.cos(Math.PI-rad);

        startReflect = (cwidth - ball1.x)*Math.tan(Math.PI-rad);

        var reflect = c.getContext('2d');

        var gradient2 = linePredict.createLinearGradient(cwidth + pathBefore, startReflect, cwidth - (3*aLength-pathBefore), startReflect);
        gradient2.addColorStop(0.6, "#000");
        gradient2.addColorStop(1, "white");

        reflect.save();
        arrow.translate(cwidth, ball1.y - startReflect);
        reflect.rotate(Math.PI -rad);
        arrow.translate(-cwidth, -(ball1.y - startReflect));

        reflect.beginPath();
        reflect.moveTo(cwidth, ball1.y - startReflect);
        reflect.lineTo(cwidth-(3*aLength-pathBefore), ball1.y - startReflect);
        reflect.strokeStyle = gradient2;
        reflect.stroke();
        reflect.restore();
      }
      //REFLECT ALONG Y---------------------------------------------------------
      if (aLengthY > 0 && 3*aLength > (ball1.y)/Math.sin(rad)){

        let pathBefore = (ball1.y)/Math.sin(rad);

        startReflect = ball1.y*Math.tan(Math.PI/2-rad);

        var reflect = c.getContext('2d');

        var gradient2 = linePredict.createLinearGradient(startReflect, -pathBefore, startReflect, 3*aLength-pathBefore);
        gradient2.addColorStop(0.6, "#000");
        gradient2.addColorStop(1, "white");

        reflect.save();
        arrow.translate(ball1.x - startReflect, 0);
        reflect.rotate(Math.PI/2-rad);
        arrow.translate(-(ball1.x - startReflect), 0);

        reflect.beginPath();
        reflect.moveTo(ball1.x - startReflect, 0);
        reflect.lineTo(ball1.x - startReflect, (3*aLength-pathBefore));
        reflect.strokeStyle = gradient2;
        reflect.stroke();
        reflect.restore();
      } else if (aLengthY < 0 && 3*aLength > (cheight - ball1.y)/Math.sin(-rad)){

        let pathBefore = (cheight - ball1.y)/Math.sin(-rad);

        startReflect = (cheight - ball1.y)/Math.tan(rad);

        var reflect = c.getContext('2d');

        var gradient2 = linePredict.createLinearGradient(startReflect, cheight + pathBefore, startReflect, cheight - (3*aLength-pathBefore));
        gradient2.addColorStop(0.6, "#000");
        gradient2.addColorStop(1, "white");

        reflect.save();
        arrow.translate(ball1.x + startReflect, cheight);
        reflect.rotate(-rad-Math.PI/2);
        arrow.translate(-(ball1.x + startReflect), -cheight);

        reflect.beginPath();
        reflect.moveTo(ball1.x + startReflect, cheight);
        reflect.lineTo(ball1.x + startReflect, cheight-(3*aLength-pathBefore));
        reflect.strokeStyle = gradient2;
        reflect.stroke();
        reflect.restore();
      }
    }

    // cball2.beginPath();
    // cball2.arc(ball2.x, ball2.y, ball2.r, 0, 2 * Math.PI);
    // cball1.fillStyle = "green";
    // cball2.fill();
    // cball2.stroke();
  }

function boundCheck(ball, loss){
  if (ball.y > cheight - ball.r) {
    ball.y -= 2 * (ball.y + ball.r - cheight);
    ball.vy = -Math.sqrt(2 * (ball.Ey - calcU(ball.y, g, ball.m)) / ball.m)*loss;
  }
  if (ball.y < ball.r) {
    ball.y = -1 * ball.y + 2 * ball.r;
    ball.vy = Math.sqrt(2 * (ball.Ey - calcU(ball.y, g, ball.m)) / ball.m)*loss;
  }
  if (ball.x > cwidth - ball.r) {
    ball.x -= 2 * (ball.x + ball.r - cwidth);
    ball.vx = -Math.sqrt(2 * (ball.Ex - calcU(ball.x, w, ball.m)) / ball.m)*loss;
  }
  if (ball.x < ball.r) {
    ball.x = -1 * ball.x + 2 * ball.r;
    ball.vx = Math.sqrt(2 * (ball.Ex - calcU(ball.x, w, ball.m)) / ball.m)*loss;
  }
}

// function collisionDetectBalls(){
//   let yIntersect = false;
//   let xIntersect = false;
//   for (var i = 0; i < objects.length; i++){
//     for(var j = i+1; j < objects.length; j++){
//       let distance = Math.sqrt(Math.pow(ball1.x-ball2.x, 2) + Math.pow(ball1.y-ball2.y, 2));
//       if (distance < objects[i].r+objects[j].r){
//         collision(objects[i], objects[j]);
//       }
//     }
//   }
// }

// function collision(ball1, ball2){
//
//
//
//   let distance = Math.sqrt(Math.pow(ball1.x-ball2.x, 2) + Math.pow(ball1.y-ball2.y, 2));
//   let overlap = ball1.r+ball2.r-distance;
//   let cosAngle = Math.abs(ball1.x-ball2.x)/distance;
//   let sinAngle = Math.abs(ball1.y-ball2.y)/distance;
//
// }

  //click drag n shoot------------------------------------------------------------

  function drag(event){
    console.log("up");
    var clickX = event.layerX-3;
    var clickY = event.layerY-2;
    var distanceX = ball1.x-event.layerX-3;
    var distanceY = ball1.y-event.layerY-2;
    if (distanceX < 100){
      ball1.vx = distanceX/4;
    } else {
      ball1.vx = 25;
    }
    if (distanceY < 100){
      ball1.vy = distanceY/4;
    } else {
      ball1.vy = 25;
    }

    clicked = false;
    c.removeEventListener("mouseup", drag);
  }

  function getmousePosX(event){
    mousePos[0] = event.layerX;
  }
  function getmousePosY(event){
    mousePos[1] = event.layerY;
  }

  function ballshoot(event) {
    console.log("down");
    var clickX = event.layerX-3;
    var clickY = event.layerY-2;
    var distanceX = ball1.x-event.layerX-3;
    var distanceY = ball1.y-event.layerY-2;
    var distance = Math.sqrt(Math.pow(distanceX, 2)+Math.pow(distanceY, 2));
    if (distance<=ball1.r){
      console.log("and");
      clicked = true;
      c.addEventListener("mouseup", drag);
    }
  }
  c.addEventListener("mousedown", ballshoot);
  c.addEventListener("mousemove", getmousePosX);
  c.addEventListener("mousemove", getmousePosY);

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


});
