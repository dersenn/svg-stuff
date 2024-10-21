// 21-10-2024
// Modified Version. Should push this back to the boilerplate and engine repo.


// To Do:
// — nice to have: a way to easily name and label elements. e.g. Point "A", "B", "C" etc. . Mostly useful for development and maths debugging.
// — nice to have: working defaults.
// — nice to have: add shortcuts to setAttribute... e.g. strokeCap(5)
// — nice to have: color object or methods. and gradients. // done, but needs refinement.
// — nice to have: modularize???
// — maybe get rid of z-coordinates... it's 2d after all. but maybe useful for noise etc. (?)
// — <g> (group). but needs a bit of thinking re: parent.


// — do something with it :-)



// THE MAIN THING

class SVG {
  constructor(setup) {
    this.ns = 'http://www.w3.org/2000/svg'
    this.xl = 'http://www.w3.org/1999/xlink'
    this.mime = { type: 'image/svg+xml' }
    this.parent = setup.parent
    this.id = setup.id
    this.w = this.parent.clientWidth
    this.h = this.parent.clientHeight
    this.c = new Vec(this.w/2, this.h/2)
    this.els = []

    // Find a Way to make those easily adjustable???
    // But maybe this doesn't make sense.
    this.def = {
      fill: 'transparent',
      stroke: 'transparent',
      strokeW: 0
    }

    // initialize and push to dom on creation.
    this.init()
  }

  init() {
    this.stage = document.createElementNS(this.ns, 'svg')
    this.stage.setAttribute('id', this.id)
    this.stage.setAttribute('xmlns', this.ns)
    this.stage.setAttribute('xmlns:xlink', this.xl)
    this.stage.setAttribute('width', this.w)
    this.stage.setAttribute('height', this.h)
    this.stage.setAttribute('viewBox', `0 0 ${this.w} ${this.h}`)
    this.stage.setAttribute('preserveAspectRatio', setup.presAspect)
    this.parent.append(this.stage)
  }

  save() {
    const str = new XMLSerializer().serializeToString(this.stage)
    const blob = new Blob([str], this.mime)

    const link = document.createElement("a"),
          time = Math.round(new Date().getTime() / 1000)
    let   hashStr = ''
    if (seed) { hashStr += '-s='+ seed.hash }
    link.download = `${document.title}-${time}${hashStr}.svg`
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
  }

  makeLine(a, b, stroke = this.def.stroke, strokeW = this.def.strokeW) {
    let line = document.createElementNS(this.ns, 'line')
    line.setAttribute('x1', a.x)
    line.setAttribute('y1', a.y)
    line.setAttribute('x2', b.x)
    line.setAttribute('y2', b.y)
    line.setAttribute('stroke', stroke)
    line.setAttribute('stroke-width', strokeW)
    this.stage.append(line)
    return line
  }

  makeCircle(c, r = 5, fill = this.def.fill, stroke = this.def.stroke, strokeW = this.def.strokeW) {
    let circle = document.createElementNS(this.ns, 'circle')
    circle.setAttribute('cx', c.x)
    circle.setAttribute('cy', c.y)
    circle.setAttribute('r', r)
    circle.setAttribute('fill', fill)
    circle.setAttribute('stroke', stroke)
    circle.setAttribute('stroke-width', strokeW)
    this.stage.append(circle)
    return circle
  }

  makeCircles(iA, r = 5, fill = '#f00', stroke = 'transparent', strokeW = this.def.strokeW) {
    let oA = []
    for (let c = 0; c < iA.length; c++) {
      let circle = svg.makeCircle(iA[c], r, fill, stroke, strokeW)
      oA.push(circle)
    }
    return oA
  }

  makeEllipse(c, rx, ry, fill = this.def.fill, stroke = this.def.stroke, strokeW = this.def.strokeW) {
    let ellipse = document.createElementNS(this.ns, 'ellipse')
    ellipse.setAttribute('cx', c.x)
    ellipse.setAttribute('cy', c.y)
    ellipse.setAttribute('rx', rx)
    ellipse.setAttribute('ry', ry)
    ellipse.setAttribute('fill', fill)
    ellipse.setAttribute('stroke', stroke)
    ellipse.setAttribute('stroke-width', strokeW)
    this.stage.append(ellipse)
    return ellipse
  }

