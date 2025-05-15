import{_ as d,r,o as n,c as s,b as a,d as e,e as l,a as o}from"./app-e8f85126.js";const c={},t=o(`<h2 id="_1-allmod" tabindex="-1"><a class="header-anchor" href="#_1-allmod" aria-hidden="true">#</a> 1. allmod</h2><ul><li><strong>功能</strong>：列出 Android 源码树中所有可用的编译模块。这些模块可以是应用程序、库、测试用例等。</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ allmod
ACameraNdkVendorTest
ACameraNdkVendorTest_32
AImageReaderWindowHandleTest
AImageReaderWindowHandleTest_32
AMRWBEncTest
AMRWBEncTest_32
ANGLE
ATT_profile1.xml
ATT_profile2.xml
ATT_profile3.xml
ATT_profile4.xml
ATT_profile5.xml
ATT_profile6.xml
ATT_profiles.xml
AVCUtilsUnitTest
AVCUtilsUnitTest_32
AaptAutoVersionTest
AaptBasicTest
AaptSymlinkTest
<span class="token comment"># ... 59000+ in total</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-gomod" tabindex="-1"><a class="header-anchor" href="#_2-gomod" aria-hidden="true">#</a> 2. gomod</h2><ul><li><strong>功能</strong>：切换到包含指定模块（如 <code>CarService</code>）的源码目录。</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ gomod CarService
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="_3-pathmod" tabindex="-1"><a class="header-anchor" href="#_3-pathmod" aria-hidden="true">#</a> 3. pathmod</h2><ul><li><strong>功能</strong>：获取指定模块（如 <code>CarService</code>）的源码所在目录。</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ pathmod CarService
/android/packages/services/Car/service
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-outmod" tabindex="-1"><a class="header-anchor" href="#_4-outmod" aria-hidden="true">#</a> 4. outmod</h2><ul><li><strong>功能</strong>：获取指定模块（如 <code>CarService</code>）编译后的输出文件的位置。这些输出文件通常包括 APK、共享库、优化后的字节码文件等。</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ outmod CarService
/android/out/target/product/proj/system/priv-app/CarService/CarService.apk
/android/out/target/product/proj/system/priv-app/CarService/lib/arm64/libcarservicejni.so
/android/out/target/product/proj/system/priv-app/CarService/oat/arm64/CarService.odex
/android/out/target/product/proj/system/priv-app/CarService/oat/arm64/CarService.vdex
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-godir" tabindex="-1"><a class="header-anchor" href="#_5-godir" aria-hidden="true">#</a> 5. godir</h2><p><strong>功能</strong>：切换到包含指定文件（如 <code>one_source_file_name.cpp</code>）的目录。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ godir one_source_file_name.cpp
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="_6-dirmods" tabindex="-1"><a class="header-anchor" href="#_6-dirmods" aria-hidden="true">#</a> 6. dirmods</h2><ul><li><strong>功能</strong>：获取指定目录中定义的所有编译模块。</li></ul><h2 id="_7-refreshmod" tabindex="-1"><a class="header-anchor" href="#_7-refreshmod" aria-hidden="true">#</a> 7. refreshmod</h2><ul><li><strong>功能</strong>：刷新 <code>allmod</code>、<code>gomod</code>、<code>pathmod</code>、<code>outmod</code> 和 <code>installmod</code> 命令使用的模块列表。</li></ul><h2 id="_8-sepgrep" tabindex="-1"><a class="header-anchor" href="#_8-sepgrep" aria-hidden="true">#</a> 8. sepgrep</h2><ul><li><strong>功能</strong>：在所有本地的 <code>sepolicy</code> 文件中进行全局搜索。<code>sepolicy</code>（SELinux Policy）文件用于定义 Android 系统的安全策略。</li></ul><h2 id="_9-cgrep" tabindex="-1"><a class="header-anchor" href="#_9-cgrep" aria-hidden="true">#</a> 9. cgrep</h2><ul><li><strong>功能</strong>：在所有本地的 C/C++ 文件中进行全局搜索。</li></ul><h2 id="_10-mgre" tabindex="-1"><a class="header-anchor" href="#_10-mgre" aria-hidden="true">#</a> 10. mgre</h2><ul><li><strong>功能</strong>：在所有本地的 <code>Makefile</code> 和 <code>.bp</code>（Blueprints）文件中进行全局搜索。<code>Makefile</code> 用于传统的 Make 构建系统，而 <code>.bp</code> 文件用于 Soong 构建系统。</li></ul><h2 id="_11-syswrite" tabindex="-1"><a class="header-anchor" href="#_11-syswrite" aria-hidden="true">#</a> 11. syswrite</h2><ul><li><strong>功能</strong>：将系统分区（如 <code>system.img</code>）重新挂载为可写模式，如果需要则重启设备。</li></ul>`,27),m={href:"https://blog.csdn.net/yinminsumeng/article/details/143112163",target:"_blank",rel:"noopener noreferrer"};function u(v,h){const i=r("ExternalLinkIcon");return n(),s("div",null,[t,a("p",null,[e("本文转自 "),a("a",m,[e("https://blog.csdn.net/yinminsumeng/article/details/143112163"),l(i)]),e("，如有侵权，请联系删除。")])])}const g=d(c,[["render",u],["__file","yuanmabianyimingling.html.vue"]]);export{g as default};
