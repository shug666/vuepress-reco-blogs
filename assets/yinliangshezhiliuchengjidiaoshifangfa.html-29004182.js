import{_ as n,o as s,c as a,a as e}from"./app-e8f85126.js";const t={},p=e(`<h2 id="流程框图" tabindex="-1"><a class="header-anchor" href="#流程框图" aria-hidden="true">#</a> 流程框图</h2><p><img src="https://raw.githubusercontent.com/shug666/image/main/images/2021041323333185.png" alt="在这里插入图片描述"></p><h2 id="初始化" tabindex="-1"><a class="header-anchor" href="#初始化" aria-hidden="true">#</a> 初始化</h2><p>开机的时候，系统会从数据库中更新当前的音量值给各个音频流</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">// 根据数据库的配置创建流的状态</span>
<span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">createStreamStates</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">int</span> numStreamTypes <span class="token operator">=</span> <span class="token class-name">AudioSystem</span><span class="token punctuation">.</span><span class="token function">getNumStreamTypes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">VolumeStreamState</span><span class="token punctuation">[</span><span class="token punctuation">]</span> streams <span class="token operator">=</span> mStreamStates <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">VolumeStreamState</span><span class="token punctuation">[</span>numStreamTypes<span class="token punctuation">]</span><span class="token punctuation">;</span>
 
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> numStreamTypes<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        streams<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">VolumeStreamState</span><span class="token punctuation">(</span><span class="token class-name">System</span><span class="token punctuation">.</span><span class="token constant">VOLUME_SETTINGS</span><span class="token punctuation">[</span>mStreamVolumeAlias<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">,</span> i<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// VolumeStreamState 构造</span>
    <span class="token punctuation">}</span>
 
    <span class="token function">checkAllAliasStreamVolumes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>   <span class="token comment">// 更新音量到设备中</span>
<span class="token punctuation">}</span>
 
<span class="token comment">// 在数据库中读取每个设备的流音量</span>
<span class="token keyword">private</span> <span class="token class-name">VolumeStreamState</span><span class="token punctuation">(</span><span class="token class-name">String</span> settingName<span class="token punctuation">,</span> <span class="token keyword">int</span> streamType<span class="token punctuation">)</span> <span class="token punctuation">{</span>
 
    mVolumeIndexSettingName <span class="token operator">=</span> settingName<span class="token punctuation">;</span>
 
    mStreamType <span class="token operator">=</span> streamType<span class="token punctuation">;</span>
    mIndexMax <span class="token operator">=</span> <span class="token constant">MAX_STREAM_VOLUME</span><span class="token punctuation">[</span>streamType<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token class-name">AudioSystem</span><span class="token punctuation">.</span><span class="token function">initStreamVolume</span><span class="token punctuation">(</span>streamType<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> mIndexMax<span class="token punctuation">)</span><span class="token punctuation">;</span>
    mIndexMax <span class="token operator">*=</span> <span class="token number">10</span><span class="token punctuation">;</span>
 
    <span class="token comment">// mDeathHandlers must be created before calling readSettings()</span>
    mDeathHandlers <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">VolumeDeathHandler</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 
    <span class="token function">readSettings</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>         <span class="token comment">// 从数据库中读取数据，每个设备有自己独立的音量</span>
<span class="token punctuation">}</span>
 
<span class="token comment">// 数据库中键值的拼接方法，exp: volume_music_speaker</span>
<span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getSettingNameForDevice</span><span class="token punctuation">(</span><span class="token keyword">int</span> device<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">String</span> name <span class="token operator">=</span> mVolumeIndexSettingName<span class="token punctuation">;</span>
    <span class="token class-name">String</span> suffix <span class="token operator">=</span> <span class="token class-name">AudioSystem</span><span class="token punctuation">.</span><span class="token function">getDeviceName</span><span class="token punctuation">(</span>device<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>suffix<span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> name<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> name <span class="token operator">+</span> <span class="token string">&quot;_&quot;</span> <span class="token operator">+</span> suffix<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
 
<span class="token comment">// 更新音量到设备中</span>
<span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">checkAllAliasStreamVolumes</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">int</span> numStreamTypes <span class="token operator">=</span> <span class="token class-name">AudioSystem</span><span class="token punctuation">.</span><span class="token function">getNumStreamTypes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> streamType <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> streamType <span class="token operator">&lt;</span> numStreamTypes<span class="token punctuation">;</span> streamType<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>streamType <span class="token operator">!=</span> mStreamVolumeAlias<span class="token punctuation">[</span>streamType<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            mStreamStates<span class="token punctuation">[</span>streamType<span class="token punctuation">]</span><span class="token punctuation">.</span>
                                <span class="token function">setAllIndexes</span><span class="token punctuation">(</span>mStreamStates<span class="token punctuation">[</span>mStreamVolumeAlias<span class="token punctuation">[</span>streamType<span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// apply stream volume</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>mStreamStates<span class="token punctuation">[</span>streamType<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">isMuted</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            mStreamStates<span class="token punctuation">[</span>streamType<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">applyAllVolumes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 更新设备音量</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="音量调整" tabindex="-1"><a class="header-anchor" href="#音量调整" aria-hidden="true">#</a> 音量调整</h2><p>上层通过java层接口设置音量，该流程主要分析 <code>AudioService.java</code> 提供的 <code>setStreamVolume</code> 接口</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">// AudioService.java 设置音量入口</span>
<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setStreamVolume</span><span class="token punctuation">(</span><span class="token keyword">int</span> streamType<span class="token punctuation">,</span> <span class="token keyword">int</span> index<span class="token punctuation">,</span> <span class="token keyword">int</span> flags<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">IAudioService</span> service <span class="token operator">=</span> <span class="token function">getService</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">try</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>mUseMasterVolume<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            service<span class="token punctuation">.</span><span class="token function">setMasterVolume</span><span class="token punctuation">(</span>index<span class="token punctuation">,</span> flags<span class="token punctuation">,</span> mContext<span class="token punctuation">.</span><span class="token function">getOpPackageName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            service<span class="token punctuation">.</span><span class="token function">setStreamVolume</span><span class="token punctuation">(</span>streamType<span class="token punctuation">,</span> index<span class="token punctuation">,</span> flags<span class="token punctuation">,</span> mContext<span class="token punctuation">.</span><span class="token function">getOpPackageName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">RemoteException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Log</span><span class="token punctuation">.</span><span class="token function">e</span><span class="token punctuation">(</span><span class="token constant">TAG</span><span class="token punctuation">,</span> <span class="token string">&quot;Dead object in setStreamVolume&quot;</span><span class="token punctuation">,</span> e<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
 
<span class="token comment">// AudioService.java 设置音量</span>
<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setStreamVolume</span><span class="token punctuation">(</span><span class="token keyword">int</span> streamType<span class="token punctuation">,</span> <span class="token keyword">int</span> index<span class="token punctuation">,</span> <span class="token keyword">int</span> flags<span class="token punctuation">,</span> <span class="token class-name">String</span> callingPackage<span class="token punctuation">)</span> <span class="token punctuation">{</span>
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
    <span class="token function">ensureValidStreamType</span><span class="token punctuation">(</span>streamType<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">int</span> streamTypeAlias <span class="token operator">=</span> mStreamVolumeAlias<span class="token punctuation">[</span>streamType<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token class-name">VolumeStreamState</span> streamState <span class="token operator">=</span> mStreamStates<span class="token punctuation">[</span>streamTypeAlias<span class="token punctuation">]</span><span class="token punctuation">;</span>
 
    <span class="token keyword">final</span> <span class="token keyword">int</span> device <span class="token operator">=</span> <span class="token function">getDeviceForStream</span><span class="token punctuation">(</span>streamType<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">int</span> oldIndex<span class="token punctuation">;</span>
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
            <span class="token function">onSetStreamVolume</span><span class="token punctuation">(</span>streamType<span class="token punctuation">,</span> index<span class="token punctuation">,</span> flags<span class="token punctuation">,</span> device<span class="token punctuation">)</span><span class="token punctuation">;</span>    <span class="token comment">// 发送 MSG_SET_DEVICE_VOLUME</span>
            index <span class="token operator">=</span> mStreamStates<span class="token punctuation">[</span>streamType<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">getIndex</span><span class="token punctuation">(</span>device<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">sendVolumeUpdate</span><span class="token punctuation">(</span>streamType<span class="token punctuation">,</span> oldIndex<span class="token punctuation">,</span> index<span class="token punctuation">,</span> flags<span class="token punctuation">)</span><span class="token punctuation">;</span>           <span class="token comment">// 发送广播</span>
<span class="token punctuation">}</span>
 
<span class="token comment">// onSetStreamVolume -&gt; setStreamVolumeInt</span>
<span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">setStreamVolumeInt</span><span class="token punctuation">(</span><span class="token keyword">int</span> streamType<span class="token punctuation">,</span>
                                <span class="token keyword">int</span> index<span class="token punctuation">,</span>
                                <span class="token keyword">int</span> device<span class="token punctuation">,</span>
                                <span class="token keyword">boolean</span> force<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">VolumeStreamState</span> streamState <span class="token operator">=</span> mStreamStates<span class="token punctuation">[</span>streamType<span class="token punctuation">]</span><span class="token punctuation">;</span>
 
    <span class="token keyword">if</span> <span class="token punctuation">(</span>streamState<span class="token punctuation">.</span><span class="token function">setIndex</span><span class="token punctuation">(</span>index<span class="token punctuation">,</span> device<span class="token punctuation">)</span> <span class="token operator">||</span> force<span class="token punctuation">)</span> <span class="token punctuation">{</span>  <span class="token comment">// 更新到 streamState 的映射表中</span>
        <span class="token comment">// Post message to set system volume (it in turn will post a message</span>
        <span class="token comment">// to persist).</span>
        <span class="token function">sendMsg</span><span class="token punctuation">(</span>mAudioHandler<span class="token punctuation">,</span>
                <span class="token constant">MSG_SET_DEVICE_VOLUME</span><span class="token punctuation">,</span>    <span class="token comment">// 更新音量到设备</span>
                <span class="token constant">SENDMSG_QUEUE</span><span class="token punctuation">,</span>
                device<span class="token punctuation">,</span>
                <span class="token number">0</span><span class="token punctuation">,</span>
                streamState<span class="token punctuation">,</span>
                <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
 
<span class="token comment">// 处理消息：MSG_SET_DEVICE_VOLUME</span>
<span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">setDeviceVolume</span><span class="token punctuation">(</span><span class="token class-name">VolumeStreamState</span> streamState<span class="token punctuation">,</span> <span class="token keyword">int</span> device<span class="token punctuation">)</span> <span class="token punctuation">{</span>
 
    <span class="token comment">// Apply volume</span>
    streamState<span class="token punctuation">.</span><span class="token function">applyDeviceVolume</span><span class="token punctuation">(</span>device<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
    <span class="token comment">// Post a persist volume msg</span>
    <span class="token function">sendMsg</span><span class="token punctuation">(</span>mAudioHandler<span class="token punctuation">,</span>
            <span class="token constant">MSG_PERSIST_VOLUME</span><span class="token punctuation">,</span>   <span class="token comment">// 保存数据库</span>
            <span class="token constant">SENDMSG_QUEUE</span><span class="token punctuation">,</span>
            device<span class="token punctuation">,</span>
            <span class="token number">0</span><span class="token punctuation">,</span>
            streamState<span class="token punctuation">,</span>
            <span class="token constant">PERSIST_DELAY</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 
<span class="token punctuation">}</span>
 
<span class="token comment">// 通过message：MSG_PERSIST_VOLUME 把音量同步到数据库</span>
<span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">persistVolume</span><span class="token punctuation">(</span><span class="token class-name">VolumeStreamState</span> streamState<span class="token punctuation">,</span> <span class="token keyword">int</span> device<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>mUseFixedVolume<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">putIntForUser</span><span class="token punctuation">(</span>mContentResolver<span class="token punctuation">,</span>
              streamState<span class="token punctuation">.</span><span class="token function">getSettingNameForDevice</span><span class="token punctuation">(</span>device<span class="token punctuation">)</span><span class="token punctuation">,</span>
              <span class="token punctuation">(</span>streamState<span class="token punctuation">.</span><span class="token function">getIndex</span><span class="token punctuation">(</span>device<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">5</span><span class="token punctuation">)</span><span class="token operator">/</span> <span class="token number">10</span><span class="token punctuation">,</span>
              <span class="token class-name">UserHandle</span><span class="token punctuation">.</span><span class="token constant">USER_CURRENT</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
 
<span class="token comment">// 通过binder通信调用到ap中的设置音量接口</span>
<span class="token class-name">AudioPolicyManagerBase</span><span class="token operator">::</span><span class="token function">setStreamVolumeIndex</span>
 
<span class="token comment">// 最后在Mixer里准备播放时，音量生效</span>
<span class="token keyword">case</span> <span class="token constant">VOLUME</span><span class="token operator">:</span>
    <span class="token keyword">switch</span> <span class="token punctuation">(</span>param<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token constant">VOLUME0</span><span class="token operator">:</span>
    <span class="token keyword">case</span> <span class="token constant">VOLUME1</span><span class="token operator">:</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>track<span class="token punctuation">.</span>volume<span class="token punctuation">[</span>param<span class="token operator">-</span><span class="token constant">VOLUME0</span><span class="token punctuation">]</span> <span class="token operator">!=</span> valueInt<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">ALOGV</span><span class="token punctuation">(</span><span class="token string">&quot;setParameter(VOLUME, VOLUME0/1: %04x)&quot;</span><span class="token punctuation">,</span> valueInt<span class="token punctuation">)</span><span class="token punctuation">;</span>
            track<span class="token punctuation">.</span>prevVolume<span class="token punctuation">[</span>param<span class="token operator">-</span><span class="token constant">VOLUME0</span><span class="token punctuation">]</span> <span class="token operator">=</span> track<span class="token punctuation">.</span>volume<span class="token punctuation">[</span>param<span class="token operator">-</span><span class="token constant">VOLUME0</span><span class="token punctuation">]</span> <span class="token operator">&lt;&lt;</span> <span class="token number">16</span><span class="token punctuation">;</span>
            track<span class="token punctuation">.</span>volume<span class="token punctuation">[</span>param<span class="token operator">-</span><span class="token constant">VOLUME0</span><span class="token punctuation">]</span> <span class="token operator">=</span> valueInt<span class="token punctuation">;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>target <span class="token operator">==</span> <span class="token constant">VOLUME</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                track<span class="token punctuation">.</span>prevVolume<span class="token punctuation">[</span>param<span class="token operator">-</span><span class="token constant">VOLUME0</span><span class="token punctuation">]</span> <span class="token operator">=</span> valueInt <span class="token operator">&lt;&lt;</span> <span class="token number">16</span><span class="token punctuation">;</span>
                track<span class="token punctuation">.</span>volumeInc<span class="token punctuation">[</span>param<span class="token operator">-</span><span class="token constant">VOLUME0</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
                int32_t d <span class="token operator">=</span> <span class="token punctuation">(</span>valueInt<span class="token operator">&lt;&lt;</span><span class="token number">16</span><span class="token punctuation">)</span> <span class="token operator">-</span> track<span class="token punctuation">.</span>prevVolume<span class="token punctuation">[</span>param<span class="token operator">-</span><span class="token constant">VOLUME0</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
                int32_t volInc <span class="token operator">=</span> d <span class="token operator">/</span> <span class="token function">int32_t</span><span class="token punctuation">(</span>mState<span class="token punctuation">.</span>frameCount<span class="token punctuation">)</span><span class="token punctuation">;</span>
                track<span class="token punctuation">.</span>volumeInc<span class="token punctuation">[</span>param<span class="token operator">-</span><span class="token constant">VOLUME0</span><span class="token punctuation">]</span> <span class="token operator">=</span> volInc<span class="token punctuation">;</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span>volInc <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    track<span class="token punctuation">.</span>prevVolume<span class="token punctuation">[</span>param<span class="token operator">-</span><span class="token constant">VOLUME0</span><span class="token punctuation">]</span> <span class="token operator">=</span> valueInt <span class="token operator">&lt;&lt;</span> <span class="token number">16</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
            <span class="token function">invalidateState</span><span class="token punctuation">(</span><span class="token number">1</span> <span class="token operator">&lt;&lt;</span> name<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>参考链接：https://blog.csdn.net/xlnaan/article/details/80527902</p></blockquote><h2 id="常用调试手段" tabindex="-1"><a class="header-anchor" href="#常用调试手段" aria-hidden="true">#</a> 常用调试手段</h2><h3 id="系统音量查询" tabindex="-1"><a class="header-anchor" href="#系统音量查询" aria-hidden="true">#</a> 系统音量查询</h3><h4 id="dumpsys" tabindex="-1"><a class="header-anchor" href="#dumpsys" aria-hidden="true">#</a> DumpSys</h4><p>我们可以利用android的dumpsys机制，来查询系统的流音量</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>root@rk3188:/data <span class="token comment"># dumpsys media.audio_policy</span>
 
Outputs dump:
- Output <span class="token number">2</span> dump:                            // outputs index
Sampling rate: <span class="token number">44100</span>
Format: 00000001
Channels: 00000003
Latency: <span class="token number">92</span>
Flags 00000002
Devices 00000002    // 设备号
 Stream volume refCount muteCount           // 这边声音流的相关信息
 00     <span class="token number">0.444</span>     00       00
 01     <span class="token number">0.501</span>     00       00
 02     <span class="token number">0.135</span>     00       00
 03     <span class="token number">1.000</span>     00       00
 04     <span class="token number">0.135</span>     00       00
 05     <span class="token number">0.135</span>     00       00
 06     <span class="token parameter variable">-1.000</span>     00       00
 07     <span class="token number">0.501</span>     00       00
 08     <span class="token number">0.501</span>     00       00
 09     <span class="token number">1.000</span>     00       00
 
// Android系统现有流的定义
typedef enum <span class="token punctuation">{</span>
    AUDIO_STREAM_DEFAULT          <span class="token operator">=</span> -1,
    AUDIO_STREAM_VOICE_CALL       <span class="token operator">=</span> <span class="token number">0</span>,
    AUDIO_STREAM_SYSTEM           <span class="token operator">=</span> <span class="token number">1</span>,
    AUDIO_STREAM_RING             <span class="token operator">=</span> <span class="token number">2</span>,
    AUDIO_STREAM_MUSIC            <span class="token operator">=</span> <span class="token number">3</span>,
    AUDIO_STREAM_ALARM            <span class="token operator">=</span> <span class="token number">4</span>,
    AUDIO_STREAM_NOTIFICATION     <span class="token operator">=</span> <span class="token number">5</span>,
    AUDIO_STREAM_BLUETOOTH_SCO    <span class="token operator">=</span> <span class="token number">6</span>,
    AUDIO_STREAM_ENFORCED_AUDIBLE <span class="token operator">=</span> <span class="token number">7</span>, /* Sounds that cannot be muted by user and must be routed to speaker */
    AUDIO_STREAM_DTMF             <span class="token operator">=</span> <span class="token number">8</span>,
    AUDIO_STREAM_TTS              <span class="token operator">=</span> <span class="token number">9</span>,
 
    AUDIO_STREAM_CNT,
    AUDIO_STREAM_MAX              <span class="token operator">=</span> AUDIO_STREAM_CNT - <span class="token number">1</span>,
<span class="token punctuation">}</span> audio_stream_type_t<span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="数据库-sqlite3" tabindex="-1"><a class="header-anchor" href="#数据库-sqlite3" aria-hidden="true">#</a> 数据库(sqlite3)</h4><p>新版本为对应xml文件</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 首先进入数据库的存储目录
root@rk3188:/ # cd /data/data/com.android.providers.settings/databases
root@rk3188:/data/data/com.android.providers.settings/databases # ls
settings.db
settings.db-journal
ngs.db
// 音量数据保存在 settings.db 中的 system 表里，可以使用sqlite命令进行查询
root@rk3188:/data/data/com.android.providers.settings/databases # sqlite3 settings.db
SQLite version 3.7.11 2012-03-20 11:35:50
Enter &quot;.help&quot; for instructions
Enter SQL statements terminated with a &quot;;&quot;
sqlite&gt; .table                                      // 查看数据库里包含的表
android_metadata   bookmarks          secure
bluetooth_devices  global             system
sqlite&gt; select * from system;                       // 选中system表dump出数据，我们可以看到volume相关的一些设置
2|volume_ring|5
3|volume_system|7
4|volume_voice|4
5|volume_alarm|6
6|volume_notification|5
7|volume_bluetooth_sco|7
34|volume_music_headset|10
35|volume_music_headphone|10
298|volume_master|1.0
1035|volume_ring_speaker|5
1504|volume_ring_analog_dock|5
1505|volume_alarm_speaker|7
1649|volume_music|20
1885|volume_music_analog_dock|99
1893|volume_voice_analog_dock|100
1895|volume_music_speaker|70
1896|volume_voice_speaker|70

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="audio模块log开关" tabindex="-1"><a class="header-anchor" href="#audio模块log开关" aria-hidden="true">#</a> Audio模块Log开关</h3><p>默认的发行版本中可见的log非常少，我们需要修改代码的log定义，然后替换对应so文件把用于调试的log全部打开。<br> 具体的修改方法如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>// 以 AudioPolicyManagerBase.cpp 文件举例，我们只需要把文件前面的log注释打开，代码中的调试Log就可以打印出来
 
<span class="token function">diff</span> <span class="token parameter variable">--git</span> a/hardware/rk29/audio/AudioPolicyManagerBase.cpp b/hardware/rk29/audio/AudioPolicyManagerBase.cpp
old mode <span class="token number">100644</span>
new mode <span class="token number">100755</span>
index cba5eb4<span class="token punctuation">..</span>d18b348
--- a/hardware/rk29/audio/AudioPolicyManagerBase.cpp
+++ b/hardware/rk29/audio/AudioPolicyManagerBase.cpp
@@ -15,9 +15,9 @@
  */
 
<span class="token comment">#define LOG_TAG &quot;AudioPolicyManagerBase&quot;</span>
-//<span class="token comment">#define LOG_NDEBUG 0</span>
+<span class="token comment">#define LOG_NDEBUG 0</span>
 
-//<span class="token comment">#define VERY_VERBOSE_LOGGING</span>
+<span class="token comment">#define VERY_VERBOSE_LOGGING</span>
<span class="token comment">#ifdef VERY_VERBOSE_LOGGING</span>
<span class="token comment">#define ALOGVV ALOGV</span>
<span class="token comment">#else</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="mixer设备查询" tabindex="-1"><a class="header-anchor" href="#mixer设备查询" aria-hidden="true">#</a> Mixer设备查询</h3><p>Mixer的一些设备状态对于定位Audio问题非常有帮助，这些设备里包括控制通路开关、音量、增益等；这些配置对于Audio是能够正常使用，起着至关重要的作用。<br> Android系统内置了一些查询和设置命令，使用方法如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>cmd： amix
// 查询
root@rk3188:/ <span class="token comment"># amix -c 0</span>
Card:0
  <span class="token function">id</span> iface dev sub idx num perms     <span class="token builtin class-name">type</span>   name
   <span class="token number">1</span> MIXER   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">2</span> rw        BOOL   HP Playback Switch: OFF OFF <span class="token punctuation">{</span> <span class="token assign-left variable">OFF</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">ON</span><span class="token operator">=</span><span class="token number">1</span> <span class="token punctuation">}</span>
   <span class="token number">2</span> MIXER   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">2</span> rw  R     INT32  HP Playback Volume: <span class="token number">31</span> <span class="token number">31</span> <span class="token punctuation">{</span> <span class="token number">0</span>-31 <span class="token punctuation">}</span>
   <span class="token number">3</span> MIXER   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">2</span> rw        BOOL   OUT Playback Switch: OFF OFF <span class="token punctuation">{</span> <span class="token assign-left variable">OFF</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">ON</span><span class="token operator">=</span><span class="token number">1</span> <span class="token punctuation">}</span>
   <span class="token number">4</span> MIXER   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">2</span> rw        BOOL   OUT Channel Switch: OFF OFF <span class="token punctuation">{</span> <span class="token assign-left variable">OFF</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">ON</span><span class="token operator">=</span><span class="token number">1</span> <span class="token punctuation">}</span>
   <span class="token number">5</span> MIXER   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">2</span> rw  R     INT32  OUT Playback Volume: <span class="token number">31</span> <span class="token number">31</span> <span class="token punctuation">{</span> <span class="token number">0</span>-39 <span class="token punctuation">}</span>
   <span class="token number">6</span> MIXER   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">2</span> rw  R     INT32  DAC1 Playback Volume: <span class="token number">175</span> <span class="token number">175</span> <span class="token punctuation">{</span> <span class="token number">0</span>-175 <span class="token punctuation">}</span>
   <span class="token number">7</span> MIXER   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">1</span> rw        ENUM   IN1 Mode Control: <span class="token punctuation">(</span><span class="token number">0</span> Single ended<span class="token punctuation">)</span> <span class="token punctuation">{</span> Single <span class="token assign-left variable">ended</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">Differential</span><span class="token operator">=</span><span class="token number">1</span> <span class="token punctuation">}</span>
   <span class="token number">8</span> MIXER   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">1</span> rw  R     INT32  IN1 Boost: <span class="token number">0</span> <span class="token punctuation">{</span> <span class="token number">0</span>-8 <span class="token punctuation">}</span>
   <span class="token number">9</span> MIXER   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">1</span> rw        ENUM   IN2 Mode Control: <span class="token punctuation">(</span><span class="token number">0</span> Single ended<span class="token punctuation">)</span> <span class="token punctuation">{</span> Single <span class="token assign-left variable">ended</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">Differential</span><span class="token operator">=</span><span class="token number">1</span> <span class="token punctuation">}</span>
  <span class="token number">10</span> MIXER   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">1</span> rw  R     INT32  IN2 Boost: <span class="token number">1</span> <span class="token punctuation">{</span> <span class="token number">0</span>-8 <span class="token punctuation">}</span>
  <span class="token number">11</span> MIXER   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">2</span> rw  R     INT32  IN Capture Volume: <span class="token number">23</span> <span class="token number">23</span> <span class="token punctuation">{</span> <span class="token number">0</span>-31 <span class="token punctuation">}</span>
// 设置
root@rk3188:/ <span class="token comment"># amix -c 0 1 1</span>
Card:0
HP Playback Switch: ON ON <span class="token punctuation">{</span> <span class="token assign-left variable">OFF</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">ON</span><span class="token operator">=</span><span class="token number">1</span> <span class="token punctuation">}</span>
 
// 重新查询之后发现修改的配置已经生效
root@rk3188:/ <span class="token comment"># amix -c 0</span>
Card:0
  <span class="token function">id</span> iface dev sub idx num perms     <span class="token builtin class-name">type</span>   name
   <span class="token number">1</span> MIXER   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">2</span> rw        BOOL   HP Playback Switch: ON ON <span class="token punctuation">{</span> <span class="token assign-left variable">OFF</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">ON</span><span class="token operator">=</span><span class="token number">1</span> <span class="token punctuation">}</span>    // 从 OFF -<span class="token operator">&gt;</span> ON
   <span class="token number">2</span> MIXER   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">0</span>   <span class="token number">2</span> rw  R     INT32  HP Playback Volume: <span class="token number">31</span> <span class="token number">31</span> <span class="token punctuation">{</span> <span class="token number">0</span>-31 <span class="token punctuation">}</span>
 
cmd: alsa_amixer
// 和amix的使用方法类似，只是展现的格式有些差异
root@rk3188:/ <span class="token comment"># alsa_amixer -c 0 contents</span>
<span class="token assign-left variable">numid</span><span class="token operator">=</span><span class="token number">14</span>,iface<span class="token operator">=</span>MIXER,name<span class="token operator">=</span><span class="token string">&#39;ADC Boost Gain&#39;</span>
  <span class="token punctuation">;</span> <span class="token assign-left variable">type</span><span class="token operator">=</span>INTEGER,access<span class="token operator">=</span>rw---R--,values<span class="token operator">=</span><span class="token number">2</span>,min<span class="token operator">=</span><span class="token number">0</span>,max<span class="token operator">=</span><span class="token number">3</span>,step<span class="token operator">=</span><span class="token number">0</span>
  <span class="token builtin class-name">:</span> <span class="token assign-left variable">values</span><span class="token operator">=</span><span class="token number">0,0</span>
  <span class="token operator">|</span> dBscale-min<span class="token operator">=</span><span class="token number">0</span>.00dB,step<span class="token operator">=</span><span class="token number">12</span>.00dB,mute<span class="token operator">=</span><span class="token number">0</span>
<span class="token assign-left variable">numid</span><span class="token operator">=</span><span class="token number">12</span>,iface<span class="token operator">=</span>MIXER,name<span class="token operator">=</span><span class="token string">&#39;ADC Capture Switch&#39;</span>
  <span class="token punctuation">;</span> <span class="token assign-left variable">type</span><span class="token operator">=</span>BOOLEAN,access<span class="token operator">=</span>rw------,values<span class="token operator">=</span><span class="token number">2</span>
  <span class="token builtin class-name">:</span> <span class="token assign-left variable">values</span><span class="token operator">=</span>off,off
<span class="token assign-left variable">numid</span><span class="token operator">=</span><span class="token number">13</span>,iface<span class="token operator">=</span>MIXER,name<span class="token operator">=</span><span class="token string">&#39;ADC Capture Volume&#39;</span>
  <span class="token punctuation">;</span> <span class="token assign-left variable">type</span><span class="token operator">=</span>INTEGER,access<span class="token operator">=</span>rw---R--,values<span class="token operator">=</span><span class="token number">2</span>,min<span class="token operator">=</span><span class="token number">0</span>,max<span class="token operator">=</span><span class="token number">127</span>,step<span class="token operator">=</span><span class="token number">0</span>
  <span class="token builtin class-name">:</span> <span class="token assign-left variable">values</span><span class="token operator">=</span><span class="token number">47,47</span>
  <span class="token operator">|</span> dBscale-min<span class="token operator">=</span>-176.25dB,step<span class="token operator">=</span><span class="token number">3</span>.75dB,mute<span class="token operator">=</span><span class="token number">0</span>
<span class="token assign-left variable">numid</span><span class="token operator">=</span><span class="token number">38</span>,iface<span class="token operator">=</span>MIXER,name<span class="token operator">=</span><span class="token string">&#39;DAC MIXL INF1 Switch&#39;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,23),o=[p];function c(l,i){return s(),a("div",null,o)}const r=n(t,[["render",c],["__file","yinliangshezhiliuchengjidiaoshifangfa.html.vue"]]);export{r as default};