  makeRect(pt, w, h, fill = 'transparent', stroke = this.def.stroke, strokeW = this.def.strokeW) {
    let rect = document.createElementNS(this.ns, 'rect')
    rect.setAttribute('x', pt.x)
    rect.setAttribute('y', pt.y)
    rect.setAttribute('width', w)
    rect.setAttribute('height', h)
    rect.setAttribute('fill', fill)
    rect.setAttribute('stroke', stroke)
    rect.setAttribute('stroke-width', strokeW)
    this.stage.append(rect)
    return rect
  }

  makeRectPts(a, b, fill = 'transparent', stroke = this.def.stroke, strokeW = this.def.strokeW) {
    let rect = document.createElementNS(this.ns, 'rect')
    rect.setAttribute('x', a.x)
    rect.setAttribute('y', a.y)
    rect.setAttribute('width', b.x - a.x)
    rect.setAttribute('height', b.y - a.y)
    rect.setAttribute('fill', fill)
    rect.setAttribute('stroke', stroke)
    rect.setAttribute('stroke-width', strokeW)
    this.stage.append(rect)
    return rect
  }

  makePath(d = 'M 0,0 ', fill = this.def.fill, stroke = this.def.stroke, strokeW = this.def.strokeW) {
    let path = document.createElementNS(this.ns, 'path')
    path.setAttribute('d', d)
    path.setAttribute('fill', fill)
    path.setAttribute('stroke', stroke)
    path.setAttribute('stroke-width', strokeW)
    this.stage.append(path)
    return path
  }
}



/////// PATHPOINT.
/////// Helper class to construct paths programmatically etc.
/////// Might be included in path directly.
/////// Might also just be a Vector().

class pPt {
  constructor(pt, type = 'LINE', t = 0.5, d = 0.5) {
    this.b = pt
    this.type = type
    this.t = t // not sure if this makes sense here.
    this.d = d // not sure if this makes sense here.
    this.cp
  }
}




/////// PATH.
/////// Helper class to make those d-strings etc.

class Path {
  constructor(pts = [], close = false) {
    this.pts = pts
    this.close = close
  }

  // addPt(pt, type, t, d) {
  //   this.pts.push(new pPt(pt, type, t, d))
  // }

  // Path from pathPoints with individual properties.

  buildPath(close = this.close) {
    let str = 'M '
    for (let i = 0; i < this.pts.length; i++) {
      let pt = this.pts[i]
      switch(i) {
        case(0):
          str += `${pt.x} ${pt.y}`
          break
      }
    }
  }

  // Polygon

  buildPolygon(close = this.close) {
    let str = 'M '
    for (let i = 0; i < this.pts.length; i++) {
      let pt = this.pts[i]
      switch(i) {
        case(0):
          str += `${pt.x} ${pt.y}`
          break
        default:
          str += ` L ${pt.x} ${pt.y}`
          break
      }
    }
    if (close) {str += ' Z'}
    return str
  }

  // Quadratic Bezier

  getControlPointQuad(a, b, t = 0.5, d = 0.5) {
    let m = b.sub(a)
    let p = lerp(a, b, d)
    let perp = nVec(-m.norm().y, m.norm().x)
    let amp = t * ( dist(a, b) / 2 )
  
    let cp = nVec(
      p.x + amp * perp.x,
      p.y + amp * perp.y
    )
    return cp
  }

