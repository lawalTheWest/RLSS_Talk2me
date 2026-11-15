(function () {
  "use strict";

  /* Header shadow after scrolling */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Mobile navigation */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && links.classList.contains("open")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* Copy buttons on documentation code blocks */
  var copyBlocks = document.querySelectorAll(".doc .code");
  Array.prototype.forEach.call(copyBlocks, function (block) {
    var button = block.querySelector(".copy-btn");
    var code = block.querySelector("code");
    if (!button || !code) return;

    button.addEventListener("click", function () {
      var text = code.innerText;
      var done = function () {
        button.textContent = "Copied";
        button.classList.add("copied");
        window.setTimeout(function () {
          button.textContent = "Copy";
          button.classList.remove("copied");
        }, 1600);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {
          fallbackCopy(text);
          done();
        });
      } else {
        fallbackCopy(text);
        done();
      }
    });
  });

  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
    } catch (error) {
      /* Nothing else to try. */
    }
    document.body.removeChild(area);
  }

  /* Highlight the current section in the docs sidebar */
  var spyLinks = Array.prototype.slice.call(
    document.querySelectorAll(".doc-nav a[href^='#']")
  );
  if (spyLinks.length && "IntersectionObserver" in window) {
    var bySection = new Map();
    spyLinks.forEach(function (link) {
      var target = document.querySelector(link.getAttribute("href"));
      if (target) bySection.set(target, link);
    });

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          spyLinks.forEach(function (link) {
            link.classList.remove("active");
          });
          var active = bySection.get(entry.target);
          if (active) active.classList.add("active");
        });
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 }
    );

    bySection.forEach(function (_link, section) {
      spy.observe(section);
    });
  }

  /* Gentle reveal on scroll, skipped for reduced motion */
  var reveal = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  if (reveal.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(reveal, function (element) {
        element.classList.add("in");
      });
    } else {
      var watcher = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("in");
            watcher.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      Array.prototype.forEach.call(reveal, function (element) {
        watcher.observe(element);
      });
    }
  }

  /* Keep the footer year current */
  Array.prototype.forEach.call(
    document.querySelectorAll("[data-year]"),
    function (element) {
      element.textContent = String(new Date().getFullYear());
    }
  );
})();
