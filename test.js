var cnv, ctx, width, W, height, H,pd;
pd = 1;

var times=[];
var fps = 0;

t1 = new Date().getTime();
var fireworks = [];
var fireworks2 = [];
var If = 0;
var wish;

function setup() {
    cnv = document.querySelector("#cnv");
    ctx = cnv.getContext("2d");
    cnv.width = width = W = innerWidth * pd;
    cnv.height = height = H = innerHeight * pd;

    wish = [
    //HAPPY 
    ["H", H/4, W/2-100],
    ["A", H/4, W/2-50],
    ["P", H/4, W/2],
    ["P", H/4, W/2+50],
    ["Y", H/4, W/2+100],

    //NEW YEAR
    ["N", H/2.8, W/2-120],
    ["E", H/2.8, W/2-80],
    ["W", H/2.8, W/2-40],
    ["Y", H/2.8, W/2+5],
    ["E", H/2.8, W/2+40],
    ["A", H/2.8, W/2+80],
    ["R", H/2.8, W/2+120],

    //2025
    ["2", H/2.1, W/2-60],
    ["0", H/2.1, W/2-20],
    ["2", H/2.1, W/2+20],
    ["5", H/2.1, W/2+60],

    ]
    window.onclick =()=> {
        cnv.webkitRequestFullScreen();
        cnv.height = innerWidth;
        cnv.height = innerHeight;
    }
    setTimeout(addFire, 800);
    requestAnimationFrame(loop);
}

function addFire() {
    if(If >= wish.length) {
        return;
    }
    fireworks.push(new firework(new vector(W/2, H-10), new vector(),new vector(wish[If][2], wish[If][1]), wish[If][0]));
    If++;
    setTimeout(addFire,randint(1000,4000));
}

function loop(){
    t2 = new Date().getTime();
    dt = .5; //(t2-t1)/50;
    t1 = t2;
    ctx.shadowBlur=0;
    bg(ctx, "#0003");
    ctx.fillStyle = "#0000";
    for(let firework of fireworks){
        firework.update();
        firework.show();
    }

    for(let i = fireworks2.length -1; i>=0; i--){
        fireworks2[i].update();
        fireworks2[i].show();
        if(fireworks2[i].burst == true && fireworks2[i].particles.length == 0)
            fireworks2.splice(i,1);
    }

     if(If >= wish.length && Math.floor(Math.random()*200)==51)
        fireworks2.push(new firework(new vector(W/2, H-10), new vector(random(-1,1), random(-15,-12))));
        //calcFPS();
        requestAnimationFrame(loop);
}

const calcFPS = () => {
    //for fps calculation
    const now = performance.now();
    while(times.length >0 && times[0] <= now -1000){
        times.shift();
    }
    times.push(now);
    fps = times.length;
    //ctx.fillStyle = "#ffffff";
    //ctx.shadowBlur = 0;
    //ctx.font = "12px Arial";
    //ctx.fillText(`fps: ${fps}`, 20,20);
}


const circle = (ctx,x,y,r)=> {
    ctx.beginPath();
    ctx.arc(x,y,r,0, Math.PI*2, false);
    ctx.stroke();
    ctx.fill();
}

const bg = (ctx, col) =>{
    ctx.fillStyle = col;
    ctx.fillRect(0,0,width*pd,height*pd);
}

const line = (ctx,x1,y1,x2,y2)=>{
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
}

const random =(min = 0, max = 1)=> {
    return Math.random()*(max-min) + min;
}

const randint =(min = 0, max = 1)=> {
    return Math.floor(Math.random()*(max-min + 1) + min);
}

class vector {
    constructor(x=0, y=0, z=0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v){
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    mult(s){
       this.x *= s;
       this.y *= s;
       this.z *= s;
       return this;
    }

    subtract(v){
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    static random2D(mag){
        let v = new vector();
        let angle = random(0,8);
        v.x = Math.cos(angle);
        v.y = Math.sin(angle);
        v.mult(random(mag));
        return v;
    }

    normalize() {
        let mag = Math.hypot(this.x, this.y, this.z);
        this.mult(1/mag);
        return this;
    }

    getCopy() {
        return new vector(this.x, this.y, this.z)
    }
  }

  class particle {
      
    constructor(pos, vel= null) {
        this.pos = pos;
        this.vel = vel || new vector(random(-1,1), random(-15,-12));
        this.accl = new vector();
        this.life = 3;
        this.gravity = new vector(0,0.15);
    }

    update(){
        this.vel.add(this.accl);
        this.vel.add(this.gravity.getCopy().mult(dt));
        this.pos.add(this.vel.getCopy().mult(dt));
        if(this.pos.y >= H) {
            this.vel.y *= -.2;
            this.pos.y = H-1;
            this.life --;
        }
        if(this.x < 0 || this.x > W)
            this.life = 0;
    }
    draw(stars = false){
        if(!stars) 
            circle(ctx, this.pos.x, this.pos.y,2);
        else {
            ctx.font = "12px Roboto"
            ctx.textAlign = "center";
            ctx.fillText("🎊", this.pos.x, this.pos.y);
        }
    }
  }

  class firework{
    constructor(pos, vel, target = null, l=""){
        if(target){
            this.x = target.x;
            this.y = target.y;
        } else {
            this.x = random(0, W);
            this.y = random(0, H/2);
        }
        this.letter = l;
        this.firework = new particle(pos, vel);
        //this.firework.vel = new vector(0, random(-15,-11));
        //this.firework.vel = new vector(((this.x - W/2)*0.2)/(Math.sqrt(0.2*2*(H-this.y)))- Math.sqrt(2*0.2*(H-this.y)));
        if (If >= wish.length) {
            // 加速後放的煙火
            this.firework.vel = new vector(0, random(-14, -13)); // 增加速度，讓煙火上升更快
        } else {
            // 初始的煙火速度
            this.firework.vel = new vector(0, random(-13, -11));
        }
        this.particles = -2;
        this.burst = false;
        this.h = randint(0,360); 
    }

    update(){
        if(this.firework.vel.y >= 0)
            this.burst = true;
        if(!this.burst) 
            this.firework.update();
        else if(this.particles == -2){
            this.particles = [];
            for(let i = 0; i<= 100; i++){
                this.particles.push(new particle(this.firework.pos.getCopy(), vector.random2D(random(5,30))));
            }
        }
    }

    show(){
        ctx.fillStyle = `hsla(${this.h}, 100%, 85%, 1)`;
        ctx.shadowColor = `hsla(${this.h}, 100%, 50%, 1)`;
        ctx.shadowBlur = 6;
        if(!this.burst){
            ctx.shadowBlur = 10;
            ctx.fillStyle ="#ff9999";
            ctx.shadowColor = "#ff0000";
            this.firework.draw();
            ctx.fillStyle ="#0000";
        }
        else
          for(let i= this.particles.length -1; i>=0; i--) {
            this.particles[i].update();
            this.particles[i].draw(random()< 0.008);
            if(this.particles[i].life <= 0)
                this.particles.splice(i,1);
        }
        ctx.font = "30px Roboto"
        ctx.textAlign = "center";
        ctx.fillText(this.letter,this.x,this.y);
    }
  }
  window.onload = setup;

    // 設定 1 分鐘 (60000 毫秒) 後跳轉到第二個網頁
    setTimeout(() => {
        window.location.href = 'happy new year.html'; // 跳轉到第二個網頁
    }, 60000);
