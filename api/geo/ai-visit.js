/* px-ai-visit.js — Tráfico IA de PXSOL.
   Solo reporta cuando la visita viene de un chat de IA. Si no, no hace ni una request.
   Generado desde apps/web/src/lib/geo-ai-visit-beacon.ts — no editar a mano. */
(function () {
  'use strict';
  try {
    var HOSTS = ["chatgpt.com","chat.openai.com","claude.ai","perplexity.ai","gemini.google.com","bard.google.com","copilot.microsoft.com","grok.com","deepseek.com","chat.mistral.ai","meta.ai","poe.com","you.com","phind.com","felo.ai"];
    var UTMS = ["chatgpt.com","chatgpt","openai","claude.ai","claude","perplexity.ai","perplexity","gemini","copilot","grok","deepseek"];

    /* Host normalizado: minúsculas, sin www., sin puerto. */
    function host(u) {
      if (!u) return null;
      try {
        var h = new URL(u).hostname.toLowerCase();
        return h.indexOf('www.') === 0 ? h.slice(4) : h;
      } catch (e) { return null; }
    }

    /* Match por host o subdominio, NUNCA por substring: 'notchatgpt.com' no es ChatGPT. */
    function esIA(h) {
      if (!h) return false;
      for (var i = 0; i < HOSTS.length; i++) {
        if (h === HOSTS[i] || h.slice(-(HOSTS[i].length + 1)) === '.' + HOSTS[i]) return true;
      }
      return false;
    }

    var ref = document.referrer || '';
    var utm = '';
    try { utm = (new URLSearchParams(location.search).get('utm_source') || '').toLowerCase(); } catch (e) {}

    var porRef = esIA(host(ref));
    var porUtm = !porRef && utm && UTMS.indexOf(utm) !== -1;
    if (!porRef && !porUtm) return;   /* la visita normal sale por acá y no cuesta nada */

    /* Una sola vez por pestaña y por página: un reload no es una visita nueva. El
       servidor igual deduplica (unique por visitante x página x día); esto solo evita
       requests de más. */
    var marca = 'pxai:' + location.pathname;
    try {
      if (sessionStorage.getItem(marca)) return;
      sessionStorage.setItem(marca, '1');
    } catch (e) { /* storage bloqueado: se reporta igual, el servidor deduplica */ }

    var payload = JSON.stringify({ url: location.href, referrer: ref, utmSource: utm || null });
    var endpoint = (document.currentScript && document.currentScript.getAttribute('data-endpoint')) ||
      'https://nexus.getpxsol.com/api/geo/ai-visit';

    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([payload], { type: 'text/plain;charset=UTF-8' }));
    } else if (window.fetch) {
      /* window.fetch y no el `fetch` pelado: son lo mismo en un navegador, pero así la
         llamada es interceptable y el test del fallback prueba algo de verdad. */
      window.fetch(endpoint, { method: 'POST', body: payload, keepalive: true, mode: 'no-cors' });
    }
  } catch (e) { /* el tracking NUNCA rompe la página */ }
})();
