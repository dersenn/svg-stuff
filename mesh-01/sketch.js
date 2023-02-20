
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

let tl = nVec(0, 0)
let tr = nVec(svg.w, 0)

// let Pts = divLength(tl, tr, nCols, 'RND', true)
let Pts = []

for (let y = 0; y <= nRows; y++) {
  let a = nVec(0, y * (svg.h / nRows))
  let b = nVec(svg.w, y * (svg.h / nRows))
  Pts.push(divLength(a, b, nCols, 'RND', true))
}

let paths = []

for (let c = 0; c <= nCols; c++) {
  paths[c] = new Path()
  for (let r = 0; r <= nRows; r++) {
    paths[c].pts.push(Pts[r][c])
  }
}

console.log(paths)

// DRAW/ANIMATE

// console.log(Pts)
for (let p = 0; p < Pts.length; p++) {
  svg.makeCircles(Pts[p])
}


for (let p = 0; p < paths.length; p++) {
  svg.makePath(paths[p].buildPolygon())
}




// My Only Friend, The End.