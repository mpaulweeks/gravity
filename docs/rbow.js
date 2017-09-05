
function NewRainbow(){
  // https://krazydad.com/tutorials/makecolors.php
  function byte2Hex(n)
  {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
  }
  function RGB2Color(r,g,b){
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
  }
  function makeColorGradient(frequency1, frequency2, frequency3,
                             phase1, phase2, phase3,
                             i){
    var center = 128;
    var width = 127;
    var red = Math.sin(frequency1*i + phase1) * width + center;
    var grn = Math.sin(frequency2*i + phase2) * width + center;
    var blu = Math.sin(frequency3*i + phase3) * width + center;
    return RGB2Color(red,grn,blu);
  }

  var self = {};
  self.freq = 0.2;
  self.gradientDelta = 8;
  self.stepFreq = 5; // 5 for circles, 20 for triangles
  self.counter = 0;

  function getAtStep(step){
    return makeColorGradient(self.freq, self.freq, self.freq, 0, 2, 4, step);
  }

  function getGradientAtStep(step, delta){
    return [
      getAtStep(step),
      getAtStep(step+delta),
    ];
  }

  function nextGradient(bonus){
    bonus = bonus || 0;
    var step = Math.floor(self.counter / self.stepFreq);
    return getGradientAtStep(step + bonus, self.gradientDelta);
  }
  self.nextGradient = nextGradient;

  function step(){
    self.counter = (self.counter + 1) % 1000000;
  }
  self.step = step;

  return self;
};

function NewCanvas(){
  // https://stackoverflow.com/a/4037426/6461842
  var canvas = document.getElementById('canvas');
  canvas.width = document.body.clientWidth; //document.width is obsolete
  canvas.height = document.body.clientHeight; //document.height is obsolete
  canvasW = canvas.width;
  canvasH = canvas.height;
  var maxLength = canvasW > canvasH ? canvasW : canvasH;
  var ctx = canvas.getContext('2d');
  var currMouse = {
    x: Math.floor(canvasW/2),
    y: Math.floor(canvasH/2),
  };

  function getMousePos(evt) {
    // https://stackoverflow.com/a/17130415/6461842
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  document.onmousemove = function (e) {
    currMouse = getMousePos(e);
  };

  function drawCircle(gradientModifier){
    var gradient = ctx.createRadialGradient(currMouse.x, currMouse.y, 0, currMouse.x, currMouse.y, maxLength);
    gradientModifier(gradient);
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,canvasW,canvasH);
  }

  function drawTriangles(gradientModifier){
    var x = currMouse.x;
    var y = currMouse.y;
    var gradient;

    gradient = ctx.createLinearGradient(0, 0, x, 0);
    gradientModifier(gradient);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(x, y);
    ctx.lineTo(0, canvasH);
    ctx.closePath();
    ctx.fill();

    gradient = ctx.createLinearGradient(canvasW, 0, x, 0);
    gradientModifier(gradient);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(canvasW, 0);
    ctx.lineTo(x, y);
    ctx.lineTo(canvasW, canvasH);
    ctx.closePath();
    ctx.fill();

    gradient = ctx.createLinearGradient(0, 0, 0, y);
    gradientModifier(gradient);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(x, y);
    ctx.lineTo(canvasW, 0);
    ctx.closePath();
    ctx.fill();

    gradient = ctx.createLinearGradient(0, canvasH, 0, y);
    gradientModifier(gradient);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, canvasH);
    ctx.lineTo(x, y);
    ctx.lineTo(canvasW, canvasH);
    ctx.closePath();
    ctx.fill();
  }

  function dangleSpikes(gm1, gm2){
    var x = currMouse.x;
    var y = currMouse.y;
    var g1 = gm1(ctx.createRadialGradient(currMouse.x, currMouse.y, 0, currMouse.x, currMouse.y, maxLength));
    var g2 = gm2(ctx.createRadialGradient(currMouse.x, currMouse.y, 0, currMouse.x, currMouse.y, maxLength));

    [g1, g2].forEach(function (grad, gi){
      ctx.fillStyle = grad;

      var xchunk = Math.floor(canvasW/2);
      var ychunk = Math.floor(canvasH/2);

      ctx.beginPath();
      ctx.moveTo(0, (gi + 0) * ychunk);
      ctx.lineTo(x, y);
      ctx.lineTo(0, (gi + 1) * ychunk);
      ctx.closePath();
      ctx.fill();
    });
  }

  function drawSpikes(gm1, gm2, gm3){
    var x = currMouse.x;
    var y = currMouse.y;
    var g1 = gm1(ctx.createRadialGradient(currMouse.x, currMouse.y, 0, currMouse.x, currMouse.y, maxLength));
    var g2 = gm2(ctx.createRadialGradient(currMouse.x, currMouse.y, 0, currMouse.x, currMouse.y, maxLength));
    var g3 = gm3(ctx.createRadialGradient(currMouse.x, currMouse.y, 0, currMouse.x, currMouse.y, maxLength));

    [g1, g2, g3].forEach(function (grad, gio, gradArray){
      var numGradients = gradArray.length;
      var spikeWidth = 150;
      var xSpikes = Math.floor(canvasW / spikeWidth);
      var ySpikes = Math.floor(canvasH / spikeWidth);
      var xChunk = 1 + Math.floor(canvasW / (numGradients*xSpikes));
      var yChunk = 1 + Math.floor(canvasH / (numGradients*ySpikes));

      ctx.fillStyle = grad;
      for (var si = 0; si < ySpikes; si++){
        var gi = gio;
        ctx.beginPath();
        ctx.moveTo(0, ((gi + 0) * yChunk) + (si * yChunk * numGradients));
        ctx.lineTo(x, y);
        ctx.lineTo(0, ((gi + 1) * yChunk) + (si * yChunk * numGradients));
        ctx.closePath();
        ctx.fill();

        gi = numGradients - (1 + gi);
        ctx.beginPath();
        ctx.moveTo(canvasW, ((gi + 0) * yChunk) + (si * yChunk * numGradients));
        ctx.lineTo(x, y);
        ctx.lineTo(canvasW, ((gi + 1) * yChunk) + (si * yChunk * numGradients));
        ctx.closePath();
        ctx.fill();
      }
      for (var si = 0; si < xSpikes; si++){
        var gi = gio;
        ctx.beginPath();
        ctx.moveTo(((gi + 0) * xChunk) + (si * xChunk * numGradients), canvasH);
        ctx.lineTo(x, y);
        ctx.lineTo(((gi + 1) * xChunk) + (si * xChunk * numGradients), canvasH);
        ctx.closePath();
        ctx.fill();

        gi = numGradients - (1 + gi);
        ctx.beginPath();
        ctx.moveTo(((gi + 0) * xChunk) + (si * xChunk * numGradients), 0);
        ctx.lineTo(x, y);
        ctx.lineTo(((gi + 1) * xChunk) + (si * xChunk * numGradients), 0);
        ctx.closePath();
        ctx.fill();
      }
    });
  }

  return {
    getMousePos: getMousePos,
    drawTriangles: drawTriangles,
    drawCircle: drawCircle,
    drawSpikes: drawSpikes,
    ctx: ctx,
  };
}

