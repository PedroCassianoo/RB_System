document.addEventListener('DOMContentLoaded', () => {
  // Initialize Home animations on first load
  triggerHomeAnimations();

  // Initialize Drag and Drop Upload Handlers (Phase 5)
  initDataUploadHandlers();

  // Tab switching routing logic - select all elements with data-target
  const allNavLinks = document.querySelectorAll('[data-target]');

  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('data-target');
      if (!targetId) return; // Ignore buttons with no targets (e.g. Sair, Configurações)

      e.preventDefault();

      // Update active states across ALL corresponding navigation links (Desktop and Mobile in sync)
      allNavLinks.forEach(item => {
        if (item.classList.contains('nav-item') || item.classList.contains('mobile-nav-item')) {
          if (item.getAttribute('data-target') === targetId) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        }
      });

      // Switch Visible Views
      const allViews = document.querySelectorAll('.view-section');
      allViews.forEach(view => {
        if (view.id === targetId) {
          view.classList.add('active');
        } else {
          view.classList.remove('active');
        }
      });

      // Update Mobile Header Title depending on view
      const mobileHeaderTitle = document.getElementById('mobileHeaderTitle');
      if (mobileHeaderTitle) {
        if (targetId === 'view-retention') {
          mobileHeaderTitle.textContent = 'Retention';
        } else if (targetId === 'view-events') {
          mobileHeaderTitle.textContent = 'Eventos & ROI';
        } else if (targetId === 'view-nps') {
          mobileHeaderTitle.textContent = 'Experiência & NPS';
        } else if (targetId === 'view-data') {
          mobileHeaderTitle.textContent = 'Gestão de Dados';
        } else {
          mobileHeaderTitle.textContent = 'Red Balloon';
        }
      }

      // Trigger Specific View Entry Animations
      if (targetId === 'view-home') {
        triggerHomeAnimations();
      } else if (targetId === 'view-retention') {
        triggerRetentionAnimations();
      } else if (targetId === 'view-events') {
        triggerEventsAnimations();
      } else if (targetId === 'view-nps') {
        triggerNpsAnimations();
      }
    });
  });
});

/**
 * Animate elements on the Home/Visão Geral view
 */
function triggerHomeAnimations() {
  animateCircularGauge('desktopNpsGauge', 82);
  animateCircularGauge('mobileNpsGauge', 78);
}

/**
 * Animate elements on the Retention/Insights view
 */
function triggerRetentionAnimations() {
  // Desktop Pareto Progress Bars
  animateHorizontalBar('pbar1', 45);
  animateHorizontalBar('pbar2', 25);
  animateHorizontalBar('pbar3', 15);
  animateHorizontalBar('pbar4', 10);
  animateHorizontalBar('pbar5', 5);

  // Mobile Reason Bars
  animateHorizontalBar('mbar1', 45);
  animateHorizontalBar('mbar2', 30);
  animateHorizontalBar('mbar3', 15);

  // Table Risk Progress Bars
  animateHorizontalBar('rbar1', 85);
  animateHorizontalBar('rbar2', 50);
  animateHorizontalBar('rbar3', 15);
}

/**
 * Animate elements on the Events & ROI view
 */
function triggerEventsAnimations() {
  // Desktop ROI Bars
  animateHorizontalBar('roibar1', 94);
  animateHorizontalBar('roibar2', 72);

  // Mobile Event Funnel RSVP/Attended Bars
  animateHorizontalBar('mevent1', 70);
  animateHorizontalBar('mevent2', 60);
}

/**
 * Animate a circular SVG progress gauge
 * Circumference = 2 * PI * 70 = 439.82
 */
function animateCircularGauge(elementId, percent) {
  const gauge = document.getElementById(elementId);
  if (!gauge) return;

  const circumference = 2 * Math.PI * 70; // 439.82
  
  // Set initial state
  gauge.style.strokeDasharray = circumference;
  gauge.style.strokeDashoffset = circumference;

  // Animate to target percent
  const offset = circumference - (percent / 100) * circumference;
  setTimeout(() => {
    gauge.style.strokeDashoffset = offset;
  }, 150);
}

/**
 * Animate a horizontal bar width
 */
function animateHorizontalBar(elementId, percent) {
  const bar = document.getElementById(elementId);
  if (!bar) return;

  // Set initial state
  bar.style.width = '0%';

  // Animate to target width
  setTimeout(() => {
    bar.style.width = `${percent}%`;
  }, 100);
}

