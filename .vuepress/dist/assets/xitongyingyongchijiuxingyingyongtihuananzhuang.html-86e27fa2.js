import{_ as a,o as e,c as s,a as n}from"./app-f541e591.js";const i={},l=n(`<p>adb install 报[INSTALL_FAILED_INVALID_APK],apk是一个持久性应用程序,持久性应用程序是不可更新的。</p><h2 id="电视开机时按住esc进入bootcode模式" tabindex="-1"><a class="header-anchor" href="#电视开机时按住esc进入bootcode模式" aria-hidden="true">#</a> 电视开机时按住esc进入bootcode模式</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">env</span> <span class="token builtin class-name">set</span> OEMLock off  <span class="token comment">#关闭OEM锁</span>
<span class="token function">env</span> save <span class="token comment">#保存配置</span>
<span class="token function">env</span> reset <span class="token comment">#重启TV</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="将system挂载后即可进行替换" tabindex="-1"><a class="header-anchor" href="#将system挂载后即可进行替换" aria-hidden="true">#</a> 将System挂载后即可进行替换</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token variable">$adb</span> root  $获取root权限

<span class="token variable">$adb</span> disable-verity  <span class="token comment">#关闭分区检测功能</span>

<span class="token variable">$adb</span> <span class="token function">reboot</span>  <span class="token comment">#执行adb disable-verity后需要重启设备</span>

<span class="token variable">$adb</span> root   <span class="token comment">#设备重启后再次获取root权限</span>

<span class="token variable">$adb</span> remount  <span class="token comment">#使system分区为可读可写模式，mount -o remount,rw /或者mount -o rw,remount /system</span>

<span class="token variable">$adb</span> push TopTechTvService.apk /system/app/TopTechTvService <span class="token comment">#替换原来的文件</span>

<span class="token variable">$adb</span> shell 	<span class="token comment">#然后进入/system/app/TopTechTvService目录</span>

<span class="token variable">$sync</span>	<span class="token comment">#更新缓冲区</span>

<span class="token variable">$reboot</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="adb-shell-sync-命令和adb-sync命令的区别" tabindex="-1"><a class="header-anchor" href="#adb-shell-sync-命令和adb-sync命令的区别" aria-hidden="true">#</a> adb shell sync 命令和adb sync命令的区别</h2><p>adb shell sync 命令：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>1，在shell中执行
2，将内存缓冲区中的数据 写入到磁盘
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>adb sync 命令： 命令意思：同步更新/data/或/system/下的数据</p><p>命令用法：adb sync [directory]</p><p>如果不指定目录，将同步更新/data/和/system/</p><h2 id="adb-shell打开开发者选项" tabindex="-1"><a class="header-anchor" href="#adb-shell打开开发者选项" aria-hidden="true">#</a> adb shell打开开发者选项</h2><p>1.如果是正常的手机或者平板的Settings版本可以使用：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token variable">$am</span> start <span class="token parameter variable">-n</span> com.android.settings/com.android.settings.DevelopmentSettings
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>2.如果是电视的TVSettings版本可以使用：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token variable">$am</span> start <span class="token parameter variable">-n</span> com.android.tv.settings/com.android.tv.settings.system.development.DevelopmentActivity
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>以上都是RK平台的</p><h2 id="安卓手机解锁" tabindex="-1"><a class="header-anchor" href="#安卓手机解锁" aria-hidden="true">#</a> 安卓手机解锁</h2><p>提示：Device is locked. Please unlock the device first</p><p>1.首先需要打开开发者模式中的OEM unlocking开关</p><p><img src="https://raw.githubusercontent.com/shug666/image/main/images/20190413180428685.png" alt="img"></p><p>2.adb reboot bootloader</p><p>3.fastboot flashing unlock</p><p>4.fastboot getvar unlocked</p><p>等待结果 一般会出现unlocked：yes</p>`,25),d=[l];function t(c,o){return e(),s("div",null,d)}const p=a(i,[["render",t],["__file","xitongyingyongchijiuxingyingyongtihuananzhuang.html.vue"]]);export{p as default};
