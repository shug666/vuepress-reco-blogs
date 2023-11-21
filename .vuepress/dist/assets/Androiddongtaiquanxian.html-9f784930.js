import{_ as n,o as s,c as a,a as t}from"./app-ee4ba21e.js";const p={},e=t(`<h2 id="android-动态申请权限" tabindex="-1"><a class="header-anchor" href="#android-动态申请权限" aria-hidden="true">#</a> Android 动态申请权限</h2><p>提示：安卓7.0以上需要动态请求权限</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>    <span class="token comment">// 检查某个权限。返回true表示已启用该权限，返回false表示未启用该权限</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">boolean</span> <span class="token function">checkPermission</span><span class="token punctuation">(</span><span class="token class-name">Activity</span> act<span class="token punctuation">,</span><span class="token class-name">String</span> permission<span class="token punctuation">,</span><span class="token keyword">int</span> requestCode<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token function">checkPermission</span><span class="token punctuation">(</span>act<span class="token punctuation">,</span><span class="token keyword">new</span> <span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">{</span>permission<span class="token punctuation">}</span><span class="token punctuation">,</span>requestCode<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 检查多个权限。返回true表示已完全启用权限，返回false表示未完全启用权限</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">boolean</span> <span class="token function">checkPermission</span><span class="token punctuation">(</span><span class="token class-name">Activity</span> act<span class="token punctuation">,</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> permissions<span class="token punctuation">,</span><span class="token keyword">int</span> requestCode<span class="token punctuation">)</span><span class="token punctuation">{</span>

        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token constant">VERSION</span><span class="token punctuation">.</span><span class="token constant">SDK_INT</span> <span class="token operator">&gt;=</span> <span class="token class-name">VERSION_CODES<span class="token punctuation">.</span>M</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            <span class="token keyword">int</span> check<span class="token punctuation">;</span>
            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">String</span> permission <span class="token operator">:</span> permissions<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                check <span class="token operator">=</span> <span class="token class-name">ContextCompat</span><span class="token punctuation">.</span><span class="token function">checkSelfPermission</span><span class="token punctuation">(</span>act<span class="token punctuation">,</span> permission<span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span>check <span class="token operator">!=</span> <span class="token class-name">PackageManager</span><span class="token punctuation">.</span><span class="token constant">PERMISSION_GRANTED</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
                    <span class="token class-name">ActivityCompat</span><span class="token punctuation">.</span><span class="token function">requestPermissions</span><span class="token punctuation">(</span>act<span class="token punctuation">,</span>permissions<span class="token punctuation">,</span>requestCode<span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 检查权限结果数组，返回true表示都已经获得授权。返回false表示至少有一个未获得授权</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">boolean</span> <span class="token function">checkGrant</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> grantResults<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>grantResults <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> grant <span class="token operator">:</span> grantResults<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 遍历权限结果数组中的每条选择结果</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span>grant <span class="token operator">!=</span> <span class="token class-name">PackageManager</span><span class="token punctuation">.</span><span class="token constant">PERMISSION_GRANTED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 未获得授权</span>
                    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>另一方面还要重写活动的<code>onRequestPermissionsResult</code>方法，在方法内部校验用户的选择结果，若用户同意授权，就执行后续业务；若用户拒绝授权，只能提示用户无法开展后续业务了。重写后的方法代码如下所示：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Override</span>
<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">onRequestPermissionsResult</span><span class="token punctuation">(</span><span class="token keyword">int</span> requestCode<span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> permissions<span class="token punctuation">,</span><span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> grantResults<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">onRequestPermissionsResult</span><span class="token punctuation">(</span>requestCode<span class="token punctuation">,</span> permissions<span class="token punctuation">,</span> grantResults<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// requestCode不能为负数，也不能大于2的16次方即65536</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>requestCode <span class="token operator">==</span> <span class="token class-name">R</span><span class="token punctuation">.</span>id<span class="token punctuation">.</span>btn_file_write <span class="token operator">%</span> <span class="token number">65536</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">PermissionUtil</span><span class="token punctuation">.</span><span class="token function">checkGrant</span><span class="token punctuation">(</span>grantResults<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> 
            <span class="token comment">// 用户选择了同意授权</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token class-name">ToastUtil</span><span class="token punctuation">.</span><span class="token function">show</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> <span class="token string">&quot;用户拒绝了权限！&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>wifi访问权限需要加上位置的权限，否则扫描获取的wifi结果为0</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token comment">&lt;!-- 以下是使用wifi访问网络所需的权限 --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>uses-permission</span> <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>android.permission.CHANGE_NETWORK_STATE<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>uses-permission</span> <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>android.permission.ACCESS_NETWORK_STATE<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>uses-permission</span> <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>android.permission.ACCESS_WIFI_STATE<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>uses-permission</span> <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>android.permission.CHANGE_WIFI_STATE<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>uses-permission</span> <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>android.permission.ACCESS_COARSE_LOCATION<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>uses-permission</span> <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>android.permission.ACCESS_FINE_LOCATION<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7),o=[e];function c(i,l){return s(),a("div",null,o)}const k=n(p,[["render",c],["__file","Androiddongtaiquanxian.html.vue"]]);export{k as default};
