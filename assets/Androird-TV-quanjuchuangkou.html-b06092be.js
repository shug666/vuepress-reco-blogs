import{_ as t,r as p,o as e,c as o,b as s,d as n,e as c,a as l}from"./app-668506b4.js";const u={},i=l(`<h2 id="代码" tabindex="-1"><a class="header-anchor" href="#代码" aria-hidden="true">#</a> 代码</h2><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>	<span class="token keyword">private</span> <span class="token keyword">boolean</span> isCountDown<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">Handler</span> mHandler <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Handler</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">WindowManager</span> wm<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">WindowManager<span class="token punctuation">.</span>LayoutParams</span> params<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">View</span> countDownView<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">TextView</span> tv_time<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Timer</span> countDown <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token keyword">int</span> mValue <span class="token operator">=</span> <span class="token number">60</span><span class="token punctuation">;</span>
    
    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">show</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        wm <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">WindowManager</span><span class="token punctuation">)</span> <span class="token function">getApplicationContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getSystemService</span><span class="token punctuation">(</span><span class="token constant">WINDOW_SERVICE</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
        params <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">WindowManager<span class="token punctuation">.</span>LayoutParams</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 系统级别的窗口</span>
        params<span class="token punctuation">.</span>type <span class="token operator">=</span> <span class="token class-name">WindowManager<span class="token punctuation">.</span>LayoutParams</span><span class="token punctuation">.</span><span class="token constant">TYPE_SYSTEM_ALERT</span>
                <span class="token operator">|</span> <span class="token class-name">WindowManager<span class="token punctuation">.</span>LayoutParams</span><span class="token punctuation">.</span><span class="token constant">TYPE_SYSTEM_OVERLAY</span><span class="token punctuation">;</span>
        <span class="token comment">// 居中显示</span>
        params<span class="token punctuation">.</span>gravity <span class="token operator">=</span> <span class="token class-name">Gravity</span><span class="token punctuation">.</span><span class="token constant">CENTER</span><span class="token punctuation">;</span>
        <span class="token comment">// 设置背景透明</span>
        params<span class="token punctuation">.</span>format <span class="token operator">=</span> <span class="token class-name">PixelFormat</span><span class="token punctuation">.</span><span class="token constant">TRANSPARENT</span><span class="token punctuation">;</span>
        <span class="token comment">//拦截特殊按键，eg:power,volume</span>
        <span class="token keyword">int</span> keyFeatures <span class="token operator">=</span> params<span class="token punctuation">.</span>keyFeatures<span class="token punctuation">;</span>
        keyFeatures <span class="token operator">|=</span> <span class="token class-name">WindowManager<span class="token punctuation">.</span>LayoutParams</span><span class="token punctuation">.</span><span class="token constant">KEY_FEATURE_POWER_PASS_TO_USER</span><span class="token punctuation">;</span>
        keyFeatures <span class="token operator">|=</span> <span class="token class-name">WindowManager<span class="token punctuation">.</span>LayoutParams</span><span class="token punctuation">.</span><span class="token constant">KEY_FEATURE_HOME_PASS_TO_USER</span><span class="token punctuation">;</span>
        keyFeatures <span class="token operator">|=</span> <span class="token class-name">WindowManager<span class="token punctuation">.</span>LayoutParams</span><span class="token punctuation">.</span><span class="token constant">KEY_FEATURE_VOLUME_PASS_TO_USER</span><span class="token punctuation">;</span>
        keyFeatures <span class="token operator">|=</span> <span class="token class-name">WindowManager<span class="token punctuation">.</span>LayoutParams</span><span class="token punctuation">.</span><span class="token constant">KEY_FEATURE_APP_LAUNCHER_PASS_TO_USER</span><span class="token punctuation">;</span>
        keyFeatures <span class="token operator">|=</span> <span class="token class-name">WindowManager<span class="token punctuation">.</span>LayoutParams</span><span class="token punctuation">.</span><span class="token constant">KEY_FEATURE_INPUT_SOURCE_PASS_TO_USER</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>keyFeatures <span class="token operator">!=</span> params<span class="token punctuation">.</span>keyFeatures<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            params<span class="token punctuation">.</span>keyFeatures <span class="token operator">=</span> keyFeatures<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        countDownView <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">View</span><span class="token punctuation">(</span><span class="token function">getApplicationContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 不依赖activity的生命周期</span>
        <span class="token comment">//加载自定义的倒计时页面</span>
        countDownView <span class="token operator">=</span> <span class="token class-name">View</span><span class="token punctuation">.</span><span class="token function">inflate</span><span class="token punctuation">(</span><span class="token function">getApplicationContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
                <span class="token class-name">R</span><span class="token punctuation">.</span>layout<span class="token punctuation">.</span>countdown_weight<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//设置触摸可以获得焦点</span>
        countDownView<span class="token punctuation">.</span><span class="token function">setFocusableInTouchMode</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        tv_time <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">TextView</span><span class="token punctuation">)</span> countDownView<span class="token punctuation">.</span><span class="token function">findViewById</span><span class="token punctuation">(</span><span class="token class-name">R</span><span class="token punctuation">.</span>id<span class="token punctuation">.</span>countdown_text<span class="token punctuation">)</span><span class="token punctuation">;</span>
        tv_time<span class="token punctuation">.</span><span class="token function">setText</span><span class="token punctuation">(</span><span class="token function">getStyledText</span><span class="token punctuation">(</span><span class="token number">60</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        wm<span class="token punctuation">.</span><span class="token function">addView</span><span class="token punctuation">(</span>countDownView<span class="token punctuation">,</span> params<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//设置按键监听</span>
        countDownView<span class="token punctuation">.</span><span class="token function">setOnKeyListener</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">View<span class="token punctuation">.</span>OnKeyListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token annotation punctuation">@Override</span>
            <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">onKey</span><span class="token punctuation">(</span><span class="token class-name">View</span> view<span class="token punctuation">,</span> <span class="token keyword">int</span> i<span class="token punctuation">,</span> <span class="token class-name">KeyEvent</span> keyEvent<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token class-name">Log</span><span class="token punctuation">.</span><span class="token function">d</span><span class="token punctuation">(</span><span class="token constant">TAG</span><span class="token punctuation">,</span> <span class="token string">&quot;onKey: &quot;</span> <span class="token operator">+</span> keyEvent<span class="token punctuation">.</span><span class="token function">getKeyCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span>keyEvent<span class="token punctuation">.</span><span class="token function">getAction</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token class-name">KeyEvent</span><span class="token punctuation">.</span><span class="token constant">ACTION_UP</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                	<span class="token comment">//按下任意按键后，移除当前的倒计时窗口及定时任务</span>
                    <span class="token keyword">if</span> <span class="token punctuation">(</span>countDownView <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        wm<span class="token punctuation">.</span><span class="token function">removeView</span><span class="token punctuation">(</span>countDownView<span class="token punctuation">)</span><span class="token punctuation">;</span>
                        countDownView <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
                        countDown<span class="token punctuation">.</span><span class="token function">cancel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                        mValue <span class="token operator">=</span> <span class="token number">60</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
                <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 添加倒计时功能</span>
        countDown <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Timer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        countDown<span class="token punctuation">.</span><span class="token function">schedule</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">TimerTask</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token annotation punctuation">@Override</span>
            <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                mValue<span class="token operator">--</span><span class="token punctuation">;</span>
                mHandler<span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span>drawCount<span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span>mValue <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token comment">// 执行关机操作（这里可以使任意其他操作，根据自己的需求）</span>
                    <span class="token keyword">if</span> <span class="token punctuation">(</span>countDownView <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        wm<span class="token punctuation">.</span><span class="token function">removeView</span><span class="token punctuation">(</span>countDownView<span class="token punctuation">)</span><span class="token punctuation">;</span>
                        countDownView <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
                        <span class="token comment">// 取消定时</span>
                        countDown<span class="token punctuation">.</span><span class="token function">cancel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                        <span class="token function">goToShutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
	
	<span class="token comment">//更新倒计时</span>
	<span class="token class-name">Runnable</span> drawCount <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Runnable</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">Log</span><span class="token punctuation">.</span><span class="token function">d</span><span class="token punctuation">(</span><span class="token constant">TAG</span><span class="token punctuation">,</span> <span class="token string">&quot;Count Down Value: &quot;</span> <span class="token operator">+</span> mValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
            tv_time<span class="token punctuation">.</span><span class="token function">setText</span><span class="token punctuation">(</span><span class="token function">getStyledText</span><span class="token punctuation">(</span>mValue<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>

	<span class="token comment">//这里可以替换为其他内容，如果你需要用到这种类似倒计时执行指定方法的需求。</span>
    <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">goToShutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        mHandler<span class="token punctuation">.</span><span class="token function">postDelayed</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Runnable</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token annotation punctuation">@Override</span>
            <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  				<span class="token comment">//关机</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上面代码中，主要有以下几点需要注意:<br>  ①窗口需要设置setFocusableInTouchMode为true，允许触摸获得焦点。因为遥控器响应需要这个属性，同时添加的view不可以设置layoutParams.flags=LayoutParams.FLAG_NOT_FOCUSABLE，否则就完全屏蔽了按键了。满足这两个条件后，为添加的VIew设置的按键监听才可以接收到按键信息，具体怎么处理就是看需求了，我这里的需求就是移除窗口及取消定时任务。<br>  ②这个倒计时窗口肯定是允许取消的，那我们这里就设置了按下任意键就需要取消这个计时，同时移除窗口。但是在电视上面有些按键是在PhoneWindowManager做过处理的，我们的窗口无法响应，所以才有了上面特殊按键拦截的部分代码。这样即使按下关机键也仅仅只是做为一个取消的按键，而不是真的去关机。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2><p>​ 通过这种方式启动的窗口，在所有的应用页面都能看的到，不会因为Activity的生命周期而受到影响。这里需要注意，高版本下Android对服务管理还是很严格的，跳转应用后有可能服务无法正常工作，而我们的窗口也会受到影响，这里需要参考自家项目如何添加白名单去实现这种全局保活窗口的效果。</p>`,5),k={href:"https://blog.csdn.net/qq_36209279/article/details/119422211",target:"_blank",rel:"noopener noreferrer"};function r(d,v){const a=p("ExternalLinkIcon");return e(),o("div",null,[i,s("p",null,[n("本文转自 "),s("a",k,[n("https://blog.csdn.net/qq_36209279/article/details/119422211"),c(a)]),n("，如有侵权，请联系删除。")])])}const b=t(u,[["render",r],["__file","Androird-TV-quanjuchuangkou.html.vue"]]);export{b as default};
