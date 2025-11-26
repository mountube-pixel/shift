import store from '../js/store.js';

export default (props, { $f7, $h, $update }) => {
  let email = '';
  let password = '';
  const isLoading = store.getters.isLoading;

  const signIn = async () => {
    if (!email || !password) {
      $f7.toast.create({ text: 'Inserisci dati validi', closeTimeout: 2000, cssClass: 'color-red' }).open();
      return;
    }
    try {
      await store.dispatch('login', { email, password });
      $f7.views.main.router.navigate('/', { reloadAll: true });
    } catch (err) {
      $f7.dialog.alert(err.message || 'Errore', 'Login Fallito');
    }
  };

  return () => $h`
    <div class="page no-navbar no-toolbar no-swipeback login-page-custom">
      
      <div class="login-hero-bg">
        <svg viewBox="0 0 375 320" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="width: 100%; height: 100%;">
          <path d="M0 0H375V240C375 240 280 320 187.5 320C95 320 0 240 0 240V0Z" fill="#FFC107"/>
        </svg>
      </div>

      <div class="page-content login-content-wrapper display-flex flex-direction-column align-items-center">
        
        <div class="text-align-center width-100" style="margin-top: 60px;">
          <div class="main-icon-container shadow-soft">
            <i class="icon f7-icons text-color-theme" style="font-size: 42px;">heart_fill</i>
          </div>
          <h1 class="no-margin-bottom size-32 text-color-white font-weight-800" style="text-shadow: 0 2px 4px rgba(0,0,0,0.1);">SHIFT</h1>
          <p class="no-margin-top size-16 text-color-white font-weight-600 opacity-90">Volontariato Connesso</p>
        </div>

        <div class="login-card shadow-soft width-100" style="background: #fff; border-radius: 24px; padding: 30px 20px; margin-top: 40px; box-sizing: border-box; max-width: 400px;">
          
          <div class="text-align-center margin-bottom">
            <h2 class="no-margin size-22 font-weight-bold text-color-black">Accedi</h2>
            <p class="text-color-gray no-margin size-14">Inserisci le tue credenziali</p>
          </div>

          <div class="list no-hairlines-md no-margin-vertical">
            <ul class="no-border padding-0">
              <li class="item-content item-input no-padding margin-bottom">
                <div class="item-inner no-padding">
                  <div class="item-input-wrap soft-input-wrap display-flex align-items-center padding-horizontal">
                    <i class="icon f7-icons text-color-gray margin-right" style="font-size: 20px; opacity: 0.5;">envelope_fill</i>
                    <input type="email" placeholder="Email" value="${email}" @input="${(e) => { email = e.target.value; $update(); }}" />
                  </div>
                </div>
              </li>
              <li class="item-content item-input no-padding margin-bottom-double">
                <div class="item-inner no-padding">
                   <div class="item-input-wrap soft-input-wrap display-flex align-items-center padding-horizontal">
                     <i class="icon f7-icons text-color-gray margin-right" style="font-size: 20px; opacity: 0.5;">lock_fill</i>
                    <input type="password" placeholder="Password" value="${password}" @input="${(e) => { password = e.target.value; $update(); }}" />
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="block no-margin padding-0">
            <button class="button button-fill button-large button-round color-teal shadow-teal ${isLoading.value ? 'disabled' : ''}" @click="${signIn}" style="height: 50px; font-weight: 700;">
              ${isLoading.value ? 'ATTENDI...' : 'ACCEDI'}
            </button>
          </div>
        </div>

        <div class="block text-align-center margin-top">
            <a href="#" class="link text-color-gray size-13" @click="${() => $f7.dialog.alert('Info', 'Reset')}">Password dimenticata?</a>
        </div>
        
      </div>

      <style>
        /* CSS BLINDATO CON !IMPORTANT */
        .login-page-custom { background-color: #f7f8fa !important; }
        
        /* Forza il contenuto ad essere trasparente per mostrare lo sfondo */
        .login-content-wrapper { 
          background: transparent !important; 
          z-index: 10 !important;
          position: relative;
        }

        .login-hero-bg {
          position: absolute;
          top: 0; left: 0; width: 100%;
          height: 350px;
          z-index: 0 !important;
          pointer-events: none;
        }

        .soft-input-wrap {
          background: #f4f5f7;
          border-radius: 12px;
          height: 48px;
          border: 1px solid transparent;
        }
        .soft-input-wrap input { font-weight: 600; font-size: 15px; }
        .item-input-focused .soft-input-wrap { background: #fff; border-color: var(--f7-theme-color); }
        
        .shadow-soft { box-shadow: 0 10px 30px rgba(0,0,0,0.08) !important; }
        .shadow-teal { box-shadow: 0 4px 12px rgba(0, 137, 123, 0.3) !important; }
        
        .font-weight-800 { font-weight: 800; }
        .font-weight-600 { font-weight: 600; }
        .size-32 { font-size: 32px; }
        .list .item-content { min-height: auto; }
        .list ul:before, .list ul:after { display: none !important; }
        .item-inner:after { display: none !important; }
      </style>
    </div>
  `;
};