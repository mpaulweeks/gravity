
var cvas = NewCanvas();
var rbow = NewRainbow();
var raf;
var rings = [];

function NewRing(coord, maxRadius){
  var self = {};
  self.origin = coord;
  self.maxRadius = maxRadius;
  self.radius = 50;

  function byte2Hex(n)
  {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
  }
  function RGB2Color(r,g,b){
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
  }

  function getGradient(r){
    var progress = (r / self.maxRadius);
    var c = 205 + Math.floor(50 * (1 - progress));
    return `rgba(${c},${c},${c},0.5)`;
  }

  function drawRing(ctx){
    var outer = self.radius;
    var width = 50;
    var inner = outer - width;
    var gradient = ctx.createRadialGradient(self.origin.x, self.origin.y, inner, self.origin.x, self.origin.y, outer);

    gradient.addColorStop(0, getGradient(inner));
    gradient.addColorStop(1, getGradient(outer));

    ctx.beginPath();
    ctx.arc(self.origin.x, self.origin.y, inner, 0, 2*Math.PI);
    ctx.lineWidth = width;
    ctx.strokeStyle = gradient;
    ctx.stroke();
  }
  self.drawRing = drawRing;

  function step(){
    self.radius += 5;
    return self.radius >= self.maxRadius;
  }
  self.step = step;

  function isDead(){
    return self.radius >= self.maxRadius;
  }
  self.isDead = isDead;

  return self;
}


function addRainbow(g){
  var colors = rbow.nextGradient();
  g.addColorStop(0, colors[0]);
  g.addColorStop(1, colors[1]);
  return g;
}
function addRainbow2(g){
  var colors = rbow.nextGradient(5);
  g.addColorStop(0, colors[0]);
  g.addColorStop(1, colors[1]);
  return g;
}
function draw(){
  // cvas.drawCircle(addRainbow);
  // cvas.drawTriangles(addRainbow);
  cvas.drawRipple(addRainbow, addRainbow2);

  var shouldCheck = false;
  rings.forEach(function(ring){
    ring.drawRing(cvas.ctx);
    shouldCheck = shouldCheck || ring.step();
  });
  if (shouldCheck){
    var newRings = [];
    rings.forEach(function(ring){
      if (!ring.isDead()){
        newRings.push(ring);
      }
    });
    rings = newRings;
  }

  rbow.step();
  raf = window.requestAnimationFrame(draw);
}

canvas.addEventListener('click', function(e) {
  rings.push(NewRing(cvas.getMousePos(e), 300));
});

// rbow.stepFreq = 20;

draw();
