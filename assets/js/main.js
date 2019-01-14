$( document ).ready(function() {
    var $ball = $('.ball');
    var $area = $(".playArea");
    var g = 1;
    var dt = 1;

    var vy = 0;
    var vx = 0;
    var ay = 0;
    var ax = 0;
    var fy = g;
    var fx = 0;

    var areaHeight = $area.height();
    var areaWidth = $area.width();

    function pause(){
      console.log(requestId);
      if (requestId == undefined) {
        requestId = window.requestAnimationFrame(playCanvas);
     } else {
       window.cancelAnimationFrame(requestId);
       requestId = undefined;
     }
    }

    $('#pause').click(pause);

//    var go = setInterval(play, 5);
//canvaaaaaaaaaaas--------------------------------------------------------------
//initialise canvas
  var c = document.getElementById("canvas");
  var cball = c.getContext("2d");
  var cballHeight = 20;
  var cx = 250;
  var cy = 0;
  var cvx = 0;
  var cvy = 0;
  var cax = 0;
  var cay = 0;
  var cfx = 0;
  var cfy = g;

  cball.beginPath();
  cball.arc(cx, cy, cballHeight, 0, 2 * Math.PI);
  cball.fillStyle = "red";
  cball.fill();
  cball.stroke();

    function playCanvas(){
      var m = 1;
      //calculate new position
      cay = calculateAy(cay, cfy, m);

      cvy = calculateVy(cvy, cay, dt);
      cy = calculateY(cy, cvy, cay, dt);
      cax = calculateAy(cax, cfx, m);
      cvx = calculateVy(cvx, cax, dt);
      cx = calculateY(cx, cvx, cax, dt);

      if (cy > 500-cballHeight){
        cy -= 2*(cy+cballHeight-500);
        cvy = -cvy;
        cay = -cay;
      }

      //draw new position
      cball.clearRect(0, 0, 500, 500);
      cball.beginPath();
      cball.arc(cx, cy, cballHeight, 0, 2 * Math.PI);
      cball.fillStyle = "red";
      cball.fill();
      cball.stroke();

      requestId = requestAnimationFrame(playCanvas);
    }

var requestId = requestAnimationFrame(playCanvas);

//var go2 = setInterval(playCanvas, 5);

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
