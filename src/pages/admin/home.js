// src/pages/admin/home.js
import store from '../../js/store.js';
import { t } from '../../js/i18n.js';
import { renderAdminPage } from '../../js/admin-shell.js';

export default (props, { $f7, $h, $on }) => {
  
  
  // Riceve $h_shell dallo shell (che è lo stesso $h passato sotto)
  const renderContent = ($h_shell) => {
      const user = store.getters.user.value;
      return $h_shell`
        <div class="card margin-bottom shadow-sm no-border bg-color-white">
            <div class="card-content card-content-padding">
                <h2 class="no-margin size-22">${t('common.welcome')}, ${user ? user.first_name : 'Admin'}</h2>
                <p class="text-color-gray no-margin size-14">Control Room & Analytics</p>
            </div>
        </div>

        <div class="row">
            <div class="col-100 medium-33">
                <div class="card no-border radius-10 shadow-sm border-left-blue">
                    <div class="card-content card-content-padding">
                        <div class="text-color-gray size-11 uppercase font-weight-bold">Utenti</div>
                        <div class="size-28 font-weight-800 text-color-black">1,240</div>
                    </div>
                </div>
            </div>
        </div>
      `;
  };

  // PASSAGGIO DI $h FONDAMENTALE
  return renderAdminPage($h, 'admin-home', renderContent, $f7);
};