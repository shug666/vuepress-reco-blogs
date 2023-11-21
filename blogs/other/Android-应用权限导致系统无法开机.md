---
title: Android 应用权限导致系统无法开机
date: 2023-02-21
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 一、问题发生的现象及日志打印

### 1.1 问题发生现象

  开机向导中增加蓝牙、WIFI及设置时区的权限后，adb push到手机里面，重启手机无法开机，卡到开机动画界面，无法进入开机向导。

### 1.2 Log打印分析

  从日志看应该是应用本身是priv级别的app，并且申请了BLUETOOTH\_PRIVILEGE、WRITE\_SECURE\_SETTINGS、INTERACT\_ACROSS\_USERS和SET\_TIME\_ZONE，但是没有在权限白名单中添加，所以导致类似日志打印，最终会导致system server重启，系统无法开机。

```c
11-10 07:03:49.084  2392  2392 W PackageManager: Privileged permission android.permission.BLUETOOTH_PRIVILEGED for package com.dten.setupwiard - not in privapp-permissions whitelist
11-10 07:03:49.085  2392  2392 W PackageManager: Privileged permission android.permission.WRITE_SECURE_SETTINGS for package com.dten.setupwiard - not in privapp-permissions whitelist
11-10 07:03:49.085  2392  2392 W PackageManager: Privileged permission android.permission.INTERACT_ACROSS_USERS for package com.dten.setupwiard - not in privapp-permissions whitelist
11-10 07:03:49.085  2392  2392 W PackageManager: Privileged permission android.permission.SET_TIME_ZONE for package com.dten.setupwiard - not in privapp-permissions whitelist

//  进而会有如下日志打印，导致system server进程重启
10 06:13:08.174  2645  2645 E System  : ******************************************
11-10 06:13:08.177  2645  2645 E System  : ************ Failure starting system services
11-10 06:13:08.177  2645  2645 E System  : java.lang.IllegalStateException: Signature|privileged permissions not in privapp-permissions whitelist: {com.dten.setupwiard: android.permission.WRITE_SECURE_SETTINGS, com.dten.setupwiard: android.permission.INTERACT_ACROSS_USER
S, com.dten.setupwiard: android.permission.BLUETOOTH_PRIVILEGED, com.dten.setupwiard: android.permission.SET_TIME_ZONE}
11-10 06:13:08.177  2645  2645 E System  :      at com.android.server.pm.permission.PermissionManagerService.systemReady(PermissionManagerService.java:2956)
11-10 06:13:08.177  2645  2645 E System  :      at com.android.server.pm.permission.PermissionManagerService.access$100(PermissionManagerService.java:122)
11-10 06:13:08.177  2645  2645 E System  :      at com.android.server.pm.permission.PermissionManagerService$PermissionManagerServiceInternalImpl.systemReady(PermissionManagerService.java:3017)
11-10 06:13:08.177  2645  2645 E System  :      at com.android.server.pm.PackageManagerService.systemReady(PackageManagerService.java:21902)
11-10 06:13:08.177  2645  2645 E System  :      at com.android.server.SystemServer.startOtherServices(SystemServer.java:2096)
11-10 06:13:08.177  2645  2645 E System  :      at com.android.server.SystemServer.run(SystemServer.java:539)
11-10 06:13:08.177  2645  2645 E System  :      at com.android.server.SystemServer.main(SystemServer.java:367)
11-10 06:13:08.177  2645  2645 E System  :      at java.lang.reflect.Method.invoke(Native Method)
11-10 06:13:08.177  2645  2645 E System  :      at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:492)
11-10 06:13:08.177  2645  2645 E System  :      at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:1050)

```

二、代码逻辑分析
--------------------------------------------------------------------

  根据报错日志定位到代码逻辑是PermissionManagerService.java（frameworks\\base\\services\\core\\java\\com\\android\\server\\pm\\permission）中的grantSignaturePermission()方法

```java
private boolean grantSignaturePermission(String perm, PackageParser.Package pkg,         
        BasePermission bp, PermissionsState origPermissions) {
        .....
       //可以看到，如果该pkg对应的perm不在白名单中，则会下面加入过denied的列表中，导致下面的not in priv的日志打印
        if (!hasPrivappWhitelistEntry(perm, pkg)) {                                       
            // Only report violations for apps on system image                           
            if (!mSystemReady && !pkg.isUpdatedSystemApp()) {                             
                // it's only a reportable violation if the permission isn't explicitly denied          
                ArraySet<String> deniedPermissions = null;                               
                if (pkg.isVendor()) {                                                     
                    deniedPermissions = SystemConfig.getInstance()                       
                            .getVendorPrivAppDenyPermissions(pkg.packageName);           
                } else if (pkg.isProduct()) {                                             
                    deniedPermissions = SystemConfig.getInstance()                       
                            .getProductPrivAppDenyPermissions(pkg.packageName);           
                } else if (pkg.isProductServices()) {                                     
                    deniedPermissions = SystemConfig.getInstance()                       
                            .getProductServicesPrivAppDenyPermissions(pkg.packageName);   
                } else {                                                                 
                    deniedPermissions = SystemConfig.getInstance()                       
                            .getPrivAppDenyPermissions(pkg.packageName);                 
                }                                                                         
                final boolean permissionViolation =                                       
                        deniedPermissions == null || !deniedPermissions.contains(perm);                
                if (permissionViolation) {                                               
                    Slog.w(TAG, "Privileged permission " + perm + " for package "         
                            + pkg.packageName + " - not in privapp-permissions whitelist");                                                                                 
                    if (RoSystemProperties.CONTROL_PRIVAPP_PERMISSIONS_ENFORCE) {         
                        if (mPrivappPermissionsViolations == null) {                     
                            mPrivappPermissionsViolations = new ArraySet<>();             
                        }                                                                 
                        mPrivappPermissionsViolations.add(pkg.packageName + ": " + perm); 
                    }                                                                     
                } else {                                                                 
                    return false;                                                         
                }                                                                         
            }                                                                             
            if (RoSystemProperties.CONTROL_PRIVAPP_PERMISSIONS_ENFORCE) {                
                return false;                                                             
            }                                                                             
        }                                                                                 
    }                                                                                     
     ......       
 }
```

