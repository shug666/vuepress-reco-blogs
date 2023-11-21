---
title: 跳转Activity：taskAffinity和Intent FLAG探究 
date: 2023-04-12
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## taskAffinity

> 每个Activity都有taskAffinity属性，这个属性指出了它希望进入的Task。

android:taskAffinity="" ，在AndoridManifest.xml文件中作为Activity的属性使用。

**先检查包名是否相同，然后检查taskAffinity是否相同，如果都相同，intent的flag设置为flag\_activity\_new\_task的activity与启动它的activity入同一个栈，否则建立新的task然后入栈。**

Task
----

Task就是一个任务栈，里面用来存放Activity，第一个进去的（Activity）处于栈的最下面，而最后创建的（Activity）则处于栈的最上面。从Task中取出（Activity）是从最顶端取出，也就是说先进后出，后进先出。而Activity在Task中的顺序是可以控制的，在Activity跳转时用到Intent Flag可以设置新建Activity的创建方式。

Activity Intent FLAG
--------------------

*   **FLAG\_ACTIVITY\_NEW\_TASK**
    
    先检查包名是否相同，然后检查taskAffinity是否相同，如果都相同，intent的flag设置为flag\_activity\_new\_task的activity与启动它的activity入同一个栈，否则建立新的task然后入栈。
    
*   **FLAG\_ACTIVITY\_CLEAR\_TASK**
    
    会导致含有待启动Activity的Task在Activity被启动前清空。也就是说，这个Activity会成为一个新的root，并且所有旧的activity都被finish掉。这个标志只能与FLAG\_ACTIVITY\_NEW\_TASK 一起使用。
    
*   **FLAG\_ACTIVITY\_SINGLE\_TOP**
    
    相当于LaunchMode中的SingleTop模式
    
*   **FLAG\_ACTIVITY\_CLEAR\_TOP**
    
    相当于LaunchMode中的SingleTask模式
    
*   **FLAG\_ACTIVITY\_NO\_HISTORY**
    
    使用这个FLAG启动的Activity一但退出，就不会存在于栈中。（即，不存在历史记录）
    
*   **FLAG\_ACTIVITY\_NO\_USER\_ACTION**
    
    使用这个FLAG启动的Activity，可以在避免用户离开当前Activity时回调到 onUserLeaveHint()。
    
*   **FLAG\_ACTIVITY\_BROUGHT\_TO\_FRONT**
    
    task中顺序ABC时，由C启动B并设置intent FLAG为此，则顺序变为ACB。

拓展
--

**onUserLeaveHint()：**

作为Activity的生命周期回调的部分，会在用户决定将Acitivity放到后台时被调用。例如：当用户按下Home键，onUserLeaveHint就会被调用。但是当来电话时，来电界面会自动弹出，onUserLeaveHint就不会被调用。当该方法被调用时，他会恰好在onPause调用之前。

  

本文转自 [http://events.jianshu.io/p/6c449ca2499a](http://events.jianshu.io/p/6c449ca2499a)，如有侵权，请联系删除。