  buildQuadBez(t = .5, d = .5, close = false) {
    let str = 'M '
    for (let i = 0; i < this.pts.length; i++) {
      let pt = this.pts[i]
      let cp
      switch(i) {
        case 0:
          str += `${pt.x} ${pt.y}`
          break
        case this.pts.length-1:
          cp = this.getControlPointQuad(pts[i-1], pt, t, d)
          str += ` S ${cp.x} ${cp.y} ${pt.x} ${pt.y}`
          if (close) {
            let tt = t * -1
            let ccp = this.getControlPointQuad(pt, pts[0], tt, d)
            str += ` S ${cp.x} ${cp.y} ${pts[0].x} ${pts[0].y}`
          }
          break
        default:
          cp = this.getControlPointQuad(pts[i-1], pt, t, d)
          str += ` S ${cp.x} ${cp.y} ${pt.x} ${pt.y}`
          break
      }
    }
    if (close) {str += ' Z'}
    return str
  }

  // Cubic Bezier / Spline

  getControlPointsSpline(p0, p1, p2, t) {
    // adapted from this: http://scaledinnovation.com/analytics/splines/aboutSplines.html
    // Builds Control Points for p1!!
    let d01 = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2)); // distance between pt1 and pt2
    let d12 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)); // distance between pt2 and pt3
    let fa = t * d01 / (d01+d12);   // scaling factor for triangle Ta
    let fb = t * d12 / (d01+d12);   // ditto for Tb, simplifies to fb=t-fa
    let cp1x = p1.x - fa * (p2.x - p0.x);    // x2-x0 is the width of triangle T
    let cp1y = p1.y - fa * (p2.y - p0.y);    // y2-y0 is the height of T
    let cp2x = p1.x + fb * (p2.x - p0.x);
    let cp2y = p1.y + fb * (p2.y - p0.y);  
    return [new Vec(cp1x, cp1y), new Vec(cp2x, cp2y)]
  }

  buildSpline(t = .4, close = this.close) {
    // doesn't work if pts.length < 3 
    // could be avoided with case 1 && !pts.length-1 (somehow)
    let pts = this.pts
    let str = 'M '
    for (let i = 0; i < pts.length; i++) {
      let p0, p1, p2, cPts
      switch(i) {
        case 0:
          p0 = pts[pts.length-1]
          p1 = pts[i]
          p2 = pts[i+1]
          p1.cPts = this.getControlPointsSpline(p0, p1, p2, t)
          str += `${p1.x} ${p1.y}`
          break
        case 1:
          p0 = pts[i-1]
          p1 = pts[i]
          p2 = pts[i+1]
          p1.cPts = this.getControlPointsSpline(p0, p1, p2, t)
          if (close) {
            str += `C ${p0.cPts[1].x} ${p0.cPts[1].y} ${p1.cPts[0].x} ${p1.cPts[0].y} ${p1.x} ${p1.y} `
          } else {
            str += `Q ${p1.cPts[0].x} ${p1.cPts[0].y} ${p1.x} ${p1.y} `
          }
          break
        case pts.length-1:
          p0 = pts[i-1]
          p1 = pts[i]
          p2 = pts[0]
          p1.cPts = this.getControlPointsSpline(p0, p1, p2, t)
          if (close) {
            str += `C ${p0.cPts[1].x} ${p0.cPts[1].y} ${p1.cPts[0].x} ${p1.cPts[0].y} ${p1.x} ${p1.y} `
            str += `C ${p1.cPts[1].x} ${p1.cPts[1].y} ${p2.cPts[0].x} ${p2.cPts[0].y} ${p2.x} ${p2.y} Z`
          } else {
            str += `Q ${p0.cPts[1].x} ${p0.cPts[1].y} ${p1.x} ${p1.y} `
          }
          break
        default:
          p0 = pts[i-1]
          p1 = pts[i]
          p2 = pts[i+1]
          cPts = this.getControlPointsSpline(p0, p1, p2, t)
          p1.cPts = cPts
          str += `C ${p0.cPts[1].x} ${p0.cPts[1].y} ${p1.cPts[0].x} ${p1.cPts[0].y} ${p1.x} ${p1.y} `
          break
      }
    }
    return str
  }
}



/////// VECTORS.
/////// Basically x/y-Points, with some extras.

