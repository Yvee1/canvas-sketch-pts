const canvasSketch = require('canvas-sketch');
import {ContextForm} from "../helpers.js";
const random = require('canvas-sketch-util/random')
import {Pt, Group, Circle, Polygon} from "pts";

const TWO_PI = 2 * Math.PI;

const settings = {
  dimensions: [1024,  1024],
  animate: true,
  duration: 4,
  fps: 50
};

const sketch = ({ context, width, height }) => {
  const form = new ContextForm(context, width, height);

  const wobbly = (pt, radius, deformation, spikyness, t, offset) => {
    const amt = 80;
    const points = new Array(amt);

    for (let i = 0; i < amt; i++){
      let r = radius + random.noise4D(10*Math.sin(i/amt * TWO_PI), 10*Math.cos(i/amt * TWO_PI), Math.cos(t * TWO_PI)*10 + offset, Math.sin(t * TWO_PI)*10 + offset, spikyness, deformation);
      points[i] = new Pt(pt.x + r * Math.cos(i/amt * TWO_PI),
                        pt.y + r * Math.sin(i/amt * TWO_PI));
    }
    form.polygon(Group.fromPtArray(points));
  }

  const pebble = (pt, radius, seed) => {
    const amt = 20;
    const points = new Array(amt);

    const offset = seed * 10;
    for (let i = 0; i < amt; i++){
      let r = radius + random.noise2D(10*Math.sin(i/amt * TWO_PI) + offset, 10*Math.cos(i/amt * TWO_PI) + offset, 2, 1);
      points[i] = new Pt(pt.x + r * Math.cos(i/amt * TWO_PI),
                        pt.y + r * Math.sin(i/amt * TWO_PI));
    }
    return Group.fromPtArray(points);
  }

  const wobblyLine = (pt1, pt2) => {
    const amt = 100;
    const points = new Array(amt);

    for (let i = 0; i < amt+1; i++){
      const x = i/amt * (pt2.x - pt1.x);
      const y = i/amt * (pt2.y - pt1.y)
      const xoff = random.noise1D(y, 0.01, 15);
      points[i] = pt1.$add(x + xoff, y);
    }
    form.line(Group.fromPtArray(points));
  }

  const center = (new Pt([width/2, height/2]));
  const pebbles1 = [];
  const r2 = 455;
  const amt2 = 70;

  let seed = 0;
  for (let a = 0; a < TWO_PI; a += TWO_PI/amt2){
    const pt = center.$add(r2 * Math.cos(a), r2* Math.sin(a));
    pebbles1.push(pebble(pt, 10, seed));
    seed = (seed+1) % 2;

  }

  const pebbles2 = [];
  const r3 = 480;
  const amt3 = 170;
  const size = 5;

  seed = 0;
  for (let a = 0; a < TWO_PI; a += TWO_PI/amt3){
    const pt = center.$add(r3 * Math.cos(a), r3* Math.sin(a));
    pebbles2.push(pebble(pt, size, seed));
    seed = (seed+1) % 2;
  }

  const circles = [];
  // const c1 = Circle.fromCenter(center, 20);
  // circles.push(c1);
  // const p1 = Polygon.fromCenter(center, 400, 5);
  // const p2 = Polygon.fromCenter(center, 400, 5);
  const p1 = Polygon.fromCenter(center, 439, 3);
  p1.rotate2D(TWO_PI/12, center);
  const p2 = Polygon.fromCenter(center, 439, 3);
  p2.rotate2D(-TWO_PI/12, center);
  console.log(Polygon.intersectPolygon2D(p1, p2));
  const p1p2pts = Polygon.intersectPolygon2D(p1, p2);

  circles.push(Circle.fromCenter(center, 490))
  circles.push(Circle.fromCenter(center, 471))
  circles.push(Circle.fromCenter(center, 439))
  circles.push(Circle.fromCenter(center, 190))
  circles.push(Circle.fromCenter(center, 192))
  circles.push(Circle.fromCenter(center, 210))

  return ({ width, height, playhead }) => {
    form.background("white")
    form.clear();

    // form.strokeOnly("black", 7);

    form.fillOnly("black");

    wobbly(center, 85, 15, 0.1, playhead, 20);

    // form.fill("#ff6");

    const r1 = 150;
    const amt1 = 8;
    for (let i = 0; i < amt1; i++){
      const a = i/amt1 * TWO_PI;
      wobbly(center.$add(r1 * Math.cos(a + playhead * TWO_PI/(amt1/2)), r1 * Math.sin(a + playhead * TWO_PI / (amt1/2))), 30, 5, 0.1, playhead, (i % 2) * 10);
    }

    // pebbles.rotate2D(playhead * TWO_PI / amt2, center);
    for (const p of pebbles1){
      p.rotate2D(playhead * TWO_PI / amt2 * 2, center);
      form.polygon(p);
      p.rotate2D(-playhead * TWO_PI / amt2 * 2, center);
    }

    for (const p of pebbles2){
      p.rotate2D(playhead * TWO_PI / amt3 * 2, center);
      form.polygon(p);
      p.rotate2D(-playhead * TWO_PI / amt3 * 2, center);
    }


      // wobbly(center.$add(r2 * Math.cos(a + playhead * TWO_PI / 50), r2 * Math.sin(a + playhead * TWO_PI / 50)), 5, 2, 0, playhead, 2**a);
      // form.circle(Circle.fromCenter(center.$add(r2 * Math.cos(a + playhead * TWO_PI/amt2), r2 * Math.sin(a + playhead * TWO_PI/amt2)), 5))
      form.strokeOnly("black", 1.5);
      for (const c of circles){
        form.circle(c);
      }
    // context.shadowColor = 'rgba(100, 200, 200, 1)';
    // context.shadowColor = 'rgba(0, 200, 200, 0.5)';
    // context.shadowBlur = 10;

      form.polygon(p1);
      form.polygon(p2);
      form.fill("white");
      context.shadowBlur = 0;
      p1p2pts.forEach(pt => form.circle([pt, [5, 5]]));
  };
};

canvasSketch(sketch, settings);