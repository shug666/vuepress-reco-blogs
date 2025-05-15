---
title: SystemUI的ShadeLogger|LogBuffer日志动态控制输出
date: 2025-03-04
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 背景：

看SystemUI的锁屏相关代码时候发现SystemUI有一个日志打印相关的方法调用，相比于常规的`Log.i`直接可以logcat查看方式还是比较新颖。

具体日志打印代码如下：  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesec8dff5381d7446eb0d8d47590a0d7ad.png)  

下面就来介绍一下这个ShadeLogger到底是如何打印的。

## 分析源码：

源码位置：  

`frameworks/base/packages/SystemUI/src/com/android/systemui/shade/ShadeLogger.kt`

明显是一个kt类，这里就只拿一个logEndMotionEvent方法来进行源码分析

```kotlin
fun logEndMotionEvent(
    msg: String,
    forceCancel: Boolean,
    expand: Boolean,
)
{
    buffer.log(
        TAG,
        LogLevel.VERBOSE,
        {
            str1 = msg
            bool1 = forceCancel
            bool2 = expand
        },
        { "$str1; force=$bool1; expand=$bool2" }
    )
}
```

可以看到这里看到实际是调用的buffer.log方法，也有对应TAG和LogLevel等级。  

那么下面来看看这个buffer.log中的buffer哪里来的，但是因为这构造都是采用了很多注解drag2方式，所以不方便找，这里找到了一个NotificationPanelViewControllerBaseTest一个测试类有手动进行构造，这里也可以看出相关过程

`frameworks/base/packages/SystemUI/tests/src/com/android/systemui/shade/NotificationPanelViewControllerBaseTest.java`

具体过程如下：  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesdc2fcc9eb52f4d2582b907661faff28d.png)  

再看看mShadeLog构造  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesa01d2e2e49e2406ab2ef4bae98148919.png)

再看看logcatLogBuffer方法  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images8ff6806b307e4c95ab03367aef6a0bba.png)

这里调用到了LogBuffer类,注意这里test类给的是50，实际的Shader类给的是500  

frameworks/base/packages/SystemUI/log/src/com/android/systemui/log/LogBuffer.kt  

看看log方法：

```kotlin
inline fun log(
    tag: String,
    level: LogLevel,
    messageInitializer: MessageInitializer,
    noinline messagePrinter: MessagePrinter,
    exception: Throwable? = null,
) {
    val message = obtain(tag, level, messagePrinter, exception)
    messageInitializer(message)
    commit(message)
}
```

看看obtain方法：

```kotlin
@Synchronized
    override fun obtain(
        tag: String,
        level: LogLevel,
        messagePrinter: MessagePrinter,
        exception: Throwable?,
    ): LogMessage {
        if (!mutable) {
            return FROZEN_MESSAGE
        }
        val message = buffer.advance()//可以看到这里是buffer中获取，
        message.reset(tag, level, System.currentTimeMillis(), messagePrinter, exception)
        return message
    }
```

这里其实只是看出来了buffer中搞出了一个message，根据传递来的tag和msg  
接下来重点看看commit方法

```kotlin
override fun commit(message: LogMessage) {
    if (echoMessageQueue != null && echoMessageQueue.remainingCapacity() > 0) {
        try {
            echoMessageQueue.put(message)//主要就是放入队列
        } catch (e: InterruptedException) {
            // the background thread has been shut down, so just log on this one
            echoToDesiredEndpoints(message)
        }
    } else {
        echoToDesiredEndpoints(message)
    }
}
```

commit主要就是实现对message放入到echoMessageQueue，那么什么时候取这个队列呢？

这里要看最开始的init方法中有启动一个线程

```kotlin
init {
    if (logcatEchoTracker.logInBackgroundThread && echoMessageQueue != null) {
        thread(start = true, name = "LogBuffer-$name", priority = Thread.NORM_PRIORITY) {
            try {
                while (true) {//死循环的取出队列
                    echoToDesiredEndpoints(echoMessageQueue.take())//调用echoToDesiredEndpoints来处理消息
                }
            } catch (e: InterruptedException) {
                Thread.currentThread().interrupt()
            }
        }
    }
}
```

具体echoToDesiredEndpoints方法如下：