class Vec {
  constructor(x, y, z = 0) {
    this.x = x
    this.y = y
    this.z = z
    this.m = Math.sqrt(this.x**2 + this.y**2 + this.z**2) // Magnitude
  }
  norm() {
    let xn = this.x / this.m,
        yn = this.y / this.m,
        zn = this.z / this.m
    return new Vec(xn, yn, zn)
  }
  // oV = other Vec
  add(oV) {
    let xn = this.x + oV.x,
        yn = this.y + oV.y,
        zn = this.z + oV.z
    return new Vec(xn, yn, zn)
  }
  sub(oV) {
    let xn = this.x - oV.x, 
        yn = this.y - oV.y,
        zn = this.z - oV.z
    return new Vec(xn, yn, zn)
  }
  cross(oV) {
    let xn = this.y * oV.z - this.z * oV.y,
        yn = this.z * oV.x - this.x * oV.z,
        zn = this.x * oV.y - this.y * oV.x
    return new Vec(xn, yn, zn)
  }
  dot(oV) {
    return this.x * oV.x + this.y * oV.y + this.z * oV.z
  }
  ang(oV) {
    return Math.acos( this.norm().dot(oV.norm()) / (this.norm().m * oV.norm().m) )
  }
  lerp(oV, t) {
    let xn = (1 - t) * this.x + oV.x * t,
        yn = (1 - t) * this.y + oV.y * t,
        zn = (1 - t) * this.z + oV.z * t
    return new Vec(xn, yn, zn)
  }
  mid(oV) {
    let xn = (this.x + oV.x) / 2,
        yn = (this.y + oV.y) / 2,
        zn = (this.z + oV.z) / 2
    return new Vec(xn, yn, zn)
  }
}

/////// VECTORS. 
/////// Shorthands & Utility.

function nVec(x, y, z) { 
  return new Vec(x, y, z) 
}

function dist(a, b) {
  let xx = a.x - b.x,
      yy = a.y - b.y,
      zz = a.z - b.z
  return Math.sqrt(xx**2 + yy**2 + zz**2)
}

function lerp(a, b, t) {
  let xn = (1 - t) * a.x + b.x * t,
      yn = (1 - t) * a.y + b.y * t,
      zn = (1 - t) * a.z + b.z * t
  return new Vec(xn, yn, zn)
}

function mid(a, b) {
  let xn = (a.x + b.x) / 2,
      yn = (a.y + b.y) / 2,
      zn = (a.z + b.z) / 2
  return new Vec(xn, yn, zn)
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z
}

function ang(a, b) {
  return Math.acos( dot(a.norm(), b.norm()) / (a.norm().m * b.norm().m) )
}

function slope(a, b) {
  return (b.y - a.y) / (b.x - a.x)
}

function perpSlope(a, b) {
  return -1 / slope(a, b)
}


/////// RANDOM & SEED.

