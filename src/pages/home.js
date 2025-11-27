// src/pages/home.js
import store from '../js/store.js';
import { apiCall, ENDPOINTS } from '../js/api.js';

export default (props, { $f7, $h, $update, $on }) => {
  // --- STATO ---
  let stats = {
    total_hours: 0,
    level: 1,
    level_label: 'Novizio',
    upcoming_shifts: []
  };
  
  let isLoadingData = true;
  let user = store.getters.user.value;

  // --- HELPER VISIVI ---
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buongiorno';
    if (hour < 18) return 'Buon pomeriggio';
    return 'Buonasera';
  };

  const getProjectIcon = (projectName) => {
      const name = projectName ? projectName.toLowerCase() : '';
      if (name.includes('croce') || name.includes('soccorso') || name.includes('sanit')) return 'heart_fill';
      if (name.includes('mensa') || name.includes('cibo')) return 'cart_fill';
      if (name.includes('ambiente') || name.includes('parco') || name.includes('verde')) return 'leaf_arrow_circle_path';
      if (name.includes('scuola') || name.includes('educaz')) return 'book_fill';
      return 'calendar_today'; 
  };

  const getProjectStyles = (projectName) => {
      const name = projectName ? projectName.toLowerCase() : '';
      if (name.includes('croce')) return 'background: rgba(255, 59, 48, 0.1); color: #ff3b30;';
      if (name.includes('mensa')) return 'background: rgba(255, 149, 0, 0.1); color: #ff9500;';
      if (name.includes('ambiente')) return 'background: rgba(76, 217, 100, 0.1); color: #4cd964;';
      return 'background: rgba(0, 137, 123, 0.1); color: var(--f7-theme-color);';
  };

  // --- LOGICA DATI ---
  const loadDashboardData = async (e) => {
    try {
      const data = await apiCall(ENDPOINTS.HOME_STATS, 'POST', {});
      stats = data;
      if(!stats.level_label) stats.level_label = `Livello ${stats.level}`;
    } catch (err) {
      console.error("Errore dashboard:", err);
    } finally {
      isLoadingData = false;
      $update();
      if(e && e.detail) $f7.ptr.done(); 
    }
  };

  const startShift = () => {
    $f7.dialog.confirm(
        'Sei pronto a timbrare l\'inizio del turno?', 
        'Avvio Turno', 
        () => {
            $f7.dialog.preloader('Localizzazione GPS...');
            setTimeout(() => {
                $f7.dialog.close();
                $f7.toast.create({
                    text: 'Turno avviato! Buon lavoro.',
                    position: 'center',
                    closeTimeout: 2000,
                    icon: '<i class="f7-icons">checkmark_circle</i>',
                    cssClass: 'color-green'
                }).open();
            }, 1500);
        }
    );
  };

  $on('pageInit', () => {
    loadDashboardData();
  });

  // --- RENDER ---
  return () => $h`
    <div class="page" data-name="home">
      
      <div class="navbar navbar-transparent text-color-white">
        <div class="navbar-bg" style="background: transparent;"></div>
        <div class="navbar-inner">
          <div class="left">
            <a href="#" class="link icon-only panel-open" data-panel="left">
              <i class="icon f7-icons">bars_alt</i>
            </a>
          </div>
          <div class="title" style="font-weight: 800; letter-spacing: 0.5px; opacity: 0.9;">SHIFT</div>
          <div class="right">
            <a href="/notifications/" class="link icon-only ripple-color-white">
              <i class="icon f7-icons">bell_fill</i>
              <span class="badge color-red" style="box-shadow: 0 2px 4px rgba(0,0,0,0.2);">2</span>
            </a>
          </div>
        </div>
      </div>

      <div class="toolbar toolbar-bottom tabbar tabbar-icons floating-navbar margin-horizontal margin-bottom-half shadow-soft glass-effect" style="border-radius: 24px; bottom: 10px; --f7-toolbar-bg-color: rgba(255,255,255,0.9);">
        <div class="toolbar-inner">
          <a href="/" class="tab-link tab-link-active"><i class="icon f7-icons">house_fill</i></a>
          <a href="/calendar/" class="tab-link"><i class="icon f7-icons">calendar</i></a>
          <a href="/stats/" class="tab-link"><i class="icon f7-icons">chart_bar_fill</i></a>
          <a href="/profile/" class="tab-link"><i class="icon f7-icons">person_crop_circle_fill</i></a>
        </div>
      </div>

      <div class="page-content ptr-content" @ptr:refresh=${loadDashboardData} style="padding-top: 0; padding-bottom: 100px; background-color: #f7f8fa;">
        
        <div class="ptr-preloader">
            <div class="preloader color-white"></div>
            <div class="ptr-arrow color-white"></div>
        </div>

        <div class="custom-header display-flex flex-direction-column justify-content-center fade-in">
          <div class="header-pattern"></div>
          <div class="block margin-top">
            <p class="no-margin-bottom text-color-white opacity-90 size-15 font-weight-600 slide-up-1">${getGreeting()},</p>
            <h1 class="no-margin-top text-color-white size-34 font-weight-800 text-shadow-sm slide-up-2">
                ${user ? user.first_name : 'Volontario'}
            </h1>
          </div>
        </div>

        <div class="row no-gap margin-horizontal" style="margin-top: -75px; position: relative; z-index: 10;">
          <div class="col-50 slide-up-3">
            <div class="card soft-card margin-right-half text-align-center padding-vertical shadow-soft ripple display-flex flex-direction-column justify-content-center hover-lift">
              <div class="card-content card-content-padding">
                <div class="icon-container margin-horizontal-auto" style="background: rgba(255, 152, 0, 0.15);">
                  <i class="icon f7-icons text-color-orange">timer</i>
                </div>
                ${isLoadingData 
                  ? $h`<div class="skeleton-text skeleton-effect-fade margin-top-half" style="width: 50px; height: 24px; margin: 10px auto 0; border-radius: 4px;"></div>` 
                  : $h`<div class="text-xl font-weight-800 margin-top-half text-color-black">${stats.total_hours}h</div>`
                }
                <div class="text-xs text-color-gray font-weight-600 margin-top-xs uppercase-tracking">ORE MENSILI</div>
              </div>
            </div>
          </div>
          <div class="col-50 slide-up-4">
            <div class="card soft-card margin-left-half text-align-center padding-vertical shadow-soft ripple display-flex flex-direction-column justify-content-center hover-lift">
              <div class="card-content card-content-padding">
                <div class="icon-container margin-horizontal-auto" style="background: rgba(156, 39, 176, 0.15);">
                  <i class="icon f7-icons text-color-purple">star_fill</i>
                </div>
                ${isLoadingData 
                  ? $h`<div class="skeleton-text skeleton-effect-fade margin-top-half" style="width: 70px; height: 24px; margin: 10px auto 0; border-radius: 4px;"></div>` 
                  : $h`<div class="text-xl font-weight-800 margin-top-half text-color-black">Liv. ${stats.level}</div>`
                }
                <div class="text-xs text-color-gray font-weight-600 margin-top-xs uppercase-tracking">
                    ${isLoadingData ? '...' : stats.level_label}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="block margin-vertical-medium slide-up-5">
          <a href="#" @click=${startShift} class="button button-fill button-large button-round button-primary-action shadow-teal display-flex align-items-center justify-content-center pulse-animation">
            <i class="icon f7-icons margin-right-half">play_circle_fill</i>
            <span>INIZIA TURNO</span>
          </a>
          <div class="text-align-center text-color-gray size-12 margin-top-half display-flex align-items-center justify-content-center opacity-70">
            <div class="status-dot blink margin-right-xs"></div> GPS Ready
          </div>
        </div>

        <div class="block-title margin-top display-flex justify-content-between align-items-center padding-horizontal-0 slide-up-6">
          <span class="size-18 font-weight-800 text-color-black">In Programma</span>
          <a href="/shifts/" class="link text-color-theme text-xs font-weight-bold">Tutti</a>
        </div>
        
        <div class="card soft-card margin-horizontal margin-bottom-xl shadow-soft slide-up-7" style="border-radius: 20px; overflow: hidden;">
          <div class="card-content">
            <div class="list media-list no-hairlines no-hairlines-between no-margin-vertical">
              <ul>
                
                ${isLoadingData && $h`
                    <li class="item-content skeleton-text skeleton-effect-wave padding-vertical">
                        <div class="item-media"><div class="skeleton-block" style="width:50px; height:50px; border-radius:16px;"></div></div>
                        <div class="item-inner">
                            <div class="item-title-row"><div class="item-title" style="width: 60%; height: 14px;"></div></div>
                            <div class="item-subtitle" style="width: 40%; height: 10px; margin-top: 5px;"></div>
                        </div>
                    </li>
                `}

                ${!isLoadingData && stats.upcoming_shifts.length === 0 && $h`
                    <li class="item-content padding-vertical-double">
                        <div class="item-inner text-align-center text-color-gray display-flex flex-direction-column align-items-center">
                            <div style="background: #f0f2f5; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
                                <i class="icon f7-icons text-color-gray opacity-50" style="font-size: 28px;">calendar_badge_minus</i>
                            </div>
                            <p class="no-margin font-weight-600 size-15">Nessun turno imminente</p>
                            <p class="no-margin size-13 opacity-60">Ricarica le batterie!</p>
                        </div>
                    </li>
                `}

                ${!isLoadingData && stats.upcoming_shifts.map((shift) => $h`
                <li>
                  <a href="#" class="item-link item-content padding-vertical-half">
                    <div class="item-media">
                       <div class="project-icon-placeholder shadow-sm display-flex align-items-center justify-content-center" style="${getProjectStyles(shift.project)}">
                          <i class="icon f7-icons" style="font-size: 22px;">${getProjectIcon(shift.project)}</i>
                       </div>
                    </div>
                    <div class="item-inner">
                      <div class="item-title-row">
                        <div class="item-title font-bold text-color-black size-15">${shift.project}</div>
                        <div class="item-after">
                            <span class="badge color-green shadow-green-sm" style="font-weight: 600; padding: 4px 8px; height: auto;">${shift.date}</span>
                        </div>
                      </div>
                      <div class="item-subtitle text-color-gray size-13 font-weight-500 margin-top-xs display-flex align-items-center">
                        <i class="icon f7-icons size-12 margin-right-xs opacity-60">clock_fill</i>${shift.time}
                      </div>
                    </div>
                  </a>
                </li>
                `)}

              </ul>
            </div>
          </div>
        </div>
        
        <div class="block margin-vertical text-align-center padding-bottom-xl">
           <span class="text-color-gray opacity-50 size-12">SHIFT Platform</span>
        </div>

      </div>

      <style>
        .custom-header {
          position: relative;
          background: linear-gradient(135deg, var(--f7-theme-color) 0%, #00695c 100%);
          padding-top: 90px; padding-bottom: 110px;
          border-bottom-left-radius: 35px; border-bottom-right-radius: 35px;
          box-shadow: 0 15px 40px rgba(0, 137, 123, 0.25);
          overflow: hidden;
        }
        .header-pattern {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            background-image: radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 0%, transparent 20%), 
                              radial-gradient(circle at 90% 80%, rgba(255,255,255,0.1) 0%, transparent 20%);
            opacity: 0.6; pointer-events: none;
        }
        .soft-card { background: #fff; border-radius: 20px; border: none; min-height: 145px; transition: transform 0.2s ease; }
        .hover-lift:active { transform: scale(0.97); }
        .icon-container {
          width: 58px; height: 58px; border-radius: 20px;
          display: inline-flex; align-items: center; justify-content: center;
          margin-bottom: 10px;
        }
        .project-icon-placeholder { width: 52px; height: 52px; border-radius: 18px; }
        .shadow-soft { box-shadow: 0 10px 30px rgba(0,0,0,0.06) !important; }
        .shadow-teal { box-shadow: 0 10px 25px rgba(0, 137, 123, 0.4); }
        .shadow-sm { box-shadow: 0 4px 10px rgba(0,0,0,0.04); }
        .shadow-green-sm { box-shadow: 0 4px 10px rgba(76, 217, 100, 0.3); }
        .text-shadow-sm { text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .glass-effect { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
        .button-primary-action {
            height: 60px; font-weight: 800; font-size: 16px; letter-spacing: 0.8px;
            background-image: linear-gradient(to right, var(--f7-theme-color), #00796b);
        }
        @keyframes pulse-teal {
            0% { box-shadow: 0 0 0 0 rgba(0, 137, 123, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(0, 137, 123, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 137, 123, 0); }
        }
        .pulse-animation { animation: pulse-teal 2s infinite; }
        .status-dot { width: 8px; height: 8px; background-color: #4cd964; border-radius: 50%; }
        .blink { animation: blinker 1.5s linear infinite; }
        @keyframes blinker { 50% { opacity: 0; } }
        .fade-in { animation: fadeIn 0.5s ease-out; }
        .slide-up-1 { animation: slideUp 0.5s ease-out 0.1s both; }
        .slide-up-2 { animation: slideUp 0.5s ease-out 0.2s both; }
        .slide-up-3 { animation: slideUp 0.5s ease-out 0.3s both; }
        .slide-up-4 { animation: slideUp 0.5s ease-out 0.4s both; }
        .slide-up-5 { animation: slideUp 0.5s ease-out 0.5s both; }
        .slide-up-6 { animation: slideUp 0.5s ease-out 0.6s both; }
        .slide-up-7 { animation: slideUp 0.5s ease-out 0.7s both; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .font-weight-800 { font-weight: 800; }
        .font-weight-600 { font-weight: 600; }
        .uppercase-tracking { text-transform: uppercase; letter-spacing: 0.5px; }
        .size-34 { font-size: 34px; }
        .size-15 { font-size: 15px; }
        .size-13 { font-size: 13px; }
        .list .item-content { min-height: 76px; }
      </style>
    </div>
  `;
};