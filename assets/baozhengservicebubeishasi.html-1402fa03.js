import{_ as s,o as t,c as i,b as e}from"./app-668506b4.js";const o={},c=e("p",null,'一、提供进程优先级，降低进程被杀死的概率 方法一：监控手机锁屏解锁事件，在屏幕锁屏时启动1像素的Activity，在用户解锁时将Activity销毁。方法二、启动前台service。方法三：提升service优先级：在AndroidManifest.xml文件中对于intentfilter 可以通过android:priority="1000"这个属性设置最高优先级，1000是最高值，如果数字越小则优先级越低，同时适用于广播。',-1),r=e("p",null,"二、在进程被杀死后，进行拉活 方法一：注册高频率广播接收器，唤起进程。如网络变化，解锁屏幕，开机等 方法二：双进程相互唤起。方法三：依靠系统唤起。方法四：onDestroy 方法里重启service：service+broadcast方式，就是当service走ondestory的时候，发动一个自定义的广播，当收到广播的时候，重新启动service。",-1),n=e("p",null,"三、依靠第三方 根据终端不同，在小米手机（包括MINI）接入小米推送、华为手机接入华为推送；其他手机可以考虑接入腾讯信鸽或极光推送与小米推送做A/B Test。",-1),_=[c,r,n];function a(l,d){return t(),i("div",null,_)}const h=s(o,[["render",a],["__file","baozhengservicebubeishasi.html.vue"]]);export{h as default};
