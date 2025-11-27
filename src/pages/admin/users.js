// src/pages/admin/users.js
import { apiCall, ENDPOINTS } from '../../js/api.js';
import { t } from '../../js/i18n.js';
import { renderAdminPage } from '../../js/admin-shell.js';

export default (props, { $f7, $h, $update, $on }) => {
  let users = [];
  let isLoading = true;

  // Caricamento Dati
  const loadUsers = async () => {
    try {
      const data = await apiCall(ENDPOINTS.ADMIN_USERS_LIST);
      users = data;
    } catch (err) {
      console.error("Errore loadUsers:", err);
      $f7.toast.create({ text: 'Errore caricamento dati', closeTimeout: 2000, cssClass: 'color-red' }).open();
    } finally {
      isLoading = false;
      $update();
    }
  };

  // --- CORREZIONE QUI ---
  $on('pageInit', () => {
    // ABBIAMO RIMOSSO LA RIGA "$f7.panel.disableSwipe('left');" CHE DAVA ERRORE
    loadUsers();
  });

  // Funzione Contenuto
  const renderContent = ($h_shell) => {
      return $h_shell`
        <div class="card margin-bottom shadow-sm no-border bg-color-white">
            <div class="card-content card-content-padding display-flex justify-content-space-between align-items-center">
                <h2 class="no-margin size-22">${t('users.title')}</h2>
                <button class="button button-fill button-small color-teal display-flex align-items-center">
                    <i class="icon f7-icons size-14 margin-right-xs">plus</i> ${t('users.btn_add')}
                </button>
            </div>
        </div>

        <div class="card no-border shadow-sm">
            <div class="card-content">
                ${isLoading ? $h_shell`
                    <div class="block text-align-center padding-vertical-xl">
                        <div class="preloader color-teal"></div>
                        <p class="text-color-gray size-12 margin-top-half">Caricamento...</p>
                    </div>
                ` : $h_shell`
                <div class="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th class="label-cell">${t('users.table_name')}</th>
                                <th class="label-cell mobile-hide">${t('common.email')}</th>
                                <th class="label-cell">${t('users.table_role')}</th>
                                <th class="numeric-cell"></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.length === 0 ? $h_shell`
                                <tr><td colspan="4" class="text-align-center padding">Nessun utente trovato</td></tr>
                            ` : users.map(u => $h_shell`
                                <tr>
                                    <td class="label-cell">
                                        <div class="font-weight-bold text-color-black">${u.full_name}</div>
                                        <div class="size-12 text-color-gray desktop-hide">${u.role}</div>
                                    </td>
                                    <td class="label-cell mobile-hide text-color-gray">${u.email}</td>
                                    <td class="label-cell mobile-hide">
                                        <span class="badge color-gray">${u.role}</span>
                                    </td>
                                    <td class="numeric-cell">
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
      `;
  };

  return renderAdminPage($h, 'admin-users', renderContent, $f7);
};