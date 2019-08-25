const canvasSketch = require('canvas-sketch');
import {ContextForm} from "../helpers.js"
import {Pt, Triangle, Polygon} from "pts";
const palettes = require('nice-color-palettes');
const random = require('canvas-sketch-util/random')

const settings = {
  dimensions: [512,  512],
  animate: true,
  fps: 50,
  duration: 4,
};

const sketch = ({ context, width, height }) => {
  const form = new ContextForm(context, width, height);
  random.setSeed("167297");
  console.log(random.getSeed());

  const palette = random.pick(palettes);

  return ({ width, height, playhead }) => {
    form.background(palette[0]);
    form.clear();

    const center = new Pt([width/2, height/2]);
    const size = new Pt([width, height]);

    const poly = Polygon.fromCenter(center, size.minValue().value / 3, 10);
    poly.rotate2D(Math.sin((playhead * 2 * Math.PI) + 1)/2, center );

    const triangles = poly.segments(2, 1, true);

    const point = center.$add(100 * (random.noise1D(Math.sin(2 * Math.PI * playhead) - 0.5)), 100 * (random.noise1D(100+Math.sin(2 * Math.PI * (playhead)) - 0.5)));
    triangles.map(t => t.push(point));

    context.shadowColor = 'black';
    context.shadowBlur = 15;

    form.fillOnly("#123").polygon(poly);
    
    context.shadowBlur = 1;
    form.fill("green").stroke("#fff", 3).polygons(triangles.map(t => Triangle.medial(t)))
  };
};

canvasSketch(sketch, settings);
