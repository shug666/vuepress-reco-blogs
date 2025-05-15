---
title: IdleHandler原理以及延迟初始化方案实现
date: 2024-06-21
tags:
 - android
categories: 
 - android
sticky: 
   true
---

很多人在Android项目中都会遇到希望一些操作延迟一点处理，一般会使用Handler.postDelayed(Runnable r, long delayMillis)来实现，但是又不知道该延迟多少时间比较合适，因为手机性能不同，有的性能较差可能需要延迟较多，有的性能较好可以允许较少的延迟时间。

之前在项目中对启动过程进行优化，用到了IdleHandler，它可以在主线程空闲时执行任务，而不影响其他任务的执行。

## 单个任务

先看一下怎么用吧：

```java
Looper.myQueue().addIdleHandler(new MessageQueue.IdleHandler() {
    @Override
    public boolean queueIdle() {
        //此处添加处理任务
        return false;
    }
});
```

可以将上述代码添加到Activity onCreate中，在queueIdle()方法中实现延迟执行任务，在主线程空闲，也就是activity创建完成之后，它会执行queueIdle()方法中的代码。

queueIdle()返回true表示可以反复执行该方法，即执行后还可以再次执行；返回false表示执行完该方法后会移除该IdleHandler，即只执行一次。

注意，在主线程中使用时queueIdle中不能执行太耗时的任务。

## 多个任务

对于多个任务的延迟加载，如果addIdleHandler()调用多次明显不太优雅，而且也不要把所有要延迟的任务都一起放到queueIdle()方法内。根据queueIdle返回true时可以执行多次的特点，可以实现一个任务列表，然后从这个任务列表中取任务执行。

下面给出具体实现方案：

```java
import android.os.Looper;
import android.os.MessageQueue;

import java.util.LinkedList;
import java.util.Queue;

public class DelayTaskDispatcher {
    private Queue<Task> delayTasks = new LinkedList<>();

    private MessageQueue.IdleHandler idleHandler = new MessageQueue.IdleHandler() {
        @Override
        public boolean queueIdle() {
            if (delayTasks.size() > 0) {
                Task task = delayTasks.poll();
                if (task != null) {
                    task.run();
                }
            }
            return !delayTasks.isEmpty(); //delayTasks非空时返回ture表示下次继续执行，为空时返回false系统会移除该IdleHandler不再执行
        }
    };

    public DelayTaskDispatcher addTask(Task task) {
        delayTasks.add(task);
        return this;
    }

    public void start() {
        Looper.myQueue().addIdleHandler(idleHandler);
    }
}
```
```java
//使用系统Runnable接口自定义Task接口
public interface Task extends Runnable {

}
```

使用方法：

```java
    new DelayTaskDispatcher().addTask(new Task() {
            @Override
            public void run() {
                Log.d(TAG, "DelayTaskDispatcher one task");
            }
        }).addTask(new Task() {
            @Override
            public void run() {
                Log.d(TAG, "DelayTaskDispatcher two task");
            }
        }).start();
```

使用上述方式可以添加多个任务，在线程空闲时分别执行。

## 原理分析

下面我们来分析一下IdleHandler的原理。

IdleHandler是在Android系统MessageQueue.java中定义的：

```java
    private final ArrayList<IdleHandler> mIdleHandlers = new ArrayList<IdleHandler>();


    /**
     * Add a new {@link IdleHandler} to this message queue.  This may be
     * removed automatically for you by returning false from
     * {@link IdleHandler#queueIdle IdleHandler.queueIdle()} when it is
     * invoked, or explicitly removing it with {@link #removeIdleHandler}.
     *
     * <p>This method is safe to call from any thread.
     *
     * @param handler The IdleHandler to be added.
     */
    public void addIdleHandler(@NonNull IdleHandler handler) {
        if (handler == null) {
            throw new NullPointerException("Can't add a null IdleHandler");
        }
        synchronized (this) {
            mIdleHandlers.add(handler);
        }
    }


    /**
     * Callback interface for discovering when a thread is going to block
     * waiting for more messages.
     */
    public static interface IdleHandler {
        /**
         * Called when the message queue has run out of messages and will now
         * wait for more.  Return true to keep your idle handler active, false
         * to have it removed.  This may be called if there are still messages
         * pending in the queue, but they are all scheduled to be dispatched
         * after the current time.
         */
        boolean queueIdle();
    }
```

在MessageQueue中可以看到addIdleHandler()就是将IdleHandler添加到mIdleHandlers列表中。

那么，怎么使用这个mIdleHandlers呢？

我们知道Android的消息机制是在Looper.loop()方法中循环获取消息然后去执行：

```java
    public static void loop() {
        final Looper me = myLooper();
        final MessageQueue queue = me.mQueue;
 
        for (;;) {
            Message msg = queue.next(); // might block
            if (msg == null) {
                // No message indicates that the message queue is quitting.
                return;
            }
      
            ...
 
            msg.target.dispatchMessage(msg);
            
            ...
        }
    }
```

消息的获取通过 Message msg = queue.next(); 来实现，下面我们看下MessageQueue 的next()方法。

