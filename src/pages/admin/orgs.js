import { apiCall, ENDPOINTS } from '../../js/api.js';
import { t } from '../../js/i18n.js';
import { renderAdminPage } from '../../js/admin-shell.js';

export default (props, { $f7, $h, $on }) => {
  const $ = $f7.$; // Dom7

  // Stato Form
  let newOrg = {
      id: null, // Per update
      org_name: '', org_vat: '', org_city: '', org_prov: '', org_address: '',
      org_sector: 'Sanitario', org_color: '#00897B', org_desc: '', org_logo: '',
      org_president: '', org_phone: '', org_public_email: '', org_website: '', org_social: '',
      admin_first_name: '', admin_last_name: '', admin_email: '', admin_password: ''
  };

  let popupInstance = null;
  let autocompleteCity = null;
  let orgsData = []; // Cache locale dati

  // --- 1. SCHELETRO HTML (Statico) ---
  const renderContent = ($h_shell) => {
      return $h_shell`
        <div class="orgs-page-wrapper">
            
            <div class="card margin-bottom shadow-sm no-border bg-color-white">
                <div class="card-content card-content-padding display-flex justify-content-space-between align-items-center">
                    <div>
                        <h2 class="no-margin size-22">${t('orgs.title')}</h2>
                        <p class="no-margin text-color-gray size-12">Network e Piani</p>
                    </div>
                    <button class="button button-fill button-round color-teal shadow-teal" id="btn-open-create">
                        <i class="icon f7-icons size-14 margin-right-xs">plus</i> ${t('orgs.btn_add')}
                    </button>
                </div>
            </div>

            <div id="orgs-list-container">
                <div class="block text-align-center margin-top-xl">
                    <div class="preloader color-teal" style="width: 32px; height: 32px;"></div>
                    <p class="text-color-gray margin-top size-12">Inizializzazione...</p>
                </div>
            </div>

        </div>

        <style>
            .org-row-card { transition: transform 0.2s; border-radius: 12px; }
            .org-row-card:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
            .org-logo-wrapper { width: 50px; height: 50px; flex-shrink: 0; }
            .org-logo-img { width: 100%; height: 100%; border-radius: 12px; object-fit: cover; border: 1px solid #eee; }
            .org-logo-placeholder { width: 100%; height: 100%; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 20px; }
            .gap-10 { gap: 10px; }
            .stat-box { display: flex; align-items: center; padding: 6px 12px; border-radius: 8px; background: #f5f5f5; font-size: 13px; min-width: 60px; justify-content: center; }
            .bg-color-purple-light { background: rgba(156, 39, 176, 0.1); }
            .bg-color-orange-light { background: rgba(255, 149, 0, 0.1); }
            .line-clamp-1 { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
            @media (max-width: 768px) {
                .desktop-only-flex { display: none; }
                .org-info { max-width: 140px; }
            }
        </style>
      `;
  };

  // --- 2. LOGICA JS PURO ---
  $on('pageInit', () => {
      loadOrgs();
      $('#btn-open-create').on('click', () => {
          resetForm();
          openPopup(false); // false = create mode
      });
  });

  const loadOrgs = async () => {
      const container = $('#orgs-list-container');
      container.html('<div class="block text-align-center margin-top-xl"><div class="preloader color-teal"></div></div>');

      try {
          const data = await apiCall(ENDPOINTS.ADMIN_ORGS_LIST);
          orgsData = Array.isArray(data) ? data : [];

          if (orgsData.length === 0) {
              container.html('<div class="block text-align-center text-color-gray margin-top-xl"><p>Nessuna associazione trovata</p></div>');
              return;
          }

          // Costruiamo HTML stringa
          let html = '';
          orgsData.forEach(o => {
              // Logo
              let logoHtml = `<div class="org-logo-placeholder" style="background: ${o.color}">${o.name.charAt(0)}</div>`;
              if (o.logo && o.logo.length > 10) {
                  logoHtml = `<img src="${o.logo}" class="org-logo-img" />`;
              }

              // Status
              let statusHtml = o.status === 'active' 
                  ? `<span class="text-color-green size-11 font-weight-600">● Attivo</span>`
                  : `<span class="text-color-red size-11 font-weight-600">● Scaduto</span>`;

              html += `
                <div class="card no-border shadow-sm margin-bottom-half org-row-card">
                    <div class="card-content">
                        <div class="display-flex align-items-center padding">
                            
                            <div class="org-logo-wrapper margin-right">${logoHtml}</div>

                            <div class="org-info flex-grow-1">
                                <div class="font-weight-bold text-color-black size-16 line-clamp-1">${o.name}</div>
                                <div class="size-12 text-color-gray">${o.location}</div>
                            </div>

                            <div class="org-stats display-flex gap-10 margin-horizontal desktop-only-flex">
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
                                <span class="badge color-blue margin-bottom-half display-inline-block">${o.plan}</span>
                                <div>${statusHtml}</div>
                            </div>

                            <div class="org-actions margin-left">
                                <a href="#" class="button button-small button-outline color-gray icon-only org-action-btn" data-id="${o.id}">
                                    <i class="icon f7-icons">ellipsis_vertical</i>
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
              `;
          });

          container.html(html);

          // Bind Actions
          $('.org-action-btn').on('click', function() {
              const id = $(this).attr('data-id');
              openActions(id);
          });

      } catch (err) {
          console.error(err);
          container.html('<div class="block text-color-red text-align-center">Errore caricamento dati.</div>');
      }
  };

  // --- AZIONI ---
  const openActions = (id) => {
      const org = orgsData.find(o => o.id == id);
      if(!org) return;

      $f7.actions.create({
          buttons: [
              [{ text: org.name, label: true },
               { text: 'Modifica', onClick: () => { fillForm(org); openPopup(true); } }
              ],
              [{ text: 'Annulla', color: 'red' }]
          ]
      }).open();
  };

  // --- FORM HELPERS ---
  const resetForm = () => {
      newOrg = {
          org_name: '', org_vat: '', org_city: '', org_prov: '', org_address: '',
          org_sector: 'Sanitario', org_color: '#00897B', org_desc: '', org_logo: '',
          org_president: '', org_phone: '', org_public_email: '', org_website: '', org_social: '',
          admin_first_name: '', admin_last_name: '', admin_email: '', admin_password: ''
      };
  };

  const fillForm = (org) => {
      // Mappiamo i dati della lista nel form (Attenzione: la lista potrebbe non avere tutti i campi dettagliati)
      // In un'app reale qui chiameresti GET /orgs/detail.php?id=...
      // Per ora usiamo quello che abbiamo
      newOrg.id = org.id;
      newOrg.org_name = org.name;
      newOrg.org_logo = org.logo;
      newOrg.org_color = org.color;
      // Parsing location "Milano (MI)"
      if(org.location && org.location.includes('(')) {
          const parts = org.location.split('(');
          newOrg.org_city = parts[0].trim();
          newOrg.org_prov = parts[1].replace(')', '').trim();
      }
  };

  const saveOrg = async (isEdit) => {
      const endpoint = isEdit ? ENDPOINTS.ADMIN_ORGS_UPDATE : ENDPOINTS.ADMIN_ORGS_CREATE;
      
      // Validazione minima
      if(!newOrg.org_name) {
          $f7.toast.create({ text: 'Nome ente obbligatorio', cssClass: 'color-red', closeTimeout: 2000 }).open();
          return;
      }

      $f7.preloader.show();
      try {
          await apiCall(endpoint, 'POST', newOrg);
          $f7.preloader.hide();
          if(popupInstance) popupInstance.close();
          $f7.toast.create({ text: 'Salvato!', cssClass: 'color-green', closeTimeout: 2000 }).open();
          loadOrgs();
      } catch (e) {
          $f7.preloader.hide();
          $f7.dialog.alert(e.message || 'Errore');
      }
  };

  // --- POPUP (HTML String) ---
  const openPopup = (isEdit) => {
      const title = isEdit ? 'Modifica Ente' : t('orgs.form.title_new');
      const btnLabel = isEdit ? 'SALVA MODIFICHE' : 'CREA TUTTO';
      
      // Se editiamo, nascondiamo tab admin
      const tabAdminLink = isEdit ? '' : `<a href="#tab-org-admin" class="tab-link">${t('orgs.form.tab_admin')}</a>`;
      const tabAdminContent = isEdit ? '' : `
        <div id="tab-org-admin" class="tab">
             <div class="list no-hairlines-md form-store-data inset margin-top">
                <ul>
                    <li class="item-content item-input item-input-outline"><div class="item-inner"><div class="item-title item-label">Email Admin *</div><div class="item-input-wrap"><input type="email" id="adm-email"></div></div></li>
                    <li class="item-content item-input item-input-outline"><div class="item-inner"><div class="item-title item-label">Password *</div><div class="item-input-wrap"><input type="password" id="adm-pass"></div></div></li>
                    <li class="item-content item-input item-input-outline"><div class="item-inner"><div class="item-title item-label">Nome</div><div class="item-input-wrap"><input type="text" id="adm-fname"></div></div></li>
                    <li class="item-content item-input item-input-outline"><div class="item-inner"><div class="item-title item-label">Cognome</div><div class="item-input-wrap"><input type="text" id="adm-lname"></div></div></li>
                </ul>
             </div>
        </div>`;

      const popupHTML = `
        <div class="popup org-popup popup-tablet-fullscreen">
            <div class="view"><div class="page" style="background-color: #f4f6f8;">
                <div class="navbar bg-color-white no-shadow border-bottom">
                    <div class="navbar-bg"></div>
                    <div class="navbar-inner">
                        <div class="title font-weight-800 text-color-theme">${title}</div>
                        <div class="right"><a class="link popup-close icon-only"><i class="icon f7-icons text-color-gray">multiply</i></a></div>
                    </div>
                </div>
                <div class="toolbar tabbar toolbar-top bg-color-white">
                    <div class="toolbar-inner">
                        <a href="#tab-org-info" class="tab-link tab-link-active">${t('orgs.form.tab_info')}</a>
                        <a href="#tab-org-details" class="tab-link">${t('orgs.form.tab_details')}</a>
                        ${tabAdminLink}
                    </div>
                </div>
                <div class="page-content">
                    <div class="tabs">
                        <div id="tab-org-info" class="tab tab-active">
                            <div class="list no-hairlines-md form-store-data inset margin-top">
                                <ul>
                                    <li class="item-content item-input item-input-outline">
                                        <div class="item-inner"><div class="item-title item-label">${t('orgs.form.name')} *</div>
                                        <div class="item-input-wrap"><input type="text" id="org-name" required value="${newOrg.org_name}"></div></div>
                                    </li>
                                    <li class="item-content item-input item-input-outline">
                                        <div class="item-inner"><div class="item-title item-label">${t('orgs.form.city')}</div>
                                        <div class="item-input-wrap"><input type="text" id="org-city" value="${newOrg.org_city || ''}"></div></div>
                                    </li>
                                    <li class="item-content item-input item-input-outline">
                                        <div class="item-inner"><div class="item-title item-label">${t('orgs.form.prov')}</div>
                                        <div class="item-input-wrap"><input type="text" id="org-prov" maxlength="2" value="${newOrg.org_prov || ''}"></div></div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div id="tab-org-details" class="tab">
                            <div class="list no-hairlines-md form-store-data inset margin-top">
                                <ul>
                                    <li class="item-content">
                                        <div class="item-inner display-flex flex-direction-column align-items-center padding-vertical">
                                            <img id="preview-logo" src="${newOrg.org_logo || ''}" style="width: 80px; height: 80px; border-radius: 16px; object-fit: cover; display: ${newOrg.org_logo ? 'block' : 'none'}; margin-bottom: 10px;">
                                            <div class="button button-small button-outline button-round relative">
                                                Carica Logo
                                                <input type="file" id="upload-logo-input" accept="image/*" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
                                            </div>
                                        </div>
                                    </li>
                                    <li class="item-content item-input item-input-outline">
                                        <div class="item-inner"><div class="item-title item-label">${t('orgs.form.color')}</div>
                                        <div class="item-input-wrap display-flex align-items-center"><input type="color" id="org-color" value="${newOrg.org_color || '#00897B'}" style="height: 40px; width: 60px;"></div></div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        ${tabAdminContent}
                        
                        <div class="block margin-vertical">
                            <button class="button button-fill button-large color-teal shadow-teal" id="btn-save-real">${btnLabel}</button>
                        </div>
                    </div>
                </div>
            </div></div>
        </div>
      `;

      popupInstance = $f7.popup.create({
          content: popupHTML,
          on: {
              opened: function () {
                  // Autocomplete
                  autocompleteCity = $f7.autocomplete.create({
                      inputEl: '#org-city', openIn: 'dropdown', valueProperty: 'name', textProperty: 'label',
                      source: function (query, render) {
                          if (query.length < 3) { render([]); return; }
                          fetch(`https://shift.appap.it/api/v1/geo/search_cities.php?q=${query}`)
                              .then(res => res.json()).then(data => render(data)).catch(() => render([]));
                      },
                      on: { change: function (value) { if (value.length > 0) { $('#org-city').val(value[0].name); $('#org-prov').val(value[0].province); newOrg.org_city = value[0].name; newOrg.org_prov = value[0].province; } } }
                  });

                  // Upload
                  $('#upload-logo-input').on('change', async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append('file', file);
                      $f7.dialog.preloader();
                      try {
                          const res = await fetch('https://shift.appap.it/api/v1/upload.php', { method: 'POST', body: formData });
                          const data = await res.json();
                          $f7.dialog.close();
                          if (res.ok) {
                              newOrg.org_logo = data.url;
                              $('#preview-logo').attr('src', data.url).show();
                          }
                      } catch { $f7.dialog.close(); }
                  });

                  // Salva
                  $('#btn-save-real').on('click', () => {
                      newOrg.org_name = $('#org-name').val();
                      newOrg.org_vat = $('#org-vat').val();
                      newOrg.org_city = $('#org-city').val();
                      newOrg.org_prov = $('#org-prov').val();
                      newOrg.org_color = $('#org-color').val();
                      
                      if (!isEdit) {
                          newOrg.admin_email = $('#adm-email').val();
                          newOrg.admin_password = $('#adm-pass').val();
                          newOrg.admin_first_name = $('#adm-fname').val();
                          newOrg.admin_last_name = $('#adm-lname').val();
                      }
                      saveOrg(isEdit);
                  });
              },
              closed: function () { if (autocompleteCity) autocompleteCity.destroy(); }
          }
      });
      popupInstance.open();
  }

  return renderAdminPage($h, 'admin-orgs', renderContent, $f7);
};