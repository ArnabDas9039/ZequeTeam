// ============================================================
//  ZeQue — script.js
// ============================================================

var EJ_PUBLIC_KEY = "TpznKYYp8ug8kpoYq";
var EJ_SERVICE_ID = "service_cqw26bn";
var EJ_TEMPLATE_ID = "template_ckawdwu";

if (typeof emailjs !== "undefined") {
  emailjs.init({ publicKey: EJ_PUBLIC_KEY });
}

// ---- INTRO OVERLAY ----
(function () {
  var intro = document.getElementById("intro");
  if (!intro) return;
  var isHidden = false;
  function hide() {
    if (isHidden) return;
    isHidden = true;
    intro.style.transition = "opacity 0.5s ease";
    intro.style.opacity = "0";
    setTimeout(function () {
      intro.style.display = "none";
    }, 500);
  }
  setTimeout(hide, 3000);
  intro.addEventListener("click", hide);
})();

// ---- NAVBAR ----
var nav = document.getElementById("nav");
var hbg = document.getElementById("hbg");
var navMenu = document.getElementById("navMenu");
var ddtog = document.getElementById("ddtog");
var ddpanel = document.getElementById("ddpanel");
var ulLink = document.getElementById("ulLink");

if (nav) {
  window.addEventListener("scroll", function () {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  });
}
if (hbg && navMenu) {
  hbg.addEventListener("click", function () {
    navMenu.classList.toggle("open");
  });
  navMenu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      if (a !== ddtog) navMenu.classList.remove("open");
    });
  });
}
if (ddtog && ddpanel) {
  ddtog.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    ddpanel.classList.toggle("open");
  });
  document.addEventListener("click", function () {
    ddpanel.classList.remove("open");
  });
  ddpanel.addEventListener("click", function (e) {
    e.stopPropagation();
  });
}
if (ulLink) {
  ulLink.addEventListener("click", function (e) {
    e.preventDefault();
    if (ddpanel) ddpanel.classList.remove("open");
    var adminSection = document.getElementById("admin");
    if (adminSection) {
      adminSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// ---- SLIDER ----
var track = document.getElementById("sliderTrack");
if (track) {
  var slides = track.querySelectorAll(".slide");
  var dotsEl = document.getElementById("slDots");
  var cur = 0;
  var autoT = null;

  function getVis() {
    return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
  }
  function goTo(i) {
    var vis = getVis();
    var max = slides.length - vis;
    cur = Math.max(0, Math.min(i, max));
    var w = 100 / vis;
    slides.forEach(function (s) {
      s.style.minWidth = w + "%";
    });
    track.style.transform = "translateX(-" + cur * w + "%)";
    if (dotsEl) {
      dotsEl.querySelectorAll(".sdot").forEach(function (d, idx) {
        d.classList.toggle("on", idx === cur);
      });
    }
  }
  function buildDots() {
    if (!dotsEl) return;
    var vis = getVis();
    var count = slides.length - vis + 1;
    dotsEl.innerHTML = "";
    for (var i = 0; i < count; i++) {
      (function (idx) {
        var d = document.createElement("div");
        d.className = "sdot" + (idx === cur ? " on" : "");
        d.addEventListener("click", function () {
          goTo(idx);
          resetAuto();
        });
        dotsEl.appendChild(d);
      })(i);
    }
  }
  function next() {
    var vis = getVis();
    goTo(cur >= slides.length - vis ? 0 : cur + 1);
  }
  function prev() {
    var vis = getVis();
    goTo(cur <= 0 ? slides.length - vis : cur - 1);
  }
  function startAuto() {
    autoT = setInterval(next, 3500);
  }
  function resetAuto() {
    clearInterval(autoT);
    startAuto();
  }
  function initSlider() {
    buildDots();
    goTo(0);
    resetAuto();
  }
  initSlider();
  window.addEventListener("resize", initSlider);

  var slNext = document.getElementById("slNext");
  if (slNext) {
    slNext.addEventListener("click", function () {
      next();
      resetAuto();
    });
  }
  var slPrev = document.getElementById("slPrev");
  if (slPrev) {
    slPrev.addEventListener("click", function () {
      prev();
      resetAuto();
    });
  }

  var tx = 0;
  track.addEventListener("touchstart", function (e) {
    tx = e.touches[0].clientX;
  });
  track.addEventListener("touchend", function (e) {
    var d = tx - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) {
      d > 0 ? next() : prev();
      resetAuto();
    }
  });
}

document.querySelectorAll(".slide-photo").forEach(function (img) {
  if (img.complete && img.naturalWidth > 0) {
    img.classList.add("loaded");
  } else {
    img.addEventListener("load", function () {
      img.classList.add("loaded");
    });
  }
});

// ---- CHANGE 1: READ MORE / READ LESS — About section ----
function toggleAbout() {
  var extra = document.getElementById("aboutExtra");
  var btn = document.getElementById("readMoreBtn");
  var ellipsis = document.querySelector(".about-ellipsis");

  // Prevent errors if elements are not on the page
  if (!extra || !btn || !ellipsis) return;

  var isOpen = extra.classList.contains("open");

  if (isOpen) {
    extra.classList.remove("open");
    btn.textContent = "Read more ›";
    ellipsis.style.display = "inline";
  } else {
    extra.classList.add("open");
    btn.textContent = "Read less ‹";
    ellipsis.style.display = "none";
  }
}

// ---- IMAGE UPLOAD ----
var fileInput = document.getElementById("fileInput");
var uploadZone = document.getElementById("uploadZone");
var galGrid = document.getElementById("galGrid");

if (fileInput && uploadZone && galGrid) {
  fileInput.addEventListener("change", function (e) {
    handleFiles(e.target.files);
  });
  uploadZone.addEventListener("dragover", function (e) {
    e.preventDefault();
    uploadZone.classList.add("drag");
  });
  uploadZone.addEventListener("dragleave", function () {
    uploadZone.classList.remove("drag");
  });
  uploadZone.addEventListener("drop", function (e) {
    e.preventDefault();
    uploadZone.classList.remove("drag");
    handleFiles(e.dataTransfer.files);
  });
}

function handleFiles(files) {
  Array.from(files).forEach(function (f) {
    if (!f.type.startsWith("image/")) {
      showToast("⚠ " + f.name + " is not an image", "w");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      showToast("⚠ " + f.name + " exceeds 5MB", "w");
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      addItem(e.target.result, f.name);
    };
    reader.readAsDataURL(f);
  });
  fileInput.value = "";
}
function addItem(src, name) {
  var el = document.createElement("div");
  el.className = "gal-item";
  el.innerHTML =
    '<img src="' +
    src +
    '" alt="' +
    name +
    '"/><button class="gal-rm">✕</button>';
  el.querySelector(".gal-rm").addEventListener("click", function () {
    el.style.cssText = "opacity:0;transform:scale(.8);transition:all .3s";
    setTimeout(function () {
      el.remove();
    }, 300);
    showToast("🗑 Image removed", "i");
  });
  galGrid.appendChild(el);
  showToast("✅ Image uploaded!", "s");
}

// ---- TABS ----
var tabs = document.querySelectorAll(".tab");
var cForm = document.getElementById("cForm");
var fForm = document.getElementById("fForm");
tabs.forEach(function (t) {
  t.addEventListener("click", function () {
    tabs.forEach(function (x) {
      x.classList.remove("on");
    });
    t.classList.add("on");
    if (cForm) cForm.style.display = t.dataset.t === "c" ? "flex" : "none";
    if (fForm) fForm.style.display = t.dataset.t === "f" ? "flex" : "none";
  });
});

// ---- CONTACT FORM ----
if (cForm) {
  cForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var btn = document.getElementById("cSubmitBtn");
    var orig = btn.textContent;
    btn.textContent = "Sending…";
    btn.classList.add("btn-loading");

    var params = {
      from_name: document.getElementById("cName").value.trim(),
      from_email: document.getElementById("cEmail").value.trim(),
      subject:
        document.getElementById("cSubject").value.trim() || "ZeQue Contact",
      message: document.getElementById("cMessage").value.trim(),
      to_email: "mouli8467@gmail.com",
      form_type: "Contact Form",
    };

    if (typeof emailjs === "undefined") {
      showToast("⚠ EmailJS not loaded.", "w");
      btn.textContent = orig;
      btn.classList.remove("btn-loading");
      return;
    }
    emailjs
      .send(EJ_SERVICE_ID, EJ_TEMPLATE_ID, params)
      .then(function () {
        showToast("✅ Message sent! We'll reply within 24 hrs.", "s");
        cForm.reset();
      })
      .catch(function (err) {
        console.error("EmailJS:", err);
        showToast("⚠ Failed to send. Check your EmailJS config.", "w");
      })
      .finally(function () {
        btn.textContent = orig;
        btn.classList.remove("btn-loading");
      });
  });
}

// ---- FEEDBACK FORM ----
if (fForm) {
  fForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var btn = document.getElementById("fSubmitBtn");
    var orig = btn.textContent;
    btn.textContent = "Submitting…";
    btn.classList.add("btn-loading");

    var rating = document.querySelectorAll(".stars span.on").length;
    var params = {
      from_name: document.getElementById("fName").value.trim(),
      from_email: "feedback@zeque.in",
      subject: "ZeQue Feedback — " + document.getElementById("fService").value,
      message: document.getElementById("fMessage").value.trim(),
      to_email: "mouli8467@gmail.com",
      form_type: "Feedback Form",
      rating: rating ? rating + " / 5 ★" : "Not rated",
      service: document.getElementById("fService").value,
    };

    if (typeof emailjs === "undefined") {
      showToast("⚠ EmailJS not loaded.", "w");
      btn.textContent = orig;
      btn.classList.remove("btn-loading");
      return;
    }
    emailjs
      .send(EJ_SERVICE_ID, EJ_TEMPLATE_ID, params)
      .then(function () {
        showToast("🙏 Thank you for your feedback!", "s");
        fForm.reset();
        starVal = 0;
        document.querySelectorAll(".stars span").forEach(function (s) {
          s.classList.remove("on");
        });
      })
      .catch(function (err) {
        console.error("EmailJS:", err);
        showToast("⚠ Failed to submit. Check your EmailJS config.", "w");
      })
      .finally(function () {
        btn.textContent = orig;
        btn.classList.remove("btn-loading");
      });
  });
}

