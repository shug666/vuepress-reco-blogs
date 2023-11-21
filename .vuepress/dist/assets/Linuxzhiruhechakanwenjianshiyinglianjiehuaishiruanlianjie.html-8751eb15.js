import{_ as s,r as i,o as l,c,b as a,d as n,e as t,a as r}from"./app-ee4ba21e.js";const d={},o=r(`<h2 id="linux之-如何查看文件是硬链接还是软链接" tabindex="-1"><a class="header-anchor" href="#linux之-如何查看文件是硬链接还是软链接" aria-hidden="true">#</a> Linux之 如何查看文件是<code>硬链接</code>还是<code>软链接</code></h2><p>可以用 <code>ll 文件名</code> 查看文件属性</p><p>以<code>l</code>开头的是软链接 , 相当于快捷方式</p><p>以<code>-</code>开头的是硬链接</p><h2 id="例子" tabindex="-1"><a class="header-anchor" href="#例子" aria-hidden="true">#</a> 例子</h2><ol><li>创建一个文件名为&quot;hello&quot; <code>touch hello</code></li><li>创建一个file的软链接 <code>ln -s hello 软链接</code></li><li>创建一个file的硬链接 <code>ln hello 硬链接</code> 或 <code>link hello 硬链接</code></li><li>用<code>ll</code>或<code>ls -l</code>查看</li></ol><p><img src="https://raw.githubusercontent.com/shug666/image/main/images/1c840cc978d9402f83aabf363c197460.png" alt="在这里插入图片描述"></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> ~
<span class="token function">rm</span> <span class="token parameter variable">-rf</span> 软硬链接测试
<span class="token function">mkdir</span> 软硬链接测试
<span class="token builtin class-name">cd</span> 软硬链接测试
<span class="token function">touch</span> hello
<span class="token function">ln</span> <span class="token parameter variable">-s</span> hello hello的软链接
<span class="token function">ln</span> hello hello的硬链接
ll
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="创建硬链接软链接" tabindex="-1"><a class="header-anchor" href="#创建硬链接软链接" aria-hidden="true">#</a> 创建硬链接软链接</h2><h3 id="创建软连接" tabindex="-1"><a class="header-anchor" href="#创建软连接" aria-hidden="true">#</a> 创建软连接</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 创建软连接</span>
<span class="token function">ln</span> <span class="token parameter variable">-s</span> 源文件 软链接名
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="创建硬连接" tabindex="-1"><a class="header-anchor" href="#创建硬连接" aria-hidden="true">#</a> 创建硬连接</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 创建硬连接</span>
<span class="token function">ln</span> 源文件 硬链接名
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 创建硬连接</span>
<span class="token function">link</span> 源文件 硬链接名
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong><code>link</code>只能创建硬链接 , <code>ln</code>软硬都可以</strong></p><h2 id="ln的说明" tabindex="-1"><a class="header-anchor" href="#ln的说明" aria-hidden="true">#</a> <code>ln</code>的说明</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>用法：ln <span class="token punctuation">[</span>选项<span class="token punctuation">]</span><span class="token punctuation">..</span>. <span class="token punctuation">[</span>-T<span class="token punctuation">]</span> 目标 链接名
　或：ln <span class="token punctuation">[</span>选项<span class="token punctuation">]</span><span class="token punctuation">..</span>. 目标
　或：ln <span class="token punctuation">[</span>选项<span class="token punctuation">]</span><span class="token punctuation">..</span>. 目标<span class="token punctuation">..</span>. 目录
　或：ln <span class="token punctuation">[</span>选项<span class="token punctuation">]</span><span class="token punctuation">..</span>. <span class="token parameter variable">-t</span> 目录 目标<span class="token punctuation">..</span>.
在第一种格式中，创建具有指定链接名且指向指定目标的链接。
在第二种格式中，在当前目录创建指向目标位置的链接。
在第三、四种格式中，在指定目录中创建指向指定目标的链接。
默认创建硬链接，当使用--symbolic 时创建符号链接。
默认情况下，创建每个目标时不应存在与新链接的名称相同的文件。
创建硬链接时，每个指定的目标都必须存在。符号链接可以指向任意的位置；
当链接解析正常时，将其解析为一个相对于其父目录的相对链接。

必选参数对长短选项同时适用。
      --backup<span class="token punctuation">[</span><span class="token operator">=</span>CONTROL<span class="token punctuation">]</span>      为每个已存在的目标文件创建备份文件
  <span class="token parameter variable">-b</span>                          类似--backup，但不接受任何参数
  -d, -F, <span class="token parameter variable">--directory</span>         允许超级用户尝试创建指向目录的硬链接
                              （注意：此操作可能因系统限制而失败）
  -f, <span class="token parameter variable">--force</span>                 强行删除任何已存在的目标文件
  -i, <span class="token parameter variable">--interactive</span>           prompt whether to remove destinations
  -L, <span class="token parameter variable">--logical</span>               dereference TARGETs that are symbolic links
  -n, --no-dereference        treat LINK_NAME as a normal <span class="token function">file</span> <span class="token keyword">if</span>
                                it is a symbolic <span class="token function">link</span> to a directory
  -P, <span class="token parameter variable">--physical</span>              <span class="token function">make</span> hard links directly to symbolic links
  -r, <span class="token parameter variable">--relative</span>              with -s, create links relative to <span class="token function">link</span> location
  -s, <span class="token parameter variable">--symbolic</span>              <span class="token function">make</span> symbolic links instead of hard links
  -S, <span class="token parameter variable">--suffix</span><span class="token operator">=</span>后缀           自行指定备份文件的后缀
  -t, --target-directory<span class="token operator">=</span>目录  在指定的目录中创建链接
  -T, --no-target-directory   总是将给定的链接名当作普通文件
  -v, <span class="token parameter variable">--verbose</span>               列出每个链接的文件名称
      <span class="token parameter variable">--help</span>		显示此帮助信息并退出
      <span class="token parameter variable">--version</span>		显示版本信息并退出

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="查看硬链接数量" tabindex="-1"><a class="header-anchor" href="#查看硬链接数量" aria-hidden="true">#</a> 查看硬链接数量</h2><p><img src="https://raw.githubusercontent.com/shug666/image/main/images/b9bed82d5d534d55b7e0ac36a3f65a25.jpeg" alt="在这里插入图片描述"></p><p><img src="https://raw.githubusercontent.com/shug666/image/main/images/7fcd504c57ff44da93242edd45a320c1.png" alt="添加硬链接,查看硬链接数"></p><p>硬链接除了名称,其它信息都相同, 没法区分</p><p>硬链接除了名称和位置,其它信息都相同, 包括日期, 没法区分</p><p><img src="https://raw.githubusercontent.com/shug666/image/main/images/7abec417a7194fc6a6b7fb60b3e4af4a.png" alt="在这里插入图片描述"></p><h2 id="软连接可以凭空创建-硬链接不可以" tabindex="-1"><a class="header-anchor" href="#软连接可以凭空创建-硬链接不可以" aria-hidden="true">#</a> 软连接可以凭空创建, 硬链接不可以</h2><p><img src="https://raw.githubusercontent.com/shug666/image/main/images/cd9380e498544b86acd5dc4eeb3551b3.png" alt="在这里插入图片描述"></p>`,25),p={href:"https://blog.csdn.net/kfepiza/article/details/126654350",target:"_blank",rel:"noopener noreferrer"};function u(v,m){const e=i("ExternalLinkIcon");return l(),c("div",null,[o,a("p",null,[n("本文转自 "),a("a",p,[n("https://blog.csdn.net/kfepiza/article/details/126654350"),t(e)]),n("，如有侵权，请联系删除。")])])}const b=s(d,[["render",u],["__file","Linuxzhiruhechakanwenjianshiyinglianjiehuaishiruanlianjie.html.vue"]]);export{b as default};
