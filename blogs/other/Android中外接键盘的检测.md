---
title: Android中外接键盘的检测
date: 2024-10-07
tags:
 - android
categories: 
 - android
sticky: 
   true
---

今天来了一个问题：软键盘无法弹出。分析后是因为系统判断当前有外接硬键盘，就会隐藏软键盘。但实际情况并不是这么简单，该问题只有在特定条件下偶现，具体分析过程就不说了，就是软硬键盘支持上的逻辑问题。借着这个机会整理一下键盘检测的过程。

## Configuration

Android系统中通过读取Configuration中keyboard的值来判断是否存在外接键盘。Configuration中关于键盘类型的定义如下，

```java
    public static final int KEYBOARD_UNDEFINED = 0; // 未定义的键盘
    public static final int KEYBOARD_NOKEYS = 1; // 无键键盘，没有外接键盘时为该类型
    public static final int KEYBOARD_QWERTY = 2; // 标准外接键盘
    public static final int KEYBOARD_12KEY = 3; // 12键小键盘
```

在最常见的情况下，外接键盘未连接时keyboard的值为`KEYBOARD_NOKEYS`，当检测到键盘连接后会将keyboard的值更新为`KEYBOARD_QWERTY` 。应用就可以根据keyboard的值来判断是否存在外接键盘，InputMethodService.java中有类似的判断代码。

```java
    // 软件盘是否可以显示
    public boolean onEvaluateInputViewShown() {
        Configuration config = getResources().getConfiguration();
        return config.keyboard == Configuration.KEYBOARD_NOKEYS
                || config.hardKeyboardHidden == Configuration.HARDKEYBOARDHIDDEN_YES;
    }    
```

现在的问题就转向Configuration的keyboard是如何更新的。在WindowManagerService.java中，应用启动时会更新Configuration，相关代码如下。

```java
    boolean computeScreenConfigurationLocked(Configuration config) {
        ......
        if (config != null) {
            // Update the configuration based on available input devices, lid switch,
            // and platform configuration.
            config.touchscreen = Configuration.TOUCHSCREEN_NOTOUCH;
            // 默认值为KEYBOARD_NOKEYS
            config.keyboard = Configuration.KEYBOARD_NOKEYS;
            config.navigation = Configuration.NAVIGATION_NONAV;
            
            int keyboardPresence = 0;
            int navigationPresence = 0;
            final InputDevice[] devices = mInputManager.getInputDevices();
            final int len = devices.length;
            // 遍历输入设备
            for (int i = 0; i < len; i++) {
                InputDevice device = devices[i];
                // 如果不是虚拟输入设备，会根据输入设备的flags来更新Configuration
                if (!device.isVirtual()) {
                    ......
                    // 如果输入设备的键盘类型为KEYBOARD_TYPE_ALPHABETIC，则将keyboard设置为KEYBOARD_QWERTY
                    if (device.getKeyboardType() == InputDevice.KEYBOARD_TYPE_ALPHABETIC) {
                        config.keyboard = Configuration.KEYBOARD_QWERTY;
                        keyboardPresence |= presenceFlag;
                    }
                }
            }
            ......
            // Determine whether a hard keyboard is available and enabled.
            boolean hardKeyboardAvailable = config.keyboard != Configuration.KEYBOARD_NOKEYS;
            // 更新硬件键盘状态
            if (hardKeyboardAvailable != mHardKeyboardAvailable) {
                mHardKeyboardAvailable = hardKeyboardAvailable;
                mH.removeMessages(H.REPORT_HARD_KEYBOARD_STATUS_CHANGE);
                mH.sendEmptyMessage(H.REPORT_HARD_KEYBOARD_STATUS_CHANGE);
            }
            // 如果Setting中SHOW_IME_WITH_HARD_KEYBOARD被设置，将keyboard设置为KEYBOARD_NOKEYS，让软件盘可以显示
            if (mShowImeWithHardKeyboard) {
                config.keyboard = Configuration.KEYBOARD_NOKEYS;
            }
            ......
        }
```

影响Configuration中keyboard的值有，

- 默认值为`KEYBOARD_NOKEYS`，表示没有外接键盘。
- 当输入设备为`KEYBOARD_TYPE_ALPHABETIC`时，更新为`KEYBOARD_QWERTY`，一个标准键盘。
- 当`Settings.Secure.SHOW_IME_WITH_HARD_KEYBOARD`为1时，设置为`KEYBOARD_NOKEYS`，目的是让软键盘可以显示。

## inputflinger

接下来需要关注输入设备时何时被设置KEYBOARD_TYPE_ALPHABETIC的。搜索代码可以看到，这个flag实在native代码中设置的，代码在`inputflinger/InputReader.cpp`中。native和java使用了同一定义值，如果修改定义时需要注意同时修改。native中的名字为`AINPUT_KEYBOARD_TYPE_ALPHABETIC`。

