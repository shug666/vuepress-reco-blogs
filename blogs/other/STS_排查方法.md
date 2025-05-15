---
title: STS 排查方法
date: 2024-05-31
tags:
 - android
categories: 
 - android
sticky: 
   true
---



## Android STS 排查方法

常见的fail项 分为如下2种：  

测试项中 _**不包含CVE**_ 的 和 _**包含CVE**_ 的

## 不包含CVE

1、android.security.sts.Bug\_258188673#testPocBug\_258188673  

这就是不包含CVE的，直接显示为 testPocBug\_258188673

_**如果测试用例名称不包含CVE-ID，谷歌搜索“Android A-258188673”**_  

## 包含CVE

2、android.security.cts.CVE\_2021\_0487#testPocCVE\_2021\_0487  

这就是包含CVE的，直接显示为 testPocCVE\_2021\_0487

**如果测试用例名称包含 CVE-ID，则只需将“下划线”替换为“破折号”即可。** 即 _**CVE-2021-0487**_



本文转自 [https://blog.csdn.net/qq\_45412462/article/details/131260941?spm=1001.2101.3001.6650.1&utm\_medium=distribute.pc\_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-131260941-blog-83965281.235%5Ev43%5Epc\_blog\_bottom\_relevance\_base5&depth\_1-utm\_source=distribute.pc\_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-131260941-blog-83965281.235%5Ev43%5Epc\_blog\_bottom\_relevance\_base5&utm\_relevant\_index=2](https://blog.csdn.net/qq_45412462/article/details/131260941?spm=1001.2101.3001.6650.1&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-131260941-blog-83965281.235%5Ev43%5Epc_blog_bottom_relevance_base5&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-131260941-blog-83965281.235%5Ev43%5Epc_blog_bottom_relevance_base5&utm_relevant_index=2)，如有侵权，请联系删除。