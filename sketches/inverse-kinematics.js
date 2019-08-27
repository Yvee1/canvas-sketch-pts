const canvasSketch = require('canvas-sketch');
import {Pt, Num} from "pts";
import {ContextForm, createMouse} from "../helpers.js";

import {Segment} from "./segment.js"

const settings = {
  dimensions: [1024,  1024],
  animate: true,
};

const sketch = ({ canvas, context, width, height }) => {
  const mouse = createMouse(canvas);
  const form = new ContextForm(context, width, height);
  form.background("azure");
  const center = new Pt([width/2, height/2]);

  const amount = 200;
  let current = new Segment(...center, 2, 1);

  for (let i = 0; i < amount; i++){
    const next = Segment.spawnAt(current, 2, i+1);
    current = next;
  }

  const end = current;

  return ({ width, height, styleWidth, styleHeight, playhead }) => {
    form.clear();
    
    // Normalize pixel mouse opsition to 0..1 UV coordinates
    const u = mouse.position[0] / styleWidth;
    const v = mouse.position[1] / styleHeight;

    // Un-normalize to our rendering units
    const pointer = new Pt([u * width, v * height]);

    end.follow(...pointer);
    end.inverse();
    end.show(form);
    let next = end.parent;
    while (next !== null) {
      next.follow(...next.child.a)
      next.inverse();
      next.show(form, Num.lerp(1, 20, next.i/amount));
      next = next.parent;
    }

    // seg2.follow(...pointer);
    // seg2.inverse();
    // seg2.show(form);

    // seg.follow(...seg2.a);
    // seg.inverse();
    // seg.show(form);
  };
};

canvasSketch(sketch, settings);
