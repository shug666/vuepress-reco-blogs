import{_ as a,o as n,c as s,a as t}from"./app-668506b4.js";const p={},e=t(`<p>FileProvider是Android中推荐的获取文件Uri方式，将取代Uri.fromFile()方法</p><h2 id="老方式的问题" tabindex="-1"><a class="header-anchor" href="#老方式的问题" aria-hidden="true">#</a> 老方式的问题</h2><p>在安卓7.0版本中，直接根据内部存储中的文件获取Uri会程序崩溃，相关代码如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Uri uri = Uri.fromFile(file);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>运行的话，会报错：</p><p><img src="https://raw.githubusercontent.com/shug666/image/main/images/20180425172136380" alt=""></p><p>解决方法，就是引入FileProvider</p><h2 id="fileprovider的使用" tabindex="-1"><a class="header-anchor" href="#fileprovider的使用" aria-hidden="true">#</a> FileProvider的使用</h2><p>现在，我一步一步来给大家演示FileProvider的用法</p><p>声明</p><p>我们首先要在清单文件中application节点下，声明一个FileProvider子节点</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>provider</span>
  <span class="token attr-name"><span class="token namespace">android:</span>authorities</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>com.example.songzeceng.myFileProvider<span class="token punctuation">&quot;</span></span>
  <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>android.support.v4.content.FileProvider<span class="token punctuation">&quot;</span></span>
  <span class="token attr-name"><span class="token namespace">android:</span>exported</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>false<span class="token punctuation">&quot;</span></span>
  <span class="token attr-name"><span class="token namespace">android:</span>grantUriPermissions</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta-data</span> <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>android.support.FILE_PROVIDER_PATHS<span class="token punctuation">&quot;</span></span>
             <span class="token attr-name"><span class="token namespace">android:</span>resource</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>@xml/updatepath<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>meta-data</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>provider</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>里面的属性和节点解释如下：</p><blockquote><p>provider:表示这是一个provider</p><p>android:authorities:provider的名字，跟ContentProvider的这个属性一样，是这个provider的标识</p><p>android:name:固定的，要用FileProvider就必须声明成代码中的样子</p><p>android:exported:可否导出，必须为false</p><p>android:grantUriPermissions:是否被赋予uri权限，必须为true</p><p><code>&lt;meta-data&gt;</code>：这个provider的外部应用可见的属性，必须声明一个path，表示分享的目录</p><p>android:name:分享目录的名字，固定写死的</p><p>android:resource:路径对应的xml文件，这个应该在res目录下新建一个对应的xml文件</p></blockquote><p>创建分享xml文件</p><p>现在我们要创建一个跟上文说的android:resource标签对应的xml文件--&gt;xml/updatepath.xml</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token prolog">&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>resources</span> <span class="token attr-name"><span class="token namespace">xmlns:</span>android</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>http://schemas.android.com/apk/res/android<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>paths</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>files-path</span> <span class="token attr-name">path</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>.<span class="token punctuation">&quot;</span></span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>files<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>cache-path</span> <span class="token attr-name">path</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>.<span class="token punctuation">&quot;</span></span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>cache<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>external-path</span> <span class="token attr-name">path</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>.<span class="token punctuation">&quot;</span></span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>external<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>external-files-path</span> <span class="token attr-name">path</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>.<span class="token punctuation">&quot;</span></span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>externalfiles<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
        <span class="token comment">&lt;!-- 此标签需要 support 25.0.0以上才可以使用--&gt;</span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>external-cache-path</span>  <span class="token attr-name">path</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>.<span class="token punctuation">&quot;</span></span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>externalcache<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>paths</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>resources</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中标签 file-path、cache-path这些表示手机内存中的某个目录，path属性是这个目录下的子目录，name属性是假名，这个假名将替代path目录的绝对路径</p><p>图中涉及的子标签对应的路径如下：</p><table><thead><tr><th style="text-align:left;">子标签</th><th style="text-align:left;">子标签对应的绝对路径(加path)</th><th>子标签对应的绝对路径(加path)</th><th>假名</th></tr></thead><tbody><tr><td style="text-align:left;">files-path</td><td style="text-align:left;">app私有存储区域下的files目录(context.getFilesDir())</td><td>files目录加上path(context.getFilesDir()/files)</td><td>files</td></tr><tr><td style="text-align:left;">cache-path</td><td style="text-align:left;">app私有目录下的缓存目录(context.getCacheDir())</td><td>私有缓存目录加上path(context.getCacheDir()/files)</td><td>cache</td></tr><tr><td style="text-align:left;">external-path</td><td style="text-align:left;">外存根目录(Environment.getExternalStorageDirectory())</td><td>外存根目录加上path(Environment.getExternalStorageDirector()/files)</td><td>external</td></tr><tr><td style="text-align:left;">external-files-path</td><td style="text-align:left;">外存根目录下的文件目录(context.getExternalFilesDir())</td><td>文件目录加上path(context.getExternalFilesDir()/files)</td><td>externalfiles</td></tr><tr><td style="text-align:left;">external-cache-path</td><td style="text-align:left;">外存根目录下的缓存目录(context.getExternalCacheDir())</td><td>缓存目录加上path(context.getExternalCacheDir()/files)</td><td>externalcaches</td></tr></tbody></table><p>最后的结果，就是外部app获取到的分享目录，不是路径，而是假名</p><p>而且，每添加一个分享目录，就要添加一个对应的子标签</p><p>比如我添加一个新的分享目录，是外存根目录下的一个文件夹，就添加一个子标签如下：</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>external-path</span> <span class="token attr-name">name</span> <span class="token attr-value"><span class="token punctuation attr-equals">=</span> <span class="token punctuation">&quot;</span>fp_pictures<span class="token punctuation">&quot;</span></span> <span class="token attr-name">path</span> <span class="token attr-value"><span class="token punctuation attr-equals">=</span> <span class="token punctuation">&quot;</span>/Pictures/dongqiudi/<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>external-path</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>就可以了</p><p>利用FileProvider获取文件Uri</p><p>代码如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">String</span> path <span class="token operator">=</span> <span class="token class-name">Environment</span><span class="token punctuation">.</span><span class="token function">getExternalStorageDirectory</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;/Pictures/dongqiudi/1523624189281.jpg&quot;</span><span class="token punctuation">;</span>
<span class="token class-name">File</span> file <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">File</span><span class="token punctuation">(</span>path<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>file<span class="token punctuation">.</span><span class="token function">exists</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
   <span class="token class-name">Uri</span> uri <span class="token operator">=</span> <span class="token class-name">FileProvider</span><span class="token punctuation">.</span><span class="token function">getUriForFile</span><span class="token punctuation">(</span><span class="token class-name">MainActivity</span><span class="token punctuation">.</span><span class="token keyword">this</span><span class="token punctuation">,</span> <span class="token string">&quot;com.example.songzeceng.myFileProvider&quot;</span><span class="token punctuation">,</span> file<span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token class-name">Log</span><span class="token punctuation">.</span><span class="token function">i</span><span class="token punctuation">(</span><span class="token constant">TAG</span><span class="token punctuation">,</span> <span class="token string">&quot;uri:&quot;</span> <span class="token operator">+</span> uri<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>代码很简单，只不过为了以防出错，我判断了一下文件是否存在(不存在会怎样，我没试过)</p><p>结果</p><p><img src="https://raw.githubusercontent.com/shug666/image/main/images/20180425181757810" alt=""></p><p>可以看到，它确实把我们指定的分享目录路径，换成了假名fp_pictures。这个uri和以前的路径uri不一样，但不影响使用，他还是会正确地找到我们的文件的。</p><h2 id="通过uri获取文件路径" tabindex="-1"><a class="header-anchor" href="#通过uri获取文件路径" aria-hidden="true">#</a> 通过uri获取文件路径</h2><p>由于FileProvider类只有一个getUriForFile()方法对外开放，那么如果要通过FileProvider的uri获取文件路径，就需要通过反射了。</p><p>先说思路：</p><p>FileProvider内部有一个SimplePathStrategy类，这个类实现了PathStrategy接口，负责文件uri和文件路径的转换。FileProvider通过调用自己的私有静态方法getPathStrategy()来初始化PathStrategy对象，因此我们可以直接调用这个方法获取已经初始化好的PathStrategy对象。然后调用这个对象的getFileForUri()方法，获取uri对应的文件对象，最后通过文件对象获取路径。</p><p>代码如下所示</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>                <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">FileProvider</span><span class="token punctuation">&gt;</span></span> clazz <span class="token operator">=</span> <span class="token class-name">FileProvider</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">;</span>
                <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span></span> simplePathStrategyClazz <span class="token operator">=</span> clazz<span class="token punctuation">.</span><span class="token function">getDeclaredClasses</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

                <span class="token class-name">Method</span> getPathStrategyMethod <span class="token operator">=</span> clazz<span class="token punctuation">.</span><span class="token function">getDeclaredMethod</span><span class="token punctuation">(</span><span class="token string">&quot;getPathStrategy&quot;</span><span class="token punctuation">,</span> <span class="token class-name">Context</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                getPathStrategyMethod<span class="token punctuation">.</span><span class="token function">setAccessible</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

                <span class="token class-name">Object</span> simplePathStrategyObject <span class="token operator">=</span> getPathStrategyMethod<span class="token punctuation">.</span><span class="token function">invoke</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token class-name">MainActivity</span><span class="token punctuation">.</span><span class="token keyword">this</span><span class="token punctuation">,</span> <span class="token string">&quot;com.example.songzeceng.myFileProvider&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

                <span class="token class-name">Method</span> method <span class="token operator">=</span> simplePathStrategyClazz<span class="token punctuation">.</span><span class="token function">getDeclaredMethod</span><span class="token punctuation">(</span><span class="token string">&quot;getFileForUri&quot;</span><span class="token punctuation">,</span> <span class="token class-name">Uri</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                method<span class="token punctuation">.</span><span class="token function">setAccessible</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token class-name">File</span> destFile <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">File</span><span class="token punctuation">)</span> method<span class="token punctuation">.</span><span class="token function">invoke</span><span class="token punctuation">(</span>simplePathStrategyObject<span class="token punctuation">,</span> uri<span class="token punctuation">)</span><span class="token punctuation">;</span>

                <span class="token class-name">Log</span><span class="token punctuation">.</span><span class="token function">i</span><span class="token punctuation">(</span><span class="token constant">TAG</span><span class="token punctuation">,</span> <span class="token string">&quot;share: file path:&quot;</span> <span class="token operator">+</span> destFile<span class="token punctuation">.</span><span class="token function">getAbsolutePath</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>首先，获取FileProvider的类和SimplePathStrategy的类，我们所需的类就这两个；</p><p>其次，获取FileProvider的getPathStrategy()方法对象，方法入参为Context对象和String对象，这个String对象就是我们的authority标识。当然要把这个方法对象的可达性设置为true；</p><p>再次，调用getPathStrategy()方法，传入上下文对象和标识字符串，得到SimplePathStrategy对象。这里只能用Object类来接，因为外部访问不到SimplePathStrategy类或PathStrategy类；</p><p>然后，获取SimplePathStrategy类的getFileForUri()方法对象，入参为Uri对象，设置方法可达性为true；</p><p>最后，调用SimplePathStrategy对象的getFileForUri()方法，入参为Uri对象，强制类型转换成File后，即可获取绝对路径。</p><p>程序运行的输出日志如下图所示</p><p><img src="https://raw.githubusercontent.com/shug666/image/main/images/20191120204411459.png" alt=""></p><p>功能可以实现，但是反射的消耗很大，用的时候还是要三思。</p>`,46),o=[e];function c(l,i){return n(),s("div",null,o)}const r=a(p,[["render",c],["__file","FileProviderdeshiyong.html.vue"]]);export{r as default};
