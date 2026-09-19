/* 江和美海洋公园 · 官网样板 — 交互脚本 */
(function () {
  "use strict";

  /* ---------- 页头滚动状态 ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 移动端菜单 ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- 当前导航高亮 ---------- */
  var page = document.body.getAttribute("data-page");
  if (page) {
    document.querySelectorAll(".nav a[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === page) a.classList.add("active");
    });
  }

  /* ---------- 滚动显现 ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- FAQ 手风琴 ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    var ans = item.querySelector(".faq-a");
    if (!btn || !ans) return;
    btn.addEventListener("click", function () {
      var open = item.classList.contains("open");
      // 关闭同组其他项
      item.parentElement.querySelectorAll(".faq-item.open").forEach(function (o) {
        if (o !== item) {
          o.classList.remove("open");
          o.querySelector(".faq-a").style.maxHeight = "0px";
          o.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        }
      });
      item.classList.toggle("open", !open);
      btn.setAttribute("aria-expanded", String(!open));
      ans.style.maxHeight = open ? "0px" : ans.scrollHeight + "px";
    });
  });

  /* ---------- 动物页：展区筛选 ---------- */
  var chips = document.querySelectorAll(".zone-chip");
  if (chips.length) {
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        var target = chip.getAttribute("data-target");
        if (target) {
          var el = document.getElementById(target);
          if (el) {
            var top = el.getBoundingClientRect().top + window.scrollY - 140;
            window.scrollTo({ top: top, behavior: "smooth" });
          }
        }
      });
    });
  }

  /* ---------- 年份 ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

})();
