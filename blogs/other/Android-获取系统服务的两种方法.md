---
title: Android 获取系统服务的两种方法
date: 2023-07-12
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 1.通过Context获取代理对象

获取DreamManager对象的这两种方式有以下区别:1. 通过Context获取的是DreamManager的代理对象

```java
DreamManager dreamManager = mApplication.getSystemService(DreamManager.class);
```

这种方式是通过Context的getSystemService()获取DreamManager。由于DreamManager本身是一个接口,Context返回的是其代理对象StubDreamManager,用于跨进程调用真正的DreamManager服务。

## 2. 通过ServiceManager获取的是AIDL接口对象

```java
IDreamManager iDreamManager = IDreamManager.Stub.asInterface(ServiceManager.getService(DreamService.DREAM_SERVICE));
```

这种方式是通过ServiceManager直接获取DreamService的Binder接口对象。IDreamManager.Stub是DreamService的AIDL接口,asInterface()可以将Binder对象转成接口对象。

## 3.两种方式的区别

第一种方式获取的是本地代理,可以直接调用接口方法。第二种方式获取的是远程接口,需要跨进程调用。

 第一种方式依赖Context,需要先获取Context。第二种方式直接通过ServiceManager获取Binder接口。

一般来说,在客户端通过Context获取DreamManager较为常见。在服务端获取DreamService接口则更灵活。所以这两种方式获取的对象不同,适合的使用场景也不同,一般取决于是否需要跨进程和是否有Context。 