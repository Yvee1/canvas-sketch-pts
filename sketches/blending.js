const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
import {ContextForm} from "../helpers.js";
import {Pt, Circle, Num, Vec, Rectangle} from "pts";

const settings = {
  dimensions: [512, 512],
  animate: true,
  duration: 10,
  fps: 50,
};

function loopNoise (x, y, t, scale = 1, offset = 0) {
  const duration = scale;
  const current = t * scale;
  return ((duration - current) * random.noise3D(x, y, current + offset) + current * random.noise3D(x, y, current - duration + offset)) / duration;
}

const sketch = ({ context, width, height }) => {
  const form = new ContextForm(context, width, height);
  const margin = width/10;

  random.setSeed(random.getRandomSeed());
  // random.setSeed("20532");
  console.log(random.getSeed());

  const palette = random.shuffle(random.pick(palettes));

  const createCircles = amount => {
    const circles = [];
    for (let i = 0; i < amount; i++){
      circles.push({
        pos: new Pt(
        random.range(margin, width - margin),
        random.range(margin, height - margin)
        ),
        speed: random.range(1.5, 2.5)**3,
        blue: random.range(0, 200),
        color: random.pick(palette.slice(1))
      })
    }
    return circles
  }

  const circles = createCircles(80);

  form.background(palette[0]);
  return ({ width, height, playhead }) => {
    form.clear();
    // form._ctx.globalCompositeOperation = "difference";
    const center = new Pt([width/2, height/2]);

    // let size = Num.clamp(time*2, 0, 3);
    let size = width/1000;
    // form.fillOnly(palette[0]).rect(Rectangle.fromCenter(center, width-margin/2))
    // form._ctx.globalCompositeOperation = "difference";
    circles.forEach((circle, i) => {
      // form.fillOnly(`rgb(${i%2==0?255:0}, ${i%2==1?255:0}, ${circle.blue})`).circle(Circle.fromCenter(circle.pos.$add(50*loopNoise(...circle.pos, playhead, 1, 0), 100*loopNoise(...circle.pos, playhead, 1, 50)), size * circle.speed));
      form.fillOnly(circle.color).circle(Circle.fromCenter(circle.pos.$add(50*loopNoise(...circle.pos, playhead, 100/(circle.speed**1.2), 0), 50*loopNoise(...circle.pos, playhead, 100/(circle.speed**1.2), 50)), size * circle.speed));
    });
  };
};

canvasSketch(sketch, settings);