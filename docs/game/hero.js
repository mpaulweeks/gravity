
function NewHero(cvas){
  var self = {
    origin: {x: 100, y:100},
    inputBuffer: {},
    radius: 10,
  };
  var xDelta = 5;

  function draw(){
    cvas.drawHero(self);
  }
  function processInput(){
    if (self.inputBuffer[39]){
      self.origin.x += xDelta;
    }
    if (self.inputBuffer[37]){
      self.origin.x -= xDelta;
    }
  }

  return Object.assign({
    draw: draw,
    processInput: processInput,
  }, self);
}
