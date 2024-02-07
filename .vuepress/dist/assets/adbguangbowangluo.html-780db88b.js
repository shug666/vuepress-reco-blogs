import{_ as e,o as d,c as n,a}from"./app-52856ff7.js";const i={},s=a(`<h2 id="如何通过adb命令查看android系统当前发送了什么广播" tabindex="-1"><a class="header-anchor" href="#如何通过adb命令查看android系统当前发送了什么广播" aria-hidden="true">#</a> 如何通过adb命令查看Android系统当前发送了什么广播</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>adb shell进入shell

dumpsys | grep BroadcastRecord

从上往下，上面是系统最新接收到的action。
---------------------------------
adb shell dumpsys | findstr BroadcastRecord
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="查看网络使用情况" tabindex="-1"><a class="header-anchor" href="#查看网络使用情况" aria-hidden="true">#</a> 查看网络使用情况</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
adb shell ifconfig //查看配置信息

adb shell dumpsys connectivity  //查看连接情况

db shell netstat //查看连接状态和地址

adb shell ip ru //查看路由策略

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考链接" tabindex="-1"><a class="header-anchor" href="#参考链接" aria-hidden="true">#</a> 参考链接</h2><p>Android adb查看网络连接情况https://blog.csdn.net/wenzhi20102321/article/details/122161589</p>`,6),l=[s];function r(c,t){return d(),n("div",null,l)}const u=e(i,[["render",r],["__file","adbguangbowangluo.html.vue"]]);export{u as default};
