
(function (){
  var cvas = NewCanvas();
  var rbow = NewRainbow();
  var grad = NewGradientModifier(rbow);
  var patterns = RainbowPatterns(cvas, grad);
  var patternIndex = 0;
  var raf;

  function draw(){
    patterns[patternIndex].process();
    rbow.step();
    raf = window.requestAnimationFrame(draw);
  }

  canvas.addEventListener('click', function(e) {
    patternIndex = (patternIndex + 1) % patterns.length;
  });

  draw();
})();
