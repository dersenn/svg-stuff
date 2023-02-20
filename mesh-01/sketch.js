
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



// SETUP

const nCols = 4
const nRows = 5

let a = lerp(nVec(0,0), nVec(svg.w,0), 1/nCols)
let b = lerp(nVec(0,svg.h), nVec(svg.w,svg.h), 1/nCols)

let sPts = divLength(nVec(0,0), nVec(svg.w,0), 3)

console.log(sPts)


// DRAW/ANIMATE

svg.makeCircles(sPts)

// svg.makeCircle(a, 5, '#f00', 'transparent')
// svg.makeCircle(b, 5, '#f00', 'transparent')


// My Only Friend, The End.