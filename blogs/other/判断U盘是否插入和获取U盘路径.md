---
title: android 判断U盘是否插入和获取U盘路径
date: 2022-12-19
tags:
 - android
categories: 
 - android
sticky: 
   true
---



## 方式一

作用：只判断是否存在usb路径

1.  使用 adb查看存在 usb时的路径
2.  通过 File判断usb是否存在

```java
	/**
     *
     * @param path 文件夹路径
     */
    public boolean isExist(String path) {
        File file = new File(path);
        //判断文件夹是否存在,如果不存在则创建文件夹
        if (!file.exists()) {
            return false;
        }
        return true;
    }

```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200907104410866.png#)

方式二
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

作用：可查看 usb设备节点及信息（此方法不建议用来检测usb路径）

*   如果不重启设备的前提下，拔插usb再检测时，它的 key会累积起来。检测完之后清空后还是会叠加。

```java
	/*
    * 检测Usb
    * */
    HashMap<String, UsbDevice> deviceHashMap;
    private void detectUsbDeviceWithUsbManager() {
        int i = 0;
        Log.d("----------------", "----------------------------------");
        deviceHashMap = ((UsbManager) getSystemService(USB_SERVICE)).getDeviceList();

        for (Map.Entry entry : deviceHashMap.entrySet()) {
            Log.d("Usb", "----===UsbUsbUsb----detectUsbDeviceWithUsbManager: " + entry.getKey() + ", " + entry.getValue());
            i++;
        }
       
    }

```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200907105219846.png#)

## 方式三

作用：监听 usb拔插

```java
public class USBBroadcastReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            // TODO Auto-generated method stub
            if (intent.getAction().equals("android.hardware.usb.action.USB_STATE")) {
                if (intent.getExtras().getBoolean("connected")) {
                    // usb 插入
                    Toast.makeText(context, "插入", Toast.LENGTH_LONG).show();
                } else {
                    //   usb 拔出
                    Toast.makeText(context, "拔出", Toast.LENGTH_LONG).show();
                }
            }
        }
    }

```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200907105425446.png#)

## 方式四  

作用：列出存在usb接口的信息

```java
private void detectUsbDeviceWithInputManager() {
        InputManager im = (InputManager) getSystemService(INPUT_SERVICE);
        int[] devices = im.getInputDeviceIds();
        for (int id : devices) {
            InputDevice device = im.getInputDevice(id);
            Log.d("----------------", "-------===id: " + id);
            Log.d("----------------", "-------===name: " + device.getName());
        }
    }

```

##  获取U盘路径

```java
private String initUsbList() {
    StorageManager storageManager = (StorageManager) getActivity().getSystemService(Context.STORAGE_SERVICE);
    List<VolumeInfo> volumes = storageManager.getVolumes();
    int count = volumes == null ? 0 : volumes.size();
    VolumeInfo volume = null;
    for (int i = 0; i < count; i++) {
        volume = volumes.get(i);
        if (volume.disk != null && (volume.disk.isUsb() || volume.disk.isSd())) {
            if (volume.state != VolumeInfo.STATE_MOUNTED) {
                continue;
            }
            return volume.path;
        }
    }
    return null;
}
```

```java
public static String getUSBInternalPath(Context context){
        StorageManager mStorageManager = (StorageManager) context.getSystemService(Context.STORAGE_SERVICE);
        try {
            Class<?> volumeInfoClazz = Class.forName("android.os.storage.VolumeInfo");
            Method getVolumesMethod = mStorageManager.getClass().getMethod("getVolumes");
            List<?> volumeInfoList = (List<?>)getVolumesMethod.invoke(mStorageManager);
            for (int i = 0; i < volumeInfoList.size(); i++){
                Object volumeInfo = volumeInfoList.get(i);
                Method getDiskMethod = volumeInfoClazz.getMethod("getDisk");
                Object diskInfo = getDiskMethod.invoke(volumeInfo);
                if(diskInfo != null) {
                    Class<?> diskInfoClazz = Class.forName("android.os.storage.DiskInfo");
                    Method isUsbMethod = diskInfoClazz.getDeclaredMethod("isUsb");
                    Boolean isUsb = (Boolean) isUsbMethod.invoke(diskInfo);
                    Log.d("hxr", "getUSBPath isUsb = " + isUsb);
                    if(isUsb){
                        Method getPathMethod = volumeInfoClazz.getMethod("getPath");
//                        Method getInternalPathMethod = volumeInfoClazz.getMethod("getInternalPath");
                        File path = (File) getPathMethod.invoke(volumeInfo);
//                        File internalPath = (File) getInternalPathMethod.invoke(volumeInfo);
                        Log.d("hxr","getUSBPath path = "+(path==null?"":path.toString())); /* /storage/ECF3-E813 */
//                        Log.d("hxr","getUSBPath internalPath = "+(internalPath==null?"":internalPath.toString()));/* /mnt/media_rw/ECF3-E813 */
                        return path == null?null:path.toString();
                    }
                }
            }
        } catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }
```

## 判断是否插入U盘

```java
private String checkDisk(Context context) {
        boolean usb1 = false,usb2 = false;
        StorageManager manager = (StorageManager) context.getSystemService(Context.STORAGE_SERVICE);
        List<VolumeInfo> list = manager.getVolumes();
        for (VolumeInfo volumeInfo : list) {
            if (volumeInfo.getType() == VolumeInfo.TYPE_PUBLIC) {
                DiskInfo diskInfo = volumeInfo.getDisk();
                if (diskInfo != null) {
                    if (volumeInfo.getState() == VolumeInfo.STATE_MOUNTED) {// i == 2 : mounted ,i == 5 :unmounted.
                        if (diskInfo.sysPath.contains("1-2:1.0")) {
                            usb1 = true;
                            continue;
                        }
                        if (diskInfo.sysPath.contains("1-3:1.0")){
                            usb2 = true;
                        }
                    }
                }
            }
        }
        return "USB1 "+usb1+",USB2 "+usb2;
    }
```

```java
public static Boolean checkDisk(String subName) {
        File Usbfile = new File("/sys/bus/usb/devices");
        File[] files = Usbfile.listFiles();
        if (files != null && files.length > 0) {
            for (File file : files) {
                if (file.isDirectory()) {
                    if (file.canRead()) {
                        if (file.getName().indexOf(subName) > -1 || file.getName().indexOf(subName.toUpperCase()) > -1) {
                            Log.d("fujia", file.getAbsolutePath() + file.getName());
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
```

