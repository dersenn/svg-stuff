
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


let pts = []

for (let y = 0; y <= nRows; y++) {
  pts[y] = divLength(
    nVec(0, y * (svg.h / nRows)), nVec(svg.w, y * (svg.h / nRows)),
    nCols, true, 'RND'
  )
}

for (const pt of pts) {
  // console.log(pt)
  // svg.makeCircles(pt)
}

let paths = []


// DRAW/ANIMATE

for (let x = 0; x <= nCols; x++) {
  // paths[x] = new Path
  // let p = paths[x]

  for (let s = 0; s < nSub; s++) {
    let p = new Path

    for (let y = 0; y <= nRows; y++) {
      switch (x) {
        case nCols: {
          break
        }
        default: {
          p.pts.push(divLength(pts[y][x], pts[y][x + 1], nSub, true)[s])
          // console.log(divLength(pts[y][x], pts[y][x + 1], nSub, true)[s])
        }
      }
    }
    // p.pts.push(pts[y][x])
    paths.push(p)
  }
}

for (const path of paths) {
  // console.log(pt)
  svg.makePath(path.buildSpline(.3))
}

console.log(pts)
// console.log(paths)

let tpt = pts[3][4]

console.log(tpt, svg.w)

svg.makeCircle(tpt)

// My Only Friend, The End.