---
title: Android IPC 之Messenger 原理及应用
date: 2022-12-26
tags:
 - android
categories: 
 - android
sticky: 
   true
---

1、Messenger 客户端发送消息给服务端
-----------------------

与AIDL 类似，依然分别编写服务端、客户端逻辑。

### 编写服务端

```java
public class MyService extends Service {

    private String TAG = "ipc";

    //创建Handler，用来处理客户端发送过来的消息
    private Handler handler = new Handler(Looper.getMainLooper()) {
        @Override
        public void handleMessage(@NonNull Message msg) {
            Bundle bundle = msg.getData();
            int id = bundle.getInt("id");
            Log.d(TAG, "receive id from client, id:" + id);
        }
    };

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        //获取IBinder 引用
        return new Messenger(handler).getBinder();
    }
}

```

### 编写客户端

```java
    ServiceConnection serviceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            //获取服务端的IBinder引用后，用来构造Messenger
            Messenger messenger = new Messenger(service);

            //构造Message
            Message message = Message.obtain();
            //往Message填充数据
            Bundle bundle = new Bundle();
            bundle.putInt("id", 100);
            message.setData(bundle);
            try {
                //发送消息
                messenger.send(message);
            } catch (Exception e) {

            }
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {

        }
    };

    private void bindService() {
        Intent intent = new Intent(MainActivity.this, MyService.class);
        bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE);
    }

```

流程如下：

> 1、服务端构造Handler用来接收信息  
> 2、客户端构造Messenger来发送message信息

服务端收到消息打印如下：