```kotlin
 private fun echoToDesiredEndpoints(message: LogMessage) {
 //获取log打印level，即其实可以通过命令来控制打印level，这里的level本质是来自settings，具体啥settings值下面操作时候会讲解
        val includeInLogcat =
            logcatEchoTracker.isBufferLoggable(name, message.level) ||
                logcatEchoTracker.isTagLoggable(message.tag, message.level)
        echo(message, toLogcat = includeInLogcat, toSystrace = systrace)//有了上面level后，echo开始处理
    }
   private fun echo(message: LogMessage, toLogcat: Boolean, toSystrace: Boolean) {
        if (toLogcat || toSystrace) {
            val strMessage = message.messagePrinter(message)
            if (toSystrace) {
                echoToSystrace(message, strMessage)//可以看这个日志还支持systrace相关
            }
            if (toLogcat) {
                echoToLogcat(message, strMessage)//这里就是最普通的logcat打印出来
            }
        }
    }
//具体的echoToLogcat其实就是根据传递进来的等级进行普通log打印
  private fun echoToLogcat(message: LogMessage, strMessage: String) {
        when (message.level) {
            LogLevel.VERBOSE -> Log.v(message.tag, strMessage, message.exception)
            LogLevel.DEBUG -> Log.d(message.tag, strMessage, message.exception)
            LogLevel.INFO -> Log.i(message.tag, strMessage, message.exception)
            LogLevel.WARNING -> Log.w(message.tag, strMessage, message.exception)
            LogLevel.ERROR -> Log.e(message.tag, strMessage, message.exception)
            LogLevel.WTF -> Log.wtf(message.tag, strMessage, message.exception)
        }
    }
```

到此LogBuffer源码也就大概分析完成，可以得出以下几个结论：

1、所有的埋点日志会保存到buffer中，这个buffer只是在内存中的一个环形buffer，有固定大小

2、buffer中的日志是可以 实现输出到logcat和systrace的功能

那么具体如何控制输出到logcat，还有如何看buffer中的日志呢？接下来看看使用方法

## 使用方式：

在类的最开始部分有如下的使用注释：

```java
/**
 * A simple ring buffer of recyclable log messages
 *
 * The goal of this class is to enable logging that is both extremely chatty and extremely
 * lightweight. If done properly, logging a message will not result in any heap allocations or
 * string generation. Messages are only converted to strings if the log is actually dumped (usually
 * as the result of taking a bug report).
 *
 * You can dump the entire buffer at any time by running:
 * ```
 * $ adb shell dumpsys activity service com.android.systemui/.SystemUIService <bufferName>
 * ```
 *
 * ...where `bufferName` is the (case-sensitive) [name] passed to the constructor.
 *
 * By default, only messages of WARN level or higher are echoed to logcat, but this can be adjusted
 * locally (usually for debugging purposes).
 *
 * To enable logcat echoing for an entire buffer:
 * ```
 * $ adb shell settings put global systemui/buffer/<bufferName> <level>
 * ```
 *
 * To enable logcat echoing for a specific tag:
 * ```
 * $ adb shell settings put global systemui/tag/<tag> <level>
 * ```
 *
 * In either case, `level` can be any of `verbose`, `debug`, `info`, `warn`, `error`, `assert`, or
 * the first letter of any of the previous.
 *
 * In SystemUI, buffers are provided by LogModule. Instances should be created using a SysUI
 * LogBufferFactory.
 *
 * @param name The name of this buffer, printed when the buffer is dumped and in some other
 *   situations.
 * @param maxSize The maximum number of messages to keep in memory at any one time. Buffers start
 *   out empty and grow up to [maxSize] as new messages are logged. Once the buffer's size reaches
 *   the maximum, it behaves like a ring buffer.
 */
```

其实上面已经写的很详细了，主要就是2个核心点，一个可以通过dumpsys看所有日志，一个是可以控制logcat输出

控制dumpsys查看方法

```shell
$ adb shell dumpsys activity service com.android.systemui/.SystemUIService <bufferName>
```

比如这里的对ShadeLog

```shell
$ adb shell dumpsys activity service com.android.systemui/.SystemUIService ShadeLog
```

dumpsys后可以查看到相关的Log：  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesfdb02083afd141ec8ef30861bcaf6b41.png)  
看到这个dump日志就感觉非常详细的记录了Shade锁屏相关的操作，相关的tag等也是在ShadeLogger.kt定义的  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesffe01336befa4c08a5633bfcc1b528ae.png)

如果想要普通logcat输出呢？

```shell
$ adb shell settings put global systemui/tag/ShadeLog v
```

这里其实就是配置一个settings，然后上面的提到的echoToDesiredEndpoints的 logcatEchoTracker.isBufferLoggable就会去查询这个settings值。  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images66b52f250a454a39b5745f8385355cd3.png)

## 总结图

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images3bb7b3e522d842b6a920a4e5cd111bd7.png)

  

本文转自 [https://blog.csdn.net/liaosongmao1/article/details/143355879](https://blog.csdn.net/liaosongmao1/article/details/143355879)，如有侵权，请联系删除。