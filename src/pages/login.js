// src/pages/login.js
import store from '../js/store.js';

export default (props, { $f7, $h, $update }) => {
  // Stato locale per i campi input
  let email = '';
  let password = '';
  
  // Recuperiamo lo stato di caricamento dallo store
  const isLoading = store.getters.isLoading;

  // Funzione di Login
  const signIn = async () => {
    // Validazione base
    if (!email || !password) {
      $f7.toast.create({ 
        text: 'Inserisci email e password', 
        closeTimeout: 2000, 
        cssClass: 'color-red',
        position: 'center'
      }).open();
      return;
    }

    try {
      // 1. Chiamata all'azione dello store (che fa la fetch API)
      await store.dispatch('login', { email, password });
      
      $f7.toast.create({
          text: 'Accesso effettuato!',
          position: 'bottom',
          closeTimeout: 1500,
          cssClass: 'color-green'
      }).open();

      // 2. LOGICA DI REINDIRIZZAMENTO BASATA SUL RUOLO
      const user = store.getters.user.value;
      
      if (user && user.role === 'super_admin') {
          // Se è Super Admin -> Vai alla Dashboard Desktop
          $f7.views.main.router.navigate('/admin/', { reloadAll: true });
      } else {
          // Se è Volontario/Altro -> Vai alla App Mobile
          $f7.views.main.router.navigate('/', { reloadAll: true });
      }

    } catch (err) {
      // Gestione errori (es. password errata)
      $f7.dialog.alert(err.message || 'Errore di connessione', 'Login Fallito');
    }
  };

  // Render del componente
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
              ${isLoading.value ? 'VERIFICA...' : 'ACCEDI'}
            </button>
          </div>

        </div> <div class="block text-align-center margin-top">
            <a href="#" class="link text-color-gray size-13" @click="${() => $f7.dialog.alert('Contatta la tua associazione.', 'Recupero')}">Password dimenticata?</a>
        </div>
        
      </div>

      <style>
        /* Override per garantire lo stile corretto */
        .login-page-custom { background-color: #f7f8fa !important; }
        
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

        .main-icon-container {
          width: 80px; height: 80px; background: #fff; border-radius: 28px;
          margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;
          border: 3px solid #FFED99;
        }

        .soft-input-wrap {
          background: #f4f5f7;
          border-radius: 12px;
          height: 48px;
          border: 1px solid transparent;
          transition: all 0.3s;
        }
        .soft-input-wrap input { font-weight: 600; font-size: 15px; }
        .item-input-focused .soft-input-wrap { background: #fff; border-color: var(--f7-theme-color); box-shadow: 0 4px 12px rgba(0, 137, 123, 0.1); }
        
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