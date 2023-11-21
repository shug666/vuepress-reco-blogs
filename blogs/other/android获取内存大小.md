---
title: android 获取内存空间大小
date: 2022-12-19
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 获取总空间大小

```java
	StorageStatsManager storageStatsManager = (StorageStatsManager)context.getSystemService(STORAGE_STATS_SERVICE);
        try {
            long totalBytes = storageStatsManager.getTotalBytes(StorageManager.UUID_DEFAULT);//总空间大小
            long availBytes = storageStatsManager.getFreeBytes(StorageManager.UUID_DEFAULT);//可用空间大小
            long systemBytes = totalBytes - availBytes;//系统所占不可用空间大小
        } catch (IOException e) {
            e.printStackTrace();
        }
        //想看外部存储时，替换uuid即可

```

转变大小时，需用1000的进制转换

```java
public static String bytes2kb(long bytes){
        int GB = 1000 * 1000 * 1000;
        int MB = 1000 * 1000;
        int KB = 1000;
//格式化小数
        DecimalFormat format = new DecimalFormat("###.0");
        if (bytes / GB >= 1){
            return format.format(bytes / GB) + "GB";
        }
        else if (bytes / MB >= 1){
            return format.format(bytes / MB) + "MB";
        }
        else if (bytes / KB >= 1){
            return format.format(bytes / KB) + "KB";
        }else {
            return bytes + "B";
        }
    }

```

实际上的内存大小计算

```java
public static String bytes2kb(long bytes){
        int GB = 1024 * 1024 * 1024;
        int MB = 1024 * 1024;
        int KB = 1024;
//格式化小数
        DecimalFormat format = new DecimalFormat("###.0");
        if (bytes / GB >= 1){
            return format.format(bytes / GB) + "GB";
        }
        else if (bytes / MB >= 1){
            return format.format(bytes / MB) + "MB";
        }
        else if (bytes / KB >= 1){
            return format.format(bytes / KB) + "KB";
        }else {
            return bytes + "B";
        }
    }

```

以下是洒家个人的记录,适合像我这样的小白观看~  
1 从设置界面看到系统总空间大小  
2 Settings/src/com/android/settings/deviceinfo/StorageDashboardFragment.java  
–>VolumeSizeCallbacks(StorageManager sm,StorageManagerVolumeProvider smvp—>VolumeSizesLoader(sm，smvp,mVolume))  
3 src/com/android/settings/deviceinfo/storage/VolumeSizesLoader.java  
–>getVolumeSize(StorageVolumeProvider storageVolumeProvider, StorageStatsManager stats, VolumeInfo info)->storageVolumeProvider.getTotalBytes(stats, info);  
4 frameworks/base/packages/SettingsLib/src/com/android/settingslib/deviceinfo/StorageVolumeProvider.java  
–>getFreeBytes(StorageStatsManager stats, VolumeInfo volume)<<<StorageStatsManager.java  
5 frameworks/base/packages/SettingsLib/src/com/android/settingslib/deviceinfo/StorageManagerVolumeProvider.java  
–>public long getFreeBytes(StorageStatsManager stats, VolumeInfo volume)–>return stats.getFreeBytes(volume.getFsUuid());  
StorageStatsManager 能直接使用，参数只有一个return stats.getFreeBytes(volume.getFsUuid());  
6 要获取系统的空间大小，自然想打印内置的volume的fsUuid,但打印多处都为空，继续跟return stats.getFreeBytes(volume.getFsUuid());看看是不是还有猫腻  
7 frameworks/base/core/java/android/app/usage/StorageStatsManager.java

```java
public @BytesLong long getFreeBytes(@NonNull UUID storageUuid) throws IOException {
        try {
            return mService.getFreeBytes(convert(storageUuid), mContext.getOpPackageName());
        } catch (ParcelableException e) {
            e.maybeRethrow(IOException.class);
            throw new RuntimeException(e);
        } catch (RemoteException e) {
            throw e.rethrowFromSystemServer();
        }
    }


```

UUID进行转化，在android.os.storage.StorageManager.convert中  
8 frameworks/base/core/java/android/os/storage/StorageManager.java  

```java
public static final String UUID_PRIVATE_INTERNAL = null;
/** {@hide} */
    public static UUID convert(String uuid) {
        if (Objects.equals(uuid, UUID_PRIVATE_INTERNAL)) {
            return UUID_DEFAULT;
        } else if (Objects.equals(uuid, UUID_PRIMARY_PHYSICAL)) {
            return UUID_PRIMARY_PHYSICAL_;
        } else if (Objects.equals(uuid, UUID_SYSTEM)) {
            return UUID_SYSTEM_;
        } else {
            return UUID.fromString(uuid);
        }
    }


```

为null时进行了转换，直接调用就可以了

## 获取运行内存大小

```java
public static String getTotalRam(Context context){
    String path = "/proc/meminfo";
    String firstLine = null;
    String totalRam = "unknown";
    try{
        FileReader fileReader = new FileReader(path);
        BufferedReader br = new BufferedReader(fileReader,8192);
        firstLine = br.readLine().split("\\s+")[1];
        br.close();
    }catch (Exception e){
        e.printStackTrace();
    }
    if(firstLine != null){
        Log.d(TAG, "getTotalRam:" + firstLine);
        int size = Integer.parseInt(firstLine);
        if (size <= 1024 * 1024) {
            return "1GB";
        } else if (size <= 1.5 * 1024 * 1024) {
            return "1.5GB";
        } else if (size <= 2 * 1024 * 1024) {
            return "2GB";
        } else {
            totalRam = String.format(Locale.getDefault(), "%.1fGB", Float.parseFloat(firstLine) / 1024 / 1024);
        }
    }
    return totalRam;
}
```