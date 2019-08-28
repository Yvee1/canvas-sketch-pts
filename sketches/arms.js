const canvasSketch = require('canvas-sketch');
import {Pt, Num} from "pts";
import {ContextForm, createMouse} from "../helpers.js";

import {Arm} from "./kinematics.js"

const settings = {
  dimensions: [512, 512],
  animate: true,
  fps: 50,
  duration: 3,
};

const sketch = ({ canvas, context, width, height }) => {
  const mouse = createMouse(canvas);
  const form = new ContextForm(context, width, height);
  form.background("rgb(52, 52, 52)");
  const center = new Pt([width/2, height/2]);

  const gap = width/10;
  const arms = [];

  for (let x = 0; x < width; x += gap){
    arms.push(new Arm(form, x, height, width/4, 4).attach(x, height));
  }

  for (let x = 0; x < width; x += gap){
    arms.push(new Arm(form, x, 0, width/4, 4).attach(x, 0));
  }

  for (let y = 0; y < height; y += gap){
    arms.push(new Arm(form, 0, y, width/4, 4).attach(0, y));
  }

  for (let y = 0; y < height; y += gap){
    arms.push(new Arm(form, width, y, width/4, 4).attach(width, y));
  }


  let count = 0;
  let pause = false;

  return ({ width, height, styleWidth, styleHeight, time, playhead }) => {
    form.clear();
    
    // Normalize pixel mouse opsition to 0..1 UV coordinates
    const u = mouse.position[0] / styleWidth;
    const v = mouse.position[1] / styleHeight;

    // Un-normalize to our rendering units
    const pointer = new Pt([u * width, v * height]);

    if(playhead < 0.001){
      count++;
      console.log({count});
      if (count > 1){
        pause = true;
      }
    }

    if (playhead == 0){
      pause = false;
    }

    if (!pause){
      const x = width/2 + 18*Math.cos(playhead*Math.PI*2);
      const y = height/2 + 18*Math.sin(playhead*Math.PI*2);
      arms.forEach(arm => {
        arm.follow(x, y);
        arm.show();
      });
      form.strokeOnly("goldenrod").point([x, y]);
      console.log(playhead);
    }
  };
};

canvasSketch(sketch, settings);
