---
title: Android12 AndroidManifest使用uses-library编译报错解决
date: 2023-02-24
tags:
 - android
categories: 
 - android
sticky: 
   true
---

问题详情
====

        在SDK环境上将AndroidQ的Email应用搬到AndroidS上使用，使用mm命令进行编译毫无问题，可以正常生产apk，然后就自信满满提交了补丁。但是其他同事更新代码后整体编译，就报了以下的错误：

```
[ 91% 1133/1239] Verifying uses-libraries: out/target/common/obj/APPS/Email_intermediates/manifest/AndroidManifest.xml
FAILED: out/target/common/obj/APPS/Email_intermediates/enforce_uses_libraries.status
/bin/bash -c "(rm -f out/target/common/obj/APPS/Email_intermediates/enforce_uses_libraries.status ) && (build/soong/scripts/manifest_check.py     --enforce-uses-libraries        --enforce-uses-libraries-status out/target/common/obj/APPS/Email_intermediates/enforce_uses_libraries.status       --aapt out/host/linux-x86/bin/aapt                                 out/target/common/obj/APPS/Email_intermediates/manifest/AndroidManifest.xml )"
error: mismatch in the <uses-library> tags between the build system and the manifest:
        - required libraries in build system: []
                         vs. in the manifest: [org.apache.http.legacy]
        - optional libraries in build system: []
                         vs. in the manifest: []
        - tags in the manifest (out/target/common/obj/APPS/Email_intermediates/manifest/AndroidManifest.xml):
                <uses-library android:name="org.apache.http.legacy" android:required="true"/>

note: the following options are available:
        - to temporarily disable the check on command line, rebuild with RELAX_USES_LIBRARY_CHECK=true (this will set compiler filter "verify" and disable AOT-compilation in dexpreopt)
        - to temporarily disable the check for the whole product, set PRODUCT_BROKEN_VERIFY_USES_LIBRARIES := true in the product makefiles
        - to fix the check, make build system properties coherent with the manifest
        - see build/make/Changes.md for details
```

        报错信息是执行manifest\_check.py发现，声明请求使用的libraries跟AndroidManifest.xml中声明的不一致，导致的报错。

解决方法
====

        <!--1.如manifest\_check.py中报错信息的提示，方案中配置RELAX\_USES\_LIBRARY\_CHECK=true或者PRODUCT\_BROKEN\_VERIFY\_USES\_LIBRARIES := true  (无效)-->

        2.令LOCAL\_ENFORCE\_USES\_LIBRARIES的值为false，如在Android.mk/Android.bp中设置：

```sh
mk:     LOCAL_ENFORCE_USES_LIBRARIES := false
bp:     enforce_uses_libs: false
```

        或者LOCAL\_MODULE\_TAGS设置为tests，LOCAL\_COMPATIBILITY\_SUITE设置为非空。方案中设置WITH\_DEXPREOPT为true等等，具体参考build/make/core/dex\_preopt\_odex\_install.mk

        3.正确设置LOCAL\_USES\_LIBRARIES的值。

  

本文转自 [https://blog.csdn.net/zcyxiaxi/article/details/121555788](https://blog.csdn.net/zcyxiaxi/article/details/121555788)，如有侵权，请联系删除。