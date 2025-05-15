import{_ as i,r as t,o as c,c as l,b as n,d as a,e as p,a as s}from"./app-e8f85126.js";const d={},o=s(`<h1 id="常用-git-命令清单" tabindex="-1"><a class="header-anchor" href="#常用-git-命令清单" aria-hidden="true">#</a> 常用 Git 命令清单</h1><p><a data-fancybox title="image-20220813224219987.png" href="https://s2.loli.net/2022/08/13/eBUG6DbCL8c9M2x.png"><img src="https://cdn.jsdelivr.net/gh/shug666/image/images/eBUG6DbCL8c9M2x.png" alt="image-20220813224219987.png"></a></p><p>下面是我整理的常用 Git 命令清单。几个专用名词的译名如下。</p><p>​ 1.Workspace：工作区</p><p>​ 2.Index / Stage：暂存区</p><p>​ 3.Repository：仓库区（或本地仓库）</p><p>​ 4.Remote：远程仓库</p><h2 id="一、新建代码库" tabindex="-1"><a class="header-anchor" href="#一、新建代码库" aria-hidden="true">#</a> <strong>一、新建代码库</strong></h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 在当前目录新建一个Git代码库</span>
$ <span class="token function">git</span> init

<span class="token comment"># 新建一个目录，将其初始化为Git代码库</span>
$ <span class="token function">git</span> init <span class="token punctuation">[</span>project-name<span class="token punctuation">]</span>

<span class="token comment"># 下载一个项目和它的整个代码历史</span>
$ <span class="token function">git</span> clone <span class="token punctuation">[</span>url<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、配置" tabindex="-1"><a class="header-anchor" href="#二、配置" aria-hidden="true">#</a> 二、配置</h2><p>Git的设置文件为<code>.gitconfig</code>，它可以在用户主目录下（全局配置），也可以在项目目录下（项目配置）。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>
<span class="token comment"># 显示当前的Git配置</span>
$ <span class="token function">git</span> config <span class="token parameter variable">--list</span>

<span class="token comment"># 编辑Git配置文件</span>
$ <span class="token function">git</span> config <span class="token parameter variable">-e</span> <span class="token punctuation">[</span>--global<span class="token punctuation">]</span>

<span class="token comment"># 设置提交代码时的用户信息</span>
$ <span class="token function">git</span> config <span class="token punctuation">[</span>--global<span class="token punctuation">]</span> user.name <span class="token string">&quot;[name]&quot;</span>
$ <span class="token function">git</span> config <span class="token punctuation">[</span>--global<span class="token punctuation">]</span> user.email <span class="token string">&quot;[email address]&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、增加-删除文件" tabindex="-1"><a class="header-anchor" href="#三、增加-删除文件" aria-hidden="true">#</a> 三、增加/删除文件</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>
<span class="token comment"># 添加指定文件到暂存区</span>
$ <span class="token function">git</span> <span class="token function">add</span> <span class="token punctuation">[</span>file1<span class="token punctuation">]</span> <span class="token punctuation">[</span>file2<span class="token punctuation">]</span> <span class="token punctuation">..</span>.

<span class="token comment"># 添加指定目录到暂存区，包括子目录</span>
$ <span class="token function">git</span> <span class="token function">add</span> <span class="token punctuation">[</span>dir<span class="token punctuation">]</span>

<span class="token comment"># 添加当前目录的所有文件到暂存区</span>
$ <span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>

<span class="token comment"># 添加每个变化前，都会要求确认</span>
<span class="token comment"># 对于同一个文件的多处变化，可以实现分次提交</span>
$ <span class="token function">git</span> <span class="token function">add</span> <span class="token parameter variable">-p</span>

<span class="token comment"># 删除工作区文件，并且将这次删除放入暂存区</span>
$ <span class="token function">git</span> <span class="token function">rm</span> <span class="token punctuation">[</span>file1<span class="token punctuation">]</span> <span class="token punctuation">[</span>file2<span class="token punctuation">]</span> <span class="token punctuation">..</span>.

<span class="token comment"># 停止追踪指定文件，但该文件会保留在工作区</span>
$ <span class="token function">git</span> <span class="token function">rm</span> <span class="token parameter variable">--cached</span> <span class="token punctuation">[</span>file<span class="token punctuation">]</span>

<span class="token comment"># 改名文件，并且将这个改名放入暂存区</span>
$ <span class="token function">git</span> <span class="token function">mv</span> <span class="token punctuation">[</span>file-original<span class="token punctuation">]</span> <span class="token punctuation">[</span>file-renamed<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="四、代码提交" tabindex="-1"><a class="header-anchor" href="#四、代码提交" aria-hidden="true">#</a> 四、代码提交</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 提交暂存区到仓库区</span>
$ <span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token punctuation">[</span>message<span class="token punctuation">]</span>

<span class="token comment"># 提交暂存区的指定文件到仓库区</span>
$ <span class="token function">git</span> commit <span class="token punctuation">[</span>file1<span class="token punctuation">]</span> <span class="token punctuation">[</span>file2<span class="token punctuation">]</span> <span class="token punctuation">..</span>. <span class="token parameter variable">-m</span> <span class="token punctuation">[</span>message<span class="token punctuation">]</span>

<span class="token comment"># 提交工作区自上次commit之后的变化，直接到仓库区</span>
$ <span class="token function">git</span> commit <span class="token parameter variable">-a</span>

<span class="token comment"># 提交时显示所有diff信息</span>
$ <span class="token function">git</span> commit <span class="token parameter variable">-v</span>

<span class="token comment"># 使用一次新的commit，替代上一次提交</span>
<span class="token comment"># 如果代码没有任何新变化，则用来改写上一次commit的提交信息</span>
$ <span class="token function">git</span> commit <span class="token parameter variable">--amend</span> <span class="token parameter variable">-m</span> <span class="token punctuation">[</span>message<span class="token punctuation">]</span>

<span class="token comment"># 重做上一次commit，并包括指定文件的新变化</span>
$ <span class="token function">git</span> commit <span class="token parameter variable">--amend</span> <span class="token punctuation">[</span>file1<span class="token punctuation">]</span> <span class="token punctuation">[</span>file2<span class="token punctuation">]</span> <span class="token punctuation">..</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="五、分支" tabindex="-1"><a class="header-anchor" href="#五、分支" aria-hidden="true">#</a> 五、分支</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 列出所有本地分支</span>
$ <span class="token function">git</span> branch

<span class="token comment"># 列出所有远程分支</span>
$ <span class="token function">git</span> branch <span class="token parameter variable">-r</span>

<span class="token comment"># 列出所有本地分支和远程分支</span>
$ <span class="token function">git</span> branch <span class="token parameter variable">-a</span>

<span class="token comment"># 新建一个分支，但依然停留在当前分支</span>
$ <span class="token function">git</span> branch <span class="token punctuation">[</span>branch-name<span class="token punctuation">]</span>

<span class="token comment"># 新建一个分支，并切换到该分支</span>
$ <span class="token function">git</span> checkout <span class="token parameter variable">-b</span> <span class="token punctuation">[</span>branch<span class="token punctuation">]</span>

<span class="token comment"># 新建一个分支，指向指定commit</span>
$ <span class="token function">git</span> branch <span class="token punctuation">[</span>branch<span class="token punctuation">]</span> <span class="token punctuation">[</span>commit<span class="token punctuation">]</span>

<span class="token comment">#下拉远程分支并切换至该分支</span>
$ <span class="token function">git</span> checkout <span class="token parameter variable">--track</span> <span class="token punctuation">[</span>remote-branch<span class="token punctuation">]</span>

<span class="token comment"># 新建一个分支，与指定的远程分支建立追踪关系</span>
$ <span class="token function">git</span> branch <span class="token parameter variable">--track</span> <span class="token punctuation">[</span>branch<span class="token punctuation">]</span> <span class="token punctuation">[</span>remote-branch<span class="token punctuation">]</span>

<span class="token comment"># 切换到指定分支，并更新工作区</span>
$ <span class="token function">git</span> checkout <span class="token punctuation">[</span>branch-name<span class="token punctuation">]</span>

<span class="token comment"># 切换到上一个分支</span>
$ <span class="token function">git</span> checkout -

<span class="token comment"># 建立追踪关系，在现有分支与指定的远程分支之间</span>
$ <span class="token function">git</span> branch --set-upstream <span class="token punctuation">[</span>branch<span class="token punctuation">]</span> <span class="token punctuation">[</span>remote-branch<span class="token punctuation">]</span>

<span class="token comment"># 合并指定分支到当前分支</span>
$ <span class="token function">git</span> merge <span class="token punctuation">[</span>branch<span class="token punctuation">]</span>

<span class="token comment"># 选择一个commit，合并进当前分支</span>
$ <span class="token function">git</span> cherry-pick <span class="token punctuation">[</span>commit<span class="token punctuation">]</span>

<span class="token comment"># 删除分支</span>
$ <span class="token function">git</span> branch <span class="token parameter variable">-d</span> <span class="token punctuation">[</span>branch-name<span class="token punctuation">]</span>

<span class="token comment"># 删除远程分支</span>
$ <span class="token function">git</span> push origin <span class="token parameter variable">--delete</span> <span class="token punctuation">[</span>branch-name<span class="token punctuation">]</span>
$ <span class="token function">git</span> branch <span class="token parameter variable">-dr</span> <span class="token punctuation">[</span>remote/branch<span class="token punctuation">]</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="六、标签" tabindex="-1"><a class="header-anchor" href="#六、标签" aria-hidden="true">#</a> 六、标签</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 列出所有tag</span>
$ <span class="token function">git</span> tag

<span class="token comment"># 新建一个tag在当前commit</span>
$ <span class="token function">git</span> tag <span class="token punctuation">[</span>tag<span class="token punctuation">]</span>

<span class="token comment"># 新建一个tag在指定commit</span>
$ <span class="token function">git</span> tag <span class="token punctuation">[</span>tag<span class="token punctuation">]</span> <span class="token punctuation">[</span>commit<span class="token punctuation">]</span>

<span class="token comment"># 删除本地tag</span>
$ <span class="token function">git</span> tag <span class="token parameter variable">-d</span> <span class="token punctuation">[</span>tag<span class="token punctuation">]</span>

<span class="token comment"># 删除远程tag</span>
$ <span class="token function">git</span> push origin :refs/tags/<span class="token punctuation">[</span>tagName<span class="token punctuation">]</span>

<span class="token comment"># 查看tag信息</span>
$ <span class="token function">git</span> show <span class="token punctuation">[</span>tag<span class="token punctuation">]</span>

<span class="token comment"># 提交指定tag</span>
$ <span class="token function">git</span> push <span class="token punctuation">[</span>remote<span class="token punctuation">]</span> <span class="token punctuation">[</span>tag<span class="token punctuation">]</span>

<span class="token comment"># 提交所有tag</span>
$ <span class="token function">git</span> push <span class="token punctuation">[</span>remote<span class="token punctuation">]</span> <span class="token parameter variable">--tags</span>

<span class="token comment"># 新建一个分支，指向某个tag</span>
$ <span class="token function">git</span> checkout <span class="token parameter variable">-b</span> <span class="token punctuation">[</span>branch<span class="token punctuation">]</span> <span class="token punctuation">[</span>tag<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="七、查看信息" tabindex="-1"><a class="header-anchor" href="#七、查看信息" aria-hidden="true">#</a> 七、查看信息</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 显示有变更的文件</span>
$ <span class="token function">git</span> status

<span class="token comment"># 显示当前分支的版本历史</span>
$ <span class="token function">git</span> log

<span class="token comment"># 显示commit历史，以及每次commit发生变更的文件</span>
$ <span class="token function">git</span> log <span class="token parameter variable">--stat</span>

<span class="token comment"># 搜索提交历史</span>
$ <span class="token function">git</span> log <span class="token parameter variable">--grep</span><span class="token operator">=</span><span class="token operator">&lt;</span>提交信息<span class="token operator">&gt;</span>

<span class="token comment"># 显示某个commit之后的所有变动，每个commit占据一行</span>
$ <span class="token function">git</span> log <span class="token punctuation">[</span>tag<span class="token punctuation">]</span> HEAD <span class="token parameter variable">--pretty</span><span class="token operator">=</span>format:%s

<span class="token comment"># 显示某个commit之后的所有变动，其&quot;提交说明&quot;必须符合搜索条件</span>
$ <span class="token function">git</span> log <span class="token punctuation">[</span>tag<span class="token punctuation">]</span> HEAD <span class="token parameter variable">--grep</span> feature

<span class="token comment"># 显示某个文件的版本历史，包括文件改名</span>
$ <span class="token function">git</span> log <span class="token parameter variable">--follow</span> <span class="token punctuation">[</span>file<span class="token punctuation">]</span>
$ <span class="token function">git</span> whatchanged <span class="token punctuation">[</span>file<span class="token punctuation">]</span>

<span class="token comment"># 显示指定文件相关的每一次diff</span>
$ <span class="token function">git</span> log <span class="token parameter variable">-p</span> <span class="token punctuation">[</span>file<span class="token punctuation">]</span>

<span class="token comment"># 显示过去5次提交</span>
$ <span class="token function">git</span> log <span class="token parameter variable">-5</span> <span class="token parameter variable">--pretty</span> <span class="token parameter variable">--oneline</span>

<span class="token comment"># 显示所有提交过的用户，按提交次数排序</span>
$ <span class="token function">git</span> shortlog <span class="token parameter variable">-sn</span>

<span class="token comment"># 显示指定文件是什么人在什么时间修改过</span>
$ <span class="token function">git</span> blame <span class="token punctuation">[</span>file<span class="token punctuation">]</span>

<span class="token comment"># 显示暂存区和工作区的差异</span>
$ <span class="token function">git</span> <span class="token function">diff</span>

<span class="token comment"># 显示暂存区和上一个commit的差异</span>
$ <span class="token function">git</span> <span class="token function">diff</span> <span class="token parameter variable">--cached</span> <span class="token punctuation">[</span>file<span class="token punctuation">]</span>

<span class="token comment"># 显示工作区与当前分支最新commit之间的差异</span>
$ <span class="token function">git</span> <span class="token function">diff</span> HEAD

<span class="token comment"># 显示两次提交之间的差异</span>
$ <span class="token function">git</span> <span class="token function">diff</span> <span class="token punctuation">[</span>first-branch<span class="token punctuation">]</span><span class="token punctuation">..</span>.<span class="token punctuation">[</span>second-branch<span class="token punctuation">]</span>

<span class="token comment"># 显示今天你写了多少行代码</span>
$ <span class="token function">git</span> <span class="token function">diff</span> <span class="token parameter variable">--shortstat</span> <span class="token string">&quot;@{0 day ago}&quot;</span>

<span class="token comment"># 显示某次提交的元数据和内容变化</span>
$ <span class="token function">git</span> show <span class="token punctuation">[</span>commit<span class="token punctuation">]</span>

<span class="token comment"># 显示某次提交发生变化的文件</span>
$ <span class="token function">git</span> show --name-only <span class="token punctuation">[</span>commit<span class="token punctuation">]</span>

<span class="token comment"># 显示某次提交时，某个文件的内容</span>
$ <span class="token function">git</span> show <span class="token punctuation">[</span>commit<span class="token punctuation">]</span>:<span class="token punctuation">[</span>filename<span class="token punctuation">]</span>

<span class="token comment"># 显示当前分支的最近几次提交</span>
$ <span class="token function">git</span> reflog
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="八、远程同步" tabindex="-1"><a class="header-anchor" href="#八、远程同步" aria-hidden="true">#</a> 八、远程同步</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 下载远程仓库的所有变动</span>
$ <span class="token function">git</span> fetch <span class="token punctuation">[</span>remote<span class="token punctuation">]</span>

<span class="token comment"># 显示所有远程仓库</span>
$ <span class="token function">git</span> remote <span class="token parameter variable">-v</span>

<span class="token comment"># 显示某个远程仓库的信息</span>
$ <span class="token function">git</span> remote show <span class="token punctuation">[</span>remote<span class="token punctuation">]</span>

<span class="token comment"># 增加一个新的远程仓库，并命名</span>
$ <span class="token function">git</span> remote <span class="token function">add</span> <span class="token punctuation">[</span>shortname<span class="token punctuation">]</span> <span class="token punctuation">[</span>url<span class="token punctuation">]</span>

<span class="token comment"># 拉取远程分支并与本地分支合并</span>
$ <span class="token function">git</span> pull <span class="token punctuation">[</span>remote<span class="token punctuation">]</span> <span class="token punctuation">[</span>远程branch:本地branch<span class="token punctuation">]</span>			<span class="token comment">#本地branch可省略，代表当前分支</span>

<span class="token comment"># 上传本地指定分支到远程仓库</span>
$ <span class="token function">git</span> push <span class="token punctuation">[</span>remote<span class="token punctuation">]</span> <span class="token punctuation">[</span>branch<span class="token punctuation">]</span>

<span class="token comment"># 强行推送当前分支到远程仓库，即使有冲突</span>
$ <span class="token function">git</span> push <span class="token punctuation">[</span>remote<span class="token punctuation">]</span> <span class="token parameter variable">--force</span>

<span class="token comment"># 推送所有分支到远程仓库</span>
$ <span class="token function">git</span> push <span class="token punctuation">[</span>remote<span class="token punctuation">]</span> <span class="token parameter variable">--all</span>

<span class="token comment"># 更新远程分支</span>
<span class="token function">git</span> remote update origin <span class="token parameter variable">--p</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="九、撤销" tabindex="-1"><a class="header-anchor" href="#九、撤销" aria-hidden="true">#</a> 九、撤销</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 撤销file文件工作区的修改，恢复到暂存区的状态</span>
$ <span class="token function">git</span> checkout <span class="token punctuation">[</span>file<span class="token punctuation">]</span>		<span class="token comment">#也可用 git restore [file]</span>

<span class="token comment"># 恢复某个commit的指定文件到暂存区和工作区</span>
$ <span class="token function">git</span> checkout <span class="token punctuation">[</span>commit<span class="token punctuation">]</span> <span class="token punctuation">[</span>file<span class="token punctuation">]</span>

<span class="token comment"># 撤销所有工作区的修改，恢复到暂存区的状态</span>
$ <span class="token function">git</span> checkout <span class="token builtin class-name">.</span>

<span class="token comment"># 丢弃暂存区的修改</span>
$ <span class="token function">git</span> reset <span class="token punctuation">[</span>file<span class="token punctuation">]</span>		<span class="token comment">#也可用 git restore --staged [file]</span>

<span class="token comment"># 重置暂存区与工作区，与上一次commit保持一致</span>
$ <span class="token function">git</span> reset <span class="token parameter variable">--hard</span>

<span class="token comment"># 重置当前分支的指针为指定commit，同时重置暂存区，但工作区不变</span>
$ <span class="token function">git</span> reset <span class="token punctuation">[</span>commit<span class="token punctuation">]</span>

<span class="token comment"># 重置当前分支的HEAD为指定commit，同时重置暂存区和工作区，与指定commit一致</span>
$ <span class="token function">git</span> reset <span class="token parameter variable">--hard</span> <span class="token punctuation">[</span>commit<span class="token punctuation">]</span>

<span class="token comment"># 重置当前HEAD为指定commit，但保持暂存区和工作区不变</span>
$ <span class="token function">git</span> reset <span class="token parameter variable">--keep</span> <span class="token punctuation">[</span>commit<span class="token punctuation">]</span>

<span class="token comment"># 新建一个commit，用来撤销指定commit</span>
<span class="token comment"># 后者的所有变化都将被前者抵消，并且应用到当前分支</span>
$ <span class="token function">git</span> revert <span class="token punctuation">[</span>commit<span class="token punctuation">]</span>

<span class="token comment"># 暂时将未提交的变化移除，稍后再移入</span>
$ <span class="token function">git</span> stash
$ <span class="token function">git</span> stash pop
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="git-pull-强制拉取并覆盖本地代码-与git远程仓库保持一致" tabindex="-1"><a class="header-anchor" href="#git-pull-强制拉取并覆盖本地代码-与git远程仓库保持一致" aria-hidden="true">#</a> Git pull 强制拉取并覆盖本地代码（与git远程仓库保持一致）</h2><p>第一个是：拉取所有更新，不同步； 第二个是：本地代码同步线上最新版本(会覆盖本地所有与远程仓库上同名的文件)； 第三个是：再更新一次（其实也可以不用，第二步命令做过了其实）</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> fetch <span class="token parameter variable">--all</span>
<span class="token function">git</span> reset <span class="token parameter variable">--hard</span> origin/master
<span class="token function">git</span> pull
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="查看修改远程地址" tabindex="-1"><a class="header-anchor" href="#查看修改远程地址" aria-hidden="true">#</a> 查看修改远程地址</h2><p>深圳地址 58.250.251.47:20111 武汉地址 162.168.0.245</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">cat</span> .git/config
<span class="token comment">#武汉地址</span>
ssh://git@162.168.0.245/rtk2816a
<span class="token comment">#深圳地址</span>
ssh://mgr023@58.250.251.47:20111/rtk2816a
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><a data-fancybox title="image.png" href="https://s2.loli.net/2022/08/17/wNaK2qUrol4emEf.png"><img src="https://cdn.jsdelivr.net/gh/shug666/image/images/wNaK2qUrol4emEf.png" alt="image.png"></a></p><h2 id="提交修改流程" tabindex="-1"><a class="header-anchor" href="#提交修改流程" aria-hidden="true">#</a> 提交修改流程</h2><p>我们在修改文件之前一定要用git checkout XXX切换到我们要修改的分支。修改之后，我们通过以下步骤提交修改</p><p>1.git pull [origin] [远程分支名] 首先进行下拉代码，并与本地的代码合并。避免漏掉在此期间有他人推送的新文件或者修改的文件（此时如果修改了同一个文件会提示错误信息）。</p><p><a data-fancybox title="image-20220818154554911" href="https://cdn.jsdelivr.net/gh/shug666/image/images/image-20220818154554911.png"><img src="https://cdn.jsdelivr.net/gh/shug666/image/images/image-20220818154554911.png" alt="image-20220818154554911"></a></p><p>2.可使用git status 或者git diff 查看自己在分支上的修改文件。</p><p>3.git add . 添加需要提交的文件。</p><p>4.git commit -m “修改说明” 添加修改注释。</p><p>5.在push提交服务器之前还需重新走第2步使用pull拉取代码（如果在第二步时有错误），这时就会提示有文件合并时冲突了，解决文件冲突后，就可add添加并commit提交重复此步骤直至无冲突。</p><p><a data-fancybox title="image-20220818154659710" href="https://cdn.jsdelivr.net/gh/shug666/image/images/image-20220818154659710.png"><img src="https://cdn.jsdelivr.net/gh/shug666/image/images/image-20220818154659710.png" alt="image-20220818154659710"></a></p><h2 id="设置别名" tabindex="-1"><a class="header-anchor" href="#设置别名" aria-hidden="true">#</a> 设置别名</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> ~ <span class="token comment">#进入根目录</span>
<span class="token function">vim</span> .gitconfig  <span class="token comment">#编辑.gitconfig文件里面设置别名</span>

<span class="token comment">#直接使用命令查看</span>
<span class="token function">git</span> config <span class="token parameter variable">--list</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token builtin class-name">alias</span>
<span class="token comment">#查询log的小技巧</span>
<span class="token function">git</span> config <span class="token parameter variable">--global</span> alias.lg <span class="token string">&quot;log --color --graph --pretty=format:&#39;%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) &amp;C(bold blue)&lt;%an&gt;%Creset&#39; --abbrev-commit&quot;</span>
公司使用的lg
log <span class="token parameter variable">--color</span> <span class="token parameter variable">--graph</span> <span class="token parameter variable">--date</span><span class="token operator">=</span>format:<span class="token string">&#39;%Y-%m-%d %H:%M:%S&#39;</span> <span class="token parameter variable">--pretty</span><span class="token operator">=</span>format:<span class="token string">&#39;%C(bold red) %h%Creset %C(bold yellow)&lt;%an&gt;%Creset %C(bold green)(%cd) %C(yellow)%d%Creset %s &#39;</span>  --abbrev-commit

取消别名：
<span class="token function">git</span> config <span class="token parameter variable">--global</span> <span class="token parameter variable">--unset</span> alias.br
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="配置ssh公钥" tabindex="-1"><a class="header-anchor" href="#配置ssh公钥" aria-hidden="true">#</a> 配置SSH公钥</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>ssh-keygen <span class="token parameter variable">-t</span> rsa
不断回车 如果公钥已经存在，则自动覆盖

<span class="token function">cat</span> ~/.ssh/id_rsa.pub 查看公钥
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="patch文件的生成和应用" tabindex="-1"><a class="header-anchor" href="#patch文件的生成和应用" aria-hidden="true">#</a> patch文件的生成和应用</h2><h3 id="patch-和diff-的区别" tabindex="-1"><a class="header-anchor" href="#patch-和diff-的区别" aria-hidden="true">#</a> patch 和diff 的区别</h3><p>Git 提供了两种补丁方案，一是用git diff生成的UNIX标准补丁.diff文件，二是git format-patch生成的Git专用.patch 文件。</p><ul><li>diff文件只是记录文件改变的内容，不带有commit记录信息,多个commit可以合并成一个diff文件。</li><li>patch文件带有记录文件改变的内容，也带有commit记录信息,每个commit对应一个patch文件。</li></ul><p><strong>在Git下，我们可以使用.diff文件也可以使用.patch 文件来打补丁，主要应用场景有：CodeReview、代码迁移等。</strong></p><h3 id="创建patch-文件的常用命令行" tabindex="-1"><a class="header-anchor" href="#创建patch-文件的常用命令行" aria-hidden="true">#</a> 创建patch 文件的常用命令行</h3><ul><li><p>某个提交的patch：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> format-patch 【commit sha1 id】 <span class="token parameter variable">-1</span>

<span class="token comment">#例子：  </span>

<span class="token function">git</span> format-patch 2a2fb4539925bfa4a141fe492d9828d030f7c8a8 <span class="token parameter variable">-1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>某次提交（含）之前的几次提交：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> format-patch 【commit sha1 id】-n

n指从sha1 id对应的commit开始算起n个提交。  

例子：  

<span class="token function">git</span> format-patch 2a2fb4539925bfa4a141fe492d9828d030f7c8a8 <span class="token parameter variable">-2</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>某两次提交之间的所有patch:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> format-patch 【commit sha1 id】<span class="token punctuation">..</span>【commit sha1 id】

<span class="token comment">#例子：  </span>

<span class="token function">git</span> format-patch 2a2fb4539925bfa4a141fe492d9828d030f7c8a8<span class="token punctuation">..</span>89aebfcc73bdac8054be1a242598610d8ed5f3c8
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h3 id="创建diff文件的常用方法" tabindex="-1"><a class="header-anchor" href="#创建diff文件的常用方法" aria-hidden="true">#</a> 创建diff文件的常用方法</h3><p><strong>使用命令行</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> <span class="token function">diff</span> 【commit sha1 id】 【commit sha1 id】 <span class="token operator">&gt;</span> 【diff文件名】  

<span class="token comment">#例子：  </span>

<span class="token function">git</span> <span class="token function">diff</span> 2a2fb4539925bfa4a141fe492d9828d030f7c8a8 89aebfcc73bdac8054be1a242598610d8ed5f3c8 <span class="token operator">&gt;</span> patch.diff
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="应用patch-和-diff" tabindex="-1"><a class="header-anchor" href="#应用patch-和-diff" aria-hidden="true">#</a> 应用patch 和 diff</h3><h4 id="_1-检查-patch-diff-文件" tabindex="-1"><a class="header-anchor" href="#_1-检查-patch-diff-文件" aria-hidden="true">#</a> 1. 检查 patch/diff 文件：</h4><blockquote><p>git apply --stat xxx.patch</p></blockquote><h4 id="_2-检查patch-diff是否能正常打入" tabindex="-1"><a class="header-anchor" href="#_2-检查patch-diff是否能正常打入" aria-hidden="true">#</a> 2.检查patch/diff是否能正常打入:</h4><blockquote><p><code>git apply --check 【path/to/xxx.patch】</code></p><p><code>git apply --check 【path/to/xxx.diff】</code></p></blockquote><h4 id="_3-打入patch-diff" tabindex="-1"><a class="header-anchor" href="#_3-打入patch-diff" aria-hidden="true">#</a> 3.打入patch/diff:</h4><blockquote><p><code>git apply 【path/to/xxx.patch】</code></p><p><code>git apply 【path/to/xxx.diff】</code></p><p>或者</p><p><code>git am 【path/to/xxx.patch】</code></p></blockquote><h3 id="冲突解决" tabindex="-1"><a class="header-anchor" href="#冲突解决" aria-hidden="true">#</a> 冲突解决</h3><ol><li><p>执行命令 <code>git am xxxx.patch</code> 尝试直接打入补丁。因为我们使用的 patch 已经过时了，所以这一步肯定会报错并中断（注意，虽然命令停止执行了，但我们依然处于git am命令的运行环境中，可以通过git status命令查看到当前的状态）。</p></li><li><p>执行命令 <code>git apply --reject xxxx.patch</code> 自动合入 patch 中不冲突的代码改动，同时保留冲突的部分。这些存在冲突的改动内容会被单独存储到目标源文件的相应目录下，以后缀为 .rej 的文件进行保存。比如对 ./test/someDeviceDriver.c 文件中的某些行合入代码改动失败，则会将这些发生冲突的行数及内容都保存在 ./test/someDeviceDriver.c.rej 文件中。我们可以在执行 git am 命令的目录下执行 find -name *.rej 命令以查看所有存在冲突的源文件位置。</p></li><li><p>依据 步骤2 中生成的 *.rej 文件内容逐个手动解决冲突，然后删除这些 *.rej 文件。完成这一步骤的操作后，我们就可以继续执行 git am 的过程了。</p></li><li><p>执行命令 <code>git status</code> 查看当前改动过的以及新增的文件，确保没有多添加或少添加文件。</p></li><li><p>执行命令 git add . 将所有改动都添加到暂存区（注意，关键字add后有一个小数点 . 作为参数，表示当前路径）。</p></li><li><p>执行命令 <code>git am --resolved</code> 或<code>git am --continue</code>继续 步骤1 中被中断的 patch 合入操作。合入完成后，会有提示信息输出。可以执行git am --skip跳过此次冲突，也可以执行git am --abort回退打入patch的动作，还原到操作前的状态。</p></li><li><p>执行命令 <code>git log</code> 确认合入状态。</p></li></ol><h3 id="包含二进制文件时的diff和apply" tabindex="-1"><a class="header-anchor" href="#包含二进制文件时的diff和apply" aria-hidden="true">#</a> 包含二进制文件时的diff和apply</h3><blockquote><p>git diff HEAD^..HEAD --binary &gt; foobar.patch</p></blockquote><h2 id="git-blame用法" tabindex="-1"><a class="header-anchor" href="#git-blame用法" aria-hidden="true">#</a> git blame用法</h2><p>git blame用来追溯一个指定文件的历史修改记录。它能显示任何文件中每行最后一次修改的提交记录。 所以，如果你在代码中看到有一个bug，你可以使用 git blame 标注这个文件，查看哪一次提交引入了这行。</p><p>命令用法：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> blame filename
<span class="token function">git</span> blame <span class="token parameter variable">-L</span> <span class="token number">69,82</span> Makefile		<span class="token comment">#查看Makefile这个文件第69--82行最近一次的修改记录</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>可以使用 -L 指定文件的行数范围：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> blame <span class="token parameter variable">-L</span> n1,n2 filename
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>git blame的具体显示格式是：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>commit ID  (代码提交作者  提交时间  代码位于文件中的行数)  实际代码
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>第一列是commit id；接下来是提交人、提交时间、代码位于文件中的行数、实际代码。注意一下 <code>^1da177e4c3f4</code> 这个提交的几行，其中的前缀 ^ 指出了该文件自第一次提交后从未修改的那些行。</p><h2 id="多个commit合并" tabindex="-1"><a class="header-anchor" href="#多个commit合并" aria-hidden="true">#</a> 多个commit合并</h2><p><img src="https://raw.githubusercontent.com/shug666/image/main/images/image-20221210093832699.png" alt="image-20221210093832699"></p><p>找到最早要合并的提交id的父commit-id。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> rebase <span class="token parameter variable">-i</span> commit-id //<span class="token punctuation">(</span>commit-id是需要合并的提交中最早的提交的前一个id<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>接着会出现pick xxx将第二个及后面的pick（提交）关键词改成s（合并），也可删除commit，最后整理几个提交日志为一个日志。</p><p>最后推送到远端 push到远端时远端仓库会提示冲突。因为之前已经推过到远端了，如果没有推过，本地直接推即可，如果要合并几个远程提交，可能会提示合并git pull xxx，千万不要这么做，直接强制提交即可。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> push <span class="token parameter variable">-f</span> 或 <span class="token function">git</span> push origin xxx/xxx <span class="token parameter variable">-f</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="git-pull-–rebase" tabindex="-1"><a class="header-anchor" href="#git-pull-–rebase" aria-hidden="true">#</a> git pull –rebase</h2><p><img src="https://raw.githubusercontent.com/shug666/image/main/images/20221210093155.png" alt=""></p><p>这个命令做了以下内容：</p>`,86),r={href:"https://so.csdn.net/so/search?q=commit&spm=1001.2101.3001.7020",target:"_blank",rel:"noopener noreferrer"},u=n("li",null,"然后从远端拉取代码到本地，由于工作区是干净的，所以不会有冲突",-1),m=n("li",null,"从暂存区把你之前提交的内容取出来，跟拉下来的代码合并",-1),v=s(`<p><strong>所以 rebase 在拉代码前要确保你本地工作区是干净的，如果你本地修改的内容没完全 commit 或者 stash，就会 rebase 失败。</strong></p><h2 id="git-stash详解" tabindex="-1"><a class="header-anchor" href="#git-stash详解" aria-hidden="true">#</a> git stash详解</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment">#能够将所有未提交的修改（工作区和暂存区）保存至堆栈中，用于后续恢复当前工作目录。</span>
$ <span class="token function">git</span> stash

<span class="token comment"># 作用等同于git stash，区别是可以加一些注释</span>
$ <span class="token function">git</span> stash save

<span class="token comment">#查看当前stash中的内容</span>
$ <span class="token function">git</span> stash list 

<span class="token comment">#将当前stash中的内容弹出，并应用到当前分支对应的工作目录上。</span>
<span class="token comment">#注：该命令将堆栈中最近保存的内容删除（栈是先进后出）</span>
$ <span class="token function">git</span> stash pop

<span class="token comment">#将堆栈中的内容应用到当前目录，不同于git stash pop，该命令不会将内容从堆栈中删除，也就说该命令能够将堆栈的内容多次应用到工作目录中，适应于多个分支的情况。</span>
<span class="token comment">#堆栈中的内容并没有删除。</span>
<span class="token comment">#可以使用git stash apply + stash名字（如stash@{1}）指定恢复哪个stash到当前的工作目录。</span>
$ <span class="token function">git</span> stash apply

<span class="token comment"># 从堆栈中移除某个指定的stash</span>
$ <span class="token function">git</span> stash drop + 名称

<span class="token comment">#清除堆栈中的所有 内容</span>
$ <span class="token function">git</span> stash <span class="token function">clear</span>

<span class="token comment">#查看堆栈中最新保存的stash和当前目录的差异。</span>
$ <span class="token function">git</span> stash show stash@<span class="token punctuation">{</span><span class="token number">1</span><span class="token punctuation">}</span>查看指定的stash和当前目录差异。
<span class="token comment">#通过 git stash show -p 查看详细的不同：</span>
<span class="token comment">#同样，通过git stash show stash@{1} -p查看指定的stash的差异内容。</span>
$ <span class="token function">git</span> stash show

<span class="token comment">#从最新的stash创建分支。</span>
<span class="token comment">#应用场景：当储藏了部分工作，暂时不去理会，继续在当前分支进行开发，后续想将stash中的内容恢复到当前工作目录时，如果是针对同一个文件的修改（即便不是同行数据），那么可能会发生冲突，恢复失败，这里通过创建新的分支来解决。可以用于解决stash中的内容和当前目录的内容发生冲突的情景。</span>
<span class="token comment">#发生冲突时，需手动解决冲突。</span>
$ <span class="token function">git</span> stash branchs

<span class="token comment"># stash单个文件temp.c命令：</span>
$ <span class="token function">git</span> stash push temp.c

<span class="token comment">#push 和 备注同时使用</span>
$ <span class="token function">git</span> stash push <span class="token parameter variable">-m</span> <span class="token string">&quot;message&quot;</span> /test /tes2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="push某一条commit到远端" tabindex="-1"><a class="header-anchor" href="#push某一条commit到远端" aria-hidden="true">#</a> push某一条commit到远端</h2><h3 id="默认情况下" tabindex="-1"><a class="header-anchor" href="#默认情况下" aria-hidden="true">#</a> 默认情况下</h3><p><code>git push</code>会推送暂存区所有提交（也即<code>HEAD</code>及其之前的提交），使用下面的命令可以改变此默认行为：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> push <span class="token operator">&lt;</span>remotename<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>commit SHA<span class="token operator">&gt;</span>:<span class="token operator">&lt;</span>remotebranchname<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>举例如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> push origin 248ed23e2:branchname
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><hr><h3 id="推送某一条提交" tabindex="-1"><a class="header-anchor" href="#推送某一条提交" aria-hidden="true">#</a> 推送某一条提交：</h3><h3 id="第一种方式" tabindex="-1"><a class="header-anchor" href="#第一种方式" aria-hidden="true">#</a> 第一种方式</h3><p>即符合git操作的规则，从<strong>最初的commit</strong>开始一个一个提交，但是不能实现指定某一个commit,基本满足日常的开发异常情况了**（只能按顺序提交）**</p><p>图一</p><p><img src="https://raw.githubusercontent.com/shug666/image/main/images/d61420705ce243819ac2b119bb22bb1b.png" alt=""></p><p>本地commit了3次提交但是并不想一下push到远程，根据功能或者时间的原因，想一个一个提交</p><p>此时可以使用：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>// 最下面的 一条为最老的一条，优先推送
<span class="token function">git</span> push origin 9267dd9:test  
// 接着第二条同样的命令，commit换掉即可
<span class="token function">git</span> push origin 9267dd9:test

// <span class="token punctuation">..</span>. 依次按顺序一个一个提交<span class="token punctuation">..</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="第二种方式" tabindex="-1"><a class="header-anchor" href="#第二种方式" aria-hidden="true">#</a> 第二种方式</h3><p>采用cherry-pick用新分支去拉取当前分支的指定commit记录，之后推送到当前分支远程仓库实现推送指定历史提交的功能</p><p><strong>1. 创建临时分支</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>// localbranch 为本地分支名  origin/feat 为远程目标分支
 <span class="token function">git</span> checkout <span class="token parameter variable">-b</span>  localbranch  <span class="token parameter variable">--track</span> origin/feat
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>2.  执行cherry-pick，将修改bug的记录同步过来</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> cherry-pick fcf254130f
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>后续操作就是将临时分支记录推到目标分支！！！</p><h2 id="gitignore忽略文件" tabindex="-1"><a class="header-anchor" href="#gitignore忽略文件" aria-hidden="true">#</a> gitignore忽略文件</h2><p>在 <code>.gitignore</code> 文件中，可以指定哪些文件或目录应该被 Git 忽略，这样 Git 就不会追踪这些文件或目录的变化。如果你想让 Git 忽略某个特定的目录，你可以按照以下步骤操作：</p><h3 id="添加gitignore-文件" tabindex="-1"><a class="header-anchor" href="#添加gitignore-文件" aria-hidden="true">#</a> 添加gitignore 文件</h3><p>打开你的项目根目录下的 .gitignore 文件，并在其中添加你想要忽略的目录的路径。例如，如果你想忽略名为 logs 的目录，你可以这样写：</p><p><code>logs/</code>，确保目录路径后面有一个斜杠<code>（/）</code>，这表示这是一个目录，而不是一个文件。</p><ul><li><strong>忽略单个文件</strong>：直接在<code>.gitignore</code>文件中写入文件名即可。</li><li><strong>忽略目录</strong>：在文件名后加上斜杠<code>/</code>表示忽略该目录及其所有内容。</li><li><strong>忽略特定类型的文件</strong>：使用星号<code>*</code>作为通配符。例如，<code>*.log</code>会忽略所有<code>.log</code>文件。</li><li><strong>忽略特定路径下的文件</strong>：在规则前加上路径。例如，<code>/temp/*</code>会忽略根目录下temp目录中的所有文件。</li></ul><h3 id="gitignore文件的规则匹配优先级" tabindex="-1"><a class="header-anchor" href="#gitignore文件的规则匹配优先级" aria-hidden="true">#</a> <code>.gitignore</code>文件的规则匹配优先级</h3><ol><li><strong>精确匹配</strong>：如果<code>.gitignore</code>文件中存在精确匹配的文件名或目录名，则这些文件或目录会被忽略。</li><li><strong>前缀匹配</strong>：如果规则以斜杠<code>/</code>开头，则表示从仓库根目录开始匹配。</li><li><strong>目录匹配</strong>：如果规则以斜杠<code>/</code>结尾，则表示忽略该目录及其所有内容。</li><li><strong>通配符匹配</strong>：使用<code>*</code>、<code>?</code>和<code>[]</code>等通配符进行匹配。</li><li><strong>否定规则</strong>：在规则前加上<code>!</code>表示否定，即不忽略匹配的文件或目录。但需要注意的是，否定规则不会使已经被父目录规则忽略的文件重新被跟踪。</li></ol><h3 id="gitignore文件的配置示例" tabindex="-1"><a class="header-anchor" href="#gitignore文件的配置示例" aria-hidden="true">#</a> <code>.gitignore</code>文件的配置示例</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 忽略构建产物目录</span>
/build/
/dist/

<span class="token comment"># 忽略日志文件</span>
*.log

<span class="token comment"># 忽略操作系统特定的文件</span>
.DS_Store
Thumbs.db

<span class="token comment"># 忽略临时文件</span>
*.tmp
*.swp

<span class="token comment"># 忽略IDE配置文件</span>
/.idea/
/.vscode/
*.iml

<span class="token comment"># 忽略node_modules目录（对于Node.js项目）</span>
/node_modules/

<span class="token comment"># 忽略package-lock.json文件（对于Node.js项目）</span>
package-lock.json

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="如何应用-gitignore文件规则" tabindex="-1"><a class="header-anchor" href="#如何应用-gitignore文件规则" aria-hidden="true">#</a> 如何应用<code>.gitignore</code>文件规则</h3><ul><li><strong>新文件</strong>：对于新创建的文件，如果它们符合<code>.gitignore</code>文件中的规则，则不会被Git跟踪。</li><li><strong>已跟踪文件</strong>：对于已经被Git跟踪的文件，即使它们符合<code>.gitignore</code>文件中的规则，也不会被自动忽略。你需要手动从Git的索引中删除这些文件（使用<code>git rm --cached &lt;文件&gt;</code>），然后提交更改。</li><li><strong>全局<code>.gitignore</code>文件</strong>：除了仓库级别的<code>.gitignore</code>文件外，你还可以配置全局<code>.gitignore</code>文件来忽略所有Git仓库中的某些文件。这通常通过Git配置命令来实现（例如，<code>git config --global core.excludesfile &lt;全局.gitignore文件路径&gt;</code>）。</li></ul><h3 id="检查" tabindex="-1"><a class="header-anchor" href="#检查" aria-hidden="true">#</a> 检查</h3><p>添加完 <code>.gitignore</code> 规则后，你可以通过以下命令来检查某个文件或目录是否被正确忽略：</p><p><code>git check-ignore -v logs/</code></p><h2 id="gc命令详解" tabindex="-1"><a class="header-anchor" href="#gc命令详解" aria-hidden="true">#</a> gc命令详解</h2><p>git gc 是 Git 的一个垃圾回收命令，用于优化和清理本地仓库。Git 仓库在长期使用过程中会产生大量不再使用的对象、无效的引用等，这些都可能影响仓库的性能和大小。通过执行 git gc，Git 会自动执行一系列清理操作，压缩历史对象、删除不再使用的对象，并合并较小的对象，从而减少仓库的体积和提升性能。</p><p>具体来说，git gc 会执行以下操作：</p><ul><li>压缩对象文件：将多个小的对象文件合并为一个较大的文件，减少文件系统的碎片化。</li><li>清理无用的引用：删除已经合并、被丢弃或被删除的分支的引用。</li><li>删除 dangling objects：清除悬挂对象（如没有被引用的提交、树或文件）。</li><li>git gc 可以定期执行，也可以在 Git 仓库出现性能下降时手动执行</li></ul><p><strong>仓库过大</strong>：如果 Git 仓库的体积变得非常庞大，可以使用 <code>git gc</code> 来压缩和清理不必要的对象，减小仓库的大小。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> gc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="命令的常用选项及参数" tabindex="-1"><a class="header-anchor" href="#命令的常用选项及参数" aria-hidden="true">#</a> 命令的常用选项及参数</h3><p>Git 提供了多个选项来定制 <code>git gc</code> 的行为，以下是一些常见的选项：</p><h4 id="aggressive" tabindex="-1"><a class="header-anchor" href="#aggressive" aria-hidden="true">#</a> <code>--aggressive</code></h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> gc <span class="token parameter variable">--aggressive</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>该选项会执行更深入的垃圾回收操作，花费更多时间来进一步压缩和优化对象文件。适用于希望最大程度优化仓库的情况，通常在仓库非常庞大的时候使用。</p><h4 id="prune-date" tabindex="-1"><a class="header-anchor" href="#prune-date" aria-hidden="true">#</a> <code>--prune=&lt;date&gt;</code></h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> gc <span class="token parameter variable">--prune</span><span class="token operator">=</span>now
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>该选项用于删除自指定日期以来没有被引用的对象。now 表示删除所有悬挂的对象，<code>&lt;date&gt;</code> 可以使用相对日期（如 2.weeks.ago）来指定。</p><p>例如，要删除 2 周之前的无用对象，可以使用：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> gc <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token number">2</span>.weeks.ago
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="quiet" tabindex="-1"><a class="header-anchor" href="#quiet" aria-hidden="true">#</a> <code>--quiet</code></h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> gc <span class="token parameter variable">--quiet</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>此选项用于减少输出信息，只显示必要的警告或错误信息。如果希望在后台运行并且不看到过多日志时，使用此选项非常合适</p><h4 id="auto" tabindex="-1"><a class="header-anchor" href="#auto" aria-hidden="true">#</a> <code>--auto</code></h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> gc <span class="token parameter variable">--auto</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>当 Git 检测到需要垃圾回收时，<code>--auto</code> 会自动触发回收，而无需手动执行。此选项通常用于 Git 在后台自动执行垃圾回收时使用。</p><h3 id="命令的进阶用法" tabindex="-1"><a class="header-anchor" href="#命令的进阶用法" aria-hidden="true">#</a> 命令的进阶用法</h3><h4 id="使用-git-gc-与其他-git-优化命令结合" tabindex="-1"><a class="header-anchor" href="#使用-git-gc-与其他-git-优化命令结合" aria-hidden="true">#</a> 使用 git gc 与其他 Git 优化命令结合</h4><p>git gc 可以与 git fsck 等命令结合使用，以确保仓库在执行垃圾回收后的完整性和一致性。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> <span class="token function">fsck</span> <span class="token parameter variable">--full</span>
<span class="token function">git</span> gc <span class="token parameter variable">--aggressive</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>解释：git fsck 检查仓库的完整性和一致性，确保没有坏的对象和引用；之后执行 git gc --aggressive 进一步优化仓库。</p><h4 id="自定义垃圾回收配置" tabindex="-1"><a class="header-anchor" href="#自定义垃圾回收配置" aria-hidden="true">#</a> 自定义垃圾回收配置</h4><p>Git 允许用户通过配置文件定制垃圾回收行为，例如，通过修改 .gitconfig 文件中的以下设置：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>    auto <span class="token operator">=</span> <span class="token number">1</span>
    aggressive <span class="token operator">=</span> <span class="token boolean">true</span>
    pruneExpire <span class="token operator">=</span> <span class="token number">2</span>.weeks.ago
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="命令的常见问题与解答" tabindex="-1"><a class="header-anchor" href="#命令的常见问题与解答" aria-hidden="true">#</a> 命令的常见问题与解答</h3><h4 id="问题-1-git-gc-后仓库变慢了" tabindex="-1"><a class="header-anchor" href="#问题-1-git-gc-后仓库变慢了" aria-hidden="true">#</a> 问题 1：git gc 后仓库变慢了？</h4><p>解答：通常来说，<code>git gc</code> 旨在提升性能。如果回收后仓库变慢了，可能是由于回收过程不完全或仓库中存在大量的小文件。尝试使用 git gc --aggressive 来优化。如果问题依然存在，考虑检查仓库的硬件或文件系统性能。</p><h4 id="问题-2-git-gc-是否会删除重要的历史记录" tabindex="-1"><a class="header-anchor" href="#问题-2-git-gc-是否会删除重要的历史记录" aria-hidden="true">#</a> 问题 2：<code>git gc</code> 是否会删除重要的历史记录？</h4><p>解答：git gc 不会删除重要的历史记录。它只会清理无用的对象和引用，不影响仓库的有效数据。如果你担心丢失数据，可以在执行 git gc 前进行备份。</p><h4 id="问题-3-如何避免自动执行垃圾回收" tabindex="-1"><a class="header-anchor" href="#问题-3-如何避免自动执行垃圾回收" aria-hidden="true">#</a> 问题 3：如何避免自动执行垃圾回收？</h4><p>解答：Git 会根据仓库的大小自动触发垃圾回收。如果希望禁用此功能，可以通过以下命令设置：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> config <span class="token parameter variable">--global</span> gc.auto <span class="token number">0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="总结与建议" tabindex="-1"><a class="header-anchor" href="#总结与建议" aria-hidden="true">#</a> 总结与建议</h3><p><code>git gc</code> 是一个非常实用的 Git 命令，用于清理和优化本地仓库。通过定期使用 git gc，你可以保持仓库的健康和性能。对于大型仓库，使用 --aggressive 选项来进行更深入的优化。如果你的仓库已经过度膨胀，或者频繁出现性能瓶颈，执行 <code>git gc</code> 是一个非常有效的解决方案。</p><h3 id="最佳实践建议" tabindex="-1"><a class="header-anchor" href="#最佳实践建议" aria-hidden="true">#</a> 最佳实践建议：</h3><p>定期执行 git gc，特别是在长期开发后的仓库。 结合 <code>git gc</code> 与 <code>git fsck</code>，确保仓库的完整性和健康。 如果仓库过大，尝试使用 <code>--aggressive</code> 来最大化优化。 使用 <code>--prune</code> 定期清理不再使用的对象，减小仓库体积。 通过这些方法，你可以有效地管理你的 Git 仓库，提升开发效率和仓库性能。</p><p>彻底清除</p><h3 id="彻底清除" tabindex="-1"><a class="header-anchor" href="#彻底清除" aria-hidden="true">#</a> 彻底清除</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 强制删除Git保存的原始引用备份</span>
<span class="token function">rm</span> <span class="token parameter variable">-rf</span> .git/refs/original/

<span class="token comment"># 立即让所有引用日志（reflog）条目过期</span>
<span class="token function">git</span> reflog expire <span class="token parameter variable">--expire</span><span class="token operator">=</span>now <span class="token parameter variable">--all</span>

<span class="token comment"># 检查仓库完整性并列出所有不可达对象</span>
<span class="token function">git</span> <span class="token function">fsck</span> <span class="token parameter variable">--full</span> <span class="token parameter variable">--unreachable</span>

<span class="token comment"># 重新打包对象以优化存储</span>
<span class="token function">git</span> repack <span class="token parameter variable">-A</span> <span class="token parameter variable">-d</span>

<span class="token comment"># 彻底清理仓库并立即删除冗余数据</span>
<span class="token function">git</span> gc <span class="token parameter variable">--aggressive</span> <span class="token parameter variable">--prune</span><span class="token operator">=</span>now
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><code>https://blog.csdn.net/leslie3350/article/details/144792889</code></p></blockquote><h3 id="清理工作树和索引" tabindex="-1"><a class="header-anchor" href="#清理工作树和索引" aria-hidden="true">#</a> 清理工作树和索引</h3><p>加快git的速度，但会失去所有索引，需要手动添加对应文件/路径，否则合并会冲突</p><p><code>git rm -r --cached .</code> # 如果需要重新扫描所有文件状态的话</p>`,89);function b(g,h){const e=t("ExternalLinkIcon");return c(),l("div",null,[o,n("ol",null,[n("li",null,[a("把你 "),n("a",r,[a("commit"),p(e)]),a(" 到本地仓库的内容，取出来放到暂存区(stash)（这时你的工作区是干净的）")]),u,m]),v])}const f=i(d,[["render",b],["__file","Gitminglingqingdan.html.vue"]]);export{f as default};
