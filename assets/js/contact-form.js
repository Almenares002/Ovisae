/* OVIS A&E — contact / quote form: inline validation + Formspree via fetch (no redirect).
   Safe to include more than once. */
(function () {
  function init() {
    var form = document.getElementById('ovisContactForm');
    if (!form || form.dataset.ocBound) return;
    form.dataset.ocBound = '1';

    var d = form.dataset;
    var success = document.getElementById('oc-success');
    var alertBox = document.getElementById('oc-alert');
    var btn = form.querySelector('.oc-submit');
    var btnLabel = btn.querySelector('.oc-submit-label');
    var btnText = btnLabel.textContent;
    var fileInput = document.getElementById('oc-archivos');
    var drop = form.querySelector('.oc-drop');
    var dropText = drop ? drop.querySelector('strong') : null;
    var genericErr = document.getElementById('oc-err-generic');
    var MAX_BYTES = 20 * 1024 * 1024;

    function fieldOf(el) { return el.closest('.oc-field'); }
    function setError(el, msg) {
      var f = fieldOf(el);
      if (f) {
        f.classList.add('is-invalid');
        var e = f.querySelector('.oc-error');
        if (e) e.textContent = msg;
      }
      if (el.setAttribute) el.setAttribute('aria-invalid', 'true');
    }
    function clearError(el) {
      var f = fieldOf(el);
      if (f) {
        f.classList.remove('is-invalid');
        var e = f.querySelector('.oc-error');
        if (e) e.textContent = '';
      }
      if (el.removeAttribute) el.removeAttribute('aria-invalid');
    }
    function consentError(show) {
      var e = document.getElementById('oc-acepto_privacidad-err');
      if (!e) return;
      e.textContent = show ? d.msgConsent : '';
      e.classList.toggle('show', !!show);
    }
    function totalBytes() {
      var t = 0;
      if (fileInput && fileInput.files) for (var i = 0; i < fileInput.files.length; i++) t += fileInput.files[i].size;
      return t;
    }

    function validateField(el) {
      var v = (el.value || '').trim();
      if (el.required && !v) { setError(el, d.msgRequired); return false; }
      if (el.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { setError(el, d.msgEmail); return false; }
      if (el.type === 'tel' && v && v.replace(/\D/g, '').length < 7) { setError(el, d.msgTel); return false; }
      clearError(el);
      return true;
    }
    function validateServices() {
      var box = document.getElementById('oc-servicios');
      if (!box) return true;
      var ok = !!box.querySelector('input:checked');
      var f = box.closest('.oc-field');
      f.classList.toggle('is-invalid', !ok);
      f.querySelector('.oc-error').textContent = ok ? '' : d.msgSvc;
      return ok;
    }
    function validateFiles() {
      if (!fileInput) return true;
      if (totalBytes() > MAX_BYTES) { setError(fileInput, d.msgSize); return false; }
      clearError(fileInput);
      return true;
    }
    function validateAll() {
      var first = null, ok = true;
      form.querySelectorAll('.oc-input').forEach(function (el) {
        if (!validateField(el)) { ok = false; first = first || el; }
      });
      if (!validateServices()) { ok = false; first = first || form.querySelector('#oc-servicios input'); }
      if (!validateFiles()) { ok = false; first = first || drop; }
      var consent = document.getElementById('oc-acepto_privacidad');
      if (consent && !consent.checked) { ok = false; consentError(true); first = first || consent; } else consentError(false);
      if (first) {
        var target = first.closest('.oc-field') || first.closest('.oc-checks') || first;
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(function () { try { first.focus({ preventScroll: true }); } catch (e) {} }, 350);
      }
      return ok;
    }

    form.querySelectorAll('.oc-input').forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value.trim() || fieldOf(el).classList.contains('is-invalid')) validateField(el); });
      el.addEventListener('input', function () { if (fieldOf(el).classList.contains('is-invalid')) validateField(el); });
      el.addEventListener('change', function () { if (fieldOf(el).classList.contains('is-invalid')) validateField(el); });
    });
    form.querySelectorAll('#oc-servicios input').forEach(function (el) {
      el.addEventListener('change', function () { if (document.getElementById('oc-servicios').closest('.oc-field').classList.contains('is-invalid')) validateServices(); });
    });
    var consentBox = document.getElementById('oc-acepto_privacidad');
    if (consentBox) consentBox.addEventListener('change', function () { if (consentBox.checked) consentError(false); });

    if (fileInput && drop && dropText) {
      fileInput.addEventListener('change', function () {
        var n = fileInput.files ? fileInput.files.length : 0;
        if (!n) { dropText.textContent = dropText.dataset.default; drop.classList.remove('has-files'); }
        else {
          var names = [];
          for (var i = 0; i < n; i++) names.push(fileInput.files[i].name);
          dropText.textContent = names.join(', ');
          drop.classList.add('has-files');
        }
        validateFiles();
      });
      ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('has-files'); }); });
      drop.addEventListener('dragleave', function () { if (!fileInput.files.length) drop.classList.remove('has-files'); });
      drop.addEventListener('drop', function (e) {
        e.preventDefault();
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
          try { fileInput.files = e.dataTransfer.files; } catch (err) {}
          fileInput.dispatchEvent(new Event('change'));
        }
      });
    }

    function showAlert(html) { alertBox.innerHTML = html; alertBox.hidden = false; }
    function hideAlert() { alertBox.hidden = true; alertBox.innerHTML = ''; }
    function setLoading(on) {
      btn.disabled = on;
      btn.classList.toggle('is-loading', on);
      btnLabel.textContent = on ? d.msgSending : btnText;
    }
    function send(fd) {
      return fetch(form.action, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } });
    }
    function showSuccess(name, filesDropped) {
      var h = success.querySelector('h3');
      var first = (name || '').trim().split(/\s+/)[0];
      h.textContent = h.dataset.template.replace('{name}', first ? ', ' + first : '');
      success.querySelector('.oc-success-files').hidden = !filesDropped;
      form.hidden = true;
      var head = form.parentNode.querySelector('.oc-form-head');
      if (head) head.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(function () { try { success.focus({ preventScroll: true }); } catch (e) {} }, 400);
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      hideAlert();
      if (!validateAll()) { showAlert(d.msgFields); return; }
      setLoading(true);
      var fd = new FormData(form);
      var hasFiles = fileInput && fileInput.files && fileInput.files.length > 0;
      var name = fd.get('nombre_completo') || '';
      try {
        var res = await send(fd);
        if (res.ok) { showSuccess(name, false); form.reset(); return; }
        // If the files were the problem, send the request again without them so it is not lost.
        if (hasFiles) {
          var fd2 = new FormData(form);
          fd2.delete('archivos[]');
          var res2 = await send(fd2);
          if (res2.ok) { showSuccess(name, true); form.reset(); return; }
        }
        var msg = genericErr ? genericErr.innerHTML : 'Error';
        try {
          var data = await res.json();
          if (data && data.errors && data.errors.length) {
            var fieldErr = false;
            data.errors.forEach(function (er) {
              var el = er.field && form.querySelector('[name="' + er.field + '"]');
              if (el && el.classList.contains('oc-input')) { setError(el, er.message); fieldErr = true; }
            });
            if (fieldErr) msg = d.msgFields;
          }
        } catch (err) {}
        showAlert(msg);
      } catch (err) {
        showAlert(genericErr ? genericErr.innerHTML : 'Error');
      } finally {
        setLoading(false);
      }
    });

    var again = success.querySelector('.oc-again');
    if (again) again.addEventListener('click', function () {
      success.hidden = true;
      form.hidden = false;
      var head = form.parentNode.querySelector('.oc-form-head');
      if (head) head.hidden = false;
      if (dropText) { dropText.textContent = dropText.dataset.default; drop.classList.remove('has-files'); }
      form.querySelector('.oc-input').focus();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
