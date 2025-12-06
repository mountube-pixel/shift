// src/pages/org-admin/home.js
import { apiCall, ENDPOINTS } from '../../js/api.js';
import { t } from '../../js/i18n.js';
import { renderOrgAdminPage } from '../../js/org-admin-shell.js';

export default (props, { $f7, $h, $on }) => {
  const $ = $f7.$; // Dom7

  // --- 1. RENDER STATICO (Scheletro) ---
  const renderContent = ($h_shell) => {
      return $h_shell`
        <div class="org-dashboard-wrapper">
            
            <div id="org-header-container">
                <div class="card margin-bottom shadow-sm no-border" style="height: 100px; background: #fff;">
                     <div class="card-content card-content-padding display-flex align-items-center">
                        <div class="preloader color-teal margin-right"></div>
                        <span class="text-color-gray">${t('common.loading')}</span>
                     </div>
                </div>
            </div>

            <div id="org-stats-container">
                 <div class="block text-align-center margin-top-xl">
                    <div class="preloader color-teal"></div>
                    <p class="text-color-gray size-12 margin-top-half">${t('org_dashboard.loading')}</p>
                 </div>
            </div>

            <div class="block-title margin-top display-flex justify-content-space-between align-items-center">
                <span>${t('org_dashboard.quick_actions')}</span>
            </div>
            
            <div class="row">
                <div class="col-50 medium-25">
                    <a href="/org-admin/projects/create/" class="button button-large button-round dashboard-btn gradient-teal hover-lift">
                        <i class="icon f7-icons size-32 text-color-white">plus_square_fill</i>
                        <span class="font-weight-bold size-13 text-color-white margin-top-half">${t('org_dashboard.btn_new_project')}</span>
                    </a>
                </div>
                
                <div class="col-50 medium-25">
                    <a href="/org-admin/approvals/" class="button button-large button-round dashboard-btn gradient-orange hover-lift">
                        <i class="icon f7-icons size-32 text-color-white">checkmark_seal_fill</i>
                        <span class="font-weight-bold size-13 text-color-white margin-top-half">${t('org_dashboard.btn_approve')}</span>
                    </a>
                </div>

                <div class="col-50 medium-25 margin-top-half-mobile">
                     <a href="/org-admin/volunteers/" class="button button-large button-round dashboard-btn gradient-purple hover-lift">
                        <i class="icon f7-icons size-32 text-color-white">person_3_fill</i>
                        <span class="font-weight-bold size-13 text-color-white margin-top-half">${t('org_dashboard.btn_volunteers')}</span>
                    </a>
                </div>

                <div class="col-50 medium-25 margin-top-half-mobile">
                     <a href="/org-admin/settings/" class="button button-large button-round dashboard-btn gradient-slate hover-lift">
                        <i class="icon f7-icons size-32 text-color-white">gear_alt_fill</i>
                        <span class="font-weight-bold size-13 text-color-white margin-top-half">${t('org_dashboard.btn_settings')}</span>
                    </a>
                </div>
            </div>
            
            <div class="block-title margin-top-double font-weight-bold size-14 text-color-gray">${t('org_dashboard.recent_activity')}</div>
            <div class="card no-border shadow-sm" style="border-radius: 16px;">
                <div class="card-content">
                    <div class="list media-list no-hairlines">
                        <ul>
                            <li>
                                <div class="item-content">
                                    <div class="item-media">
                                        <div class="bg-color-teal-light text-color-teal display-flex justify-content-center align-items-center" style="width: 40px; height: 40px; border-radius: 12px;">
                                            <i class="icon f7-icons size-20">clock_fill</i>
                                        </div>
                                    </div>
                                    <div class="item-inner">
                                        <div class="item-title-row">
                                            <div class="item-title size-14 font-weight-bold">System</div>
                                            <div class="item-after size-11 text-color-gray">Now</div>
                                        </div>
                                        <div class="item-subtitle size-12 text-color-gray">Dashboard Ready</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
        
        <style>
            .kpi-card { border: none; border-radius: 16px; height: 100%; transition: transform 0.2s; background: white; }
            .kpi-card:hover { transform: translateY(-2px); }
            .shadow-sm { box-shadow: 0 4px 15px rgba(0,0,0,0.04); }
            .shadow-teal { box-shadow: 0 8px 20px rgba(0, 137, 123, 0.3); }
            .shadow-orange { box-shadow: 0 8px 20px rgba(255, 152, 0, 0.3); }
            .shadow-purple { box-shadow: 0 8px 20px rgba(156, 39, 176, 0.3); }
            .hover-scale { transition: transform 0.2s; }
            .hover-scale:active { transform: scale(0.97); }
            
            .dashboard-btn { height: 110px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: none; transition: transform 0.2s, box-shadow 0.2s; }
            .hover-lift:hover { transform: translateY(-3px); }

            .gradient-teal { background: linear-gradient(135deg, #4DB6AC 0%, #00897B 100%); box-shadow: 0 8px 20px -5px rgba(0, 137, 123, 0.5); }
            .gradient-orange { background: linear-gradient(135deg, #FFB74D 0%, #F57C00 100%); box-shadow: 0 8px 20px -5px rgba(245, 124, 0, 0.5); }
            .gradient-purple { background: linear-gradient(135deg, #BA68C8 0%, #8E24AA 100%); box-shadow: 0 8px 20px -5px rgba(142, 36, 170, 0.5); }
            .gradient-slate { background: linear-gradient(135deg, #90A4AE 0%, #546E7A 100%); box-shadow: 0 8px 20px -5px rgba(84, 110, 122, 0.5); }

            .org-header-card { color: white; border-radius: 16px; }
            .bg-color-teal-light { background: rgba(0, 137, 123, 0.1); }
            .bg-color-orange-light { background: rgba(255, 152, 0, 0.1); }
            .bg-color-purple-light { background: rgba(156, 39, 176, 0.1); }

            .margin-top-half-mobile { margin-top: 0; }
            @media (max-width: 768px) { .margin-top-half-mobile { margin-top: 16px; } }
        </style>
      `;
  };

  // --- 2. LOGICA JS (Caricamento Dati) ---
  const loadStats = async () => {
    const statsContainer = $('#org-stats-container');
    const headerContainer = $('#org-header-container');
    
    try {
      const data = await apiCall(ENDPOINTS.ORG_ADMIN_STATS);
      const org = data.org || { name: 'Associazione', primary_color: '#00897B' };
      const stats = data.stats || { active_projects: 0, pending_hours: 0, volunteers: 0 };

      // 1. RENDER HEADER (HTML String con variabili)
      const logoHtml = org.logo_url 
          ? `<img src="${org.logo_url}" style="width: 100%; height: 100%; border-radius: 16px; object-fit: cover;">`
          : `<span style="font-size: 28px; font-weight: 800; color: ${org.primary_color}">${org.name.charAt(0)}</span>`;

      const headerHTML = `
        <div class="card margin-bottom shadow-teal no-border org-header-card" style="background: linear-gradient(135deg, ${org.primary_color}, #222);">
            <div class="card-content card-content-padding display-flex align-items-center" style="padding: 24px;">
                <div style="width: 64px; height: 64px; background: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-right: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
                    ${logoHtml}
                </div>
                <div>
                    <h2 class="no-margin size-22 font-weight-bold" style="text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${org.name}</h2>
                    <p class="no-margin opacity-80 size-14">${t('org_dashboard.panel_control')}</p>
                </div>
            </div>
        </div>
      `;
      headerContainer.html(headerHTML);

      // 2. RENDER KPI STATS (HTML String con traduzioni)
      const statsHTML = `
        <div class="row">
            <div class="col-100 medium-33">
                <div class="card kpi-card shadow-sm bg-color-white">
                    <div class="card-content card-content-padding display-flex align-items-center">
                        <div class="bg-color-teal-light text-color-teal" style="width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                            <i class="icon f7-icons">layers_fill</i>
                        </div>
                        <div>
                            <div class="size-28 font-weight-800 text-color-black line-height-1">${stats.active_projects}</div>
                            <div class="text-color-gray size-12 font-weight-600 uppercase">${t('org_dashboard.kpi_projects')}</div>
                            <div class="size-10 text-color-gray opacity-70">${t('org_dashboard.kpi_projects_sub')}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-100 medium-33 margin-top-half-mobile">
                <div class="card kpi-card shadow-sm bg-color-white">
                    <div class="card-content card-content-padding display-flex align-items-center">
                        <div class="bg-color-orange-light text-color-orange" style="width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                            <i class="icon f7-icons">clock_fill</i>
                        </div>
                        <div>
                            <div class="size-28 font-weight-800 text-color-black line-height-1">${stats.pending_hours}</div>
                            <div class="text-color-gray size-12 font-weight-600 uppercase">${t('org_dashboard.kpi_hours')}</div>
                            <div class="size-10 text-color-gray opacity-70">${t('org_dashboard.kpi_hours_sub')}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-100 medium-33 margin-top-half-mobile">
                <div class="card kpi-card shadow-sm bg-color-white">
                    <div class="card-content card-content-padding display-flex align-items-center">
                        <div class="bg-color-purple-light text-color-purple" style="width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                            <i class="icon f7-icons">person_3_fill</i>
                        </div>
                        <div>
                            <div class="size-28 font-weight-800 text-color-black line-height-1">${stats.volunteers}</div>
                            <div class="text-color-gray size-12 font-weight-600 uppercase">${t('org_dashboard.kpi_volunteers')}</div>
                            <div class="size-10 text-color-gray opacity-70">${t('org_dashboard.kpi_volunteers_sub')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      `;
      statsContainer.html(statsHTML);

    } catch (err) {
      console.error(err);
      statsContainer.html(`<div class="block text-align-center text-color-red">${t('common.error')}</div>`);
    }
  };

  $on('pageInit', () => {
    $f7.panel.close(); 
    loadStats();
  });

  return renderOrgAdminPage($h, 'org-home', renderContent, $f7);
};