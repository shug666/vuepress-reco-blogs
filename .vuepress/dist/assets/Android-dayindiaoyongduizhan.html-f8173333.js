import{_ as e,r as i,o as c,c as d,b as n,d as a,e as l,a as t}from"./app-f541e591.js";const o={},p=t(`<h2 id="内核-驱动层" tabindex="-1"><a class="header-anchor" href="#内核-驱动层" aria-hidden="true">#</a> 内核&amp;驱动层</h2><ul><li><p>添加头文件：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;linux/kprobes.h&gt;</span>  </span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;asm/traps.h&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>添加打印函数：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token function">printk</span><span class="token punctuation">(</span><span class="token string">&quot;Stack trace Begin:\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">dump_stack</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">printk</span><span class="token punctuation">(</span><span class="token string">&quot;Stack trace End:\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h2 id="c-c-hal层" tabindex="-1"><a class="header-anchor" href="#c-c-hal层" aria-hidden="true">#</a> C&amp;C++&amp;HAL层</h2><p>Android-Hal-C++打印调用栈</p><p>debuggerd是android的一个daemon进程，负责在进程出错异常时，将进程的运行时信息给dump出来供分析。 debuggerd的core dump数据，被保存在 /data/tombstone/ 目录下，共可保存10个文件，当超过10个时，会覆盖最早生产的文件。 在debug时，一般情况下，当程序出现异常时会自动将core dump信息保存起来。</p><p>当需要手动调试自己的程序并需要主动打印调用栈时，可以使用Android的callstack库。使用步骤如下：</p><ul><li><p>在<code>Android.bp</code>的<code>shared_libs</code>中增加如下选项</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token string">&quot;libutilscallstack&quot;</span>,
<span class="token comment">#&quot;libutils&quot;,</span>
<span class="token comment">#&quot;libcutils&quot;,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果是<code>Android.mk</code>则增加如下选项</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>LOCAL_SHARED_LIBRARIES <span class="token operator">+=</span> libutilscallstack libcutils libutils 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_1、创建一个-cpp文件" tabindex="-1"><a class="header-anchor" href="#_1、创建一个-cpp文件" aria-hidden="true">#</a> 1、创建一个.cpp文件</h3><p>dump_stack.cpp</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#include &lt;utils/CallStack.h&gt;
extern &quot;C&quot;
{
    void dumping_callstack(void);
}
void dumping_callstack(void)
{
    android::CallStack stack(&quot;[hao22]: start_output_stream&quot;);
}

/*
void dumping_callstack() {
   android::CallStack stack; 
  //如果这里的函数在android命名空间内，则可以改为 CallStack stack;
  stack.update();
  //输出到printf
  stack.dump(1);
  //输出到logcat
  stack.log(TAG);//TAG为日志标签，字符串类型
  //可以设置第2、3个参数
  //stack.log(&quot;Dumping Stack&quot;,ANDROID_LOG_ERROR ,&quot;123 &quot;);
}
*/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2、创建一个-h文件" tabindex="-1"><a class="header-anchor" href="#_2、创建一个-h文件" aria-hidden="true">#</a> 2、创建一个.h文件</h3><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>#ifndef DUMP_STACK_H
#define DUMP_STACK_H
void dumping_callstack(void);

#endif
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3、添加到android-mk" tabindex="-1"><a class="header-anchor" href="#_3、添加到android-mk" aria-hidden="true">#</a> 3、添加到Android.mk</h3><p>将dump_stack.cpp添加到Android.mk的源文件列表LOCAL_SRC_FILES中，并确保libcutils和libutilscallstack</p><p>在LOCAL_SHARED_LIBRARIES列表中</p><p><strong>注:P版本的callstack依赖库从libutils \\改到libutilscallstack\\中了</strong></p><h3 id="_4、将dump-stack-h头文件添加到目标-c文件中" tabindex="-1"><a class="header-anchor" href="#_4、将dump-stack-h头文件添加到目标-c文件中" aria-hidden="true">#</a> 4、将dump_stack.h头文件添加到目标.c文件中</h3><p>如，我想查看audio_hw.c中start_output_stream函数的堆栈调用信息，在audio_hw.c文件中加入</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;dump_stack.h&quot;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后在start_output_stream函数中添加</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token function">dumping_callstack</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li></ul><h2 id="java" tabindex="-1"><a class="header-anchor" href="#java" aria-hidden="true">#</a> Java</h2><ul><li><p>添加打印函数</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">android<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">Log</span></span><span class="token punctuation">;</span>

<span class="token comment">// Log.d(TAG, Log.getStackTraceString(new Throwable()));//TAG为日志标签，字符串类型</span>
<span class="token class-name">Log</span><span class="token punctuation">.</span><span class="token function">d</span><span class="token punctuation">(</span><span class="token constant">TAG</span><span class="token punctuation">,</span> <span class="token string">&quot;打印内容&quot;</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">Throwable</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//TAG为日志标签，字符串类型</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><p>https://blog.csdn.net/u012773843/article/details/113055574</p>`,10),r={href:"https://blog.csdn.net/m0_52481422/article/details/109807366",target:"_blank",rel:"noopener noreferrer"};function u(v,m){const s=i("ExternalLinkIcon");return c(),d("div",null,[p,n("p",null,[a("本文转自 "),n("a",r,[a("https://blog.csdn.net/m0_52481422/article/details/109807366"),l(s)]),a("，如有侵权，请联系删除。")])])}const b=e(o,[["render",u],["__file","Android-dayindiaoyongduizhan.html.vue"]]);export{b as default};
