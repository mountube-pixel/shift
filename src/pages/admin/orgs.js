// src/pages/admin/orgs.js
import { apiCall, ENDPOINTS } from '../../js/api.js';
import { t } from '../../js/i18n.js';
import { renderAdminPage } from '../../js/admin-shell.js';

export default (props, { $f7, $h, $update, $on }) => {
  let orgs = [];
  let isLoading = true;
  let popupInstance = null;
  let autocompleteCity = null;

  // Stato Form
  let newOrg = {
      org_name: '', org_vat: '', org_city: '', org_prov: '', org_address: '',
      org_sector: 'Sanitario', org_color: '#00897B', org_desc: '', org_logo: '',
      org_president: '', org_phone: '', org_public_email: '', org_website: '', org_social: '',
      admin_first_name: '', admin_last_name: '', admin_email: '', admin_password: ''
  };

  // --- API ACTIONS ---
  const loadOrgs = async () => {
    isLoading = true;
    $update();

    try {
      const data = await apiCall(ENDPOINTS.ADMIN_ORGS_LIST);
      
      // Controllo sicurezza dati
      if (Array.isArray(data)) {
          orgs = data;
      } else {
          console.error("Dati non validi:", data);
          orgs = [];
      }
    } catch (err) {
      console.error(err);
      $f7.toast.create({ text: 'Errore lista', cssClass: 'color-red', closeTimeout: 2000 }).open();
    } finally {
      // FORZA LO STOP DEL CARICAMENTO
      isLoading = false;
      $update();
    }
  };

  const handleFileUpload = async (event, targetField, previewId) => {
      const file = event.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      
      $f7.dialog.preloader('Caricamento...');
      try {
          const response = await fetch('https://shift.appap.it/api/v1/upload.php', { method: 'POST', body: formData });
          const data = await response.json();
          $f7.dialog.close();
          if (response.ok) {
              newOrg[targetField] = data.url;
              // Aggiorna anteprima UI
              const $ = $f7.$;
              $(`#${previewId}`).attr('src', data.url).show();
              $(`#${previewId}-placeholder`).hide();
          } else { throw new Error(data.message); }
      } catch (err) {
          $f7.dialog.close();
          $f7.dialog.alert(err.message || 'Errore', 'Errore upload');
      }
  };

  const createOrg = async () => {
      if(!newOrg.org_name || !newOrg.admin_email || !newOrg.admin_password) {
          $f7.toast.create({ text: 'Dati obbligatori mancanti (*)', cssClass: 'color-red', closeTimeout: 2000 }).open();
          return;
      }
      $f7.preloader.show();
      try {
          await apiCall(ENDPOINTS.ADMIN_ORGS_CREATE, 'POST', newOrg);
          $f7.preloader.hide();
          if(popupInstance) popupInstance.close();
          $f7.toast.create({ text: 'Fatto!', cssClass: 'color-green', closeTimeout: 2000, icon: '<i class="f7-icons">checkmark</i>' }).open();
          
          // Ricarica la lista
          loadOrgs();
      } catch (err) {
          $f7.preloader.hide();
          $f7.dialog.alert(err.message || 'Errore', 'Errore');
      }
  };

  // --- POPUP CREAZIONE ---
  const openCreatePopup = () => {
      const popupContent = `
        <div class="popup org-create-popup popup-tablet-fullscreen">
            <div class="view">
                <div class="page" style="background-color: #f4f6f8;">
                    <div class="navbar bg-color-white no-shadow border-bottom">
                        <div class="navbar-bg"></div>
                        <div class="navbar-inner">
                            <div class="title font-weight-800 text-color-theme">
                                <i class="icon f7-icons size-20 margin-right-xs">building_2_fill</i>
                                ${t('orgs.form.title_new')}
                            </div>
                            <div class="right"><a class="link popup-close icon-only"><i class="icon f7-icons text-color-gray">multiply</i></a></div>
                        </div>
                    </div>
                    
                    <div class="toolbar tabbar toolbar-top bg-color-white">
                        <div class="toolbar-inner">
                            <a href="#tab-org-info" class="tab-link tab-link-active">${t('orgs.form.tab_info')}</a>
                            <a href="#tab-org-details" class="tab-link">${t('orgs.form.tab_details')}</a>
                            <a href="#tab-org-admin" class="tab-link">${t('orgs.form.tab_admin')}</a>
                        </div>
                    </div>

                    <div class="page-content">
                        <div class="tabs">
                            <div id="tab-org-info" class="tab tab-active">
                                <div class="list no-hairlines-md form-store-data inset margin-top">
                                    <ul>
                                        <li class="item-content item-input item-input-outline">
                                            <div class="item-inner">
                                                <div class="item-title item-label">${t('orgs.form.name')} *</div>
                                                <div class="item-input-wrap"><input type="text" id="org-name" required></div>
                                            </div>
                                        </li>
                                        <li class="item-content item-input item-input-outline">
                                            <div class="item-inner">
                                                <div class="item-title item-label">${t('orgs.form.vat')}</div>
                                                <div class="item-input-wrap"><input type="text" id="org-vat"></div>
                                            </div>
                                        </li>
                                        <li class="item-content item-input item-input-outline">
                                            <div class="item-inner">
                                                <div class="item-title item-label">${t('orgs.form.address')}</div>
                                                <div class="item-input-wrap"><input type="text" id="org-address"></div>
                                            </div>
                                        </li>
                                        <li class="item-content item-input item-input-outline">
                                            <div class="item-inner">
                                                <div class="item-title item-label">${t('orgs.form.city')}</div>
                                                <div class="item-input-wrap"><input type="text" id="org-city" placeholder="Cerca comune..."></div>
                                            </div>
                                        </li>
                                        <li class="item-content item-input item-input-outline">
                                            <div class="item-inner">
                                                <div class="item-title item-label">${t('orgs.form.prov')}</div>
                                                <div class="item-input-wrap"><input type="text" id="org-prov" placeholder="PR" maxlength="2"></div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div id="tab-org-details" class="tab">
                                <div class="list no-hairlines-md form-store-data inset margin-top">
                                    <ul>
                                        <li class="item-content">
                                            <div class="item-inner display-flex flex-direction-column align-items-center padding-vertical">
                                                <div style="width: 80px; height: 80px; border-radius: 16px; background: #eee; overflow: hidden; position: relative; margin-bottom: 10px;">
                                                    <img id="preview-logo" src="" style="width: 100%; height: 100%; object-fit: cover; display: none;">
                                                    <div id="preview-logo-placeholder" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #999;">
                                                        <i class="icon f7-icons">camera_fill</i>
                                                    </div>
                                                </div>
                                                <div class="button button-small button-outline button-round file-upload-btn relative">
                                                    Carica Logo
                                                    <input type="file" id="upload-logo-input" accept="image/*" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
                                                </div>
                                            </div>
                                        </li>
                                        <li class="item-content item-input item-input-outline">
                                            <div class="item-inner">
                                                <div class="item-title item-label">${t('orgs.form.sector')}</div>
                                                <div class="item-input-wrap input-dropdown-wrap">
                                                    <select id="org-sector">
                                                        <option value="Sanitario" selected>Sanitario</option>
                                                        <option value="Protezione Civile">Protezione Civile</option>
                                                        <option value="Sociale">Sociale</option>
                                                        <option value="Ambiente">Ambiente</option>
                                                        <option value="Culturale">Culturale</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </li>
                                        <li class="item-content item-input item-input-outline">
                                            <div class="item-inner">
                                                <div class="item-title item-label">${t('orgs.form.color')}</div>
                                                <div class="item-input-wrap display-flex align-items-center"><input type="color" id="org-color" value="#00897B" style="height: 40px; width: 60px;"></div>
                                            </div>
                                        </li>
                                        <li class="item-content item-input item-input-outline">
                                            <div class="item-inner">
                                                <div class="item-title item-label">${t('orgs.form.website')}</div>
                                                <div class="item-input-wrap"><input type="url" id="org-website"></div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div id="tab-org-admin" class="tab">
                                <div class="list no-hairlines-md form-store-data inset margin-top">
                                    <ul>
                                        <li class="item-content item-input item-input-outline">
                                            <div class="item-inner">
                                                <div class="item-title item-label">${t('orgs.form.admin_fn')}</div>
                                                <div class="item-input-wrap"><input type="text" id="adm-fname"></div>
                                            </div>
                                        </li>
                                        <li class="item-content item-input item-input-outline">
                                            <div class="item-inner">
                                                <div class="item-title item-label">${t('orgs.form.admin_ln')}</div>
                                                <div class="item-input-wrap"><input type="text" id="adm-lname"></div>
                                            </div>
                                        </li>
                                        <li class="item-content item-input item-input-outline">
                                            <div class="item-inner">
                                                <div class="item-title item-label">${t('orgs.form.admin_email')} *</div>
                                                <div class="item-input-wrap"><input type="email" id="adm-email"></div>
                                            </div>
                                        </li>
                                        <li class="item-content item-input item-input-outline">
                                            <div class="item-inner">
                                                <div class="item-title item-label">${t('orgs.form.admin_pass')} *</div>
                                                <div class="item-input-wrap"><input type="password" id="adm-pass"></div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div class="block margin-vertical">
                                    <button class="button button-fill button-large color-teal shadow-teal" id="btn-save-org">CREA TUTTO</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      `;

      popupInstance = $f7.popup.create({
          content: popupContent,
          on: {
              opened: function () {
                  const $ = $f7.$;
                  autocompleteCity = $f7.autocomplete.create({
                      inputEl: '#org-city', openIn: 'dropdown', valueProperty: 'name', textProperty: 'label',
                      source: function (query, render) {
                          if (query.length < 3) { render([]); return; }
                          autocompleteCity.preloaderShow();
                          fetch(`https://shift.appap.it/api/v1/geo/search_cities.php?q=${query}`)
                              .then(res => res.json()).then(data => { autocompleteCity.preloaderHide(); render(data); })
                              .catch(() => { autocompleteCity.preloaderHide(); render([]); });
                      },
                      on: { change: function (value) { if (value.length > 0) { $('#org-city').val(value[0].name); $('#org-prov').val(value[0].province); newOrg.org_city = value[0].name; newOrg.org_prov = value[0].province; } } }
                  });
                  $('#upload-logo-input').on('change', (e) => { handleFileUpload(e, 'org_logo', 'preview-logo'); });
                  $('#btn-save-org').on('click', () => {
                      newOrg.org_name = $('#org-name').val(); newOrg.org_vat = $('#org-vat').val(); newOrg.org_address = $('#org-address').val();
                      newOrg.org_city = $('#org-city').val(); newOrg.org_prov = $('#org-prov').val();
                      newOrg.org_sector = $('#org-sector').val(); newOrg.org_color = $('#org-color').val();
                      newOrg.org_website = $('#org-website').val();
                      newOrg.admin_first_name = $('#adm-fname').val(); newOrg.admin_last_name = $('#adm-lname').val();
                      newOrg.admin_email = $('#adm-email').val(); newOrg.admin_password = $('#adm-pass').val();
                      createOrg();
                  });
              },
              closed: function () { if (autocompleteCity) autocompleteCity.destroy(); }
          }
      });
      popupInstance.open();
  };

  $on('pageInit', loadOrgs);

  // --- RENDER PAGINA ---
  const renderContent = ($h_shell) => {
      return $h_shell`
        <div class="orgs-page-wrapper">
            <div class="card margin-bottom shadow-sm no-border bg-color-white">
                <div class="card-content card-content-padding display-flex justify-content-space-between align-items-center">
                    <div>
                        <h2 class="no-margin size-22">${t('orgs.title')}</h2>
                        <p class="no-margin text-color-gray size-12">Monitoraggio e gestione</p>
                    </div>
                    <button class="button button-fill button-round color-teal shadow-teal" @click=${openCreatePopup}>
                        <i class="icon f7-icons size-14 margin-right-xs">plus</i> ${t('orgs.btn_add')}
                    </button>
                </div>
            </div>

            <div class="orgs-list-container">
                
                ${isLoading ? $h_shell`
                    <div class="block text-align-center margin-top-xl">
                        <div class="preloader color-teal" style="width: 32px; height: 32px;"></div>
                        <p class="text-color-gray margin-top size-12">Caricamento...</p>
                    </div>
                ` : orgs.length === 0 ? $h_shell`
                    <div class="block text-align-center text-color-gray margin-top-xl">
                        <i class="icon f7-icons opacity-30 size-50">building_2_fill</i>
                        <p>Nessuna associazione trovata</p>
                    </div>
                ` : 
                orgs.map(o => $h_shell`
                    <div class="card no-border shadow-sm margin-bottom-half org-row-card">
                        <div class="card-content">
                            <div class="display-flex align-items-center padding">
                                
                                <div class="org-logo-wrapper margin-right">
                                    ${o.logo && o.logo.length > 5 
                                        ? $h_shell`<img src="${o.logo}" class="org-logo-img" />`
                                        : $h_shell`<div class="org-logo-placeholder" style="background: ${o.color}">${o.name.charAt(0)}</div>`
                                    }
                                </div>

                                <div class="org-info flex-grow-1">
                                    <div class="font-weight-bold text-color-black size-16 line-clamp-1">${o.name}</div>
                                    <div class="size-12 text-color-gray display-flex align-items-center margin-top-xs">
                                        <i class="icon f7-icons size-12 margin-right-xs text-color-gray">map_pin_ellipse</i> ${o.location}
                                    </div>
                                </div>

                                <div class="org-stats display-flex gap-10 margin-horizontal">
                                    <div class="stat-box bg-color-purple-light text-color-purple">
                                        <i class="icon f7-icons size-16">person_2_fill</i>
                                        <span class="font-weight-bold margin-left-xs">${o.stats.volunteers}</span>
                                    </div>
                                    <div class="stat-box bg-color-orange-light text-color-orange">
                                        <i class="icon f7-icons size-16">layers_fill</i>
                                        <span class="font-weight-bold margin-left-xs">${o.stats.projects}</span>
                                    </div>
                                </div>

                                <div class="org-status text-align-right margin-left">
                                    <span class="badge color-blue margin-bottom-half display-block">${o.plan}</span>
                                    ${o.status === 'active' 
                                        ? $h_shell`<span class="text-color-green size-11 font-weight-600">Attivo</span>` 
                                        : $h_shell`<span class="text-color-red size-11 font-weight-600">Scaduto</span>`
                                    }
                                </div>

                                <div class="org-actions margin-left">
                                    <a href="#" class="button button-small button-outline color-gray icon-only">
                                        <i class="icon f7-icons">ellipsis_vertical</i>
                                    </a>
                                </div>

                            </div>
                        </div>
                    </div>
                `)}
            </div>
        </div>

        <style>
            .org-row-card { transition: transform 0.2s; border-radius: 12px; }
            .org-row-card:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
            
            .org-logo-wrapper { width: 50px; height: 50px; flex-shrink: 0; }
            .org-logo-img { width: 100%; height: 100%; border-radius: 12px; object-fit: cover; border: 1px solid #eee; }
            .org-logo-placeholder { width: 100%; height: 100%; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 20px; }
            
            .gap-10 { gap: 10px; }
            .stat-box { 
                display: flex; align-items: center; padding: 6px 12px; border-radius: 8px; 
                background: #f5f5f5; font-size: 13px; min-width: 60px; justify-content: center;
            }
            .bg-color-purple-light { background: rgba(156, 39, 176, 0.1); }
            .bg-color-orange-light { background: rgba(255, 149, 0, 0.1); }
            
            .line-clamp-1 { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
            
            /* Adattamento Mobile */
            @media (max-width: 768px) {
                .org-info { max-width: 120px; }
                .org-stats { display: none; } /* Nascondiamo le stats su schermi piccolissimi */
            }
        </style>
      `;
  };

  return renderAdminPage($h, 'admin-orgs', renderContent, $f7);
};