import{_ as a,r as l,o as s,c as r,b as e,d as n,e as d,a as t}from"./app-e8f85126.js";const c={},v=t(`<h1 id="kotlin-里那些「更方便的」" tabindex="-1"><a class="header-anchor" href="#kotlin-里那些「更方便的」" aria-hidden="true">#</a> Kotlin 里那些「更方便的」</h1><h2 id="构造器" tabindex="-1"><a class="header-anchor" href="#构造器" aria-hidden="true">#</a> 构造器</h2><h3 id="主构造器" tabindex="-1"><a class="header-anchor" href="#主构造器" aria-hidden="true">#</a> 主构造器</h3><p>我们之前已经了解了 Kotlin 中 constructor 的写法：</p><div class="language-kotlin line-numbers-mode" data-ext="kt"><pre class="language-kotlin"><code>🏝️
<span class="token keyword">class</span> User <span class="token punctuation">{</span>
    <span class="token keyword">var</span> name<span class="token operator">:</span> String
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>name<span class="token operator">:</span> String<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实 Kotlin 中还有更简单的方法来写构造器：</p><div class="language-kotlin line-numbers-mode" data-ext="kt"><pre class="language-kotlin"><code>🏝️
               👇       
<span class="token keyword">class</span> User <span class="token keyword">constructor</span><span class="token punctuation">(</span>name<span class="token operator">:</span> String<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">//                  👇 这里与构造器中的 name 是同一个</span>
    <span class="token keyword">var</span> name<span class="token operator">:</span> String <span class="token operator">=</span> name
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里有几处不同点：</p><ul><li><code>constructor</code> 构造器移到了类名之后</li><li>类的属性 <code>name</code> 可以引用构造器中的参数 <code>name</code></li></ul><p>这个写法叫「主构造器 primary constructor」。与之相对的在第二篇中，写在类中的构造器被称为「次构造器」。在 Kotlin 中一个类最多只能有 1 个主构造器（也可以没有），而次构造器是没有个数限制。</p><p>主构造器中的参数除了可以在类的属性中使用，还可以在 <code>init</code> 代码块中使用：</p><div class="language-kotlin line-numbers-mode" data-ext="kt"><pre class="language-kotlin"><code>🏝️
<span class="token keyword">class</span> User <span class="token keyword">constructor</span><span class="token punctuation">(</span>name<span class="token operator">:</span> String<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">var</span> name<span class="token operator">:</span> String
    <span class="token keyword">init</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中 <code>init</code> 代码块是紧跟在主构造器之后执行的，这是因为主构造器本身没有代码体，<code>init</code> 代码块就充当了主构造器代码体的功能。</p><p>另外，如果类中有主构造器，那么其他的次构造器都需要通过 <code>this</code> 关键字调用主构造器，可以直接调用或者通过别的次构造器间接调用。如果不调用 IDE 就会报错：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
class User constructor(var name: String) {
    constructor(name: String, id: Int) {
    // 👆这样写会报错，Primary constructor call expected
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为什么当类中有主构造器的时候就强制要求次构造器调用主构造器呢？</p><p>我们从主构造器的特性出发，一旦在类中声明了主构造器，就包含两点：</p><ul><li>必须性：创建类的对象时，不管使用哪个构造器，都需要主构造器的参与</li><li>第一性：在类的初始化过程中，首先执行的就是主构造器</li></ul><p>这也就是主构造器的命名由来。</p><p>当一个类中同时有主构造器与次构造器的时候，需要这样写：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
class User constructor(var name: String) {
                                   // 👇  👇 直接调用主构造器
    constructor(name: String, id: Int) : this(name) {
    }
                                                // 👇 通过上一个次构造器，间接调用主构造器
    constructor(name: String, id: Int, age: Int) : this(name, id) {
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在使用次构造器创建对象时，<code>init</code> 代码块是先于次构造器执行的。如果把主构造器看成身体的头部，那么 <code>init</code> 代码块就是颈部，次构造器就相当于身体其余部分。</p><p>细心的你也许会发现这里又出现了 <code>:</code> 符号，它还在其他场合出现过，例如：</p><ul><li>变量的声明：<code>var id: Int</code></li><li>类的继承：<code>class MainActivity : AppCompatActivity() {}</code></li><li>接口的实现：<code>class User : Impl {}</code></li><li>匿名类的创建：<code>object: ViewPager.SimpleOnPageChangeListener() {}</code></li><li>函数的返回值：<code>fun sum(a: Int, b: Int): Int</code></li></ul><p>可以看出 <code>:</code> 符号在 Kotlin 中非常高频出现，它其实表示了一种依赖关系，在这里表示依赖于主构造器。</p><p>通常情况下，主构造器中的 <code>constructor</code> 关键字可以省略：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
class User(name: String) {
    var name: String = name
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但有些场景，<code>constructor</code> 是不可以省略的，例如在主构造器上使用「可见性修饰符」或者「注解」：</p><ul><li>可见性修饰符我们之前已经讲过，它修饰普通函数与修饰构造器的用法是一样的，这里不再详述：</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
class User private constructor(name: String) {
//           👆 主构造器被修饰为私有的，外部就无法调用该构造器
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>关于注解的知识点，我们之后会讲，这里就不展开了</li></ul><p>既然主构造器可以简化类的初始化过程，那我们就帮人帮到底，送佛送到西，用主构造器把属性的初始化也一并给简化了。</p><h3 id="主构造器里声明属性" tabindex="-1"><a class="header-anchor" href="#主构造器里声明属性" aria-hidden="true">#</a> 主构造器里声明属性</h3><p>之前我们讲了主构造器中的参数可以在属性中进行赋值，其实还可以在主构造器中直接声明属性：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
           👇
class User(var name: String) {
}
// 等价于：
class User(name: String) {
  var name: String = name
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果在主构造器的参数声明时加上 <code>var</code> 或者 <code>val</code>，就等价于在类中创建了该名称的属性（property），并且初始值就是主构造器中该参数的值。</p><p>以上讲了所有关于主构造器相关的知识，让我们总结一下类的初始化写法：</p><ul><li>首先创建一个 <code>User</code> 类：</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
class User {
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>添加一个参数为 <code>name</code> 与 <code>id</code> 的主构造器：</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
class User(name: String, id: String) {
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>将主构造器中的 <code>name</code> 与 <code>id</code> 声明为类的属性：</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
class User(val name: String, val id: String) {
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>然后在 <code>init</code> 代码块中添加一些初始化逻辑：</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
class User(val name: String, val id: String) {
    init {
        ...
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>最后再添加其他次构造器：</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
class User(val name: String, val id: String) {
    init {
        ...
    }
    constructor(person: Person) : this(person.name, person.id) {
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当一个类有多个构造器时，只需要把最基本、最通用的那个写成主构造器就行了。这里我们选择将参数为 <code>name</code> 与 <code>id</code> 的构造器作为主构造器。</p><p>到这里，整个类的初始化就完成了，类的初始化顺序就和上面的步骤一样。</p><p>除了构造器，普通函数也是有很多简化写法的。</p><h2 id="函数简化" tabindex="-1"><a class="header-anchor" href="#函数简化" aria-hidden="true">#</a> 函数简化</h2><h3 id="使用-连接返回值" tabindex="-1"><a class="header-anchor" href="#使用-连接返回值" aria-hidden="true">#</a> 使用 <code>=</code> 连接返回值</h3><p>我们已经知道了 Kotlin 中函数的写法：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
fun area(width: Int, height: Int): Int {
    return width * height
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实，这种只有一行代码的函数，还可以这么写：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
                                      👇
fun area(width: Int, height: Int): Int = width * height

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>{}</code> 和 <code>return</code> 没有了，使用 <code>=</code> 符号连接返回值。</p><p>我们之前讲过，Kotlin 有「类型推断」的特性，那么这里函数的返回类型还可以隐藏掉：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
//                               👇省略了返回类型
fun area(width: Int, height: Int) = width * height

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不过，在实际开发中，还是推荐显式地将返回类型写出来，增加代码可读性。</p><p>以上是函数有返回值时的情况，对于没有返回值的情况，可以理解为返回值是 <code>Unit</code>：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
fun sayHi(name: String) {
    println(&quot;Hi &quot; + name)
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因此也可以简化成下面这样：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
                       👇
fun sayHi(name: String) = println(&quot;Hi &quot; + name)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>简化完函数体，我们再来看看前面的参数部分。</p><p>对于 Java 中的方法重载，我们都不陌生，那 Kolin 中是否有更方便的重载方式呢？接下来我们看看 Kotlin 中的「参数默认值」的用法。</p><h3 id="参数默认值" tabindex="-1"><a class="header-anchor" href="#参数默认值" aria-hidden="true">#</a> 参数默认值</h3><p>Java 中，允许在一个类中定义多个名称相同的方法，但是参数的类型或个数必须不同，这就是方法的重载：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>☕️
public void sayHi(String name) {
    System.out.println(&quot;Hi &quot; + name);
}

public void sayHi() {
    sayHi(&quot;world&quot;); 
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 Kotlin 中，也可以使用这样的方式进行函数的重载，不过还有一种更简单的方式，那就是「参数默认值」：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
                           👇
fun sayHi(name: String = &quot;world&quot;) = println(&quot;Hi &quot; + name)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里的 <code>world</code> 是参数 <code>name</code> 的默认值，当调用该函数时不传参数，就会使用该默认值。</p><p>这就等价于上面 Java 写的重载方法，当调用 <code>sayHi</code> 函数时，参数是可选的：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
sayHi(&quot;kaixue.io&quot;)
sayHi() // 使用了默认值 &quot;world&quot;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>既然与重载函数的效果相同，那 Kotlin 中的参数默认值有什么好处呢？仅仅只是少写了一些代码吗？</p><p>其实在 Java 中，每个重载方法的内部实现可以各不相同，这就无法保证重载方法内部设计上的一致性，而 Kotlin 的参数默认值就解决了这个问题。</p><p>不过参数默认值在调用时也不是完全可以放飞自我的。</p><p>来看下面这段代码，这里函数中有默认值的参数在无默认值参数的前面：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
fun sayHi(name: String = &quot;world&quot;, age: Int) {
    ...
}

sayHi(10)
//    👆 这时想使用默认值进行调用，IDE 会报以下两个错误
// The integer literal does not conform to the expected type String
// No value passed for parameter &#39;age&#39;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个错误就是告诉你参数不匹配，说明我们的「打开方式」不对，其实 Kotlin 里是通过「命名参数」来解决这个问题的。</p><h3 id="命名参数" tabindex="-1"><a class="header-anchor" href="#命名参数" aria-hidden="true">#</a> 命名参数</h3><p>具体用法如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
fun sayHi(name: String = &quot;world&quot;, age: Int) {
    ...
}
      👇   
sayHi(age = 21)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在调用函数时，显式地指定了参数 <code>age</code> 的名称，这就是「命名参数」。Kotlin 中的每一个函数参数都可以作为命名参数。</p><p>再来看一个有非常多参数的函数的例子：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️ 
fun sayHi(name: String = &quot;world&quot;, age: Int, isStudent: Boolean = true, isFat: Boolean = true, isTall: Boolean = true) {
    ...
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当函数中有非常多的参数时，调用该函数就会写成这样：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
sayHi(&quot;world&quot;, 21, false, true, false)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当看到后面一长串的布尔值时，我们很难分清楚每个参数的用处，可读性很差。通过命名参数，我们就可以这么写：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
sayHi(name = &quot;wo&quot;, age = 21, isStudent = false, isFat = true, isTall = false)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>与命名参数相对的一个概念被称为「位置参数」，也就是按位置顺序进行参数填写。</p><p>当一个函数被调用时，如果混用位置参数与命名参数，那么所有的位置参数都应该放在第一个命名参数之前：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
fun sayHi(name: String = &quot;world&quot;, age: Int) {
    ...
}

sayHi(name = &quot;wo&quot;, 21) // 👈 IDE 会报错，Mixing named and positioned arguments is not allowed
sayHi(&quot;wo&quot;, age = 21) // 👈 这是正确的写法

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>讲完了命名参数，我们再看看 Kotlin 中的另一种常见函数：嵌套函数。</p><h3 id="本地函数-嵌套函数" tabindex="-1"><a class="header-anchor" href="#本地函数-嵌套函数" aria-hidden="true">#</a> 本地函数（嵌套函数）</h3><p>首先来看下这段代码，这是一个简单的登录的函数：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
fun login(user: String, password: String, illegalStr: String) {
    // 验证 user 是否为空
    if (user.isEmpty()) {
        throw IllegalArgumentException(illegalStr)
    }
    // 验证 password 是否为空
    if (password.isEmpty()) {
        throw IllegalArgumentException(illegalStr)
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>该函数中，检查参数这个部分有些冗余，我们又不想将这段逻辑作为一个单独的函数对外暴露。这时可以使用嵌套函数，在 <code>login</code> 函数内部声明一个函数：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
fun login(user: String, password: String, illegalStr: String) {
           👇 
    fun validate(value: String, illegalStr: String) {
      if (value.isEmpty()) {
          throw IllegalArgumentException(illegalStr)
      }
    }
   👇
    validate(user, illegalStr)
    validate(password, illegalStr)
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里我们将共同的验证逻辑放进了嵌套函数 <code>validate</code> 中，并且 <code>login</code> 函数之外的其他地方无法访问这个嵌套函数。</p><p>这里的 <code>illegalStr</code> 是通过参数的方式传进嵌套函数中的，其实完全没有这个必要，因为嵌套函数中可以访问在它外部的所有变量或常量，例如类中的属性、当前函数中的参数与变量等。</p><p>我们稍加改进：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
fun login(user: String, password: String, illegalStr: String) {
    fun validate(value: String) {
        if (value.isEmpty()) {
                                              👇
            throw IllegalArgumentException(illegalStr)
        }
    }
    ...
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里省去了嵌套函数中的 <code>illegalStr</code> 参数，在该嵌套函数内直接使用外层函数 <code>login</code> 的参数 <code>illegalStr</code>。</p><p>上面 <code>login</code> 函数中的验证逻辑，其实还有另一种更简单的方式：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
fun login(user: String, password: String, illegalStr: String) {
    require(user.isNotEmpty()) { illegalStr }
    require(password.isNotEmpty()) { illegalStr }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中用到了 lambda 表达式以及 Kotlin 内置的 <code>require</code> 函数，这里先不做展开，之后的文章会介绍。</p><h2 id="字符串" tabindex="-1"><a class="header-anchor" href="#字符串" aria-hidden="true">#</a> 字符串</h2><p>讲完了普通函数的简化写法，Kotlin 中字符串也有很多方便写法。</p><h3 id="字符串模板" tabindex="-1"><a class="header-anchor" href="#字符串模板" aria-hidden="true">#</a> 字符串模板</h3><p>在 Java 中，字符串与变量之间是使用 <code>+</code> 符号进行拼接的，Kotlin 中也是如此：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
val name = &quot;world&quot;
println(&quot;Hi &quot; + name)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是当变量比较多的时候，可读性会变差，写起来也比较麻烦。</p><p>Java 给出的解决方案是 <code>String.format</code>：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>☕️
System.out.print(String.format(&quot;Hi %s&quot;, name));

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Kotlin 为我们提供了一种更加方便的写法：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
val name = &quot;world&quot;
//         👇 用 &#39;$&#39; 符号加参数的方式
println(&quot;Hi $name&quot;)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种方式就是把 <code>name</code> 从后置改为前置，简化代码的同时增加了字符串的可读性。</p><p>除了变量，<code>$</code> 后还可以跟表达式，但表达式是一个整体，所以我们要用 <code>{}</code> 给它包起来：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
val name = &quot;world&quot;
println(&quot;Hi \${name.length}&quot;) 

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实就跟四则运算的括号一样，提高语法上的优先级，而单个变量的场景可以省略 <code>{}</code>。</p><p>字符串模板还支持转义字符，比如使用转义字符 <code>\\n</code> 进行换行操作：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
val name = &quot;world!\\n&quot;
println(&quot;Hi $name&quot;) // 👈 会多打一个空行

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>字符串模板的用法对于我们 Android 工程师来说，其实一点都不陌生。</p><p>首先，Gradle 所用的 Groovy 语言就已经有了这种支持：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>def name = &quot;world&quot;
println &quot;Hi \${name}&quot;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 Android 的资源文件里，定义字符串也有类似用法：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;string name=&quot;hi&quot;&gt;Hi %s&lt;/string&gt; 

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>☕️
getString(R.id.hi, &quot;world&quot;);

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="raw-string-原生字符串" tabindex="-1"><a class="header-anchor" href="#raw-string-原生字符串" aria-hidden="true">#</a> raw string (原生字符串)</h3><p>有时候我们不希望写过多的转义字符，这种情况 Kotlin 通过「原生字符串」来实现。</p><p>用法就是使用一对 <code>&quot;&quot;&quot;</code> 将字符串括起来：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
val name = &quot;world&quot;
val myName = &quot;kotlin&quot;
           👇
val text = &quot;&quot;&quot;
      Hi $name!
    My name is $myName.\\n
&quot;&quot;&quot;
println(text)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里有几个注意点：</p><ul><li><code>\\n</code> 并不会被转义</li><li>最后输出的内容与写的内容完全一致，包括实际的换行</li><li><code>$</code> 符号引用变量仍然生效</li></ul><p>这就是「原生字符串」。输出结果如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>      Hi world!
    My name is kotlin.\\n

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但对齐方式看起来不太优雅，原生字符串还可以通过 <code>trimMargin()</code> 函数去除每行前面的空格：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
val text = &quot;&quot;&quot;
     👇 
      |Hi world!
    |My name is kotlin.
&quot;&quot;&quot;.trimMargin()
println(text)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出结果如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Hi world!
My name is kotlin.

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里的 <code>trimMargin()</code> 函数有以下几个注意点：</p><ul><li><code>|</code> 符号为默认的边界前缀，前面只能有空格，否则不会生效</li><li>输出时 <code>|</code> 符号以及它前面的空格都会被删除</li><li>边界前缀还可以使用其他字符，比如 <code>trimMargin(&quot;/&quot;)</code>，只不过上方的代码使用的是参数默认值的调用方式</li></ul><p>字符串的部分就先到这里，下面来看看数组与集合有哪些更方便的操作。</p><h2 id="数组和集合" tabindex="-1"><a class="header-anchor" href="#数组和集合" aria-hidden="true">#</a> 数组和集合</h2><h3 id="数组与集合的操作符" tabindex="-1"><a class="header-anchor" href="#数组与集合的操作符" aria-hidden="true">#</a> 数组与集合的操作符</h3><p>在之前的文章中，我们已经知道了数组和集合的基本概念，其实 Kotlin 中，还为我们提供了许多使数组与集合操作起来更加方便的函数。</p><p>首先声明如下 <code>IntArray</code> 和 <code>List</code>：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
val intArray = intArrayOf(1, 2, 3)
val strList = listOf(&quot;a&quot;, &quot;b&quot;, &quot;c&quot;)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来，对它们的操作函数进行讲解：</p><ul><li><code>forEach</code>：遍历每一个元素</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
//              👇 lambda 表达式，i 表示数组的每个元素
intArray.forEach { i -&gt;
    print(i + &quot; &quot;)
}
// 输出：1 2 3 

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>除了「lambda」表达式，这里也用到了「闭包」的概念，这又是另一个话题了，这里先不展开。</p><ul><li><code>filter</code>：对每个元素进行过滤操作，如果 lambda 表达式中的条件成立则留下该元素，否则剔除，最终生成新的集合</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
// [1, 2, 3]
  ⬇️
//  {2, 3}
//            👇 注意，这里变成了 List
val newList: List = intArray.filter { i -&gt;
    i != 1 // 👈 过滤掉数组中等于 1 的元素
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><code>map</code>：遍历每个元素并执行给定表达式，最终形成新的集合</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
//  [1, 2, 3]
   ⬇️
//  {2, 3, 4}
val newList: List = intArray.map { i -&gt;
    i + 1 // 👈 每个元素加 1
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><code>flatMap</code>：遍历每个元素，并为每个元素创建新的集合，最后合并到一个集合中</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
//          [1, 2, 3]
           ⬇️
// {&quot;2&quot;, &quot;a&quot; , &quot;3&quot;, &quot;a&quot;, &quot;4&quot;, &quot;a&quot;}
intArray.flatMap { i -&gt;
    listOf(&quot;\${i + 1}&quot;, &quot;a&quot;) // 👈 生成新集合
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>关于为什么数组的 <code>filter</code> 之后变成 <code>List</code>，就留作思考题吧~</p><p>这里是以数组 <code>intArray</code> 为例，集合 <code>strList</code> 也同样有这些操作函数。Kotlin 中还有许多类似的操作函数，这里就不一一列举了。</p><p>除了数组和集合，Kotlin 中还有另一种常用的数据类型： <code>Range</code>。</p><h3 id="range" tabindex="-1"><a class="header-anchor" href="#range" aria-hidden="true">#</a> <code>Range</code></h3><p>在 Java 语言中并没有 <code>Range</code> 的概念，Kotlin 中的 <code>Range</code> 表示区间的意思，也就是范围。区间的常见写法如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
              👇      👇
val range: IntRange = 0..1000 

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里的 <code>0..1000</code> 就表示从 0 到 1000 的范围，<strong>包括 1000</strong>，数学上称为闭区间 [0, 1000]。除了这里的 <code>IntRange</code> ，还有 <code>CharRange</code> 以及 <code>LongRange</code>。</p><p>Kotlin 中没有纯的开区间的定义，不过有半开区间的定义：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
                         👇
val range: IntRange = 0 until 1000 

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里的 <code>0 until 1000</code> 表示从 0 到 1000，但<strong>不包括 1000</strong>，这就是半开区间 [0, 1000) 。</p><p><code>Range</code> 这个东西，天生就是用来遍历的：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
val range = 0..1000
//     👇 默认步长为 1，输出：0, 1, 2, 3, 4, 5, 6, 7....1000,
for (i in range) {
    print(&quot;$i, &quot;)
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里的 <code>in</code> 关键字可以与 <code>for</code> 循环结合使用，表示挨个遍历 <code>range</code> 中的值。关于 <code>for</code> 循环控制的使用，在本期文章的后面会做具体讲解。</p><p>除了使用默认的步长 1，还可以通过 <code>step</code> 设置步长：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
val range = 0..1000
//               👇 步长为 2，输出：0, 2, 4, 6, 8, 10,....1000,
for (i in range step 2) {
    print(&quot;$i, &quot;)
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上是递增区间，Kotlin 还提供了递减区间 <code>downTo</code> ，不过递减没有半开区间的用法:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
//            👇 输出：4, 3, 2, 1, 
for (i in 4 downTo 1) {
    print(&quot;$i, &quot;)
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中 <code>4 downTo 1</code> 就表示递减的闭区间 [4, 1]。这里的 <code>downTo</code> 以及上面的 <code>step</code> 都叫做「中缀表达式」，之后的文章会做介绍。</p><h3 id="sequence" tabindex="-1"><a class="header-anchor" href="#sequence" aria-hidden="true">#</a> <code>Sequence</code></h3><p>在上一期中我们已经熟悉了 <code>Sequence</code> 的基本概念，这次让我们更加深入地了解 <code>Sequence</code> 序列的使用方式。</p><p>序列 <code>Sequence</code> 又被称为「惰性集合操作」，关于什么是惰性，我们通过下面的例子来理解：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
val sequence = sequenceOf(1, 2, 3, 4)
val result: Sequence&lt;Int&gt; = sequence
    .map { i -&gt;
        println(&quot;Map $i&quot;)
        i * 2 
    }
    .filter { i -&gt;
        println(&quot;Filter $i&quot;)
        i % 3  == 0 
    }
👇
println(result.first()) // 👈 只取集合的第一个元素

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>惰性的概念首先就是说在「👇」标注之前的代码运行时不会立即执行，它只是定义了一个执行流程，只有 <code>result</code> 被使用到的时候才会执行</p></li><li><p>当「👇」的 <code>println</code> 执行时数据处理流程是这样的：</p></li><li><p>取出元素 1 -&gt; map 为 2 -&gt; filter 判断 2 是否能被 3 整除</p></li><li><p>取出元素 2 -&gt; map 为 4 -&gt; filter 判断 4 是否能被 3 整除</p></li><li><p>...</p></li></ul><p>惰性指当出现满足条件的第一个元素的时候，<code>Sequence</code> 就不会执行后面的元素遍历了，即跳过了 <code>4</code> 的遍历。</p><p>而 <code>List</code> 是没有惰性的特性的：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
val list = listOf(1, 2, 3, 4)
val result: List = list
    .map { i -&gt;
        println(&quot;Map $i&quot;)
        i * 2 
    }
    .filter { i -&gt;
        println(&quot;Filter $i&quot;)
        i % 3  == 0 
    }
👇
println(result.first()) // 👈 只取集合的第一个元素

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>包括两点：</p><ul><li>声明之后立即执行</li><li>数据处理流程如下： <ul><li>{1, 2, 3, 4} -&gt; {2, 4, 6, 8}</li><li>遍历判断是否能被 3 整除</li></ul></li></ul><p><code>Sequence</code> 这种类似懒加载的实现有下面这些优点：</p><ul><li>一旦满足遍历退出的条件，就可以省略后续不必要的遍历过程。</li><li>像 <code>List</code> 这种实现 <code>Iterable</code> 接口的集合类，每调用一次函数就会生成一个新的 <code>Iterable</code>，下一个函数再基于新的 <code>Iterable</code> 执行，每次函数调用产生的临时 <code>Iterable</code> 会导致额外的内存消耗，而 <code>Sequence</code> 在整个流程中只有一个。</li></ul><p>因此，<code>Sequence</code> 这种数据类型可以在数据量比较大或者数据量未知的时候，作为流式处理的解决方案。</p><h2 id="条件控制" tabindex="-1"><a class="header-anchor" href="#条件控制" aria-hidden="true">#</a> 条件控制</h2><p>相比 Java 的条件控制，Kotlin 中对条件控制进行了许多的优化及改进。</p><h3 id="if-else" tabindex="-1"><a class="header-anchor" href="#if-else" aria-hidden="true">#</a> <code>if/else</code></h3><p>首先来看下 Java 中的 <code>if/else</code> 写法：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>☕️
int max;
if (a &gt; b) {
    max = a;
} else {
    max = b;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 Kotlin 中，这么写当然也可以，不过，Kotlin 中 <code>if</code> 语句还可以作为一个表达式赋值给变量：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
       👇
val max = if (a &gt; b) a else b

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>另外，Kotlin 中弃用了三元运算符（条件 ? 然后 : 否则），不过我们可以使用 <code>if/else</code> 来代替它。</p><p>上面的 <code>if/else</code> 的分支中是一个变量，其实还可以是一个代码块，代码块的最后一行会作为结果返回：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
val max = if (a &gt; b) {
    println(&quot;max:a&quot;)
    a // 👈 返回 a
} else {
    println(&quot;max:b&quot;)
    b // 👈 返回 b
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="when" tabindex="-1"><a class="header-anchor" href="#when" aria-hidden="true">#</a> <code>when</code></h3><p>在 Java 中，用 <code>switch</code> 语句来判断一个变量与一系列值中某个值是否相等：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>☕️
switch (x) {
    case 1: {
        System.out.println(&quot;1&quot;);
        break;
    }
    case 2: {
        System.out.println(&quot;2&quot;);
        break;
    }
    default: {
        System.out.println(&quot;default&quot;);
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 Kotlin 中变成了 <code>when</code>：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
👇
when (x) {
   👇
    1 -&gt; { println(&quot;1&quot;) }
    2 -&gt; { println(&quot;2&quot;) }
   👇
    else -&gt; { println(&quot;else&quot;) }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里与 Java 相比的不同点有：</p><ul><li>省略了 <code>case</code> 和 <code>break</code>，前者比较好理解，后者的意思是 Kotlin 自动为每个分支加上了 <code>break</code> 的功能，防止我们像 Java 那样写错</li><li>Java 中的默认分支使用的是 <code>default</code> 关键字，Kotlin 中使用的是 <code>else</code></li></ul><p>与 <code>if/else</code> 一样，<code>when</code> 也可以作为表达式进行使用，分支中最后一行的结果作为返回值。需要注意的是，这时就必须要有 <code>else</code> 分支，使得无论怎样都会有结果返回，除非已经列出了所有情况：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
val value: Int = when (x) {
    1 -&gt; { x + 1 }
    2 -&gt; { x * 2 }
    else -&gt; { x + 5 }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 Java 中，当多种情况执行同一份代码时，可以这么写：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>☕️
switch (x) {
    case 1:
    case 2: {
        System.out.println(&quot;x == 1 or x == 2&quot;);
        break;
    }
    default: {
        System.out.println(&quot;default&quot;);
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>而 Kotlin 中多种情况执行同一份代码时，可以将多个分支条件放在一起，用 <code>,</code> 符号隔开，表示这些情况都会执行后面的代码：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
when (x) {
    👇
    1, 2 -&gt; print(&quot;x == 1 or x == 2&quot;)
    else -&gt; print(&quot;else&quot;)
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 <code>when</code> 语句中，我们还可以使用表达式作为分支的判断条件：</p><ul><li>使用 <code>in</code> 检测是否在一个区间或者集合中：</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
when (x) {
   👇
    in 1..10 -&gt; print(&quot;x 在区间 1..10 中&quot;)
   👇
    in listOf(1,2) -&gt; print(&quot;x 在集合中&quot;)
   👇 // not in
    !in 10..20 -&gt; print(&quot;x 不在区间 10..20 中&quot;)
    else -&gt; print(&quot;不在任何区间上&quot;)
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>或者使用 <code>is</code> 进行特定类型的检测：</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> 🏝️
 val isString = when(x) {
     👇
     is String -&gt; true
     else -&gt; false
 }

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>还可以省略 <code>when</code> 后面的参数，每一个分支条件都可以是一个布尔表达式：</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
when {
   👇
    str1.contains(&quot;a&quot;) -&gt; print(&quot;字符串 str1 包含 a&quot;)
   👇
    str2.length == 3 -&gt; print(&quot;字符串 str2 的长度为 3&quot;)
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当分支的判断条件为表达式时，哪一个条件先为 <code>true</code> 就执行哪个分支的代码块。</p><h3 id="for" tabindex="-1"><a class="header-anchor" href="#for" aria-hidden="true">#</a> <code>for</code></h3><p>我们知道 Java 对一个集合或数组可以这样遍历：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>☕️
int[] array = {1, 2, 3, 4};
for (int item : array) {
    ...
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>而 Kotlin 中 对数组的遍历是这么写的：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
val array = intArrayOf(1, 2, 3, 4)
          👇
for (item in array) {
    ...
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里与 Java 有几处不同：</p><ul><li>在 Kotlin 中，表示单个元素的 <code>item</code> ，不用显式的声明类型</li><li>Kotlin 使用的是 <code>in</code> 关键字，表示 <code>item</code> 是 <code>array</code> 里面的一个元素</li></ul><p>另外，Kotlin 的 <code>in</code> 后面的变量可以是任何实现 <code>Iterable</code> 接口的对象。</p><p>在 Java 中，我们还可以这么写 <code>for</code> 循环：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>☕️
for (int i = 0; i &lt;= 10; i++) {
    // 遍历从 0 到 10
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但 Kotlin 中没有这样的写法，那应该怎样实现一个 0 到 10 的遍历呢？</p><p>其实使用上面讲过的区间就可以实现啦，代码如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
for (i in 0..10) {
    println(i)
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="try-catch" tabindex="-1"><a class="header-anchor" href="#try-catch" aria-hidden="true">#</a> <code>try-catch</code></h3><p>关于 <code>try-catch</code> 我们都不陌生，在平时开发中难免都会遇到异常需要处理，那么在 Kotlin 中是怎样处理的呢，先来看下 Kotlin 中捕获异常的代码：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
try {
    ...
}
catch (e: Exception) {
    ...
}
finally {
    ...
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以发现 Kotlin 异常处理与 Java 的异常处理基本相同，但也有几个不同点：</p><ul><li>我们知道在 Java 中，调用一个抛出异常的方法时，我们需要对异常进行处理，否则就会报错：</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>☕️
public class User{
   void sayHi() throws IOException {
   }
   void test() {
    sayHi();
    // 👆 IDE 报错，Unhandled exception: java.io.IOException
   }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但在 Kotlin 中，调用上方 <code>User</code> 类的 <code>sayHi</code> 方法时：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
val user = User()
user.sayHi() // 👈 正常调用，IDE 不会报错，但运行时会出错

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为什么这里不会报错呢？因为 Kotlin 中的异常是不会被检查的，只有在运行时如果 <code>sayHi</code> 抛出异常，才会出错。</p><ul><li>Kotlin 中 <code>try-catch</code> 语句也可以是一个表达式，允许代码块的最后一行作为返回值：</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
       👇       
val a: Int? = try { parseInt(input) } catch (e: NumberFormatException) { null }

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="和" tabindex="-1"><a class="header-anchor" href="#和" aria-hidden="true">#</a> <code>?.</code> 和 <code>?:</code></h3><p>我们在之前的文章中已经讲过 Kotlin 的空安全，其实还有另外一个常用的复合符号可以让你在判空时更加方便，那就是 Elvis 操作符 <code>?:</code> 。</p><p>我们知道空安全调用 <code>?.</code>，在对象非空时会执行后面的调用，对象为空时就会返回 <code>null</code>。如果这时将该表达式赋值给一个不可空的变量：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
val str: String? = &quot;Hello&quot;
var length: Int = str?.length
//                👆 ，IDE 报错，Type mismatch. Required:Int. Found:Int?

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>报错的原因就是 <code>str</code> 为 null 时我们没有值可以返回给 <code>length</code></p><p>这时就可以使用 Kotlin 中的 Elvis 操作符 <code>?:</code> 来兜底：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
val str: String? = &quot;Hello&quot;
                             👇
val length: Int = str?.length ?: -1

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>它的意思是如果左侧表达式 <code>str?.length</code> 结果为空，则返回右侧的值 <code>-1</code>。</p><p>Elvis 操作符还有另外一种常见用法，如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
fun validate(user: User) {
    val id = user.id ?: return // 👈 验证 user.id 是否为空，为空时 return 
}

// 等同于

fun validate(user: User) {
    if (user.id == null) {
        return
    }
    val id = user.id
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>看到这里，想必你对 Kotlin 的空安全有了更深入的了解了，下面我们再看看 Kotlin 的相等比较符。</p><h3 id="和-1" tabindex="-1"><a class="header-anchor" href="#和-1" aria-hidden="true">#</a> <code>==</code> 和 <code>===</code></h3><p>我们知道在 Java 中，<code>==</code> 比较的如果是基本数据类型则判断值是否相等，如果比较的是 <code>String</code> 则表示引用地址是否相等， <code>String</code> 字符串的内容比较使用的是 <code>equals()</code> ：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>☕️
String str1 = &quot;123&quot;, str2 = &quot;123&quot;;
System.out.println(str1.equals(str2));
System.out.println(str1 == str2); 

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Kotlin 中也有两种相等比较方式：</p><ul><li><code>==</code> ：可以对基本数据类型以及 <code>String</code> 等类型进行内容比较，相当于 Java 中的 <code>equals</code></li><li><code>===</code> ：对引用的内存地址进行比较，相当于 Java 中的 <code>==</code></li></ul><p>可以发现，Java 中的 <code>equals</code> ，在 Kotlin 中与之相对应的是 <code>==</code>，这样可以使我们的代码更加简洁。</p><p>下面再来看看代码示例：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>🏝️
val str1 = &quot;123&quot;
val str2 = &quot;123&quot;
println(str1 == str2) // 👈 内容相等，输出：true

val str1= &quot;字符串&quot;
val str2 = str1
val str3 = str1
print(str2 === str3) // 👈 引用地址相等，输出：true

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实 Kotlin 中的 <code>equals</code> 函数是 <code>==</code> 的操作符重载，关于操作符重载，这里先不讲，之后的文章会讲到。</p><h2 id="练习题" tabindex="-1"><a class="header-anchor" href="#练习题" aria-hidden="true">#</a> 练习题</h2><ol><li>请按照以下要求实现一个 <code>Student</code> 类：</li></ol><ul><li>写出三个构造器，其中一个必须是主构造器</li><li>主构造器中的参数作为属性</li><li>写一个普通函数 <code>show</code>，要求通过字符串模板输出类中的属性</li></ul><ol start="2"><li>编写程序，使用今天所讲的操作符，找出集合 {21, 40, 11, 33, 78} 中能够被 3 整除的所有元素，并输出。</li></ol><h2 id="作者介绍" tabindex="-1"><a class="header-anchor" href="#作者介绍" aria-hidden="true">#</a> 作者介绍</h2><h3 id="视频作者" tabindex="-1"><a class="header-anchor" href="#视频作者" aria-hidden="true">#</a> 视频作者</h3><h4 id="扔物线-朱凯" tabindex="-1"><a class="header-anchor" href="#扔物线-朱凯" aria-hidden="true">#</a> 扔物线（朱凯）</h4>`,272),u=e("li",null,"码上开学创始人、项目管理人、内容模块规划者和视频内容作者。",-1),o={href:"https://developers.google.com/experts/people/kai-zhu?ref=rengwuxian.com",target:"_blank",rel:"noopener noreferrer"},m={href:"https://github.com/rengwuxian?ref=rengwuxian.com",target:"_blank",rel:"noopener noreferrer"},b={href:"https://github.com/rengwuxian/MaterialEditText/?ref=rengwuxian.com",target:"_blank",rel:"noopener noreferrer"},p=e("li",null,"曾多次在 Google Developer Group Beijing 线下分享会中担任 Android 部分的讲师。",-1),g={href:"https://gank.io/post/560e15be2dca930e00da1083?ref=rengwuxian.com",target:"_blank",rel:"noopener noreferrer"},x={href:"https://hencoder.com/?ref=rengwuxian.com",target:"_blank",rel:"noopener noreferrer"},h={href:"https://plus.hencoder.com/?ref=rengwuxian.com",target:"_blank",rel:"noopener noreferrer"},q=e("h3",{id:"文章作者",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#文章作者","aria-hidden":"true"},"#"),n(" 文章作者")],-1),f=e("h4",{id:"sinyu-沈新宇",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#sinyu-沈新宇","aria-hidden":"true"},"#"),n(" Sinyu（沈新宇）")],-1),S={href:"https://github.com/sinyu1012?ref=rengwuxian.com",target:"_blank",rel:"noopener noreferrer"},k=e("h2",{id:"版权声明",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#版权声明","aria-hidden":"true"},"#"),n(" 版权声明")],-1),w={href:"https://rengwuxian.com/kotlin-basic-3/",target:"_blank",rel:"noopener noreferrer"},y=e("p",null,"微信公众号：扔物线",-1),_=e("p",null,"转载时请保留此声明",-1),K=e("h5",{id:"分享文章",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#分享文章","aria-hidden":"true"},"#"),n(" 分享文章")],-1),I={href:"https://rengwuxian.com/kotlin-basic-3/",target:"_blank",rel:"noopener noreferrer"};function H(E,A){const i=l("ExternalLinkIcon");return s(),r("div",null,[v,e("ul",null,[u,e("li",null,[e("a",o,[n("Android GDE"),d(i)]),n("（ Google 认证 Android 开发专家），前 Flipboard Android 工程师。")]),e("li",null,[n("GitHub 全球 Java 排名第 92 位，在 "),e("a",m,[n("GitHub"),d(i)]),n(" 上有 6.6k followers 和 9.9k stars。")]),e("li",null,[n("个人的 Android 开源库 "),e("a",b,[n("MaterialEditText"),d(i)]),n(" 被全球多个项目引用，其中包括在全球拥有 5 亿用户的新闻阅读软件 Flipboard 。")]),p,e("li",null,[n("个人技术文章《"),e("a",g,[n("给 Android 开发者的 RxJava 详解"),d(i)]),n("》发布后，在国内多个公司和团队内部被转发分享和作为团队技术会议的主要资料来源，以及逆向传播到了美国一些如 Google 、 Uber 等公司的部分华人团队。")]),e("li",null,[n("创办的 Android 高级进阶教学网站 "),e("a",x,[n("HenCoder"),d(i)]),n(" 在全球华人 Android 开发社区享有相当的影响力。")]),e("li",null,[n("之后创办 Android 高级开发教学课程 "),e("a",h,[n("HenCoder Plus"),d(i)]),n(" ，学员遍布全球，有来自阿里、头条、华为、腾讯等知名一线互联网公司，也有来自中国台湾、日本、美国等地区的资深软件工程师。")])]),q,f,e("p",null,[e("a",S,[n("Sinyu（沈新宇）"),d(i)]),n(" ，即刻 Android 工程师。2019 年加入即刻，参与即刻 6.0 的产品迭代，以及负责中台基础建设。独立开发并运营过一款用户过万的 App。")]),k,e("blockquote",null,[e("p",null,[n("本文首发于："),e("a",w,[n("https://rengwuxian.com/kotlin-basic-3/"),d(i)])]),y,_]),K,e("p",null,[n("本文转自 "),e("a",I,[n("https://rengwuxian.com/kotlin-basic-3/"),d(i)]),n("，如有侵权，请联系删除。")])])}const U=a(c,[["render",H],["__file","Kotlinlinaxiegengfangbiande.html.vue"]]);export{U as default};
