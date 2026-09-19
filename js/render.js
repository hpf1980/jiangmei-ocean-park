/* 江和美海洋公园 · 数据渲染脚本
   从 data/*.json 读取内容，填充各页面的挂载点。
   数据由 Decap CMS（/admin）编辑，保存后自动提交并重新部署。 */
(function () {
  "use strict";

  var DATA = {};
  var esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };

  function load(name) {
    return fetch("data/" + name + ".json", { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error(name + " " + r.status); return r.json(); });
  }

  /* ---------- 图标（与 style.css 内联 SVG 一致） ---------- */
  var ICON = {
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5"/></svg>',
    bus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="3" width="16" height="14" rx="3"/><path d="M4 11h16M8 21l1-4M16 21l-1-4"/><circle cx="8.5" cy="14.5" r="1"/><circle cx="15.5" cy="14.5" r="1"/></svg>',
    car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/><path d="M3 11h18v6H3z"/><circle cx="7.5" cy="19" r="1.5"/><circle cx="16.5" cy="19" r="1.5"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 5c0 8 7 15 15 15l2-4-4-2-2 2c-3-1.5-5.5-4-7-7l2-2-2-4z"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17l-6.1 3.6 1.4-6.8L2.2 9.1l6.9-.8z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>'
  };

  /* ---------- 首页 ---------- */
  function heroHTML(d) {
    var t = d.hero;
    var title = esc(t.title).replace(new RegExp(esc(t.highlight), "g"), "<em>" + esc(t.highlight) + "</em>");
    return '' +
      '<section class="hero">' +
      '  <div class="hero-bg" style="background-image:url(\'' + esc(t.image) + '\')"></div>' +
      '  <div class="hero-inner"><div class="container">' +
      '    <span class="hero-eyebrow">' + esc(t.eyebrow) + '</span>' +
      '    <h1>' + title + '</h1>' +
      '    <p class="hero-sub">' + esc(t.subtitle) + '</p>' +
      '    <div class="hero-meta">' +
      '      <span>' + ICON.clock + esc(t.hours) + '</span>' +
      '      <span>' + ICON.pin + esc(t.address) + '</span>' +
      '      <span>' + ICON.cal + esc(t.open) + '</span>' +
      '    </div>' +
      '    <div class="hero-cta">' +
      '      <a href="tickets.html" class="btn btn-coral">立即购票</a>' +
      '      <a href="animals.html" class="btn btn-ghost">探索展区</a>' +
      '    </div>' +
      '  </div></div>' +
      '</section>';
  }

  function noticeHTML(d) {
    var n = d.notice;
    return '<div class="notice-bar"><div class="container">' +
      '<span class="notice-tag">公告</span>' +
      '<span>' + esc(n.text) + '</span>' +
      '<a href="' + esc(n.link) + '">查看公告 →</a>' +
      '</div></div>';
  }

  function zonesHTML(d) {
    var zones = d.zones.filter(function (z) { return z.show_on_home; });
    var cards = zones.map(function (z, i) {
      var delay = i > 0 ? ' reveal-delay-' + i : '';
      return '<a href="animals.html#' + esc(z.anchor) + '" class="zone-card reveal' + delay + '">' +
        '<img src="' + esc(z.image) + '" alt="' + esc(z.name) + '展区" loading="lazy">' +
        '<div class="zone-info"><h3>' + esc(z.name) + '</h3>' +
        '<span class="zone-count">' + esc(z.count) + '</span></div></a>';
    }).join("\n      ");
    return '<section class="section"><div class="container">' +
      '<div class="section-head reveal"><span class="eyebrow">六大主题展区</span>' +
      '<h2>从浅海到深海，一路向下</h2>' +
      '<p>沿着 200 米环形参观动线，穿越珊瑚礁、热带浅海、极地、深海四大生态带，每一扇玻璃后都是一个完整的世界。</p></div>' +
      '<div class="zones-grid">\n      ' + cards + '\n    </div></div></section>';
  }

  function showsHTML(d) {
    var items = d.shows.map(function (s, i) {
      return '<div class="show-item reveal">' +
        '<span class="show-time">' + esc(s.time) + '</span>' +
        '<span class="show-name">' + esc(s.name) + '</span>' +
        '<span class="show-zone">' + esc(s.zone) + '</span></div>';
    }).join("\n      ");
    return '<section class="section shows-section"><div class="container">' +
      '<div class="section-head reveal"><span class="eyebrow">每日演出</span>' +
      '<h2>鲸豚剧场 · 每日四场</h2>' +
      '<p>实际演出时间以园区当日公告为准，节假日可能加场。</p></div>' +
      '<div class="shows-grid">\n      ' + items + '\n    </div>' +
      '<p class="shows-note">* 以当日园区公告为准</p></div></section>';
  }

  function ticketsHomeHTML(d) {
    var cards = d.tickets.home_cards.map(function (c, i) {
      var delay = i > 0 ? ' reveal-delay-' + i : '';
      var badge = c.featured ? '<span class="ticket-badge">最热门</span>' : '';
      var btn = c.featured ? 'btn-coral' : 'btn-ink';
      return '<div class="ticket-card' + (c.featured ? ' featured' : '') + ' reveal' + delay + '">' +
        badge +
        '<span class="ticket-type">' + esc(c.type) + '</span>' +
        '<div class="ticket-price"><small>¥</small>' + esc(c.price) + '</div>' +
        '<p class="ticket-desc">' + esc(c.desc) + '</p>' +
        '<a href="tickets.html" class="btn ' + btn + ' btn-sm">查看详情</a></div>';
    }).join("\n      ");
    var chips = d.tickets.ota.map(function (o) {
      return '<a class="ota-chip" href="tickets.html#ota">' + esc(o.name) + '</a>';
    }).join("\n      ");
    return '<section class="section"><div class="container">' +
      '<div class="section-head reveal"><span class="eyebrow">门票</span>' +
      '<h2>选一张票，出发</h2>' +
      '<p>门票通过抖音 / 美团 / 携程 / 同程 / 快手等 OTA 平台发售，到场扫码入园。</p></div>' +
      '<div class="tickets-grid">\n      ' + cards + '\n    </div>' +
      '<div class="ota-row reveal"><span class="ota-label">购票渠道</span>\n      ' + chips + '\n    </div></div></section>';
  }

  function paraText(p) { return (p && typeof p === "object") ? (p.text || "") : p; }

  function aboutPreviewHTML(d) {
    var a = d.about;
    var paras = a.paragraphs.slice(0, 2).map(function (p) { return '<p>' + esc(paraText(p)) + '</p>'; }).join("\n        ");
    return '<section class="section" style="padding-top:0"><div class="container">' +
      '<div class="about-split">' +
      '<div class="about-img reveal"><img src="' + esc(a.image) + '" alt="江和美海洋公园水族馆内景" loading="lazy"></div>' +
      '<div class="reveal reveal-delay-1">' +
      '<span class="eyebrow" style="display:inline-flex;align-items:center;gap:8px;font-size:.875rem;font-weight:700;letter-spacing:.18em;color:var(--aqua-deep);text-transform:uppercase;margin-bottom:16px;">关于江和美</span>' +
      '<h2>' + esc(a.title) + '</h2>' +
      paras +
      '<a href="about.html" class="btn btn-ink">了解更多</a>' +
      '</div></div></div></section>';
  }

  /* ---------- 动物页 ---------- */
  function animalsHTML(d) {
    var chips = d.zones.map(function (z, i) {
      return '<a class="zone-chip' + (i === 0 ? ' active' : '') + '" href="#' + esc(z.anchor) + '" data-target="' + esc(z.anchor) + '">' + esc(z.name) + '</a>';
    }).join("\n    ");
    var sections = d.zones.map(function (z) {
      var animals = d.animals.filter(function (a) { return a.zone === z.anchor; });
      var cards = animals.map(function (a, i) {
        var delay = i > 0 ? ' reveal-delay-' + i : '';
        var star = a.star ? ' <span class="star" title="明星动物">' + ICON.star + '</span>' : '';
        return '<article class="animal-card reveal' + delay + '">' +
          '<div class="animal-img"><img src="' + esc(a.image) + '" alt="' + esc(a.name) + '" loading="lazy"></div>' +
          '<div class="animal-body"><h3>' + esc(a.name) + star + '</h3>' +
          '<p class="en-name">' + esc(a.en) + '</p>' +
          '<p class="desc">' + esc(a.desc) + '</p></div></article>';
      }).join("\n      ");
      return '<section class="animal-zone" id="' + esc(z.anchor) + '"><div class="container">' +
        '<div class="animal-zone-head reveal"><h2>' + esc(z.name) + '</h2><span class="zone-en">' + esc(z.en) + '</span></div>' +
        '<div class="animal-grid">\n      ' + cards + '\n    </div></div></section>';
    }).join("\n");
    return '<div class="zone-chips"><div class="container">\n    ' + chips + '\n  </div></div>\n' + sections;
  }

  /* ---------- 门票页 ---------- */
  function priceTableHTML(d) {
    var rows = d.tickets.price_rows.map(function (r) {
      if (r.type === "免费") {
        return '<tr><td>' + esc(r.type) + '</td><td>' + esc(r.who) + '</td><td colspan="2">免费入园</td></tr>';
      }
      return '<tr><td>' + esc(r.type) + '</td><td>' + esc(r.who) + '</td><td>' + esc(r.list) + '</td>' +
        '<td><span class="price">' + esc(r.ota) + '</span><span class="tag">' + esc(r.save) + '</span></td></tr>';
    }).join("\n          ");
    return '<section class="section"><div class="container">' +
      '<div class="section-head reveal"><span class="eyebrow">价格一览</span>' +
      '<h2>全园通票 · 含全部展区与演出</h2></div>' +
      '<div class="price-table-wrap reveal"><table class="price-table"><thead>' +
      '<tr><th>票种</th><th>适用对象</th><th>门市价</th><th>OTA 参考价</th></tr></thead>' +
      '<tbody>\n          ' + rows + '\n        </tbody></table></div></div></section>';
  }

  function otaCardsHTML(d) {
    var cards = d.tickets.ota.map(function (o, i) {
      var delay = i > 0 ? ' reveal-delay-' + Math.min(i, 3) : '';
      return '<a class="ota-card reveal' + delay + '" href="#" aria-label="' + esc(o.name) + '购票">' +
        '<div class="ota-name">' + esc(o.name) + '</div>' +
        '<div class="ota-hint">' + esc(o.hint) + '</div></a>';
    }).join("\n      ");
    return '<section class="section" id="ota" style="padding-top:0"><div class="container">' +
      '<div class="section-head reveal"><span class="eyebrow">购票渠道</span>' +
      '<h2>五大平台，任选其一</h2>' +
      '<p>搜索“江和美海洋公园”即可购票，建议提前 1 日购买，节假日高峰时段建议提前 3 日。</p></div>' +
      '<div class="ota-cards">\n      ' + cards + '\n    </div></div></section>';
  }

  function ticketNoticeHTML(d) {
    var lis = d.tickets.notice.map(function (n) { return '<li>' + esc(paraText(n)) + '</li>'; }).join("\n      ");
    return '<section class="section" id="notice" style="padding-top:0"><div class="container">' +
      '<div class="section-head reveal"><span class="eyebrow">购票须知</span><h2>入园前请了解</h2></div>' +
      '<ul class="notice-list reveal">\n      ' + lis + '\n    </ul></div></section>';
  }

  /* ---------- 攻略页 ---------- */
  function hoursHTML(d) {
    var rows = d.hours.map(function (h) { return '<tr><td>' + esc(h.day) + '</td><td>' + esc(h.time) + '</td></tr>'; }).join("\n          ");
    var c = d.contact;
    return '<section class="section" id="hours"><div class="container">' +
      '<div class="section-head reveal"><span class="eyebrow">开放时间</span><h2>全年无休</h2></div>' +
      '<div class="info-grid">' +
      '<div class="info-card reveal"><h3>' + ICON.clock + ' 每日开闭馆时间</h3>' +
      '<table class="hours-table">\n          ' + rows + '\n        </table>' +
      '<p class="hours-note">* 以当日园区公告为准</p></div>' +
      '<div class="info-card reveal reveal-delay-1"><h3>' + ICON.pin + ' 园区地址</h3>' +
      '<div class="transport-item"><span class="t-label">地址</span><span class="t-text">' + esc(c.address) + '</span></div>' +
      '<div class="transport-item"><span class="t-label">电话</span><span class="t-text">' + esc(c.phone) + '（' + esc(c.phone_hours) + '）</span></div>' +
      '<div class="transport-item"><span class="t-label">邮箱</span><span class="t-text">' + esc(c.email) + '</span></div>' +
      '<div class="map-placeholder">' + ICON.map + ' 地图占位 · 上线时替换为高德 / 腾讯地图嵌入</div></div>' +
      '</div></div></section>';
  }

  function transportHTML(d) {
    var pub = d.transport.map(function (t) {
      return '<div class="transport-item"><span class="t-label">' + esc(t.label) + '</span><span class="t-text">' + esc(t.text) + '</span></div>';
    }).join("\n        ");
    var park = d.parking.map(function (t) {
      return '<div class="transport-item"><span class="t-label">' + esc(t.label) + '</span><span class="t-text">' + esc(t.text) + '</span></div>';
    }).join("\n        ");
    return '<section class="section" id="transport" style="padding-top:0"><div class="container">' +
      '<div class="section-head reveal"><span class="eyebrow">交通指南</span><h2>多种方式，轻松到达</h2></div>' +
      '<div class="info-grid">' +
      '<div class="info-card reveal"><h3>' + ICON.bus + ' 公共交通</h3>\n        ' + pub + '\n      </div>' +
      '<div class="info-card reveal reveal-delay-1"><h3>' + ICON.car + ' 自驾与停车</h3>\n        ' + park + '\n      </div>' +
      '</div></div></section>';
  }

  function facilityHTML(d) {
    var lis = d.facilities.map(function (f) { return '<li>' + esc(f.text) + '</li>'; }).join("\n        ");
    return '<section class="section" id="facility" style="padding-top:0"><div class="container">' +
      '<div class="section-head reveal"><span class="eyebrow">服务设施</span><h2>贴心服务，一应俱全</h2></div>' +
      '<div class="info-card reveal"><ul class="facility-list">\n        ' + lis + '\n      </ul></div></div></section>';
  }

  function faqHTML(d) {
    var items = d.faq.map(function (f) {
      return '<div class="faq-item reveal">' +
        '<button class="faq-q" aria-expanded="false">' + esc(f.q) + ICON.plus + '</button>' +
        '<div class="faq-a"><div class="faq-a-inner">' + esc(f.a) + '</div></div></div>';
    }).join("\n      ");
    return '<section class="section" id="faq" style="padding-top:0"><div class="container">' +
      '<div class="section-head reveal"><span class="eyebrow">常见问题</span><h2>你可能想问</h2></div>' +
      '<div class="faq-list">\n      ' + items + '\n    </div></div></section>';
  }

  /* ---------- 活动页 ---------- */
  function newsHTML(d) {
    var MONTHS = ["01月","02月","03月","04月","05月","06月","07月","08月","09月","10月","11月","12月"];
    var list = d.news && d.news.items ? d.news.items : (Array.isArray(d.news) ? d.news : []);
    var items = list.map(function (n) {
      var p = String(n.date).split("-");
      var year = p[0], day = p[2], month = MONTHS[parseInt(p[1], 10) - 1] || "";
      return '<article class="news-item reveal">' +
        '<div class="news-date"><span class="d-year">' + esc(year) + '</span>' +
        '<span class="d-day">' + esc(day) + '</span><span class="d-month">' + esc(month) + '</span></div>' +
        '<div><span class="news-tag">' + esc(n.tag) + '</span>' +
        '<h3>' + esc(n.title) + '</h3>' +
        '<p class="news-summary">' + esc(n.summary) + '</p></div></article>';
    }).join("\n      ");
    return '<section class="section"><div class="container">' +
      '<div class="news-list">\n      ' + items + '\n    </div></div></section>';
  }

  /* ---------- 关于页 ---------- */
  function storyHTML(d) {
    var paras = d.about.paragraphs.map(function (p) { return '<p>' + esc(paraText(p)) + '</p>'; }).join("\n      ");
    return '<section class="section"><div class="container">' +
      '<div class="story-block reveal">\n      ' + paras + '\n    </div></div></section>';
  }

  function statsHTML(d) {
    var items = d.stats.map(function (s) {
      return '<div class="show-item reveal"><span class="show-time">' + esc(s.value) + '</span>' +
        '<span class="show-name">' + esc(s.label) + '</span></div>';
    }).join("\n      ");
    return '<section class="section shows-section" style="padding-top:64px"><div class="container">' +
      '<div class="section-head reveal"><span class="eyebrow">园区数据</span><h2>用数字认识江和美</h2></div>' +
      '<div class="shows-grid">\n      ' + items + '\n    </div>' +
      '<p class="shows-note">* 占位数据</p></div></section>';
  }

  function contactHTML(d) {
    var c = d.contact;
    return '<section class="section"><div class="container">' +
      '<div class="section-head reveal"><span class="eyebrow">联系我们</span><h2>欢迎来电或到访</h2></div>' +
      '<div class="contact-grid">' +
      '<div class="contact-card reveal">' + ICON.pin + '<div class="c-label">园区地址</div><div class="c-value">' + esc(c.address) + '</div></div>' +
      '<div class="contact-card reveal reveal-delay-1">' + ICON.phone + '<div class="c-label">咨询电话</div><div class="c-value">' + esc(c.phone) + '</div></div>' +
      '<div class="contact-card reveal reveal-delay-2">' + ICON.mail + '<div class="c-label">商务合作</div><div class="c-value">' + esc(c.email) + '</div></div>' +
      '</div></div></section>';
  }

  /* ---------- 渲染后重新初始化交互（reveal / faq / chips） ---------- */
  function reinit(root) {
    // 滚动显现
    var reveals = root.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && reveals.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add("in"); });
    }
    // FAQ 手风琴
    root.querySelectorAll(".faq-item").forEach(function (item) {
      var btn = item.querySelector(".faq-q");
      var ans = item.querySelector(".faq-a");
      if (!btn || !ans) return;
      btn.addEventListener("click", function () {
        var open = item.classList.contains("open");
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
    // 动物页展区筛选
    var chips = root.querySelectorAll(".zone-chip");
    if (chips.length) {
      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          chips.forEach(function (c) { c.classList.remove("active"); });
          chip.classList.add("active");
          var target = chip.getAttribute("data-target");
          if (target) {
            var el = document.getElementById(target);
            if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 140, behavior: "smooth" });
          }
        });
      });
    }
  }

  function inject(id, html) {
    var el = document.getElementById(id);
    if (el) { el.innerHTML = html; }
  }

  function render() {
    var page = document.body.getAttribute("data-page");
    var d = DATA;
    switch (page) {
      case "index":
        inject("mount-hero", heroHTML(d));
        inject("mount-notice", noticeHTML(d));
        inject("mount-zones", zonesHTML(d));
        inject("mount-shows", showsHTML(d));
        inject("mount-tickets", ticketsHomeHTML(d));
        inject("mount-about", aboutPreviewHTML(d));
        break;
      case "animals":
        inject("mount-animals", animalsHTML(d));
        break;
      case "tickets":
        inject("mount-price", priceTableHTML(d));
        inject("mount-ota", otaCardsHTML(d));
        inject("mount-ticket-notice", ticketNoticeHTML(d));
        break;
      case "visit":
        inject("mount-hours", hoursHTML(d));
        inject("mount-transport", transportHTML(d));
        inject("mount-facility", facilityHTML(d));
        inject("mount-faq", faqHTML(d));
        break;
      case "news":
        inject("mount-news", newsHTML(d));
        break;
      case "about":
        inject("mount-story", storyHTML(d));
        inject("mount-stats", statsHTML(d));
        inject("mount-contact", contactHTML(d));
        break;
    }
    reinit(document.body);
  }

  function init() {
    Promise.all([
      load("site"), load("zones"), load("animals"),
      load("tickets"), load("news"), load("shows"), load("faq")
    ]).then(function (res) {
      DATA = { site: res[0], zones: res[1], animals: res[2], tickets: res[3], news: res[4], shows: res[5], faq: res[6] };
      // 把 site 的字段平铺到顶层便于各函数使用
      var s = DATA.site;
      DATA.hero = s.hero; DATA.notice = s.notice; DATA.contact = s.contact;
      DATA.hours = s.hours; DATA.transport = s.transport; DATA.parking = s.parking;
      DATA.facilities = s.facilities; DATA.about = s.about; DATA.stats = s.stats;
      render();
      // 截图模式（?shot=1 时固定 hero 高度，便于全页截图）
      if (/[?&]shot=1/.test(location.search)) {
        var hero = document.querySelector(".hero");
        if (hero) {
          hero.style.minHeight = "760px";
          hero.style.height = "760px";
          hero.style.maxHeight = "760px";
        }
      }
    }).catch(function (err) {
      console.error("[render] 数据加载失败:", err);
      var m = document.querySelector("main");
      if (m) {
        var d = document.createElement("div");
        d.style.cssText = "padding:80px 24px;text-align:center;color:#c0392b;font-family:sans-serif";
        d.textContent = "内容加载失败（" + err.message + "），请检查网络后刷新。";
        m.insertBefore(d, m.firstChild);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
