$( document ).ready(function() {
    var $ball = $('.ball');
    var $area = $(".playArea");
    var g = 1;
    var dt = 0.1;

    var vy = 0;
    var vx = 0;
    var ay = 0;
    var ax = 0;
    var fy = g;
    var fx = 0;

    var areaHeight = $area.height();
    var areaWidth = $area.width();

    function pause(){
      if (!go){
        go = setInterval(play, 5);
      } else{
        clearInterval(go);
        go = null;
      }
    }

    $('#pause').click(pause);

    function play(){
      var y = $ball.position().top;
      var x = $ball.position().left;

      var m = 1;



      console.log(ay, vy, y);
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

    function forceMeter(ev){
      console.log('hey')
      x = ev.clientX;
      y = ev.clientY;
      console.log(x,y);
    }

    document.querySelector('.ball').addEventListener('drag', forceMeter);

    var go = setInterval(play, 5);
});
