---
title: Android 12 WiFi连接流程
date: 2023-07-25
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## Framework层

涉及的相关类

> packages/apps/Settings/src/com/android/settings/wifi/WifiSettings.java  
>
> packages/modules/Wifi/framework/java/android/net/wifi/WifiManager.java  
>
> packages/modules/Wifi/service/java/com/android/server/wifi/WifiServiceImpl.java  
>
> packages/modules/Wifi/service/java/com/android/server/wifi/ConnectHelper.java  
>
> packages/modules/Wifi/service/java/com/android/server/wifi/ConcreteClientModeManager.java  
>
> packages/modules/Wifi/service/java/com/android/server/wifi/ClientModeImpl.java  
>
> packages/modules/Wifi/service/java/com/android/server/wifi/WifiNative.java  
>
> packages/modules/Wifi/service/java/com/android/server/wifi/SupplicantStaIfaceHal.java  
>
> packages/modules/Wifi/service/java/com/android/server/wifi/SupplicantStaNetworkHal.java

1. 如果是修改WiFi,则调用mWifiManager.save()保存配置。

   如果是连接WiFi,则调用mWifiManager.connect()进行连接。

2. 在WifiManager.java中,connect()方法会调用connectInternal()。

3. connectInternal()会调用WifiServiceImpl的connect()方法。

4. 在WifiServiceImpl中,会停止所有的WiFi连接,然后调用ConnectHelper的connectToNetwork()方法。

5. ConnectHelper根据当前WiFi状态机的状态,获取ClientModeManager,然后调用其connectNetwork()方法。

6. ConcreteClientModeManager会获取当前的ClientMode(比如ClientModeImpl),并调用其connectNetwork()。

7. 在ClientModeImpl中,会将CONNECT_NETWORK命令加入消息队列,并通过Handler发送出去。

8. ConnectableState的Handler在处理CONNECT_NETWORK消息时,会调用connectToUserSelectNetwork()。

9. connectToUserSelectNetwork()会调用startConnectToNetwork()发起连接。

10. 在startConnectToNetwork()中,发送CMD_START_CONNECT消息。

11. ConnectableState的Handler处理CMD_START_CONNECT消息时,进行一系列准备工作,然后调用connectToNetwork()。

12. connectToNetwork()通过WifiNative的connectToNetwork()进行连接,由于在连接时，传入的参数肯定不会是空，所以连接是否成功就完全取决于WifiNative.connectToNetwork方法是否成功，转入到WifiNative中。。

13. 在WifiNative中,会通过HIDL进入到SupplicantStaIfaceHal。

14. SupplicantStaIfaceHal会添加Network,然后选择这个Network进行连接。

15. 通过HIDL调用进入到SupplicantStaNetworkHal,并执行select()方法进行连接。

这样WiFi连接的主要代码流程就是从WifiSettings发起,通过WifiManager、WifiServiceImpl、ClientModeImpl等调用最终进入 Supplicant 中进行连接的。

## wpa_supplicant层

### 添加网络addNetwork:                  

> external/wpa\_supplicant\_8/wpa\_supplicant/hidl/1.4/sta\_iface.cpp  
>
> external/wpa\_supplicant\_8/wpa\_supplicant/wpa\_supplicant.c  
>
> external/wpa\_supplicant\_8/wpa\_supplicant/config.c  
>
> external/wpa\_supplicant\_8/wpa\_supplicant/notify.c  
>
> external/wpa\_supplicant\_8/wpa\_supplicant/hidl/1.4/hidl.cpp
>
> wpa\_supplicant\_add\_network->wpa\_config\_add\_network & wpas\_notify\_network\_added->wpas\_hidl\_register\_network
>

1. 在sta_iface.cpp的StaIface::addNetworkInternal()中,调用wpa_supplicant_add_network()添加网络。
2.  wpa_supplicant_add_network()在wpa_supplicant.c中,它会调用wpa_config_add_network()添加配置。
3.  wpa_config_add_network()在config.c中,它会调用wpa_config_update_prio_list()更新优先级列表。
4.  wpa_config_update_prio_list()会通过wpa_config_add_prio_network()添加优先网络。
5. 添加网络后,会调用wpas_notify_network_added()进行通知。
6. wpas_notify_network_added()在notify.c中,它会根据配置调用wpas_dbus_register_network()或wpas_hidl_register_network()。
7. wpas_hidl_register_network()在hidl.cpp中,它会调用hidl_manager的registerNetwork()进行HIDL注册。所以关键的调用链路是:sta_iface.cpp -> wpa_supplicant.c -> config.c -> notify.c -> hidl.cpp

通过这条链路,一个网络配置可以被添加、优先级设置,并最终注册到HIDL服务中。

这条调用链条很好地贯穿了从supplicant内核级代码到HIDL服务注册的整个流程,涵盖了Android WiFi连接的关键代码流程

### 连接选择网络select:  