/**
 * Animate elements on the Experiência & NPS view (Phase 4)
 */
function triggerNpsAnimations() {
  // Desktop Circular Gauge Aderência
  animateCircularGauge('adherenceGauge', 85);

  // Desktop Stacked Columns (Historical NPS)
  animateVerticalBar('npsbar1', 60);
  animateVerticalBar('npsbar2', 65);
  animateVerticalBar('npsbar3', 62);
  animateVerticalBar('npsbar4', 75);
  animateVerticalBar('npsbar5', 78);
  animateVerticalBar('npsbar6', 82);

  // Desktop Categories Progress Bars
  animateHorizontalBar('catbar1', 92);
  animateHorizontalBar('catbar2', 88);
  animateHorizontalBar('catbar3', 75);

  // Mobile Column Bars (Jan-Abr)
  animateVerticalBar('mnpsbar1', 60);
  animateVerticalBar('mnpsbar2', 65);
  animateVerticalBar('mnpsbar3', 70);
  animateVerticalBar('mnpsbar4', 85);
}

/**
 * Animate a vertical bar height
 */
function animateVerticalBar(elementId, percent) {
  const bar = document.getElementById(elementId);
  if (!bar) return;

  // Set initial height
  bar.style.height = '0%';

  // Animate to target height
  setTimeout(() => {
    bar.style.height = `${percent}%`;
  }, 100);
}

/**
 * Initialize Drag and Drop handlers for Data Management (Phase 5)
 */
function initDataUploadHandlers() {
  // Desktop elements
  const desktopDropzone = document.getElementById('desktopDropzone');
  const desktopFileInput = document.getElementById('desktopFileInput');
  const desktopFilePreview = document.getElementById('desktopFilePreview');
  const desktopFilename = document.getElementById('desktopFilename');
  const desktopFilesize = document.getElementById('desktopFilesize');
  const desktopRemoveFileBtn = document.getElementById('desktopRemoveFileBtn');

  // Mobile elements
  const mobileDropzone = document.getElementById('mobileDropzone');
  const mobileFileInput = document.getElementById('mobileFileInput');
  const mobileFilePreview = document.getElementById('mobileFilePreview');
  const mobileFilename = document.getElementById('mobileFilename');
  const mobileFilesize = document.getElementById('mobileFilesize');
  const mobileRemoveFileBtn = document.getElementById('mobileRemoveFileBtn');

  // Setup desktop dropzone events
  if (desktopDropzone && desktopFileInput) {
    setupDropzoneEvents(desktopDropzone, desktopFileInput, (file) => {
      desktopDropzone.style.display = 'none';
      desktopFilePreview.style.display = 'flex';
      desktopFilename.textContent = file.name;
      desktopFilesize.textContent = formatBytes(file.size);
    });
  }

  // Setup mobile dropzone events
  if (mobileDropzone && mobileFileInput) {
    setupDropzoneEvents(mobileDropzone, mobileFileInput, (file) => {
      mobileDropzone.style.display = 'none';
      mobileFilePreview.style.display = 'flex';
      mobileFilename.textContent = file.name;
      mobileFilesize.textContent = formatBytes(file.size);
    });
  }

  // Desktop remove button
  if (desktopRemoveFileBtn) {
    desktopRemoveFileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      desktopFileInput.value = ''; // Reset input
      desktopFilePreview.style.display = 'none';
      desktopDropzone.style.display = 'block';
    });
  }

  // Mobile remove button
  if (mobileRemoveFileBtn) {
    mobileRemoveFileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileFileInput.value = ''; // Reset input
      mobileFilePreview.style.display = 'none';
      mobileDropzone.style.display = 'block';
    });
  }
}

/**
 * Setup drag over, drag enter, drag leave, drop, and change events
 */
function setupDropzoneEvents(dropzone, fileInput, onFileSelected) {
  // Prevent defaults for all drag events
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
  });

  // Highlight dropzone on drag over/enter
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => {
      dropzone.classList.add('drag-active');
    }, false);
  });

  // Unhighlight dropzone on drag leave/drop
  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => {
      dropzone.classList.remove('drag-active');
    }, false);
  });

  // Handle drop file
  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files.length > 0) {
      fileInput.files = files;
      onFileSelected(files[0]);
    }
  }, false);

  // Handle file select via browsing
  fileInput.addEventListener('change', function() {
    if (this.files && this.files.length > 0) {
      onFileSelected(this.files[0]);
    }
  });
}

/**
 * Format bytes to readable size
 */
function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

