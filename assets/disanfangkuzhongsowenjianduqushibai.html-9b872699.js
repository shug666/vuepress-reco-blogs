import{_ as i,o as e,c as a,a as s}from"./app-668506b4.js";const n={},d=s(`<h2 id="第一种方法" tabindex="-1"><a class="header-anchor" href="#第一种方法" aria-hidden="true">#</a> 第一种方法</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>1. 将需要调用的libSpiDevice.so放到/system/lib下
2. 运行程序发现报错,百度一查说是要把改so库的名字写到/system/etc/public.libraries.txt,这个文件里
3. adb pull出来,修改,adb push进去,重启;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重点来了:将libSpiDevice.so加到public.libraries.txt这个文件时,注意要换行,换行,换行!!!,否则push到系统中是识别不到的,cat public.libraries.txt,会发现根本没有刚添加的字段…这就是没有换行.所以,记得换行,换行,换行. <img src="https://raw.githubusercontent.com/shug666/image/main/images/20200314142212389.png" alt="在这里插入图片描述"></p><h2 id="第二种方法" tabindex="-1"><a class="header-anchor" href="#第二种方法" aria-hidden="true">#</a> 第二种方法</h2><p>使用Android studio的话，你直接把libxxxx.so放入jniLibs/armxxxxx/下就可以了，编译后就会自动帮你打包在apk里面，另外我看你app下有jni这个目录，应该是你自己创建的，这样在jni里执行了ndk-build后，会在app目录下产生两个临时文件夹libs和obj，这两个文件夹在Android Studio里面没用，因为Android studio不像eclipse那样把libs里的so打包到apk，而是默认使用了jniLibs目录。如果你非要让Android studio把app/libs的库打包到apk里，也是可以做到的，要自己编辑build.gradle文件来完成</p>`,5),t=[d];function r(l,o){return e(),a("div",null,t)}const u=i(n,[["render",r],["__file","disanfangkuzhongsowenjianduqushibai.html.vue"]]);export{u as default};
