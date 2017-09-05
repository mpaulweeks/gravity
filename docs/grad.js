
function NewGradientModifier(rbow){
  function rainbow(g, bonus){
    var colors = rbow.getGradient(bonus || 0);
    g.addColorStop(0, colors[0]);
    g.addColorStop(1, colors[1]);
    return g;
  }

  function rainbowSeries(num, bonus){
    function rainbowWrapper(b){
      return function(g){
        return rainbow(g, b);
      }
    }

    var grads = [];
    for (var i = 0; i < num; i++){
      var b = i * bonus;
      var gm = rainbowWrapper(b);
      grads.push(gm);
    }
    return grads;
  }

  return {
    rainbow: rainbow,
    rainbowSeries: rainbowSeries,
  }
}