![](https://raw.githubusercontent.com/shug666/image/main/images/19073098-26dde9cfec3a3016.png)

可以看出不用编写任何AIDL 文件就可以实现进程间通信，很是方便。

2、Messenger 服务端发送消息给客户端
-----------------------

上面的Demo是客户端往服务端发送一条消息，那么如果服务端想给客户端发送回复消息该怎么实现呢？  
以服务端收到客户端传递过来的id后，查找出id对应的学生的姓名、年龄发送给客户端为例。

### 编写服务端

改造一下服务端代码：

```java
    //创建Handler，用来处理客户端发送过来的消息
    private Handler handler = new Handler(Looper.getMainLooper()) {
        @Override
        public void handleMessage(@NonNull Message msg) {
            Bundle bundle = msg.getData();
            int id = bundle.getInt("id");
            Log.d(TAG, "receive id from client, id:" + id);

            //msg.replyTo 为Messenger类型，从客户端传递过来的
            Messenger replyMessenger = msg.replyTo;
            if (replyMessenger != null) {
                //构造消息
                Message message = Message.obtain();
                Bundle replyBundle = new Bundle();
                replyBundle.putString("name", "xiaoming");
                replyBundle.putInt("age", 18);
                message.setData(replyBundle);
                try {
                    replyMessenger.send(message);
                } catch (Exception e) {

                }
            }
        }
    };

```

只是修改了handleMessage(xx)，当收到客户端的消息后立即返回查询到的名字、年龄发送给客户端。

### 编写客户端

客户端代码也仅仅需要小小的改动：

```java
    //接收服务端的信息
    private Handler handler = new Handler(Looper.getMainLooper()) {
        @Override
        public void handleMessage(@NonNull Message msg) {
            Bundle bundle = msg.getData();
            if (bundle != null) {
                //提取姓名、年龄
                String name = bundle.getString("name");
                int age = bundle.getInt("age");
                Log.d("ipc", "receive name 、age from server, name:" + name + " age:" + age);
            }
        }
    };

    ServiceConnection serviceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            //获取服务端的IBinder引用后，用来构造Messenger
            Messenger messenger = new Messenger(service);

            //构造Message
            Message message = Message.obtain();
            //往Message填充数据
            Bundle bundle = new Bundle();
            bundle.putInt("id", 100);
            message.setData(bundle);

            //为了接收服务端的消息，把自己的Messenger传递给服务端
            message.replyTo = new Messenger(handler);
            try {
                //发送消息
                messenger.send(message);
            } catch (Exception e) {

            }
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {

        }
    };

```

客户端在发送给服务端消息时带上自己的Messenger以便服务端拿到该Messenger给客户端发送信息。同时，需要重写Handler的handleMessage(xx)接收服务端的信息。这与服务端的实现是一致的，相当于双方都有Messenger。

至此，借助于Messenger，轻易就完成了客户端/服务端相互通信的功能。

3、Messenger 底层原理
----------------

### 从发送消息开始

为什么Messenger 能够如此简单地完成了IPC，从其发送消息开始一探究竟。

```java
#Messenger.java
    public void send(Message message) throws RemoteException {
        mTarget.send(message);
    }

```

mTarget为IMessenger类型，在Messenger构造函数里初始化：

```java
#Messenger.java
    public Messenger(Handler target) {
        mTarget = target.getIMessenger();
    }

```

而target 为Handler类型，跳转到Handler.java里查看：

```java
#Handler.java
    final IMessenger getIMessenger() {
        synchronized (mQueue) {
            if (mMessenger != null) {
                return mMessenger;
            }
            mMessenger = new MessengerImpl();
            return mMessenger;
        }
    }

    private final class MessengerImpl extends IMessenger.Stub {
        public void send(Message msg) {
            msg.sendingUid = Binder.getCallingUid();
            //调用Handler发送信息
            Handler.this.sendMessage(msg);
        }
    }

```

看到这是不是有种似曾相似的感觉，此处MessengerImpl 继承自IMessenger.Stub，实现了唯一的方法：send(Message msg)，该方法的的形参为：Message。  
由此，我们轻易得出结论：

> 1、服务端对外暴露了IMessenger 接口，该接口里有唯一的方法：send(Message msg)。  
> 2、服务端实现了send(Message msg)方法，在该方法里将Message使用Handler发送出去。

找到IMessenger 对应的AIDL 文件：

```java
package android.os;

import android.os.Message;

/** @hide */
oneway interface IMessenger {
    void send(in Message msg);
}

```

_注：该文件在framework/core/java/android/os/IMessenger.aidl_  
其实就是之前说的AIDL，Message本身支持序列化，加 "in" 标记表示数据只能从客户端流向服务端。

该接口定义还多了个标识：**"oneway"**。  
这个字段最终会影响IBinder.transact(xx)里的最后一个形参：

```java
boolean _status = mRemote.transact(Stub.TRANSACTION_send, 
_data, null, android.os.IBinder.FLAG_ONEWAY);

```

FLAG\_ONEWAY 表示transact(xx)不是阻塞调用，也就是说客户端调用该方法后立即返回，不等待。仔细想想其实也并不用等待，因为send(xx)没有返回值，又是in 修饰形参，数据流不能从服务端流入客户端。

![](https://raw.githubusercontent.com/shug666/image/main/images/19073098-f45b72be06fff26c.png)

与普通的AIDL 相比，Messenger其实就是封装了服务端的接口及其方法，与此同时也封装了客户端调用服务端的方法。客户端将要传递的消息封装在Message里，通过Messenger传递出去，服务端收到后在Handler里处理该Message。

### 服务端为什么能够向客户端发送消息

从IMessenger.aidl定义可知，通过send(xx)方法只能是由客户端往服务端发送消息，并且没有返回值。因此想通过方法的形参或返回值携带服务端的数据是不现实的了。  
**客户端能给服务端发送数据的最大凭证是：客户端能够拿到服务端的IBinder接口。**那么想想反过来行吗？  
来看看Message.java里的字段：

```java
#Message.java
    /**
     * Optional Messenger where replies to this message can be sent.  The
     * semantics of exactly how this is used are up to the sender and
     * receiver.
     */
    public Messenger replyTo;


```

Message可以持有Messenger 引用，而我们知道构造好了Messenger，就可以通过getBinder(xx)获取关联的IBinder 引用。

```java
#Messenger.java
    public IBinder getBinder() {
        return mTarget.asBinder();
    }

```

IBinder有了剩下的就是想办法把它传给服务端。

**客户端传递IBinder给服务端**  
Message需要跨进程传递，因此它的成员变量包括Messenger replyTo 都需要序列化及反序列化。

```java
#Message.java
    public void writeToParcel(Parcel dest, int flags) {
        ...
        Messenger.writeMessengerOrNullToParcel(replyTo, dest);
        ...
    }

```

调用了Messenger里的静态方法：

```java
#Messenger.java
    public static void writeMessengerOrNullToParcel(Messenger messenger,
                                                    Parcel out) {
        //获取messenger 关联的Binder，写入到序列化对象
        out.writeStrongBinder(messenger != null ? messenger.mTarget.asBinder()
                : null);
    }

```

至此，客户端的IBinder引用就可以传递给服务端了。

**服务端取出IBinder**  
服务端收到Message后反序列化成员变量如Messenger replyTo等。

```java
#Message.java
    private void readFromParcel(Parcel source) {
        ...
        replyTo = Messenger.readMessengerOrNullFromParcel(source);
        ...
    }

```

类似的调用Messenger 静态方法：

```java
#Messenger.java
    public static Messenger readMessengerOrNullFromParcel(Parcel in) {
        //反序列化出IBinder
        IBinder b = in.readStrongBinder();
        //构造出Messenger
        return b != null ? new Messenger(b) : null;
    }

```

最终，服务端收到了客户端的IBinder，并构造出Messenger，有了Messenger当然可以给客户端发消息了。

## 4、Binder 活动和服务进行通信

### 编写服务端

```java
public class MyService extends Service {

    private String TAG = "MyService";

    public class DownloadBinder extends Binder{
        public void startDownload() {
            Log.d(TAG,"startDownload executed");
        }
        public int getProgress() {
            Log.d(TAG,"getProgress executed");
            return 0;
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        //获取IBinder 引用
        return new DownloadBinder();
    }
}
```

### 编写客户端

```java
ServiceConnection serviceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            MyService.DownloadBinder downloadBinder = (MyService.DownloadBinder) service;
            downloadBinder.startDownload();
            int progress = downloadBinder.getProgress();
            Log.d(TAG,"progress = " + progress);
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {

        }
    };

    private void bindService(){
        Intent intent = new Intent(TestActivity.this, MyService.class);
        bindService(intent,serviceConnection,Context.BIND_AUTO_CREATE);
    }
```



## 4、Message、AIDL、Messenger、Binder 区别与联系

**Message**  

用来在线程间传递数据，与Handler配合使用，本身支持序列化，可以跨进程传递Message对象。

**AIDL**  

用来简化进程间通信时客户端、服务端代码的编写。 需跨进程且需多线程时，则使用AIDL。

**Messenger**  

在AIDL 的基础上，进一步封装服务端暴露的接口，将服务端收到Message通过Handlder发送到目标线程。 需要跨进程且无需多线程处理时，使用Messager

**Binder类**

无需跨进程实现绑定服务，同一进程之间通信则使用Binder类即可。

**AIDL 与 Messenger 在进程间通信区别：**  
使用AIDL优点：

> 1、可以灵活的编写服务端的接口，并且能够自定义方法形参类型、数据流向、方法返回值。  
> 2、服务端方法实现里可以开启多线程处理数据。

使用AIDL 缺点：

> 1、需要编写AIDL 文件定义服务端接口。  
> 2、如果是自定义数据类型，还需要编写对应的AIDL 文件。

使用Messenger 优点：

> 1、无需定义AIDL 文件，直接构造Message发送。  
> 2、快速实现双向通信（严格上来说AIDL也能实现，只是Messenger封装好了IBinder的传递)

使用Messenger缺点：

> 参考上方，AIDL 优点即是Messenger缺点。

**适用场合**

> 如果是简单的通信，并且服务端是单线程顺序处理客户端的消息，建议使用Messenger。
