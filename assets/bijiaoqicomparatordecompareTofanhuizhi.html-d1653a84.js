import{_ as e,r as t,o,c as p,b as n,d as a,e as c,a as r}from"./app-668506b4.js";const l={},i=r(`<p>在写比较器的时候老是纠结与到底哪个返回值是升序（从小到大），哪个返回值是降序（从大到小）。<br> 翻找源码，可以知道Comparator本质上是个交换（swap）</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> j<span class="token operator">=</span>i<span class="token punctuation">;</span> j<span class="token operator">&gt;</span>low <span class="token operator">&amp;&amp;</span> c<span class="token punctuation">.</span><span class="token function">compare</span><span class="token punctuation">(</span>dest<span class="token punctuation">[</span>j<span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span> dest<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token operator">&gt;</span><span class="token number">0</span><span class="token punctuation">;</span> j<span class="token operator">--</span><span class="token punctuation">)</span>
                    <span class="token function">swap</span><span class="token punctuation">(</span>dest<span class="token punctuation">,</span> j<span class="token punctuation">,</span> j<span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码的意思是，当<code>dest[j-1] - dest[j] &gt; 0</code>时，就交换两个元素。</p><p>这样做其实就是从小到大排序（升序)，对应我们重写compareTo方法中，arg0-arg1；并且，我们可以从源码中理解，当两者相等或者j-1小于j时，是不会有任何处理的即：</p><p><strong>那么，如何从大到小（降序）进行排序呢？</strong></p><p>我们会在CompareTo方法中重写为arg1-arg0；明身处在j-1这个下标之后的dest[j]却往前了，产生了的效果就是大的放在了前面，小的放在了后面。</p><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h3><ol><li>无论是arg0-arg1，还是arg1-arg0，都只需要看大于号的情况，小于等于的情况不需要管，即大于才交换原则。</li><li>arg0代表的是下标靠前的一个数，arg1代表的是下标靠后的一个数。</li></ol>`,8),u={href:"https://blog.csdn.net/qq_26558047/article/details/113718869",target:"_blank",rel:"noopener noreferrer"};function d(k,m){const s=t("ExternalLinkIcon");return o(),p("div",null,[i,n("p",null,[a("本文转自 "),n("a",u,[a("https://blog.csdn.net/qq_26558047/article/details/113718869"),c(s)]),a("，如有侵权，请联系删除。")])])}const _=e(l,[["render",d],["__file","bijiaoqicomparatordecompareTofanhuizhi.html.vue"]]);export{_ as default};