// ---- STAR RATING ----
var starVal = 0;
var starEls = document.querySelectorAll(".stars span");
starEls.forEach(function (s) {
  s.addEventListener("click", function () {
    starVal = parseInt(s.dataset.v);
    starEls.forEach(function (x) {
      x.classList.toggle("on", parseInt(x.dataset.v) <= starVal);
    });
  });
  s.addEventListener("mouseenter", function () {
    var v = parseInt(s.dataset.v);
    starEls.forEach(function (x) {
      x.classList.toggle("on", parseInt(x.dataset.v) <= v);
    });
  });
  s.addEventListener("mouseleave", function () {
    starEls.forEach(function (x) {
      x.classList.toggle("on", parseInt(x.dataset.v) <= starVal);
    });
  });
});

// ---- SCROLL REVEAL ----
function revealElements() {
  var rvEls = document.querySelectorAll(
    ".svc-card,.tcard,.vm-card,.av-card,.ci-item,.rv",
  );

  rvEls.forEach(function (el) {
    // For efficiency, skip elements that are already visible.
    if (el.classList.contains("show")) {
      return;
    }

    var rect = el.getBoundingClientRect();
    var isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
      el.classList.add("show");
    }
  });
}

// Reveal on page load
window.addEventListener("load", function () {
  revealElements();
});

// Reveal on scroll
window.addEventListener(
  "scroll",
  function () {
    revealElements();
  },
  { passive: true },
);

// ---- TOAST ----
function showToast(msg, type) {
  document.querySelectorAll(".toast").forEach(function (t) {
    t.remove();
  });
  var colors = {
    s: { bg: "#0a2e1a", border: "#00d4aa" },
    w: { bg: "#2e1a00", border: "#f0a500" },
    i: { bg: "#0a1a2e", border: "#38bdf8" },
  };
  var c = colors[type] || colors.s;
  var t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  t.style.background = c.bg;
  t.style.borderLeft = "4px solid " + c.border;
  document.body.appendChild(t);
  setTimeout(function () {
    t.style.transition = "all .3s";
    t.style.opacity = "0";
    t.style.transform = "translateY(8px)";
    setTimeout(function () {
      t.remove();
    }, 320);
  }, 3500);
}
