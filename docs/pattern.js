
function NewPattern(canvasFunc, gradientFactory, settings){
  function process(){
    return canvasFunc(gradientFactory, settings);
  }

  return {
    process: process,
  }
}

function RainbowPatterns(cvas, grad){
  return [
    NewPattern(cvas.drawCircle, grad.rainbow),
    NewPattern(cvas.drawTriangles, grad.rainbow),
    NewPattern(cvas.drawSpikes, grad.rainbowSeries(3, 5), {spikeWidth: 150}),
    NewPattern(cvas.drawSpikes, grad.rainbowSeries(4, 2), {spikeWidth: 150}),
    NewPattern(cvas.drawSpikes, grad.rainbowSeries(32, 1), {spikeWidth: 500}),
    NewPattern(cvas.drawSpikes, grad.rainbowSeries(16, 8), {spikeWidth: 500}),
    NewPattern(cvas.drawSpikes, grad.rainbowSeries(32, 16), {spikeWidth: 500}),
    NewPattern(cvas.drawSpikes, grad.rainbowSeries(16, 1), {spikeWidth: 500}),
  ]
}
