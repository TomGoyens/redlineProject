$(document).ready(function() {
  var g = parseFloat($('input[name=gravity]').val());
  var w = parseFloat($('input[name=wind]').val());
  var dt = 1;
  var frameDrawSpeed = 17;
  var go = undefined;
  var objects = [];
  var clicked;
  var mousePos = [0, 0];

  //canvaaaaaaaaaaas--------------------------------------------------------------
  //initialise canvas
  function PlayArea(width, height){
    this.width = width;
    this.height = height;
  }
  var c = document.getElementById("canvas");
  const context = canvas.getContext('2d');
  var rect = canvas.getBoundingClientRect();
  var area = new PlayArea($('canvas').height(), $('canvas').width());

  function Ball(posx, posy, velx, vely, accx, accy, radius, mass, bounceLoss) {
    this.x = posx;
    this.y = posy;
    this.vx = velx;
    this.vy = vely;
    this.ax = accx;
    this.ay = accy;
    this.r = radius;
    this.m = mass;
    this.bounceLoss = bounceLoss;
    this.drag = 0.98;
    this.Ekx = 0;
    this.Ux = 0;
    this.Ex = 0;
    this.Eky = 0;
    this.Uy = 0;
    this.Ey = 0;
    this.image;

    this.calculateNextFrame = function(dt, PlayArea){
      this.calculatePos(dt);
      this.calculateV(dt);
      this.calcU(g, w, PlayArea);
      this.calcEk();
      this.calculateEnergy();
      this.boundCheck(PlayArea);
      this.collisionDetect();
      this.goalCheck(goal);
    }

    this.calculatePos = function(dt) {
      this.x = this.x + dt * this.vx + dt * dt * this.ax / 2;
      this.y = this.y + dt * this.vy + dt * dt * this.ay / 2;
    }

    this.calculateV = function(dt) {
      this.vx = (this.vx + dt * this.ax)*this.drag;
      this.vy = (this.vy + dt * this.ay)*this.drag;
    }

    this.calcU = function(g, w, PlayArea) {
      if (g > 0) {
        this.Uy = this.m * g * (PlayArea.height - this.y);
      } else {
        this.Uy = this.m * g * this.y;
      }
      if (w > 0) {
        this.Ux = this.m * w * (PlayArea.width - this.x);
      } else {
        this.Ux = this.m * w * this.x;
      }
    }

    this.calcEk = function() {
      this.Ekx = 0.5 * this.m * this.vx * this.vx;
      this.Eky = 0.5 * this.m * this.vy * this.vy;
    }

    this.calculateEnergy = function() {
      this.Ex = this.Ekx + this.Ux;
      this.Ey = this.Eky + this.Uy;
    }

    this.boundCheck = function(PlayArea){
      if (this.y > PlayArea.height - this.r) {
        this.y -= 2 * (this.y + this.r - PlayArea.height);
        this.calcU(g, w, PlayArea);
        this.vy = -Math.sqrt(Math.abs(2 * (this.Ey - this.Uy) / this.m))*bounceLoss;
      }
      if (this.y < this.r) {
        this.y = -1 * this.y + 2 * this.r;
        this.calcU(g, w, PlayArea);
        this.vy = Math.sqrt(Math.abs(2 * (this.Ey - this.Uy) / this.m))*bounceLoss;
      }
      if (this.x > PlayArea.width - this.r) {
        this.x -= 2 * (this.x + this.r - PlayArea.width);
        this.calcU(g, w, PlayArea);
        this.vx = -Math.sqrt(Math.abs(2 * (this.Ex - this.Uy) / this.m))*bounceLoss;
      }
      if (this.x < this.r) {
        this.x = -1 * this.x + 2 * this.r;
        this.calcU(g, w, PlayArea);
        this.vx = Math.sqrt(Math.abs(2 * (this.Ex - this.Uy) / this.m))*bounceLoss;
      }
    }
    this.goalCheck = function(goal){
      if(Math.abs(this.x-goal.x) < this.r && Math.abs(this.y-goal.y) < this.r){
        console.log("GOAAAL");
        clearInterval(go);
        go = undefined;
      }
    }

    this.drawInit = function(){
      this.image = c.getContext("2d");
    }

    this.draw = function(){
      this.image.beginPath();
      this.image.arc(ball1.x, ball1.y, ball1.r, 0, 2 * Math.PI);
      this.image.fillStyle = "red";
      this.image.fill();
      this.image.stroke();
    }

    this.collisionDetect = function(){
      for (let i = 0; i < objects.length; i++){
        //temporary shift in coordinates to adjust to wall angle (relative coordinates where wall is stood straight)
        let tempXBall = this.x*Math.cos(objects[i].angle) + this.y * Math.sin(objects[i].angle);
        let tempYBall = -this.x*Math.sin(objects[i].angle) + this.y * Math.cos(objects[i].angle);
        let tempXWall = objects[i].getCenter()[0]*Math.cos(objects[i].angle) + objects[i].getCenter()[1] * Math.sin(objects[i].angle);
        let tempYWall = -objects[i].getCenter()[0]*Math.sin(objects[i].angle) + objects[i].getCenter()[1] * Math.cos(objects[i].angle);

        let distanceX = Math.abs(tempXWall-tempXBall);
        let distanceY = Math.abs(tempYWall-tempYBall);

        if (distanceX < objects[i].getWidth()/2+this.r && distanceY < (objects[i].getHeight())/2+this.r){
          let tempVxBall = this.vx*Math.cos(objects[i].angle) + this.vy * Math.sin(objects[i].angle);
          let tempVyBall = -this.vx*Math.sin(objects[i].angle) + this.vy * Math.cos(objects[i].angle);
          if(distanceX > objects[i].getWidth()/2){
            tempVxBall *= -this.bounceLoss;
            tempVyBall *= this.bounceLoss;
            if (tempXWall-tempXBall > 0){
              tempXBall -= this.r + objects[i].getWidth()/2 -distanceX;
            } else {
              tempXBall += this.r + objects[i].getWidth()/2 -distanceX;
            }
          } else {
            tempVxBall *= this.bounceLoss;
            tempVyBall *= -this.bounceLoss;
            if (tempYWall-tempYBall > 0){
              tempYBall -= this.r + objects[i].getHeight()/2 -distanceY;
            } else {
              tempYBall += this.r + objects[i].getHeight()/2 -distanceY;
            }
          }
          this.x = tempXBall*Math.cos(objects[i].angle)-tempYBall*Math.sin(objects[i].angle);
          this.y = tempXBall*Math.sin(objects[i].angle)+tempYBall*Math.cos(objects[i].angle);
          this.vx = tempVxBall*Math.cos(objects[i].angle)-tempVyBall*Math.sin(objects[i].angle);
          this.vy = tempVxBall*Math.sin(objects[i].angle)+tempVyBall*Math.cos(objects[i].angle);
          break;
        }

      }
    }
  }

  function Wall(x1, x2, y1, y2, rad){
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.angle = rad;
    this.image;

    this.drawInit = function(){
      this.image = c.getContext("2d");
    }

    this.draw = function(){
      this.image.save();
      this.image.translate((this.x1+this.x2)/2, (this.y1+this.y2)/2);
      this.image.rotate(this.angle);
      this.image.translate(-(this.x1+this.x2)/2, -(this.y1+this.y2)/2);
      this.image.beginPath();
      this.image.moveTo(this.x1, this.y1);
      this.image.lineTo(this.x1, this.y2);
      this.image.lineTo(this.x2, this.y2);
      this.image.lineTo(this.x2, this.y1);
      this.image.lineTo(this.x1, this.y1);
      this.image.fillStyle = "brown";
      this.image.strokeStyle = "black";
      this.image.stroke();
      this.image.restore();
    }

    this.getCenter = function(){
      return [(this.x1+this.x2)/2, (this.y1+this.y2)/2];
    }
    this.getWidth = function(){
      return Math.abs(this.x1-this.x2);
    }
    this.getHeight = function(){
      return Math.abs(this.y1-this.y2);
    }
  }

  var predictionLine = {
    maxLength: 300,
    draw: function(length, rad){
      if(length > this.maxLength){
        length = this.maxLength;
      }
      var currentStart = [ball1.x-ball1.r*Math.cos(rad), ball1.y-ball1.r*Math.sin(rad)]
      var linePredict = c.getContext('2d');
      linePredict.beginPath();
      linePredict.moveTo(currentStart[0], currentStart[1]);
      // let stop = false;
      let reflectX = 1;
      let reflectY = 1;
      let bounceTime = 0;
      var currentEnd = [0,0];

      for (let i = 0; i < length; i++){

        currentEnd = [currentStart[0]-(i-bounceTime)*Math.cos(rad)*reflectX, currentStart[1]-(i-bounceTime)*Math.sin(rad)*reflectY];

        for (let j = 0; j < objects.length; j++){

          //new coordinates for object and current end based on object angle
          currentEndShift = [currentEnd[0]*Math.cos(objects[j].angle)+currentEnd[1]*Math.sin(objects[j].angle), -currentEnd[0]*Math.sin(objects[j].angle)+currentEnd[1]*Math.cos(objects[j].angle)]
          let tempXWall = objects[j].getCenter()[0]*Math.cos(objects[j].angle) + objects[j].getCenter()[1] * Math.sin(objects[j].angle);
          let tempYWall = -objects[j].getCenter()[0]*Math.sin(objects[j].angle) + objects[j].getCenter()[1] * Math.cos(objects[j].angle);

          if (currentEndShift[0] > tempXWall-objects[j].getWidth()/2 && currentEndShift[0] < tempXWall+objects[j].getWidth()/2
            && currentEndShift[1] > tempYWall-objects[j].getHeight()/2 && currentEndShift[1] < tempYWall+objects[j].getHeight()/2){
            currentStart = [currentEnd[0], currentEnd[1]];
            currentStartShift = [currentEndShift[0], currentEndShift[1]];
            bounceTime = i;
            if (currentStartShift[0]+10*Math.cos(rad) > tempXWall-objects[j].getWidth()/2
              && currentStartShift[0]+10*Math.cos(rad) < tempXWall+objects[j].getWidth()/2){
              //de straal kaatst verticaal
              reflectY *= -1;
              rad -= 2*objects[j].angle;
            } else {
              //de straal kaatst horizontaal
              reflectX *= -1;
              rad -= 2*objects[j].angle;
            }
            // stop = true;
          }

          linePredict.lineTo(currentEnd[0], currentEnd[1]);
        }
        // if (stop == true){
        //   break;
        // }
      }


      linePredict.strokeStyle = "black";
      linePredict.stroke();

      var linePredictEnd = c.getContext('2d');
      linePredictEnd.beginPath();
      linePredictEnd.moveTo(currentEnd[0], currentEnd[1]);
      linePredictEnd.lineTo(currentEnd[0]-20*Math.cos(rad)*reflectX, currentEnd[1]-20*Math.sin(rad)*reflectY);

      var gradient2 = linePredictEnd.createLinearGradient(currentEnd[0], currentEnd[1], currentEnd[0]-20*Math.cos(rad)*reflectX, currentEnd[1]-20*Math.sin(rad)*reflectY);
      gradient2.addColorStop(0, "black");
      gradient2.addColorStop(1, "white");

      linePredictEnd.strokeStyle = gradient2;
      linePredictEnd.stroke();

    }
  };

  var goal = {
    x: 550,
    y: 500,
    image : c.getContext("2d"),
    draw :function(){
      this.image.beginPath();
      this.image.arc(this.x, this.y, ball1.r+5, 0, 2 * Math.PI);
      this.image.fillStyle = "black";
      this.image.fill();
      this.image.stroke();
      }
    };
  var ball1 = new Ball(150, 500, 0, 0, w, g, 10, 1, 0.9);
  var wall1 = new Wall(0, 100, 0, 700, 0 * Math.PI / 180);
  var wall2 = new Wall(0, 700, 0, 100, 0 * Math.PI / 180);
  var wall3 = new Wall(600, 700, 0, 700, 0 * Math.PI / 180);
  var wall4 = new Wall(0, 700, 600, 700, 0 * Math.PI / 180);
  var wall5 = new Wall(0, 200, 0, 200, 135 * Math.PI / 180);
  var wall6 = new Wall(500, 700, 0, 200, 45 * Math.PI / 180);
  var wall7 = new Wall(300, 400, 300, 700, 0 * Math.PI / 180);
  objects.push(wall1);
  objects.push(wall2);
  objects.push(wall3);
  objects.push(wall4);
  objects.push(wall5);
  objects.push(wall6);
  objects.push(wall7);

  ball1.drawInit();
  ball1.draw();
  goal.draw();
  for (let i = 0; i < objects.length; i++){
    objects[i].drawInit();
    objects[i].draw();
  }

  function playCanvas() {
    //calculate new position for the balls
    ball1.calculateNextFrame(dt, area);
    //draw new position
    context.clearRect(0, 0, c.width, c.height);
    ball1.draw();
    goal.draw();
    for (let i = 0; i < objects.length; i++){
      objects[i].drawInit();
      objects[i].draw();
    }
    //COOL AROW & TRACER
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



        predictionLine.draw(3*aLength, rad);
      //Prediction line REEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
      // var linePredict = c.getContext('2d');
      //
      // var gradient2 = linePredict.createLinearGradient(ball1.x, ball1.y, ball1.x - aLength*3, ball1.y);
      // gradient2.addColorStop(0.6, "#000");
      // gradient2.addColorStop(1, "white");
      //

      // linePredict.save();
      // linePredict.translate(ball1.x, ball1.y);
      // linePredict.rotate(rad);
      // linePredict.translate(-ball1.x, -ball1.y);
      //
      // linePredict.beginPath();
      // linePredict.moveTo(ball1.x-ball1.r, ball1.y);
      // linePredict.lineTo(ball1.x-ball1.r-3*aLength, ball1.y);
      // linePredict.strokeStyle = gradient2;
      // linePredict.stroke();
      // linePredict.restore();

// //REFLECT ALONG X---------------------------------------------------------------
//       if (aLengthX > 0 && 3*aLength > (ball1.x)/Math.cos(rad)){
//
//         let pathBefore = (ball1.x)/Math.cos(rad);
//
//         startReflect = ball1.x*Math.tan(rad);
//
//         var reflect = c.getContext('2d');
//
//         var gradient2 = linePredict.createLinearGradient(-pathBefore, startReflect, 3*aLength-pathBefore, startReflect);
//         gradient2.addColorStop(0.6, "#000");
//         gradient2.addColorStop(1, "white");
//
//         reflect.save();
//         arrow.translate(0, ball1.y - startReflect);
//         reflect.rotate(-rad);
//         arrow.translate(0, -(ball1.y - startReflect));
//
//         reflect.beginPath();
//         reflect.moveTo(0, ball1.y - startReflect);
//         reflect.lineTo((3*aLength-pathBefore), ball1.y - startReflect);
//         reflect.strokeStyle = gradient2;
//         reflect.stroke();
//         reflect.restore();
//       } else if (aLengthX < 0 && 3*aLength > (area.width - ball1.x)/Math.cos(Math.PI-rad)){
//
//         let pathBefore = (area.width - ball1.x)/Math.cos(Math.PI-rad);
//
//         startReflect = (area.width - ball1.x)*Math.tan(Math.PI-rad);
//
//         var reflect = c.getContext('2d');
//
//         var gradient2 = linePredict.createLinearGradient(area.width + pathBefore, startReflect, area.width - (3*aLength-pathBefore), startReflect);
//         gradient2.addColorStop(0.6, "#000");
//         gradient2.addColorStop(1, "white");
//
//         reflect.save();
//         arrow.translate(area.width, ball1.y - startReflect);
//         reflect.rotate(Math.PI -rad);
//         arrow.translate(-area.width, -(ball1.y - startReflect));
//
//         reflect.beginPath();
//         reflect.moveTo(area.width, ball1.y - startReflect);
//         reflect.lineTo(area.width-(3*aLength-pathBefore), ball1.y - startReflect);
//         reflect.strokeStyle = gradient2;
//         reflect.stroke();
//         reflect.restore();
//       }
//       //REFLECT ALONG Y---------------------------------------------------------
//       if (aLengthY > 0 && 3*aLength > (ball1.y)/Math.sin(rad)){
//
//         let pathBefore = (ball1.y)/Math.sin(rad);
//
//         startReflect = ball1.y*Math.tan(Math.PI/2-rad);
//
//         var reflect = c.getContext('2d');
//
//         var gradient2 = linePredict.createLinearGradient(startReflect, -pathBefore, startReflect, 3*aLength-pathBefore);
//         gradient2.addColorStop(0.6, "#000");
//         gradient2.addColorStop(1, "white");
//
//         reflect.save();
//         arrow.translate(ball1.x - startReflect, 0);
//         reflect.rotate(Math.PI/2-rad);
//         arrow.translate(-(ball1.x - startReflect), 0);
//
//         reflect.beginPath();
//         reflect.moveTo(ball1.x - startReflect, 0);
//         reflect.lineTo(ball1.x - startReflect, (3*aLength-pathBefore));
//         reflect.strokeStyle = gradient2;
//         reflect.stroke();
//         reflect.restore();
//       } else if (aLengthY < 0 && 3*aLength > (area.height - ball1.y)/Math.sin(-rad)){
//
//         let pathBefore = (area.height - ball1.y)/Math.sin(-rad);
//
//         startReflect = (area.height - ball1.y)/Math.tan(rad);
//
//         var reflect = c.getContext('2d');
//
//         var gradient2 = linePredict.createLinearGradient(startReflect, area.height + pathBefore, startReflect, area.height - (3*aLength-pathBefore));
//         gradient2.addColorStop(0.6, "#000");
//         gradient2.addColorStop(1, "white");
//
//         reflect.save();
//         arrow.translate(ball1.x + startReflect, area.height);
//         reflect.rotate(-rad-Math.PI/2);
//         arrow.translate(-(ball1.x + startReflect), -area.height);
//
//         reflect.beginPath();
//         reflect.moveTo(ball1.x + startReflect, area.height);
//         reflect.lineTo(ball1.x + startReflect, area.height-(3*aLength-pathBefore));
//         reflect.strokeStyle = gradient2;
//         reflect.stroke();
//         reflect.restore();
//       }
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


  //click drag n shoot------------------------------------------------------------

  function drag(event){
    console.log("up");
    var distanceX = ball1.x-mousePos[0];
    console.log(distanceX);
    var distanceY = ball1.y-mousePos[1];
    const distance = Math.sqrt(Math.pow(distanceX,2)+Math.pow(distanceY,2));
    console.log(distanceY);
    if (distance < 100){
      ball1.vx = distanceX/4;
      ball1.vy = distanceY/4;
    } else {
      const rad = Math.atan2(distanceY, distanceX);
      ball1.vx = 25 * Math.cos(rad);
      ball1.vy = 25 * Math.sin(rad);
    }

    clicked = false;
    window.removeEventListener("mouseup", drag);
  }

  function getmousePosX(evt){
    mousePos[0] = (evt.clientX - rect.left) / (rect.right - rect.left) * c.width;
  }
  function getmousePosY(evt){
    mousePos[1] = (evt.clientY - rect.top) / (rect.bottom - rect.top) * c.height;
  }

  function ballshoot(event) {
    console.log("down");
    var distanceX = ball1.x-mousePos[0];
    var distanceY = ball1.y-mousePos[1];
    var distance = Math.sqrt(Math.pow(distanceX, 2)+Math.pow(distanceY, 2));
    if (distance<=ball1.r){
      console.log("and");
      clicked = true;
      window.addEventListener("mouseup", drag);
    }
  }
  c.addEventListener("mousedown", ballshoot);
  c.addEventListener("mousemove", getmousePosX);
  c.addEventListener("mousemove", getmousePosY);

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
    ball1.ay = parseFloat($('input[name=gravity]').val());
    ball1.ax = parseFloat($('input[name=wind]').val());
  }

  // function reset() {
  //   ball1.x = 250;
  //   ball1.y = 250;
  //   ball1.vx = parseFloat($('input[name=velocityx]').val());;
  //   ball1.vy = parseFloat($('input[name=velocityy]').val());;
  //   ball1.ax = w;
  //   ball1.ay = g;
  //   ball1.fx = 0;
  //   ball1.fy = 0;
  // }

  $('#change').click(changeForce);
  $('#pause').click(pause);
  $('#reset').click(reset);
  window.addEventListener("keydown", keyevent);

go = setInterval(playCanvas, frameDrawSpeed);
});
