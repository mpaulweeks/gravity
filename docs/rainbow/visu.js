
(function (){
  var raf;
  var cvas = NewCanvas();
  var rbow = NewRainbow();
  var grad = NewGradientModifier(rbow);
  var patterns = NewRainbowPatterns(cvas, grad);

  function draw(){
    patterns.get().process();
    rbow.step();
    raf = window.requestAnimationFrame(draw);
  }

  canvas.addEventListener('click', function(e) {
    patterns.step();
  });

  draw();
})();
