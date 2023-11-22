import{_ as d,r as l,o as t,c as r,b as n,d as e,e as a,a as s}from"./app-f541e591.js";const c={},v=n("h2",{id:"nodejs-npm的安装与配置",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#nodejs-npm的安装与配置","aria-hidden":"true"},"#"),e(" nodejs+npm的安装与配置")],-1),o={href:"http://nodejs.cn/download/",target:"_blank",rel:"noopener noreferrer"},m=s(`<p>检查环境变量和安装目录，win+R，输入cmd，获取node版本号</p><p><img src="https://img-blog.csdnimg.cn/64857159d6344184a330f7ca6b7421cc.png" alt="在这里插入图片描述"></p><p>如果无法获取版本号，则在path添加环境变量为node的安装目录</p><p>npm是在nodejs下载安装后自带的工具，所以我们首先要了解npm的默认配置；第一步还是检查版本</p><p><img src="https://img-blog.csdnimg.cn/e2b26ca8355248f1a9ca1b0174041af8.png" alt="在这里插入图片描述"></p><h2 id="npm相关配置" tabindex="-1"><a class="header-anchor" href="#npm相关配置" aria-hidden="true">#</a> npm相关配置</h2><p>1.查看npm的配置文件及其配置</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>npm config ls -l 				#查看npm的所有配置信息
npm config get globalconfig		#获取全局配置文件的路径，默认不启用
npm config get userconfig		#获取用户配置文件的路径，默认启用
npm config get registry			#获取远程依赖包的下载地址
npm config get cache			#获取包缓存路径
npm config get prefix			#获取全局包的安装路径
npm config get proxy			#获取代理地址
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2.修改默认配置</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>npm config list		#获取用户配置
npm config set prefix=&quot;D:\\Program Files\\nodejs\\node_global&quot; #设置全局包的下载路径
npm config set cache=&quot;D:\\Program Files\\nodejs\\node_cache&quot;	#设置缓存路径
npm config set registry=http://registry.npm.taobao.org/		#设置远程镜像地址
npm config set proxy=&quot;http://127.0.0.1:[代理端口号]&quot;			#设置代理端口号
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果有些包下载不下来，比如我遇到过sass无法从github上下载下来，我们连接代理服务器并设置代理地址来下载</p><h2 id="包下载、全局模块-尽量不要使用全局安装-避免依赖错误" tabindex="-1"><a class="header-anchor" href="#包下载、全局模块-尽量不要使用全局安装-避免依赖错误" aria-hidden="true">#</a> 包下载、全局模块（尽量不要使用全局安装，避免依赖错误）</h2><p>首先我们要了解公共模块和私有模块，公共模块顾名思义是公共的一个模块，该模块下的包可以被其他所有项目所使用，而私有的模块下的包，只应用在当前项目下。 <img src="https://img-blog.csdnimg.cn/ba1ff1c513e643b7954fb5f0ab71319c.png" alt="在这里插入图片描述"></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>npm install [模块名] [-g] 	#包安装，加上-g代表全局安装，不加则是当前文件夹下安装
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>为了让命令能在终端执行，我们需要在系统环境变量中添加该路径（D:\\Program Files\\nodejs\\node_global）到系统环境Path中 <img src="https://img-blog.csdnimg.cn/b64fbffee1bd4b2d96092cbfa0f82c73.png" alt="在这里插入图片描述"></p>`,15),g={id:"win10下安装node之后-node-v正常-npm-v报错",tabindex:"-1"},p=n("a",{class:"header-anchor",href:"#win10下安装node之后-node-v正常-npm-v报错","aria-hidden":"true"},"#",-1),u={href:"https://so.csdn.net/so/search?q=node&spm=1001.2101.3001.7020",target:"_blank",rel:"noopener noreferrer"},b={href:"https://so.csdn.net/so/search?q=node&spm=1001.2101.3001.7020",target:"_blank",rel:"noopener noreferrer"},h=s(`<p><strong>原因：node目录权限不够</strong></p><p><strong>找到node安装目录，右键属性，点击安全，设置users用户完全控制权限</strong></p><p><img src="https://img-blog.csdnimg.cn/aba2e7343a88411ab80bac63b0cc7575.bmp" alt="img"></p><h2 id="yarn的安装" tabindex="-1"><a class="header-anchor" href="#yarn的安装" aria-hidden="true">#</a> yarn的安装</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>npm install -g yarn 
yarn --version
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>Yarn 设置淘宝源</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>yarn config set registry https://registry.npm.taobao.org -g 
yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass -g
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="npm命令" tabindex="-1"><a class="header-anchor" href="#npm命令" aria-hidden="true">#</a> npm命令</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 查看 npm 全局安装过的包
npm list -g --depth 0
// 全局安装
npm install &lt;package&gt; -g
// 安装项目所有依赖
npm install
// 安装指定版本
npm install &lt;package&gt;@1.2.3
// 安装最新版本
npm i &lt;package&gt;@latest
// 删除全局的包
npm uninstall -g &lt;package&gt;
// 删除 node_modules 目录下面的包
npm uninstall &lt;package&gt;
// 更新指定包
npm update &lt;package&gt;
// 更新指定全局包
npm update -g &lt;package&gt;
// 更新本地安装的包
// 在 package.json 文件所在的目录中执行 npm update 命令
// 执行 npm outdated 命令。不应该有任何输出。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="yarn命令" tabindex="-1"><a class="header-anchor" href="#yarn命令" aria-hidden="true">#</a> yarn命令</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 查看 yarn 全局安装过的包
yarn global list --depth=0
// 全局安装
yarn global add &lt;package&gt;
// 安装所有依赖
yarn
// 安装指定版本
yarn add &lt;package&gt;@&lt;version&gt;
// 安装最新版本
yarn add &lt;package&gt;
// 删除包,会更新package.json和yarn.lock
yarn remove &lt;package&gt;
// 更新包
yarn upgrade
// 更新指定的包
yarn upgrade &lt;package&gt;
// 获取可更新的包列表选择更新
yarn upgrade-interactive --latest
// 更新全局依赖
yarn global upgrade --latest
// 更新全局依赖，有交互
yarn global upgrade-interactive --latest
// 列出已缓存的包
yarn cache list
// 查找缓存包的路径
yarn cache dir
// 清除缓存的包
yarn cache clean
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="yarn的配置项" tabindex="-1"><a class="header-anchor" href="#yarn的配置项" aria-hidden="true">#</a> yarn的配置项</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>yarn config list // 显示所有配置项
yarn config get &lt;key&gt; //显示某配置项
yarn config delete &lt;key&gt; //删除某配置项
yarn config set &lt;key&gt; &lt;value&gt; [-g|--global] //设置配置项
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,13);function f(x,y){const i=l("ExternalLinkIcon");return t(),r("div",null,[v,n("p",null,[e("点击_"),n("a",o,[e("Node.js中文网"),a(i)]),e("_根据自身系统进行下载即可")]),m,n("h2",g,[p,e(" win10下安装"),n("a",u,[e("node"),a(i)]),e("之后，"),n("a",b,[e("node"),a(i)]),e(" -v正常，npm -v报错")]),h])}const k=d(c,[["render",f],["__file","npm_yarnjiaocheng.html.vue"]]);export{k as default};
