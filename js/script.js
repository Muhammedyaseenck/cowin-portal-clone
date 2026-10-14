document.addEventListener('DOMContentLoaded', () => {

  const toastEl = document.getElementById('appToast');
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  function showToast(msg, type = 'success') {
    toastEl.className = `toast align-items-center text-bg-${type} border-0`;
    document.getElementById('toastMsg').textContent = msg;
    toast.show();
  }

  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
  document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => new bootstrap.Popover(el));

  const root = document.documentElement;
  let size = 16;
  const setSize = s => { size = Math.min(22, Math.max(12, s)); root.style.fontSize = size + 'px'; };
  document.getElementById('fontUp').onclick    = () => setSize(size + 1);
  document.getElementById('fontDown').onclick  = () => setSize(size - 1);
  document.getElementById('fontReset').onclick = () => setSize(16);

  function animateCount(el) {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const prefix = el.textContent.trim().startsWith('+') ? '+ ' : '';
    const duration = 1500, start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = prefix + Math.floor(target * p).toLocaleString('en-IN') + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animateCount(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => io.observe(el));
  } else {
    counters.forEach(animateCount);
  }

  const districts = {
    'Kerala': ['Thrissur', 'Ernakulam', 'Kozhikode', 'Thiruvananthapuram'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
    'Karnataka': ['Bengaluru Urban', 'Mysuru', 'Mangaluru'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
    'Delhi': ['New Delhi', 'South Delhi', 'North Delhi']
  };
  const stateSel = document.getElementById('stateSelect');
  const distSel  = document.getElementById('districtSelect');
  const results  = document.getElementById('resultsBox');

  stateSel.addEventListener('change', () => {
    distSel.innerHTML = '<option value="" selected>Select District</option>';
    const list = districts[stateSel.value] || [];
    list.forEach(d => distSel.insertAdjacentHTML('beforeend', `<option>${d}</option>`));
    distSel.disabled = list.length === 0;
  });

  function fakeSearch(label) {
    results.innerHTML = `
      <div class="text-center py-4">
        <div class="spinner-border text-info" role="status"><span class="visually-hidden">Loading...</span></div>
      </div>`;
    setTimeout(() => {
      results.innerHTML = `
        <h6 class="mb-3">Centers near ${label}</h6>
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between align-items-center">
            Government Hospital <span class="badge text-bg-success rounded-pill">Available: 42</span></li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            Community Health Center <span class="badge text-bg-warning rounded-pill">Available: 6</span></li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            Private Clinic <span class="badge text-bg-danger rounded-pill">Booked</span></li>
        </ul>`;
    }, 1200);
  }

  document.getElementById('districtSearch').addEventListener('click', () => {
    if (!stateSel.value || !distSel.value) {
      results.innerHTML = '<div class="alert alert-warning alert-dismissible fade show">Please select both state and district.' +
                          '<button class="btn-close" data-bs-dismiss="alert"></button></div>';
      return;
    }
    fakeSearch(distSel.value + ', ' + stateSel.value);
  });

  document.getElementById('pinSearch').addEventListener('click', () => {
    const pin = document.getElementById('pinInput').value.trim();
    if (!/^[0-9]{6}$/.test(pin)) {
      results.innerHTML = '<div class="alert alert-warning alert-dismissible fade show">Please enter a valid 6-digit PIN.' +
                          '<button class="btn-close" data-bs-dismiss="alert"></button></div>';
      return;
    }
    fakeSearch('PIN ' + pin);
  });

  document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
    form.reset(); form.classList.remove('was-validated');
    showToast('OTP sent to your mobile number');
  });

  const locModal = new bootstrap.Modal(document.getElementById('locationModal'));
  document.querySelector('[data-bs-target="#tabMap"]').addEventListener('shown.bs.tab', () => locModal.show());
  document.getElementById('allowLoc').addEventListener('click', () => showToast('Location access allowed'));

  document.getElementById('reportBtn').addEventListener('click', () =>
    showToast('Please sign in to report a side effect', 'info'));

  const issueTrack = document.getElementById('issueTrack');
  document.getElementById('issueNext').addEventListener('click', () => {
    issueTrack.scrollBy({ left: 300, behavior: 'smooth' });
  });
  document.getElementById('issuePrev').addEventListener('click', () => {
    issueTrack.scrollBy({ left: -300, behavior: 'smooth' });
  });

  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => toTop.classList.toggle('d-none', window.scrollY < 400));
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});