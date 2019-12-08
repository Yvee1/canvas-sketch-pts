const canvasSketch = require('canvas-sketch');
import {ContextForm} from "../helpers.js";
const random = require('canvas-sketch-util/random')
import {Pt, Group} from "pts";

const TWO_PI = 2 * Math.PI;

const settings = {
  dimensions: [1024,  1024],
  animate: true,
  duration: 4,
  fps: 50
};

const sketch = ({ context, width, height }) => {
  const form = new ContextForm(context, width, height);

  const wobbly = (pt, radius, playhead, offset) => {
    const amt = 20;
    const points = new Array(amt);

    for (let i = 0; i < amt; i++){
      let r = radius + random.noise4D(10*Math.sin(i/amt * TWO_PI), 10*Math.cos(i/amt * TWO_PI), Math.cos(playhead * TWO_PI)*10 + offset, Math.sin(playhead * TWO_PI)*10 + offset, .05, radius/10);
      points[i] = new Pt(pt.x + r * Math.cos(i/amt * TWO_PI),
                        pt.y + r * Math.sin(i/amt * TWO_PI));
    }
    form.polygon(Group.fromPtArray(points));
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

  return ({ width, height, playhead }) => {
    form.background("lightgreen")
    form.clear();
    const center = (new Pt([width/2, height*.4])).add(random.noise2D(Math.cos(playhead * TWO_PI), Math.sin(playhead * TWO_PI), .2, 10), random.noise2D(Math.cos(playhead * TWO_PI+3240), Math.sin(playhead * TWO_PI+3240), .1, 5));

    form.strokeOnly("black", 7);
    wobblyLine(new Pt(width/2, height), center);
    // form.line(Group.fromPtArray([new Pt(100, 100), new Pt(500, 500), new Pt (400, 1000)]));

    form.fill("#ff6");
    // form.fill("black");

    let amt = 6;
    let offset = Math.random();
    
    const poss1 = [];
    for (let i = 0; i < amt; i++){
      const range = 50;
      const pos = center.$add(range * Math.cos(i / amt * TWO_PI), range * Math.sin(i/amt * TWO_PI));
      poss1.push(pos);
    }

    amt = 13;
    offset = 2.4;
    const poss2 = [];
    for (let i = 0; i < amt; i++){
      const range = 95;
      const pos = center.$add(range * Math.cos(i / amt * TWO_PI), range * Math.sin(i/amt * TWO_PI))
      poss2.push(pos);
    }

    amt = 20;
    offset = 2
    const poss3 = [];
    for (let i = 0; i < amt; i++){
      const range = 140;
      const pos = center.$add(range * Math.cos(i / amt * TWO_PI + offset), range * Math.sin(i/amt * TWO_PI + offset));
      poss3.push(pos);
    }

    amt = 27;
    offset = 4;
    const poss4 = [];
    for (let i = 0; i < amt; i++){
      const range = 187;
      const pos = center.$add(range * Math.cos(i / amt * TWO_PI + offset), range * Math.sin(i/amt * TWO_PI + offset));
      poss4.push(pos);
    }

    amt = 38;
    offset = 1;
    const poss5 = [];
    for (let i = 0; i < amt; i++){
      const range = 225;
      const pos = center.$add(range * Math.cos(i / amt * TWO_PI + offset), range * Math.sin(i/amt * TWO_PI + offset));
      poss5.push(pos);
    }

    form.strokeOnly("black", 1.5);

    poss1.forEach((pos, i) => {
      wobblyLine(center, pos);
    });
    
    poss2.forEach((pos, i) => {
      wobblyLine(center, pos);
    });

    poss3.forEach((pos, i) => {
      wobblyLine(center, pos);
    });

    poss4.forEach((pos, i) => {
      wobblyLine(center, pos);
    });

    poss5.forEach((pos, i) => {
      wobblyLine(center, pos);
    });

    form.stroke("black", 2.5).fill("white");

    poss1.forEach((pos, i) => {
      wobbly(pos, 21, playhead, i * 5);
    });

    poss2.forEach((pos, i) => {
      wobbly(pos, 20, playhead, i * 5)
    });

    poss3.forEach((pos, i) => {
      wobbly(pos, 20, playhead, i * 5)
    });

    poss4.forEach((pos, i) => {
      wobbly(pos, 19, playhead, i * 5)
    });    

    poss5.forEach((pos, i) => {
      wobbly(pos, 15, playhead, i * 5)
    });    



    wobbly(center, 22, playhead, 20);
  };
};

canvasSketch(sketch, settings);