const canvasSketch = require('canvas-sketch');
import {Pt, Num} from "pts";
import {ContextForm, createMouse} from "../helpers.js";

import {Segment, Fish} from "./kinematics.js"

const settings = {
  dimensions: [512,  512],
  animate: true,
  fps: 50,
  duration: 5,
};

const sketch = ({ canvas, context, width, height }) => {
  const mouse = createMouse(canvas);
  const form = new ContextForm(context, width, height);
  form.background("azure");
  const center = new Pt([width/2, height/2]);

  const fish = new Fish(form, ...center, 300, 50);
  const fish2 = new Fish(form, width-100, height, 300, 50, "deeppink");
  let pause = false;
  let count = 0;

  return ({ width, height, styleWidth, styleHeight, time, playhead }) => {
    form.clear();
    
    // Normalize pixel mouse opsition to 0..1 UV coordinates
    const u = mouse.position[0] / styleWidth;
    const v = mouse.position[1] / styleHeight;

    // Un-normalize to our rendering units
    const pointer = new Pt([u * width, v * height]);

    if(playhead < 0.001){
      count++;
      if (count > 2){
        pause = true;
      }
    }

    if (playhead == 0){
      pause = false;
    }

    if (!pause){
    // let x = Math.cos(time) - Math.cos(3 * time)**3;
    // let y = Math.sin(3 * time) - Math.sin(time)**3;
    const x = Math.cos(3*playhead*2*Math.PI);
    const y = Math.sin(2*playhead*2*Math.PI);
    const tx = width/2 + x * 150;
    const ty = height/2 + y * 150;

    fish.follow(tx, ty);
    fish2.follow(width-tx, ty);
    }
    console.log(playhead);
    // form.point([tx, ty], 10, "circle");
  };
};

canvasSketch(sketch, settings);
