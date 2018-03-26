
class Canvas {
  constructor() {
    const self = this;
    this.canvas = document.getElementById('canvas');
    this.canvas.addEventListener('mousemove', evt => {
      self.setMousePos(evt);
    });
    this.getCanvasSettings();
    this.ctx = this.canvas.getContext('2d');
    this.currMouse = {
      x: Math.floor(this.canvas.width/2),
      y: Math.floor(this.canvas.height/2),
    };
    this.mouseSpeed = 0;
    this.slowDown()
  }
  slowDown() {
    const self = this
    this.mouseSpeed *= 0.9;
    this.draw();
    setTimeout(() => self.slowDown(), 1000/16);
  }
  getCanvasSettings() {
    const { canvas } = this;
    var canvasW = document.body.clientWidth; //document.width is obsolete
    var canvasH = document.body.clientHeight; //document.height is obsolete
    // only set on change, setting clears the canvas and introduces jaggies
    if (canvasW !== canvas.width)
      canvas.width = canvasW;
    if (canvasH !== canvas.height)
      canvas.height = canvasH;
    return {
      canvasW: canvasW,
      canvasH: canvasH,
    }
  }
  getMousePos(evt) {
    const { canvas } = this;
    // https://stackoverflow.com/a/17130415/6461842
    var rect = canvas.getBoundingClientRect();
    var {canvasW, canvasH} = this.getCanvasSettings();
    return {
      x: Math.min(canvasW - 1 , evt.clientX - rect.left),
      y: Math.min(canvasH - 1, evt.clientY - rect.top),
    };
  }
  setMousePos(evt){
    const oldMouse = this.currMouse;
    this.currMouse = this.getMousePos(evt);
    const distance = Math.sqrt(Math.pow(oldMouse.x - this.currMouse.x, 2) + Math.pow(oldMouse.y - this.currMouse.y, 2));
    this.mouseSpeed = Math.min(2, this.mouseSpeed + distance / 50);
  }
  getDistanceFromMouse(x, y){
    const { currMouse } = this;
    return Math.sqrt(Math.pow(currMouse.x - x, 2) + Math.pow(currMouse.y - y, 2));
  }
  drawHex(edge, x, y, dx, dy, bgc) {
    const { ctx } = this
    const cx = x;
    const cy = y + dy + edge/2;
    const distance = this.getDistanceFromMouse(cx, cy);
    const detectDistance = edge * 4;
    const multiplier = this.mouseSpeed;
    const ratio = (detectDistance - distance) / detectDistance;
    if (ratio > 0){
      const coeff = 1 + (ratio * multiplier);
      edge *= coeff;
      dx *= coeff;
      dy *= coeff;
      x = cx; //doesnt change
      y = cy - dy - edge/2;
    }

    ctx.beginPath();
    let tx = x;
    let ty = y;
    ctx.moveTo(tx, ty);
    tx += dx;
    ty += dy;
    ctx.lineTo(tx, ty);
    ty += edge;
    ctx.lineTo(tx, ty);
    tx -= dx;
    ty += dy;
    ctx.lineTo(tx, ty);
    tx -= dx;
    ty -= dy;
    ctx.lineTo(tx, ty);
    ty -= edge;
    ctx.lineTo(tx, ty);
    tx += dx;
    ty -= dy;
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.fillStyle = bgc;
    ctx.fill();

    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + dx, y + dy);
    ctx.stroke();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - dx, y + dy);
    ctx.stroke();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, y + dy*2 + edge);
    ctx.stroke();
  }
  draw() {
    const { ctx } = this;
    const { canvasW, canvasH } = this.getCanvasSettings();
    const bgc = 'rgb(38,57,131)';
    ctx.fillStyle = bgc;
    ctx.fillRect(0, 0, canvasW, canvasH);
    const edge = 20;
    const dx = edge * Math.sin(Math.PI/3);
    const dy = edge * Math.cos(Math.PI/3);
    // ctx.strokeStyle = 'rgb(192, 210, 0)';
    ctx.strokeStyle = 'rgb(252, 253, 117)';
    ctx.lineWidth = 1;
    const cubeHeight = dy * 2 + edge;
    const cubeWidth = dx * 2;

    if (window.S === 1) {
      for (let x = canvasW; x > -100; x -= cubeWidth * 2) {
        for (let y = canvasH; y > -100; y -= cubeHeight) {
          this.drawHex(edge, x, y, dx, dy, bgc);
          this.drawHex(edge, x + cubeWidth, y - edge, dx, dy, bgc);
        }
      }
    } else if (window.S === 2) {
      for (let y = 0 - canvasW; y < canvasH; y += cubeHeight) {
        for (let x = 0 - dx; x < canvasW; x += cubeWidth) {
          const diagX = canvasW - x;
          const diagY = y + (edge * x / cubeWidth);
          this.drawHex(edge, diagX, diagY, dx, dy, bgc);
        }
      }
    } else {
      let flip = false;
      for (let y = 0 - cubeHeight; y < canvasH; y += cubeHeight / 2) {
        flip = !flip;
        for (let x = 0 - dx; x <= canvasW; x += cubeWidth * 2) {
          let cx = x;
          let cy = y;
          if (flip) {
            cx += dx*2;
          }
          this.drawHex(edge, cx, cy, dx, dy, bgc);
        }
      }
    }
  }
}

new Canvas().draw()
