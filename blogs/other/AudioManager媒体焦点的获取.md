---
title: AudioManager媒体焦点获取
date: 2022-09-17
tags:
 - android
categories: 
 - android
sticky: 
   true
---



Android是多任务系统，Audio系统是竞争资源。Android2.2之前，没有内建的机制来解决多个程序竞争Audio的问题，2.2引入了称作AudioFocus的机制来管理对Audio资源的竞争的管理与协调。

**按照AudioFocus的机制，在使用AudioStream之前，需要申请AudioFocus，在获得AudioFocus之后才可以使用相应的AudioStream；如果有别的程序竞争你正在使用的AudioStream，你的程序需要在收到通知之后做停止播放或者降低声音的处理。值得指出的是，这种机制是需要合作完成的，需要所有使用Audio资源的程序都按照这种机制来做，而如果有程序在它失去AudioFocus的时候仍然在使用Audio，AudioFocus拿它也没办法。而这一点对于开放系统的Android来说很致命的：用户可能安装没遵守这种机制的程序，或者版本太老还没引入这种机制的程序，这最终会导致很差的用户体验。**

##  1、AudioFocus的申请与释放

​       获取/放弃AudioFocus的方法都在android.media.AudioManager中，获取AudioFocus用requestAudioFocus()；用完之后，放弃AudioFocus，用abandonAudioFocus()。

其中，参数：

- **streamType：**播放流类型；

- durationHint：

  是持续性的指示：

  - `AUDIOFOCUS_GAIN` 指示申请得到的Audio Focus不知道会持续多久，一般是长期占有；
  - `AUDIOFOCUS_GAIN_TRANSIENT `指示要申请的AudioFocus是暂时性的，会很快用完释放的；
  - `AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK`不但说要申请的AudioFocus是暂时性的，还指示当前正在使用AudioFocus的可以继续播放，只是要“duck”一下（降低音量）。

-  `AudioManager.OnAudioFocusChangeListener` 是申请成功之后监听AudioFocus使用情况的Listener，后续如果有别的程序要竞争AudioFocus，都是通过这个Listener的`onAudioFocusChange()`方法来通知这个Audio Focus的使用者的。 

​    返回值，可能是：

-  `AUDIOFOCUS_REQUEST_GRANTED`：申请成功；
-  `AUDIOFOCUS_REQUEST_FAILED`：申请失败。

```
AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
audioManager.requestAudioFocus(onAudioFocusChangeListener, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN);
```

## 2、AudioFocus被抢占与重新获得

​    由上节中知道，申请/释放AudioFocus时传入了**`AudioManager.OnAudioFocusChangeListener`**这个参数，其onAudioFocusChange()方法是Audio Focus被抢占与再次获得通知的地方。所以，每个要使用AudioFocus的程序都要小心实现这个函数，保证AudioFocus实现的一致性。

- `AUDIOFOCUS_LOSS`：失去了Audio Focus，并将会持续很长的时间。这里因为可能会停掉很长时间，所以不仅仅要停止Audio的播放，最好直接释放掉Media资源。而因为停止播放Audio的时间会很长，如果程序因为这个原因而失去AudioFocus，最好不要让它再次自动获得AudioFocus而继续播放，不然突然冒出来的声音会让用户感觉莫名其妙，感受很不好。这里直接放弃AudioFocus，当然也不用再侦听远程播放控制【如下面代码的处理】。要再次播放，除非用户再在界面上点击开始播放，才重新初始化Media，进行播放。
- `AUDIOFOCUS_LOSS_TRANSIENT`：暂时失去Audio Focus，并会很快再次获得。必须停止Audio的播放，但是因为可能会很快再次获得AudioFocus，这里可以不释放Media资源；
- `AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK`：暂时失去AudioFocus，但是可以继续播放，不过要在降低音量。

```java
/**
     * 音频焦点监听
     */
private AudioManager.OnAudioFocusChangeListener onAudioFocusChangeListener = new AudioManager.OnAudioFocusChangeListener() {
    @Override
    public void onAudioFocusChange(int focusChange) {  
        if (focusChange == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT  
            // Pause playback   
        } else if (focusChange == AudioManager.AUDIOFOCUS_LOSS) {  
            am.unregisterMediaButtonEventReceiver(RemoteControlReceiver);  
            am.abandonAudioFocus(afChangeListener);  
            // Stop playback   
        } else if (focusChange == AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK) {  
            // Lower the volume   
        } else if (focusChange == AudioManager.AUDIOFOCUS_GAIN) {  
            // Resume playback or Raise it back to normal   
        }  
    } 
};
```

## 参考连接官方api文档

**AudioManager文档中文翻译：https://www.itdaan.com/blog/2011/08/07/1674a0bd9fd7d2d4851cce0a77a3dfbe.html**