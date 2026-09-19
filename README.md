# 江和美海洋公园 · 官网样板

纯静态官网样板（HTML/CSS/JS，无框架、无构建依赖）。设计由 `web-design-engineer` Agent Skill 约束。

## 快速预览

```bash
cd C:\Users\11\projects\aquarium-site
python build.py                 # 从模板生成 6 个页面
python -m http.server 8899      # 本地服务
# 浏览器打开 http://127.0.0.1:8899/index.html
```

## 目录结构

```
aquarium-site/
├── build.py              # 构建脚本：partials + pages → 根目录 HTML
├── partials/
│   ├── header.html       # 页头（导航）
│   └── footer.html       # 页脚
├── pages/                # 各页面 body 模板（改内容改这里）
│   ├── index.html        # 首页
│   ├── animals.html      # 动物与展区
│   ├── tickets.html      # 门票
│   ├── visit.html        # 游玩攻略
│   ├── news.html         # 活动公告
│   └── about.html        # 关于我们
├── css/style.css         # 设计系统 + 全部样式
├── js/main.js            # 交互（导航/滚动/FAQ/年份）
├── assets/
│   ├── fonts/            # 自托管 woff2 字体（离线可用）
│   └── img/              # 占位图（Unsplash，后期换实拍）
└── *.html                # build.py 生成的最终页面（勿手改，改 pages/）
```

## 改内容

- **改文案/结构**：编辑 `pages/*.html`，然后 `python build.py`。
- **改动物/展区/活动**：直接改对应 `pages/*.html` 里的卡片 HTML。
- **改配色/字体**：改 `css/style.css` 顶部 `:root` 变量。
- **换图**：替换 `assets/img/` 下同名文件即可（保持文件名不变）。

## 占位内容清单（上线前必须替换）

| 位置 | 占位内容 | 替换为 |
|------|---------|--------|
| 全站 | 地址"江和美路88号"、电话"0571-8888 6666"、邮箱 | 真实信息 |
| 首页/门票 | 票价 ¥158/¥98/¥268 等 | 真实票价 |
| 门票页 | OTA 平台按钮（抖音/美团/…） | 真实购票链接 |
| 攻略页 | 开放时间、交通方式 | 真实信息 |
| 活动页 | 示例活动 | 真实活动 |
| 全站 | 所有图片 | 实拍图 |
| 攻略页 | 地图占位块 | 高德/腾讯地图嵌入 |
| 页脚 | 公众号二维码占位 | 真实二维码 |

## 部署到 GitHub Pages（免备案、免费）

1. 建 GitHub 仓库（如 `jiangmei-ocean-park`）。
2. 上传本目录（`*.html`、`css/`、`js/`、`assets/`；`partials/`、`pages/`、`build.py` 可不传）。
3. 仓库 Settings → Pages → Source 选 `main` 分支根目录。
4. 访问 `https://<你的用户名>.github.io/jiangmei-ocean-park/`。

> 后续有域名后，在 Pages 设置里绑定即可。

## 设计系统（速查）

- **字体**：Noto Serif SC（标题，纪录片气质）+ Noto Sans SC（正文），自托管 woff2。
- **主色**：深海青 `#0a6e78` / 深海蓝 `#052633`；强调珊瑚橙 `#ff7a45`。
- **背景**：浅泡沫 `#f6faf9`；卡片白 `#fff`。
- **断点**：1024px（平板 2 列）/ 768px（手机单列 + 汉堡菜单）。
- **响应式**：已验证 375px 无横向溢出。

## 技术要点

- 无框架、无构建依赖，`build.py` 仅做模板拼装。
- 字体/图片全部自托管，不依赖任何 CDN（国内访问无墙）。
- `?shot=1` 参数：固定 hero 高度，便于全页截图验收。
