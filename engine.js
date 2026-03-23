// ===== EQUATION ENGINE =====
// Handles parsing, formatting, solving, and balance checking

// State
let state = { lx: 0, lc: 0, rx: 0, rc: 0 };
let initial = { lx: 0, lc: 0, rx: 0, rc: 0 };
let trueX = null;
let lastAction = null;
let solved = false;

// Solve: (lx)*x + lc = (rx)*x + rc => x = (rc - lc) / (lx - rx)
function solveForX(eq) {
  const netX = eq.lx - eq.rx;
  if (netX === 0) return null;
  return (eq.rc - eq.lc) / netX;
}

// Evaluate one side given x value
function evalSide(xCoeff, constant, x) {
  return xCoeff * x + constant;
}

// Check balance using the true x value
function isBalanced() {
  if (trueX === null) {
    const netX = state.lx - state.rx;
    const netC = state.rc - state.lc;
    return (netX === 0 && netC === 0);
  }
  const left = evalSide(state.lx, state.lc, trueX);
  const right = evalSide(state.rx, state.rc, trueX);
  return Math.abs(left - right) < 0.0001;
}

// Parse equation string like "3x + 5 = 10x + 12"
function parseEquation(str) {
  str = str.replace(/\s+/g, '');
  const eqIdx = str.indexOf('=');
  if (eqIdx === -1) return null;
  const left = str.substring(0, eqIdx);
  const right = str.substring(eqIdx + 1);
  function parseSide(s) {
    let xCoeff = 0, constant = 0;
    if (s.length > 0 && s[0] !== '+' && s[0] !== '-') s = '+' + s;
    const terms = s.match(/[+-][^+-]+/g);
    if (!terms) return null;
    for (const term of terms) {
      const t = term.trim();
      if (t.includes('x')) {
        const numPart = t.replace('x', '');
        if (numPart === '+' || numPart === '') xCoeff += 1;
        else if (numPart === '-') xCoeff -= 1;
        else xCoeff += parseInt(numPart, 10);
      } else {
        constant += parseInt(t, 10);
      }
    }
    return { x: xCoeff, c: constant };
  }
  const l = parseSide(left);
  const r = parseSide(right);
  if (!l || !r) return null;
  return { lx: l.x, lc: l.c, rx: r.x, rc: r.c };
}

function formatSide(xc, cc) {
  let parts = [];
  if (xc !== 0) {
    if (xc === 1) parts.push('x');
    else if (xc === -1) parts.push('-x');
    else parts.push(xc + 'x');
  }
  if (cc !== 0) {
    if (parts.length > 0) {
      parts.push(cc > 0 ? '+ ' + cc : '- ' + Math.abs(cc));
    } else {
      parts.push('' + cc);
    }
  }
  if (parts.length === 0) parts.push('0');
  return parts.join(' ');
}

function formatEquation() {
  return formatSide(state.lx, state.lc) + ' = ' + formatSide(state.rx, state.rc);
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

function formatSolution(val) {
  if (Number.isInteger(val)) return '' + val;
  const num = Math.round(val * 10000);
  const den = 10000;
  const g = gcd(Math.abs(num), den);
  return (num / g) + '/' + (den / g);
}
