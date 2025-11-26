// Definiamo il componente Home direttamente qui
const HomePage = (props, { $f7, $h, $on }) => {
  
  const startShift = () => {
    $f7.dialog.alert('Ricerca posizione GPS avviata...', 'Inizio Turno');
  };

  return () => $h`
    <div class="page" data-name="home">
      
      <!-- Navbar nascosta standard, usiamo header custom -->
      <div class="navbar navbar-transparent text-color-white">
        <div class="navbar-bg"></div>
        <div class="navbar-inner">
          <div class="left">
            <a href="#" class="link icon-only panel-open" data-panel="left">
              <i class="icon f7-icons">bars</i>
            </a>
          </div>
          <div class="title" style="font-weight: 600;">VolontaApp</div>
          <div class="right">
            <a href="#" class="link icon-only">
              <i class="icon f7-icons">bell</i>
              <span class="badge color-red">2</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Toolbar Galleggiante -->
      <div class="toolbar toolbar-bottom tabbar tabbar-icons floating-navbar">
        <div class="toolbar-inner">
          <a href="/" class="tab-link tab-link-active">
            <i class="icon f7-icons">house_fill</i>
          </a>
          <a href="#" class="tab-link">
            <i class="icon f7-icons">calendar</i>
          </a>
          <a href="#" class="tab-link">
            <i class="icon f7-icons">chart_bar_fill</i>
          </a>
          <a href="#" class="tab-link">
            <i class="icon f7-icons">person_crop_circle_fill</i>
          </a>
        </div>
      </div>

      <div class="page-content">
        
        <!-- Header Custom Teal -->
        <div class="custom-header">
          <div class="block">
            <p class="no-margin-bottom text-color-white opacity-80">Bentornato,</p>
            <h1 class="no-margin-top text-color-white size-32">Alessandro</h1>
          </div>
        </div>

        <!-- Card Statistiche (Galleggianti) -->
        <div class="row no-gap margin-horizontal" style="margin-top: -60px;">
          <div class="col-50">
            <div class="card soft-card margin-right-half text-align-center padding-vertical">
              <div class="card-content card-content-padding">
                <div class="icon-container bg-color-orange-light">
                  <i class="icon f7-icons text-color-orange">timer</i>
                </div>
                <div class="text-xl font-bold margin-top-half">12.5h</div>
                <div class="text-xs text-color-gray">Questo mese</div>
              </div>
            </div>
          </div>
          <div class="col-50">
            <div class="card soft-card margin-left-half text-align-center padding-vertical">
              <div class="card-content card-content-padding">
                <div class="icon-container bg-color-purple-light">
                  <i class="icon f7-icons text-color-purple">star_fill</i>
                </div>
                <div class="text-xl font-bold margin-top-half">Liv. 3</div>
                <div class="text-xs text-color-gray">Super Volunteer</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottone Azione Principale -->
        <div class="block margin-vertical-medium">
          <a href="#" @click=${startShift} class="button button-fill button-large button-round button-primary-action ripple">
            <i class="icon f7-icons margin-right-half">play_circle_fill</i>
            Inizia Turno
          </a>
          <p class="text-align-center text-color-gray size-12 margin-top-half">
            <i class="icon f7-icons size-12">location</i> Rilevamento GPS attivo
          </p>
        </div>

        <!-- Lista Progetti -->
        <div class="block-title margin-top display-flex justify-content-between align-items-center">
          <span class="size-18 font-bold text-color-black">Progetti Attivi</span>
          <a href="#" class="link text-color-theme text-xs">Vedi tutti</a>
        </div>
        
        <div class="card soft-card margin-bottom-xl">
          <div class="card-content card-content-padding">
            <div class="list media-list no-hairlines-between">
              <ul>
                <li>
                  <div class="item-content">
                    <div class="item-media">
                       <div style="background: #e0e0e0; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                          <span style="font-size: 20px;">🍲</span>
                       </div>
                    </div>
                    <div class="item-inner">
                      <div class="item-title-row">
                        <div class="item-title font-bold">Mensa dei Poveri</div>
                        <div class="item-after"><span class="badge color-green">Oggi</span></div>
                      </div>
                      <div class="item-subtitle text-color-gray size-12">Turno: 18:00 - 20:00</div>
                    </div>
                  </div>
                </li>
                 <li>
                  <div class="item-content">
                    <div class="item-media">
                       <div style="background: #e0e0e0; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                          <span style="font-size: 20px;">🚑</span>
                       </div>
                    </div>
                    <div class="item-inner">
                      <div class="item-title-row">
                        <div class="item-title font-bold">Croce Verde</div>
                      </div>
                      <div class="item-subtitle text-color-gray size-12">Richiesta disponibilità</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
      
      <!-- Stili CSS locali per questa pagina -->
      <style>
        .custom-header {
          background-color: var(--f7-theme-color);
          padding-top: 60px;
          padding-bottom: 80px;
          border-bottom-left-radius: 30px;
          border-bottom-right-radius: 30px;
        }
        .icon-container {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }
        .bg-color-orange-light { background-color: rgba(255, 152, 0, 0.15); }
        .bg-color-purple-light { background-color: rgba(156, 39, 176, 0.15); }
        .font-bold { font-weight: 600; }
        .size-32 { font-size: 32px; }
        .size-18 { font-size: 18px; }
        .size-12 { font-size: 12px; }
        .margin-right-half { margin-right: 8px; }
        .margin-left-half { margin-left: 8px; }
        .margin-bottom-xl { margin-bottom: 80px; }
      </style>
    </div>
  `;
};

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '(.*)',
    content: '<div class="page-content block">404 - Pagina non trovata</div>',
  },
];

export default routes;