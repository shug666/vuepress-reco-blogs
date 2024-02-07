import{_ as e,r as i,o as d,c as t,b as n,d as a,e as o,a as l}from"./app-668506b4.js";const r={},c=l(`<h2 id="在linux上安装android-studio" tabindex="-1"><a class="header-anchor" href="#在linux上安装android-studio" aria-hidden="true">#</a> 在Linux上安装Android Studio</h2><h2 id="步骤概览" tabindex="-1"><a class="header-anchor" href="#步骤概览" aria-hidden="true">#</a> 步骤概览</h2><p>下表提供了安装Android Studio的步骤概览。</p><table><thead><tr><th>步骤</th><th>描述</th></tr></thead><tbody><tr><td>步骤1</td><td>安装Java Development Kit (JDK)</td></tr><tr><td>步骤2</td><td>下载Android Studio</td></tr><tr><td>步骤3</td><td>安装Android Studio</td></tr><tr><td>步骤4</td><td>配置Android Studio</td></tr></tbody></table><p>现在，让我们详细了解每个步骤需要做什么。</p><h2 id="步骤1-安装java-development-kit-jdk" tabindex="-1"><a class="header-anchor" href="#步骤1-安装java-development-kit-jdk" aria-hidden="true">#</a> 步骤1：安装Java Development Kit (JDK)</h2><p>首先，你需要安装Java Development Kit (JDK)，因为Android Studio需要在JDK的支持下运行。你可以按照以下步骤安装JDK：</p><ol><li>打开终端（Terminal）。</li><li>输入以下命令以安装JDK：</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">sudo</span> <span class="token function">apt</span> update  <span class="token comment"># 更新软件包列表</span>
<span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> openjdk-11-jdk  <span class="token comment"># 安装OpenJDK 11</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>确保JDK安装成功，可以通过运行以下命令来检查Java版本：</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">java</span> <span class="token parameter variable">-version</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如果一切正常，你将看到Java版本信息。</p><h2 id="步骤2-下载android-studio" tabindex="-1"><a class="header-anchor" href="#步骤2-下载android-studio" aria-hidden="true">#</a> 步骤2：下载Android Studio</h2><p>在这一步中，你需要从官方网站上下载Android Studio的压缩包。按照以下步骤进行操作：</p><ol><li>打开你的Web浏览器，并访问[Android Studio官方网站](</li><li>在网站上找到“Download Android Studio”按钮，并点击它。</li><li>选择适用于Linux操作系统的版本，并下载压缩包（.tar.gz文件）。</li></ol><h2 id="步骤3-安装android-studio" tabindex="-1"><a class="header-anchor" href="#步骤3-安装android-studio" aria-hidden="true">#</a> 步骤3：安装Android Studio</h2><p>一旦你完成了Android Studio的下载，接下来你需要进行安装。按照以下步骤进行操作：</p><ol><li>打开终端（Terminal）。</li><li>进入你下载的Android Studio压缩包所在的目录。你可以使用<code>cd</code>命令来切换目录，例如：</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> Downloads  <span class="token comment"># 如果你的压缩包在Downloads目录下</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="3"><li>解压缩Android Studio压缩包。你可以使用以下命令：</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">tar</span> <span class="token parameter variable">-xvzf</span> android-studio-*.tar.gz
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="4"><li>进入解压缩后的Android Studio目录。你可以使用以下命令：</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> android-studio
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="5"><li>启动Android Studio安装程序。你可以使用以下命令：</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>./bin/studio.sh
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="步骤4-配置桌面快捷方式" tabindex="-1"><a class="header-anchor" href="#步骤4-配置桌面快捷方式" aria-hidden="true">#</a> 步骤4：配置桌面快捷方式</h2><p>创建文件如：android-studio.txt，并复制以下内容，随后将其后缀改为.desktop</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">[</span>Desktop Entry<span class="token punctuation">]</span>
<span class="token assign-left variable">Version</span><span class="token operator">=</span><span class="token number">1.0</span>
<span class="token assign-left variable">Name</span><span class="token operator">=</span>android studio
<span class="token assign-left variable">Comment</span><span class="token operator">=</span>studio
<span class="token assign-left variable">Exec</span><span class="token operator">=</span>/home/ts/android-studio/bin/studio.sh
<span class="token assign-left variable">Icon</span><span class="token operator">=</span>/home/ts/android-studio/bin/studio.png
<span class="token assign-left variable">Type</span><span class="token operator">=</span>Application
<span class="token assign-left variable">Terminal</span><span class="token operator">=</span>false
<span class="token assign-left variable">Categories</span><span class="token operator">=</span>Utility 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>给予权限sudo chmod a+x 以及sudo chmod 777</p><p>放在桌面，随后右键选择允许启动即可</p>`,30),p={href:"https://blog.51cto.com/u_16175440/7166497",target:"_blank",rel:"noopener noreferrer"};function u(h,v){const s=i("ExternalLinkIcon");return d(),t("div",null,[c,n("p",null,[a("本文转自 "),n("a",p,[a("https://blog.51cto.com/u_16175440/7166497"),o(s)]),a("，如有侵权，请联系删除。")])])}const m=e(r,[["render",u],["__file","ubuntu-anzhuangjdk_android-studioyijipeizhikuaijiefangshi.html.vue"]]);export{m as default};
