---
title: Android 动态权限
date: 2022-09-17
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## Android 动态申请权限

提示：安卓7.0以上需要动态请求权限

```java
    // 检查某个权限。返回true表示已启用该权限，返回false表示未启用该权限
    public static boolean checkPermission(Activity act,String permission,int requestCode){
        return checkPermission(act,new String[]{permission},requestCode);
    }

    // 检查多个权限。返回true表示已完全启用权限，返回false表示未完全启用权限
    public static boolean checkPermission(Activity act,String[] permissions,int requestCode){

        if (VERSION.SDK_INT >= VERSION_CODES.M){
            int check;
            for (String permission : permissions) {
                check = ContextCompat.checkSelfPermission(act, permission);
                if (check != PackageManager.PERMISSION_GRANTED){
                    ActivityCompat.requestPermissions(act,permissions,requestCode);
                    return false;
                }
            }
        }
        return true;
    }
    // 检查权限结果数组，返回true表示都已经获得授权。返回false表示至少有一个未获得授权
    public static boolean checkGrant(int[] grantResults) {
        if (grantResults != null) {
            for (int grant : grantResults) { // 遍历权限结果数组中的每条选择结果
                if (grant != PackageManager.PERMISSION_GRANTED) { // 未获得授权
                    return false;
                }
            }
        }
        return true;
    }
```

另一方面还要重写活动的`onRequestPermissionsResult`方法，在方法内部校验用户的选择结果，若用户同意授权，就执行后续业务；若用户拒绝授权，只能提示用户无法开展后续业务了。重写后的方法代码如下所示：

```java
@Override
public void onRequestPermissionsResult(int requestCode, String[] permissions,int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    // requestCode不能为负数，也不能大于2的16次方即65536
    if (requestCode == R.id.btn_file_write % 65536) {
        if (PermissionUtil.checkGrant(grantResults)) { 
            // 用户选择了同意授权
        } else {
            ToastUtil.show(this, "用户拒绝了权限！");
        }
    }
}
```

wifi访问权限需要加上位置的权限，否则扫描获取的wifi结果为0

```xml
<!-- 以下是使用wifi访问网络所需的权限 -->
<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>
<uses-permission android:name="android.permission.CHANGE_WIFI_STATE"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
```
