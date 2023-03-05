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
    
}