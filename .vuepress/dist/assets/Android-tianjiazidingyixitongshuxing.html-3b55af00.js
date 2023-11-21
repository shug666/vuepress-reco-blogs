import{_ as s,r as n,o,c as d,b as a,d as e,e as r,a as l}from"./app-ee4ba21e.js";const t={},c=l(`<p>/system/build.prop 是一个属性文件，在Android系统中.prop文件很重要，记录了系统的设置和改变。这个文件是如何生成的呢？</p><p>build/tools/buildinfo.sh 脚本就是专门用于生成build.prop文件，</p><p>build/core/Makefile中使用build/tools/buildinfo.sh 脚本生成build.prop文件，所以我们要添加系统属性，主要就是在buildinfo.sh、Makefile和version_defaults.mk中</p><h2 id="新增系统属性的流程" tabindex="-1"><a class="header-anchor" href="#新增系统属性的流程" aria-hidden="true">#</a> 新增系统属性的流程：</h2><p>1.在/build/core/version_defaults.mk中增加字段</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>TARGET_CONFIGURE <span class="token operator">:=</span> false
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>2、然后需要在build/tools/buildinfo.sh中增加</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">echo</span> <span class="token string">&quot;ro.product.configure=<span class="token variable">$TARGET_CONFIGURE</span>&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>3.最后需要在build/core/Makefile中添加</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>TARGET_CONFIGURE<span class="token operator">=</span><span class="token string">&quot;$(TARGET_CONFIGURE)&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>最后编译，编译完成后就会在 /out/target/product/system/build.prop中出现加入的ro.product.configure属性，</p><p>如果需要修改属性的值，只需要更改/build/core/version_defaults.mk即可</p><h2 id="可添加系统属性的文件" tabindex="-1"><a class="header-anchor" href="#可添加系统属性的文件" aria-hidden="true">#</a> 可添加系统属性的文件</h2><p>1、build/tools/buildinfo.sh 添加的一般都是前缀为“ro.”的只读系统属性</p><p>2、device/$(TARGET_DEVICE_DIR)/system.prop</p><p>3、在Makefile中的参数ADDITIONAL_BUILD_PROPERTIES中添加 添加的一般是特定平台或者产品的特定系统属性</p><p>4、在Makefile中的参数PRODUCT_PROPERTY_OVERRIDES中添加 添加的一般是特定平台或者产品的特定系统属性 比如device/rockchip/common/device.mk</p><p>5、system/core/rootdir/int.rc中on post-fs-data下添加 添加个人自定义的一些系统属性</p>`,18),p={href:"https://blog.csdn.net/LINENG185/article/details/121560431",target:"_blank",rel:"noopener noreferrer"};function u(m,b){const i=n("ExternalLinkIcon");return o(),d("div",null,[c,a("p",null,[e("本文转自 "),a("a",p,[e("https://blog.csdn.net/LINENG185/article/details/121560431"),r(i)]),e("，如有侵权，请联系删除。")])])}const f=s(t,[["render",u],["__file","Android-tianjiazidingyixitongshuxing.html.vue"]]);export{f as default};
