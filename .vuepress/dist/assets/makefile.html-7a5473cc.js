import{_ as e,o as i,c as a,a as n}from"./app-e8f85126.js";const l={},d=n(`<h2 id="一、什么是makefile" tabindex="-1"><a class="header-anchor" href="#一、什么是makefile" aria-hidden="true">#</a> 一、什么是makefile?</h2><p>unix下的软件编译需要自己写makefile</p><p>一个工程中的源文件不计数，其按类型、 功能、模块分别放在若干个目录中，makefile 定义了一系列的规则来指定，哪些文件需要先编译，哪些文件需要后编译，哪些件需要重新编译，甚至于进行更复杂的功能操作</p><p><strong>makefile的好处——”自动化编译“，只需一个make命令，整个工程完全自动编译。因此make是一个命令工具，解释makefile文件中指令。在makefile文件中描述了整个工程所有文件的编译顺序、编译规则。像shell脚本一样，可执行操作系统的命令，所以makefile成为了一种在工程方面的编译方法。</strong></p><h2 id="二、关于程序的编译和链接" tabindex="-1"><a class="header-anchor" href="#二、关于程序的编译和链接" aria-hidden="true">#</a> 二、关于程序的编译和链接</h2><p>一般来说，c/c++ ，首先要把源文件编译成中间代码文件，也就是.obj和.o文件（windows和UNIX）,这个动作叫做编译。然后将Object File合成执行文件，这个动作叫作链接（link）。</p><p>编译时，编译器需要的是语法正确，函数与变量声明的正确</p><p>链接时，主要是<strong>链接函数和全局变量</strong>。大多数情况下由于源文件太多，编译生成的中间目标文件太多，所以要给中间目标文件打包，在 Windows 下这种包叫“库文件”（Library File)，也就是 .lib 文件，在 UNIX 下，是 Archive File，也就是 .a 文件。</p><p><strong>总结一下，源文件首先会生成中间目标文件，再由中间目标文件生成执行文件。在编译 时，编译器只检测程序语法，和函数、变量是否被声明。如果函数未被声明，编译器会给出一个警告，但可以生成 Object File。而在链接程序时，链接器会在所有的 ObjectFile 中找寻函数的实现，如果找不到，那到就会报链接错误码（Linker Error），在 VC 下，这种错误一般是：Link 2001 错误，意思说是说，链接器未能找到函数的实现。你需要指定函数的 Object File</strong></p><h2 id="三、makefile-介绍" tabindex="-1"><a class="header-anchor" href="#三、makefile-介绍" aria-hidden="true">#</a> 三、Makefile 介绍</h2><p>1）如果这个工程没有编译过，那么我们的所有 C 文件都要编译并被链接。</p><p>2）如果这个工程的某几个 C 文件被修改，那么我们只编译被修改的 C 文件，并链接目标程序。</p><p>3）如果这个工程的头文件被改变了，那么我们需要编译引用了这几个头文件的 C 文件，并链接目标程序。</p><h3 id="_1-makefile基本语法" tabindex="-1"><a class="header-anchor" href="#_1-makefile基本语法" aria-hidden="true">#</a> 1.makefile基本语法</h3><p>目标：依赖</p><p><strong>tab（一定要tab作为开头） 命令</strong></p><p>目标：一般指要编译的目标，可以是object file、执行文件和动作（标签）。</p><p>依赖：指执行当前目标所要依赖的先项，包括其他目标，某个具体文件或库等，一个目标可以有多个依赖。<strong>依赖关系的实质上就是说明了目标文件是由哪些文件生成的，换言之，目标文件是哪些文件更新的。</strong></p><p>命令：该目标下要执行的具体命令，可以没有，也可以有多条，多条时每条命令一行（任意的 Shell 命令）</p><p>例子：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>calc:add.o sub.o multi.o
	gcc add.o sub.o multi.o calc.cpp -lstdc++ -o calc #直接从源代码到目标可执行文件了

add.o:add.cpp
	gcc -c add.cpp -o add.o

sub.o:sub.cpp
	gcc -c sub.cpp -o sub.o

multi.o:multi.cpp
	gcc -c multi.cpp -o multi.o
	
	
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><a data-fancybox title="image.png" href="https://s2.loli.net/2022/08/17/2UfiYlSxN8F1pVI.png"><img src="https://cdn.jsdelivr.net/gh/shug666/image/images/2UfiYlSxN8F1pVI.png" alt="image.png"></a></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>OBJ=add.o sub.o multi.o calc.o #自定义变量
TARGET=calc

$(TARGET):$(OBJ)
	gcc $(OBJ) -lstdc++ -o $(TARGET)

add.o:add.cpp
	gcc -c add.cpp -o add.o

sub.o:sub.cpp
	gcc -c sub.cpp -o sub.o

multi.o:multi.cpp
	gcc -c multi.cpp -o multi.o

calc.o:calc.cpp
	gcc -c calc.cpp -o calc.o

clear:
	rm -rf *.o calc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><a data-fancybox title="image-20220728151111879.png" href="https://s2.loli.net/2022/08/17/cHesxLgRrGi1byk.png"><img src="https://cdn.jsdelivr.net/gh/shug666/image/images/cHesxLgRrGi1byk.png" alt="image-20220728151111879.png"></a></p><h3 id="_2-make是如何工作的" tabindex="-1"><a class="header-anchor" href="#_2-make是如何工作的" aria-hidden="true">#</a> 2.make是如何工作的</h3><p>在默认的方式下，也就是我们只输入 make 命令。那么，</p><p>1、make会在当前目录下找名字叫**&quot;GUNmakefile&quot;,“Makefile”或“makefile**”的文件。</p><p>2、如果找到，它会找文件中的第一个目标文件（target)，在上面的例子中，他会找到“calc”这个文件，并把这个文件作为最终的目标文件。</p><p><strong>3、如果 calc文件不存在，或是calc所依赖的后面的 .o 文件的文件修改时间要比calc这个文件新，那么，他就会执行后面所定义的命令来生成calc这个文件。</strong></p><p><a data-fancybox title="image-20220728161621761.png" href="https://s2.loli.net/2022/08/17/REZHkuMjKWcxn5O.png"><img src="https://s2.loli.net/2022/08/17/REZHkuMjKWcxn5O.png" alt="image-20220728161621761.png"></a></p><p>4、如果 calc所依赖的.o 文件也存在，那么 make 会在当前文件中找目标为.o 文件的依赖性，如果找到则再根据那一个规则生成.o 文件。（这有点像一个堆栈的过程）</p><p>5、当然，你的 C 文件和 H 文件是存在的啦，于是 make 会生成 .o 文件，然后再用 .o 文件生命make的终极任务，也就是执行文件calc了。</p><p><strong>这就是整个 make 的依赖性，make 会一层又一层地去找文件的依赖关系，直到最终编译出第一个目标文件。在找寻的过程中，如果出现错误，比如最后被依赖的文件找不到，那么 make 就会直接退出，并报错，而对于所定义的命令的错误，或是编译不成功，make 根本不理。make 只管文件的依赖性，即，如果在我找了依赖关系之后，冒号后面的文件还是不在，那么对不起，我就不工作啦。</strong></p><p><a data-fancybox title="006-makefile运行流程.png" href="https://s2.loli.net/2022/08/17/82i19nuONWaFeJr.png"><img src="https://cdn.jsdelivr.net/gh/shug666/image/images/82i19nuONWaFeJr.png" alt="006-makefile运行流程.png"></a></p><h3 id="_3-makefile中的伪目标和模式匹配" tabindex="-1"><a class="header-anchor" href="#_3-makefile中的伪目标和模式匹配" aria-hidden="true">#</a> 3.makefile中的伪目标和模式匹配</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>OBJ=$(patsubst %.cpp,%.o,$(wildcard *.cpp))
TARGET=calc

#伪目标 makefile将不会判断目标是否存在或目标是否需要更新
.PHONY=clear

$(TARGET):$(OBJ)
	gcc $^ -lstdc++ -o $@

%.o:%.cpp
	gcc -c $^ -o $@

clear:
	-$(RM) *.o calc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>在 rm 命令前面加了一个小减号的意思就是，也许某些文件出现问题，但不要管，继续做后面的事。</strong></p><p><strong>.PHONY伪目标makefile将不会判断目标是否存在或目标是否需要更新</strong></p><p><a data-fancybox title="image-20220728152809770" href="https://s2.loli.net/2022/08/17/fvJjMSPEUtQ49p8.png"><img src="https://s2.loli.net/2022/08/17/fvJjMSPEUtQ49p8.png" alt="image-20220728152809770"></a></p><h2 id="四、makefile-总述" tabindex="-1"><a class="header-anchor" href="#四、makefile-总述" aria-hidden="true">#</a> 四、Makefile 总述</h2><h3 id="_1-makefile-里有什么" tabindex="-1"><a class="header-anchor" href="#_1-makefile-里有什么" aria-hidden="true">#</a> 1.Makefile 里有什么？</h3><p>Makefile 里主要包含了五个东西：<strong>显式规则、隐晦规则、变量定义、文件指示和注释</strong>。</p><p>1、显式规则。显式规则说明了，如何生成一个或多的的目标文件。这是由 Makefile 的书写者明显指出，要生成的文件，文件的依赖文件，生成的命令</p><p>2、隐晦规则。由于我们的 make 有自动推导的功能，所以隐晦的规则可以让我们比较粗糙地简略地书写 Makefile，这是由 make 所支持的。</p><p>3、变量的定义。在 Makefile 中我们要定义一系列的变量，变量一般都是字符串，这个有点C 语言中的宏，当 Makefile 被执行时，其中的变量都会被扩展到相应的引用位置上。</p><p>4、文件指示。其包括了三个部分，一个是在一个 Makefile中引用另一个 Makefile，就像C语言中的 include 一样；另一个是指根据某些情况指定 Makefile 中的有效部分，就像C 语言中的预编译#if 一样；还有就是定义一个多行的命令。有关这一部分的内容，我会在后续的部分中讲述。</p><p>5、注释。Makefile 中只有行注释，和 UNIX 的 Shell 脚本一样，其注释是用**“#”**字符，这 个就像 C/C++中的“//”一样。如果你要在你的 Makefile 中使用“#”字符，可以用反斜框进行转义，如：“#”。</p><h3 id="_2-makefile的文件名及make的常用选项" tabindex="-1"><a class="header-anchor" href="#_2-makefile的文件名及make的常用选项" aria-hidden="true">#</a> 2.Makefile的文件名及make的常用选项</h3><p>默认的情况下 ， make命令会在当前目录下顺序找寻文件名为 “GNUmakefile”、“makefile”、“Makefile”的文件，找到了解释这个文件。在这三个文件名中，最好使用“Makefile”这个文件名，因为，这个文件名第一个字符为大写，这样 有一种显目的感觉。最好不要用“GNUmakefile”，这个文件是GNU的make识别的。有另外一些 make 只对全小写的“makefile”文件名敏感，但是基本上来说，大多数的make 都支持“makefile”和“Makefile”这两种默认文件名。</p><p>当 然 ，你可以使用别的文件名来书写Makefile， 比 如 ：“Make.Linux”，“Make.Solaris”，“Make.AIX”等，如果要指定特定的 Makefile，你可 以 使 用 make 的 “ -f” 和 “ --file” 参 数 ， 如 ： make -f Make.Linux 或 make --fileMake.AIX。</p><p><a data-fancybox title="image-20220728161839875" href="https://s2.loli.net/2022/08/17/dEwGjL7MaVH3NZB.png"><img src="https://s2.loli.net/2022/08/17/dEwGjL7MaVH3NZB.png" alt="image-20220728161839875"></a></p><h3 id="_3-引用其它的-makefile" tabindex="-1"><a class="header-anchor" href="#_3-引用其它的-makefile" aria-hidden="true">#</a> 3.引用其它的 Makefile</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>格式： include &lt;filename&gt;

include foo.make a.mk b.mk c.mk e.mk f.mk
include foo.make *.mk $(bar)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>filename 可以是当前操作系统 Shell 的文件模式（可以保含路径和通配符）</strong>*</p><p>** <strong>在 include 前面可以有一些空字符，但是绝不能是[Tab]键开始。</strong></p><p>make 命令开始时，会把找寻 include 所指出的其它 Makefile，并把其内容安置在当前的位置。就好像 C/C++的#include 指令一样。如果文件都没有指定绝对路径或是相对路径的话，make 会在当前目录下首先寻找，如果当前目录下没有找到，那么，make 还会在下面的几个目录下找：</p><p>1、如果 make 执行时，有“-I”或“--include-dir”参数，那么 make 就会在这个参数所指定的目录下去寻找。</p><p>2、如果目录 xxx/include（一般是：/usr/local/bin 或/usr/include）存在的话，make 也会去找。如果有文件没有找到的话，make 会生成一条警告信息，但不会马上出现致命错误。它会继续载入其它的文件，一旦完成 makefile 的读取，make会再重试这些没有找到，或是不能读取的文件，如果还是不行，make 才会出现一条致命信息。如果你想让 make 不理那些无法读取的文件，而继续执行，你可以在 include 前加一个减号“-”。</p><p><strong>如： -include filename 其表示，无论 include 过程中出现什么错误，都不要报错继续执行。和其它版本make兼容的相关命令是 sinclude，其作用和这一个是一样的。</strong></p><h3 id="_4-环境变量makefiles" tabindex="-1"><a class="header-anchor" href="#_4-环境变量makefiles" aria-hidden="true">#</a> 4.环境变量MAKEFILES</h3><p>如果你的当前环境中定义了环境变量 MAKEFILES，那么，make 会把这个变量中的值做一个类似于 include 的动作。这个变量中的值是其它的 Makefile，用空格分隔。只是它和 include 不同的是，从这个环境变中引入的 Makefile 的“目标”不会起作用，如果环境变量中定义的文件发现错误，make也会不理。但是在这里我还是建议不要使用这个环境变量，因为只要这个变量一被定义，那么当你使用 make 时，所有的 Makefile 都会受到它的影响，这绝不是你想看到的。在这里提这个事，只是为了告诉大家，也许有时候你的 Makefile 出现了怪事，那么你可以看看当前环境中有没有定义这个变量。</p><h3 id="_5-make的工作方式" tabindex="-1"><a class="header-anchor" href="#_5-make的工作方式" aria-hidden="true">#</a> 5.make的工作方式</h3><p>GNU 的 make 工作时的执行步骤入下：（想来其它的 make 也是类似）</p><p>1、读入所有的 Makefile。</p><p>2、读入被 include 的其它 Makefile。</p><p>3、初始化文件中的变量。</p><p>4、推导隐晦规则，并分析所有规则。</p><p>5、为所有的目标文件创建依赖关系链。</p><p>6、根据依赖关系，决定哪些目标要重新生成。</p><p>7、执行生成命令。</p><p>1-5 步为第一个阶段，6-7 为第二个阶段。第一个阶段中，如果定义的变量被使用了，那么，make 会把其展开在使用的位置。但 make 并不会完全马上展开，<strong>make使用的是拖延战术</strong>，如果变量出现在依赖关系的规则中，那么仅当这条依赖被决定要使用了，变量才会在其内部展开。</p><h2 id="五、书写规则" tabindex="-1"><a class="header-anchor" href="#五、书写规则" aria-hidden="true">#</a> 五、书写规则</h2><p>规则包含两个部分，一个是依赖关系，一个是生成目标的方法。在 Makefile 中，规则的顺序是很重要的，因为，<strong>Makefile 中只应该有一个最终目标，</strong></p><p>其它的目标都是被这个目标所连带出来的，所以一定要让 make 知道你的最终目标是什么。一般来说，定义在 Makefile 中的目标可能会有很多，但是第一条规则中的目标将被确立为最终的目标。</p><h3 id="_1-规则举例" tabindex="-1"><a class="header-anchor" href="#_1-规则举例" aria-hidden="true">#</a> 1.规则举例</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>foo.o : foo.c defs.h # foo 模块 
	gcc -c footc -o foo.o
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>1、文件的依赖关系，foo.o 依赖于 foo.c 和 defs.h 的文件，如果 foo.c 和 defs.h 的文件日期要比 foo.o 文件日期要新，或是 foo.o 不存在，那么依赖关系发生。2、如果生成（或更新）foo.o 文件。也就是那个 gcc 命令，其说明了，如何生成 foo.o 这个文件。（当然 foo.c 文件 include 了 defs.h 文件）</p><h3 id="_2-规则的语法" tabindex="-1"><a class="header-anchor" href="#_2-规则的语法" aria-hidden="true">#</a> 2.规则的语法</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>targets : prerequisites
command
...
或是这样：
targets : prerequisites ; command
command
...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>targets 是文件名，以空格分开，可以使用通配符。一般来说，我们的目标基本上是一个文件，但也有可能是多个文件。</p><p>command 是命令行，<strong>如果其不与“target :rerequisites”在一行，那么，必须以[Tab 键]开头，如果和 prerequisites 在一行，那么可以用分号做为分隔</strong>。</p><p>prerequisites 也就是目标所依赖的文件（或依赖目标）。如果其中的某个文件要比目标文件要新，那么，目标就被认为是“过时的”，被认为是需要重生成的。</p><p>如果命令太长，你可以使用反斜框（‘\\’）作为换行符。make 对一行上有多少个字符没有限制。规则告诉 make 两件事，文件的依赖关系和如何成成目标文件。</p><p><strong>一般来说，make 会以 UNIX 的标准 Shell，也就是/bin/sh 来执行命令。</strong></p><h3 id="_3-在规则中使用通配符" tabindex="-1"><a class="header-anchor" href="#_3-在规则中使用通配符" aria-hidden="true">#</a> 3.在规则中使用通配符</h3><p><strong>make 支持三各通配符：“*”，“?”和“[...]”。</strong></p><p>波浪号（“~”）字符在文件名中也有比较特殊的用途。如果是“~/test”，这就表示当前用户的$HOME 目录下的 test 目录。而“~hchen/test”则表示用户 hchen 的宿主目录下的test 目录。（这些都是 Unix 下的小知识了，make 也支持）而在 Windows 或是 MS-DOS下，用户没有宿主目录，那么波浪号所指的目录则根据环境变量“HOME”而定。</p><p><strong>如果我们的文件名中有通配符，如：“<em>”，那么可以用转义字符“\\”，如“*”来表示真实的“</em>”字符，而不是任意长度的字符串。</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>shell所支持的通配符示例
clean:
	rm -f *.o
	
命令中的通配符示例
print: *.c
lpr -p $?
touch print

objects = *.o
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通符同样可以用在变量中。[*.o]不会展开，objects的值就是“.o”。*<em>Makefile 中的变量其实就是 C/C++中的宏。如果你要让通配符在变量中展开，也就是让 objects 的值是所有[.o]的文件名的集合，那么，你可以这样：objects := $(wildcard <em>.o)</em></em> 见 三.3中图所示</p><h3 id="_4-文件搜寻" tabindex="-1"><a class="header-anchor" href="#_4-文件搜寻" aria-hidden="true">#</a> 4.文件搜寻</h3><p>Makefile 文件中的**特殊变量“VPATH”**就是完成这个功能的，如果没有指明这个变量，make 只会在当前的目录中去找寻依赖文件和目标文件。如果定义了这个变量，make就会在当当前目录找不到的情况下，到所指定的目录中去找寻文件了。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>VPATH = src:../headers 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>上面的的定义指定两个目录，“src”和“../headers”，make会按照这个顺序进行搜索。 <strong>目录由“冒号”分隔</strong>。（当然，<strong>当前目录永远是最高优先搜索的地方</strong>）</p><p>另一个设置文件搜索路径的方法是使用 make 的“vpath”关键字（注意，它是全小写的），它可以指定不同的文件在不同的搜索目录中。它的使用方法有三种：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>1、vpath &lt;pattern&gt; &lt;directories&gt;  为符合模式&lt;pattern&gt;的文件指定搜索目录&lt;directories&gt;。

2、vpath &lt;pattern&gt;  清除符合模式&lt;pattern&gt;的文件的搜索目录。

3、vpath 清除所有已被设置好了的文件搜索目录**

vapth 使用方法中的&lt;pattern&gt;需要包含“%”字符。“%”的意思是匹配零或若干字符，例如，“%.h”表示所有以“.h”结尾的文件。&lt;pattern&gt;指定了要搜索的文件集，而&lt;directories&gt;则指定了&lt;pattern&gt;的文件集的搜索的目录。例如： vpath %.h ../headers（如果某文件在当前目录没有找到的话） 

我们可以连续地使用 vpath 语句，以指定不同搜索策略。make 会按照 vpath 语句的先后顺序来执行搜索
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>vpath %.c foo 

vpath % blish

vpath %.c bar
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-伪目标" tabindex="-1"><a class="header-anchor" href="#_5-伪目标" aria-hidden="true">#</a> 5.伪目标</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>#伪目标 makefile将不会判断目标是否存在或目标是否需要更新
.PHONY=clear

clean:
	-rm *.o temp
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因为，我们并不生成“clean”这个文件。“伪目标”并不是一个文件，只是一个标签，由于“伪目标”不是文件，所以 make 无法生成它的依赖关系和决定它是否要执行。我们只有通过显示地指明这个“目标”才能让其生效（make clean）。当然，“伪目标”的取名不能和文件名重名，不然其就失去了“伪目标”的意义了。</p><p>伪目标一般没有依赖的文件。但是，我们也可以为伪目标指定所依赖的文件。伪目标同样可以作为“默认目标”，只要将其放在第一个。一个示例就是，如果你的 Makefile 需要一口气生成若干个可执行文件，但你只想简单地敲一个 make 完事，并且，所有的目标文件都写在一个 Makefile 中，那么你可以使用“伪目标”这个特性：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>.PHONY : all

all : prog1 prog2 prog3
prog1 : prog1.o utils.o 
	cc -o prog1 prog1.o utils.o
prog2 : prog2.o
	cc -o prog2 prog2.o
prog3 : prog3.o sort.o utils.o
	cc -o prog3 prog3.o sort.o utils.o
	
--------------------------------------------------

.PHONY : cleanall cleanobj cleandiff 

cleanall : cleanobj cleandiff
	rm program
cleanobj :
	rm *.o
cleandiff :
	rm *.diff
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-多目标" tabindex="-1"><a class="header-anchor" href="#_6-多目标" aria-hidden="true">#</a> 6.多目标</h3><p>Makefile 的规则中的目标可以不止一个，其支持多目标，有可能我们的多个目标同时依赖于一个文件，并且其生成的命令大体类似。于是我们就能把其合并起来。当然，多个目标的生成规则的执行命令是同一个，这可能会可我们带来麻烦，不过好在我们的可以使用一个自动化变量“$@”（关于自动化变量，将在后面讲述），<strong>这个变量表示着目前规则中所有的目标的集合</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>bigoutput littleoutput : text.g 
generate text.g -$(subst output,,$@) &gt; $@

上述规则等价于：

bigoutput : text.g 
generate text.g -big &gt; bigoutput 
littleoutput : text.g
generate text.g -little &gt; littleoutput
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中，-(subst output,,@)中的“”表示执行一个 Makefile 的函数，函数名为 subst，后面的为参数。关于函数，将在后面讲述。这里的这个函数是截取字符串的意思，$@表示目标的集合，就像一个数组，依次取出目标，并执于命令。</p><h3 id="_7-静态模式" tabindex="-1"><a class="header-anchor" href="#_7-静态模式" aria-hidden="true">#</a> 7.静态模式</h3><p>静态模式可以更加容易地定义多目标的规则，可以让我们的规则变得更加的有弹性和灵活。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;targets ...&gt;: &lt;target-pattern&gt;: &lt;prereq-patterns ...&gt;

&lt;commands&gt;

...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>targets 定义了一系列的目标文件，可以有通配符。是目标的一个集合。target-parrtern 是指明了 targets 的模式，也就是的目标集模式。prereq-parrterns 是目标的依赖模式，它对 target-parrtern 形成的模式再进行一次依赖目标的定义。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>objects = foo.o bar.o 
all: $(objects)
$(objects): %.o: %.c
	$(CC) -c $(CFLAGS) $&lt; -o $@

------------------------------------------

files = foo.elc bar.o lose.o
$(filter %.o,$(files)): %.o: %.c
$(CC) -c $(CFLAGS) $&lt; -o $@
$(filter %.elc,$(files)): %.elc: %.el
emacs -f batch-byte-compile $&lt;

$(filter %.o,(files))表示调用 Makefile 的 filter 函数，过滤“$filter”集，只要其中模式为“%.o”的内容。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="与-的区别" tabindex="-1"><a class="header-anchor" href="#与-的区别" aria-hidden="true">#</a> =与:=的区别</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>1、“=”

    make会将整个makefile展开后，再决定变量的值。也就是说，变量的值将会是整个makefile中最后被指定的值。看例子：

        x = foo
        y = $(x) bar
        x = xyz

	在上例中，y的值将会是 xyz bar ，而不是 foo bar 。

2、“:=”

    “:=”表示变量的值决定于它在makefile中的位置，而不是整个makefile展开后的最终值。

        x := foo
        y := $(x) bar
        x := xyz

    在上例中，y的值将会是 foo bar ，而不是 xyz bar 了。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,113),s=[d];function r(t,c){return i(),a("div",null,s)}const m=e(l,[["render",r],["__file","makefile.html.vue"]]);export{m as default};