由于上面条件，如果对应应用的perm不再权限白名单中，则会增加到deniedPermission中，后面在systemready中会抛出异常，导致system server进程重启。

```java
 private void systemReady() {      
     mSystemReady = true;                                                                 
     if (mPrivappPermissionsViolations != null) {                                        
         throw new IllegalStateException("Signature|privileged permissions not in "               
                 + "privapp-permissions whitelist: " + mPrivappPermissionsViolations);            
     }                                                                                                                                                             
     mPermissionControllerManager = mContext.getSystemService(PermissionControllerManager.class); 
     mPermissionPolicyInternal = LocalServices.getService(PermissionPolicyInternal.class);        
 }                                                                                                
```



 所以问题的关键是hasPrivappWhitelistEntry方法，我们重点看下这个方法，该方法中如果是product下则权限白名单是从通过SystemConfig类中getProductPrivAppPermissions方法。

```java
 private boolean hasPrivappWhitelistEntry(String perm, PackageParser.Package pkg) {       
     ArraySet<String> wlPermissions = null;
     ....
     if (pkg.isProduct()) {                                                          
         wlPermissions = SystemConfig.getInstance().getProductPrivAppPermissions(pkg.packageName);  
     } 
     ....
     // Let's check if this package is whitelisted...                                     
     boolean whitelisted = wlPermissions != null && wlPermissions.contains(perm);      
     // If it's not, we'll also tail-recurse to the parent.                               
     return whitelisted ||                                                               
     pkg.parentPackage != null && hasPrivappWhitelistEntry(perm, pkg.parentPackage);
 }   
```

SystemConfig的getProductPrivAppPermissions方法很简单，只是返回mProductPrivAppPermissions 数据类型，是一个ArrayMap的数据结构，以应用包名为key，存储应用的priv-app 的权限白名单。

```java
final ArrayMap<String, ArraySet<String>> mProductPrivAppPermissions = new ArrayMap<>(); 
```

 到目前为止，逻辑就很简单了，重点看下mProductPrivAppPermissions是如何添加元素即可，根据代码逻辑，mProductPrivAppPermissions是通过系统在开机过程中读取/product/etc/permissions/ 、/vendor/etc/permissions/ 、/system/etc/permissions/ 下的xml文件所得。因此我们需要给开机向导应用增加对应的权限白名单。

三、解决方案思路
--------------------------------------------------------------------

  根据第二块的代码分析，解决思路就比较清楚了，关键是给开机向导app增加权限白名单。

### 3.1 第一种尝试

  在privapp-permissions-platform.xml（frameworks/base/data/etc/）中增加如下代码，进行验证，adb push 到手机中进行验证，发现问题并没没有解决。

```xml
<permissions>
    <privapp-permissions package="com.dten.setupwiard">
        <permission name="android.permission.SET_TIME_ZONE"/>
        <permission name="android.permission.WRITE_SECURE_SETTINGS"/>
        <permission name="android.permission.BLUETOOTH_PRIVILEGED"/>
        <permission name="android.permission.INTERACT_ACROSS_USERS"/>
    </privapp-permissions>
</permissions>
```

进一步分析代码，可以看到，不同目录下的应用对应的权限文件路径是不一样的，privapp-permissions-platform.xml文件被编译到/system/etc/permissions/下，所以只对/system/priv-app/下的应用有效果。而决定xml文件编译到那个路径下，是在frameworks/base/data/etc/Andoid.bp来决定的。

```
prebuilt_etc {                               
    name: "privapp-permissions-platform.xml",
    sub_dir: "permissions",                  
    src: "privapp-permissions-platform.xml", 
}                                            

prebuilt_etc {                                      
    name: "privapp_whitelist_com.android.settings", 
    product_specific: true,                         
    sub_dir: "permissions",                         
    src: "com.android.settings.xml",                
    filename_from_src: true,                        
}                                        
```

### 3.2 第二种尝试

  根据第一种尝试的分析，可以仿照com.dten.setting，我们创建一个com.dten.setupwiard.xml，并且在Android.bp中增加如下内容。

```
prebuilt_etc {                                     
    name: "privapp_whitelist_com.dten.setupwiard", 
    product_specific: true,                        
    sub_dir: "permissions",                        
    src: "com.dten.setupwiard.xml",                
    filename_from_src: true,                       
}   
```

如果觉得现在就ok了，可能会空欢喜一场，因为编译完，/product/etc/permissions/下面并没有生产com.dten.setupwiard.xml文件，根据android的编译规则，以及参考com.android.settings，应该是没有将其拷贝到out目录，所以需要在编译对应模块，比如编译com.dten.setupwiard的Android.mk文件中增加如下编译选项。

```bash
LOCAL_REQUIRED_MODULES := privapp_whitelist_com.dten.setupwiard
```

LOCAL\_REQUIRED\_MODULES的作用是当编译整个android 源码时，会将Mms模块在编译路径中依赖的module编译到out目录，并且打包，但是单独编译模块不会拷贝打包。

最后，编译完，烧录到设备中，可以成功开机。问题得到解决。

  

本文转自 [https://blog.csdn.net/franc521/article/details/123570364](https://blog.csdn.net/franc521/article/details/123570364)，如有侵权，请联系删除。