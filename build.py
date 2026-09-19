#!/usr/bin/env python3
"""江和美海洋公园官网样板 — 静态构建脚本
读取 partials/header.html + pages/*.html + partials/footer.html，
拼装完整 HTML 输出到站点根目录。
用法: python build.py
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
PARTIALS = os.path.join(ROOT, "partials")
PAGES = os.path.join(ROOT, "pages")

# 页面元信息: 文件名 -> (title, description)
META = {
    "index.html": ("江和美海洋公园 · 杭州城市海洋馆", "杭州江和美海洋公园官网：六大主题展区、300+海洋物种、每日演出、门票与游玩攻略。"),
    "animals.html": ("动物与展区 · 江和美海洋公园", "珊瑚秘境、热带浅海、极地冰川、深海奇境、鲸豚剧场、触摸池——六大展区300+海洋物种。"),
    "tickets.html": ("门票价格 · 江和美海洋公园", "江和美海洋公园门票：成人票、儿童票、亲子票、家庭票，抖音/美团/携程/同程/快手五大OTA平台购票。"),
    "visit.html": ("游玩攻略 · 江和美海洋公园", "江和美海洋公园游玩攻略：开放时间、交通指南、服务设施、常见问题。"),
    "news.html": ("活动公告 · 江和美海洋公园", "江和美海洋公园最新活动与园区公告：节日活动、科普研学、演出更新。"),
    "about.html": ("关于我们 · 江和美海洋公园", "江和美海洋公园：12000㎡城市海洋馆，集观赏、科普、研学、亲子娱乐于一体。"),
}

def read(p):
    with open(p, "r", encoding="utf-8") as f:
        return f.read().strip()

def build():
    header = read(os.path.join(PARTIALS, "header.html"))
    footer = read(os.path.join(PARTIALS, "footer.html"))

    for fname, (title, desc) in META.items():
        body = read(os.path.join(PAGES, fname))
        html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='23' fill='%230a3d52'/%3E%3Cpath d='M8 30c4-1.5 7-1 10 1s6 2.5 10 0 7-3 12-1' stroke='%232ec4b6' stroke-width='2.4' stroke-linecap='round' fill='none'/%3E%3Cpath d='M30 14c3 0 5.5 2 6.5 5-2 .8-4 .8-6 0-1.4-1.8-2.4-3.6-3-5 1-.2 2-.2 2.5 0z' fill='%23ff7b54'/%3E%3C/svg%3E">
<link rel="stylesheet" href="css/style.css">
</head>
<body data-page="{fname.split('.')[0]}">
{header}
<main>
{body}
</main>
{footer}
<script src="js/main.js" defer></script>
<script src="js/render.js" defer></script>
</body>
</html>
"""
        out = os.path.join(ROOT, fname)
        with open(out, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"  built {fname} ({len(html)} bytes)")

    print(f"\nDone. {len(META)} pages built to {ROOT}")

if __name__ == "__main__":
    build()
