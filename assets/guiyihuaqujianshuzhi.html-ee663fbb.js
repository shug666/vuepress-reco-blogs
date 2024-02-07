import{_ as n,o as s,c as a,a as e}from"./app-668506b4.js";const t={},p=e(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>title: 归一化数值区间
date: 2022-11-11
tags:
 - java
categories: 
 - java
sticky: 
   true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="归一化" tabindex="-1"><a class="header-anchor" href="#归一化" aria-hidden="true">#</a> 归一化</h2><p>线性函数将原始数据线性化的方法转换到[0，1]的范围，归一化公式如下：</p><p><img src="https://img-blog.csdnimg.cn/20210519210557411.png" alt="在这里插入图片描述"></p><p>该方法实现对原始数据的等比例缩放，其中Xnorm为归一化后的数据，X为原始数据，Xmax、Xmin分别为原始数据集的最大值和最小值。 <strong>假如想把原始数据归一化到其他范围，比如[0,255],则可以在Xnorm函数后面乘以一个乘数255，同理其他的改变因子的大小就好了</strong></p><p>将0-255数值的数字归一化到0-1023区间，代码示例：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">private</span> <span class="token keyword">int</span> <span class="token function">normalization</span><span class="token punctuation">(</span><span class="token keyword">int</span> val<span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">int</span> min <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token keyword">int</span> max <span class="token operator">=</span> <span class="token number">255</span><span class="token punctuation">;</span>

    <span class="token keyword">double</span> ceil <span class="token operator">=</span> <span class="token class-name">Math</span><span class="token punctuation">.</span><span class="token function">ceil</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token keyword">double</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>val <span class="token operator">-</span> min<span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token punctuation">(</span>max <span class="token operator">-</span> min<span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token number">1023</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">)</span> ceil<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7),i=[p];function o(c,l){return s(),a("div",null,i)}const r=n(t,[["render",o],["__file","guiyihuaqujianshuzhi.html.vue"]]);export{r as default};
