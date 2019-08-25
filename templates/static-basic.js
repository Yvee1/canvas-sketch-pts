const canvasSketch = require('canvas-sketch');
import {ContextForm} from "../helpers.js"
import {Pt} from "pts";

const settings = {
  dimensions: [2048,  2048],
};

const sketch = ({context, width, height}) => {
  const center = new Pt([width/2, height/2]);
  const form = new ContextForm(context, width, height);

  return ({ width, height }) => {
    form.fillOnly("#09f").point(center, width/3, "circle");
  };
};

canvasSketch(sketch, settings);
