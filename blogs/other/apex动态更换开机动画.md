---
title: apex 动态更换开机动画
date: 2023-11-18
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 环境

环境：Ubuntu20.04

Android版本：Android12 AOSP

## 内容介绍

通过使用Android10的一个新内容**apex**文件来实现动态替换系统开机动画，apex文件是以\*\*.apex\*\*后缀结尾，可以不用root权限来通过adb命令安装这个文件后就可以替换开机动画。

APEX文件
-----------------------------------------------------------------------

### APEX 格式

APEX 文件的格式如下图  
![请添加图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesfb0d5f38cc8d4a55999dee2c1fa21923.png)

APEX文件中有四个文件，它们分别是

*   `apex_manifest.json`：这个文件里有软件的包名称和版本信息，可以用来标识文件。
    
*   `AndroidManifest.xml`：这个文件允许 APEX 文件使用与 APK 相关的工具和基础架构，例如 ADB、PackageManager 和软件包安装程序应用等。这个文件还包含软件包名称和版本信息。
    
*   `apex_payload.img`：是由 dm-verity 支持的 ext4 文件系统映像。该映像通过环回设备在运行时装载。常规文件包含在 **apex\_payload.img** 文件中。
    
*   `apex_pubkey`：是用于为文件系统映像签名的公钥。在运行时，此密钥可确保使用为内置分区中的相同 APEX 签名的同一实体为已下载的 APEX 签名。
    

这个文件结构是编译后生成的apex文件结构，而生成apex文件的步骤在下面。

