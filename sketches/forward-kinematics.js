const canvasSketch = require('canvas-sketch');
import {Pt, Num} from "pts";
import {ContextForm} from "../helpers.js";

import {Segment} from "./segment.js"

const settings = {
  dimensions: [1024,  1024],
  animate: true,
};

const sketch = ({ canvas, context, width, height }) => {
  const form = new ContextForm(context, width, height);
  form.background("azure");
  const center = new Pt([width/2, height/2]);

  const amount = 40;
  const root = new Segment(...center, 10, 0);
  let current = root;

  for (let i = 0; i < amount; i++){
    let next = Segment.spawnAt(current, 10, i+1);
    current = next;
  }

  return ({ width, height, styleWidth, styleHeight, playhead }) => {
    form.clear();
    
    let next = root;
    while (next !== null){
      next.wiggle();
      next.forward();
      next.show(form, Num.lerp(20, 1, next.i/amount));
      next = next.child;
    }
    
  };
};

canvasSketch(sketch, settings);
