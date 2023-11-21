import{_ as e,r as i,o as t,c,b as n,d as s,e as l,a as p}from"./app-ee4ba21e.js";const o={},d=p(`<h1 id="常用-git-命令清单" tabindex="-1"><a class="header-anchor" href="#常用-git-命令清单" aria-hidden="true">#</a> 常用 Git 命令清单</h1><p><a data-fancybox title="image-20220813224219987.png" href="https://s2.loli.net/2022/08/13/eBUG6DbCL8c9M2x.png"><img src="https://cdn.jsdelivr.net/gh/shug666/image/images/eBUG6DbCL8c9M2x.png" alt="image-20220813224219987.png"></a></p><p>下面是我整理的常用 Git 命令清单。几个专用名词的译名如下。</p><p>​ 1.Workspace：工作区</p><p>​ 2.Index / Stage：暂存区</p><p>​ 3.Repository：仓库区（或本地仓库）</p><p>​ 4.Remote：远程仓库</p><h2 id="一、新建代码库" tabindex="-1"><a class="header-anchor" href="#一、新建代码库" aria-hidden="true">#</a> <strong>一、新建代码库</strong></h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 在当前目录新建一个Git代码库</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="补丁文件的生成和应用" tabindex="-1"><a class="header-anchor" href="#补丁文件的生成和应用" aria-hidden="true">#</a> 补丁文件的生成和应用</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> format-patch  你的commit对应的id <span class="token comment">#生成补丁</span>

<span class="token function">git</span> apply <span class="token parameter variable">--stat</span> 0001-limit-log-function.patch  <span class="token comment"># 查看patch的情况</span>

<span class="token function">git</span> apply <span class="token parameter variable">--check</span> 0001-limit-log-function.patch <span class="token comment"># 检查patch是否能够打上，如果没有任何输出，则说明无冲突，可以打上</span>

<span class="token function">git</span> am <span class="token parameter variable">--signoff</span> <span class="token operator">&lt;</span> 0001-add-liuxiansong.patch	<span class="token comment"># 打补丁</span>
-----------------------------------------------
<span class="token function">git</span> <span class="token function">diff</span> <span class="token operator">&gt;</span> text.patch
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="git-blame用法" tabindex="-1"><a class="header-anchor" href="#git-blame用法" aria-hidden="true">#</a> git blame用法</h2><p>git blame用来追溯一个指定文件的历史修改记录。它能显示任何文件中每行最后一次修改的提交记录。 所以，如果你在代码中看到有一个bug，你可以使用 git blame 标注这个文件，查看哪一次提交引入了这行。</p><p>命令用法：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> blame filename
<span class="token function">git</span> blame <span class="token parameter variable">-L</span> <span class="token number">69,82</span> Makefile		<span class="token comment">#查看Makefile这个文件第69--82行最近一次的修改记录</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>可以使用 -L 指定文件的行数范围：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> blame <span class="token parameter variable">-L</span> n1,n2 filename
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>git blame的具体显示格式是：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>commit ID  (代码提交作者  提交时间  代码位于文件中的行数)  实际代码
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>第一列是commit id；接下来是提交人、提交时间、代码位于文件中的行数、实际代码。注意一下 <code>^1da177e4c3f4</code> 这个提交的几行，其中的前缀 ^ 指出了该文件自第一次提交后从未修改的那些行。</p><h2 id="多个commit合并" tabindex="-1"><a class="header-anchor" href="#多个commit合并" aria-hidden="true">#</a> 多个commit合并</h2><p><img src="https://raw.githubusercontent.com/shug666/image/main/images/image-20221210093832699.png" alt="image-20221210093832699"></p><p>找到最早要合并的提交id的父commit-id。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> rebase <span class="token parameter variable">-i</span> commit-id //<span class="token punctuation">(</span>commit-id是需要合并的提交中最早的提交的前一个id<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>接着会出现pick xxx将第二个及后面的pick（提交）关键词改成s（合并），也可删除commit，最后整理几个提交日志为一个日志。</p><p>最后推送到远端 push到远端时远端仓库会提示冲突。因为之前已经推过到远端了，如果没有推过，本地直接推即可，如果要合并几个远程提交，可能会提示合并git pull xxx，千万不要这么做，直接强制提交即可。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> push <span class="token parameter variable">-f</span> 或 <span class="token function">git</span> push origin xxx/xxx <span class="token parameter variable">-f</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="git-pull-–rebase" tabindex="-1"><a class="header-anchor" href="#git-pull-–rebase" aria-hidden="true">#</a> git pull –rebase</h2><p><img src="https://raw.githubusercontent.com/shug666/image/main/images/20221210093155.png" alt=""></p><p>这个命令做了以下内容：</p>`,67),u={href:"https://so.csdn.net/so/search?q=commit&spm=1001.2101.3001.7020",target:"_blank",rel:"noopener noreferrer"},r=n("li",null,"然后从远端拉取代码到本地，由于工作区是干净的，所以不会有冲突",-1),m=n("li",null,"从暂存区把你之前提交的内容取出来，跟拉下来的代码合并",-1),v=n("p",null,[n("strong",null,"所以 rebase 在拉代码前要确保你本地工作区是干净的，如果你本地修改的内容没完全 commit 或者 stash，就会 rebase 失败。")],-1);function b(k,g){const a=i("ExternalLinkIcon");return t(),c("div",null,[d,n("ol",null,[n("li",null,[s("把你 "),n("a",u,[s("commit"),l(a)]),s(" 到本地仓库的内容，取出来放到暂存区(stash)（这时你的工作区是干净的）")]),r,m]),v])}const f=e(o,[["render",b],["__file","Gitminglingqingdan.html.vue"]]);export{f as default};
