// Quote buttons: open the OVIS client portal (request menu) in a new tab.
// The form is a Google Apps Script web app; embedded in an iframe it fails on
// iPhone Safari and other browsers that block third-party cookies, so we no
// longer open it inside the in-page modal.
(function () {
    // Requests now go through the client portal's click-through request menu.
    // Each page's own quote links already carry the right language (?lang=es|en);
    // use the first of them, else the portal's default.
    var FORM_URL = "https://ovisae.com/portal-app/";
    function pickUrl() {
        var a = document.querySelector('a[href^="https://ovisae.com/portal-app/"]');
        if (a) FORM_URL = a.getAttribute('href');
    }

    function openForm(e) {
        if (e) e.preventDefault();
        var w = window.open(FORM_URL, "_blank", "noopener");
        if (!w) window.location.href = FORM_URL;
    }

    document.addEventListener('DOMContentLoaded', function () {
        pickUrl();
        // Any button still wired to the old modal opens the form instead.
        document.querySelectorAll('[data-bs-target="#portalModal"]').forEach(function (el) {
            el.removeAttribute('data-bs-toggle');
            el.removeAttribute('data-bs-target');
            if (el.tagName === 'A') {
                el.setAttribute('href', FORM_URL);
                el.setAttribute('target', '_blank');
                el.setAttribute('rel', 'noopener');
            } else {
                el.addEventListener('click', openForm);
            }
        });

        // If something still opens the modal, cancel it and open the form.
        var portalModal = document.getElementById('portalModal');
        if (portalModal) {
            portalModal.addEventListener('show.bs.modal', function (e) { openForm(e); });
        }
    });
})();
