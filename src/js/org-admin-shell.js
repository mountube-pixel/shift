// src/js/org-admin-shell.js
import store from './store.js';
import { t, changeLanguage } from './i18n.js';

export const renderOrgAdminPage = ($h, pageName, contentFunc, f7_instance) => {
  
  const user = store.getters.user.value;
  const currentLang = localStorage.getItem('lang') || 'it';
  const flagMap = { 'it': '🇮🇹', 'en': '🇬🇧', 'de': '🇩🇪' };
  const currentFlag = flagMap[currentLang] || '🇮🇹';

  const doLogout = () => {
    f7_instance.dialog.confirm(t('common.logout') + '?', () => {
      store.dispatch('logout');
      window.location.reload();
    });
  };

  const toggleSidebar = () => {
    const el = document.getElementById('org-sidebar-el');
    if(el) el.classList.toggle('mobile-visible');
  };

  const openLangMenu = () => {
    const actions = f7_instance.actions.create({
      buttons: [
        [
          { text: 'Lingua / Language', label: true },
          { text: '🇮🇹 Italiano', onClick: () => changeLanguage('it') },
          { text: '🇬🇧 English', onClick: () => changeLanguage('en') },
          { text: '🇩🇪 Deutsch', onClick: () => changeLanguage('de') }
        ],
        [{ text: t('common.cancel'), color: 'red' }]
      ]
    });
    actions.open();
  };

  const handleNavClick = () => {
      if (document.activeElement) document.activeElement.blur();
      const el = document.getElementById('org-sidebar-el');
      if(el && el.classList.contains('mobile-visible')) el.classList.remove('mobile-visible');
  };

  return () => {
    const content = contentFunc($h);

    return $h`
    <div class="page org-admin-page" data-name="${pageName}">
      
      <div class="org-navbar">
         <div class="navbar-left">
            <a href="#" class="link icon-only mobile-hamburger" @click=${toggleSidebar}>
               <i class="icon f7-icons">bars</i>
            </a>
            <div class="brand-logo">
               <i class="icon f7-icons text-color-teal">building_2_fill</i>
               <span>SHIFT <small>MANAGER</small></span>
            </div>
         </div>
         <div class="navbar-right">
            <a href="#" class="link" @click=${openLangMenu} style="font-size: 24px; margin-right: 15px;">${currentFlag}</a>
            <div class="org-badge desktop-only">ORG ADMIN</div>
            <a href="#" class="link icon-only" @click=${doLogout}><i class="icon f7-icons text-color-gray">arrow_right_square_fill</i></a>
         </div>
      </div>

      <div class="org-grid-container">
         
         <aside class="org-sidebar" id="org-sidebar-el">
            <div class="user-profile-summary">
               <div class="avatar bg-color-teal"><i class="icon f7-icons text-color-white">person_fill</i></div>
               <div class="details">
                  <div class="name">${user ? user.first_name : 'Manager'}</div>
                  <div class="role">Responsabile</div>
               </div>
            </div>
            
            <nav class="sidebar-nav">
               <a href="/org-admin/" class="nav-item ${pageName === 'org-home' ? 'active' : ''}" @click=${handleNavClick}>
                  <i class="icon f7-icons">chart_bar_fill</i> Dashboard
               </a>
               <a href="/org-admin/projects/" class="nav-item ${pageName === 'org-projects' ? 'active' : ''}" @click=${handleNavClick}>
                  <i class="icon f7-icons">layers_fill</i> Progetti
               </a>
               <a href="/org-admin/shifts/" class="nav-item ${pageName === 'org-shifts' ? 'active' : ''}" @click=${handleNavClick}>
                  <i class="icon f7-icons">calendar_today</i> Turni
               </a>
               <a href="/org-admin/volunteers/" class="nav-item ${pageName === 'org-volunteers' ? 'active' : ''}" @click=${handleNavClick}>
                  <i class="icon f7-icons">person_3_fill</i> Volontari
               </a>
               <a href="/org-admin/approvals/" class="nav-item ${pageName === 'org-approvals' ? 'active' : ''}" @click=${handleNavClick}>
                  <i class="icon f7-icons">checkmark_seal_fill</i> Approvazioni
               </a>
               <div class="divider"></div>
               <a href="#" class="nav-item" @click=${handleNavClick}>
                  <i class="icon f7-icons">gear_alt_fill</i> Configurazione
               </a>
            </nav>
         </aside>

         <div class="sidebar-overlay" @click=${toggleSidebar}></div>

         <main class="org-content">
            ${content}
         </main>
      </div>

      <style>
        .org-admin-page > .page-content { display: none; }
        .org-admin-page { background: #f4f6f8; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }

        .org-navbar { height: 60px; background: white; border-bottom: 1px solid #ddd; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; flex-shrink: 0; z-index: 500; }
        .navbar-left, .navbar-right { display: flex; align-items: center; }
        .brand-logo { font-weight: 800; font-size: 18px; color: var(--f7-theme-color); display: flex; align-items: center; gap: 8px; }
        .brand-logo small { color: #999; font-size: 12px; margin-left: 5px; letter-spacing: 1px; }
        .org-badge { background: #00897B; color: white; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; margin-right: 15px; }

        .org-grid-container { display: flex; flex: 1; overflow: hidden; position: relative; }

        .org-sidebar { width: 260px; background: #fff; color: #333; border-right: 1px solid #ddd; display: flex; flex-direction: column; flex-shrink: 0; transition: transform 0.3s ease; z-index: 400; }
        .user-profile-summary { padding: 20px; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 15px; }
        .user-profile-summary .avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .user-profile-summary .name { font-weight: bold; font-size: 14px; }
        .user-profile-summary .role { font-size: 11px; opacity: 0.7; text-transform: uppercase; color: #666; }

        .sidebar-nav { padding: 15px; display: flex; flex-direction: column; gap: 5px; overflow-y: auto; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 15px; color: #666; text-decoration: none; border-radius: 8px; transition: all 0.2s; font-size: 14px; font-weight: 500; cursor: pointer; }
        .nav-item:hover { background: #f5f5f5; color: var(--f7-theme-color); }
        .nav-item.active { background: var(--f7-theme-color); color: white; box-shadow: 0 4px 12px rgba(0,137,123,0.3); }
        .divider { height: 1px; background: #eee; margin: 10px 0; }

        .org-content { flex: 1; overflow-y: auto; padding: 25px; background: #f4f6f8; position: relative; }

        .mobile-hamburger { display: none; margin-right: 15px; font-size: 24px; color: #333; }
        .sidebar-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 300; display: none; }
        .desktop-only { display: block; }

        @media (max-width: 960px) {
            .org-sidebar { position: absolute; top: 0; bottom: 0; left: 0; transform: translateX(-100%); box-shadow: 4px 0 15px rgba(0,0,0,0.1); }
            .org-sidebar.mobile-visible { transform: translateX(0); }
            .sidebar-overlay { display: block; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
            .org-sidebar.mobile-visible + .sidebar-overlay { opacity: 1; pointer-events: auto; }
            .mobile-hamburger { display: block; }
            .desktop-only { display: none; }
            .org-content { padding: 15px; }
        }
      </style>
    </div>
    `;
  };
};