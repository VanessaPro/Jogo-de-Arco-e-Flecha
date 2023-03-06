let svg = document.querySelector("svg")
let cursor = svg.createSVGPoint();
let arrows = document.querySelector(".arrows");
let randomAngle = 0;

// centro do alvo

let target= {
    x:900,
    y:249.5
};

//segmento de linha de interseção alvo

let lineSegment= {
    x1:875,
    y2:280,
    x2:925,
    y2:220
};

//ponto de rotação do arco

let pivot= {
    x:100,
    y:250
};

aim({
    clientX: 320,
    clientY: 300
  });

// evento inicial de arrastar

window.addEventListener("mousedown", draw);

function draw(e) {

    //puxe a seta para trás

    randomAngle= (Math.random( ) * Math.PI * 0.03) - 0.015;
    TweenMax.to(".arrow-angle use", 0.3, {
        opacity:1
    });

    window.addEventListener("mousemove",aim);
    window.addEventListener("mouseup",loose);
    aim(e);
}



function aim(e) {
    //Posição do mouse dentro do SVG com escala automática
    let point = getMouseSVG(e);
    point.x = Math.min(point.x, pivot.x - 7);
    point.y = Math.max(point.y, pivot.y + 7);
    let dx = point.x - pivot.x;
    let dy = point.y - pivot.y;

    // Torne mais difícil adicionando um ângulo aleatório a cada vez
    let angle = Math.atan2(dy, dx) + randomAngle;
    let bowAngle = angle - Math.PI;
    let distance = Math.min(Math.sqrt((dx * dx) + (dy * dy)), 50);
    let scale = Math.min(Math.max(distance / 30, 1), 2);
    TweenMax.to("#bow", 0.3, {
      scaleX: scale,
      rotation: bowAngle + "rad",
      transformOrigin: "right center"
    });

    let arrowX = Math.min(pivot.x - ((1 / scale) * distance), 88);
    TweenMax.to(".arrow-angle", 0.3, {
      rotation: bowAngle + "rad",
      svgOrigin: "100 250"
    });
    TweenMax.to(".arrow-angle use", 0.3, {
      x: -distance
    });
    TweenMax.to("#bow polyline", 0.3, {
      attr: {
        points: "88,200 " + Math.min(pivot.x - ((1 / scale) * distance), 88) + ",250 88,300"
      }
    });
  
    let radius = distance * 9;
    let offset = {
      x: (Math.cos(bowAngle) * radius),
      y: (Math.sin(bowAngle) * radius)
    };
    let arcWidth = offset.x * 3;
  
    TweenMax.to("#arc", 0.3, {
      attr: {
        d: "M100,250c" + offset.x + "," + offset.y + "," + (arcWidth - offset.x) + "," + (offset.y + 50) + "," + arcWidth + ",50"
      },
        autoAlpha: distance/60
    });
  
  }


  function hitTest(tween) {

    // verifique se há colisões com a seta e o alvo
    let arrow = tween.target[0];
    let transform = arrow._gsTransform;
    let radians = transform.rotation * Math.PI / 180;
    let arrowSegment = {
      x1: transform.x,
      y1: transform.y,
      x2: (Math.cos(radians) * 60) + transform.x,
      y2: (Math.sin(radians) * 60) + transform.y
    }
  
    let intersection = getIntersection(arrowSegment, lineSegment);
    if (intersection.segment1 && intersection.segment2) {
      tween.pause();
      var dx = intersection.x - target.x;
      var dy = intersection.y - target.y;
      var distance = Math.sqrt((dx * dx) + (dy * dy));
      var selector = ".hit";
      if (distance < 7) {
        selector = ".bullseye"
      }
  
      showMessage(selector);
    }
  
  }

  function loose() {
    // soltar flecha
  
    window.removeEventListener("mousemove", aim);
    window.removeEventListener("mouseup", loose);
  
    TweenMax.to("#bow", 0.4, {
      scaleX: 1,
      transformOrigin: "right center",
      ease: Elastic.easeOut
    });
    TweenMax.to("#bow polyline", 0.4, {
      attr: {
        points: "88,200 88,250 88,300"
      },
      ease: Elastic.easeOut
    });
    // seta duplicada
  
    let newArrow = document.createElementNS("http://www.w3.org/2000/svg", "use");
    newArrow.setAttributeNS('http://www.w3.org/1999/xlink', 'href', "#arrow");
    arrows.appendChild(newArrow);
    
    // seta animada ao longo do caminho
  
    let path = MorphSVGPlugin.pathDataToBezier("#arc");
    TweenMax.to([newArrow], 0.5, {
      force3D: true,
      bezier: {
        type: "cubic",
        values: path,
        autoRotate: ["x", "y", "rotation"]
      },
      onUpdate: hitTest,
      onUpdateParams: ["{self}"],
      onComplete: onMiss,
      ease: Linear.easeNone
    });
    TweenMax.to("#arc", 0.3, {
      opacity: 0
    });
    //hide previous arrow
    TweenMax.set(".arrow-angle use", {
      opacity: 0
    });
  }