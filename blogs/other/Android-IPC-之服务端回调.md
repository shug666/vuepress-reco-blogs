---
title: Android IPC 之服务端回调
date: 2022-12-26
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 1、跨进程传输接口

### 跨进程传递对象

![](https://raw.githubusercontent.com/shug666/image/main/images/19073098-8b633c2a8d2d3677.png)

基本数据类型，如int、short 、String 等不用做任何处理可通过Binder直接传送。而复杂数据类型，如自定义的类，需要实现Parcelable 接口才能通过Binder传送。

以之前的获取学生信息为例：

![](https://raw.githubusercontent.com/shug666/image/main/images/19073098-27180e98220c9543.png)

如上图所示，客户端通过IPC 从服务端获取学生信息，学生信息封装在Student类里：

```java
public class Student implements Parcelable {
    private String name;
    private int age;
    private float score;
    ...
}

```

学生信息包括姓名、年龄、分数三个字段。  
我们定义AIDL接口如下：

```java
interface IStudentInfo {
    //主动获取
    Student getStudentInfo();
}

```

客户端通过调用 getStudentInfo() 方法即可获取从服务端返回的学生信息。

### 跨进程传递接口

客户端想要获取学生信息，需要主动调用 getStudentInfo() 方法。考虑一种场景：

> 1、学生每一门考试，分数都在变化，客户端需要一直轮询去调用getStudentInfo() 方法才能获取最新的成绩。我们知道轮询是效率比较低的做法，要尽量避免。  
> 2、我们就会想到学生成绩发生变化了，服务端就主动通知我们就好啦。

如下图所示：

![](https://raw.githubusercontent.com/shug666/image/main/images/19073098-e4af4229848884f5.png)

**现在的问题重点是：服务端如何主动通知客户端。**  
依据以往的经验，有两种方式可以实现：

> 1、客户端通过绑定服务端的Service，进而与服务端通信，那么可以换种思路，客户端也可以定义Service，而后服务端通过绑定客户端，进而调用客户端的接口，主动给客户端传递消息。  
> 2、客户端绑定了服务端的Service，两者之间就能够通信。实际上服务端传递了Binder给客户端，客户端拿到Binder之后就可以进行通信了，这就说明了Binder对象本身能够跨进程传输。  
> 于是改造之前的接口：  
> 客户端调用服务端接口的时候将自己生成的Binder传递给服务端，那么服务端发生变化的时候就可以通过这个Binder来通知客户端了。

通过比对1、2两种方式：  
第一种方式过于复杂，对于客户端、服务端的角色容易搞混。  
第二种方式符合我们认知的"回调"，也就是说跨进程的回调和同一个进程里的回调理解上是一致的。

2、AIDL 回调的使用
------------

### 服务端声明回调接口

定义AIDL 回调接口：

```java
import com.fish.ipcserver.Student;
interface RemoteCallback {
    //回调
    oneway void onCallback(in Student student);
}

```

Student 为学生信息类，该对象支持跨进程传输。  
in 表示数据流方向，表示该Student 对象传递给客户端。  
oneway 表示调用onCallback(xx) 方法的线程立即返回，不阻塞等待方法调用结果。

### 服务端暴露注册回调接口方法

服务端定义了回调接口，客户端需要给服务端传递接口的实现。因此服务端还需要将注册回调的接口暴露给客户端。  
定义AIDL 文件如下：

```java
import com.fish.ipcserver.Student;
import com.fish.ipcserver.RemoteCallback;

interface IStudentInfo {
    //主动获取
    Student getStudentInfo();
    //注册回调
    oneway void register(in RemoteCallback callback);
}

```

至此，服务端提供了两个方法：

> 1、getStudentInfo() 客户端调用此方法主动获取学生信息。  
> 2、register(xx) 客户端调用此方法注册回调实例。

### 服务端编写回调逻辑

```java
public class StudentService extends Service {

    private Student student;
    private RemoteCallback remoteCallback;
    private MyStudent myStudent;

    @Override
    public void onCreate() {
        super.onCreate();
        student = new Student();
        student.setAge(19);
        student.setName("小明");
        myStudent = new MyStudent();
    }

    class MyStudent extends IStudentInfo.Stub {
        @Override
        public Student getStudentInfo() throws RemoteException {
            return student;
        }

        @Override
        public void register(RemoteCallback callback) throws RemoteException {
            //客户端注册的回调实例保存到成员变量 remoteCallback
            remoteCallback = callback;
        }

        public void changeScore() {
            //学生成绩发生改变
            student.setScore((float)(Math.random() * 100));
            try {
                if (remoteCallback != null)
                    //调用回调实例方法，将变化后的学生信息传递给客户端
                    remoteCallback.onCallback(student);
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        //将Stub 返回给客户端
        return myStudent.asBinder();
    }
}

```

可以看出，声明了IStudentInfo 实例。  
小结上面的逻辑：

> 1、服务端声明了Stub(桩，实际上是Binder实例)，并将Stub返回给客户端。  
> 2、客户端收到Stub(实际上是BinderProxy)，然后转换为IStudentInfo 接口。而该接口里声明了两个方法，分别是getStudentInfo()和register(xx)。  
> 3、客户端调用register(RemoteCallback) 将回调注册(传递)给服务端。  
> 4、服务端发生变化的时候通过RemoteCallback 通知客户端数据已经发生改变。

### 客户端编写调用逻辑

分三步：  
(1)、客户端绑定服务端Service。  
(2)、建立连接后客户端将IBinder 转化为IStudentInfo 接口，并注册回调。  
(3)、客户端处理回调内容。

来看看代码实现：

#### (1)绑定服务

```java
        //参数1：运行远程服务的包名
        //参数2：远程服务全限定类名
        ComponentName componentName = new ComponentName("com.fish.ipcserver", "com.fish.ipcserver.StudentService");
        Intent intent = new Intent();
        intent.setComponent(componentName);
        //绑定远程服务
        v.getContext().bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE);

```

#### (2)IBinder 转换为IStudentInfo 接口

```java
    ServiceConnection serviceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            isConnected = true;
            //转为对应接口
            iStudentInfo = IStudentInfo.Stub.asInterface(service);
            try {
                //注册回调
                iStudentInfo.register(remoteCallback);
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            isConnected = false;
        }
    };

```

#### (3)客户端处理回调

```java
    //声明回调
    RemoteCallback remoteCallback = new RemoteCallback.Stub() {
        @Override
        public void onCallback(Student student) throws RemoteException {
            Log.d("fish", "call back student:" + student);
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(IPCActivity.this, "client receive change:" + student.toString(), Toast.LENGTH_SHORT).show();
                }
            });
        }
    };

```

此处收到服务端的回调后，仅仅Toast 学生信息。

### 注意事项

1、自定义类型Student.java 与Student.aidl 需要在同一个包名下。  
2、客户端与服务端定义的aidl 文件需要在同一个包名下。通常来说，一般先定义服务端aidl 接口，最后将这些aidl文件拷贝到客户端相同包名下。  
3、bindService Intent 需要指定ComponentName。

![](https://raw.githubusercontent.com/shug666/image/main/images/19073098-6bc416d9ed12dfc3.png)

3、回调在四大组件里的应用
-------------

以ContentProvider 为例：  
想要获取相册数据，可以通过ContentProvider获取，而相册是公共的存储图片区域，其它App都可以往里面插入数据或者删除数据。  
而系统也提供了监听相册变化的回调：

```java
Handler handler = new Handler(Looper.getMainLooper());
    ContentObserver contentObserver = new ContentObserver(handler) {
        @Override
        public void onChange(boolean selfChange) {
            //数据变化回调
            super.onChange(selfChange);
        }
    };
    getContentResolver().registerContentObserver(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, true, contentObserver);

```

如上，通过registerContentObserver(xx)向系统(服务端)注册了回调接口，当有数据变化的时候服务端会调用onChange(xx)通知客户端。

不仅ContentProvider 运用到了回调，Service、Activity、Broadcast也用到了。

**理解了进程间的回调原理及其使用，对理解四大组件的通信帮助很大。**

下篇将重点分析四大组件的框架。
[完整代码演示](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Ffishforest%2FAndroidDemo%2Fblob%2Fmain%2Fapp%2Fsrc%2Fmain%2Fjava%2Fcom%2Fexample%2Fandroiddemo%2Fipc%2FIPCActivity.java)