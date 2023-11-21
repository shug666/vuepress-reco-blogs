---
title: Android recovery log日志的生成
date: 2023-08-16
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## recovery.log 的生成

        我们在调试recovery升级的时候，我们经常需要查看recovery的log，[google](https://www.baidu.com/s?wd=google&tn=24004469_oem_dg&rsv_dl=gh_pl_sl_csd)的原始逻辑中，recovery的log并非直接输出到串口，我们需要输入命令才能获取，我们有三种方式：

    第一种：recovery下，[遥控器](https://www.baidu.com/s?wd=%E9%81%A5%E6%8E%A7%E5%99%A8&tn=24004469_oem_dg&rsv_dl=gh_pl_sl_csd)选择 view recovery logs，[界面](https://www.baidu.com/s?wd=%E7%95%8C%E9%9D%A2&tn=24004469_oem_dg&rsv_dl=gh_pl_sl_csd)上查看。

    第二种：recovery下，输入命令，cat /tmp/recovery.log

    第三种：android下，输入命令，cat  /cache/recovery/last\_log 可能会有多个，命名方式： last\_log.1 , last\_log.2 , last\_log.3 等

    有时候我们需要把recovery的log直接输出到**终端串口**，则我们需要修改下recovery的代码即可，下面以android L（5.1）版本的代码修改说明下：

bootable/recovery/recovery.cpp

```cpp
static const char *TEMPORARY_LOG_FILE = "/tmp/recovery.log";
static void redirect_stdio(const char* filename) {
    // If these fail, there's not really anywhere to complain...
    freopen(filename, "a", stdout); setbuf(stdout, NULL);
    freopen(filename, "a", stderr); setbuf(stderr, NULL);
}
 
Int main(int argc, char **argv) {
    time_t start = time(NULL);
   **redirect_stdio**(TEMPORARY_LOG_FILE);
}
```
我们只需要把redirect\_stdio函数的参数，有”/tmp/recovery.log”修改为”/dev/console”即可。redirect\_stdio(”/dev/console”); 不同的平台可能有所不一样，可以先这样验证，echo “111111111” > /dev/console，检验下是否能够把打印正常输出到串口。

  

本文转自 [https://blog.csdn.net/yush34/article/details/106645219](https://blog.csdn.net/yush34/article/details/106645219)，如有侵权，请联系删除。