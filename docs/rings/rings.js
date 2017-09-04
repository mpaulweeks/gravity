
var cvas = NewCanvas();
var rbow = NewRainbow();
var rings = [];

function NewRing(coord, maxRadius){
  var self = {};
  self.origin = coord;
  self.maxRadius = maxRadius;
  self.radius = 10;

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
    console.log(c);
    return `rgba(${c},${c},${c},0.5)`;
  }

  function drawRing(ctx){
    var outer = self.radius;
    var inner = outer - Math.floor(outer * 0.1);
    var gradient = ctx.createRadialGradient(self.origin.x, self.origin.y, inner, self.origin.x, self.origin.y, outer);

    gradient.addColorStop(0, getGradient(inner));
    gradient.addColorStop(1, getGradient(outer));

    // https://stackoverflow.com/a/43433877/6461842

    ctx.beginPath();
    ctx.arc(self.origin.x, self.origin.y, inner, 0, 2*Math.PI);
    ctx.lineWidth = outer - inner;
    ctx.strokeStyle = gradient;
    ctx.stroke();
  }
  self.drawRing = drawRing;

  function step(){
    self.radius += 10;
    console.log(self.radius);
    return self.radius >= self.maxRadius;
  }
  self.step = step;

  return self;
}


function addRainbow(g){
  var colors = rbow.nextGradient();
  g.addColorStop(0, colors[0]);
  g.addColorStop(1, colors[1]);
}
function draw(){
  cvas.drawCircle(addRainbow);

  var shouldPop = false;
  rings.forEach(function(ring){
    ring.drawRing(cvas.ctx);
    shouldPop = shouldPop || ring.step();
  });
  if (shouldPop){
    rings = [];
  }

  raf = window.requestAnimationFrame(draw);
}

canvas.addEventListener('click', function(e) {
  rings.push(NewRing(cvas.getMousePos(e), 300));
});

// rbow.stepFreq = 20;

draw();
