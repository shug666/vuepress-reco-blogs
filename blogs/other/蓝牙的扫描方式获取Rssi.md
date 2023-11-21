---
title: Android 蓝牙的扫描方式获取Rssi
date: 2023-01-13
tags:
 - android
categories: 
 - android
sticky: 
   true
---



## Android5.0以下的蓝牙扫描

Androidstudio会提示划横线了,因为这方法太久了,已经有方法替代了。所有设备能用就是了问题不大,如果设备为Android5.0以下就只能用这个了。**回调的第二个参数就是Rssi了。**

```java
		BluetoothAdapter.getDefaultAdapter().startLeScan((device, rssi, scanRecord) -> {

        });
        .......
        // 结束,不去结束的话这个就会一直扫描个不停的
        BluetoothAdapter.getDefaultAdapter().stopLeScan((device, rssi, scanRecord) -> {

        });

```

## Android5.0及以上的蓝牙扫描

改版后的扫描方式基本差不了多少结果现在都存储在了ScanResult 类里,Rssi也在这里。

```java
 BluetoothAdapter.getDefaultAdapter().getBluetoothLeScanner().startScan(new ScanCallback() {
            @Override
            public void onScanResult(int callbackType, ScanResult result) {
                super.onScanResult(callbackType, result);
                result.getDevice();
                result.getRssi();
                result.getScanRecord().getBytes();

            }
        });
		 .......
        // 结束,不去结束的话这个就会一直扫描个不停的
        BluetoothAdapter.getDefaultAdapter().getBluetoothLeScanner().stopScan(/**/);

        

```

以上两种扫描方式的蓝牙可见性问题
------------------------------------------------------------------------------

什么是蓝牙可见性?简单的说就是:指其他蓝牙设备是否可以搜索到你的Android设备。  
这东西每个厂家都有改动,基本车载Android或者原生的Android5.0以下设备有这玩意,如果有这个东西并且以上2个(目前我测试过1台设备)是扫描不到的。

如果遇到有蓝牙的可见性这玩意的设备呢,我就没有用以上的方法了,请看下一条目录。  
可见性的开关:[直接上链接,不当搬运工](https://www.cnblogs.com/jqnl/p/13490392.html)  
建议是直接用反射,原生弹出的Dialog真的很原生,用户操作起来UI看起来肯定不舒服

低功耗蓝牙的扫描
----------------------------------------------------------------------

这个能同时连好几个蓝牙设备,这看设备底层的上限就是了,**但是只能获取最后一个设备连接上服务端蓝牙时的设备的Rssi**。且这Rssi与其他3款的计算方式不同哦。  
**gatt.readRemoteRssi();是触发onReadRemoteRssi()回调的关键,如果此时多台设备连接上了目标机器则readRemoteRssi会read了个寂寞哦!!**  
如果只有1对1的连接设备且知道对方蓝牙地址用这个方法是最快的能获取Rssi。  
如果你想一直获取Rssi,这个connect个7-10次左右会无效掉哦,此时你需要在下方的注释的代码开起来

```java
	BluetoothGatt mLastGatt;
	......
    
    /**
     * 客户端连接服务端
     * @param device 已检查到的蓝牙设备
     */
    private void connect(BluetoothDevice device) {
        if (device != null) {
        // 好多个回调方法,有用到请自行添加
            BluetoothGattCallback bluetoothGattCallback = new BluetoothGattCallback() {
                @Override
                public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
                    super.onConnectionStateChange(gatt, status, newState);
//                    if (newState==BluetoothGatt.STATE_DISCONNECTED){
//                        if (mLastGatt!=null)
//                        mLastGatt.disconnect();
//                    }
//                    mLastGatt=gatt;
                    gatt.readRemoteRssi();
                }

                @Override
                public void onReadRemoteRssi(BluetoothGatt gatt, int rssi, int status) {
                    super.onReadRemoteRssi(gatt, rssi, status);
                }
            };
            // 连接
            BluetoothGatt bluetoothGatt = device.connectGatt(MainActivity.this, true, bluetoothGattCallback);
        }
    }
 

```

通用扫描
------------------------------------------------------------------

这个要打开目标机的蓝牙可见性才可以搜索到目标机的设备。  
大概是系统蓝牙扫描的方式,我自己操作起来看着像…

```java
// 开始扫描
BluetoothAdapter.getDefaultAdapter().startDiscovery();
// 结束扫描
BluetoothAdapter.getDefaultAdapter().cancelDiscovery()

// 是否正在扫描中
BluetoothAdapter.getDefaultAdapter().isDiscovering()

```

这扫描过程中承接的对象是广播,这个广播也能调用低功耗蓝牙的方式去获取RSSI,但是这2种计算Rssi的结果是不一样的!

需要监听的action: BluetoothDevice.ACTION\_FOUND

```java
public class ScanBroadcastReceiver extends BroadcastReceiver {

        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction(); 
            if (BluetoothDevice.ACTION_FOUND.equals(action)){
                BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                short rssi=intent.getShortExtra(BluetoothDevice.EXTRA_RSSI, (short) 0);
            }

        }
    

```

蓝牙所需的权限,记得动态申请
----------------------------------------------------------------------------

```xml
	<use-permission android:name="android.permission.BLUETOOTH"
					android:maxSdkVersion="30" />
	<use-permission android:name="android.permission.BLUETOOTH_ADMIN"
					android:maxSdkVersion="30" />

	<use-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
	<use-permission android:name="android.permission.FINE_LOCATION" />

	<use-permission android:name="android.permission.BLUETOOTH_SCAN" />
	<use-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
	<use-permission android:name="android.permission.BLUETOOTH_CONNECT" />


```

结尾
----------------------------------------------------------------

低功耗的客户端和服务端代码量会多一般都是些回调的内容,其他3种方法简洁明了。如果目标机有可见性且不为自己的设备那就自求多福吧,只能用直连地址的方式去用低功耗获取Rssi了