class Hash {
  constructor() {
    this.alphabet = '123456789abcdefghijklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ'
    this.init()
    this.hashTrunc = this.hash.slice(2);
    this.regex = new RegExp('.{' + ((this.hashTrunc.length / 4) | 0) + '}', 'g');
    this.hashes = this.hashTrunc.match(this.regex).map((h) => this.b58dec(h));
    this.rnd = this.sfc32(...this.hashes)
  }
  init() {
    const params = new URLSearchParams(location.search);
    if (params.has('seed')) {
      this.hash = params.get('seed');
    } else {
      this.hash = this.new()
    }
    console.log("Seed: ?seed=" + this.hash);
  }
  new() {
    let str =
      'oo' +
      Array(49)
        .fill(0)
        .map((_) => this.alphabet[(Math.random() * this.alphabet.length) | 0])
        .join("")
    return str
  }
  update() {
    let nStr = this.new()
    this.hash = nStr
    return nStr
  }
  b58dec = (str) =>
  [...str].reduce(
    (p, c) => (p * this.alphabet.length + this.alphabet.indexOf(c)) | 0,
    0
  )
  sfc32 = (a, b, c, d) => {
    return () => {
      a |= 0;
      b |= 0;
      c |= 0;
      d |= 0;
      var t = (((a + b) | 0) + d) | 0;
      d = (d + 1) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
  };
}

// Make this a bit more foolproof? If seed ist not defined (not undefined), it breaks...
// maybe some global defaults would help after all.
function rnd() {
  if (seed) {
    return seed.rnd()
  } else {
    return Math.random()
  }
}

function rndInt(min, max) {
  return Math.floor(rnd() * (max - min + 1)) + min
}

function coinToss(chance = 50) {
  if (rnd() <= chance / 100) {
    return true
  } else {
    return false
  }
}


/////// COLORS
/////// Built with Chat's help. 10-07-2024.
/////// Seems a bit overly complicated.
/////// Needs refinement, so e.g. rgba strings get updated automatically if a value (r, g, b or a) is changed.


class Color {
  constructor(v1 = 0, v2 = 0, v3 = 0, a = 1, format = 'rgb') {
    if (format === 'rgb') {
      this.fromRGB(v1, v2, v3, a)
    } else if (format === 'hsl') {
      this.fromHSL(v1, v2, v3, a)
    } else {
      throw new Error('Unsupported format. Use "rgb" or "hsl".')
    }
  }

  static fromString(str) {
    if (str.startsWith('rgba')) {
      const rgba = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      return new Color(parseInt(rgba[1]), parseInt(rgba[2]), parseInt(rgba[3]), parseFloat(rgba[4]), 'rgb')
    } else if (str.startsWith('rgb')) {
      const rgb = str.match(/rgb?\((\d+),\s*(\d+),\s*(\d+)\)/);
      return new Color(parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3]), 1, 'rgb')
    } else if (str.startsWith('hsla')) {
      const hsla = str.match(/hsla?\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/)
      return new Color(parseInt(hsla[1]), parseFloat(hsla[2]), parseFloat(hsla[3]), parseFloat(hsla[4]), 'hsl')
    } else if (str.startsWith('hsl')) {
      const hsl = str.match(/hsl?\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/);
      return new Color(parseInt(hsl[1]), parseFloat(hsl[2]), parseFloat(hsl[3]), 1, 'hsl')
    } else {
      throw new Error('Unsupported color string format.')
    }
  }

  fromRGB(r = 0, g = 0, b = 0, a = 1) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
    this.updateRGBA()
    this.updateHSL()
  }

  fromHSL(h, s, l, a = 1) {
    this.h = h
    this.s = s
    this.l = l
    this.a = a
    this.updateHSLA()
    this.updateRGB()
  }

  updateRGBA() {
    this.rgba = `rgba(${this.r},${this.g},${this.b},${this.a})`
  }

  updateHSLA() {
    this.hsla = `hsla(${this.h},${this.s}%,${this.l}%,${this.a})`
  }

  updateRGB() {
    const s = this.s / 100
    const l = this.l / 100

    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs((this.h / 60) % 2 - 1))
    const m = l - c / 2

    let [r, g, b] = (() => {
      if (0 <= this.h && this.h < 60) {
        return [c, x, 0]
      } else if (60 <= this.h && this.h < 120) {
        return [x, c, 0]
      } else if (120 <= this.h && this.h < 180) {
        return [0, c, x]
      } else if (180 <= this.h && this.h < 240) {
        return [0, x, c]
      } else if (240 <= this.h && this.h < 300) {
        return [x, 0, c]
      } else {
        return [c, 0, x]
      }
    })()

    this.r = Math.round((r + m) * 255)
    this.g = Math.round((g + m) * 255)
    this.b = Math.round((b + m) * 255)
    this.updateRGBA()
  }

  updateHSL() {
    const r = this.r / 255, g = this.g / 255, b = this.b / 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2

    if (max === min) {
      h = s = 0 // achromatic
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h *= 60
    }

    this.h = h
    this.s = s * 100
    this.l = l * 100
    this.updateHSLA()
  }

  toHSLArr() {
    return [this.h, this.s, this.l, this.a]
  }

  toRGBArr() {
    return [this.r, this.g, this.b, this.a]
  }
}

