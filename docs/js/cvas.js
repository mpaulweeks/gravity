
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
    var {canvasW, canvasH} = getCanvasSettings();
    return {
      x: Math.min(canvasW - 1 , evt.clientX - rect.left),
      y: Math.min(canvasH - 1, evt.clientY - rect.top),
    };
  }
  function setMousePos(evt){
    currMouse = getMousePos(evt);
  }

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

  function drawStats(stats){
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,160, 16 + 10*stats.length);
    ctx.fillStyle = "white";
    for (var i = 0; i < stats.length; i++){
      ctx.fillText(stats[i][1], 10, 16 + 10*i);
      ctx.fillText(stats[i][0], 60, 16 + 10*i);
    }
  }

  // draw funcs

  function drawCircle(gms, settings){
    var {canvasW, canvasH} = getCanvasSettings();
    var origin = currMouse;
    if (settings.centered){
      origin = {
        x: Math.floor(canvasW/2),
        y: Math.floor(canvasH/2),
      }
    }
    var maxLength = Math.max(canvasW, canvasH);
    var gradient = ctx.createRadialGradient(origin.x, origin.y, 0, origin.x, origin.y, maxLength);
    gms[0](gradient, settings);
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

  function drawHero(hero){
    var {canvasW, canvasH} = getCanvasSettings();
    var center = {
      x: Math.floor(canvasW/2),
      y: Math.floor(canvasH/2),
    }
    var origin = hero.calcOrigin(center);
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, 10, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
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

  function drawSpikesPattern(gms, settings){
    // wip, seems to have degrading performance, maybe fixed if re-using pattern canvas?
    // https://stackoverflow.com/a/5533583
    var {canvasW, canvasH} = getCanvasSettings();
    var xChunk = Math.ceil(canvasW / settings.tiling);
    var yChunk = Math.ceil(canvasH / settings.tiling);
    settings.minX = 0;
    settings.maxX = xChunk;
    settings.minY = 0;
    settings.maxY = yChunk;
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
    var pattern = document.createElement('canvas');
    createPattern(pattern, gms, settings);
    ctx.rect(0, 0, canvasW, canvasH);
    ctx.fillStyle = ctx.createPattern(pattern, "repeat");
    ctx.fill();
    pattern.remove();
  }

  function createPattern(pattern, gms, settings){
    var {
      origin,
      minX, maxX, minY, maxY,
      groupWidth,
    } = settings;
    var numGradients = gms.length;
    var cWidth = maxX - minX;
    var cHeight = maxY - minY;

    pattern.width = cWidth;
    pattern.height = cHeight;
    var pctx = pattern.getContext('2d');

    var maxLength = Math.max(cWidth, cHeight);
    var xSpikes = Math.max(1, Math.floor(cWidth / groupWidth));
    var ySpikes = Math.max(1, Math.floor(cHeight / groupWidth));
    var xChunk = Math.ceil(cWidth / (numGradients*xSpikes));
    var yChunk = Math.ceil(cHeight / (numGradients*ySpikes));
    gms.forEach(function (gradientModifier, gio){
      var grad = gradientModifier(pctx.createRadialGradient(origin.x, origin.y, 0, origin.x, origin.y, maxLength));
      pctx.fillStyle = grad;
      for (var si = 0; si < ySpikes; si++){
        var gi = gio;
        pctx.beginPath();
        pctx.moveTo(minX, minY + ((gi + 0) * yChunk) + (si * yChunk * numGradients));
        pctx.lineTo(origin.x, origin.y);
        pctx.lineTo(minX, minY + ((gi + 1) * yChunk) + (si * yChunk * numGradients));
        pctx.closePath();
        pctx.fill();

        gi = numGradients - (1 + gi);
        pctx.beginPath();
        pctx.moveTo(maxX, minY + ((gi + 0) * yChunk) + (si * yChunk * numGradients));
        pctx.lineTo(origin.x, origin.y);
        pctx.lineTo(maxX, minY + ((gi + 1) * yChunk) + (si * yChunk * numGradients));
        pctx.closePath();
        pctx.fill();
      }
      for (var si = 0; si < xSpikes; si++){
        var gi = gio;
        pctx.beginPath();
        pctx.moveTo(minX + ((gi + 0) * xChunk) + (si * xChunk * numGradients), maxY);
        pctx.lineTo(origin.x, origin.y);
        pctx.lineTo(minX + ((gi + 1) * xChunk) + (si * xChunk * numGradients), maxY);
        pctx.closePath();
        pctx.fill();

        gi = numGradients - (1 + gi);
        pctx.beginPath();
        pctx.moveTo(minX + ((gi + 0) * xChunk) + (si * xChunk * numGradients), minY);
        pctx.lineTo(origin.x, origin.y);
        pctx.lineTo(minX + ((gi + 1) * xChunk) + (si * xChunk * numGradients), minY);
        pctx.closePath();
        pctx.fill();
      }
    });
  }

  function drawRing(ring){
    var gradient = ctx.createRadialGradient(
      ring.origin.x, ring.origin.y, ring.getInner(),
      ring.origin.x, ring.origin.y, ring.getOuter()
    );
    ring.gradientModifier()(gradient);

    ctx.beginPath();
    ctx.arc(ring.origin.x, ring.origin.y, ring.getInner(), 0, 2*Math.PI);
    ctx.lineWidth = ring.width;
    ctx.strokeStyle = gradient;
    ctx.stroke();
  }

  function drawParticle(ptcle){
    var line = ptcle.getLine();
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(line.head.x, line.head.y);
    ctx.lineTo(line.tail.x, line.tail.y);
    ctx.lineWidth = line.thickness;
    ctx.stroke();
  }

  function drawVortexBackground(vortex){
    var {
      coord,
      coreSize,
      ringSize,
      percentDead,
      gradientModifier,
    } = vortex.getDrawData();

    ctx.beginPath();
    ctx.arc(coord.x, coord.y, ringSize, 0, 2*Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';
    ctx.stroke();
    var percentWhite = Math.floor(255*Math.pow(percentDead, 4));
    var colorStr = `rgba(${percentWhite},${percentWhite},${percentWhite},1)`;
    ctx.fillStyle = colorStr;
    ctx.fill();
  }

  function drawVortexCore(vortex){
    var {
      coord,
      coreSize,
      ringSize,
      percentDead,
      gradientModifier,
    } = vortex.getDrawData();

    var gradient = ctx.createRadialGradient(
      coord.x, coord.y, 0,
      coord.x, coord.y, coreSize
    );
    gradientModifier(gradient);
    ctx.beginPath();
    ctx.arc(coord.x, coord.y, coreSize, 0, 2*Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  return {
    addEventListener: function(t, c){canvas.addEventListener(t, c)},
    getCanvasSettings: getCanvasSettings,
    goFullScreen: goFullScreen,
    setMousePos: setMousePos,
    getMousePos: getMousePos,
    drawStats: drawStats,
    drawCircle: drawCircle,
    drawTilingSpikes: drawTilingSpikes,
    drawRing: drawRing,
    drawParticle: drawParticle,
    drawVortexBackground: drawVortexBackground,
    drawVortexCore: drawVortexCore,
    drawHero: drawHero,
  };
}
