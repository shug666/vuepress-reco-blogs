import{_ as n,o as s,c as a,a as e}from"./app-ee4ba21e.js";const t={},i=e(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>title: Android 应用第一次启动时提示的旧版Android打造的弹窗
date: 2023-01-04
tags:
 - android
categories: 
 - android
sticky: 
   true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>应用安装完成后第一次打开，出现&quot;<strong>此应用专为旧版Android打造，因此可能无法正常运行。请尝试检查更新或与开发者联系</strong>&quot;提示，出现这种错误的原因：</p><p>应用启动，startActivity时，流程会执行到realStartActivityLocked方法，代码位于ActivityStackSupervisor.java</p><p>realStartActivityLocked方法中，会调用AppWarnings.java的onStartActivity方法，如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">final</span> <span class="token keyword">boolean</span> <span class="token function">realStartActivityLocked</span><span class="token punctuation">(</span><span class="token class-name">ActivityRecord</span> r<span class="token punctuation">,</span> <span class="token class-name">ProcessRecord</span> app<span class="token punctuation">,</span> <span class="token keyword">boolean</span> andResume<span class="token punctuation">,</span> <span class="token keyword">boolean</span> checkConfig<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">RemoteException</span> <span class="token punctuation">{</span>
    <span class="token keyword">try</span> <span class="token punctuation">{</span>
        <span class="token comment">// ...</span>
        <span class="token comment">//通过此方法弹出提示框，注释此方法即可</span>
        mService<span class="token punctuation">.</span><span class="token function">getAppWarningsLocked</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">onStartActivity</span><span class="token punctuation">(</span>r<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// ...</span>
    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">RemoteException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// ...</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>onStartActivity方法实现：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
     * Called when an activity is being started.
     *
     * <span class="token keyword">@param</span> <span class="token parameter">r</span> record for the activity being started
     */</span>
<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">onStartActivity</span><span class="token punctuation">(</span><span class="token class-name">ActivityRecord</span> r<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">showUnsupportedCompileSdkDialogIfNeeded</span><span class="token punctuation">(</span>r<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">showUnsupportedDisplaySizeDialogIfNeeded</span><span class="token punctuation">(</span>r<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">showDeprecatedTargetDialogIfNeeded</span><span class="token punctuation">(</span>r<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7),c=[i];function o(p,l){return s(),a("div",null,c)}const u=n(t,[["render",o],["__file","yingyongdiyiciqidongshitishidejiubanAndroiddazaodedanchuang.html.vue"]]);export{u as default};
