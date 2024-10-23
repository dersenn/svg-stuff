
// 22-10-24
// Found a few resources on future blob/liquid simulation.
// https://charlottedann.com/article/soft-blob-physics
// https://codepen.io/ksenia-k/pen/RwXVMMY // Codepen. Shader based.


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

let pts = []
let nPts = 20

for (let i = 0; i < nPts; i++) {
  let x = rnd() * svg.w
  let y = rnd() * svg.h
  pts.push(new Vec(x, y))
}


// FUNCTIONS

// Find all possible triangles
function allTriangles(iA) {
  let triangles = []
  for (let i = 0; i < iA.length - 2; i++) {
    for (let j = i + 1; j < iA.length - 1; j++) {
      for (let k = j + 1; k < iA.length; k++) {
        triangles.push([iA[i], iA[j], iA[k]])
      }
    }
  }
  return triangles
}

function findCircumcircle(triangle) {
  let A = triangle[0]
  let B = triangle[1]
  let C = triangle[2]
  let mAB = mid(A, B)
  let mBC = mid(B, C)
  let pAB = perpSlope(A, B)
  let pBC = perpSlope(B, C)
  let cx = (mBC.y - mAB.y + pAB * mAB.x - pBC * mBC.x) / (pAB - pBC)
  let cy = pAB * (cx - mAB.x) + mAB.y
  let c = new Vec(cx, cy)
  let r = dist(c, A)
  return {c: c,r: r}
}

// Filter points that are NOT part of the current triangle
function filterPoints(triangle, pts) {
  // Create a Set of triangle vertices to easily filter out
  let triangleSet = new Set(triangle)
  return pts.filter(pt => !triangleSet.has(pt))
}

function isPtInCircumcircle(pt, triangle) {
  let cC = findCircumcircle(triangle)
  return dist(pt, cC.c) < cC.r
}

function checkDelaunayCondition(triangle, pts) {
  let filteredPts = filterPoints(triangle, pts)
  for (let i = 0; i < filteredPts.length; i++) {
    if (isPtInCircumcircle(filteredPts[i], triangle)) {
      return false
    }
  }
  return true
}

function delaunayTriangulation(pts) {
  let triangles = allTriangles(pts)
  let delaunayTriangles = []
  for (let i = 0; i < triangles.length; i++) {
    let delaunayTriangle
    if (checkDelaunayCondition(triangles[i], pts)) {
      delaunayTriangle = triangles[i]
      delaunayTriangle.circumcircle = findCircumcircle(triangles[i])
      delaunayTriangles.push(delaunayTriangle)
    }
  }
  return delaunayTriangles
}


// Next part not working yet.

function findTriangleNeighbors(triangles) {
  let edgeMap = new Map() // Map to store edges and corresponding triangles

  for (let i = 0; i < triangles.length; i++) {
    let triangle = triangles[i]
    let edges = [
      [triangle[0], triangle[1]],
      [triangle[1], triangle[2]],
      [triangle[2], triangle[0]]
    ]
    console.log(edges)

    // Sort edges to avoid duplicate (a, b) vs (b, a)
    for (let edge of edges) {
      edge.sort()

      let edgeKey = edge.join('-')
      if (!edgeMap.has(edgeKey)) {
        edgeMap.set(edgeKey, [])
      }
      edgeMap.get(edgeKey).push(i) // Store triangle index
    }
  }

  console.log(edgeMap)


  // Now build the neighbor relationships
  let neighbors = Array(triangles.length).fill().map(() => [])

  console.log("neighbors: " + neighbors)

  for (let [edge, tris] of edgeMap) {
    if (tris.length == 2) { // Two triangles share this edge
      neighbors[tris[0]].push(tris[1])
      neighbors[tris[1]].push(tris[0])
    }
  }

  return neighbors
}






// BUILD


let delaunay = delaunayTriangulation(pts)
console.log(findTriangleNeighbors(delaunay))


// ADDED A GRID CLASS FOR FUN (22.10.24)
let grid = new Mesh(3, 10, 20)
console.log(grid.cells[3])

for (let i = 0; i < grid.cells.length; i++) {
  svg.makeCircle(grid.cells[i].tl, 5, 'rgba(0, 0, 255, 1)')
  svg.makeCircle(grid.cells[i].tr, 5, 'rgba(0, 0, 255, 1)')
  svg.makeCircle(grid.cells[i].bl, 5, 'rgba(0, 0, 255, 1)')
  svg.makeCircle(grid.cells[i].br, 5, 'rgba(0, 0, 255, 1)')
  svg.makeCircle(grid.cells[i].c, 5, 'rgba(0, 255, 0, 1)')
}



// DRAW/ANIMATE

svg.makeCircles(pts, 5, 'rgba(255, 0, 0, 1)')

for (let t = 0; t < delaunay.length; t++) {
  let p = new Path(delaunay[t], true)
  let col = rndColRGB()
  col.a = 0.3
  col.updateRGBA()
  svg.makePath(
    p.buildPolygon(),
    'transparent',
    col.rgba,
    2
  )
  svg.makeCircle(delaunay[t].circumcircle.c, 5, col.rgba)
}






// My Only Friend, The End.