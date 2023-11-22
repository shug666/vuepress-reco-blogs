import{_ as e,r as i,o as l,c as t,b as a,d as n,e as o,a as p}from"./app-f541e591.js";const c={},r=p(`<p>作为Android framework 开发程序猿，你所不知道的ninja编译工具有多强大。</p><p>原生安卓编译大概有以下几个步骤：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>①Soong 的自举(bootstrap);

②收集 Android.bp,生成 out/soong/build.ninja 文件;

③收集 Android.mk,生成 out/build-.ninja 与 out/combined-.ninja 文件;

④ 执行 Ninja 文件，进行编译。这个 combined-*.ninja 文件,执行入口。
在我们模块开发，模块编译的时候，使用 mm、mma 单模块编译会重复上面的步骤，
是一个漫等待过程。你不知道的是，实际上在没有改变Android.bp和Android.mk文件时，
不需要执行前三步的、只需要执行第四步，所以要是能够能直接执行第四步，
就能能够大大减少编译编译时长。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>重点：</strong></p><p><strong><em>实际上在没有改变 Android.bp 和 Android.mk 文件时，不需要执行前三步的、只需要执行第四步，所以要是能够能直接执行第四步，就能能够大大减少编译编译时长。</em></strong></p><h2 id="创建脚本ninja-lee-sh" tabindex="-1"><a class="header-anchor" href="#创建脚本ninja-lee-sh" aria-hidden="true">#</a> 创建脚本ninja-lee.sh</h2><p>说明：</p><p>$ANDROID_BUILD_TOP 这个是Android源码的根目录 绝对路径：</p><p>ex: /media/filesystem/workspace/A13.C01/sprd.mocor13.androidT</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function-name function">ninja</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token assign-left variable">ninja_bin</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">$ANDROID_BUILD_TOP</span>/prebuilts/build-tools/linux-x86/bin/ninja&quot;</span>
    <span class="token comment">#ninja_build_file=&quot;$ANDROID_BUILD_TOP/out/build-$TARGET_PRODUCT.ninja&quot;</span>
    <span class="token assign-left variable">ninja_build_file</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">$ANDROID_BUILD_TOP</span>/out/combined-<span class="token variable">$TARGET_PRODUCT</span>.ninja&quot;</span>
    <span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-f</span> <span class="token variable">$ninja_build_file</span> <span class="token punctuation">]</span>
    <span class="token keyword">then</span>
        <span class="token builtin class-name">echo</span> <span class="token string">&quot;can&#39;t find ninja buildfile <span class="token variable">$ninja_build_file</span>&quot;</span>
        <span class="token builtin class-name">exit</span> <span class="token parameter variable">-1</span>
    <span class="token keyword">fi</span>
    <span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-f</span> <span class="token variable">$ninja_bin</span> <span class="token punctuation">]</span>
    <span class="token keyword">then</span>
        <span class="token builtin class-name">echo</span> <span class="token string">&quot;can&#39;t find ninja binary <span class="token variable">$ninja_bin</span>&quot;</span>
        <span class="token builtin class-name">exit</span> <span class="token parameter variable">-1</span>
    <span class="token keyword">fi</span>
	<span class="token builtin class-name">echo</span> <span class="token variable">$ninja_bin</span>
	<span class="token builtin class-name">echo</span> <span class="token variable">$ninja_build_file</span>
	<span class="token builtin class-name">echo</span> <span class="token variable">$1</span>
    <span class="token variable">$ninja_bin</span> <span class="token parameter variable">-f</span> <span class="token variable">$ninja_build_file</span> <span class="token variable">$1</span>
<span class="token punctuation">}</span>

<span class="token comment">#usage:ninja&lt;modulename&gt;</span>
ninja <span class="token variable">$*</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用如下：</p><p>ex：./ninja-lee.sh SystemUI</p><p>ex：./ninja-lee.sh Settings</p>`,13),d={href:"https://mp.weixin.qq.com/s/JFvxK6vht3ErADqrZxcpKw",target:"_blank",rel:"noopener noreferrer"};function u(v,b){const s=i("ExternalLinkIcon");return l(),t("div",null,[r,a("p",null,[n("本文转自 "),a("a",d,[n("https://mp.weixin.qq.com/s/JFvxK6vht3ErADqrZxcpKw"),o(s)]),n("，如有侵权，请联系删除。")])])}const k=e(c,[["render",u],["__file","android_yuanmabianyi_danbianjiasu.html.vue"]]);export{k as default};
