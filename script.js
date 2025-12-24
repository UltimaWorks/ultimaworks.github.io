// UltimaWorks Studio - Data-driven artwork + blog
// © 2025 JBob / UltimaWorks

document.addEventListener('DOMContentLoaded', () => {
  initGumpEffects();
  initServerStatus();
  loadContent();
});

// --- Gump interaction effects (unchanged core idea) ---
function initGumpEffects() {
  const gumpWindows = document.querySelectorAll('.gump-window');

  gumpWindows.forEach((gump, index) => {
    gump.style.animationDelay = `${index * 0.1}s`;

    gump.addEventListener('mouseenter', () => {
      gump.style.transform = 'translateY(-2px)';
      gump.style.transition = 'transform 0.3s ease';
    });

    gump.addEventListener('mouseleave', () => {
      gump.style.transform = 'translateY(0)';
    });
  });
}

// --- Status bar pulse ---
function initServerStatus() {
  const statusElement = document.querySelector('.stat-value');

  if (!statusElement) return;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes statusPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `;
  document.head.appendChild(style);

  statusElement.style.animation = 'statusPulse 2s ease-in-out infinite';
}

// --- Load JSON content and render ---
async function loadContent() {
  try {
    const [art, posts] = await Promise.all([
      fetchJson('art.json'),
      fetchJson('posts.json')
    ]);

    renderArt(art);
    renderPosts(posts);
  } catch (err) {
    console.error('Failed to load content:', err);
  }
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }
  return response.json();
}

function renderArt(items) {
  const container = document.getElementById('art-grid');
  if (!container || !Array.isArray(items)) return;

  container.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'art-card';

    const thumb = document.createElement('div');
    thumb.className = 'art-thumbnail placeholder-thumb';
    if (item.image) {
      thumb.style.backgroundImage = `url(${item.image})`;
    }

    const label = document.createElement('span');
    label.className = 'thumb-label';
    label.textContent = item.type || 'Artwork';
    thumb.appendChild(label);

    const body = document.createElement('div');
    body.className = 'art-body';

    const title = document.createElement('h3');
    title.className = 'art-title';
    title.textContent = item.title || 'Untitled';

    const meta = document.createElement('p');
    meta.className = 'art-meta';
    const released = item.released ? formatDate(item.released) : 'Unknown date';
    meta.textContent = `Released: ${released} · Format: ${item.format || 'N/A'} · Style: ${item.style || 'N/A'}`;

    const excerpt = document.createElement('p');
    excerpt.className = 'art-excerpt';
    excerpt.textContent = item.summary || '';

    const button = document.createElement('button');
    button.className = 'art-button';
    button.type = 'button';
    button.textContent = 'View details';
    button.addEventListener('click', () => {
      showArtDetails(item);
    });

    body.appendChild(title);
    body.appendChild(meta);
    body.appendChild(excerpt);
    body.appendChild(button);

    card.appendChild(thumb);
    card.appendChild(body);
    container.appendChild(card);
  });
}

function renderPosts(posts) {
  const container = document.getElementById('blog-list');
  if (!container || !Array.isArray(posts)) return;

  // Sort latest first
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  container.innerHTML = '';

  posts.forEach(post => {
    const article = document.createElement('article');
    article.className = 'blog-post';

    const title = document.createElement('h3');
    title.className = 'blog-title';
    title.textContent = post.title || 'Untitled';

    const meta = document.createElement('p');
    meta.className = 'blog-meta';
    const date = post.date ? formatDate(post.date) : 'Unknown date';
    meta.textContent = `${date} · ${post.category || 'General'}`;

    const excerpt = document.createElement('p');
    excerpt.className = 'blog-excerpt';
    excerpt.textContent = post.excerpt || '';

    const link = document.createElement('button');
    link.className = 'art-button';
    link.type = 'button';
    link.textContent = 'Read more';
    link.addEventListener('click', () => {
      showPostDetails(post);
    });

    article.appendChild(title);
    article.appendChild(meta);
    article.appendChild(excerpt);
    article.appendChild(link);
    container.appendChild(article);
  });
}

function formatDate(input) {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// --- Detail display (simple modal-ish alert for now) ---
function showArtDetails(item) {
  const lines = [
    item.title || 'Untitled',
    '',
    `Type: ${item.type || 'Artwork'}`,
    `Released: ${item.released || 'Unknown'}`,
    `Format: ${item.format || 'N/A'}`,
    `Style: ${item.style || 'N/A'}`,
    '',
    item.details || item.summary || ''
  ];
  alert(lines.join('\n'));
}

function showPostDetails(post) {
  const lines = [
    post.title || 'Untitled',
    '',
    `Date: ${post.date || 'Unknown'}`,
    `Category: ${post.category || 'General'}`,
    '',
    post.body || post.excerpt || ''
  ];
  alert(lines.join('\n'));
}
