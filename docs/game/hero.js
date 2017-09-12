
function NewHero(cvas){
  var self = {
    inputBuffer: {},
  };
  const radiusDelta = 5;
  const rotationDelta = 0.05;
  const fullRotation = 2 * Math.PI;
  const screenBuffer = 50;
  var radius = screenBuffer * 2;
  var rotation = 0;

  function draw(){
    cvas.drawHero(self);
  }
  function processInput(){
    if (self.inputBuffer[39]){
      rotation = (fullRotation + rotation + rotationDelta) % fullRotation;
    }
    if (self.inputBuffer[37]){
      rotation = (fullRotation + rotation - rotationDelta) % fullRotation;
    }
    if (self.inputBuffer[40]){
      var {canvasW, canvasH} = cvas.getCanvasSettings();
      var bound = Math.min(canvasW, canvasH)/2;
      radius = Math.min(bound - screenBuffer, radius + radiusDelta);
    }
    if (self.inputBuffer[38]){
      radius = Math.max(radius - radiusDelta, screenBuffer);
    }
  }
  function calcOrigin(center){
    return {
      x: center.x + Math.floor(Math.cos(rotation) * radius),
      y: center.y + Math.floor(Math.sin(rotation) * radius),
    }
  }

  return Object.assign(self, {
    calcOrigin: calcOrigin,
    draw: draw,
    processInput: processInput,
  });
}
