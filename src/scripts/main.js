/* ============================================================
   Concrete Toronto - interactions
   ============================================================ */
(function () {
  "use strict";

  /* ------------------------------------------------------------
     LEAD DELIVERY CONFIG
     The quote form posts to this n8n webhook. With JS we send via fetch and
     redirect: /thank-you/ when the backend answers {ok:true}, /quote-error/
     on any failure. Without JS the form does a plain POST navigation and the
     backend answers with an HTML meta-refresh to /thank-you/, so the plain
     action/method markup must stay untouched.
     ------------------------------------------------------------ */
  var LEAD_ENDPOINT = "https://n8n.londonseopro.ca/webhook/concrete-toronto-lead";

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobileMenu");
  if (burger && menu) {
    function closeMenu() {
      menu.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeMenu();
    });
    // close on outside click and on Escape
    document.addEventListener("click", function (e) {
      if (menu.classList.contains("open") && !menu.contains(e.target) && !burger.contains(e.target)) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        closeMenu();
        burger.focus();
      }
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.setAttribute("aria-expanded", "false");
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(".faq-a").style.maxHeight = null;
          other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        }
      });
      if (isOpen) {
        item.classList.remove("open");
        a.style.maxHeight = null;
        q.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
        q.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Quote form ---------- */
  var form = document.getElementById("quoteForm");
  if (form) {
    function validateField(field) {
      var input = field.querySelector("input, textarea");
      if (!input) return true;
      var val = input.value.trim();
      var ok = true;
      if (input.required && !val) ok = false;
      if (ok && input.type === "email" && val) {
        ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      }
      if (ok && input.dataset.tel && val) {
        ok = val.replace(/\D/g, "").length >= 10;
      }
      field.classList.toggle("invalid", !ok);
      return ok;
    }

    form.querySelectorAll(".field input, .field textarea").forEach(function (input) {
      input.addEventListener("blur", function () { validateField(input.closest(".field")); });
      input.addEventListener("input", function () {
        var f = input.closest(".field");
        if (f.classList.contains("invalid")) validateField(f);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // skip .row2 layout wrappers - validating them would mark every nested
      // input invalid when only one field actually failed
      var fields = form.querySelectorAll(".field:not(.row2)");
      var allOk = true;
      fields.forEach(function (f) { if (!validateField(f)) allOk = false; });
      if (!allOk) {
        var firstBad = form.querySelector(".field.invalid input, .field.invalid textarea");
        if (firstBad) firstBad.focus();
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      // set(), not append(): the form ships a hidden source_url holding the
      // build-time canonical for the no-JS path, and this replaces it with the
      // live URL rather than sending two values and relying on which wins.
      var fd = new FormData(form);
      fd.set("source_url", window.location.href);
      fetch(LEAD_ENDPOINT, { method: "POST", body: fd })
        .then(function (res) { return res.ok ? res.json().catch(function () { return { ok: true }; }) : { ok: false }; })
        .then(function (data) {
          window.location.href = data && data.ok ? "/thank-you/" : "/quote-error/";
        })
        .catch(function () {
          window.location.href = "/quote-error/";
        });
    });

    // Only now that our own submit handler is definitely attached do we turn
    // the browser's validation off. Setting it earlier would mean a script
    // error anywhere above left the form with neither native nor custom
    // checks, which is worse than the no-JS path this all exists to protect.
    // The markup ships without novalidate so that path keeps native checks.
    form.setAttribute("novalidate", "");
  }

  /* ---------- Phone-number formatting ---------- */
  var tel = document.querySelector('input[data-tel]');
  if (tel) {
    tel.addEventListener("input", function () {
      var d = tel.value.replace(/\D/g, "");
      // Drop a leading North American country code so "+1 416 489 4898" and
      // "1-416-489-4898" don't get their 1 mistaken for the area code (which
      // silently truncated the last digit before it reached the webhook).
      if (d.length > 10 && d.charAt(0) === "1") d = d.slice(1);
      d = d.slice(0, 10);
      var out = d;
      if (d.length > 6) out = "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6);
      else if (d.length > 3) out = "(" + d.slice(0, 3) + ") " + d.slice(3);
      else if (d.length > 0) out = "(" + d;
      tel.value = out;
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------- Sticky mobile CTA: hide while the quote form is on screen ---------- */
  var stickyCta = document.getElementById("stickyCta");
  var quoteSection = document.getElementById("quote");
  if (stickyCta && quoteSection && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        stickyCta.classList.toggle("hidden", en.isIntersecting);
      });
    }, { threshold: 0.08 }).observe(quoteSection);
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".header");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 8) header.style.boxShadow = "0 10px 30px -18px rgba(0,0,0,.5)";
    else header.style.boxShadow = "none";
  }, { passive: true });
})();
