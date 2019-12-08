const canvasSketch = require('canvas-sketch');
import {ContextForm} from "../helpers.js";
import {Pt, Circle, Num} from "pts";

const settings = {
  dimensions: [2560,  1440],
  animate: true,
};

const sketch = ({ context, width, height, time }) => {
  const center = new Pt([width/2, height/2]);
  const form = new ContextForm(context, width, height);
  form.background("white");
  const margin = 50;
  const circleRadius = Math.min(width, height) * 0.45;

  const createCircles = amount => {
    const circles = [];
    for (let i = 0; i < amount; i++){
      circles.push({
        pos: new Pt([
        Num.randomRange(margin, width - margin),
        Num.randomRange(margin, height - margin)
        ]),
        speed: Num.randomRange(2, 10)**2,
        blue: Num.randomRange(0, 200),
        size: 0
      })
    }
    return circles
  }

  let circles = createCircles(20);
  console.log(circles.length);
  circles = circles.filter(circle => circle.pos.$subtract(...center).magnitude() < circleRadius);

  return ({ width, height, time }) => {
    form.clear();
    form._ctx.globalCompositeOperation = "difference";

    let size = Num.clamp(time * 10, 0, 5);
    circles.forEach((circle, i) => {
      if (circle.pos.$subtract(...center).magnitude() + circle.size < circleRadius){
        circle.size = size * circle.speed;
        // console.log(circle.size);
      } else{
        circle.size = circleRadius - circle.pos.$subtract(...center).magnitude();
        // console.log("!!!");
      }
      form.fillOnly(`rgb(${i%2==0?255:0}, ${i%2==1?255:0}, ${circle.blue})`).circle(Circle.fromCenter(circle.pos, circle.size));
    });

  };
};

canvasSketch(sketch, settings);