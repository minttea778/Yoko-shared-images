const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');

let images = [];
let current = 0;

document.getElementById('year').textContent = new Date().getFullYear();

async function load() {
  try {
    const res = await fetch('data/images.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    images = Array.isArray(data) ? data : (data.images || []);
    render();
  } catch (err) {
    gallery.innerHTML = `<p class="error">图片列表加载失败：${err.message}</p>`;
  }
}

function render() {
  if (!images.length) {
    gallery.innerHTML = '<p class="empty">还没有图片，先在 data/images.json 里添加吧。</p>';
    return;
  }
  gallery.innerHTML = '';
  images.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.className = 'card';
    btn.type = 'button';
    btn.setAttribute('aria-label', '查看 ' + (item.title || '图片'));

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.title || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.onerror = () => { img.style.opacity = '.3'; };
    btn.appendChild(img);

    if (item.title) {
      const cap = document.createElement('span');
      cap.className = 'cap';
      cap.textContent = item.title;
      btn.appendChild(cap);
    }

    btn.addEventListener('click', () => openAt(i));
    gallery.appendChild(btn);
  });
}

function openAt(i) { current = i; paint(); lightbox.hidden = false; document.body.style.overflow = 'hidden'; }
function paint() {
  const item = images[current];
  lbImg.src = item.src;
  lbImg.alt = item.title || '';
  lbCaption.textContent = item.title || '';
}
function close() { lightbox.hidden = true; lbImg.src = ''; document.body.style.overflow = ''; }
function prev() { current = (current - 1 + images.length) % images.length; paint(); }
function next() { current = (current + 1) % images.length; paint(); }

lbClose.addEventListener('click', close);
lbPrev.addEventListener('click', prev);
lbNext.addEventListener('click', next);
lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowLeft') prev();
  if (e.key === 'ArrowRight') next();
});

load();