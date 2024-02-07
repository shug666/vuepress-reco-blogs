import{_ as n,r as i,o as r,c as l,b as e,d as a,e as d,a as t}from"./app-668506b4.js";const c={},u=t(`<h2 id="_1-解压缩jar包" tabindex="-1"><a class="header-anchor" href="#_1-解压缩jar包" aria-hidden="true">#</a> 1. 解压缩jar包</h2><h3 id="_1-解压-jar" tabindex="-1"><a class="header-anchor" href="#_1-解压-jar" aria-hidden="true">#</a> （1）解压 jar</h3><ul><li>解压到当前目录： <code>jar -xvf hello-0.0.1.jar</code></li><li>想指定目录，直接去目标目录解压：<br><code>jar -xvf ../hello-0.0.1.jar</code></li><li>如果要指定目录，也可以用<code>unzip -d 指定目录</code><br><code>unzip derby.war -d ./gg/ff/</code></li></ul><h3 id="_2-压缩-jar" tabindex="-1"><a class="header-anchor" href="#_2-压缩-jar" aria-hidden="true">#</a> （2）压缩 jar</h3><ul><li><code>jar -cvf test.jar ./gg</code><br><code>jar -cvfM0 test.jar ./gg</code></li></ul><h3 id="_3-部分参数说明" tabindex="-1"><a class="header-anchor" href="#_3-部分参数说明" aria-hidden="true">#</a> （3）部分参数说明</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>说明:
-c 创建war包
-v 显示过程信息
-f 指定 JAR 文件名，通常这个参数是必须的
-M 不产生所有项的清单（MANIFEST〕文件，此参数会忽略 -m 参数
-0 这个是阿拉伯数字，只打包不压缩的意思

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-解压缩war包" tabindex="-1"><a class="header-anchor" href="#_2-解压缩war包" aria-hidden="true">#</a> 2.解压缩war包</h2><h3 id="_1-解压-war" tabindex="-1"><a class="header-anchor" href="#_1-解压-war" aria-hidden="true">#</a> （1）解压 war</h3><ul><li>同 jar 包命令</li></ul><h3 id="_2-压缩-jar-1" tabindex="-1"><a class="header-anchor" href="#_2-压缩-jar-1" aria-hidden="true">#</a> （2）压缩 jar</h3><ul><li>同压缩 jar 包<br><code>jar -cvf test.war ./gg</code><br><code>jar -cvfM0 test.war ./gg</code></li></ul><h2 id="_3-解压缩tar包" tabindex="-1"><a class="header-anchor" href="#_3-解压缩tar包" aria-hidden="true">#</a> 3.解压缩tar包</h2><h3 id="_1-解压-tar" tabindex="-1"><a class="header-anchor" href="#_1-解压-tar" aria-hidden="true">#</a> （1）解压 tar</h3><ul><li>解压当前目录下的tar包到当前目录：</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">tar</span> <span class="token parameter variable">-zxvf</span> redis-6.0.16.tar.gz ./
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>解压指定目录下的tar包到当前目录<br> 命令：<code>tar -zxvf 指定目录下的tar文件</code></li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">tar</span> <span class="token parameter variable">-zxvf</span> <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/softWare/apache-zookeeper-3.6.3-bin.tar.gz
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>解压当前目录下的tar文件到了指定目录：<br> 命令：<code>tar -zxvf 文件名.tgz -C 指定目录</code></li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">tar</span> <span class="token parameter variable">-zxvf</span> redis-6.0.16.tar.gz <span class="token parameter variable">-C</span> <span class="token punctuation">..</span>/install
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>解压<code>.tar</code>文件的话<br> 直接 <code>tar -xvf XXX.tar</code></li></ul><h3 id="_2-压缩-tar" tabindex="-1"><a class="header-anchor" href="#_2-压缩-tar" aria-hidden="true">#</a> （2）压缩 tar</h3><ul><li>命令：<code>tar -zcvf 压缩后文件命名.tar.gz 被压缩的文件名</code></li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">tar</span> <span class="token parameter variable">-zcvf</span> test01.tar.gz ./test
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="_4-解压缩zip文件" tabindex="-1"><a class="header-anchor" href="#_4-解压缩zip文件" aria-hidden="true">#</a> 4.解压缩zip文件</h2><h3 id="_1-压缩zip文件" tabindex="-1"><a class="header-anchor" href="#_1-压缩zip文件" aria-hidden="true">#</a> （1）压缩zip文件</h3><ul><li>把当前目录下的susu文件夹下的内容压缩为test1.zip</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">zip</span> <span class="token parameter variable">-r</span> test1.zip ./susu
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>把当前目录下，susu文件夹和liu文件夹下的内容压缩为test2.zip</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">zip</span> <span class="token parameter variable">-r</span> test2.zip susu liu
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_2-解压zip文件" tabindex="-1"><a class="header-anchor" href="#_2-解压zip文件" aria-hidden="true">#</a> （2）解压zip文件</h3><ul><li>把当前目录下的test1.zip解压到当前目录</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">unzip</span> test1.zip
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="同时解压多文件" tabindex="-1"><a class="header-anchor" href="#同时解压多文件" aria-hidden="true">#</a> 同时解压多文件</h4><ul><li>把当前目录下的test1.zip、test2.zip等test开头的.zip文件同时解压到当前目录</li><li>1）用命令（注意必须加引号&quot; &quot;）：<br> 不加引号会报错：caution: filename not matched: test2.zip</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">unzip</span> <span class="token string">&quot;test*.zip&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>2）用命令（不用加引号）</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">unzip</span> test<span class="token punctuation">\\</span>*.zip
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>3）用命令（不用加引号）</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">ls</span> test*.zip <span class="token operator">|</span> <span class="token function">xargs</span> <span class="token parameter variable">-n1</span> <span class="token function">unzip</span> <span class="token parameter variable">-o</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>把当前目录下的所有.zip文件同时解压到当前目录<br> 1）解压该目录下所有的.zip文件</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">unzip</span> <span class="token punctuation">\\</span>*.zip
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,42),o={href:"https://blog.csdn.net/suixinfeixiangfei/article/details/122857024",target:"_blank",rel:"noopener noreferrer"};function h(p,v){const s=i("ExternalLinkIcon");return r(),l("div",null,[u,e("p",null,[a("本文转自 "),e("a",o,[a("https://blog.csdn.net/suixinfeixiangfei/article/details/122857024"),d(s)]),a("，如有侵权，请联系删除。")])])}const g=n(c,[["render",h],["__file","jieyasuowenjianchangyongmingling.html.vue"]]);export{g as default};
