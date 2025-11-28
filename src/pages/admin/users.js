// src/pages/admin/users.js
import { apiCall, ENDPOINTS } from '../../js/api.js';
import { t } from '../../js/i18n.js';
import { renderAdminPage } from '../../js/admin-shell.js';

export default (props, { $f7, $h, $update, $on }) => {
  let users = [];
  let isLoading = true;
  let popupInstance = null;
  let autocompleteCity = null; // Istanza Autocomplete
  
  let newUser = {
      first_name: '', last_name: '', email: '', password: '', 
      role: 'volunteer', city: '', province: ''
  };

  const loadUsers = async () => {
    try {
      const data = await apiCall(ENDPOINTS.ADMIN_USERS_LIST);
      users = data;
    } catch (err) {
      console.error(err);
    } finally {
      isLoading = false;
      $update();
    }
  };

  const createUser = async () => {
      // Validazione (i campi required HTML fanno già il loro lavoro ma controlliamo)
      if(!newUser.first_name || !newUser.last_name || !newUser.email || !newUser.password) {
          $f7.toast.create({ text: 'Compila i campi obbligatori', cssClass: 'color-red', closeTimeout: 2000 }).open();
          return;
      }

      $f7.preloader.show();
      try {
          await apiCall(ENDPOINTS.ADMIN_USERS_CREATE, 'POST', newUser);
          $f7.preloader.hide();
          if(popupInstance) popupInstance.close();
          $f7.toast.create({ text: 'Utente creato!', cssClass: 'color-green', closeTimeout: 2000 }).open();
          
          newUser = { first_name: '', last_name: '', email: '', password: '', role: 'volunteer', city: '', province: '' };
          isLoading = true; $update(); loadUsers();
      } catch (err) {
          $f7.preloader.hide();
          $f7.dialog.alert(err.message || 'Errore', 'Errore');
      }
  };

  const openCreatePopup = () => {
      const popupContent = `
        <div class="popup user-create-popup popup-tablet-fullscreen">
            <div class="view">
                <div class="page" style="background-color: #f4f6f8;">
                    <div class="navbar bg-color-white no-shadow border-bottom">
                        <div class="navbar-bg"></div>
                        <div class="navbar-inner">
                            <div class="title font-weight-800 text-color-theme">
                                <i class="icon f7-icons size-20 margin-right-xs">person_badge_plus_fill</i>
                                ${t('users.form.title_new')}
                            </div>
                            <div class="right"><a class="link popup-close icon-only"><i class="icon f7-icons text-color-gray">multiply</i></a></div>
                        </div>
                    </div>
                    <div class="page-content">
                        <div class="list no-hairlines-md form-store-data inset margin-horizontal-half margin-top">
                            <ul>
                                <li class="item-content item-input item-input-outline">
                                    <div class="item-inner">
                                        <div class="item-title item-label">${t('users.form.first_name')} *</div>
                                        <div class="item-input-wrap"><input type="text" id="new-fname" required></div>
                                    </div>
                                </li>
                                <li class="item-content item-input item-input-outline">
                                    <div class="item-inner">
                                        <div class="item-title item-label">${t('users.form.last_name')} *</div>
                                        <div class="item-input-wrap"><input type="text" id="new-lname" required></div>
                                    </div>
                                </li>
                                <li class="item-content item-input item-input-outline">
                                    <div class="item-inner">
                                        <div class="item-title item-label">${t('common.email')} *</div>
                                        <div class="item-input-wrap"><input type="email" id="new-email" required></div>
                                    </div>
                                </li>
                                <li class="item-content item-input item-input-outline">
                                    <div class="item-inner">
                                        <div class="item-title item-label">${t('common.password')} *</div>
                                        <div class="item-input-wrap"><input type="password" id="new-pass" required></div>
                                    </div>
                                </li>
                                <li class="item-content item-input item-input-outline">
                                    <div class="item-inner">
                                        <div class="item-title item-label">${t('users.form.role_select')}</div>
                                        <div class="item-input-wrap input-dropdown-wrap">
                                            <select id="new-role">
                                                <option value="volunteer" selected>${t('users.role_volunteer')}</option>
                                                <option value="org_admin">${t('users.role_admin')}</option>
                                                <option value="super_admin">${t('users.role_super_admin')}</option>
                                            </select>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div class="block-title margin-top">Localizzazione</div>
                        <div class="list no-hairlines-md form-store-data inset margin-horizontal-half">
                            <ul>
                                <li class="item-content item-input item-input-outline">
                                    <div class="item-inner">
                                        <div class="item-title item-label">${t('users.form.city')} (Scrivi 3 lettere)</div>
                                        <div class="item-input-wrap">
                                            <input type="text" id="new-city" placeholder="Es. Milano">
                                            <span class="input-clear-button"></span>
                                        </div>
                                    </div>
                                </li>
                                <li class="item-content item-input item-input-outline">
                                    <div class="item-inner">
                                        <div class="item-title item-label">${t('users.form.province')}</div>
                                        <div class="item-input-wrap">
                                            <input type="text" id="new-prov" maxlength="2" placeholder="PR">
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div class="block margin-vertical-xl padding-bottom">
                            <button class="button button-fill button-large button-round color-teal shadow-teal" id="btn-save-user">
                                ${t('users.form.save')}
                            </button>
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
                  
                  // --- INIZIALIZZA AUTOCOMPLETE ---
                  autocompleteCity = $f7.autocomplete.create({
                      inputEl: '#new-city',
                      openIn: 'dropdown', // Mostra lista a tendina sotto
                      dropdownPlaceholderText: 'Cerca comune...',
                      valueProperty: 'name', // Cosa salvare nel valore
                      textProperty: 'label', // Cosa mostrare nella lista
                      limit: 20,
                      
                      // Funzione di ricerca remota
                      source: function (query, render) {
                          const results = [];
                          if (query.length < 3) {
                              render(results);
                              return;
                          }
                          // Mostra loader
                          autocompleteCity.preloaderShow();
                          
                          // Chiamata API Diretta (bypassiamo apiCall wrapper per semplicità nel callback)
                          // Nota: In produzione meglio usare apiCall, ma qui serve URL diretto per fetch semplice
                          fetch(`https://shift.appap.it/api/v1/geo/search_cities.php?q=${query}`)
                              .then(res => res.json())
                              .then(data => {
                                  autocompleteCity.preloaderHide();
                                  render(data); // data deve essere array di oggetti [{name:'Roma', province:'RM', label:'Roma (RM)'}]
                              })
                              .catch(err => {
                                  autocompleteCity.preloaderHide();
                                  render([]);
                              });
                      },
                      
                      // Quando l'utente seleziona una città
                      on: {
                          change: function (value) {
                              // value è un array di oggetti selezionati (qui solo 1)
                              if (value && value.length > 0) {
                                  const selected = value[0];
                                  // Imposta nome città
                                  $('#new-city').val(selected.name);
                                  // Imposta automaticamente la provincia!
                                  $('#new-prov').val(selected.province);
                                  
                                  // Aggiorna il nostro stato locale
                                  newUser.city = selected.name;
                                  newUser.province = selected.province;
                              }
                          }
                      }
                  });

                  // Bind Tasto Salva
                  $('#btn-save-user').on('click', () => {
                      newUser.first_name = $('#new-fname').val();
                      newUser.last_name = $('#new-lname').val();
                      newUser.email = $('#new-email').val();
                      newUser.password = $('#new-pass').val();
                      newUser.role = $('#new-role').val();
                      
                      // Città e Prov potrebbero essere state editate a mano, rileggiamole
                      newUser.city = $('#new-city').val();
                      newUser.province = $('#new-prov').val();
                      
                      createUser();
                  });
              },
              closed: function () {
                  // Distruggi autocomplete quando chiudi per liberare memoria
                  if (autocompleteCity) autocompleteCity.destroy();
              }
          }
      });
      popupInstance.open();
  };

  $on('pageInit', loadUsers);

  const renderContent = ($h_shell) => {
      return $h_shell`
        <div class="users-page-wrapper">
            <div class="card margin-bottom shadow-sm no-border bg-color-white">
                <div class="card-content card-content-padding display-flex justify-content-space-between align-items-center">
                    <h2 class="no-margin size-22">${t('users.title')}</h2>
                    <button class="button button-fill button-round color-teal shadow-teal" @click=${openCreatePopup}>
                        <i class="icon f7-icons size-14 margin-right-xs">plus</i> ${t('users.btn_add')}
                    </button>
                </div>
            </div>

            <div class="card no-border shadow-sm">
                <div class="card-content">
                    ${isLoading ? $h_shell`<div class="block text-align-center padding-xl"><div class="preloader color-teal"></div></div>` : $h_shell`
                    <div class="data-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>${t('users.table_name')}</th>
                                    <th class="mobile-hide">${t('common.email')}</th>
                                    <th>${t('users.table_role')}</th>
                                    <th class="mobile-hide">${t('users.table_location')}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                ${users.length === 0 ? $h_shell`<tr><td colspan="5" class="text-align-center padding">Nessun utente</td></tr>` : 
                                users.map(u => $h_shell`
                                    <tr>
                                        <td>
                                            <div class="font-weight-bold text-color-black">${u.full_name}</div>
                                            <div class="size-12 text-color-gray desktop-only-cell">${u.role}</div>
                                        </td>
                                        <td class="mobile-hide">${u.email}</td>
                                        <td><span class="badge color-gray">${u.role}</span></td>
                                        <td class="mobile-hide text-color-gray size-12">${u.location}</td>
                                        <td class="text-align-right">
                                            <a href="#" class="link icon-only color-gray"><i class="icon f7-icons size-16">pencil</i></a>
                                        </td>
                                    </tr>
                                `)}
                            </tbody>
                        </table>
                    </div>
                    `}
                </div>
            </div>
        </div>
      `;
  };

  return renderAdminPage($h, 'admin-users', renderContent, $f7);
};