let width = 500;
let height = 500;
let centerX = width / 2;
let centerY = height / 2
var draw;
var path;
let open = false;
let segments;

let radius = 240;
draw = SVG().addTo('#drawing').size(width, height)
var bkgrd = draw.rect(width,height).fill('brown');

path = draw.path().m({x:centerX,y:centerY})
                    .L({x: radius*Math.cos(Math.PI/12)+ centerX, y: radius*Math.sin(Math.PI/12)+ centerY})
                    .A(radius, radius,0,0,0,{x: radius*Math.cos(-Math.PI/12)+ centerX, y: radius*Math.sin(-Math.PI/12)+ centerY})
                    .Z();
path.fill('white');

var mask = draw.mask();
mask.add(path.clone())
path.maskWith(mask)

let makingCut = false;
let newCut;
let line = draw.line();
let originPoint;
let startingPoint = draw.circle(0).fill('lightgray');

startingPoint.mouseover(function() {
    if(makingCut){
        startingPoint.radius(7);
    }
})
startingPoint.mouseout(function() {
    if(makingCut){
        startingPoint.radius(5);
    }
})
startingPoint.click(function(e) {
    endCut();
    startingPoint.radius(0);
    line.remove();
    startingPoint.radius(0);
    e.stopPropagation();
})

draw.click(function(e) {
    if(!makingCut) {
        makingCut = true;
        newCut = draw.path().M(e.offsetX,e.offsetY)
        newCut.fill({ color: 'black', opacity: 0.0}).stroke({ color: 'black', width: 1, linecap: 'round', linejoin: 'round' })
        startingPoint.radius(5).cx(e.offsetX).cy(e.offsetY);
        startingPoint.front();

    } else {
        newCut.L(e.offsetX,e.offsetY)
    }
    originPoint = {x: e.offsetX, y: e.offsetY}
    line.remove();
    line = draw.line(originPoint.x, originPoint.y, originPoint.x-10, originPoint.y-10).stroke({ color: 'black', width: 1, linecap: 'round', linejoin: 'round' })         
})
draw.dblclick(function(e) {
    if(makingCut){
        e.preventDefault();
        newCut.L(e.offsetX,e.offsetY);
        endCut();
    }
})

document.addEventListener('keyup', (e) => {
    const keyName = event.key;
    if(keyName === ' ') {
       if(makingCut){
        endCut();
    } 
    }
})
draw.mousemove(function(e) {
    if(makingCut) {
        line.plot(originPoint.x, originPoint.y, e.offsetX, e.offsetY)
        startingPoint.front();
    }
})

function endCut() {
    newCut.Z();
    newCut.fill({color: 'black', opacity: 1.0})
    line.remove();
    mask.add(newCut)   
    path.maskWith(mask)
    makingCut = false;
}


function unfold() {
    if(open) {
        segments.remove();
        open = false;
        document.getElementById("foldButton").innerHTML = "Unfold";
    } else{
        open = true;
        segments = draw.group();
        for(var i =0; i < 12; i++) {
            if(i%2 == 0) {
                segments.add(draw.use(path).scale(1,1).rotate(30*i,centerX,centerY));  
            } else {
                segments.add(draw.use(path).scale(1,-1).rotate(30*i,centerX,centerY));
            }
        }
        document.getElementById("foldButton").innerHTML = "Close";
    }
}

function reset() {
    if(open) {
        segments.remove();
        open = false;
        document.getElementById("foldButton").innerHTML = "Unfold";
    }
    mask.remove();
    mask = draw.mask();
    mask.add(path.clone())
    path.maskWith(mask)
}