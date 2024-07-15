
// INIT

let useSeed = true
let seed
if (useSeed) {
  seed = new Hash()
} else {
  seed = false
}

const setup = {
  id: 'mySVG',
  parent: document.body,
  presAspect: 'none', // other values?
}

let svg = new SVG(setup)


let color1 = new Color(255, 0, 0, 0.5, 'rgb'); // rgba(255, 0, 0, 0.5)
let color2 = Color.fromString('rgba(0, 255, 0, 0.3)');
let color3 = new Color(240, 100, 50, 0.8, 'hsl');
let color4 = Color.fromString('hsl(120, 100%, 50%)');
console.log(color1.hsla); // [0, 100, 50]
console.log(color3.toHSLArr()); // [240, 100, 50]


let circ = svg.makeCircle(svg.c, 300, color2.rgba)
console.log(color2.a)


color2.a = 0.5

console.log(color2.a)

let rect = svg.makeRect(svg.c, 300, 300, color2.hsla)




// My Only Friend, The End.