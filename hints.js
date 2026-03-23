// ===== HINTS =====
// Contextual guidance for the student

function updateHint() {
  const hintOn = document.getElementById('hintToggle').checked;
  const hintEl = document.getElementById('hintMsg');
  if (!hintOn || !lastAction) { hintEl.classList.add('hidden'); hintEl.textContent = ''; return; }

  const balanced = isBalanced();

  if (balanced) {
    // Check progress toward solution
    const xLeft = state.lx !== 0 && state.rx === 0;
    const xRight = state.rx !== 0 && state.lx === 0;
    const xIsolated = xLeft || xRight;
    const constIsolated = xLeft ? state.lc === 0 : (xRight ? state.rc === 0 : false);

    if (state.lx !== 0 && state.rx !== 0) {
      hintEl.textContent = '⚖️ Balanced! Try removing x from one side (and the same from the other) to isolate x.';
    } else if (xIsolated && !constIsolated) {
      hintEl.textContent = '⚖️ Balanced! Now remove constants from the side with x (and from the other side too).';
    } else if (xIsolated && constIsolated) {
      // Solved state — compute x
      const xCoeff = xLeft ? state.lx : state.rx;
      const constVal = xLeft ? state.rc : state.lc;
      const xVal = constVal / xCoeff;
      hintEl.textContent = '⚖️ You\'ve isolated x! x = ' + formatSolution(xVal);
    } else {
      hintEl.textContent = '⚖️ The scale is balanced. Keep simplifying!';
    }
    hintEl.classList.remove('hidden');
  } else {
    const a = lastAction;
    const sideName = a.side === 'l' ? 'left' : 'right';
    const typeName = a.type === 'x' ? 'variable (x)' : 'constant';
    const action = a.delta > 0 ? 'added a ' + typeName + ' to' : 'removed a ' + typeName + ' from';
    hintEl.textContent = '⚠️ Unbalanced! You ' + action + ' the ' + sideName +
      ' side. To keep it balanced, do the same to the ' + (sideName === 'left' ? 'right' : 'left') + ' side!';
    hintEl.classList.remove('hidden');
  }
}

function showHint(msg) {
  const hintEl = document.getElementById('hintMsg');
  hintEl.textContent = msg;
  hintEl.classList.remove('hidden');
}