附上官网文档链接：[APEX 文件格式](https://source.android.google.cn/docs/core/ota/apex)

## 构建 APEX

构建APEX文件需要我们编写**Android.bp**、**apex\_manifest.json**、**AndroidManifest.xml**和**file\_contexts**这四个文件，并且还需要生成签名文件。

下面以一个名叫`com.android.bootanimation`的APEX应用包为例介绍怎样构建APEX应用包

### 1、创建工程目录

首先新建一个名叫`bootanimation`的文件夹，然后在`bootanimation`文件夹下新建一个`apex`文件夹

```bash
mkdir -p bootanimation/apex
cd bootanimation/apex
```

我这里是将`bootanimation/apex`目录放到源码根目录`system/`目录下

*   这个可以自己选择存放路径，只有是在源码根目录下就行

### 2、创建 AndroidManifest.xml 文件

在`bootanimation/apex`目录下创建`AndroidManifest.xml`文件

```bash
touch AndroidManifest.xml
```

打开`AndroidManifest.xml`文件，编写内容

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="com.android.bootanimation">
  <!-- APEX does not have classes.dex -->
  <application android:hasCode="false" />
</manifest>
```

### 3、创建 apex\_manifest.json 文件

在`bootanimation/apex`目录下创建`apex_manifest.json`文件

```bash
touch apex_manifest.json
```

打开`apex_manifest.json`文件，编写内容

```json
{
  "name": "com.android.bootanimation",
  "version": 1
}
```

*   这里说明一下，如果编译成功了，启动设备使用**adb**命令查看设备`apex/` 目录，如果出现了 `com.android.bootanimation`、`com.android.bootanimation@1`这两个文件就代表成功了，`@1`就表示我们的apex文件版本号信息。

### 4、添加 file\_context 文件

先创建一个file\_context文件

```bash
touch com.haley.demo-file_contexts
```

将创建的`com.haley.demo-file_contexts`文件放在源码目录`/system/sepolicy/apex/`里面。

文件内容为

```makefile
(/.*)?                u:object_r:system_file:s0
/lib(64)?(/.*)        u:object_r:system_lib_file:s0
/bin/mediaswcodec     u:object_r:mediaswcodec_exec:s0
```

### 5、创建 Android.bp 文件

在编写Android.bp文件之前首先来简要介绍下这个文件

Android.bp 文件中的模块以`模块类型`开头，然后是一组格式属性：`name: value`。例如：

```makefile
prebuilt_etc {
  name: "com.android.bootanimation_etc",
  src: "bootanimation.zip",
  filename: "bootanimation.zip",
  //installable: true,
}
```

其中每个模块都必须具有 `name` 属性，并且相应值在所有 `name` 文件中必须是唯一的，仅有两个例外情况是命名空间和预构建模块中的 `Android.bp` 属性值，这两个值可能会重复。

如果指定了模块类型（在代码块的开头），就需要设定该模块的`name` 。此设置会为模块命名，生成的 APEX 将与模块名称相同，不过带有 `.apex` 后缀。下面这个例子中生成的apex文件名字为`com.android.bootanimation.apex`。并且我们定义了模块后都需要在apex模块对应的属性中导入进来，这样那些定义了的模块才能生效，如下：

```makefile
// apex模块
apex {
    name: "com.android.bootanimation",
    prebuilts: ["com.android.bootanimation_etc"],  // 我们定义的prebuilt_etc模块，以名字导入
    manifest: "apex_manifest.json",  // 导入apex_manifest.json文件
}
```

`Android.bp`文件的编写

（1）`Android.bp`文件

在`bootanimation/apex`目录下创建`Android.bp`文件

```bash
touch Android.bp
```

（2）打开`Android.bp`文件，编写内容

```makefile
// 预设一些APEX值
apex_defaults {
    name: "com.android.bootanimation_defaults",
    //updatable: true,
    min_sdk_version: "31",

    // 使用自定义AndroidManifest.xml文件
    androidManifest: ":com.android.bootanimation-androidManifest",

    // 预设file_contexts文件
    file_contexts: ":com.android.bootanimation-file_contexts",

    // 共享签名信息，并设置certificate属性为系统签名
    key: "apex.bootanimation.key",
    certificate: "platform",
    
    // 预设我们自己预构建的模块
    prebuilts: ["com.android.bootanimation_etc"],
}

// AndroidManifest.xml模块
filegroup {
    name: "com.android.bootanimation_androidManifest",
    srcs: ["AndroidManifest.xml"],
}

// vbmeta 签名文件模块
apex_key {
    name: "apex.bootanimation.key",
    public_key: "com.android.bootanimation.avbpubkey",
    private_key: "com.android.bootanimation.pem",
}

// 预构建资源模块
prebuilt_etc {
  name: "com.android.bootanimation_etc",
  src: "bootanimation.zip",
  filename: "bootanimation.zip",
  //installable: true,
}

// apex模块
apex {
    name: "com.android.bootanimation",
    defaults: ["com.android.bootanimation_defaults"],
    manifest: "apex_manifest.json",
    updatable: true, //可更新
}
```

### 6、进行 vbmeta 签名

以我们构建的`com.android.bootanimation`为例

```bash
source build/envsetup.sh
lunch 12     # lunch 自己的系统
cd bootanimation/apex # 进入apex文件目录
openssl genrsa -out com.android.bootanimation.pem 4096  # 执行后会生成com.android.bootanimation.pem文件

avbtool extract_public_key --key com.android.bootanimation.pem --output com.android.bootanimation.avbpubkey  # 执行后会生成com.android.bootanimation.avbpubkey文件
```

*   签名注意 apex\_key 的 name 要和 **.key**、**.avbpubkey** _命名要一致。_
    
*   在执行第二条命令前我们需要先在源码根目录下导入 `source build/envsetup.sh` 环境并且`lunch`我们的Android系统后才能成功执行
    
*   执行完成后将生成的两个签名文件放入`bootanimation/apex`目录下，最好是在这个目录下执行命令
    

签名完成后我们需要在`Android.bp`文件中添加签名模块，上面**Android.bp**文件中已添加，没有添加就加入即可，语句如下：

```makefile
// in Android.bp
apex_key {
    name: "com.android.bootanimation.key",
    public_key: "com.android.bootanimation.avbpubkey",
    private_key: "com.android.bootanimation.pem",
}
```

### 7、进行 ZIP 签名

因为APEX类似于APK，所以我们可以使用为 APK 签名的方式为 APEX 签名。这里一个需要为 APEX 进行两次签；一次针对迷你文件系统（`apex_payload.img` 文件），另一次针对整个文件。

```makefile
certificate: "platform"
```

*   这里具体签名方法我还不知道怎样操作，我的做法是在`Android.bp`中添加 **certificate** 属性来对APEX进行系统签名，已在**Android.bp**文件添加即可跳过

### 8、加入我们的动画资源包

将动画包 **bootanimation.zip** 添加到`bootanimation/apex`目录下

在Android.bp文件中添加预构建模块，语句如下：

```makefile
// 预构建资源模块
prebuilt_etc {
  name: "com.android.bootanimation_etc",
  src: "bootanimation.zip",
  filename: "bootanimation.zip",
  //installable: true,
}
```

*   已在Android.bp文件中添加则不需要再添加

### 9、单独编译 apex 生成 apex 包

开始编译我们自己的`apex`模块

进入源码根目录，导入环境后单独编译我们的`bootanimation/apex`目录

```bash
source build/envsetup.sh

mmm bootanimation/apex # 这个路径以自己的实际路径为准
```

*   注意这里我们只是生成apex包，如果需要先将apex包内置进系统，则这步可直接跳过进行下一步即可

编译 apex 模块时，会在 `out/soong/.intermediates/device/generic/haley/apex/test` 生成 apex 的临时文件。编译成功后拷贝到 `out/target/product/generic_car_x86/system/apex` 目录下。

需要说明一点的是如果系统中没有安装对应的apex应用，那我们通过adb安装apex包时会报以下错误

```basic
Error [1] [apexd verification failed : No preinstalled apex found for package com.android.bootanimation]
```

这个是系统为了安全原因， 不允许安装新应用， 只可以更新。 解决方案是可以将我们的 **apex** 加入到系统环境中， 添加到 device 目录的makefile 中，下面我们就介绍怎样添加。

### 10、系统预装 apex

我们将我们的包名添加到系统环境中，我们在源码根目录下找到文件`/build/make/target/product/base_system.mk`，在`base_system.mk`文件这个位置中加入我们的包名称

```bash
# Base modules and settings for the system partition.
PRODUCT_PACKAGES += \
    apex \
    com.android.bootanimation \
```

然后我们进入源码根目录，导入环境后开始整编源码

```bash
source build/envsetup.sh # 导入环境
lunch   # 选择系统，选择自己的系统
make -j6 2>&1 | tee build.log  # 编译并输出编译日志
make snod  # 快速打包生成最新的system.img文件，如果上一步已经生成最新的镜像文件则这一步可以不用
```

*   这里需要提到的是我们在将包名加入到环境中时最好是不要修改`/build`这个目录下的文件，这个是系统最基本的一个配置目录。我们一般是在 `/device` 目录进行修改
    
*   这里我添加到`/build`目录的原因是我没有在`/device` 目录下找到对应的一个配置文件，后面如果在`/device` 目录中找到了对应的配置文件则进行相应调整即可
    
*   一般在`device/rockchip/CPU_TYPE/device.mk`文件里添加
    

## 安装APEX

现在在设备中已经有了预装的apex应用，下面就可以进行安装和更新制作的apex应用了，需要到`out/target/product/generic_car_x86/system/apex`目录里面找到生成的apex包

```bash
adb install apex_file_name  #  apex_file_name就是我们的apex包的路径
adb reboot  # 重启设备
```

如果需要卸载安装的最新版本的apex包则需要删除设备`/data/apex/active`目录下对应版本的包

## 使用 APEX

重新启动后，APEX 会装载到 `/apex/<apex_name>@<version>` 目录中。可以同时装载同一 APEX 的多个版本。在装载路径中，对应于最新版本的路径绑定装载到 `/apex/<apex_name>`。

客户端可以使用绑定装载路径从 APEX 读取或执行文件。

通常可按如下方式使用 APEX：

1.  OEM 或 ODM 会在设备出厂时在 `/system/apex` 下预加载 APEX。
    
2.  通过 `/apex/<apex_name>/` 路径访问 APEX 中的文件。
    
3.  在 `/data/apex` 中安装 APEX 的更新后版本后，该路径将在重新启动后指向新的 APEX。
    

这是Android官网文档上的原话，如需了解详细情况，可以去官网上看看。

## 更新APEX

更新**apex**包时需要新的资源包和更新**json**文件和**xml**文件里的版本号，还需要在**bp**文件中加入`updatable: true`语句来让apex包可更新

（1）在json文件中修改`"version": 1`语句后面的数字，比如现在版本号为1，将版本号改为2

```makefile
{
  "name": "com.android.bootanimation",
  "version": 2
}
```

（2）修改完成后将更新好的资源包放在对应位置重新编译模块就可。

## 卸载APEX

目前我卸载apex更新包的方法还不知道，我的做法是通过删除设备`data/apex/active/` 目录下安装的对应版本的apex包，具体操作是：

链接设备后开启**root**权限，然后删除`data/apex/active/`目录下对应的文件后重启设备

```bash
adb root  # 打开root权限
adb shell  # 进入设备目录
rm data/apex/active/com.android.bootanimation@6  # 删除对应文件
adb reboot  # 重启设备
```

## 配置系统以支持 APEX 更新

将以下系统属性设置为 `true` 以支持 APEX 文件更新。

```makefile
<device.mk>:

PRODUCT_PROPERTY_OVERRIDES += ro.apex.updatable=true

BoardConfig.mk:
TARGET_FLATTEN_APEX := false
```

或者仅设置

```makefile
<device.mk>:

$(call inherit-product, $(SRC_TARGET_DIR)/product/updatable_apex.mk)
```

*   **device.mk**的路径为 `device/rockchip/CPU_TYPE/device.mk`

## 问题记录

adb 安装apex出错

```makefile
ai@lai-lai:~/Android_12_AOSP$ adb install /home/lai/Android_12_AOSP/out/target/product/generic_car_x86/system/apex/com.android.bootanimation.apex
Performing Streamed Install
adb: failed to install /home/lai/Android_12_AOSP/out/target/product/generic_car_x86/system/apex/com.android.bootanimation.apex: Error [1] [apexd verification failed : No preinstalled apex found for package com.android.bootanimation]
```

设备中没有预先安装apex包，系统是不能安装新的apex包的

制作新的apex包有问题

```
尝试更新apex包里面的动画包，每次重新编译都是以前的动画包，就好像没有效果。做法是将我源码目录下的动画包替换成另一个动画包然后重新编译的，然后生成的新的apex包没有变化
```

需要在Android.bp文件中加上`updatable: true,`让apex包可以更新，并且需要更改apex\_manifest.json

在板子上安装apex包出错

```makefile
lai@lai-lai:~$ adb install /home/lai/文档/开关机动画资源/自制/apex包/v2/com.android.bootanimation.apex
Performing Streamed Install
adb: failed to install /home/lai/文档/开关机动画资源/自制/apex包/v2/com.android.bootanimation.apex: 
Exception occurred while executing 'install':
java.lang.IllegalArgumentException: This device doesn't support the installation of APEX files
  at com.android.server.pm.PackageInstallerService.createSessionInternal(PackageInstallerService.java:643)
  at com.android.server.pm.PackageInstallerService.createSession(PackageInstallerService.java:519)
  at com.android.server.pm.PackageManagerShellCommand.doCreateSession(PackageManagerShellCommand.java:3161)
  at com.android.server.pm.PackageManagerShellCommand.doRunInstall(PackageManagerShellCommand.java:1343)
  at com.android.server.pm.PackageManagerShellCommand.runInstall(PackageManagerShellCommand.java:1305)
  at com.android.server.pm.PackageManagerShellCommand.onCommand(PackageManagerShellCommand.java:193)
  at com.android.modules.utils.BasicShellCommandHandler.exec(BasicShellCommandHandler.java:97)
  at android.os.ShellCommand.exec(ShellCommand.java:38)
  at com.android.server.pm.PackageManagerService.onShellCommand(PackageManagerService.java:24932)
  at android.os.Binder.shellCommand(Binder.java:950)
  at android.os.Binder.onTransact(Binder.java:834)
  at android.content.pm.IPackageManager$Stub.onTransact(IPackageManager.java:4891)
  at com.android.server.pm.PackageManagerService.onTransact(PackageManagerService.java:8890)
  at android.os.Binder.execTransactInternal(Binder.java:1184)
  at android.os.Binder.execTransact(Binder.java:1143)
```

问题：设备不支持安装APEX文件

需要修改系统配置以支持apex包的更新

通过搜索项目源码目录里`This device doesn't support the installation of APEX files`这条语句搜到了下面内容

执行语句

```bash
grep "This device doesn't support the installation of APEX files" ./ -rn
```

搜索到的内容

```java
./frameworks/base/services/core/java/com/android/server/pm/PackageInstallerService.java:644:                    "This device doesn't support the installation of APEX files");

./cts/hostsidetests/stagedinstall/app/src/com/android/tests/stagedinstall/StagedInstallTest.java:724:                "This device doesn't support the installation of APEX files",
```
```makefile
lai@lai-lai:~/git/gt-cockpit-rk3588$ adb install /home/lai/文档/开关机动画资源/ 自制/apex包/v3/com.android.bootanimation.apex
Performing Streamed Install
adb: failed to install /home/lai/文档/开关机动画资源/自制/apex包/v3/com.android.bootanimation.apex: Error [1] [APK-container signature of APEX package com.android.bootanimation with version 0 and path /data/app-staging/session_870137356/base.apex is not compatible with the one currently installed on device]
```

 

  

本文转自 [https://blog.csdn.net/etrospect/article/details/128582957#t13](https://blog.csdn.net/etrospect/article/details/128582957#t13)，如有侵权，请联系删除。