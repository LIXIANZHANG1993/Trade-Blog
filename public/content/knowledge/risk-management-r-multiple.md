---
slug: risk-management-r-multiple
title: 用 R-Multiple 管理交易績效
summary: 以風險單位 R 衡量每筆交易，讓不同市場與策略可比較。
publishedAt: 2026-01-20
tags: risk-control, statistics
category: 風險管理
difficulty: beginner
references: Van K. Tharp, Trading Journal Notes
---
## 為什麼用 R
R-Multiple 把每筆交易轉成相同尺度，避免只看金額造成誤判。

## 實作方式
先定義 1R（每筆最大可承受風險），再記錄每筆最終結果是 +2R、-1R 或 0R。

## 常見錯誤
在沒有固定停損的狀況下計算 R，會使數據失真。
