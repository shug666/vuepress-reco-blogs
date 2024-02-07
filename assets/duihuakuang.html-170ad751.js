import{_ as n,o as s,c as a,a as t}from"./app-668506b4.js";const p={},o=t(`<h2 id="文本提示对话框" tabindex="-1"><a class="header-anchor" href="#文本提示对话框" aria-hidden="true">#</a> 文本提示对话框</h2><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">showDialog</span><span class="token punctuation">(</span><span class="token class-name">Context</span> context <span class="token punctuation">,</span><span class="token class-name">String</span> title<span class="token punctuation">,</span> <span class="token class-name">String</span> message<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token class-name">AlertDialog</span> dialog <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AlertDialog<span class="token punctuation">.</span>Builder</span><span class="token punctuation">(</span>context<span class="token punctuation">,</span> <span class="token class-name">AlertDialog</span><span class="token punctuation">.</span><span class="token constant">THEME_DEVICE_DEFAULT_LIGHT</span><span class="token punctuation">)</span>
				<span class="token punctuation">.</span><span class="token function">setTitle</span><span class="token punctuation">(</span>title<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setMessage</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setCancelable</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setPositiveButton</span><span class="token punctuation">(</span><span class="token string">&quot;OK&quot;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		dialog<span class="token punctuation">.</span><span class="token function">show</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		dialog<span class="token punctuation">.</span><span class="token function">getButton</span><span class="token punctuation">(</span><span class="token class-name">DialogInterface</span><span class="token punctuation">.</span><span class="token constant">BUTTON_POSITIVE</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">requestFocus</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="单选对话框" tabindex="-1"><a class="header-anchor" href="#单选对话框" aria-hidden="true">#</a> 单选对话框</h2><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">AlertDialog<span class="token punctuation">.</span>Builder</span> b <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AlertDialog<span class="token punctuation">.</span>Builder</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
b<span class="token punctuation">.</span><span class="token function">setTitle</span><span class="token punctuation">(</span><span class="token string">&quot;单选对话框&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">/*b.setSingleChoiceItems第一个参数为单选按钮组，第二个为默认选择第几个，第三个参数为监听事件*/</span>
b<span class="token punctuation">.</span><span class="token function">setSingleChoiceItems</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">{</span><span class="token string">&quot;1&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;2&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;3&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;4&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;5&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;6&quot;</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">DialogInterface<span class="token punctuation">.</span>OnClickListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">onClick</span><span class="token punctuation">(</span><span class="token class-name">DialogInterface</span> x<span class="token punctuation">,</span> <span class="token keyword">int</span> which<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token comment">//   which为当前选中的位置</span>
        which<span class="token operator">+=</span><span class="token number">1</span><span class="token punctuation">;</span>
        <span class="token class-name">Toast</span><span class="token punctuation">.</span><span class="token function">makeText</span><span class="token punctuation">(</span><span class="token function">getApplicationContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">&quot;选择了第&quot;</span><span class="token operator">+</span>which<span class="token operator">+</span><span class="token string">&quot;个&quot;</span><span class="token punctuation">,</span> <span class="token class-name">Toast</span><span class="token punctuation">.</span><span class="token constant">LENGTH_SHORT</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">show</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//打印</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
b<span class="token punctuation">.</span><span class="token function">setPositiveButton</span><span class="token punctuation">(</span><span class="token string">&quot;确定&quot;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">/*设置确定按钮，需要重写 DialogInterface.OnClickListener()的onClick方法这里我省略*/</span>
b<span class="token punctuation">.</span><span class="token function">show</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="复选对话框" tabindex="-1"><a class="header-anchor" href="#复选对话框" aria-hidden="true">#</a> 复选对话框</h2><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">AlertDialog<span class="token punctuation">.</span>Builder</span> b <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AlertDialog<span class="token punctuation">.</span>Builder</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">final</span> <span class="token class-name">String</span> items<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token keyword">new</span> <span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">{</span><span class="token string">&quot;音乐&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;画画&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;游泳&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;电影&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;游戏&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;运动&quot;</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token keyword">boolean</span><span class="token punctuation">[</span><span class="token punctuation">]</span> checks<span class="token operator">=</span><span class="token keyword">new</span> <span class="token keyword">boolean</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">{</span><span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
b<span class="token punctuation">.</span><span class="token function">setTitle</span><span class="token punctuation">(</span><span class="token string">&quot;选择你喜欢的项目：&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">/*b.setMultiChoiceItems第一个参数为复选按钮组，第二个为是否默认选中，对应复选按钮组，true为默认选中，第三个为监听事件*/</span>
b<span class="token punctuation">.</span><span class="token function">setMultiChoiceItems</span><span class="token punctuation">(</span>items<span class="token punctuation">,</span> checks<span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">DialogInterface<span class="token punctuation">.</span>OnMultiChoiceClickListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">onClick</span><span class="token punctuation">(</span><span class="token class-name">DialogInterface</span> dialog<span class="token punctuation">,</span> <span class="token keyword">int</span> which<span class="token punctuation">,</span> <span class="token keyword">boolean</span> isChecked<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Toast</span><span class="token punctuation">.</span><span class="token function">makeText</span><span class="token punctuation">(</span><span class="token function">getApplicationContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">&quot;你选择了&quot;</span><span class="token operator">+</span>items<span class="token punctuation">[</span>which<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token class-name">Toast</span><span class="token punctuation">.</span><span class="token constant">LENGTH_SHORT</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">show</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
b<span class="token punctuation">.</span><span class="token function">setPositiveButton</span><span class="token punctuation">(</span><span class="token string">&quot;确定&quot;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
b<span class="token punctuation">.</span><span class="token function">show</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//显示对话框</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="加载对话框" tabindex="-1"><a class="header-anchor" href="#加载对话框" aria-hidden="true">#</a> 加载对话框</h2><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">ProgressDialog</span> pg <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ProgressDialog</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
pg<span class="token punctuation">.</span><span class="token function">setTitle</span><span class="token punctuation">(</span><span class="token string">&quot;加载.&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
pg<span class="token punctuation">.</span><span class="token function">setMessage</span><span class="token punctuation">(</span><span class="token string">&quot;请稍等...&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
pg<span class="token punctuation">.</span><span class="token function">show</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="进度条对话框" tabindex="-1"><a class="header-anchor" href="#进度条对话框" aria-hidden="true">#</a> 进度条对话框</h2><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">ProgressDialog</span> pg <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ProgressDialog</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
pg<span class="token punctuation">.</span><span class="token function">setProgressStyle</span><span class="token punctuation">(</span><span class="token class-name">ProgressDialog</span><span class="token punctuation">.</span><span class="token constant">STYLE_HORIZONTAL</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//声明对话框的样式，进度条</span>
pg<span class="token punctuation">.</span><span class="token function">setMax</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//设置进度条的最大值</span>
pg<span class="token punctuation">.</span><span class="token function">setTitle</span><span class="token punctuation">(</span><span class="token string">&quot;加载.&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//设置标题</span>
pg<span class="token punctuation">.</span><span class="token function">setMessage</span><span class="token punctuation">(</span><span class="token string">&quot;请稍等...&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//设置提示内容</span>
pg<span class="token punctuation">.</span><span class="token function">show</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//显示对话框</span>
pg<span class="token punctuation">.</span><span class="token function">setProgress</span><span class="token punctuation">(</span><span class="token number">60</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//设置当前进度为60</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>动态进度条</strong></p><div class="language-JAVA line-numbers-mode" data-ext="JAVA"><pre class="language-JAVA"><code>final ProgressDialog pg = new ProgressDialog(this);
pg.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
pg.setMax(100);
pg.setTitle(&quot;加载.&quot;);
pg.setMessage(&quot;请稍等...&quot;);
pg.show();
new Thread(() -&gt; {
    for(int i=0;i&lt;=100;i++){
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        pg.setProgress(i);
    }

}).start();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,12),e=[o];function c(l,u){return s(),a("div",null,e)}const k=n(p,[["render",c],["__file","duihuakuang.html.vue"]]);export{k as default};
