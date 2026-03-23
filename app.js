// ===== APP =====
// Main render loop, controls, URL sync, initialization

function updateURL() {
  const eq = formatEquation().replace(/\s+/g, '');
  const url = new URL(window.location);
  url.searchParams.set('eq', eq);
  history.replaceState(null, '', url);
}

function loadEquation() {
  const input = document.getElementById('eqInput').value.trim();
  if (!input) return;
  const parsed = parseEquation(input);
  if (!parsed) { showHint("Couldn't parse that equation. Try format: 3x + 5 = 10x + 12"); return; }
  state = { ...parsed };
  initial = { ...parsed };
  trueX = solveForX(parsed);
  solved = false;
  lastAction = null;
  document.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('active'));
  closeSuccess();
  render();
}

function loadPreset(level, btn) {
  const eq = btn.getAttribute('data-eq');
  document.getElementById('eqInput').value = eq;
  document.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadEquation();
}

function modify(side, type, delta) {
  if (solved) return;
  const key = (side === 'l' ? 'l' : 'r') + (type === 'x' ? 'x' : 'c');
  state[key] += delta;
  lastAction = { side, type, delta };
  render();
  checkSolved();
}

function render() {
  // Update counts
  document.getElementById('lxCount').textContent = state.lx;
  document.getElementById('lcCount').textContent = state.lc;
  document.getElementById('rxCount').textContent = state.rx;
  document.getElementById('rcCount').textContent = state.rc;

  // Update equation display
  document.getElementById('currentEq').textContent = formatEquation();
  updateURL();

  // Render visual objects
  renderObjects('leftObjects', state.lx, state.lc);
  renderObjects('rightObjects', state.rx, state.rc);

  // Update scale tilt
  updateScale();

  // Update hints
  updateHint();
}

// ===== INIT =====
function init() {
  const params = new URLSearchParams(window.location.search);
  const eq = params.get('eq');
  if (eq) {
    document.getElementById('eqInput').value = eq.replace(/([+-])/g, ' $1 ').replace(/\s+/g, ' ').trim();
    const parsed = parseEquation(eq);
    if (parsed) {
      state = { ...parsed };
      initial = { ...parsed };
      trueX = solveForX(parsed);
    }
  } else {
    document.getElementById('eqInput').value = '3x + 5 = 10x + 12';
    state = { lx: 3, lc: 5, rx: 10, rc: 12 };
    initial = { ...state };
    trueX = solveForX(state);
  }
  render();
}

document.getElementById('eqInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') loadEquation();
});

init();
