
function NewCanvas(){
  // https://stackoverflow.com/a/4037426/6461842
  var canvas = document.getElementById('canvas');
  getCanvasSettings();
  var ctx = canvas.getContext('2d');
  var currMouse = {
    x: Math.floor(canvas.width/2),
    y: Math.floor(canvas.height/2),
  };

  function goFullScreen(){
    // https://stackoverflow.com/a/16124664/6461842
    if(canvas.requestFullScreen)
      canvas.requestFullScreen();
    else if(canvas.webkitRequestFullScreen)
      canvas.webkitRequestFullScreen();
    else if(canvas.mozRequestFullScreen)
      canvas.mozRequestFullScreen();
  }

  function getMousePos(evt) {
    // https://stackoverflow.com/a/17130415/6461842
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  function setMousePos(evt){
    currMouse = getMousePos(evt);
  }
  document.onmousemove = setMousePos;

  function getCanvasSettings(){
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

  function drawCircle(gradientModifier, settings){
    var {canvasW, canvasH} = getCanvasSettings();
    var maxLength = Math.max(canvasW, canvasH);
    var gradient = ctx.createRadialGradient(currMouse.x, currMouse.y, 0, currMouse.x, currMouse.y, maxLength);
    gradientModifier(gradient, settings);
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,canvasW,canvasH);
  }

  function drawTilingSpikes(gms, settings){
    var {canvasW, canvasH} = getCanvasSettings();
    var xChunk = Math.ceil(canvasW / settings.tiling);
    var yChunk = Math.ceil(canvasH / settings.tiling);
    for (var x = 0; x < settings.tiling; x++){
      settings.minX = x * xChunk;
      settings.maxX = (x + 1) * xChunk;
      for (var y = 0; y < settings.tiling; y++){
        settings.minY = y * yChunk;
        settings.maxY = (y + 1) * yChunk;
        if (settings.centered){
          settings.origin = {
            x: Math.floor((settings.maxX - settings.minX)/2 + settings.minX),
            y: Math.floor((settings.maxY - settings.minY)/2 + settings.minY),
          };
        } else {
          settings.origin = {
            x: currMouse.x % xChunk + settings.minX,
            y: currMouse.y % yChunk + settings.minY,
          }
        }
        drawGenericSpikes(gms, settings);
      }
    }
  }

  function drawGenericSpikes(gms, settings){
    var {
      origin,
      minX, maxX, minY, maxY,
      groupWidth,
    } = settings;
    var numGradients = gms.length;
    var cWidth = maxX - minX;
    var cHeight = maxY - minY;
    var maxLength = Math.max(cWidth, cHeight);
    var xSpikes = Math.max(1, Math.floor(cWidth / groupWidth));
    var ySpikes = Math.max(1, Math.floor(cHeight / groupWidth));
    var xChunk = Math.ceil(cWidth / (numGradients*xSpikes));
    var yChunk = Math.ceil(cHeight / (numGradients*ySpikes));
    gms.forEach(function (gradientModifier, gio){
      var grad = gradientModifier(ctx.createRadialGradient(origin.x, origin.y, 0, origin.x, origin.y, maxLength));
      ctx.fillStyle = grad;
      for (var si = 0; si < ySpikes; si++){
        var gi = gio;
        ctx.beginPath();
        ctx.moveTo(minX, minY + ((gi + 0) * yChunk) + (si * yChunk * numGradients));
        ctx.lineTo(origin.x, origin.y);
        ctx.lineTo(minX, minY + ((gi + 1) * yChunk) + (si * yChunk * numGradients));
        ctx.closePath();
        ctx.fill();

        gi = numGradients - (1 + gi);
        ctx.beginPath();
        ctx.moveTo(maxX, minY + ((gi + 0) * yChunk) + (si * yChunk * numGradients));
        ctx.lineTo(origin.x, origin.y);
        ctx.lineTo(maxX, minY + ((gi + 1) * yChunk) + (si * yChunk * numGradients));
        ctx.closePath();
        ctx.fill();
      }
      for (var si = 0; si < xSpikes; si++){
        var gi = gio;
        ctx.beginPath();
        ctx.moveTo(minX + ((gi + 0) * xChunk) + (si * xChunk * numGradients), maxY);
        ctx.lineTo(origin.x, origin.y);
        ctx.lineTo(minX + ((gi + 1) * xChunk) + (si * xChunk * numGradients), maxY);
        ctx.closePath();
        ctx.fill();

        gi = numGradients - (1 + gi);
        ctx.beginPath();
        ctx.moveTo(minX + ((gi + 0) * xChunk) + (si * xChunk * numGradients), minY);
        ctx.lineTo(origin.x, origin.y);
        ctx.lineTo(minX + ((gi + 1) * xChunk) + (si * xChunk * numGradients), minY);
        ctx.closePath();
        ctx.fill();
      }
    });
  }

  function drawRing(ring){
    var gradient = ctx.createRadialGradient(
      ring.origin.x, ring.origin.y, ring.getInner(),
      ring.origin.x, ring.origin.y, ring.getOuter()
    );
    ring.gradientModifier(gradient);

    ctx.beginPath();
    ctx.arc(ring.origin.x, ring.origin.y, ring.getInner(), 0, 2*Math.PI);
    ctx.lineWidth = ring.width;
    ctx.strokeStyle = gradient;
    ctx.stroke();
  }

  return {
    elm: canvas,
    goFullScreen: goFullScreen,
    setMousePos: setMousePos,
    getMousePos: getMousePos,
    drawCircle: drawCircle,
    drawTilingSpikes: drawTilingSpikes,
    drawRing: drawRing,
  };
}
