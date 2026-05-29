class SpinWheel {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.isSpinning = false;
    this.currentAngle = 0;
    this.velocity = 0;
    this.animFrame = null;
    this.onResult = options.onResult || (() => {});

    this.defaultSegments = [
      { text: 'Pizza', color: '#FF6B6B' },
      { text: 'Tacos', color: '#FFE66D' },
      { text: 'Ramen', color: '#4ECDC4' },
      { text: 'Sushi', color: '#45B7D1' },
      { text: 'Burger', color: '#96CEB4' },
      { text: 'Curry', color: '#FF9A76' },
      { text: 'Pasta', color: '#A29BFE' },
      { text: 'BBQ', color: '#FD79A8' },
    ];
    this.segments = [...this.defaultSegments];
    this.soundEnabled = options.soundEnabled !== false;
    this.theme = options.theme || 'classic';

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.draw();
  }

  resize() {
    const size = Math.min(this.canvas.parentElement?.offsetWidth || 500, 500);
    this.canvas.width = size;
    this.canvas.height = size;
    this.cx = size / 2;
    this.cy = size / 2;
    this.radius = size / 2 - 12;
    this.draw();
  }

  setSegments(segs) {
    this.segments = segs.filter(s => s.text.trim());
    this.draw();
  }

  getThemeColors(index, total) {
    const themes = {
      classic: ['#FF6B6B','#FFE66D','#4ECDC4','#45B7D1','#96CEB4','#FF9A76','#A29BFE','#FD79A8','#6C5CE7','#00B894','#FDCB6E','#E17055'],
      neon: ['#FF0080','#00FF41','#0080FF','#FF8000','#8000FF','#00FFFF','#FF4040','#40FF00'],
      pastel: ['#FFB3BA','#FFDFBA','#FFFFBA','#BAFFC9','#BAE1FF','#D4B8E0','#F9C6C9','#C9F9D4'],
      dark: ['#2D3436','#636E72','#74B9FF','#0984E3','#00CEC9','#6C5CE7','#A29BFE','#FD79A8'],
      rainbow: ['#FF0000','#FF7700','#FFFF00','#00FF00','#0000FF','#8B00FF','#FF00FF','#00FFFF'],
      earth: ['#8B4513','#A0522D','#CD853F','#DEB887','#D2B48C','#BC8F8F','#F4A460','#DAA520'],
    };
    const palette = themes[this.theme] || themes.classic;
    return palette[index % palette.length];
  }

  draw() {
    const { ctx, cx, cy, radius, segments, currentAngle } = this;
    if (!segments.length) return;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Outer glow
    const glow = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius + 10);
    glow.addColorStop(0, 'transparent');
    glow.addColorStop(1, 'rgba(255,215,0,0.15)');
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 10, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    const arc = (Math.PI * 2) / segments.length;

    segments.forEach((seg, i) => {
      const startAngle = currentAngle + i * arc;
      const endAngle = startAngle + arc;
      const color = seg.color || this.getThemeColors(i, segments.length);

      // Slice
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Slice border
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 4;
      const fontSize = Math.max(10, Math.min(18, radius / (segments.length * 0.7)));
      ctx.font = `bold ${fontSize}px 'Nunito', sans-serif`;
      const maxLen = Math.floor(radius * 0.55);
      let label = seg.text;
      if (ctx.measureText(label).width > maxLen) {
        while (ctx.measureText(label + '…').width > maxLen && label.length > 1) label = label.slice(0, -1);
        label += '…';
      }
      ctx.fillText(label, radius - 12, fontSize / 3);
      ctx.restore();
    });

    // Center circle
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 36);
    grad.addColorStop(0, '#fff');
    grad.addColorStop(1, '#f0f0f0');
    ctx.beginPath();
    ctx.arc(cx, cy, 36, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center text
    ctx.fillStyle = '#333';
    ctx.font = 'bold 11px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SPIN', cx, cy + 4);

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Pin / pointer
    this.drawPin();
  }

  drawPin() {
    const { ctx, cx, radius } = this;
    const py = this.cy - radius - 2;
    ctx.save();
    ctx.translate(cx, py);
    ctx.beginPath();
    ctx.moveTo(0, 14);
    ctx.lineTo(-10, -8);
    ctx.lineTo(10, -8);
    ctx.closePath();
    const pinGrad = ctx.createLinearGradient(0, -8, 0, 14);
    pinGrad.addColorStop(0, '#e74c3c');
    pinGrad.addColorStop(1, '#c0392b');
    ctx.fillStyle = pinGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  spin() {
    if (this.isSpinning || !this.segments.length) return;
    this.isSpinning = true;
    this.velocity = (Math.random() * 8 + 10) * (Math.PI / 180) * 10;
    this.playTick();
    this.animate();
  }

  animate() {
    this.velocity *= 0.985;
    this.currentAngle += this.velocity;

    if (this.velocity > 0.1) {
      // Tick sound at segment crossings
      const arc = (Math.PI * 2) / this.segments.length;
      const prev = Math.floor((this.currentAngle - this.velocity) / arc);
      const curr = Math.floor(this.currentAngle / arc);
      if (curr !== prev) this.playTick();
    }

    this.draw();

    if (this.velocity > 0.003) {
      this.animFrame = requestAnimationFrame(() => this.animate());
    } else {
      this.isSpinning = false;
      this.velocity = 0;
      this.showResult();
    }
  }

  showResult() {
    const arc = (Math.PI * 2) / this.segments.length;
    // Pointer is at top (angle = -PI/2 from canvas 0)
    const normalised = (((-Math.PI / 2) - this.currentAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    const index = Math.floor(normalised / arc) % this.segments.length;
    const winner = this.segments[index];
    this.playWin();
    this.onResult(winner, index);
  }

  playTick() {
    if (!this.soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 800 + Math.random() * 200;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(); osc.stop(ctx.currentTime + 0.05);
    } catch(e) {}
  }

  playWin() {
    if (!this.soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const t = ctx.currentTime + i * 0.1;
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.start(t); osc.stop(t + 0.3);
      });
    } catch(e) {}
  }
}

export default SpinWheel;