> external/wpa_supplicant_8/wpa_supplicant/hidl/1.4/sta_network.cpp  
>
> external/wpa\_supplicant\_8/wpa\_supplicant/wpa\_supplicant.c  
>
> external/wpa\_supplicant\_8/wpa\_supplicant/events.c  
>
> external/wpa\_supplicant\_8/src/rsn\_supp/wpa.c
>
> select->selectInternal->wpa\_supplicant\_select\_network->wpa\_supplicant\_fast\_associate->wpas\_select\_network\_from\_last\_scan->wpa\_supplicant\_pick\_network->wpa\_supplicant\_select\_bss->wpa\_supplicant\_connect->wpa\_supplicant\_associate->wpas\_start\_assoc\_cb->wpa\_sm\_set\_assoc\_wpa\_ie
>

1. 在sta_network.cpp的StaNetwork::selectInternal()中,调用wpa_supplicant_select_network()选择网络。

2. wpa_supplicant_select_network()在wpa_supplicant.c中,它会调用wpa_supplicant_fast_associate()尝试快速关联。

3. wpa_supplicant_fast_associate()在events.c中,它会调用wpas_select_network_from_last_scan()从上次扫描结果中选择网络。

4. wpas_select_network_from_last_scan()会调用wpa_supplicant_pick_network()挑选出目标网络。

5. wpa_supplicant_pick_network()会根据优先级和ssid匹配来选择要连接的网络。

6. 选择出目标网络后,调用wpa_supplicant_connect()进行连接。

7. wpa_supplicant_connect()会调用wpa_supplicant_associate()执行关联。

8. wpa_supplicant_associate()中会通过wpa_sm_set_assoc_wpa_ie()设置关联请求的IE信息。

9. wpa_sm_set_assoc_wpa_ie()在wpa.c中实现。

以上调用链贯穿了supplicant中从选择网络到设置关联IE的整个流程。

## WIFI驱动层收到取消身份验证的帧

```sh
[  540.407175] [atbm_log]:----------- ieee80211_mgd_deauth ------------
[  540.407184] Stack trace:
[  540.416678] CPU: 2 PID: 3201 Comm: wpa_supplicant Tainted: P           O      5.10.66_s5 #639
[  540.425221] Hardware name: hi3751
[  540.428541] Backtrace: 
[  540.431010] [<c010b568>] (dump_backtrace) from [<c010b8e0>] (show_stack+0x20/0x24)
[  540.438602]  r7:c1366488 r6:600e0013 r5:00000000 r4:c1568924
[  540.444292] [<c010b8c0>] (show_stack) from [<c0e9e090>] (dump_stack_lvl+0x8c/0xa4)
[  540.451889] [<c0e9e004>] (dump_stack_lvl) from [<c0e9e0bc>] (dump_stack+0x14/0x1c)
[  540.459485]  r9:db3b4f30 r8:dae15ba4 r7:bf1297b8 r6:db3b4680 r5:db3c2680 r4:00000000
[  540.467359] [<c0e9e0a8>] (dump_stack) from [<bf0af544>] (ieee80211_mgd_deauth+0x6c/0x318 [atbm6022])
[  540.476737] [<bf0af4d8>] (ieee80211_mgd_deauth [atbm6022]) from [<bf0b43bc>] (ieee80211_deauth+0x28/0x2c [atbm6022])
[  540.487267]  r10:00000003 r9:00000000 r8:c15fcb60 r7:db3b42a0 r6:db3b4000 r5:db3c2000
[  540.495096]  r4:00000000
[  540.497767] [<bf0b4394>] (ieee80211_deauth [atbm6022]) from [<c0e62f10>] (cfg80211_mlme_deauth+0x170/0x1b8)
[  540.507520] [<c0e62da0>] (cfg80211_mlme_deauth) from [<c0e44dc4>] (nl80211_deauthenticate+0xd8/0x104)
[  540.516742]  r8:00000000 r7:db3b4000 r6:db3c2000 r5:c500dc28 r4:00000000
[  540.523456] [<c0e44cec>] (nl80211_deauthenticate) from [<c0ca2ca4>] (genl_rcv_msg+0x1f8/0x25c)
[  540.532071]  r10:c15d2d00 r9:c5487800 r8:dae14000 r7:dae15c38 r6:c582f300 r5:c138f9c8
[  540.539899]  r4:00000000
[  540.542439] [<c0ca2aac>] (genl_rcv_msg) from [<c0ca1094>] (netlink_rcv_skb+0xb4/0x114)
[  540.550362]  r10:da890594 r9:00000000 r8:00000030 r7:c0ca2aac r6:dae14000 r5:c582f300
[  540.558189]  r4:c500dc00
[  540.560731] [<c0ca0fe0>] (netlink_rcv_skb) from [<c0ca1828>] (genl_rcv+0x30/0x44)
[  540.568218]  r8:dae14000 r7:da890400 r6:00000030 r5:c582f300 r4:c15d95f0
[  540.574946] [<c0ca17f8>] (genl_rcv) from [<c0ca08f0>] (netlink_unicast+0x12c/0x1bc)
[  540.582619]  r5:c582f300 r4:c1aa4c00
[  540.586225] [<c0ca07c4>] (netlink_unicast) from [<c0ca0c7c>] (netlink_sendmsg+0x2fc/0x374)
[  540.594515]  r10:00000000 r9:c500dc00 r8:dae15f40 r7:da890400 r6:00000030 r5:00000000
[  540.602364]  r4:c582f300
[  540.604913] [<c0ca0980>] (netlink_sendmsg) from [<c0c282c4>] (sock_sendmsg+0x44/0x54)
[  540.612749]  r10:00000000 r9:dae14000 r8:00000000 r7:00000000 r6:d28b2680 r5:d28b2680
[  540.620578]  r4:dae15f40
[  540.623122] [<c0c28280>] (sock_sendmsg) from [<c0c28584>] (____sys_sendmsg+0x174/0x1dc)
[  540.631126]  r5:dae15de4 r4:dae15f40
[  540.634709] [<c0c28410>] (____sys_sendmsg) from [<c0c29fb4>] (___sys_sendmsg+0x80/0xac)
[  540.642717]  r10:00000128 r9:00000000 r8:d28b2680 r7:00000000 r6:00000000 r5:dae15f40
[  540.650545]  r4:dae14000
[  540.653085] [<c0c29f34>] (___sys_sendmsg) from [<c0c2a08c>] (__sys_sendmsg+0x64/0x94)
[  540.660920]  r9:dae14000 r8:c0100264 r7:00000000 r6:bedd182c r5:d28b2680 r4:dae14000
[  540.668667] [<c0c2a028>] (__sys_sendmsg) from [<c0c2a0d8>] (sys_sendmsg+0x1c/0x20)
[  540.676240]  r7:00000128 r6:b54c1dc0 r5:00000000 r4:bedd182c
[  540.681906] [<c0c2a0bc>] (sys_sendmsg) from [<c0100060>] (ret_fast_syscall+0x0/0x54)
[  540.689648] Exception stack(0xdae15fa8 to 0xdae15ff0)
[  540.694703] 5fa0:                   bedd182c 00000000 00000007 bedd182c 00000000 b6334270
[  540.702885] 5fc0: bedd182c 00000000 b54c1dc0 00000128 bedd1848 b54c1dc0 b6353138 00000000
[  540.711063] 5fe0: b5540520 bedd1808 b59ddfb7 b633427c
```

