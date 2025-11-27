// src/js/app-component.js
import store from './store.js';

export default (props, { $f7, $h, $update }) => {
  
  return () => $h`
    <div id="app">

      <div class="view view-main view-init safe-areas" data-url="/"></div>

      <div class="popup" id="my-popup">
        <div class="view">
          <div class="page">
            <div class="navbar">
              <div class="navbar-bg"></div>
              <div class="navbar-inner">
                <div class="title">Popup</div>
                <div class="right"><a href="#" class="link popup-close">Chiudi</a></div>
              </div>
            </div>
            <div class="page-content"><div class="block">Contenuto Popup.</div></div>
          </div>
        </div>
      </div>

      <div class="login-screen" id="my-login-screen">
        <div class="view"><div class="page"></div></div>
      </div>

    </div>
  `;
};