const canvas = document.getElementById('board');


canvas.addEventListener('pointerdown', (e) => {
canvas.setPointerCapture(e.pointerId);
const {x,y} = getPos(e);
beginStroke(x, y);
});
canvas.addEventListener('pointermove', (e) => {
const {x,y} = getPos(e);
drawStroke(x, y);
});
canvas.addEventListener('pointerup', () => endStroke());
canvas.addEventListener('pointercancel', () => endStroke());
canvas.addEventListener('pointerleave', () => endStroke());


// Controls
const colorEl = document.getElementById('color');
const sizeEl = document.getElementById('size');
const opacityEl = document.getElementById('opacity');
const brushBtn = document.getElementById('brushBtn');
const eraserBtn = document.getElementById('eraserBtn');


function setMode(next) {
mode = next;
brushBtn.setAttribute('aria-pressed', next === 'brush');
eraserBtn.setAttribute('aria-pressed', next === 'eraser');
setStatus();
}


brushBtn.addEventListener('click', () => setMode('brush'));
eraserBtn.addEventListener('click', () => setMode('eraser'));


colorEl.addEventListener('input', (e) => { strokeColor = e.target.value; setStatus(); });
sizeEl.addEventListener('input', (e) => { brushSize = +e.target.value; setStatus(); });
opacityEl.addEventListener('input', (e) => { opacity = +e.target.value; setStatus(); });


document.getElementById('clearBtn').addEventListener('click', () => {
pushHistory();
ctx.clearRect(0, 0, canvas.width, canvas.height);
});


document.getElementById('saveBtn').addEventListener('click', () => {
// Create a clean export at 2x current size
const exportScale = 2;
const off = document.createElement('canvas');
off.width = canvas.width * exportScale / (window.devicePixelRatio || 1);
off.height = canvas.height * exportScale / (window.devicePixelRatio || 1);
const octx = off.getContext('2d');
octx.imageSmoothingQuality = 'high';
octx.drawImage(canvas, 0, 0, off.width, off.height);
const url = off.toDataURL('image/png');
const a = document.createElement('a');
a.href = url;
a.download = `sketch-${Date.now()}.png`;
a.click();
});


document.getElementById('undoBtn').addEventListener('click', undo);
document.getElementById('redoBtn').addEventListener('click', redo);


// Keyboard shortcuts
window.addEventListener('keydown', (e) => {
if (e.key === 'b' || e.key === 'B') setMode('brush');
if (e.key === 'e' || e.key === 'E') setMode('eraser');
if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && e.shiftKey) { e.preventDefault(); redo(); }
});


// Resize handling
const ro = new ResizeObserver(() => resizeCanvasToDisplaySize());
ro.observe(document.querySelector('.canvas-wrap'));
resizeCanvasToDisplaySize();


// Initialize blank (push initial state for undo)
pushHistory();
setStatus();