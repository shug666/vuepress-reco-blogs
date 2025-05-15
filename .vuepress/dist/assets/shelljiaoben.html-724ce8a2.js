import{_ as n,r as a,o as l,c as r,b as e,d,e as i,a as s}from"./app-e8f85126.js";const h={},c=s(`<h2 id="shell-脚本语言" tabindex="-1"><a class="header-anchor" href="#shell-脚本语言" aria-hidden="true">#</a> shell 脚本语言</h2><p>脚本：本质是一个文件，文件里面存放的是特定格式的指令，系统可以使用脚本解析器翻译或解析指令并执行（它不需要编译）shell 既是应用程序 又是一种脚本语言（应用程序 解析 脚本语言）</p><h3 id="shell命令解析器" tabindex="-1"><a class="header-anchor" href="#shell命令解析器" aria-hidden="true">#</a> shell命令解析器：</h3><p>系统提供 shell命令解析器： sh ash bash 查看自己linux系统的默认解析：echo $SHELL</p><p><a data-fancybox title="img" href="https://img-blog.csdnimg.cn/20200420202511492.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MzI4ODIwMQ==,size_16,color_FFFFFF,t_70"><img src="https://cdn.jsdelivr.net/gh/shug666/image/images/20200420202511492.png" alt="img"></a></p><h3 id="shell脚本文件的命名规范" tabindex="-1"><a class="header-anchor" href="#shell脚本文件的命名规范" aria-hidden="true">#</a> shell脚本文件的命名规范：</h3><ul><li>首个字符必须为字母（a-z，A-Z）。</li><li>中间不能有空格，可以使用下划线（_）。</li><li>不能使用标点符号。</li><li>不能使用bash里的关键字（可用help命令查看保留关键字）。</li><li>必须指定解析器#!/bin/bash</li></ul><h2 id="shell-语法初识" tabindex="-1"><a class="header-anchor" href="#shell-语法初识" aria-hidden="true">#</a> shell 语法初识</h2><p>使用变量：myUrl、{myUrl}</p><p>只读变量：readonly myUrl</p><p>删除变量：unset myUrl</p><h3 id="三种执行方式" tabindex="-1"><a class="header-anchor" href="#三种执行方式" aria-hidden="true">#</a> 三种执行方式:</h3><ul><li><p>./xxx.sh : 先按照 文件中#!指定的解析器解析，如果#！指定指定的解析器不存在，才会使用系统默认的解析器</p></li><li><p>bash xxx.sh: 指明先用bash解析器解析，如果bash不存在，才会使用默认解析器</p></li><li><p>. xxx.sh 直接使用默认解析器解析（不会执行第一行的#！指定的解析器）但是第一行还是要写的</p></li></ul><h3 id="shell-环境变量" tabindex="-1"><a class="header-anchor" href="#shell-环境变量" aria-hidden="true">#</a> shell 环境变量</h3><h4 id="系统变量" tabindex="-1"><a class="header-anchor" href="#系统变量" aria-hidden="true">#</a> 系统变量：</h4><table><thead><tr><th>$0</th><th>当前脚本的文件名</th></tr></thead><tbody><tr><td>$n</td><td>传递给脚本或函数的参数。n 是一个数字，表示第几个参数。例如，第一个参数是$1，第二个参数是$2</td></tr><tr><td>$#</td><td>传递给脚本或函数的参数个数</td></tr><tr><td>$*</td><td>传递给脚本或函数的所有参数</td></tr><tr><td>$@</td><td>传递给脚本或函数的所有参数</td></tr><tr><td>$?</td><td>上个命令的退出状态，或函数的返回值，返回0表示执行成功</td></tr><tr><td>$$</td><td>当前Shell进程ID。对于 Shell 脚本，就是这些脚本所在的进程ID</td></tr></tbody></table><h4 id="环境变量" tabindex="-1"><a class="header-anchor" href="#环境变量" aria-hidden="true">#</a> 环境变量：</h4><p>所有的程序，包括shell启动的程序，都能访问环境变量，有些程序需要环境变量来保证其正常运行。必要的时候shell脚本也可以定义环境变量。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PATH  		命令所示路径，以冒号为分割；
HOME  		打印用户家目录；
SHELL 		显示当前Shell类型；
USER  		打印当前用户名；
ID    		打印当前用户id信息；
PWD   		显示当前所在路径；
TERM  		打印当前终端类型；
HOSTNAME    显示当前主机名；
PS1         定义主机命令提示符的；
HISTSIZE    历史命令大小，可通过 HISTTIMEFORMAT 变量设置命令执行时间;
RANDOM      随机生成一个 0 至 32767 的整数;
HOSTNAME    主机名
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="局部变量" tabindex="-1"><a class="header-anchor" href="#局部变量" aria-hidden="true">#</a> 局部变量</h4><p>局部变量在脚本或命令中定义，仅在当前shell实例中有效，其他shell启动的程序不能访问局部变量。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 常见的变量之三用户变量，用户变量又称为局部变量，主要用在Shell脚本内部或者临时局部使用，系统变量详解如下：

a=rivers 				       自定义变量A；
Httpd_sort=httpd-2.4.6-97.tar  自定义变量N_SOFT；
BACK_DIR=/data/backup/         自定义变量BACK_DIR；
IPaddress=10.0.0.1			   自定义变量IP1；
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="转义字符" tabindex="-1"><a class="header-anchor" href="#转义字符" aria-hidden="true">#</a> 转义字符</h3><p>如果表达式中包含特殊字符，Shell 将会进行替换。例如，在双引号中使用变量就是一种替换，转义字符也是一种替换。</p><p>转义字符替换：echo –e “This is a test.\\n”，其中-e表示对转义字符进行替换。</p><table><thead><tr><th>\\\\</th><th>反斜杠</th></tr></thead><tbody><tr><td>\\a</td><td>警报，响铃</td></tr><tr><td>\\b</td><td>退格（删除键）</td></tr><tr><td>\\f</td><td>换页(FF)，将当前位置移到下页开头</td></tr><tr><td>\\n</td><td>换行</td></tr><tr><td>\\r</td><td>回车</td></tr><tr><td>\\t</td><td>水平制表符（tab键）</td></tr><tr><td>\\v</td><td>垂直制表符</td></tr></tbody></table><h3 id="变量替换" tabindex="-1"><a class="header-anchor" href="#变量替换" aria-hidden="true">#</a> 变量替换</h3><p>​ 变量替换可以根据变量的状态（是否为空、是否定义等）来改变它的值</p><table><thead><tr><th>\${var}</th><th>变量本来的值</th></tr></thead><tbody><tr><td>\${var:-word}</td><td>如果变量 var 为空或已被删除(unset)，那么返回 word，但不改变 var 的值。</td></tr><tr><td>\${var:=word}</td><td>如果变量 var 为空或已被删除(unset)，那么返回 word，并将 var 的值设置为 word。</td></tr><tr><td>\${var:?message}</td><td>如果变量 var 为空或已被删除(unset)，那么将消息 message 送到标准错误输出，可以用来检测变量 var 是否可以被正常赋值。若此替换出现在Shell脚本中，那么脚本将停止运行。</td></tr><tr><td>\${var:+word}</td><td>如果变量 var 被定义，那么返回 word，但不改变 var 的值。</td></tr></tbody></table><h3 id="shell运算符" tabindex="-1"><a class="header-anchor" href="#shell运算符" aria-hidden="true">#</a> Shell运算符</h3><p>Bash 支持很多运算符，包括算数运算符、关系运算符、布尔运算符、字符串运算符和文件测试运算符。</p><p><strong>算术运算符：</strong></p><table><thead><tr><th>+</th><th>加法</th><th><code>expr $a + $b</code></th></tr></thead><tbody><tr><td>-</td><td>减法</td><td><code>expr $a - $b</code></td></tr><tr><td>*</td><td>乘法</td><td><code>expr $a \\* $b</code></td></tr><tr><td>/</td><td>除法</td><td><code>expr $a / $b</code></td></tr><tr><td>%</td><td>取余</td><td><code>expr $a % $b</code></td></tr><tr><td>=</td><td>赋值</td><td>a = $b</td></tr><tr><td>==</td><td>等于</td><td>[ $a == $b ]</td></tr><tr><td>!=</td><td>不等于</td><td>[ $a != $b ]</td></tr></tbody></table><p><strong>关系运算符：</strong></p><table><thead><tr><th>-eq</th><th>是否相等</th><th>[ $a –eq $b ]</th></tr></thead><tbody><tr><td>-ne</td><td>是否不相等</td><td>[ $a –ne $b ]</td></tr><tr><td>-gt</td><td>大于</td><td>[ $a –gt $b ]</td></tr><tr><td>-lt</td><td>小于</td><td>[ $a –lt $b ]</td></tr><tr><td>-ge</td><td>大于等于</td><td>[ $a –ge $b ]</td></tr><tr><td>-le</td><td>小于等于</td><td>[ $a –le $b ]</td></tr></tbody></table><p><strong>布尔运算符：</strong></p><table><thead><tr><th>!</th><th>非运算</th></tr></thead><tbody><tr><td>-o</td><td>或运算</td></tr><tr><td>-a</td><td>与运算</td></tr></tbody></table><p><strong>字符串运算符：</strong></p><table><thead><tr><th>=</th><th>字符串是否相等</th><th>[ $a = $b ]</th></tr></thead><tbody><tr><td>!=</td><td>字符串是否不相等</td><td>[ $a != $b ]</td></tr><tr><td>-z</td><td>字符串长度是否为0</td><td>[ -z $a ]</td></tr><tr><td>-n</td><td>字符串长度是否不为0</td><td>[ -z $a ]</td></tr><tr><td>str</td><td>字符串是否为空</td><td>[ $a ]</td></tr></tbody></table><p><strong>文件测试运算符：</strong></p><table><thead><tr><th>-b</th><th>检测文件是否是块设备文件</th><th>[ -b $file ]</th></tr></thead><tbody><tr><td>-c</td><td>检测文件是否是字符设备文件</td><td>[ -c $file ]</td></tr><tr><td>-d</td><td>检测文件是否是目录</td><td>[ -d $file ]</td></tr><tr><td>-f</td><td>检测文件是否是普通文件（既不是目录，也不是设备文件）</td><td>[ -f $file ]</td></tr><tr><td>-g</td><td>检测文件是否设置了 SGID 位</td><td>[ -g $file ]</td></tr><tr><td>-k</td><td>检测文件是否设置了粘着位</td><td>[ -k $file ]</td></tr><tr><td>-p</td><td>检测文件是否是具名管道</td><td>[ -p $file ]</td></tr><tr><td>-u</td><td>检测文件是否设置了 SUID 位</td><td>[ -u $file ]</td></tr><tr><td>-r</td><td>检测文件是否可读</td><td>[ -r $file ]</td></tr><tr><td>-w</td><td>检测文件是否可写</td><td>[ -w $file ]</td></tr><tr><td>-x</td><td>检测文件是否可执行</td><td>[ -x $file ]</td></tr><tr><td>-s</td><td>检测文件是否为空（文件大小是否大于0）</td><td>[ -s $file ]</td></tr><tr><td>-e</td><td>检测文件（包括目录）是否存在</td><td>[ -e $file ]</td></tr></tbody></table><h3 id="if条件语句" tabindex="-1"><a class="header-anchor" href="#if条件语句" aria-hidden="true">#</a> if条件语句</h3><p>If条件判断语句，通常以if开头，fi结尾。也可加入else或者elif进行多条件的判断</p><pre><code>if (条件表达式);then
	语句1
elif (条件表达式);then
	语句2
else
	语句3
fi
</code></pre><h3 id="case选择语句" tabindex="-1"><a class="header-anchor" href="#case选择语句" aria-hidden="true">#</a> case选择语句</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>#Case选择语句，主要用于对多个选择条件进行匹配输出，与if elif语句结构类似，通常用于脚本传递输入参数，打印出输出结果及内容，其语法格式以Case…in开头，esac结尾。语法格式如下：
case &quot;\${item}&quot; in
    1)
        echo &quot;item = 1&quot;
    ;;
    2|3)
        echo &quot;item = 2 or item = 3&quot;
    ;;
    *)
        echo &quot;default (none of above)&quot;
    ;;
esac
# 每个模式必须以右括号结束，命令结尾以双分号结束。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="for循环语句" tabindex="-1"><a class="header-anchor" href="#for循环语句" aria-hidden="true">#</a> for循环语句</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>#格式
#格式：for name [ [ in [ word ... ] ] ; ] do list ; done
for 变量名 in 取值列表; do
	语句 1
done
--------------------------
for((i=0;i&lt;n;i++)); do
    echo &quot;\${i}&quot;
done
--------------------------
for item in {a..z}; do
    echo &quot;\${item}&quot;
done
--------------------------
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>while循环语句</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># While循环语句与for循环功能类似，主要用于对某个数据域进行循环读取、对文件进行遍历，通常用于需要循环某个文件或者列表，满足循环条件会一直循环，不满足则退出循环，其语法格式以while…do开头，done结尾与 
#while 关联的还有一个 until 语句，它与 while 不同之处在于，是当条件表达式为 false 时才循环，实际使用中比较少。

while  (表达式); do
  语句1
done
--------------------------
until [ condition ]; do
    # body
done

也有break和continue
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="select-循环选择语句" tabindex="-1"><a class="header-anchor" href="#select-循环选择语句" aria-hidden="true">#</a> select 循环选择语句</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>#select 是一个类似于 for 循环的语句
#Select语句一般用于选择，常用于选择菜单的创建，可以配合PS3来做打印菜单的输出信息，其语法格式以select…in do开头，done结尾：

select i in （表达式） 
    do
    语句
done
--------------------------
PS3=&quot;Please enter you select install menu:&quot;
select i in http php mysql quit; do
    case $i in
            http)
            echo -e &quot;
                    \\033[31m Test Httpd \\033[0m&quot; 
            ;;
            php)
            echo  -e &quot;\\033[32m Test PHP\\033[0m&quot;
            ;;
            mysql)
            echo -e &quot;\\033[33m Test MySQL.\\033[0m&quot;
            ;;
            quit)
            echo -e &quot;\\033[32m The System exit.\\033[0m&quot;
            exit
    esac
done
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="shell函数" tabindex="-1"><a class="header-anchor" href="#shell函数" aria-hidden="true">#</a> shell函数</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># Shell允许将一组命令集或语句形成一个可用块，这些块称为Shell函数，Shell函数的用于在于只需定义一次，后期随时使用即可，无需在Shell脚本中添加重复的语句块，其语法格式以function name（）{开头，以}结尾。

# Shell编程函数默认不能将参数传入（）内部，Shell函数参数传递在调用函数名称传递，例如name args1 args2。

# Shell 函数很简单，函数名后跟双括号，再跟双大括号。通过函数名直接调用，不加小括号。
function name () {
    echo &quot;text&quot; 
}
name
#function可省略
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="数组" tabindex="-1"><a class="header-anchor" href="#数组" aria-hidden="true">#</a> 数组</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 数组是相同类型的元素按一定顺序排列的集合。
格式：array=(元素1 元素2 元素3 ...)
用小括号初始化数组，元素之间用空格分隔。
定义方法 1：初始化数组 array=(a b c)
定义方法 2：新建数组并添加元素 array[下标]=元素
定义方法 3：将命令输出作为数组元素array=($(command))
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="可参考学习链接" tabindex="-1"><a class="header-anchor" href="#可参考学习链接" aria-hidden="true">#</a> 可参考学习链接</h2>`,57),v={href:"https://blog.csdn.net/weixin_42313749/article/details/120524768?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522166018519016781667870464%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=166018519016781667870464&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-1-120524768-null-null.142%5Ev40%5Epc_rank_34_ecpm25,185%5Ev2%5Econtrol&utm_term=shell&spm=1018.2226.3001.4187",target:"_blank",rel:"noopener noreferrer"},u={href:"https://blog.csdn.net/weixin_44794688/article/details/123138257",target:"_blank",rel:"noopener noreferrer"};function o(b,m){const t=a("ExternalLinkIcon");return l(),r("div",null,[c,e("p",null,[e("a",v,[d("shell脚本入门"),i(t)])]),e("p",null,[e("a",u,[d("shell 中各种括号的用法"),i(t)])])])}const x=n(h,[["render",o],["__file","shelljiaoben.html.vue"]]);export{x as default};
