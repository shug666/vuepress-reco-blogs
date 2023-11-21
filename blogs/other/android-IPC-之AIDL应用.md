---
title: android IPC 之AIDL应用
date: 2022-12-23
tags:
 - android
categories: 
 - android
sticky: 
   true
---

文件
-------------

### 什么是AIDL

AIDL 是Android Interface Definition Language (Android 接口定义语言)的缩写。

### 创建AIDL 文件

Android Studio本身支持创建AIDL文件，先创建名为IMyServer 的AIDL文件。  
在Module上右键单击：

![](https://raw.githubusercontent.com/shug666/image/main/images/19073098-e132c7af2975b4e3.png)

输入名字


确定后生成 IMyServer.aidl文件：  

![](https://raw.githubusercontent.com/shug666/image/main/images/19073098-e0d53300bdda29ec.png)

可以看出，由于是第一次创建AIDL文件，因此还创建了aidl文件夹并添加了包名作为目录结构，其总体结构如下：

> src/main/aidl/com/fish/myapplication/IMyServer.aidl

其中/aidl目录与/java、/res目录平级，都在main目录下：

> app/src/main/  
> app/src/aidl/  
> app/src/res

### AIDL 文件内容

生成IMyServer.aidl内容如下：

```java
//包名
package com.fish.myapplication;

interface IMyServer {
    //aidl 支持的基本数据类型
    //默认生成的方法，可以去掉
    void basicTypes(int anInt, long aLong, boolean aBoolean, float aFloat,
            double aDouble, String aString);
}

```

其中basicTypes(xx)方法是自动生成的，用来指导我们如何编写方法，可以去掉。  
IMyServer 接口里声明的方法为Server端暴露给外部调用的方法，先为Server添加方法：

```java

//包名
package com.fish.myapplication;

interface IMyServer {
    //只有一个参数，并且没有返回值
    void say(String word);
    
    //有两个参数，并且返回int
    int tell(String word, int age);
}

```

然后编译工程。

### AIDL 编译产物

编译成功后，切换到Project模式，搜索IMyServer.java：

![](https://raw.githubusercontent.com/shug666/image/main/images/19073098-69a296fe9c2614a0.png)

可以看出，编写的AIDL文件，最终根据一定的规则映射生成Java文件，接着来看看IMyServer.java内容。

```java
/*
 * This file is auto-generated.  DO NOT MODIFY.
 */
package com.fish.myapplication;
public interface IMyServer extends android.os.IInterface
{
  //默认类实现接口，可以不用关注
  public static class Default implements com.fish.myapplication.IMyServer
  {
    @Override public void say(java.lang.String word) throws android.os.RemoteException
    {
    }
    @Override public int tell(java.lang.String word, int age) throws android.os.RemoteException
    {
      return 0;
    }
    @Override
    public android.os.IBinder asBinder() {
      return null;
    }
  }


  public static abstract class Stub extends android.os.Binder implements com.fish.myapplication.IMyServer
  {
    //描述符
    private static final java.lang.String DESCRIPTOR = "com.fish.myapplication.IMyServer";
    public Stub()
    {
      //调用Binder方法，将Binder与IInterface 关联起来
      //也就是说Binder持有IInterface引用
      this.attachInterface(this, DESCRIPTOR);
    }

    //通过Binder找到关联的IInterface
    public static com.fish.myapplication.IMyServer asInterface(android.os.IBinder obj)
    {
      if ((obj==null)) {
        return null;
      }
      android.os.IInterface iin = obj.queryLocalInterface(DESCRIPTOR);
      if (((iin!=null)&&(iin instanceof com.fish.myapplication.IMyServer))) {
        //IBinder引用与调用者同一进程，直接返回IInterface
        return ((com.fish.myapplication.IMyServer)iin);
      }
      //不同进程则返回Proxy，并传入Binder
      return new com.fish.myapplication.IMyServer.Stub.Proxy(obj);
    }
    //返回自身
    @Override public android.os.IBinder asBinder()
    {
      return this;
    }
    
    //重写onTransact(xx)
    @Override public boolean onTransact(int code, android.os.Parcel data, android.os.Parcel reply, int flags) throws android.os.RemoteException
    {
      java.lang.String descriptor = DESCRIPTOR;
      switch (code)
      {
        //根据code，调用不同的方法
        case INTERFACE_TRANSACTION:
        {
          reply.writeString(descriptor);
          return true;
        }
        case TRANSACTION_say:
        {
          data.enforceInterface(descriptor);
          java.lang.String _arg0;
          //反序列化，读取数据
          _arg0 = data.readString();
          this.say(_arg0);
          reply.writeNoException();
          return true;
        }
        case TRANSACTION_tell:
        {
          data.enforceInterface(descriptor);
          java.lang.String _arg0;
          _arg0 = data.readString();
          int _arg1;
          _arg1 = data.readInt();
          int _result = this.tell(_arg0, _arg1);
          reply.writeNoException();
          //写入回复
          reply.writeInt(_result);
          return true;
        }
        default:
        {
          return super.onTransact(code, data, reply, flags);
        }
      }
    }
    private static class Proxy implements com.fish.myapplication.IMyServer
    {
      private android.os.IBinder mRemote;
      Proxy(android.os.IBinder remote)
      {
        mRemote = remote;
      }
      @Override public android.os.IBinder asBinder()
      {
        return mRemote;
      }
      public java.lang.String getInterfaceDescriptor()
      {
        return DESCRIPTOR;
      }
      @Override public void say(java.lang.String word) throws android.os.RemoteException
      {
        //构造序列化数据
        android.os.Parcel _data = android.os.Parcel.obtain();
        android.os.Parcel _reply = android.os.Parcel.obtain();
        try {
          _data.writeInterfaceToken(DESCRIPTOR);
          //写入序列化
          _data.writeString(word);
          //mRemote为远程的IBinder
          boolean _status = mRemote.transact(Stub.TRANSACTION_say, _data, _reply, 0);
          //阻塞等待transact(xx)调用结果
          if (!_status && getDefaultImpl() != null) {
            getDefaultImpl().say(word);
            return;
          }
          _reply.readException();
        }
        finally {
          _reply.recycle();
          _data.recycle();
        }
      }
      @Override public int tell(java.lang.String word, int age) throws android.os.RemoteException
      {
        android.os.Parcel _data = android.os.Parcel.obtain();
        android.os.Parcel _reply = android.os.Parcel.obtain();
        int _result;
        try {
          _data.writeInterfaceToken(DESCRIPTOR);
          _data.writeString(word);
          _data.writeInt(age);
          boolean _status = mRemote.transact(Stub.TRANSACTION_tell, _data, _reply, 0);
          if (!_status && getDefaultImpl() != null) {
            return getDefaultImpl().tell(word, age);
          }
          _reply.readException();
          _result = _reply.readInt();
        }
        finally {
          _reply.recycle();
          _data.recycle();
        }
        return _result;
      }
      public static com.fish.myapplication.IMyServer sDefaultImpl;
    }
    static final int TRANSACTION_say = (android.os.IBinder.FIRST_CALL_TRANSACTION + 0);
    static final int TRANSACTION_tell = (android.os.IBinder.FIRST_CALL_TRANSACTION + 1);
    public static boolean setDefaultImpl(com.fish.myapplication.IMyServer impl) {
      if (Stub.Proxy.sDefaultImpl == null && impl != null) {
        Stub.Proxy.sDefaultImpl = impl;
        return true;
      }
      return false;
    }
    public static com.fish.myapplication.IMyServer getDefaultImpl() {
      return Stub.Proxy.sDefaultImpl;
    }
  }
  
  //声明的公共方法
  public void say(java.lang.String word) throws android.os.RemoteException;
  public int tell(java.lang.String word, int age) throws android.os.RemoteException;
}

```

代码不长，但是初看起来云里雾里的，如果不怎么熟悉以上内容，强烈建议先阅读上篇文章：[Android IPC 之Binder应用](https://www.jianshu.com/p/9927f04a36d0)，再看这篇就很容易了。

提取重点分析上面的代码。  
**定义接口**  
定义了IMyServer 接口，该接口里的方法就是根据IMyServer.aidl里声明的方法生成的。

**两个静态类**  
Stub是抽象类。  
继承了Binder，重写了onTransact(xx)方法。  
实现了IMyServer 接口，并没有实现里面的方法，这些方法待服务端实现。  
当onTransact(xx)被调用的时候，根据不同的code调用相应的方法。  
在上篇文章里分析的时候，onTransact(xx)与IMyServer 接口是分离的，我们需要手动在onTransact(xx)里调用IMyServer 方法。而此时Stub将两者结合起来了，完成了服务端与Binder驱动的联动。

Proxy虽然没有继承自Binder，但是持有IBinder引用：mRemote。  
实现了IMyServer，并且实现了其所有方法，每个方法里最终都通过mRemote调用transact(xx)完成了客户端与Binder驱动联动。

至此，通过这两个类，分别完成了服务端、客户端与Binder的联动。  
继续引用上篇的图：

![](https://raw.githubusercontent.com/shug666/image/main/images/19073098-c622733747a59b67.png)

可以看出，有了AIDL自动生成的类后：

> 1、繁杂的switch case 不用自己编写了  
> 2、序列化反序列化也不用编写了  
> 3、不再需要编写transact(xx)与onTransact(xx)了

极大解放了生产力。

如何使用AIDL
----------

既然IMyServer.java 已经生成了，继续来看看如何使用它。

### 编写Server端业务

```java
public class MyService extends Service {

    private final String TAG = "IPC";

    //构造内部类
    private IMyServer.Stub stub = new IMyServer.Stub() {
        @Override
        public void say(String word) throws RemoteException {
            Log.d(TAG, "receive say content:" + word + " in server");
        }

        @Override
        public int tell(String word, int age) throws RemoteException {
            Log.d(TAG, "receive tell content:" + word + " age:" + age + " in server");
            return age + 1;
        }
    };

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        //Stub 继承自Binder，因此是IBinder类型
        return stub;
    }
}

```

首先实现业务接口。  
其次在onBind(xx)里将Binder返回给客户端。  
业务逻辑实现了，等待客户端调用。

### 编写客户端业务

先定义ServiceConnection:

```java
    ServiceConnection serviceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            IMyServer iMyServer = IMyServer.Stub.asInterface(service);
            try {
                iMyServer.say("how are you?");
                int result = iMyServer.tell("how are you?", 18);
                Log.d("IPC", "receive return content:" + result + " in client");
            } catch (Exception e) {

            }
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
        }
    };

```

service 为IBinder引用，该引用从服务端经过Binder驱动传递而来(不一定是同一个引用)。  
IMyServer.Stub.asInterface(service) 用来寻找该IBinder对应的服务端提供的接口。

> 1、当IBinder与调用者同一进程，则IBinder为Binder类型，即为自身定义的Stub。  
> 2、当IBinder与调用者不是同一进程，则IBinder为BinderProxy类型(为什么是这个类型，后续文章会分析)。

此处测试的是两个不同的进程，因此IBinder service指向BinderProxy。  
在ServiceConnection里，当绑定成功后调用Proxy里的方法，其内部通过BinderProxy调用transact(xx)。

上面的逻辑都写了，最后当然需要绑定Service:

```java
    private void bindService() {
        Intent intent = new Intent(this, MyService.class);
        bindService(intent, serviceConnection, BIND_AUTO_CREATE);
    }

```

来看看打印结果：

![](https://raw.githubusercontent.com/shug666/image/main/images/19073098-d7bf722eb6dd0e75.png)

可以看出通信成功了。

需要注意的是：

> 以上Demo都是同一个工程里编写的，因此客户端、服务端都能访问IMyServer.Stub，若是在不同的进程，需要写同样的IMyServer.aidl文件。

让Service在不同的进程运行只需要在AndroidManifest.xml添加如下字段：

```xml
        <service android:name=".MyService" android:process=":aidl">
        </service>

```

绑定后，运行的两个进程如下：

![](https://raw.githubusercontent.com/shug666/image/main/images/19073098-a1cc050352d70af5.png)

### 总结AIDL用法

通过以上Demo可以看出，通过编写AIDL实现IPC。  
服务端仅需要两步：  
**第一步**  
实现接口对应方法的业务逻辑

**第二步**  
在onBind(xx)里将接口关联的Binder返回

同样的客户端调用服务端仅仅只需要两步：  
**第一步**  
通过Stub拿到服务端的接口

**第二步**  
拿到接口后调用对应的方法

![](https://raw.githubusercontent.com/shug666/image/main/images/19073098-4155d512d0924d50.png)

明显的，IMyServer.java 已经为我们实现了连接Binder的功能，屏蔽了对接的Binder细节。客户端调用服务端的方法(Proxy)与服务端进行通信，就像是"直接"调用一般，符合Java一贯的面向对象的思维。

结合上一篇文章对Binder应用的分析，以及本篇AIDL的分析，我们知道：

> *   AIDL 并不是我们熟知的Java、C++语言，而是一种规范。按此规范编写的AIDL文件最终生成对应的.java文件，该文件里实现了客户端调用transact(xx)以及调用服务端的onTransact(xx)，通过.java文件就能实现进程间通信。
> *   .java文件里将工作分为了两部分：一是客户端的逻辑封装在Proxy里，而服务端的逻辑封装在Stub里，典型的Proxy-Stub(代理-桩)模式。
> *   进程间通信的核心是Binder，AIDL本身并不能实现进程间通信，仅仅是简化了编码的流程。

接下来将重点分析AIDL 传递自定义数据类型以及定向Tag相关问题。

AIDL 传递非基本数据类型
----------------

在上篇文章中定义AIDL文件时，方法形参都是使用基本参数，实际需求里不仅仅只传递基本参数。比如客户端想从服务端获取学生信息，包括姓名、年龄等。

### 自定义数据类型

```java
public class Student implements Parcelable {
    private String name;
    private int age;

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    protected Student(Parcel in) {
        //从序列化里解析成员变量
        name = in.readString();
        age = in.readInt();
    }

    public static final Creator<Student> CREATOR = new Creator<Student>() {
        @Override
        public Student createFromParcel(Parcel in) {
            //构造新对象
            return new Student(in);
        }

        @Override
        public Student[] newArray(int size) {
            return new Student[size];
        }
    };

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        //将成员变量写入到序列化对象里
        dest.writeString(name);
        dest.writeInt(age);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}

```

声明了Student类，该类里有学生的信息：姓名、年龄。  
跨进程传递对象需要序列化数据，因此采用Parcelable 进行序列化，实现Parcelable需要实现其方法：describeContents()与writeToParcel(xx)，并且还需要添加静态类：CREATOR，用来反序列化数据。  
Parcelable序列化都是标准样式，实际上就做了两件事：

> 1、将Student数据分别写入到序列化对象Parcel里  
> 2、从序列化对象Parcel里构建出Student对象

### AIDL 使用自定义数据类型

准备好了数据类型，接着来看看如何使用它。

```java
package com.fish.myapplication;

import com.fish.myapplication.service.Student;//----------------(1)
interface IMyServer {
    void getStudentInfo(int age, in Student student);//------------(2)
}

```

**(1)**  
与平时一致，引入一个新的类型，要将其类名import 出来。

**(2)**  
getStudentInfo(xx)有个形参类型为：Student student，并且前边还有个"in" 标记(这个后续说)

### 自定义数据类型关联的AIDL

上面的代码是无法编译通过的，还需要在AIDL里声明自定义数据类型关联的AIDL。  
新建名为：Student 的AIDL 文件，默认内容如下：

```java
package com.fish.myapplication.service;
interface Student {
    void basicTypes(int anInt, long aLong, boolean aBoolean, float aFloat,
            double aDouble, String aString);
}

```

将以上内容删除，改造成如下内容：

```java
package com.fish.myapplication.service;
parcelable Student;

```

这么改造后，Student.aidl生成的Student.java 文件内容为空。  
修改后，编译成功。

### 注意事项

**包名类名一致**  
Student.aidl和自定义数据类型Student.java 需要保持包名类名一致。  

![](https://raw.githubusercontent.com/shug666/image/main/images/19073098-1c21b86c305a5180.png)

如上图，Student.java 包名为：com.fish.myapplication.service

再看Student.aidl 结构：

![](https://raw.githubusercontent.com/shug666/image/main/images/19073098-432bd35affc680b1.png)

如上图，Student.aidl 包名为：com.fish.myapplication.service

可以看出，两者包名一致。

**解决类重复问题**  
编写过程中可能会遇到类重复问题：  
先定义了Student.java，当再定义Student.aidl 时，若两者处于同一包下，那么将无法创建Student.aidl文件。  
分两种方法解决：

> 第一种：先定义Student.aidl，并将其内容改造，最后定义Student.java。  
> 第二种：先定义Student.java 在与Student.aidl不同的包名下，然后再定义Student.aidl，并改造内容，最后将Student.aidl 移动至与Student.java 同一包名下。

### 客户端/服务端处理自定义数据类型

**服务端业务**

```java
public class MyService extends Service {

    private final String TAG = "IPC";

    //构造内部类
    private IMyServer.Stub stub = new IMyServer.Stub() {
        @Override
        public void getStudentInfo(int age, Student student) throws RemoteException {
            Log.d(TAG, student.getName() + " in server");
        }
    };

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        //Stub 继承自Binder，因此是IBinder类型
        return stub;
    }
}

```

获取传递过来的Student，并打印其姓名。

**客户端业务**

```java
    ServiceConnection serviceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            IMyServer iMyServer = IMyServer.Stub.asInterface(service);
            try {
                iMyServer.getStudentInfo(2, new Student("xiaoming", 18));
            } catch (Exception e) {

            }
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
        }
    };

```

### 总结AIDL 使用自定义数据类型步骤

> 1、构造自定义数据类型同名.aidl文件  
> 2、构造自定义数据类型.java文件  
> 3、在AIDL 接口里使用自定义数据类型

AIDL 数据流方向
------------

### 什么是数据流

回顾一下常用的方法调用方式:

```java
    public void getStudentInfo(int age, Student student) {
        student.setName("modify");
    }

```

形参为：int 类型；Student类型；  
在同一进程里，当调用该方法时，传入Student引用，方法里对Student成员变量进行了更改，方法调用结束后，调用者持有的Student引用所指向的对象其内容已经更改了。而对于int 类型，方法里却无法更改。  
上述涉及到了经典问题：传值与传址。

而对于不同的进程，当客户端调用getStudentInfo(xx)方法时，虽然看起来是直接调用服务端的方法，实际上是底层中转了数据，因此当初传入Student，返回来的已经不是同一个Student引用。  
因此，AIDL 规定了数据流方向。

![](https://raw.githubusercontent.com/shug666/image/main/images/19073098-0c78b9d63b41216b.png)

### 数据流具体使用

从上图可以看出，数据流方向有三种：

> in  
> out  
> inout

为测试它们的差异，分别写三个方法：

```java
package com.fish.myapplication;

import com.fish.myapplication.service.Student;
interface IMyServer {
    void getStudentInfo(int age, in Student student);
    void getStudentInfo2(int age, out Student student);
    void getStudentInfo3(int age, inout Student student);
}

```

基本数据类型如 int、String 默认是数据流类型是: in，不用刻意标注。

**服务端实现方法：**

```java
    private IMyServer.Stub stub = new IMyServer.Stub() {
        @Override
        public void getStudentInfoIn(int age, Student student) throws RemoteException {
            Log.d(TAG, "student name:" + student.getName() + " in server in getStudentInfoIn");
            student.setName("change name getStudentInfoIn");
        }

        @Override
        public void getStudentInfoOut(int age, Student student) throws RemoteException {
            Log.d(TAG, "student name:" + student.getName() + " in server in getStudentInfoOut");
            student.setName("change name getStudentInfoOut");
        }

        @Override
        public void getStudentInfoInout(int age, Student student) throws RemoteException {
            Log.d(TAG, "student name:" + student.getName() + " in server in getStudentInfoInout");
            student.setName("change name getStudentInfoInout");
        }
    };

```

将Student name 打印出来，并更改name 内容。  
**客户端调用服务端方法：**

```java
    ServiceConnection serviceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            IMyServer iMyServer = IMyServer.Stub.asInterface(service);
            try {
                Student student = new Student("xiaoming", 18);
                Log.d(TAG, "student name:" + student.getName() + " in client before getStudentInfoIn");
                iMyServer.getStudentInfoIn(2, student);
                Log.d(TAG, "student name:" + student.getName() + " in client after getStudentInfoIn");


                Student student2 = new Student("xiaoming", 18);
                Log.d(TAG, "student name:" + student2.getName() + " in client before getStudentInfoOut");
                iMyServer.getStudentInfoOut(2, student2);
                Log.d(TAG, "student name:" + student2.getName() + " in client after getStudentInfoOut");

                Student student3 = new Student("xiaoming", 18);
                Log.d(TAG, "student name:" + student3.getName() + " in client before getStudentInfoInout");
                iMyServer.getStudentInfoInout(2, student3);
                Log.d(TAG, "student name:" + student3.getName() + " in client after getStudentInfoInout");

            } catch (Exception e) {

            }
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
        }
    };

```

构造Student 对象，并分别打印调用服务端方法前后Student name名字。  
当编译的时候，发现编译不过，还需要在Student.java 里添加方法：

```java
    public Student() {}
    public void readFromParcel(Parcel parcel) {
        this.name = parcel.readString();
        this.age = parcel.readInt();
    }

```

运行后结果如下：

![](https://raw.githubusercontent.com/shug666/image/main/images/19073098-96ff16f4d71269e5.png)

总结一下规律：

> 1、使用 in 修饰Student，服务端收到Student的内容，更改name后，客户端收到Student，其name 并没有改变。表示数据流只能从客户端往服务端传递。  
> 2、使用 out 修饰Student，服务端并没有收到Student的内容，更改name后，客户端收到Student，其name 已经改变。表示数据流只能从服务端往客户端传递。  
> 3、使用 inout 修饰Student，服务端收到Student的内容，更改name后，客户端收到Student，其name 已经改变。表示数据流能在服务端和客户端间传递。

### 数据流在代码里的实现

AIDL 文件最终生成.java 文件，因此在该文件里找答案。  
**当使用 in 修饰时：**  
对于客户端，将Student数据写入序列化对象。

```java
          if ((student!=null)) {
            _data.writeInt(1);
            student.writeToParcel(_data, 0);
          }

```

对于服务端，并没有将Student写入回复的序列化对象。  
**当使用 out 修饰时**  
对于客户端，没有将Student数据写入序列化对象。  
对于服务端，将Student写入回复的序列化对象。

```java
          _arg1 = new com.fish.myapplication.service.Student();
          this.getStudentInfoOut(_arg0, _arg1);
          reply.writeNoException();
          if ((_arg1!=null)) {
            reply.writeInt(1);
            //写入reply
            _arg1.writeToParcel(reply, android.os.Parcelable.PARCELABLE_WRITE_RETURN_VALUE);
          }

```

**当使用 inout 修饰时**  
实际上就是 in out 的结合。