```c++
InputDevice* InputReader::createDeviceLocked(int32_t deviceId, int32_t controllerNumber,
        const InputDeviceIdentifier& identifier, uint32_t classes) {
    InputDevice* device = new InputDevice(&mContext, deviceId, bumpGenerationLocked(),
            controllerNumber, identifier, classes);
    ......
    if (classes & INPUT_DEVICE_CLASS_ALPHAKEY) {
        keyboardType = AINPUT_KEYBOARD_TYPE_ALPHABETIC;
    }
    ......
    return device;
}
```

InputReader在增加设备时，根据classes的flag来设置键盘类型。这个flag又是在EventHub.cpp中设置的。

```c++
status_t EventHub::openDeviceLocked(const char *devicePath) {
    ......
    // Configure the keyboard, gamepad or virtual keyboard.
    if (device->classes & INPUT_DEVICE_CLASS_KEYBOARD) { 
        // 'Q' key support = cheap test of whether this is an alpha-capable kbd
        if (hasKeycodeLocked(device, AKEYCODE_Q)) {
            device->classes |= INPUT_DEVICE_CLASS_ALPHAKEY;
        }
    ......
}
```

看到这里就比较明确了，在EventHub加载设备时，如果输入设备为键盘，并且带有'Q'键，就认为这是一个标准的外接键盘。但为何判断'Q'键还不是很清楚。

## keylayout

上面说道通过'Q'键来判断是否为外接键盘，这个'Q'键是Android的键值，键值是否存在是通过一个keylayout文件决定的。kl文件存储在目标系统的`/system/usr/keylayout/`下，系统可以有多个kl文件，根据设备的ID来命名。当系统加载键盘设备时，就会根据设备的Vendor ID和Product ID在`/system/usr/keylayout/`下寻找kl文件。例如一个kl文件名为`Vendor_0c45_Product_1109.kl，`表明设备的Vendor ID为0c45，Product ID为1109。一个kl的内容示例如下，

```java
key 1     BACK
key 28    DPAD_CENTER
key 102   HOME

key 103   DPAD_UP
key 105   DPAD_LEFT
key 106   DPAD_RIGHT
key 108   DPAD_DOWN

key 113   VOLUME_MUTE
key 114   VOLUME_DOWN
key 115   VOLUME_UP

key 142   POWER
```

键值映射需要使用关键之”key“进行声明，之后跟着的数字为Linux驱动中的键值定义，再后面的字符串是Android中按键的名称。'Q'键是否存在完全取决于kl文件中是否有映射，而不是实际物理键是否存在。kl文件的查找也是有一个规则的，其查找顺序如下，

> /system/usr/keylayout/Vendor_XXXX_Product_XXXX_Version_XXXX.kl
>
> /system/usr/keylayout/Vendor_XXXX_Product_XXXX.kl
>
> /system/usr/keylayout/DEVICE_NAME.kl
>
> /data/system/devices/keylayout/Vendor_XXXX_Product_XXXX_Version_XXXX.kl
>
> /data/system/devices/keylayout/Vendor_XXXX_Product_XXXX.kl
>
> /data/system/devices/keylayout/DEVICE_NAME.kl
>
> /system/usr/keylayout/Generic.kl
>
> /data/system/devices/keylayout/Generic.kl

## 同时支持软硬键盘

有了上面的知识，就可以给出同时支持软硬键盘的方案。

- 修改源码逻辑，设置Configuration中keyboard的值为`KEYBOARD_NOKEYS`。这种Hack其实不好，破坏原生逻辑，缺乏移植性。非要这样改的话，可以增加对设备的判断，只有特定的键盘设备设置为`KEYBOARD_NOKEYS`，减少副作用。
- 修改keylayout，去掉'Q'键映射。有时kl文件写的不标准，为了通用把所有键的映射都写上了，实际硬件键却很少，我们就是这种情况。应该按照真实硬件来编写kl文件。
- 设置`Settings.Secure.SHOW_IME_WITH_HARD_KEYBOARD`为1。我认为这是最标准的修改方式，也非常方便。

关于第三个方案的修改方式有两种，一种是修改缺省的setting值，在文件`frameworks/base/packages/SettingsProvider/res/values/defaults.xml`中增加，

```xml
    <integer name="def_show_ime_with_hard_keyboard">1</integer>
```

另一种方式是在系统启动时在代码中通过接口进行设置。

```java
Settings.Secure.putInt(context.getContentResolver(), Settings.Secure.SHOW_IME_WITH_HARD_KEYBOARD, 1);
```



参考链接https://segmentfault.com/a/1190000021080958