// ===== SCALE RENDERING =====
// Handles visual objects on the scale pans and scale tilt

function renderObjects(containerId, xc, cc) {
  const el = document.getElementById(containerId);
  el.innerHTML = '';
  // Variable objects (x blocks) — go on bottom
  const xAbs = Math.min(Math.abs(xc), 20);
  const isNegX = xc < 0;
  for (let i = 0; i < xAbs; i++) {
    const obj = document.createElement('div');
    obj.className = 'obj ' + (isNegX ? 'var-neg' : 'var-pos') + ' pop-in';
    obj.style.animationDelay = (i * 30) + 'ms';
    if (isNegX) {
      const neg = document.createElement('span');
      neg.className = 'neg-sign';
      neg.textContent = '−';
      obj.appendChild(neg);
    }
    const label = document.createTextNode('X');
    obj.appendChild(label);
    el.appendChild(obj);
  }
  // Constant objects (1 blocks) — stack on top of x blocks
  const cAbs = Math.min(Math.abs(cc), 20);
  const isNegC = cc < 0;
  for (let i = 0; i < cAbs; i++) {
    const obj = document.createElement('div');
    obj.className = 'obj ' + (isNegC ? 'const-neg' : 'const-pos') + ' pop-in';
    obj.style.animationDelay = ((xAbs + i) * 30) + 'ms';
    if (isNegC) {
      const neg = document.createElement('span');
      neg.className = 'neg-sign';
      neg.textContent = '−';
      obj.appendChild(neg);
    }
    const label = document.createTextNode('1');
    obj.appendChild(label);
    el.appendChild(obj);
  }
}

function updateScale() {
  const beam = document.getElementById('beamGroup');
  let angle = 0;
  if (trueX !== null) {
    const leftVal = evalSide(state.lx, state.lc, trueX);
    const rightVal = evalSide(state.rx, state.rc, trueX);
    const diff = leftVal - rightVal;
    if (Math.abs(diff) > 0.0001) {
      angle = diff > 0 ? -Math.min(Math.abs(diff) * 2, 12) : Math.min(Math.abs(diff) * 2, 12);
    }
  } else {
    const diff = state.lc - state.rc;
    if (Math.abs(diff) > 0.0001) {
      angle = diff > 0 ? -Math.min(Math.abs(diff) * 2, 12) : Math.min(Math.abs(diff) * 2, 12);
    }
  }
  beam.style.transform = 'rotate(' + angle + 'deg)';
  beam.style.transition = 'transform 0.5s ease';

  // Position object containers: sit on top of shelves
  const leftObjs = document.getElementById('leftObjects');
  const rightObjs = document.getElementById('rightObjects');
  const baseBottom = 78;
  const tiltOffset = Math.abs(angle) * 2.2;
  if (angle < 0) {
    leftObjs.style.bottom = (baseBottom - tiltOffset) + 'px';
    rightObjs.style.bottom = (baseBottom + tiltOffset) + 'px';
  } else if (angle > 0) {
    leftObjs.style.bottom = (baseBottom + tiltOffset) + 'px';
    rightObjs.style.bottom = (baseBottom - tiltOffset) + 'px';
  } else {
    leftObjs.style.bottom = baseBottom + 'px';
    rightObjs.style.bottom = baseBottom + 'px';
  }
}
