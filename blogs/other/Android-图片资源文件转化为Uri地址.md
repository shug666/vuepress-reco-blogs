---
title: Android 图片资源文件转化为Uri地址
date: 2023-04-04
tags:
 - android
categories: 
 - android
sticky: 
   true
---

```java
    private Uri getDrawableUri(@DrawableRes int resId){
        Resources resources = getResources();
        return Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + 
        resources.getResourcePackageName(resId) + '/' + 
        resources.getResourceTypeName(resId) + '/' + 
        resources.getResourceEntryName(resId) );
    }
```

 

  

本文转自 [https://blog.csdn.net/u011106915/article/details/121359900](https://blog.csdn.net/u011106915/article/details/121359900)，如有侵权，请联系删除。