function rndColRGB(r = rndInt(0,255), g = rndInt(0,255), b = rndInt(0,255), a = 1) {
  return new Color(r, g, b, a, 'rgb')
}


// getRGBAValues function to extract the individual RGBA values from an rgba or rgb color string
function getColorValues(color) {
  // Regular expressions for rgba, rgb, hsla, and hsl formats
  const rgbaRegex = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)$/
  const hslaRegex = /^hsla?\((\d+),\s*(\d+)%?,\s*(\d+)%?(?:,\s*(\d*\.?\d+))?\)$/

  let match

  if ((match = color.match(rgbaRegex))) {
    // Extract the rgba values
    const r = parseInt(match[1], 10)
    const g = parseInt(match[2], 10)
    const b = parseInt(match[3], 10)
    const a = match[4] !== undefined ? parseFloat(match[4]) : 1 // Default alpha to 1 if not present

    return { format: 'rgba', r, g, b, a }
  } else if ((match = color.match(hslaRegex))) {
    // Extract the hsla values
    const h = parseInt(match[1], 10)
    const s = parseInt(match[2], 10)
    const l = parseInt(match[3], 10)
    const a = match[4] !== undefined ? parseFloat(match[4]) : 1 // Default alpha to 1 if not present

    return { format: 'hsla', h, s, l, a }
  } else {
    throw new Error('Invalid color format. Expected rgba, rgb, hsla, or hsl format.')
  }
}


/////// UTILITY FUNCTIONS.

function mapValues(val, minIn, maxIn, minOut, maxOut) {
  val = (val - minIn) / (maxIn - minIn)
  return minOut + val * (maxOut - minOut)
}

function rad(deg) {
  return deg * (Math.PI / 180)
}

function deg(rad) {
  return rad / (Math.PI / 180)
}

// Divide length between two points. Returns intermediary Points.
// With a little help from my friend. 10-07-2024
function divLength(a, b, nSeg, incStartEnd = false, t = 1 / nSeg, oA = []) {
  if (incStartEnd) {
    oA.push(a)
  }

  if (t === 'RND') {
    let rndVals = []

    // Generate random values
    for (let i = 0; i < nSeg - 1; i++) {
      rndVals.push(rnd())
    }

    // Sort the random values
    // Don't get why they need to be sorted, but it works.
    rndVals.sort((x, y) => x - y)

    // Interpolate points based on sorted random values
    for (let i = 0; i < nSeg - 1; i++) {
      let t = rndVals[i]
      let newPoint = a.lerp(b, t)
      oA.push(newPoint)
    }
  } else {
    // Linear interpolation
    for (let i = 0; i < nSeg - 1; i++) {
      oA.push(a.lerp(b, (i + 1) * t))
    }
  }

  if (incStartEnd) {
    oA.push(b)
  }

  return oA
}

function shuffle(iA) {
  let oA = Array.from(iA) // Copy Array. Only one dimensional arrays!
  for (let i = oA.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [oA[i], oA[j]] = [oA[j], oA[i]];
  }
  return oA;
}




/////// INTERACTION, KEYS & FILEHANDLING

const keyHandlers = (event) => {
  switch (event.key) {
    case 'd':
      svg.save()
      break
    case 'n': {
      const myURL = new URL(window.location.href)
      const newHash = seed.new()
      myURL.searchParams.set('seed', newHash)
      window.location.href = myURL.href
      break
    }
    case 'ArrowLeft':
      history.back()
      break
    case 'ArrowRight':
      history.forward()
      break
    }
}
document.addEventListener('keydown', keyHandlers)


// Set Current Folder as Filename/Title
function getDirName() {
  const location = window.location.pathname
  const path = location.substring(0, location.lastIndexOf("/"))
  const dirName = path.substring(path.lastIndexOf("/")+1)
  return dirName
}
document.title = getDirName()







// My Only Friend, The End.