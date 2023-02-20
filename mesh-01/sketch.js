
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

const nCols = 5
const nRows = 5
const nSub = 10


let sY = divLength(nVec(0, 0), nVec(0, svg.h), nRows, true, 'RND')
let eY = divLength(nVec(svg.w, 0), nVec(svg.w, svg.h), nRows, true, 'RND')




let pts = []

for (let y = 0; y <= nRows; y++) {
  pts[y] = divLength(
    sY[y], eY[y],
    nCols, true, 'RND'
  )
}


let paths = []

for (let x = 0; x <= nCols; x++) {
  for (let s = 0; s < nSub; s++) {
    let p = new Path

    for (let y = 0; y <= nRows; y++) {
      switch (x) {
        case nCols: {
          break
        }
        default: {
          p.pts.push(divLength(pts[y][x], pts[y][x + 1], nSub, true)[s])
        }
      }
    }
    paths.push(p)
  }
}



// DRAW/ANIMATE

for (const path of paths) {
  svg.makePath(path.buildSpline())
}




for (const pt of pts) {
  // svg.makeCircles(pt)
}




// My Only Friend, The End.