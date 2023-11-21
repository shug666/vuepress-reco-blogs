import{_ as e,r as i,o as t,c as o,b as s,d as n,e as d,a as c}from"./app-ee4ba21e.js";const p={},l=c(`<h2 id="特权应用" tabindex="-1"><a class="header-anchor" href="#特权应用" aria-hidden="true">#</a> 特权应用</h2><p>什么是特权应用？位于系统分区的<code>priv-app</code>目录下的应用就是特权应用。不同的Android版本定义的分区如下</p><ol><li>小于等于Android 8.1的版本，特权分区为<code>/system</code>。</li><li>大于等于Android 9的版本，特权分区为<code>/system</code>, <code>/product</code>和<code>/vendor</code>。</li></ol><p>例如，从Android 9开始，<code>/product/priv-app</code>目录下的应用就是特权应用。</p><h2 id="系统的特许权限" tabindex="-1"><a class="header-anchor" href="#系统的特许权限" aria-hidden="true">#</a> 系统的特许权限</h2><p>从Android 8.0开始，特权应用如果使用系统的特许权限，那么需要把这个特许权限加入到白名单中。<br> 那么什么是系统的特许权限? 系统的特许权限必须在frameworks/base/core/res/AndroidManifest.xml定义，并且等级为signature|privileged</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>permission</span>
    <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>com.permission.test<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name"><span class="token namespace">android:</span>protectionLevel</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>signature|privileged<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="白名单文件" tabindex="-1"><a class="header-anchor" href="#白名单文件" aria-hidden="true">#</a> 白名单文件</h2><p>刚才说到，如果一个特权应用使用了系统的特许权限，那么我们要把这个特许权限加入到白名单中。</p><p>那么这个白名单文件在哪呢？如果特权应用在<code>/vendor</code>分区，那么白名单文件就必须在<code>/vendor/etc/permissions/</code>目录下。</p><p>那么这些白名单文件来自哪里呢？一般是来自<code>frameworks/base/data/etc/</code>目录，也有的是来自应用，这些应用通过<code>Android.mk</code>或<code>Android.bp</code>把白名单文件编译到指定目录。</p><p>这里以<code>frameworks/base/data/etc/</code>目录为例，在我的项目中有如下文件</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Android.bp
com.android.carrierconfig.xml
com.android.contacts.xml
com.android.dialer.xml
com.android.documentsui.xml
com.android.emergency.xml
com.android.launcher3.xml
com.android.provision.xml
com.android.settings.intelligence.xml
com.android.settings.xml
com.android.storagemanager.xml
com.android.systemui.xml
com.android.timezone.updater.xml
framework-sysconfig.xml
hiddenapi-package-whitelist.xml
platform.xml
privapp-permissions-platform.xml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>特权应用如果使用了系统特许权限，一般会把白名单添加到<code>privapp-permissions-platform.xml</code>文件中。当然也可以单独建立一个文件，例如<code>com.android.systemui.xml</code>就是<code>SystemUI</code>的特权白名单文件。</p><p>那么这些白名单文件如何编译到系统分区呢，这是由frameworks/base/data/etc/Android.bp决定的，部分代码如下</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code>prebuilt_etc {
    // 配置文件的别名
    name: &quot;privapp-permissions-platform.xml&quot;,
    // 配置文件的目录
    sub_dir: &quot;permissions&quot;,
    // 源配置文件名
    src: &quot;privapp-permissions-platform.xml&quot;,
}

prebuilt_etc {
    name: &quot;privapp_whitelist_com.android.carrierconfig&quot;,
    // 配置文件添加到product分区
    product_specific: true,
    sub_dir: &quot;permissions&quot;,
    src: &quot;com.android.carrierconfig.xml&quot;,
    filename_from_src: true,
}

prebuilt_etc {
    name: &quot;privapp_whitelist_com.android.settings&quot;,
	// 配置文件添加到system_ext分区
    system_ext_specific: true,
    sub_dir: &quot;permissions&quot;,
    src: &quot;com.android.settings.xml&quot;,
    filename_from_src: true,
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第一个<code>prebuilt_etc</code>模块是把<code>privapp-permissions-platform.xml</code>默认编译到<code>/system</code>分区下的<code>/system/etc/permissions</code>目录下。</p><p>第二个<code>prebuilt_etc</code>模块，由于定义了<code>product_specific: true</code>，所以把配置文件编译到<code>/product</code>分区。</p><p>第三个<code>prebuilt_etc</code>模块，由于定义了<code>system_ext_specific: true</code>，所以把配置文件编译到<code>/system_ext</code>分区。</p><blockquote><p>由于对Android.bp语法缺乏了解，暂时不知道如何把配置文件编译到vendor分区</p></blockquote><h2 id="为特权应用添加白名单" tabindex="-1"><a class="header-anchor" href="#为特权应用添加白名单" aria-hidden="true">#</a> 为特权应用添加白名单</h2><p>假如现在我在<code>frameworks/base/core/res/AndroidManifest.xml</code>中定义了如下一个特权</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>permission</span>
    <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>com.permission.test<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name"><span class="token namespace">android:</span>protectionLevel</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>signature|privileged<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后在<code>SettingsProvider</code>的<code>AndroidManifest.xml</code>中使用了这个权限</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>uses-permission</span> <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>com.permission.test<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>由于<code>SettingsProvider</code>属于特权App，并且使用了系统的特许权限，那么就要为<code>SettingsProvider</code>添加这个特权白名单。</p><p>你可以参照特权白名单文件，为应用添加白名单内容，这需要手动操作。但是如果你已经把源码编译过，那么可以通过执行<code>development/tools/privapp_permissions/privapp_permissions.py</code>这个脚本看到你需要配置的信息，例如对于上面例子，会显示如下信息</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token prolog">&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>permissions</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>privapp-permissions</span> <span class="token attr-name">package</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>com.android.providers.settings<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>permission</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>com.permission.test<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>privapp-permissions</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>permissions</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这就是白名单内容，我们可以把这个内容放到<code>frameworks/base/data/etc/privapp-permissions-platform.xml</code>，也可以单独生成一个文件，名为<code>com.android.providers.settings.xml</code>。如果是生成单独一个文件 ，那么还需要在<code>Android.bp</code>中进行编译配置。</p><h2 id="查看应用权限赋予情况" tabindex="-1"><a class="header-anchor" href="#查看应用权限赋予情况" aria-hidden="true">#</a> 查看应用权限赋予情况</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>adb shell dumpsys package com.test.abc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>备注：com.test.abc改成你的包名。</p><p>搜索“<strong>runtime permissions</strong>，有如下结果。 很明显可看到 位置权限，存储空间 权限没有被赋予。</p><p>输入 <strong><code>adb shell dumpsys package com.test.abc &gt;&gt; D:\\log.txt</code></strong> 可将以上信息保存到log中。搜集这个log，方便排查下些bug原因。</p>`,34),r={href:"https://zhuanlan.zhihu.com/p/165646349",target:"_blank",rel:"noopener noreferrer"};function u(m,v){const a=i("ExternalLinkIcon");return t(),o("div",null,[l,s("p",null,[n("本文转自 "),s("a",r,[n("https://zhuanlan.zhihu.com/p/165646349"),d(a)]),n("，如有侵权，请联系删除。")])])}const g=e(p,[["render",u],["__file","Android-tequanbaimingdan-tequanyingyong-quanxian.html.vue"]]);export{g as default};
