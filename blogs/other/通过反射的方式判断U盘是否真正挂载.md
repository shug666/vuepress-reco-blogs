---
title: android 通过反射的方式判断U盘是否真正挂载
date: 2022-12-19
tags:
 - android
categories: 
 - android
sticky: 
   true
---

       由于StorageManager.java类中的getVolumeList()和getVolumeState(String mountPoint)方法是hide（隐藏）的，所以需要通过反射的方式获取对应的存储信息。源码./frameworks/base/core/java/android/os/storage/StorageManager.java类中的getVolumeList()跟getVolumeState(String mountPoint)方法如下：

```java

    /**
     * Returns list of all mountable volumes.
     * @hide
     */
    public StorageVolume[] getVolumeList() {
        if (mMountService == null) return new StorageVolume[0];
        try {
            Parcelable[] list = mMountService.getVolumeList();
            if (list == null) return new StorageVolume[0];
            int length = list.length;
            StorageVolume[] result = new StorageVolume[length];
            for (int i = 0; i < length; i++) {
                result[i] = (StorageVolume)list[i];
            }
            return result;
        } catch (RemoteException e) {
            Log.e(TAG, "Failed to get volume list", e);
            return null;
        }
    }

    /**
     * Gets the state of a volume via its mountpoint.
     * @hide
     */
    public String getVolumeState(String mountPoint) {
         if (mMountService == null) return Environment.MEDIA_REMOVED;
        try {
            return mMountService.getVolumeState(mountPoint);
        } catch (RemoteException e) {
            Log.e(TAG, "Failed to get volume state", e);
            return null;
        }
    }
```

可以通过反射的方式获取 getVolumeList()跟getVolumeState(String mountPoint)的方法，实现如下：

```java
    /**
     * Returns list of all mountable volumes.
     */
    public static StorageVolume[] getVolumeList(StorageManager storageManager){
        try {
            Class clz = StorageManager.class;
            Method getVolumeList = clz.getMethod("getVolumeList", null);
            StorageVolume[] result = (StorageVolume[]) getVolumeList.invoke(storageManager, null);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    /**
     * Gets the state of a volume via its mountpoint.
     */
    public static String getVolumeState(StorageManager storageManager, String path){
        String result = "";
        if(null == storageManager || TextUtils.isEmpty(path)){
            return result;
        }
        try {
            Class clz = StorageManager.class;
            Method getVolumeList = clz.getMethod("getVolumeState", String.class);
            result = (String) getVolumeList.invoke(storageManager, path);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
```

 为了方便使用，把这两个方法封装到了USBUtil.java类中，具体实现如下：

```java
package com.example.helloworld.util;

import java.lang.reflect.Method;

import android.os.storage.StorageManager;
import android.os.storage.StorageVolume;
import android.text.TextUtils;

/**
 * Created by ryan on 01/03/2018.
 */

public class USBUtil {
    private static final USBUtil mUtil = new USBUtil();
   

    public static USBUtil getInstance() {
        return mUtil;
    }
    /**
     * Returns list of all mountable volumes.
     */
    public static StorageVolume[] getVolumeList(StorageManager storageManager){
        try {
            Class clz = StorageManager.class;
            Method getVolumeList = clz.getMethod("getVolumeList", null);
            StorageVolume[] result = (StorageVolume[]) getVolumeList.invoke(storageManager, null);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
    
    /**
     * Gets the state of a volume via its mountpoint.
     */
    public static String getVolumeState(StorageManager storageManager, String path){
        String result = "";
        if(null == storageManager || TextUtils.isEmpty(path)){
            return result;
        }
        try {
            Class clz = StorageManager.class;
            Method getVolumeList = clz.getMethod("getVolumeState", String.class);
            result = (String) getVolumeList.invoke(storageManager, path);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
    
}

```

接下来是方法的使用，通过UsbTest.java类来进行界面测试，具体实现如下：

```java
package com.example.helloworld;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.os.storage.StorageManager;
import android.os.storage.StorageVolume;
import android.view.View;
import android.widget.TextView;

import com.example.helloworld.util.Logger;
import com.example.helloworld.util.USBUtil;


public class UsbTest extends Activity{
	private StorageManager storageManager;
	Context context;
	TextView mTextView;
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.usb);
		context = UsbTest.this;
		storageManager = (StorageManager) context.getSystemService(Context.STORAGE_SERVICE); //存储服务初始化
		mTextView = (TextView) findViewById(R.id.show_tv);
	}
	
	public void startVoice(View view){
		Logger.d();
		if (USBExist(context)){
			mTextView.setText("USB is exist!");
		}else {
			mTextView.setText("USB isn't exist!");
		}
    }
    
    
    public void finishVoice(View view){
    	Logger.d();
    	finish();
    }

    //判断/storage/udisk是否为挂载的路径
    private boolean USBExist(Context context){
    	if (null == storageManager){
    		Logger.d("Invalid reference to StorageManager received.");
    		return false;
    	}
    	String usbPath = getUSBPath(context);
    	if (USBUtil.getVolumeState(storageManager, usbPath).equals(android.os.Environment.MEDIA_MOUNTED)){
    		return true;
    	}
    	
    	return false;
    }
    
    //判断USB路径（/storage/udisk）是否存在
    private String getUSBPath(Context context){
    	Logger.d();
    	String usb = null;
    	StorageVolume[] volumes = USBUtil.getVolumeList(storageManager);
    	for (int i = 0; i < volumes.length; i++){
    		if (volumes[i].isRemovable() && volumes[i].getDescription(context).contains("USB")){
    			usb = volumes[i].getPath();
    			Logger.d("usb = " + usb);
    			if (usb.equals("/storage/udisk")){
    				break;
    			}
    		}
    	}
    	return usb;
    }
	
}

```

usb.xml布局如下：

```xml
<?xml version="1.0" encoding="utf-8"?><LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical" >
    <TextView
        android:id="@+id/show_tv"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:textSize="18sp"/>
    <Button 
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:onClick="startVoice"
        android:text="@string/usb_check"/>
    <Button 
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:onClick="finishVoice"
        android:text="@string/version_quit"/>

</LinearLayout>

```

 代码参考：[https://github.com/gunder1129/android-tool/tree/master/AIDLdemo/SimpleJarClient](https://github.com/gunder1129/android-tool/tree/master/AIDLdemo/SimpleJarClient)

注意：由于用到源码中的./frameworks/base/core/java/android/os/storage/StorageManager.java类，所以需要Android的系统平台进行编译。

  
