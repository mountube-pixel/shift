import store from './store.js';

// Importiamo i nuovi componenti JS
import LoginPage from '../pages/login.js'; 
import NotFoundPage from '../pages/404.js';

// Definiamo la Home Page inline (come fatto nel passaggio precedente)
const HomePage = (props, { $f7, $h }) => {
  const startShift = () => {
    $f7.dialog.alert('Ricerca posizione GPS avviata...', 'Inizio Turno');
  };

  return () => $h`
    <div class="page" data-name="home">
      <div class="navbar navbar-transparent text-color-white">
        <div class="navbar-bg"></div>
        <div class="navbar-inner">
          <div class="left">
            <a href="#" class="link icon-only panel-open" data-panel="left">
              <i class="icon f7-icons">bars</i>
            </a>
          </div>
          <div class="title" style="font-weight: 700; letter-spacing: 1px;">SHIFT</div>
          <div class="right">
            <a href="#" class="link icon-only">
              <i class="icon f7-icons">bell</i>
              <span class="badge color-red">2</span>
            </a>
          </div>
        </div>
      </div>

      <div class="toolbar toolbar-bottom tabbar tabbar-icons floating-navbar">
        <div class="toolbar-inner">
          <a href="/" class="tab-link tab-link-active"><i class="icon f7-icons">house_fill</i></a>
          <a href="#" class="tab-link"><i class="icon f7-icons">calendar</i></a>
          <a href="#" class="tab-link"><i class="icon f7-icons">chart_bar_fill</i></a>
          <a href="#" class="tab-link"><i class="icon f7-icons">person_crop_circle_fill</i></a>
        </div>
      </div>

      <div class="page-content">
        <div class="custom-header">
          <div class="block">
            <p class="no-margin-bottom text-color-white opacity-80">Bentornato,</p>
            <h1 class="no-margin-top text-color-white size-32">Alessandro</h1>
          </div>
        </div>
        
        <div class="row no-gap margin-horizontal" style="margin-top: -60px;">
          <div class="col-50">
            <div class="card soft-card margin-right-half text-align-center padding-vertical">
              <div class="card-content card-content-padding">
                <div class="icon-container bg-color-orange-light"><i class="icon f7-icons text-color-orange">timer</i></div>
                <div class="text-xl font-bold margin-top-half">12.5h</div>
                <div class="text-xs text-color-gray">Questo mese</div>
              </div>
            </div>
          </div>
          <div class="col-50">
            <div class="card soft-card margin-left-half text-align-center padding-vertical">
              <div class="card-content card-content-padding">
                <div class="icon-container bg-color-purple-light"><i class="icon f7-icons text-color-purple">star_fill</i></div>
                <div class="text-xl font-bold margin-top-half">Liv. 3</div>
                <div class="text-xs text-color-gray">Super Volunteer</div>
              </div>
            </div>
          </div>
        </div>

        <div class="block margin-vertical-medium">
          <a href="#" @click=${startShift} class="button button-fill button-large button-round button-primary-action ripple">
            <i class="icon f7-icons margin-right-half">play_circle_fill</i> Inizia Turno
          </a>
          <p class="text-align-center text-color-gray size-12 margin-top-half">
            <i class="icon f7-icons size-12">location</i> Rilevamento GPS attivo
          </p>
        </div>
      </div>

      <style>
        .custom-header { background-color: var(--f7-theme-color); padding-top: 60px; padding-bottom: 80px; border-bottom-left-radius: 30px; border-bottom-right-radius: 30px; }
        .icon-container { width: 48px; height: 48px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 8px; }
        .bg-color-orange-light { background-color: rgba(255, 152, 0, 0.15); }
        .bg-color-purple-light { background-color: rgba(156, 39, 176, 0.15); }
        .font-bold { font-weight: 600; }
        .size-32 { font-size: 32px; }
        .margin-right-half { margin-right: 8px; }
        .margin-left-half { margin-left: 8px; }
      </style>
    </div>
  `;
};

var routes = [
  {
    path: '/',
    component: HomePage,
    beforeEnter: function ({ resolve, reject }) {
      const router = this;
      if (store.getters.isLoggedIn.value) {
        resolve();
      } else {
        reject();
        router.navigate('/login/'); 
      }
    }
  },
  {
    path: '/login/',
    component: LoginPage, // Ora usa il file JS
  },
  {
    path: '(.*)',
    component: NotFoundPage, // Ora usa il file JS
  },
];

export default routes;