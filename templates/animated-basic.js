const canvasSketch = require('canvas-sketch');
import {ContextForm} from "../helpers.js";
import {Pt} from "pts";

const settings = {
  dimensions: [1024,  1024],
  animate: true,
};

const sketch = ({ context, width, height }) => {
  const form = new ContextForm(context, width, height);
  return ({ width, height, time }) => {
    form.clear();
    const center = new Pt([width/2, height/2]);

    form.fillOnly("#09f").point(center.$add(
      width/3 * Math.cos(time),
      width/3 * Math.sin(time)), width/10, "circle");
  };
};

canvasSketch(sketch, settings);