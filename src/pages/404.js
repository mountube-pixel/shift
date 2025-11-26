export default (props, { $f7, $h }) => {
  return () => $h`
    <div class="page">
      <div class="navbar">
        <div class="navbar-bg"></div>
        <div class="navbar-inner sliding">
          <div class="left">
            <a href="#" class="link back">
              <i class="icon icon-back"></i>
              <span class="if-not-md">Back</span>
            </a>
          </div>
          <div class="title">Non Trovata</div>
        </div>
      </div>
      <div class="page-content">
        <div class="block block-strong inset text-align-center">
          <p class="size-22">🤷‍♂️</p>
          <p>Ops! La pagina che cerchi non esiste.</p>
        </div>
      </div>
    </div>
  `;
};