根据wifi驱动的堆栈打印，wifi驱动接收到了Deauth 帧导致wifi断开连接。

1. Deauth 帧通过硬件接收流程上报给 WiFi 驱动程序。

2. 驱动程序会调用 cfg80211_rx_mgmt() 函数,向 cfg80211 层上报接收到的 Deauth 帧。

3. 在 net/wireless/util.c 中,cfg80211_rx_mgmt() 会调用 __cfg80211_rx_mgmt() 进行进一步处理。

4. __cfg80211_rx_mgmt() 会根据不同类型的管理帧调用不同的回调函数,对于 Deauth 帧,它会调用 cfg80211_rx_mlme_mgmt()。

5. cfg80211_rx_mlme_mgmt() 在 net/wireless/mlme.c 中,它会获取对应的无线网卡设备,并调用该设备注册的 mlme_mgmt_rx() 回调函数。

6. 对于使用 mac80211 的设备,这个 mlme_mgmt_rx() 就对应 mac80211_rx_mgmt() 函数。

7. 在 net/mac80211/mlme.c 中,mac80211_rx_mgmt() 会根据管理帧类型调用相关处理函数,因此对于 Deauth 帧,就会调用 ieee80211_mlme_deauth()。

8. 到此,通过回调函数就找到了 Deauth 帧处理的入口 ieee80211_mlme_deauth()。
9. 在net/mac80211/mlme.c中,ieee80211_mlme_deauth()函数会被调用来处理Deauth帧。

10. ieee80211_mlme_deauth()会调用ieee80211_disconnect()触发断开连接的流程。

11. ieee80211_disconnect()最终会调用ieee80211_sta_connection_lost()表示连接断开。

12. 在net/mac80211/util.c中,ieee80211_sta_connection_lost()函数会通知协议层连接已断开。

13. 对于station模式,它会调用ieee80211_mgd_deauth()来处理这个断开事件。

14. ieee80211_mgd_deauth()则触发wpa_supplicant等上层处理,逐步展开断开连接的整个流程。

 

也就是说驱动收到了Deauth帧并通过 cfg80211 层转发,最终通过注册的 mlme_mgmt_rx() 回调,定位到 mac80211 层的具体管理帧处理ieee80211_mlme_deauth()函数导致wifi断开连接。

本文转自 [https://blog.csdn.net/TSK\_Amine/article/details/126103501](https://blog.csdn.net/TSK_Amine/article/details/126103501)，如有侵权，请联系删除。