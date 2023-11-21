import{_ as n,o as s,c as a,a as t}from"./app-ee4ba21e.js";const p={},e=t(`<h2 id="检测程序是否在前台运行" tabindex="-1"><a class="header-anchor" href="#检测程序是否在前台运行" aria-hidden="true">#</a> 检测程序是否在前台运行</h2><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">ActivityManager</span> mActivityManager <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">ActivityManager</span><span class="token punctuation">)</span> context<span class="token punctuation">.</span><span class="token function">getSystemService</span><span class="token punctuation">(</span><span class="token class-name">Context</span><span class="token punctuation">.</span><span class="token constant">ACTIVITY_SERVICE</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ActivityManager<span class="token punctuation">.</span>RunningTaskInfo</span><span class="token punctuation">&gt;</span></span> rti <span class="token operator">=</span> mActivityManager<span class="token punctuation">.</span><span class="token function">getRunningTasks</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">String</span> pname <span class="token operator">=</span> rti<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">.</span>topActivity<span class="token punctuation">.</span><span class="token function">getPackageName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//或者</span>
<span class="token comment">//String activity_name = mAm.getRunningTasks(1).get(0).topActivity.getClassName();</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>adb命令查看当前栈顶的Activity</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>dumpsys activity <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">&quot;mFoc&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="android代码中发送keycode按键" tabindex="-1"><a class="header-anchor" href="#android代码中发送keycode按键" aria-hidden="true">#</a> Android代码中发送Keycode按键</h2><p>有时候在代码中需要模拟一些用户操作的按键，例如TV 中遥控器的按键，一些测试脚本的编写。再比如android手机中虚拟按键，以及悬浮窗中的返回功能，等等。都是模拟发送按键来操作。</p><p>这里介绍三种方法，来实现用代码模拟发送按键。目前我都是在系统中（有系统签名和shareuid）测试的。如果第三方app想要调用使用，不知权限是否够。</p><h3 id="_1-调用input-命令" tabindex="-1"><a class="header-anchor" href="#_1-调用input-命令" aria-hidden="true">#</a> 1.调用input 命令</h3><p>使用过串口的都明白，如果需要debug 模拟按键，会使用 input keyevent 的方法。这个使用android runtime 模拟执行命令。值得一提的是，有些情况下有人想在代码里调用 adb shell xxx也可以用类似的方式：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">try</span><span class="token punctuation">{</span>
       <span class="token class-name">String</span> keyCommand <span class="token operator">=</span> <span class="token string">&quot;input keyevent &quot;</span> <span class="token operator">+</span> <span class="token class-name">KeyEvent</span><span class="token punctuation">.</span><span class="token constant">KEYCODE_1</span><span class="token punctuation">;</span>
       <span class="token class-name">Runtime</span> runtime <span class="token operator">=</span> <span class="token class-name">Runtime</span><span class="token punctuation">.</span><span class="token function">getRuntime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
       <span class="token class-name">Process</span> proc <span class="token operator">=</span> runtime<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span>keyCommand<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span> <span class="token keyword">catch</span><span class="token punctuation">(</span><span class="token class-name">IOException</span> e<span class="token punctuation">)</span><span class="token punctuation">{</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-在线程中使用instrumentation" tabindex="-1"><a class="header-anchor" href="#_2-在线程中使用instrumentation" aria-hidden="true">#</a> 2.在线程中使用Instrumentation</h3><p>这个方法必须要在线程中执行才有效：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">android<span class="token punctuation">.</span>app<span class="token punctuation">.</span></span><span class="token class-name">Instrumentation</span></span><span class="token punctuation">;</span>
 
<span class="token function">sendKeyCode</span><span class="token punctuation">(</span><span class="token class-name">KeyEvent</span><span class="token punctuation">.</span><span class="token constant">KEYCODE_DPAD_UP</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 
<span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">sendKeyCode</span><span class="token punctuation">(</span><span class="token keyword">final</span> <span class="token keyword">int</span> keyCode<span class="token punctuation">)</span><span class="token punctuation">{</span>
	<span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">try</span> <span class="token punctuation">{</span>
                <span class="token class-name">Instrumentation</span> inst <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Instrumentation</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                inst<span class="token punctuation">.</span><span class="token function">sendKeyDownUpSync</span><span class="token punctuation">(</span>keyCode<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Exception</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
         <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-调用inputmanager-api" tabindex="-1"><a class="header-anchor" href="#_3-调用inputmanager-api" aria-hidden="true">#</a> 3.调用InputManager api</h3><p>（android 系统虚拟按键就是使用这种方法）InputManager.getInstance().injectInputEvent 为隐藏方法，如果不是在系统中使用，则需要使用反射，或者将源码导入app，使其编译不报错。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">long</span> now <span class="token operator">=</span> <span class="token class-name">SystemClock</span><span class="token punctuation">.</span><span class="token function">uptimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 
<span class="token class-name">KeyEvent</span> down <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">KeyEvent</span><span class="token punctuation">(</span>now<span class="token punctuation">,</span> now<span class="token punctuation">,</span> <span class="token class-name">KeyEvent</span><span class="token punctuation">.</span><span class="token constant">ACTION_DOWN</span><span class="token punctuation">,</span> <span class="token class-name">KeyEvent</span><span class="token punctuation">.</span><span class="token constant">KEYCODE_1</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">InputManager</span><span class="token punctuation">.</span><span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">injectInputEvent</span><span class="token punctuation">(</span>down<span class="token punctuation">,</span>     
           <span class="token class-name">InputManager</span><span class="token punctuation">.</span><span class="token constant">INJECT_INPUT_EVENT_MODE_ASYNC</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 
<span class="token class-name">KeyEvent</span> up <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">KeyEvent</span><span class="token punctuation">(</span>now<span class="token punctuation">,</span> now<span class="token punctuation">,</span> <span class="token class-name">KeyEvent</span><span class="token punctuation">.</span><span class="token constant">ACTION_UP</span><span class="token punctuation">,</span> <span class="token class-name">KeyEvent</span><span class="token punctuation">.</span><span class="token constant">KEYCODE_1</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">InputManager</span><span class="token punctuation">.</span><span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">injectInputEvent</span><span class="token punctuation">(</span>up<span class="token punctuation">,</span> 
          <span class="token class-name">InputManager</span><span class="token punctuation">.</span><span class="token constant">INJECT_INPUT_EVENT_MODE_ASYNC</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,16),c=[e];function o(i,l){return s(),a("div",null,c)}const k=n(p,[["render",o],["__file","jiancechengxushifuzaiqiantaiyunxing.html.vue"]]);export{k as default};
