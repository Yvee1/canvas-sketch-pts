const canvasSketch = require('canvas-sketch');
import {Pt, Curve, Group} from "pts";
import {ContextForm, createMouse} from "../helpers.js";
const random = require('canvas-sketch-util/random')

const settings = {
  dimensions: [1024,  1024],
  animate: true,
  duration: 10,
  fps: 60,
};

const sketch = ({ canvas, context, width, height }) => {
  const mouse = createMouse(canvas);
  const form = new ContextForm(context, width, height);
  const center = new Pt([width/2, height/2]);

  random.setSeed(random.getRandomSeed());
  console.log(random.getSeed());

  const createNodes = amount => {
    const nodes = [];
    for (let i = 0; i < amount; i++){
      const angle = random.range(0, 2*Math.PI);
      nodes.push({pos: new Pt([random.range(0, width), random.range(0, height)]), dir: new Pt([Math.sin(angle), Math.cos(angle)])})
    }

    return nodes;
  }

  const amount = 150;
  const nodes = createNodes(amount);
  let randoms = [];
  for (let i = 0; i < amount**2; i++){
    randoms[i] = [0, 0, 0, 0, 0, 0];
  }

  console.log(randoms[0]);
  
  let count = 0;
  return ({ width, height, styleWidth, styleHeight, playhead }) => {
    form.background("rgba(30, 30, 30, 0.7)");
    form.clear();

    // Normalize pixel mouse opsition to 0..1 UV coordinates
    const u = mouse.position[0] / styleWidth;
    const v = mouse.position[1] / styleHeight;

    // Un-normalize to our rendering units
    const pointer = new Pt([u * width, v * height]);

    nodes.forEach(node => {
      node.pos[0] += node.dir[0];
      node.pos[1] += node.dir[1];

      if (node.pos[0] > width){
        node.pos[0] = width;
        node.dir[0] *= -1;
      }

      if (node.pos[0] < 0){
        node.pos[0] = 0;
        node.dir[0] *= -1;
      }

      if (node.pos[1] > height){
        node.pos[1] = height;
        node.dir[1] *= -1;
      }

      if (node.pos[1] < 0){
        node.pos[1] = 0;
        node.dir[1] *= -1;
      }

      // form.fillOnly("#09f").point(node.pos, 10, "circle");
    });

    nodes.forEach((node1, i1) => {
      nodes.forEach((node2, i2) => {
        if (node1 !== node2){
          const index = i1 * amount + i2;
          if (random.range(0, 1) < 0.05){
            // console.log("!");/
            randoms[index][0] = random.range(0.1, 0.4);
            randoms[index][1] = random.range(0, 30);
            randoms[index][2] = random.range(0.1, 0.4);
            randoms[index][3] = random.range(0, 40);
            randoms[index][4] = random.range(0.5, 0.9);
            randoms[index][5] = random.range(0.5, 0.9);
            randoms[index][6] = random.range(0, 70)
            randoms[index][7] = random.range(0, 1)
          }

          if (distance(node1, node2) < random.range(60, 100)){

            
            const rs = randoms[index];

            const curve = Curve.bezier(
              [
              node1.pos,
              node1.pos.$add((node2.pos[0]-node1.pos[0]) * rs[0] + rs[1], (node2.pos[1]-node1.pos[1]) * rs[2] + rs[3]),
              node1.pos.$add((node2.pos[0]-node1.pos[0]) * rs[4], (node2.pos[1]-node1.pos[1]) * rs[5]),
              node2.pos
            ]);
            
          
            form.strokeOnly(`hsl(256, 69%, ${40 + rs[6]}%, ${rs[7]})`, random.range(1, 3)).line(curve)
          }
        }
      })
    })
    count++;
  };
};

function distance (n1, n2){
  return Math.sqrt((n1.pos[0] - n2.pos[0])**2 + (n1.pos[1] - n2.pos[1])**2);
}

canvasSketch(sketch, settings);
