import {Pt, Noise, Num} from 'pts'

export class Segment {
    constructor(x, y, len, i){
        this.len = len;
        this.angle = 0;
        this.selfAngle = 0;
        this.i = i;

        this.parent = null;
        this.child = null;

        this.a = new Pt(x, y);
        this.b = new Pt(0, 0);
        this.calculateB(); 


        this.noise = new Noise();
        this.noise.initNoise(Math.random()*1000, 0);
    }

    static spawnAt(parent, len, i){
        const child = new Segment(parent.b.x, parent.b.y, len, i);
        child.parent = parent;
        parent.child = child;
        return child;
    }

    calculateB() {
        const dx = this.len * Math.cos(this.angle);
        const dy = this.len * Math.sin(this.angle);
        this.b.to(this.a.x + dx, this.a.y + dy);
    }

    wiggle(){
        this.selfAngle = this.noise.noise2D()/2;
        this.noise.step(0.008,0);
    }

    follow(x, y) {
        const target = new Pt(x, y);
        const dir = target.$subtract(this.a);
        this.selfAngle = dir.angle(); 

        dir.scale(-this.len / dir.magnitude());
        this.a = target.add(dir);
    }

    forward(){
        this.angle = this.selfAngle;
        if (this.parent !== null){
            this.a = this.parent.b.clone();
            this.angle += this.parent.angle;
        }
        this.calculateB();
    }

    inverse(){
        this.angle = this.selfAngle;
        this.calculateB();
    }

    show(form, weight, color){
        if (!weight){
            weight = 5;
        }

        if (!color){
            color = "#09f";
        }
        form.strokeOnly(color, weight, "bevel", "round").line([this.a, this.b]);
    }
}

export class Fish {
    constructor(form, x, y, fishLength, numSegments, color){
        this.pos = new Pt(x, y);
        this.amount = numSegments;
        this.len = fishLength/numSegments;
        this.form = form;
        this.numSegments = numSegments;
        this.color = color;

        let current = new Segment(...this.pos, this.len, 1);
        
        this.end = current;

        for (let i = 0; i < numSegments; i++){
            const next = Segment.spawnAt(current, this.len, i+1);
            current = next;
        }

        this.head = current;
    }

    follow(x, y){
        const target = new Pt(x, y);
        this.head.follow(...target);
        this.head.inverse();
        this.head.show(this.form, 15, this.color);
        let next = this.head.parent;
        while (true) {
            next.follow(...next.child.a)
            next.inverse();
            next.show(this.form, Num.lerp(1, 15, next.i/this.numSegments), this.color);

            if (next.parent === null){
                break;
            } else{
                next = next.parent;
            }
        }
        this.end = next;
    }

}