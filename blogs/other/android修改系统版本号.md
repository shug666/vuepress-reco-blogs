---
title: 修改系统版本号
date: 2024-07-19
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 问题：

客户有版本号的要求，在设置-关于手机-版本号里面。要就更改为客户定制的版本号字样。

### 代码地址：

需要修改的关键文件是`buildinfo.sh`

路径：`~/aosp/build/tools/buildinfo.sh` 

或者`aosp/build/make/core/**.mk`，需要注意的是：修改`build/make/core`路径下的文件内容，对应`build/core`的内容会同步修改

(有些厂商可能没有配置此文件)`aosp/device/mediateksample/XXXX/buildinfo_custom.sh` 文件里面的 `ro.vendor.software.version`

### 具体代码：

```bash
buildinfo.sh

echo "ro.build.display.id=string_`date+'%y%m%d'`_string"
```

本文转自 [https://blog.csdn.net/m0\_66587877/article/details/132022445](https://blog.csdn.net/m0_66587877/article/details/132022445)，如有侵权，请联系删除。