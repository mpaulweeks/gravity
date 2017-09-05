
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

  function drawSpikes(gms, settings){
    var x = currMouse.x;
    var y = currMouse.y;
    var numGradients = gms.length;
    var spikeWidth = settings ? settings.groupWidth : 50;
    var xSpikes = Math.floor(canvasW / spikeWidth);
    var ySpikes = Math.floor(canvasH / spikeWidth);
    var xChunk = 1 + Math.floor(canvasW / (numGradients*xSpikes));
    var yChunk = 1 + Math.floor(canvasH / (numGradients*ySpikes));
    gms.forEach(function (gradientModifier, gio){
      var grad = gradientModifier(ctx.createRadialGradient(currMouse.x, currMouse.y, 0, currMouse.x, currMouse.y, maxLength));
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

  function drawRing(ring){
    var outer = ring.radius;
    var width = 50;
    var inner = outer - width;
    var gradient = ctx.createRadialGradient(ring.origin.x, ring.origin.y, inner, ring.origin.x, ring.origin.y, outer);

    gradient.addColorStop(0, ring.getGradient(inner));
    gradient.addColorStop(1, ring.getGradient(outer));

    ctx.beginPath();
    ctx.arc(ring.origin.x, ring.origin.y, inner, 0, 2*Math.PI);
    ctx.lineWidth = width;
    ctx.strokeStyle = gradient;
    ctx.stroke();
  }

  return {
    getMousePos: getMousePos,
    drawTriangles: drawTriangles,
    drawCircle: drawCircle,
    drawSpikes: drawSpikes,
    drawRing: drawRing,
  };
}
