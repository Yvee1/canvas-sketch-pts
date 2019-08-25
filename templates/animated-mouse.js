const canvasSketch = require('canvas-sketch');
import {Pt} from "pts";
import {ContextForm, createMouse} from "../helpers.js";

const settings = {
  dimensions: [1024,  1024],
  animate: true,
};

const sketch = ({ canvas, context, width, height }) => {
  const mouse = createMouse(canvas);
  const form = new ContextForm(context, width, height);
  const center = new Pt([width/2, height/2]);

  return ({ width, height, styleWidth, styleHeight, playhead }) => {
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
