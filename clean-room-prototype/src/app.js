import { getCurrentIdentity, setIdentity } from './identityGate.js';
import { createContentObject } from './contentModel.js';
import { classifyContent } from './classifier.js';
import { createLineage } from './lineageTagger.js';
import { scrubContent } from './noiseScrubber.js';
import { laneLabel, laneCssClass } from './lanes.js';

let state = {
  identity: getCurrentIdentity(),
  posts: [],
};

const appRoot = document.getElementById('app');

render();

function render() {
  appRoot.innerHTML = '';
  if (!state.identity) {
    renderIdentityGate();
  } else {
    renderMain();
  }
}

function renderIdentityGate() {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h2>Identity Gate</h2>
    <p>Local-only identity. One human, one device, one mode.</p>
    <label>
      Display name
      <input id="id-name" placeholder="Captain, Parent, Kid..." />
    </label>
    <label>
      Mode
      <select id="id-mode">
        <option value="adult">Adult</option>
        <option value="kid">Kid</option>
      </select>
    </label>
    <button id="id-save">Enter Clean Room</button>
  `;
  appRoot.appendChild(card);

  card.querySelector('#id-save').onclick = () => {
    const displayName = card.querySelector('#id-name').value.trim() || 'Anonymous';
    const mode = card.querySelector('#id-mode').value;
    state.identity = setIdentity({ displayName, mode });
    render();
  };
}

function renderMain() {
  renderIdentitySummary();
  renderComposer();
  renderFeed();
}

function renderIdentitySummary() {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h2>Identity</h2>
    <p><strong>${state.identity.displayName}</strong> — mode: <strong>${state.identity.mode}</strong></p>
    <p class="meta">Device ID: ${state.identity.deviceId}</p>
    <button id="switch-mode">Switch Mode</button>
    <button id="reset-identity">Reset Identity</button>
  `;
  appRoot.appendChild(card);

  card.querySelector('#switch-mode').onclick = () => {
    const newMode = state.identity.mode === 'adult' ? 'kid' : 'adult';
    state.identity = setIdentity({ displayName: state.identity.displayName, mode: newMode });
    render();
  };

  card.querySelector('#reset-identity').onclick = () => {
    localStorage.clear();
    state = { identity: null, posts: [] };
    render();
  };
}

function renderComposer() {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h2>Compose</h2>
    <p>Type something and watch it be classified, scrubbed, and routed.</p>
    <textarea id="post-text" rows="4" placeholder="Write a fact, opinion, story, or kid message..."></textarea>
    <button id="post-send">Post to Clean Room</button>
  `;
  appRoot.appendChild(card);

  card.querySelector('#post-send').onclick = () => {
    const text = card.querySelector('#post-text').value.trim();
    if (!text) return;

    const lane = classifyContent(text, state.identity.mode);
    const labels = scrubContent(text);
    const lineage = createLineage(state.identity.deviceId, text);

    const post = createContentObject({
      text,
      author: state.identity.displayName,
      mode: state.identity.mode,
      lane,
      labels,
      lineage,
    });

    state.posts = [post, ...state.posts];
    card.querySelector('#post-text').value = '';
    render();
  };
}

function renderFeed() {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `<h2>Feed</h2>`;
  appRoot.appendChild(card);

  if (state.posts.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'No posts yet. The lanes are quiet.';
    card.appendChild(p);
    return;
  }

  state.posts.forEach(post => {
    const laneDiv = document.createElement('div');
    laneDiv.className = laneCssClass(post.lane);
    laneDiv.innerHTML = `
      <strong>${laneLabel(post.lane)}</strong><br/>
      <span>${post.text}</span>
      <div class="meta">
        by ${post.author} (${post.mode}) • ${post.lineage.timestamp}<br/>
        labels: 
          AI=${post.labels.isAI}, 
          unverifiable=${post.labels.unverifiable}, 
          noisy=${post.labels.noisy}<br/>
        lineage: device=${post.lineage.deviceId}, sig=${post.lineage.signature}
      </div>
    `;
    card.appendChild(laneDiv);
  });
}
