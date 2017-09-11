
function NewGradientModifier(rbow){
  function rainbow(g, settings){
    var colors = rbow.getGradient(settings);
    g.addColorStop(0, colors[0]);
    g.addColorStop(1, colors[1]);
    return g;
  }

  function rainbowSeries(settings){
    function rainbowWrapper(newSettings){
      return function(g){
        return rainbow(g, newSettings);
      }
    }

    var grads = [];
    for (var i = 0; i < settings.numSlices; i++){
      var newSettings = Object.assign({}, settings);
      newSettings.sliceIndex = i;
      var gm = rainbowWrapper(newSettings);
      grads.push(gm);
    }
    return grads;
  }

  return {
    rainbow: rainbow,
    rainbowSeries: rainbowSeries,
  }
}
