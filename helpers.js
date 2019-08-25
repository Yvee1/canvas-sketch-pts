import {CanvasForm} from "pts"

export class ContextForm extends CanvasForm {
  constructor(context, width, height) {
    super({add: things => {}});

    this._ctx = context;
    this._ctx.fillStyle = this._style.fillStyle;
    this._ctx.strokeStyle = this._style.strokeStyle;    
    this._ctx.lineJoin = "bevel";
    this._ctx.font = this._font.value;
    this._ready = true;

    this.width = width;
    this.height = height;

    this._bgcolor = "transparent";
    this.clear();
  }

  clear(){
    if (this._bgcolor == "transparent"){
      this._ctx.clearRect( -1, -1, this.width+1, this.height+1 );
    } else {
      this._ctx.fillStyle = this._bgcolor;
      this._ctx.fillRect( -1, -1, this.width+1, this.height+1 );
    }
  }

  background(color) {
    this._bgcolor = color;
  }
}

// from https://github.com/mattdesl/canvas-sketch/issues/42
export function createMouse(canvas, opts = {}) {
  const mouse = {
    moved: false,
    position: [0, 0],
    normalized: [0, 0],
    dispose
  };

  window.addEventListener("mousemove", move);

  return mouse;

  function move(ev) {
    mouseEventOffset(ev, canvas, mouse.position);
    if (opts.onMove) opts.onMove();
  }

  function dispose() {
    window.removeEventListener("mousemove", move);
  }
}

function mouseEventOffset(ev, target, out = [0, 0]) {
  target = target || ev.currentTarget || ev.srcElement;
  const cx = ev.clientX || 0;
  const cy = ev.clientY || 0;
  const rect = target.getBoundingClientRect();
  out[0] = cx - rect.left;
  out[1] = cy - rect.top;
  return out;
}