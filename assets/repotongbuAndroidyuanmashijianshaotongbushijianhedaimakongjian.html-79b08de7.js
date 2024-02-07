import{_ as e,o,c as n,a as t}from"./app-668506b4.js";const r={},c=t("<p>在使用 repo sync 同步 Android 源码时，可以添加一些选项来减少同步时间和要下载的代码空间。具体的命令是 <code>repo sync -c --no-tags --prune -j 4</code>。</p><p>查看 repo help status 的帮助信息，对所给的各个选项具体说明如下：</p><ul><li><p><strong>-c, --current-branch</strong> fetch only current branch from server.<br> 这个选项指定只获取执行 repo init 时 -b 选项所指定的分支，不会获取远端服务器的分支信息。</p><p>例如服务器上新增了其他分支，使用 -c 选项同步后，在本地 git 仓库执行 <code>git branch -r</code> 命令看不到服务器新增的分支名。如果不加 -c 选项，那么同步的时候，会打印 <em>[new branch]</em> 这样的信息，使用 <code>git branch -r</code> 命令可查看到服务器新增的分支。</p></li><li><p><strong>–no-tags</strong> don’t fetch tags.<br> 该选项指定不获取服务器上的tag信息。</p></li><li><p><strong>–prune</strong> delete refs that no longer exist on the remote.<br> 如果远端服务器已经删除了某个分支，在 repo sync 时加上 <code>--prune</code> 选项，可以让本地仓库删除对这个分支的跟踪引用。</p><p>查看 repo 的 <code>.repo/repo/project.py</code> 源码，这个选项实际上是作为 git fetch 命令的选项来执行。查看 man git-fetch 对自身 <code>--prune</code> 选项的说明如下，可供参考：</p><blockquote><p>-p, --prune<br> After fetching, remove any remote-tracking references that no longer exist on the remote.</p></blockquote></li><li><p><strong>-j JOBS, --jobs=JOBS</strong> projects to fetch simultaneously (default 2).<br> 指定启用多少个线程来同步。</p><p>例如上面的 <code>-j 4</code> 指定用4个线程来同步。如果没有提供该选项，默认是用2个线程。</p></li></ul><p>总的来说，在 <code>repo sync -c --no-tags --prune -j 4</code> 命令中，使用 -c 和 --no-tags 选项可以减少需要同步的内容，从而减少要占用的本地代码空间，也可以减少一些同步时间。</p><p>使用 -j 选项来指定启用多线程进行同步，可以加快执行速度，也就减少了同步时间。</p><p><strong>使用 --prune 选项去掉已删除分支的跟踪引用，一般不会用到，这个选项可加可不加。</strong></p>",6),p=[c];function s(a,i){return o(),n("div",null,p)}const g=e(r,[["render",s],["__file","repotongbuAndroidyuanmashijianshaotongbushijianhedaimakongjian.html.vue"]]);export{g as default};
