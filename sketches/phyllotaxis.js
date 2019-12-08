const canvasSketch = require('canvas-sketch');
import {ContextForm} from "../helpers.js";
import {Pt} from "pts";
import * as PIXI from 'pixi.js'
import * as dat from 'dat.gui';

const settings = {
  dimensions: [1000,  1000],
  animate: true,
  duration: 2,
  fps: 50,
  context: 'webgl'
};

const sketch = ({ context, width, height }) => {
  // const form = new ContextForm(context, width, height);
  const colors = [0xC3522C, 0x90A678, 0x47B0F2];

  const canvas = window.document.getElementsByTagName("canvas")[0]

  const app = new PIXI.Application({
      width: width,
      height: height, 
      backgroundColor: 0x134611,
      resolution: window.devicePixelRatio || 1,
      antialias: true,
      view: canvas
  });

  app.ticker.stop();
  app.stage.x = width/2;
  app.stage.y = height/2;

  const phyllo = new Phyllotaxis(app, width, height);
  const gui = new dat.GUI();
  gui.add(phyllo, 'speed', 0, 0.4)
  gui.add(phyllo, 'yoffset', 0, 0.2)

  const graphics = new PIXI.Graphics();
  graphics.beginFill(0x134611);
  graphics.drawRect(-10*width, -10*height, 20*width, 20*height);
  graphics.endFill();
  app.stage.addChild(graphics);

  phyllo.show();

  let t = 0;
  return ({ width, height, playhead }) => {
    
    phyllo.tick(playhead*2*Math.PI);
    app.renderer.render(app.stage);

  };
};

canvasSketch(sketch, settings);


class Leaf {
  constructor(x, y, size, width, height){
    this.x = x;
    this.y = y;
    this.r = size/2;

    this.width = width;
    this.height = height;

    this.graphics = new PIXI.Graphics();
  }

  draw(){
    this.graphics.beginFill(PIXI.utils.rgb2hex([0.4+0.8*((this.x**2+this.y**2)/1000)/255, 0.8, 0]), 1);
    // this.graphics.beginFill(colors[Math.floor(Math.random()*3)])
    this.graphics.drawCircle(this.x, this.y, this.r);
    this.graphics.endFill();
  }
}

class Phyllotaxis {
  constructor(app, width, height) {
    this.leaves = [];
    this.angle = 360 / (1+((1 + Math.sqrt(5))/2))/180*Math.PI;
    this.c = 2 + width/600;
    this.n = 0;

    this.t = 0;

    this.speed = 0.05;
    this.yoffset = 0;

    this.width = width;
    this.height = height;
    this.app = app;
  }

  show(){
    this.n = 0;
    this.leaves = [];
    for (let i = 0; i < 100000; i++){
      // let size = 8-n/1000;
      // let size = 2 + this.n / 20000 + this.width/80000;
      let size = 15-(this.n/40000)**3.6
      // let size = 15;

      if (size <= 0){
        break;
      }

      let a = this.n * this.angle;
      let r = this.c * this.n**0.5;

      let x = r * Math.cos(a);
      let y = r * Math.sin(a);

      let leaf = new Leaf(x, y, size, this.width, this.height);
      this.app.stage.addChild(leaf.graphics);
      leaf.draw();
      this.leaves.push(leaf);
      this.n++;
    }
  }

  tick(t){
    // for (let leaf of this.leaves){
    //     leaf.graphics.rotation = t;
    // }
    
    this.t += this.speed;
  }
}
