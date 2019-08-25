const canvasSketch = require('canvas-sketch');
import {ContextForm, createMouse} from "../helpers.js"
import {Pt} from "pts";

const settings = {
  dimensions: [2048,  2048],
};

const sketch = ({ canvas, update, width, height, context }) => {
  const mouse = createMouse(canvas, {
    onMove: () => update()
  });

  const form = new ContextForm(context, width, height);
  const center = new Pt([width/2, height/2]);
  
  return ({ width, height, styleWidth, styleHeight }) => {
    form.clear();

    // Normalize pixel mouse opsition to 0..1 UV coordinates
    const u = mouse.position[0] / styleWidth;
    const v = mouse.position[1] / styleHeight;

    // Un-normalize to our rendering units
    const pointer = new Pt([u * width, v * height]);

    form.fillOnly("#09f").point(pointer, width/10, "circle");
  };
};

canvasSketch(sketch, settings);
