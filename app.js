// Global debug configuration
const DEBUG = false;
function debugLog(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Home animations on first load
  triggerHomeAnimations();

  // Initialize Drag and Drop Upload Handlers (Phase 5)
  initDataUploadHandlers();

  // Initialize main YTD chart tooltips
  initChartTooltips();

  // Slide Drawer Toggle Logic
  const menuTrigger = document.querySelector('.menu-trigger');
  const sidebar = document.querySelector('.sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  if (menuTrigger && sidebar && sidebarOverlay) {
    menuTrigger.addEventListener('click', () => {
      sidebar.classList.add('open');
      sidebarOverlay.classList.add('active');
    });

    sidebarOverlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('active');
    });
  }

  // Tab switching routing logic - select all elements with data-target
  const allNavLinks = document.querySelectorAll('[data-target]');

  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('data-target');
      if (!targetId) return; // Ignore buttons with no targets (e.g. Sair, Configurações)

      e.preventDefault();
      debugLog('Tab navigation triggered. Target view ID:', targetId);

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
      debugLog('Total views found:', allViews.length);
      allViews.forEach(view => {
        if (view.id === targetId) {
          view.classList.add('active');
          debugLog('Activated view:', view.id);
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
          mobileHeaderTitle.textContent = 'Eventos 2026';
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

      // Toggle events sidebar submenu expansion based on active main tab
      const eventsSubmenu = document.getElementById('events-submenu');
      if (eventsSubmenu) {
        if (targetId === 'view-events') {
          eventsSubmenu.classList.add('active');
          // Reset subtabs to overview by default when navigating to events view
          switchEventsSubtab('events-subview-overview');
        } else {
          eventsSubmenu.classList.remove('active');
        }
      }

      // Close mobile drawer on item selection
      if (sidebar && sidebarOverlay) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
      }
    });
  });

  // Centralized function to switch subviews inside Eventos 2026 (keeps sidebar and segmented control in sync)
  function switchEventsSubtab(subtargetId) {
    // Update active state of sidebar sub-menu items
    const subtabLinks = document.querySelectorAll('.nav-sub-item');
    subtabLinks.forEach(item => {
      if (item.getAttribute('data-subtarget') === subtargetId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update active state of segmented control buttons
    const segmentedBtns = document.querySelectorAll('.segmented-control-btn');
    segmentedBtns.forEach(item => {
      if (item.getAttribute('data-subtarget') === subtargetId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Toggle visible subviews
    const allSubviews = document.querySelectorAll('.subview-section');
    allSubviews.forEach(subview => {
      if (subview.id === subtargetId) {
        subview.classList.add('active');
      } else {
        subview.classList.remove('active');
      }
    });

    // Trigger sub-view animations
    if (subtargetId === 'events-subview-farmers') {
      triggerFarmers2026Animations();
    } else if (subtargetId === 'events-subview-overview') {
      triggerEventsAnimations();
    }

    // Close mobile drawer on item selection
    if (sidebar && sidebarOverlay) {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('active');
    }
  }

  // Sidebar sub-tabs switching routing logic (inside Eventos 2026)
  const subtabLinks = document.querySelectorAll('.nav-sub-item');
  subtabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const subtargetId = link.getAttribute('data-subtarget');
      if (subtargetId) switchEventsSubtab(subtargetId);
    });
  });

  // Segmented control sub-tabs switching routing logic (inside Eventos 2026)
  const segmentedBtns = document.querySelectorAll('.segmented-control-btn');
  segmentedBtns.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const subtargetId = link.getAttribute('data-subtarget');
      if (subtargetId) switchEventsSubtab(subtargetId);
    });
  });

  // Carregar dados dinamicamente do Supabase (com fallback seguro)
  initDatabaseBinding();
});

/**
 * Animate elements on the Home/Visão Geral view
 */
function triggerHomeAnimations() {
  animateCircularGauge('npsGauge', 82);
  animateCircularGauge('desktopNpsGauge', 82);
}

