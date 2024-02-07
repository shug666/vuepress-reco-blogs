import{_ as n,o as s,c as a,a as t}from"./app-668506b4.js";const e={},p=t(`<p>手机有个很人性化的设计，随着耳机的插拔，媒体的音量会有两种不同的状态。推理，手机中必然有一种机制实现对耳机插拔的实时监测。本文章就对这种机制进行简单描述，只涉及应用层。有两种方法实现对耳机是否插入手机的监测：一种是采用广播方式实现实时监测，一种是调用Android内部接口。下面对两种方法进行详细描述。</p><h2 id="_1、广播方式" tabindex="-1"><a class="header-anchor" href="#_1、广播方式" aria-hidden="true">#</a> 1、广播方式</h2><p>广播是Android中实现系统级消息通知的机制，灵活简单，如果某个软件要判断某个消息，只要简单的在软件中进行注册即可。耳机插入和拔出时会发出广播ACTION_HEADSET_PLUG，所以只要注册一个广播接受者就可以监听耳机的状态。</p><p>直接上代码：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">//广播处理接口</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">HeadSetChangeReceiver</span> <span class="token keyword">extends</span> <span class="token class-name">BroadcastReceiver</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Override</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">onReceive</span><span class="token punctuation">(</span><span class="token class-name">Context</span> context<span class="token punctuation">,</span> <span class="token class-name">Intent</span> intent<span class="token punctuation">)</span> <span class="token punctuation">{</span>

        <span class="token keyword">if</span><span class="token punctuation">(</span>intent<span class="token punctuation">.</span><span class="token function">hasExtra</span><span class="token punctuation">(</span><span class="token string">&quot;state&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>

            <span class="token keyword">if</span><span class="token punctuation">(</span>intent<span class="token punctuation">.</span><span class="token function">getIntExtra</span><span class="token punctuation">(</span><span class="token string">&quot;state&quot;</span><span class="token punctuation">,</span><span class="token number">0</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">{</span>        
                <span class="token comment">//断开耳机</span>
                <span class="token comment">//可以加入自己想要处理的代码</span>
                <span class="token class-name">Toast</span><span class="token punctuation">.</span><span class="token function">makeText</span><span class="token punctuation">(</span>context<span class="token punctuation">,</span><span class="token string">&quot;discontent&quot;</span><span class="token punctuation">,</span><span class="token class-name">Toast</span><span class="token punctuation">.</span><span class="token constant">LENGTH_SHORT</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">show</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token punctuation">}</span><span class="token keyword">else</span> <span class="token keyword">if</span><span class="token punctuation">(</span>intent<span class="token punctuation">.</span><span class="token function">getIntExtra</span><span class="token punctuation">(</span><span class="token string">&quot;state&quot;</span><span class="token punctuation">,</span><span class="token number">0</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">{</span>  
                <span class="token comment">//连接耳机</span>
                <span class="token class-name">Toast</span><span class="token punctuation">.</span><span class="token function">makeText</span><span class="token punctuation">(</span>context<span class="token punctuation">,</span><span class="token string">&quot;content&quot;</span><span class="token punctuation">,</span><span class="token class-name">Toast</span><span class="token punctuation">.</span><span class="token constant">LENGTH_SHORT</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">show</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token punctuation">}</span>

        <span class="token punctuation">}</span>

    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>

<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MainActivity</span> <span class="token keyword">extends</span> <span class="token class-name">AppCompatActivity</span> <span class="token punctuation">{</span>

    <span class="token keyword">private</span> <span class="token class-name">IntentFilter</span> intentFilter<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">HeadSetChangeReceiver</span> headSetChangeReceiver<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">protected</span> <span class="token keyword">void</span> <span class="token function">onCreate</span><span class="token punctuation">(</span><span class="token class-name">Bundle</span> savedInstanceState<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">onCreate</span><span class="token punctuation">(</span>savedInstanceState<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token function">setContentView</span><span class="token punctuation">(</span><span class="token class-name">R</span><span class="token punctuation">.</span>layout<span class="token punctuation">.</span>activity_main<span class="token punctuation">)</span><span class="token punctuation">;</span>

        intentFilter <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">IntentFilter</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        intentFilter<span class="token punctuation">.</span><span class="token function">addAction</span><span class="token punctuation">(</span><span class="token string">&quot;android.intent.action.HEADSET_PLUG&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        headSetChangeReceiver <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HeadSetChangeReceiver</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token function">registerReceiver</span><span class="token punctuation">(</span>headSetChangeReceiver<span class="token punctuation">,</span>intentFilter<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">//注册广播</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">protected</span> <span class="token keyword">void</span> <span class="token function">onDestroy</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">onDestroy</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token function">unregisterReceiver</span><span class="token punctuation">(</span>headSetChangeReceiver<span class="token punctuation">)</span><span class="token punctuation">;</span>             <span class="token comment">//退出时一定要取消注册</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2、借用系统内部类" tabindex="-1"><a class="header-anchor" href="#_2、借用系统内部类" aria-hidden="true">#</a> 2、借用系统内部类</h2><p>Android源码中 android.media.AudioManager 类有一个方法  isWiredHeadsetOn()  判断有线耳机是否连接，这个方法不是静态方法，所以不能直接调用。而且现在google 强烈反对（deprecated）使用这个方法，所以一般使用上面的方法实现对耳机的检测。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">private</span> <span class="token class-name">AudioManager</span> audoManager<span class="token punctuation">;</span>  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后在activity的oncreate() 方法中取得对象</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>audoManager <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">AudioManager</span><span class="token punctuation">)</span><span class="token function">getSystemService</span><span class="token punctuation">(</span><span class="token class-name">Context</span><span class="token punctuation">.</span><span class="token constant">AUDIO_SERVICE</span><span class="token punctuation">)</span><span class="token punctuation">;</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后可以直接调用   audoManager.isWiredHeadsetOn();</p><p>具体代码如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">//需要申请权限</span>
<span class="token operator">&lt;</span><span class="token keyword">uses</span><span class="token operator">-</span>permission android<span class="token operator">:</span>name<span class="token operator">=</span><span class="token string">&quot;android.permission.MODIFY_AUDIO_SETTINGS&quot;</span> <span class="token operator">/</span><span class="token operator">&gt;</span> 

mainActivity<span class="token punctuation">.</span>java 

  <span class="token keyword">private</span> <span class="token class-name">AudioManager</span> audioManager<span class="token punctuation">;</span>

  <span class="token annotation punctuation">@Override</span>

  <span class="token keyword">protected</span> <span class="token keyword">void</span> <span class="token function">onCreate</span><span class="token punctuation">(</span><span class="token class-name">Bundle</span> savedInstanceState<span class="token punctuation">)</span> <span class="token punctuation">{</span>
     <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">onCreate</span><span class="token punctuation">(</span>savedInstanceState<span class="token punctuation">)</span><span class="token punctuation">;</span>
     <span class="token function">setContentView</span><span class="token punctuation">(</span><span class="token class-name">R</span><span class="token punctuation">.</span>layout<span class="token punctuation">.</span>activity_main<span class="token punctuation">)</span><span class="token punctuation">;</span>

     audioManager <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">AudioManager</span><span class="token punctuation">)</span><span class="token function">getSystemService</span><span class="token punctuation">(</span><span class="token class-name">Context</span><span class="token punctuation">.</span><span class="token constant">AUDIO_SERVICE</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
     <span class="token keyword">if</span><span class="token punctuation">(</span>audioManager<span class="token punctuation">.</span><span class="token function">isWiredHeadsetOn</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">//假如你要处理的代码</span>
     <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二种方法如果需要像广播那样实现实时监测，就需要在进程中键入while循环，或者采用异步处理机制，这就导致代码太过麻烦。对比不难发现，广播实现的更加优秀，代码合理，且对外检查很方便。</p>`,14),c=[p];function o(i,l){return s(),a("div",null,c)}const d=n(e,[["render",o],["__file","erjichabazhuangtaidejiance.html.vue"]]);export{d as default};
