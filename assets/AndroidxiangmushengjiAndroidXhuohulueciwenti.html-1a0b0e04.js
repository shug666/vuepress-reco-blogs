import{_ as e,o as d,c as n,a as i}from"./app-668506b4.js";const r={},t=i(`<p>Android Studio升级到3.5后，原先项目引入的是android，现在新建module时有Project needs to be converted to androidx.* dependencies，而且Finish是灰色，无法创建，现在提供两种解决方法：</p><p>**参考一篇博客：**https://blog.csdn.net/weixin_40420578/article/details/100132061</p><h2 id="项目不升级到androidx" tabindex="-1"><a class="header-anchor" href="#项目不升级到androidx" aria-hidden="true">#</a> <strong>项目不升级到AndroidX</strong></h2><p>一开始新建module_test时，如下图：</p><p><img src="https://raw.githubusercontent.com/shug666/image/main/images/image-20220905200840138.png" alt="image-20220905200840138"></p><p><strong>步骤一：gradle.properties(Global Properties)下添加：</strong></p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code>android.useAndroidX=true
android.enableJetifier=true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>点一下右上角Sync Now</p><p><strong>步骤二：新建module_test，这时就没有Project needs to be converted to androidx.* dependencies ：</strong></p><p><strong>步骤三：把module_test的build.gradle——dependencies下引入的androidX包改成android的，如果不知道怎么改，就从原先的module对应的build.gradle里拷贝过来</strong></p><p><strong>步骤四：在步骤一种添加的改成false</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>android.useAndroidX=false
android.enableJetifier=false
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>同步一下即可 Sync Now</p>`,13),a=[t];function o(s,l){return d(),n("div",null,a)}const u=e(r,[["render",o],["__file","AndroidxiangmushengjiAndroidXhuohulueciwenti.html.vue"]]);export{u as default};
