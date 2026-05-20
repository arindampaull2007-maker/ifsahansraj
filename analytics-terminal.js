// ========== ANALYTICS TERMINAL — INTERACTIVE JS ==========

// ========== MOBILE MENU ==========
function togglePageMobile(){document.getElementById('pageMobileMenu').classList.toggle('active');document.body.style.overflow=document.getElementById('pageMobileMenu').classList.contains('active')?'hidden':'';}
function closePageMobile(){document.getElementById('pageMobileMenu').classList.remove('active');document.body.style.overflow='';}

// ========== FEAR & GREED GAUGE (Canvas) ==========
(function(){
  const canvas=document.getElementById('fgCanvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height;
  const cx=W/2,cy=H-10;
  const radius=65;
  const startAngle=Math.PI;
  const endAngle=2*Math.PI;
  const value=62;
  const target=(value/100)*(endAngle-startAngle)+startAngle;

  // gradient stops: red → orange → yellow → green
  const colors=[
    {stop:0,color:'#FF1744'},
    {stop:.25,color:'#FF9800'},
    {stop:.5,color:'#FFEB3B'},
    {stop:.75,color:'#76FF03'},
    {stop:1,color:'#00C853'}
  ];

  let current=startAngle;
  function draw(){
    ctx.clearRect(0,0,W,H);
    // Background arc
    ctx.beginPath();ctx.arc(cx,cy,radius,startAngle,endAngle);
    ctx.lineWidth=14;ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineCap='round';ctx.stroke();
    // Value arc with gradient
    if(current<target)current+=0.03;
    const grad=ctx.createLinearGradient(0,cy,W,cy);
    colors.forEach(c=>grad.addColorStop(c.stop,c.color));
    ctx.beginPath();ctx.arc(cx,cy,radius,startAngle,Math.min(current,target));
    ctx.lineWidth=14;ctx.strokeStyle=grad;ctx.lineCap='round';ctx.stroke();
    // Needle
    const nx=cx+Math.cos(Math.min(current,target))*(radius-5);
    const ny=cy+Math.sin(Math.min(current,target))*(radius-5);
    ctx.beginPath();ctx.arc(nx,ny,4,0,Math.PI*2);
    ctx.fillStyle='#fff';ctx.fill();
    ctx.beginPath();ctx.arc(nx,ny,8,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fill();
    if(current<target)requestAnimationFrame(draw);
  }
  draw();
})();

// ========== FEATURED RESEARCH CANVAS (3D Reactive Particles) ==========
(function(){
  const canvas=document.getElementById('featuredCanvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let W,H,time=0;
  let mouse={x:-1000,y:-1000};
  let particles=[];

  function resize(){
    const rect=canvas.parentElement.getBoundingClientRect();
    W=canvas.width=rect.width;
    H=canvas.height=rect.height;
  }

  class Particle{
    constructor(){this.reset();}
    reset(){
      this.x=Math.random()*W;
      this.y=Math.random()*H;
      this.z=Math.random()*3+1;
      this.vx=(Math.random()-.5)*.3;
      this.vy=(Math.random()-.5)*.3;
      this.size=.5+Math.random()*2;
      this.alpha=.2+Math.random()*.5;
      this.baseAlpha=this.alpha;
      this.phase=Math.random()*6.28;
    }
    update(){
      this.x+=this.vx*this.z;
      this.y+=this.vy*this.z+Math.sin(time*.003+this.phase)*.15;
      // Mouse repulsion
      const dx=mouse.x-this.x,dy=mouse.y-this.y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<150){
        const f=(150-d)/150*.02;
        this.vx-=dx*f;this.vy-=dy*f;
        this.alpha=Math.min(this.baseAlpha+.3,.9);
      }else{
        this.alpha+=(this.baseAlpha-this.alpha)*.02;
      }
      this.vx*=.995;this.vy*=.995;
      if(this.x<-20)this.x=W+10;if(this.x>W+20)this.x=-10;
      if(this.y<-20)this.y=H+10;if(this.y>H+20)this.y=-10;
    }
    draw(){
      const s=this.size*this.z;
      ctx.beginPath();ctx.arc(this.x,this.y,s,0,6.28);
      ctx.fillStyle=`rgba(196,30,58,${this.alpha})`;ctx.fill();
      if(s>1.5){
        ctx.beginPath();ctx.arc(this.x,this.y,s*3,0,6.28);
        ctx.fillStyle=`rgba(196,30,58,${this.alpha*.1})`;ctx.fill();
      }
    }
  }

  function drawConnections(){
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x;
        const dy=particles[i].y-particles[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<120){
          ctx.beginPath();
          ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle=`rgba(196,30,58,${(1-d/120)*.15})`;
          ctx.lineWidth=.5;ctx.stroke();
        }
      }
    }
  }

  function drawPriceLine(){
    ctx.beginPath();ctx.lineWidth=1.5;
    for(let x=0;x<W;x+=3){
      const y=H*.4+Math.sin(x*.01+time*.008)*40+Math.sin(x*.018+time*.005)*25+Math.sin(x*.004+time*.003)*35;
      x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    const gr=ctx.createLinearGradient(0,0,W,0);
    gr.addColorStop(0,'rgba(196,30,58,0.15)');
    gr.addColorStop(.5,'rgba(196,30,58,0.35)');
    gr.addColorStop(1,'rgba(196,30,58,0.5)');
    ctx.strokeStyle=gr;ctx.stroke();
    // Fill under
    ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();
    const fg=ctx.createLinearGradient(0,H*.3,0,H);
    fg.addColorStop(0,'rgba(196,30,58,0.06)');
    fg.addColorStop(1,'rgba(196,30,58,0)');
    ctx.fillStyle=fg;ctx.fill();
  }

  function init(){
    resize();
    particles=[];
    for(let i=0;i<50;i++)particles.push(new Particle());
  }

  function animate(){
    time++;
    ctx.clearRect(0,0,W,H);
    drawPriceLine();
    drawConnections();
    particles.forEach(p=>{p.update();p.draw();});
    requestAnimationFrame(animate);
  }

  const hero=canvas.parentElement;
  hero.addEventListener('mousemove',e=>{
    const r=hero.getBoundingClientRect();
    mouse.x=e.clientX-r.left;
    mouse.y=e.clientY-r.top;
  });
  hero.addEventListener('mouseleave',()=>{mouse.x=-1000;mouse.y=-1000;});
  window.addEventListener('resize',resize);
  init();animate();
})();

// ========== 3D TILT ON EXPLORE CARDS ==========
(function(){
  document.querySelectorAll('[data-tilt]').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const rect=card.getBoundingClientRect();
      const x=(e.clientX-rect.left)/rect.width;
      const y=(e.clientY-rect.top)/rect.height;
      const tiltX=(y-.5)*-12;
      const tiltY=(x-.5)*12;
      card.style.transform=`perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
      // Dynamic glow
      card.style.boxShadow=`${(x-.5)*20}px ${(y-.5)*20}px 60px rgba(196,30,58,0.12), 0 0 30px rgba(196,30,58,0.06)`;
    });
    card.addEventListener('mouseleave',()=>{
      card.style.transform='perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      card.style.boxShadow='none';
    });
  });
})();

// ========== HEATMAP CELL PULSE ==========
(function(){
  document.querySelectorAll('.hm-cell').forEach(cell=>{
    cell.addEventListener('mouseenter',()=>{
      cell.style.boxShadow=cell.classList.contains('up')?'0 0 20px rgba(0,200,83,0.2)':'0 0 20px rgba(255,23,68,0.2)';
    });
    cell.addEventListener('mouseleave',()=>{cell.style.boxShadow='none';});
  });
})();

// ========== STOCK TABLE ROW HIGHLIGHT ==========
(function(){
  document.querySelectorAll('.stock-table tr').forEach(row=>{
    row.addEventListener('mouseenter',()=>{row.style.background='rgba(255,255,255,0.03)';});
    row.addEventListener('mouseleave',()=>{row.style.background='transparent';});
  });
})();

// ========== RESEARCH ITEM GLOW ON HOVER ==========
(function(){
  document.querySelectorAll('.research-item').forEach(item=>{
    item.addEventListener('mousemove',e=>{
      const rect=item.getBoundingClientRect();
      const x=e.clientX-rect.left;
      const y=e.clientY-rect.top;
      item.style.background=`radial-gradient(circle at ${x}px ${y}px, rgba(196,30,58,0.06), rgba(255,255,255,0.03) 60%)`;
    });
    item.addEventListener('mouseleave',()=>{item.style.background='rgba(255,255,255,0.02)';});
  });
})();

// ========== DASH PANEL MOUSE GLOW ==========
(function(){
  document.querySelectorAll('.dash-panel').forEach(panel=>{
    panel.addEventListener('mousemove',e=>{
      const rect=panel.getBoundingClientRect();
      const x=e.clientX-rect.left;
      const y=e.clientY-rect.top;
      panel.style.background=`radial-gradient(circle at ${x}px ${y}px, rgba(196,30,58,0.04), rgba(255,255,255,0.03) 50%)`;
    });
    panel.addEventListener('mouseleave',()=>{panel.style.background='rgba(255,255,255,0.03)';});
  });
})();

// ========== TAB SWITCHING ==========
(function(){
  const tabs=document.querySelectorAll('.rtab');
  tabs.forEach(tab=>{
    tab.addEventListener('click',()=>{
      tabs.forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
})();

// ========== INTERSECTION OBSERVER ==========
const observer=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}});},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.fade-up,.fade-in').forEach(el=>observer.observe(el));