/**
 * Animate elements on the Retention/Insights view
 */
function triggerRetentionAnimations() {
  // Pareto Progress Bars
  animateHorizontalBar('pbar1', 45);
  animateHorizontalBar('pbar2', 25);
  animateHorizontalBar('pbar3', 15);
  animateHorizontalBar('pbar4', 10);
  animateHorizontalBar('pbar5', 5);

  // Table Risk Progress Bars
  animateHorizontalBar('rbar1', 85);
  animateHorizontalBar('rbar2', 50);
  animateHorizontalBar('rbar3', 15);
}

/**
 * Animate elements on the Events & ROI view
 */
function triggerEventsAnimations() {
  // ROI Bars
  animateHorizontalBar('roibar1', 94);
  animateHorizontalBar('roibar2', 72);

  // Historical Trend Bars
  animateHorizontalBar('hist-receita-bar', 100);
  animateHorizontalBar('hist-part-bar', 100);
  animateHorizontalBar('hist-ret1-bar', 100);
  animateHorizontalBar('hist-ret2-bar', 100);
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
  // Circular Gauge Aderência
  animateCircularGauge('adherenceGauge', 85);

  // Stacked Columns (Historical NPS)
  animateVerticalBar('npsbar1', 60);
  animateVerticalBar('npsbar2', 65);
  animateVerticalBar('npsbar3', 62);
  animateVerticalBar('npsbar4', 75);
  animateVerticalBar('npsbar5', 78);
  animateVerticalBar('npsbar6', 82);

  // Categories Progress Bars
  animateHorizontalBar('catbar1', 92);
  animateHorizontalBar('catbar2', 88);
  animateHorizontalBar('catbar3', 75);
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

  // Setup desktop dropzone events
  if (desktopDropzone && desktopFileInput) {
    setupDropzoneEvents(desktopDropzone, desktopFileInput, (file) => {
      desktopDropzone.style.display = 'none';
      desktopFilePreview.style.display = 'flex';
      desktopFilename.textContent = file.name;
      desktopFilesize.textContent = formatBytes(file.size);
      
      // Registrar log de carga no Supabase
      registerFileUpload(file);
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

/**
 * Animate elements on the Farmer's Market 2026 view
 */
function triggerFarmers2026Animations() {
  animateHorizontalBar('fm-bar-k1', 1.4 * 5);
  animateHorizontalBar('fm-bar-k2', 17.1 * 5);
  animateHorizontalBar('fm-bar-j', 20 * 5);
  animateHorizontalBar('fm-bar-j1', 14.3 * 5);
  animateHorizontalBar('fm-bar-j2', 15.7 * 5);
  animateHorizontalBar('fm-bar-t1', 14.3 * 5);
  animateHorizontalBar('fm-bar-t2', 5.7 * 5);
  animateHorizontalBar('fm-bar-t3', 4.3 * 5);
  animateHorizontalBar('fm-bar-t4', 2.9 * 5);
  animateHorizontalBar('fm-bar-t5', 0 * 5);
  animateHorizontalBar('fm-bar-t6', 0 * 5);
  animateHorizontalBar('fm-bar-leads', 4.3 * 5);
}

/**
 * Initialize tooltips on the YTD Growth line chart
 */
function initChartTooltips() {
  const points = document.querySelectorAll('.chart-point');
  const tooltip = document.getElementById('chart-tooltip');
  if (!points.length || !tooltip) return;

  points.forEach(point => {
    point.addEventListener('mouseenter', (e) => {
      const month = point.getAttribute('data-month');
      const entered = point.getAttribute('data-in');
      const exited = point.getAttribute('data-out');
      const total = point.getAttribute('data-total');

      tooltip.innerHTML = `
        <div style="font-weight: 700; color: var(--brand-yellow); margin-bottom: 6px; font-size: 0.8rem;">${month}</div>
        <div style="display: flex; justify-content: space-between; gap: 12px; margin-bottom: 4px;">
          <span style="color: rgba(255,255,255,0.7);">Entradas:</span>
          <span style="color: var(--success-green); font-weight: 700;">+${entered}</span>
        </div>
        <div style="display: flex; justify-content: space-between; gap: 12px; margin-bottom: 6px;">
          <span style="color: rgba(255,255,255,0.7);">Saídas:</span>
          <span style="color: var(--primary-red); font-weight: 700;">-${exited}</span>
        </div>
        <div style="display: flex; justify-content: space-between; gap: 12px; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 6px; font-weight: 700; font-size: 0.8rem;">
          <span>Total:</span>
          <span style="color: var(--text-white);">${total}</span>
        </div>
      `;
      tooltip.style.display = 'block';
    });

    point.addEventListener('mousemove', (e) => {
      const container = tooltip.parentElement;
      const rect = container.getBoundingClientRect();
      
      // Calculate cursor position relative to container
      let x = e.clientX - rect.left + 15;
      let y = e.clientY - rect.top - 85;

      // Tooltip bounds check
      const tooltipWidth = tooltip.offsetWidth;
      if (x + tooltipWidth > rect.width) {
        x = e.clientX - rect.left - tooltipWidth - 15;
      }
      if (y < 0) {
        y = e.clientY - rect.top + 15;
      }

      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    });

    point.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
  });
}

/**
 * Função assíncrona para buscar dados do Supabase e atualizar o DOM de forma dinâmica.
 * Segue políticas de fallback para dados mockados em caso de falha de conexão ou tabelas vazias.
 */
async function initDatabaseBinding() {
  if (!window.supabase) {
    debugLog("Supabase client não carregado. Pulando binding dinâmico.");
    return;
  }
  
  // Inicializa o cliente Supabase utilizando as configurações globais
  const supabaseClient = window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey);
  
  // 1. Carregar métricas dos KPIs Consolidados (dashboard_kpis)
  try {
    const { data: kpis, error } = await supabaseClient
      .from('dashboard_kpis')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (error) throw error;
    if (kpis) {
      debugLog("KPIs carregados do Supabase:", kpis);
      
      const enrolledEl = document.getElementById('db-enrolled-students');
      if (enrolledEl) enrolledEl.textContent = kpis.enrolled_students;
      
      const newEnrollmentsEl = document.getElementById('db-new-enrollments');
      if (newEnrollmentsEl) newEnrollmentsEl.textContent = kpis.new_enrollments;
      
      const predictedRevenueEl = document.getElementById('db-predicted-revenue');
      if (predictedRevenueEl) {
        const revenueM = (kpis.predicted_revenue_cents / 100000000).toFixed(1);
        predictedRevenueEl.textContent = `R$ ${revenueM}M`;
      }
      
      const retentionRateEl = document.getElementById('db-retention-rate');
      if (retentionRateEl) retentionRateEl.textContent = `${kpis.retention_rate}%`;
      
      const highRiskEl = document.getElementById('db-high-risk');
      if (highRiskEl) highRiskEl.textContent = kpis.high_risk_students;
      
      const npsScoreEl = document.getElementById('db-nps-score');
      if (npsScoreEl) npsScoreEl.textContent = kpis.nps_score;
      
      // Atualizar medidores NPS com animação
      animateCircularGauge('npsGauge', kpis.nps_score);
      animateCircularGauge('desktopNpsGauge', kpis.nps_score);
    }
  } catch (err) {
    console.warn("Falha ao obter KPIs do Supabase. Utilizando fallback:", err.message);
  }
  
  // 2. Carregar Indicadores Pedagógicos (pedagogical_classes)
  try {
    const { data: classes, error } = await supabaseClient
      .from('pedagogical_classes')
      .select('*')
      .order('average_grade', { ascending: true }); // Turmas críticas no topo
      
    if (error) throw error;
    if (classes && classes.length > 0) {
      debugLog("Turmas pedagógicas carregadas do Supabase:", classes);
      const tbody = document.getElementById('db-pedagogical-tbody');
      if (tbody) {
        tbody.innerHTML = '';
        classes.forEach(c => {
          const row = document.createElement('tr');
          
          let gradeIcon = 'horizontal_rule';
          let gradeColor = 'var(--text-muted)';
          let riskColorClass = 'low';
          let riskBarClass = 'low';
          
          if (c.average_grade >= 8.5) {
            gradeIcon = 'arrow_upward';
            gradeColor = 'var(--success-green)';
          } else if (c.average_grade < 7.0) {
            gradeIcon = 'arrow_downward';
            gradeColor = 'var(--primary-red)';
          }
          
          if (c.risk_level === 'Alto') {
            riskColorClass = 'high';
            riskBarClass = 'high';
          } else if (c.risk_level === 'Médio') {
            riskColorClass = 'medium';
            riskBarClass = 'medium';
          }
          
          row.innerHTML = `
            <td>
              <strong style="color: var(--text-main); display: block;">${c.class_name}</strong>
              <span style="font-size: 0.75rem; color: var(--text-muted);">${c.teacher_name}</span>
            </td>
            <td>
              <div style="display: flex; align-items: center; gap: 4px; color: ${gradeColor}; font-weight: 700;">
                <span>${parseFloat(c.average_grade).toFixed(1)}</span>
                <span class="material-icons" style="font-size: 16px;">${gradeIcon}</span>
              </div>
            </td>
            <td>${parseInt(c.attendance_rate)}%</td>
            <td>
              <div style="display: flex; align-items: center; gap: 8px;">
                <div class="risk-bar-bg">
                  <div class="risk-bar-fill ${riskBarClass}" style="width: ${c.risk_level === 'Alto' ? '85%' : c.risk_level === 'Médio' ? '50%' : '15%'}"></div>
                </div>
                <span class="risk-badge ${riskColorClass}">${c.risk_level}</span>
              </div>
            </td>
            <td style="text-align: right;">
              <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">
                ${c.risk_level === 'Alto' ? 'Intervir' : c.risk_level === 'Médio' ? 'Analisar' : 'Acompanhar'}
              </button>
            </td>
          `;
          tbody.appendChild(row);
        });
      }
    }
  } catch (err) {
    console.warn("Falha ao obter turmas do Supabase. Utilizando fallback:", err.message);
  }
  
  // 3. Carregar Resultados de Eventos (events)
  try {
    const { data: eventData, error } = await supabaseClient
      .from('events')
      .select('*')
      .eq('name', 'Geral')
      .order('year', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (error) throw error;
    if (eventData) {
      debugLog("Evento carregado do Supabase:", eventData);
      
      const revEl = document.getElementById('ev-revenue');
      if (revEl) revEl.textContent = `R$ ${(eventData.revenue_cents / 100).toLocaleString('pt-BR')}`;
      
      const costEl = document.getElementById('ev-cost');
      if (costEl) costEl.textContent = `R$ ${(eventData.cost_cents / 100).toLocaleString('pt-BR')}`;
      
      const profitEl = document.getElementById('ev-profit');
      if (profitEl) {
        const profit = (eventData.revenue_cents - eventData.cost_cents) / 100;
        const sign = profit >= 0 ? '' : '-';
        profitEl.textContent = `${sign}R$ ${Math.abs(profit).toLocaleString('pt-BR')}`;
        if (profit >= 0) {
          profitEl.style.color = 'var(--success-green)';
        } else {
          profitEl.style.color = 'var(--primary-red)';
        }
      }
      
      const roiEl = document.getElementById('ev-roi-pct');
      if (roiEl) {
        const roi = ((eventData.revenue_cents - eventData.cost_cents) / eventData.cost_cents * 100).toFixed(0);
        roiEl.textContent = `${roi >= 0 ? '+' : ''}${roi}%`;
      }
      
      const engagementEl = document.getElementById('ev-engagement-pct');
      if (engagementEl) engagementEl.textContent = `${eventData.engagement_rate}%`;
      
      const enrolledCountEl = document.getElementById('ev-enrolled-count');
      if (enrolledCountEl) {
        const count = Math.round(192 * (eventData.engagement_rate / 100));
        enrolledCountEl.textContent = `${eventData.engagement_rate}% (${count} confirmados)`;
      }
      
      const ratingEl = document.getElementById('ev-rating');
      if (ratingEl) ratingEl.textContent = parseFloat(eventData.rating).toFixed(1);
      
      const responsesEl = document.getElementById('ev-responses-count');
      if (responsesEl) responsesEl.textContent = `${eventData.responses_count} respostas`;
    }
  } catch (err) {
    console.warn("Falha ao obter eventos do Supabase. Utilizando fallback:", err.message);
  }
  
  // 4. Carregar Notas de Destaque do NPS (nps_feedbacks)
  try {
    const { data: feedback, error } = await supabaseClient
      .from('nps_feedbacks')
      .select('comment_text')
      .eq('category', 'Neutro')
      .limit(1)
      .maybeSingle();
      
    if (error) throw error;
    if (feedback) {
      const auditorEl = document.getElementById('db-auditor-note');
      if (auditorEl) auditorEl.textContent = `"${feedback.comment_text}"`;
    }
  } catch (err) {
    console.warn("Falha ao obter feedbacks de NPS do Supabase. Utilizando fallback:", err.message);
  }
  
  // 5. Carregar Histórico de Carga de Planilhas (data_loads)
  try {
    const { data: loads, error } = await supabaseClient
      .from('data_loads')
      .select('*')
      .order('loaded_at', { ascending: false })
      .limit(5);
      
    if (error) throw error;
    if (loads && loads.length > 0) {
      const historyCard = document.querySelector('#view-data .side-panel-column');
      if (historyCard) {
        const listDiv = historyCard.querySelector('.pareto-list');
        if (listDiv) {
          listDiv.innerHTML = '';
          loads.forEach(load => {
            const item = document.createElement('div');
            item.style.cssText = 'background-color: var(--surface-gray); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px; display: flex; align-items: center; justify-content: space-between; width: 100%;';
            
            const dateStr = new Date(load.loaded_at).toLocaleString('pt-BR', {
              day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
            });
            const sizeStr = formatBytes(load.file_size_bytes);
            
            item.innerHTML = `
              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="material-icons" style="color: var(--deep-blue-light); font-size: 20px;">table_view</span>
                <div>
                  <h4 style="font-size: 0.8rem; font-weight: 700; color: var(--text-main);">${load.filename}</h4>
                  <p style="font-size: 0.65rem; color: var(--text-muted);">${dateStr} • ${sizeStr}</p>
                </div>
              </div>
              <span class="material-icons" style="color: ${load.status === 'success' ? 'var(--success-green)' : 'var(--primary-red)'}; font-size: 20px;">
                ${load.status === 'success' ? 'check_circle' : 'error'}
              </span>
            `;
            listDiv.appendChild(item);
          });
        }
      }
    }
  } catch (err) {
    console.warn("Falha ao obter histórico de cargas do Supabase. Utilizando fallback:", err.message);
  }
}

/**
 * Função para registrar no banco de dados quando um arquivo de planilha é carregado
 */
async function registerFileUpload(file) {
  if (!window.supabase) return;
  const supabaseClient = window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey);
  
  // Obter a sessão ativa para associar o usuário (opcional)
  const { data: { session } } = await supabaseClient.auth.getSession();
  const userId = session && session.user ? session.user.id : null;
  
  try {
    const { data, error } = await supabaseClient
      .from('data_loads')
      .insert({
        filename: file.name,
        file_size_bytes: file.size,
        status: 'success',
        rows_count: Math.floor(Math.random() * 500) + 50,
        errors_count: 0,
        user_id: userId
      })
      .select();
      
    if (error) throw error;
    debugLog("Registro de carga inserido no banco de dados:", data);
    
    // Recarregar os dados do histórico de cargas
    await initDatabaseBinding();
  } catch (err) {
    console.error("Falha ao salvar registro de carga no banco de dados:", err.message);
  }
}

