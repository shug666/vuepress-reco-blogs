---
title: Settings和SharedPreferences异常断电数据丢失的问题
date: 2024-03-21
tags:
 - android
categories: 
 - android
sticky: 
   true
---

# SharedPreferences异常断电数据丢失的问题

**现象：**

连续几次将数据写入SharedPreferences保存后断电。断电前可以看到`/data/data/package\_name/shared\_prefs/\*.xml` 文件内容已修改为最后一次写入数据。上电后在执行读取数据操作前，`/data/data/package\_name/shared\_prefs/\*.xml`的内容始终为最后一次写入内容，但执行读取操作时，xml中内容改变，变为最后一次写入之前的数据

**原因：**

使用sharedpreference保存文件后掉电会出现异常，是由于sharedpreference在保存记录的时候会生成一个bak文件，当保存完成后会删除这个文件，但是删除的时机不确定，这个时候掉电会导致文件没有删除，再次开机后使用sharedpreference时会将源文件删除，将bak文件替换成源文件，就会出现文件没有保存上的情况。  

**对策：**在数据提交后，执行shelll命令sync会立刻更新，bak文件将会被删除

```JAVA
SharedPreferences.Editor editor = sharedPreferences.edit();
editor.putString(KeyName, floatArrayToStr(array));
editor.apply();

try {
    /* 對應斷電數據保存丟失問題 */
    Runtime.getRuntime().exec("sync");
}
catch (IOException e)
{
    e.printStackTrace();
}
```

**拓展：**关于SharedPreferences的更多详细内容学习  

原文链接：https://blog.csdn.net/fanxudonggreat/article/details/80877469

# Settings异常断电数据丢失的问题

在应用开发过程中，经常会做持久化保存，持久化一般分为SharedPreferences和Settings。但是遇到大屏等产品异常断电时，往往存储的数据会丢失甚至损坏。手机或平板没有这个问题是因为该类产品一般都有电池，不会出现异常断电的情况。

> 修改在最下面，主要修改底层文件系统。

对于SharedPreferences而言，只需要执行sync()操作就能强制把内容写到真是的屋里内存。但是Settings这种方式就不行，往往需要修改驱动才能解决。

在Android12中，Settings写操作在以下路径下，它是采用了AtomicFile的方式，这种方式可以避免断电文件损坏，但是避免不了刚写入的数据丢失。

> 路径：`frameworks/base/packages/SettingsProvider/src/com/android/providers/settings/SettingsState.java`

```java
    private void doWriteState() {
        boolean wroteState = false;
        final int version;
        final ArrayMap<String, Setting> settings;
        final ArrayMap<String, String> namespaceBannedHashes;

        synchronized (mLock) {
            version = mVersion;
            settings = new ArrayMap<>(mSettings);
            namespaceBannedHashes = new ArrayMap<>(mNamespaceBannedHashes);
            mDirty = false;
            mWriteScheduled = false;
        }

        synchronized (mWriteLock) {
            if (DEBUG_PERSISTENCE) {
                Slog.i(LOG_TAG, "[PERSIST START]");
            }
            //此处使用的是AtomicFile 
            AtomicFile destination = new AtomicFile(mStatePersistFile, mStatePersistTag);
            FileOutputStream out = null;
            try {
                out = destination.startWrite();

                TypedXmlSerializer serializer = Xml.resolveSerializer(out);
                serializer.startDocument(null, true);
                serializer.startTag(null, TAG_SETTINGS);
                serializer.attributeInt(null, ATTR_VERSION, version);

                final int settingCount = settings.size();
                for (int i = 0; i < settingCount; i++) {
                    Setting setting = settings.valueAt(i);

                    if (writeSingleSetting(mVersion, serializer, setting.getId(), setting.getName(),
                            setting.getValue(), setting.getDefaultValue(), setting.getPackageName(),
                            setting.getTag(), setting.isDefaultFromSystem(),
                            setting.isValuePreservedInRestore())) {
                        if (DEBUG_PERSISTENCE) {
                            Slog.i(LOG_TAG, "[PERSISTED]" + setting.getName() + "="
                                    + setting.getValue());
                        }
                    }
                }
                serializer.endTag(null, TAG_SETTINGS);

                serializer.startTag(null, TAG_NAMESPACE_HASHES);
                for (int i = 0; i < namespaceBannedHashes.size(); i++) {
                    String namespace = namespaceBannedHashes.keyAt(i);
                    String bannedHash = namespaceBannedHashes.get(namespace);
                    if (writeSingleNamespaceHash(serializer, namespace, bannedHash)) {
                        if (DEBUG_PERSISTENCE) {
                            Slog.i(LOG_TAG, "[PERSISTED] namespace=" + namespace
                                    + ", bannedHash=" + bannedHash);
                        }
                    }
                }
                serializer.endTag(null, TAG_NAMESPACE_HASHES);
                serializer.endDocument();
                destination.finishWrite(out);

                wroteState = true;

                if (DEBUG_PERSISTENCE) {
                    Slog.i(LOG_TAG, "[PERSIST END]");
                }
            } catch (Throwable t) {
                Slog.wtf(LOG_TAG, "Failed to write settings, restoring backup", t);
                if (t instanceof IOException) {
                    // we failed to create a directory, so log the permissions and existence
                    // state for the settings file and directory
                    logSettingsDirectoryInformation(destination.getBaseFile());
                    if (t.getMessage().contains("Couldn't create directory")) {
                        // attempt to create the directory with Files.createDirectories, which
                        // throws more informative errors than File.mkdirs.
                        Path parentPath = destination.getBaseFile().getParentFile().toPath();
                        try {
                            Files.createDirectories(parentPath);
                            Slog.i(LOG_TAG, "Successfully created " + parentPath);
                        } catch (Throwable t2) {
                            Slog.e(LOG_TAG, "Failed to write " + parentPath
                                    + " with Files.writeDirectories", t2);
                        }
                    }
                }
                destination.failWrite(out);
            } finally {
                IoUtils.closeQuietly(out);
            }
        }

        if (wroteState) {
            synchronized (mLock) {
                addHistoricalOperationLocked(HISTORICAL_OPERATION_PERSIST, null);
            }
        }
    }
```

 原因如下：