```java
    Message next() {
        // Return here if the message loop has already quit and been disposed.
        // This can happen if the application tries to restart a looper after quit
        // which is not supported.
        final long ptr = mPtr;
        if (ptr == 0) {
            return null;
        }

        int pendingIdleHandlerCount = -1; // -1 only during first iteration
        int nextPollTimeoutMillis = 0;
        for (;;) {
            if (nextPollTimeoutMillis != 0) {
                Binder.flushPendingCommands();
            }

            //nextPollTimeoutMillis为-1时（消息队列为空）该方法阻塞直到有新消息为止，或者等待指定的超时时间
            nativePollOnce(ptr, nextPollTimeoutMillis);

            synchronized (this) {
                // Try to retrieve the next message.  Return if found.
                final long now = SystemClock.uptimeMillis();
                Message prevMsg = null;
                Message msg = mMessages;
                if (msg != null && msg.target == null) {
                    // Stalled by a barrier.  Find the next asynchronous message in the queue.
                    do {
                        prevMsg = msg;
                        msg = msg.next;
                    } while (msg != null && !msg.isAsynchronous());
                }
                if (msg != null) {
                    if (now < msg.when) {
                        // Next message is not ready.  Set a timeout to wake up when it is ready.
                        nextPollTimeoutMillis = (int) Math.min(msg.when - now, Integer.MAX_VALUE);
                    } else {
                        // Got a message.
                        mBlocked = false;
                        if (prevMsg != null) {
                            prevMsg.next = msg.next;
                        } else {
                            mMessages = msg.next;
                        }
                        msg.next = null;
                        if (DEBUG) Log.v(TAG, "Returning message: " + msg);
                        msg.markInUse();
                        return msg;
                    }
                } else {
                    // No more messages.
                    nextPollTimeoutMillis = -1;
                }

                // Process the quit message now that all pending messages have been handled.
                if (mQuitting) {
                    dispose();
                    return null;
                }

                // If first time idle, then get the number of idlers to run.
                // Idle handles only run if the queue is empty or if the first message
                // in the queue (possibly a barrier) is due to be handled in the future.
                if (pendingIdleHandlerCount < 0
                        && (mMessages == null || now < mMessages.when)) {
                    //如果消息队列为空或者消息执行时间还未到，则获取IdleHandler队列的大小，下面需要用到
                    pendingIdleHandlerCount = mIdleHandlers.size();
                }
                if (pendingIdleHandlerCount <= 0) {
                    // No idle handlers to run.  Loop and wait some more.
                    mBlocked = true;
                    continue;
                }

                if (mPendingIdleHandlers == null) {
                    mPendingIdleHandlers = new IdleHandler[Math.max(pendingIdleHandlerCount, 4)];
                }
                //将IdleHandler列表转为数组
                mPendingIdleHandlers = mIdleHandlers.toArray(mPendingIdleHandlers);
            }

            // Run the idle handlers.
            // We only ever reach this code block during the first iteration.
            for (int i = 0; i < pendingIdleHandlerCount; i++) { //开始顺序执行所有IdleHandler
                final IdleHandler idler = mPendingIdleHandlers[i];
                mPendingIdleHandlers[i] = null; // release the reference to the handler

                boolean keep = false;
                try {
                    keep = idler.queueIdle(); //具体执行
                } catch (Throwable t) {
                    Log.wtf(TAG, "IdleHandler threw exception", t);
                }

                if (!keep) { //根据queueIdle()方法返回值决定是否移除该IdleHandler
                    synchronized (this) {
                        mIdleHandlers.remove(idler);
                    }
                }
            }

            // Reset the idle handler count to 0 so we do not run them again.
            pendingIdleHandlerCount = 0;

            // While calling an idle handler, a new message could have been delivered
            // so go back and look again for a pending message without waiting.
            nextPollTimeoutMillis = 0;
        }
    }
```

通过上述代码分析，可以看到IdleHandler确实是在消息队列为空或者需要执行的消息还未到时间时，即消息队列空闲时才去执行的。

另外，在addIdleHandler时，如果此时消息循环就是在Idle空闲状态，为了让IdleHandler马上执行，可以在其后发送一个空任务。

比如在系统源码 android.app.Instrumentation.java 中就有这种操作：

```java
public class Instrumentation {

    public void waitForIdle(Runnable recipient) {
        mMessageQueue.addIdleHandler(new Idler(recipient));
        mThread.getHandler().post(new EmptyRunnable());
    }

    private static final class EmptyRunnable implements Runnable {
        public void run() {
        }
    }
}
```

  

本文转自 [https://blog.csdn.net/wangsf1112/article/details/106027564?ops\_request\_misc=%257B%2522request%255Fid%2522%253A%2522171896314116800182123963%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fall.%2522%257D&request\_id=171896314116800182123963&biz\_id=0&utm\_medium=distribute.pc\_search\_result.none-task-blog-2~all~first\_rank\_ecpm\_v1~rank\_v31\_ecpm-17-106027564-null-null.142^v100^pc\_search\_result\_base8&utm\_term=android%20idlehandler&spm=1018.2226.3001.4187](https://blog.csdn.net/wangsf1112/article/details/106027564?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522171896314116800182123963%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fall.%2522%257D&request_id=171896314116800182123963&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~first_rank_ecpm_v1~rank_v31_ecpm-17-106027564-null-null.142^v100^pc_search_result_base8&utm_term=android%20idlehandler&spm=1018.2226.3001.4187)，如有侵权，请联系删除。