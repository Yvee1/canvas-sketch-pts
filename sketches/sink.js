const canvasSketch = require('canvas-sketch');
import {ContextForm} from "../helpers.js";
const random = require('canvas-sketch-util/random');
import {Pt, Group} from "pts";

const settings = {
  dimensions: [1024,  1024],
  animate: true,
  fps: 50,
  duration: 2,
};

const sketch = ({ context, width, height }) => {
  const form = new ContextForm(context, width, height);

  const tap = new Tap(3000, width/2, -height*3, width/10, height*4-300);

  return ({ width, height, time }) => {
    form.background("#000")
    form.clear();
    const center = new Pt([width/2, height/2]);

    tap.update();
    tap.lines.forEach(line => {
      form.strokeOnly("#fff8", line.w).line(line.span);
    });

    tap.splashes.forEach(splash => {
      
    });

    // console.log(tap.lines.length);
  };
};

class Tap {
  constructor(n, x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.lines = [];
    this.splashes = [];

    for (let i = 0; i < n; i++){
      this.lines[i] = new Line(new Pt(random.range(x-width/2, x+width/2), random.range(y, y+height)), random.gaussian(2, 0.5), random.gaussian(60, 40));
    }
  }

  update(){
    for (let i = this.lines.length-1; i >= 0; i--){
      const l = this.lines[i];
      l.pos.y += l.s;
      l.update();
      if (l.pos.y > this.y + this.height + l.h/2){
        this.splashes.push(new Splash(l.pos, l.w, l.h))
        this.lines.splice(i, 1);
      }
    }
  }
}

class Line {
  constructor(pos, w, h){
    this.pos = pos;
    this.w = w;
    this.h = h;
    this.s = random.range(20, 40);
    this.span = Group.fromPtArray([pos.$subtract(0, h/2), pos.$add(0, h/2)]);
  }

  update(){
    this.span = Group.fromPtArray([this.pos.$subtract(0, this.h/2), this.pos.$add(0, this.h/2)]);
  }
}

class Splash extends Line {
  constructor(pos, w, h){
    super(pos, w, h);
    this.rot = random.range(0, 2*Math.PI);
  }
}

canvasSketch(sketch, settings);