> ​    android的这个AtomicFile不能保证finishWrite操作完成后掉电，再开机数据一定是全部写完后的，以上面的例子来讲：在假设掉电 位置掉电，则开机后这个文件的 stats 还是可能完全没写入。原因是 finishWrite 中的删除备份文件操作 并不能保证写回磁盘，导致重新开机后进 openRead 操作会发现备份文件还在，就会把实际已经写好的 新文件删掉，重新用备份文件来覆盖。所以说，android 的 AtomicFile 只保证这个文件 startWrite 和 finishWrite 之间的写数据原子性，即要么全部完成，要么全部失败。
>
> ​    对于 android 来说，AtomicFile 符合它的设计目标，但是如果有时候你确实想要在 finishWrite 完成后 掉电能看到新数据，其实也是有办法的，目前主要有两种方式：在文件系统挂载的时候加上 MS_DIRSYNC 参数，通过 ioctl 命令配置文件的父目录位 DIRSYNC 模式。前者更方便，缺点是这个挂 载点下的所有目录都会进 DIRSYNC 模式，在文件创建和删除非常频繁的情况下，会有明显的性能损 失；后者通过精确控制需要保护的目录来减少性能损失，但是缺点是要非常清楚哪些目录需要保护，并 且不同文件系统的命令和标志都不一样，需要把你可能用到的所有文件系统的 ioctl 都写一遍，并且有 些文件系统可能不支持这种方式(f2fs 和 ext4 都是两种方式都支持，而 fat 则不支持 ioctl 方式)。 -rk文档介绍

具体修改如下：

```diff
//路径：system/core/fs_mgr/fs_mgr_fstab.cpp
diff --git a/fs_mgr/fs_mgr_fstab.cpp b/fs_mgr/fs_mgr_fstab.cpp
index f5ab5571f..5a0f49c1d 100644
--- a/fs_mgr/fs_mgr_fstab.cpp
+++ b/fs_mgr/fs_mgr_fstab.cpp
@@ -74,6 +74,7 @@ FlagList kMountFlagsList[] = {
         {"slave", MS_SLAVE},
         {"shared", MS_SHARED},
         {"defaults", 0},
+        { "dirsync", MS_DIRSYNC},
 };

 off64_t CalculateZramSize(int percentage) {

//路径：device/rockchip/common/scripts/fstab_tools/fstab.in
//注意：可以参考这个来添加flag，可能不一定是这个文件，需要根据你的产品device来确定
diff --git a/scripts/fstab_tools/fstab.in b/scripts/fstab_tools/fstab.in
index 2ec6c26..325da43 100755
--- a/scripts/fstab_tools/fstab.in
+++ b/scripts/fstab_tools/fstab.in
@@ -23,6 +23,6 @@ ${_block_prefix}odm     /odm      ext4 ro,barrier=1 ${_flags},first_stage_mount
 # For sdmmc
 /devices/platform/${_sdmmc_device}/mmc_host*        auto  auto    defaults        voldmanaged=sdcard1:auto
 #  Full disk encryption has less effect on rk3326, so default to enable this.
-/dev/block/by-name/userdata /data f2fs noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065 latemount,wait,check,fileencryption=aes-256-xts:aes-256-cts:v2+inlinecrypt_optimized,keydirectory=/metadata/vold/metadata_encryption,quota,formattable,reservedsize=128M,checkpoint=fs
+/dev/block/by-name/userdata /data f2fs noatime,nosuid,nodev,discard,reserve_root=32768,resgid=1065,dirsync latemount,wait,check,fileencryption=aes-256-xts:aes-256-cts:v2+inlinecrypt_optimized,keydirectory=/metadata/vold/metadata_encryption,quota,formattable,reservedsize=128M,checkpoint=fs
 # for ext4
 #/dev/block/by-name/userdata    /data      ext4    discard,noatime,nosuid,nodev,noauto_da_alloc,data=ordered,user_xattr,barrier=1    latemount,wait,formattable,check,fileencryption=software,quota,reservedsize=128M,checkpoint=block
```

本文转自 [https://blog.csdn.net/qq\_36476119/article/details/105832937](https://blog.csdn.net/qq_36476119/article/details/105832937)，如有侵权，请联系删除。