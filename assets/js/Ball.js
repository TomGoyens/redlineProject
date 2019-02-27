class Ball {
  var x = 0;
  var y = 0;
  var vx = 0;
  var vy = 0;
  var ax = 0;
  var ay = 0;
  var r = 10;
  var m = 1;
  var Ekx;
  var Ux;
  var Ex;
  var Eky;
  var Uy;
  var Ey;
  var bounceLoss = 0.5;
  constructor() {

  }

  boundCheck(PlayArea){
    if (this.y > PlayArea.height - this.y) {
      this.y -= 2 * (this.y + this.y - PlayArea.height);
      this.vy = -Math.sqrt(2 * (this.Ey - calcU(this.y, g, this.m)) / this.m)*bounceLoss;
    }
    if (this.y < this.y) {
      this.y = -1 * this.y + 2 * this.y;
      this.vy = Math.sqrt(2 * (this.Ey - calcU(this.y, g, this.m)) / this.m)*bounceLoss;
    }
    if (this.x > PlayArea.width - this.y) {
      this.x -= 2 * (this.x + this.y - PlayArea.width);
      this.vx = -Math.sqrt(2 * (this.Ex - calcU(this.x, w, this.m)) / this.m)*bounceLoss;
    }
    if (this.x < this.y) {
      this.x = -1 * this.x + 2 * this.y;
      this.vx = Math.sqrt(2 * (this.Ex - calcU(this.x, w, this.m)) / this.m)*bounceLoss;
    }
  }
  //movement s------------------------------------------------------------
  calculatePos(dt) {
    this.x = this.x + dt * this.vx + dt * dt * this.ax / 2;
    this.y = this.y + dt * this.vy + dt * dt * this.ay / 2;
  }

  calculateV(vx, ax, dt) {
    this.vx = this.vx + dt * this.ax;
    this.vy = this.vy + dt * this.ay;
  }

  calcU(g, w, PlayArea) {
    if (g > 0) {
      this.Uy this.m * g * (PlayArea.height - this.y);
    } else {
      this.Uy this.m * g * this.y;
    }
    if (w > 0) {
      this.Ux this.m * w * (PlayArea.width - this.x);
    } else {
      this.Ux this.m * w * this.x;
    }
  }

  calcEk(v, m) {
    return 0.5 * m * v * v;
  }

  calculateEnergy1d(Ek, U) {
    return Ek + U;
  }
}
