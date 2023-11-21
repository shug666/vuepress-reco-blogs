import{_ as e,r as t,o,c as p,b as s,d as n,e as c,a as l}from"./app-ee4ba21e.js";const i={},r=l(`<div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>    <span class="token keyword">private</span> <span class="token class-name">Uri</span> <span class="token function">getDrawableUri</span><span class="token punctuation">(</span><span class="token annotation punctuation">@DrawableRes</span> <span class="token keyword">int</span> resId<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token class-name">Resources</span> resources <span class="token operator">=</span> <span class="token function">getResources</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token class-name">Uri</span><span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span><span class="token class-name">ContentResolver</span><span class="token punctuation">.</span><span class="token constant">SCHEME_ANDROID_RESOURCE</span> <span class="token operator">+</span> <span class="token string">&quot;://&quot;</span> <span class="token operator">+</span> 
        resources<span class="token punctuation">.</span><span class="token function">getResourcePackageName</span><span class="token punctuation">(</span>resId<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token char">&#39;/&#39;</span> <span class="token operator">+</span> 
        resources<span class="token punctuation">.</span><span class="token function">getResourceTypeName</span><span class="token punctuation">(</span>resId<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token char">&#39;/&#39;</span> <span class="token operator">+</span> 
        resources<span class="token punctuation">.</span><span class="token function">getResourceEntryName</span><span class="token punctuation">(</span>resId<span class="token punctuation">)</span> <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),u={href:"https://blog.csdn.net/u011106915/article/details/121359900",target:"_blank",rel:"noopener noreferrer"};function k(d,v){const a=t("ExternalLinkIcon");return o(),p("div",null,[r,s("p",null,[n("本文转自 "),s("a",u,[n("https://blog.csdn.net/u011106915/article/details/121359900"),c(a)]),n("，如有侵权，请联系删除。")])])}const _=e(i,[["render",k],["__file","Android-tupianziyuanwenjianzhuanhuaweiUridizhi.html.vue"]]);export{_ as default};
