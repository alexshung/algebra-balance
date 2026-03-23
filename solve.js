// ===== SOLVE DETECTION =====
// Checks if the equation is in a solved state and triggers success

function checkSolved() {
  if (!isBalanced()) return;

  // Solved when all x's are on one side and all constants on the other
  // e.g., -7x = 7, 3x = 12, x = 5
  const xOnLeft = state.lx !== 0 && state.rx === 0 && state.lc === 0;
  const xOnRight = state.rx !== 0 && state.lx === 0 && state.rc === 0;

  if (xOnLeft && state.rc !== 0) {
    // lx * x = rc => x = rc / lx
    const xVal = state.rc / state.lx;
    showSuccess('x = ' + formatSolution(xVal));
    return;
  }
  if (xOnRight && state.lc !== 0) {
    // lc = rx * x => x = lc / rx
    const xVal = state.lc / state.rx;
    showSuccess('x = ' + formatSolution(xVal));
    return;
  }

  // Edge: x = 0 (e.g., 3x = 0)
  if (xOnLeft && state.rc === 0) {
    showSuccess('x = 0');
    return;
  }
  if (xOnRight && state.lc === 0) {
    showSuccess('x = 0');
    return;
  }

  // All zero — infinite solutions
  if (state.lx === 0 && state.lc === 0 && state.rx === 0 && state.rc === 0) {
    showSuccess('Infinite solutions! (0 = 0)');
    return;
  }
  // No solution
  if (state.lx === 0 && state.rx === 0 && state.lc !== state.rc) {
    showSuccess('No solution! (' + state.lc + ' ≠ ' + state.rc + ')');
    return;
  }
}

function showSuccess(text) {
  solved = true;
  document.getElementById('solutionText').textContent = text;
  document.getElementById('successOverlay').classList.add('show');
  launchConfetti();
}

function closeSuccess() {
  document.getElementById('successOverlay').classList.remove('show');
  solved = false;
}

function launchConfetti() {
  const colors = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6', '#EC4899'];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.top = '-20px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.width = (6 + Math.random() * 8) + 'px';
    piece.style.height = (6 + Math.random() * 8) + 'px';
    piece.style.animationDelay = (Math.random() * 0.5) + 's';
    piece.style.animationDuration = (1.5 + Math.random()) + 's';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3000);
  }
}
