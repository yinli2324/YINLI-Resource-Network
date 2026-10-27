'use strict';
/* ═══════════════════════════════════════════════════════════════
   音黎资源网 · 官方下载站 v1
   零 CDN 依赖：时钟 / Canvas 星尘 / 跑马灯 / APK 拉取下载（含兜底）
   ═══════════════════════════════════════════════════════════════ */
(function () {

  /* ────────── 配置 ────────── */
  var APK_URL = 'https://github.com/yinli2324/YINLI-Resource-Network/releases/download/1.0.0/YINLI-ZYW.apk';
  var APK_NAME = '音黎资源网_音黎制作.apk';

  function $(s) { return document.querySelector(s); }
  function pad(n) { return String(n).padStart(2, '0'); }
  var WEEK = ['日', '一', '二', '三', '四', '五', '六'];
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ────────── Toast ────────── */
  function toast(msg, type) {
    var wrap = $('#toast-wrap'); if (!wrap) return;
    var t = document.createElement('div');
    t.className = 'toast' + (type === 'err' ? ' err' : '');
    t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(function () {
      t.style.transition = 'opacity .4s, transform .4s';
      t.style.opacity = '0'; t.style.transform = 'translateY(10px)';
      setTimeout(function () { t.remove(); }, 420);
    }, 2600);
  }

  /* ────────── 时钟（yyyy-MM-dd HH:mm:ss 星期X） ────────── */
  function tick() {
    var d = new Date();
    var el = $('#clock');
    if (el) el.textContent = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' +
      pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + ' 星期' + WEEK[d.getDay()];
  }

  /* ────────── Canvas 星尘背景（轻量，隐藏时停帧） ────────── */
  var cv = $('#fx-canvas'), ctx = cv ? cv.getContext('2d') : null, dots = [];
  function sizeCanvas() {
    if (!cv) return;
    cv.width = window.innerWidth; cv.height = window.innerHeight;
  }
  function initDots() {
    dots = [];
    for (var i = 0; i < 70; i++) {
      dots.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.7 + .4,
                  v: Math.random() * .0004 + .0001, a: Math.random() });
    }
  }
  function draw(t) {
    requestAnimationFrame(draw);
    if (!ctx || document.hidden || reduced) return;
    var w = cv.width, h = cv.height;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      d.y -= d.v; if (d.y < -0.02) d.y = 1.02;
      var al = .25 + .35 * Math.sin(t / 900 + d.a * 20);
      ctx.fillStyle = 'rgba(120,200,255,' + Math.max(0, al).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(d.x * w, d.y * h, d.r, 0, 6.283); ctx.fill();
    }
  }

  /* ────────── 跑马灯 ────────── */
  function initTicker() {
    var items = ['<b>FREE</b> 所有资源永久免费 · 拒绝任何形式的收费',
                 '<b>SAFE</b> 本页为唯一官方分发地址 · 谨防倒卖诈骗',
                 '<b>APK</b> 安装包未捆绑任何广告与插件',
                 '<b>REPORT</b> 发现以音黎资源网名义收费者 · 欢迎举报'];
    var half = items.map(function (s) { return '<span>' + s + '</span>'; }).join('<span style="opacity:.4">◆</span>');
    $('#ticker-track').innerHTML = half + '<span style="opacity:.4">◆</span>' + half;
  }

  /* ────────── 平台检测 ────────── */
  function initPlatHint() {
    var ua = navigator.userAgent || '';
    if (!/Android/i.test(ua)) { var el = $('#plat-hint'); if (el) el.hidden = false; }
  }

  /* ────────── 下载逻辑（按钮三态 + 锚点拉取 + 手动兜底） ────────── */
  var busy = false;
  function setState(s) {
    var b = $('#btn-dl'); if (!b) return;
    b.setAttribute('data-state', s);
    var txt = b.querySelector('.dl-txt');
    if (txt) txt.textContent = s === 'busy' ? '正在拉取安装包…' : (s === 'done' ? '下载已启动' : '下载音黎资源网');
  }
  function startDownload() {
    /* 动态锚点触发下载；cross-origin 下 download 属性被忽略时，
       浏览器仍会因 APK MIME 走下载流程而非跳转渲染 */
    var a = document.createElement('a');
    a.href = APK_URL;
    a.download = APK_NAME;
    a.rel = 'noopener';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  function initDownload() {
    var b = $('#btn-dl'); if (!b) return;
    b.addEventListener('click', function () {
      if (busy) return;
      busy = true;
      setState('busy');
      toast('正在连接官方分发节点…');
      setTimeout(function () {
        startDownload();
        setState('done');
        toast('下载任务已启动 · 请在通知栏或下载管理中查看');
        setTimeout(function () { setState('idle'); busy = false; }, 5000);
      }, 700);
    });
    var ml = $('#manual-link');
    if (ml) ml.addEventListener('click', function () { toast('已打开手动下载链接'); });
  }

  /* ────────── 启动 ────────── */
  function init() {
    tick(); setInterval(tick, 1000);
    sizeCanvas(); initDots(); requestAnimationFrame(draw);
    initTicker(); initPlatHint(); initDownload();
    var rT = 0;
    window.addEventListener('resize', function () {
      clearTimeout(rT); rT = setTimeout(sizeCanvas, 160);
    }, { passive: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
