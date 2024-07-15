
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

const nCols = 20 //rndInt(3, 20)
const nRows = 10 //rndInt(3, 10)
const nSub = 1 //rndInt(3,30)


let sY = divLength(nVec(0, 0), nVec(0, svg.h), nRows, true, 'RND')
let eY = divLength(nVec(svg.w, 0), nVec(svg.w, svg.h), nRows, true, 'RND')

// let sY = divLength(nVec(0, 0), nVec(0, svg.h), nRows, true)
// let eY = divLength(nVec(svg.w, 0), nVec(svg.w, svg.h), nRows, true)


console.log(rndColRGB())


let pts = []

for (let y = 0; y <= nRows; y++) {
  pts[y] = divLength(
    sY[y], 
    eY[y],
    nCols, 
    true, 
    'RND'
  )
}


let paths = []

for (let x = 0; x < nCols; x++) {

  for (let s = 0; s < nSub; s++) {
    let p = new Path
    // p.col = `rgba(${rnd()*255}, ${255/(x+1)}, 0, 1)`
    for (let y = 0; y <= nRows; y++) {
      switch (x) {
        case nCols: {
          break
        }
        default: {
          let thePt = divLength(pts[y][x], pts[y][x + 1], nSub, true)[s]
          p.pts.push(thePt)
        }
      }
    }
    paths.push(p)
  }
}



// DRAW/ANIMATE


for (const path of paths) {
  svg.makePath(
    // path.buildPolygon(), 
    path.buildSpline(), 
    'transparent', 
    // path.col
    '#000'
    )
}

for (const pt of pts) {
  svg.makeCircles(pt, 5, rndColRGB())
}




// My Only Friend, The End.