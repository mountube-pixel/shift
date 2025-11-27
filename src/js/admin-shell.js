// src/js/admin-shell.js
import store from './store.js';
import { t, changeLanguage } from './i18n.js';

export const renderAdminPage = ($h, pageName, contentFunc, f7_instance) => {
  
  const user = store.getters.user.value;
  const currentLang = localStorage.getItem('lang') || 'it';
  const flagMap = { 'it': '🇮🇹', 'en': '🇬🇧', 'de': '🇩🇪' };
  const currentFlag = flagMap[currentLang] || '🇮🇹';

  // --- AZIONI ---
  const doLogout = () => {
    f7_instance.dialog.confirm(t('common.logout') + '?', () => {
      store.dispatch('logout');
      window.location.reload();
    });
  };

  const toggleSidebar = () => {
    const el = document.getElementById('admin-sidebar-el');
    if(el) el.classList.toggle('mobile-visible');
  };

  // --- MENU LINGUA (ACTIONS SHEET) ---
  // Usiamo Actions.create invece di Popover HTML per evitare errori di DOM
  const openLangMenu = () => {
    const actions = f7_instance.actions.create({
      buttons: [
        [
          {
            text: 'Seleziona Lingua',
            label: true
          },
          {
            text: '🇮🇹 Italiano',
            onClick: () => changeLanguage('it')
          },
          {
            text: '🇬🇧 English',
            onClick: () => changeLanguage('en')
          },
          {
            text: '🇩🇪 Deutsch',
            onClick: () => changeLanguage('de')
          }
        ],
        [
          {
            text: t('common.cancel'),
            color: 'red'
          }
        ]
      ]
    });
    actions.open();
  };

  // Render Function
  return () => {
    const content = contentFunc($h);

    return $h`
    <div class="page admin-page" data-name="${pageName}">
      
      <div class="admin-navbar">
         <div class="navbar-left">
            <a href="#" class="link icon-only mobile-hamburger" @click=${toggleSidebar}>
               <i class="icon f7-icons">bars</i>
            </a>
            <div class="brand-logo">
               <i class="icon f7-icons text-color-red">shield_fill</i>
               <span>SHIFT <small>ADMIN</small></span>
            </div>
         </div>
         <div class="navbar-right">
            <a href="#" class="link" @click=${openLangMenu} style="font-size: 24px; margin-right: 15px;">${currentFlag}</a>
            
            <div class="admin-badge desktop-only">SUPER USER</div>
            <a href="#" class="link icon-only" @click=${doLogout}><i class="icon f7-icons text-color-gray">arrow_right_square_fill</i></a>
         </div>
      </div>

      <div class="admin-grid-container">
         
         <aside class="admin-sidebar" id="admin-sidebar-el">
            <div class="user-profile-summary">
               <div class="avatar"><i class="icon f7-icons">person_fill</i></div>
               <div class="details">
                  <div class="name">${user ? user.first_name : 'Admin'}</div>
                  <div class="role">System Admin</div>
               </div>
            </div>
            
            <nav class="sidebar-nav">
               <a href="/admin/" class="nav-item ${pageName === 'admin-home' ? 'active' : ''}">
                  <i class="icon f7-icons">chart_bar_fill</i> ${t('admin.dashboard')}
               </a>
               <a href="/admin/users/" class="nav-item ${pageName === 'admin-users' ? 'active' : ''}">
                  <i class="icon f7-icons">person_2_fill</i> ${t('admin.users')}
               </a>
               <a href="/admin/orgs/" class="nav-item ${pageName === 'admin-orgs' ? 'active' : ''}">
                  <i class="icon f7-icons">building_2_fill</i> ${t('admin.orgs')}
               </a>
               <div class="divider"></div>
               <a href="#" class="nav-item">
                  <i class="icon f7-icons">gear_alt_fill</i> ${t('admin.settings')}
               </a>
            </nav>
         </aside>

         <div class="sidebar-overlay" @click=${toggleSidebar}></div>

         <main class="admin-content">
            ${content}
         </main>

      </div>

      <style>
        /* FIX SCROLL ORIZZONTALE */
        .admin-page { 
            background: #f4f6f8; 
            height: 100vh; 
            width: 100vw; 
            display: flex; 
            flex-direction: column; 
            overflow-x: hidden !important; /* BLOCCA SCROLL LATERALE */
            position: fixed; /* Ancora la pagina */
            top: 0; left: 0;
        }
        
        /* Nasconde il container standard di F7 per usare il nostro Grid */
        .admin-page .page-content { display: none; }

        .admin-navbar { height: 60px; background: white; border-bottom: 1px solid #ddd; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; flex-shrink: 0; z-index: 500; }
        .navbar-left, .navbar-right { display: flex; align-items: center; }
        .brand-logo { font-weight: 800; font-size: 18px; color: var(--f7-theme-color); display: flex; align-items: center; gap: 8px; }
        .brand-logo small { color: #999; font-size: 12px; margin-left: 5px; }
        .admin-badge { background: #ff3b30; color: white; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; margin-right: 15px; }

        .admin-grid-container { display: flex; flex: 1; overflow: hidden; position: relative; width: 100%; }

        .admin-sidebar { width: 260px; background: #1a237e; color: white; display: flex; flex-direction: column; flex-shrink: 0; transition: transform 0.3s ease; z-index: 400; }
        .user-profile-summary { padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 15px; }
        .user-profile-summary .avatar { width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .user-profile-summary .name { font-weight: bold; font-size: 14px; }
        .user-profile-summary .role { font-size: 11px; opacity: 0.7; text-transform: uppercase; }

        .sidebar-nav { padding: 15px; display: flex; flex-direction: column; gap: 5px; overflow-y: auto; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 15px; color: rgba(255,255,255,0.7); text-decoration: none; border-radius: 8px; transition: all 0.2s; font-size: 14px; font-weight: 500; cursor: pointer; }
        .nav-item:hover { background: rgba(255,255,255,0.1); color: white; }
        .nav-item.active { background: #FFC107; color: #1a237e; font-weight: 700; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .divider { height: 1px; background: rgba(255,255,255,0.1); margin: 10px 0; }

        .admin-content { flex: 1; overflow-y: auto; padding: 25px; background: #f4f6f8; position: relative; }

        .mobile-hamburger { display: none; margin-right: 15px; font-size: 24px; color: #333; }
        .sidebar-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 300; display: none; }

        /* Mobile Responsive */
        .mobile-hide { display: none; }
        
        @media (min-width: 960px) {
            .mobile-hide { display: table-cell; }
            .desktop-hide { display: none; }
        }

        @media (max-width: 960px) {
            .admin-sidebar { position: absolute; top: 0; bottom: 0; left: 0; transform: translateX(-100%); }
            .admin-sidebar.mobile-visible { transform: translateX(0); }
            .sidebar-overlay { display: block; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
            .admin-sidebar.mobile-visible + .sidebar-overlay { opacity: 1; pointer-events: auto; }
            .mobile-hamburger { display: block; }
            .desktop-only { display: none; }
            .admin-content { padding: 15px; }
        }
      </style>
    </div>
    `;
  };
};