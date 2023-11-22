import{_ as s,r as a,o as r,c,b as e,d as n,e as d,a as l}from"./app-f541e591.js";const t={},v=l(`<h2 id="一、android-mk文件的作用" tabindex="-1"><a class="header-anchor" href="#一、android-mk文件的作用" aria-hidden="true">#</a> 一、Android.mk文件的作用</h2><p>Android.mk是Android工程管理文件，类似于编译文件的说明书，用来向编译系统描述源代码，并将源文件分组为模块（包括静态库、共享库、独立可执行文件）。Android.mk会被编译系统解析一次或多次，可以在每一个Android.mk文件中定义一个或多个模块，也可以多个模块使用同一个 .mk 文件。</p><h2 id="二、最基础的android-mk构成" tabindex="-1"><a class="header-anchor" href="#二、最基础的android-mk构成" aria-hidden="true">#</a> 二、最基础的Android.mk构成</h2><p><strong>Android.mk文件必须先定义LOCAL_PATH变量</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>##源文件在开发树中的位置, 表示当前模块位置的变量
#宏函数my-dir 返回当前文件所在的路径， 
LOCAL_PATH := $(call my-dir)  

#CLEAR_VAR变量指向一个特殊的Makefile
#清除了LOCAL_PATH变量之外的 LOCAL_XXX 变量,如：LOCAL_SRC_FILES,LOCAL_MODULE,LOCAL_STATIC_LIBRARIES
include $(CLEAR_VARS)  

# 需要编译的文件，可以是单个源文件，也可以是一个文件夹
LOCAL_SRC_FILES := hello-jni.c

#构建的模块的名称，名称必须唯一，不能有任何空格，生成最终共享库文件时会添加其前缀lib及后缀.so,如libhello-jni.so
LOCAL_MODULE    := hello-jni    

#通过include $(BUILD_SHARED_LIBRARY)编译工具，将BUILD_SHARED_LIBRARY变量指向一个makefile脚本，该脚本根据最近include以来在LOCAL_XXX变量中定义的所有信息。此脚本确定要构建的内容以及构建方式。
include $(BUILD_SHARED_LIBRARY)  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、模块" tabindex="-1"><a class="header-anchor" href="#三、模块" aria-hidden="true">#</a> 三、模块</h2><p><strong>oid.mk中我们把以<code>include $(CLEAR_VARS)</code>标记开头，到<code>include $(BUILD_XXX)</code>标记结束，这中间描述的所有行为，称为一个模块。</strong></p><p>例如：下列mk中包含了，两个模块。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PATH:= $(call my-dir)
include $(CLEAR_VARS)

LOCAL_SRC_FILES := \\
        $(call all-logtags-files-under, src)

LOCAL_MODULE := settings-logtags
# 构建一个 java 类库
include $(BUILD_STATIC_JAVA_LIBRARY)
-------------------------------------------------------
include $(CLEAR_VARS)

LOCAL_PACKAGE_NAME := Settings
#省略其它描述...
LOCAL_USE_AAPT2 := true

LOCAL_SRC_FILES := $(call all-java-files-under, src)

LOCAL_STATIC_ANDROID_LIBRARIES := \\
    androidx-constraintlayout_constraintlayout \\
#省略其它描述...
include frameworks/base/packages/SettingsLib/common.mk
include frameworks/base/packages/SettingsLib/search/common.mk
# 构建一个apk文件
include $(BUILD_PACKAGE)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="四、include变量" tabindex="-1"><a class="header-anchor" href="#四、include变量" aria-hidden="true">#</a> 四、include变量</h2><p><strong>CLEAR_VARS</strong></p><p><strong>用于取消位于<code>include $(CLEAR_VARS)</code>之前定义的所有的LOCAL_XXX变量中定义的值，但是LOCAL_PATH中定义的值不会被取消。在描述新的模块前，需要用include包含此变量。</strong></p><ul><li><code>include $(BUILD_SHARED_LIBRARY)</code> 编译成动态库（共享库）</li><li><code>include $(BUILD_STATIC_LIBRARIES)</code>编译成native静态库。</li><li><code>include $(BUILD_JAVA_LIBRARY)</code>编译成共享JAVA库，是在静态库的基础上进一步打包成的.dex文件，众所周知，dex是在android系统上所使用的文件格式。</li></ul><p><a data-fancybox title="img" href="https://img-blog.csdnimg.cn/img_convert/c4642de59aa78d4d4a9dc18df070315a.png"><img src="https://cdn.jsdelivr.net/gh/shug666/image/images/c4642de59aa78d4d4a9dc18df070315a.png" alt="img"></a></p><ul><li><code>include $(BUILD_STATIC_JAVA_LIBRARY)</code>编译成静态java库，该类库中代码会以class文件的形式存在，它在任何一个JAVA虚拟机上都可以运行</li><li><code>include $(BUILD_MULTI_PREBUILT)</code>用于编译预制库，这些库一般可以指定在lib文件夹下。</li><li><code>include $(BUILD_PREBUILT)</code> 这种方式把文件当成编译项目。</li><li><code>include $(BUILD_PACKAGE)</code>用于编译Android 应用程序安装包。</li><li><code>include $(BUILD_EXECUTABLE)</code> 编译成可执行程序</li></ul><h2 id="五、模块描述变量" tabindex="-1"><a class="header-anchor" href="#五、模块描述变量" aria-hidden="true">#</a> 五、模块描述变量</h2><p><strong>LOCAL_PATH</strong></p><p>此变量用于指定当前文件的路径。必须在 <code>Android.mk</code> 文件开头定义此变量。以下示例演示了如何定义此变量：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PATH := $(call my-dir)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><code>CLEAR_VARS</code> 所指向的脚本不会清除此变量。因此，即使 <code>Android.mk</code> 文件描述了多个模块，也只需定义此变量一次。</p><p><strong>LOCAL_MODULE</strong></p><p>此变量用于设定模块的名称。指定的名称在所有模块名称中必须唯一，并且不得包含任何空格。必须先定义该名称，然后才能添加其它的脚本（<code>CLEAR_VARS</code> 的脚本除外）。如下定义在配合<code>include $(BUILD_STATIC_JAVA_LIBRARY)</code>使用时会编译时生成一个<code>libsettings-logtags</code>的类库，lib是编译时系统自动加上的。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_MODULE := settings-logtags
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>LOCAL_MODULE_FILENAME</strong></p><p>此变量能够替换构建系统为其生成的文件默认使用的名称。例如，如果 <code>LOCAL_MODULE</code> 的名称为 <code>settings-logtags</code>，你可以强制系统将其生成的文件命名为 <code>settingslib</code>。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_MODULE := settings-logtags
LOCAL_MODULE_FILENAME := settingslib
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>LOCAL_SRC_FILES</strong></p><p>此变量包含构建系统生成模块时所用的源文件列表。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_SRC_FILES := \\
        $(call all-logtags-files-under, src)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>LOCAL_PACKAGE_NAME</strong></p><p>此变量用于指定编译后生成的Android APK的名字。例如，如下方式，会生成一个Settings.apk的文件。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PACKAGE_NAME := Settings
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>LOCAL_CERTIFICATE</strong></p><p>此变量用于指定APK的签名方式。如果不指定，默认使用testkey签名。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_CERTIFICATE := platform
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>Android中共有四中签名方式：</strong></p><ul><li><strong>testkey：普通APK，默认使用该签名。</strong></li><li><strong>platform：该APK完成一些系统的核心功能。经过对系统中存在的文件夹的访问测试，这种方式编译出来的APK所在进程的UID为system。</strong></li><li><strong>shared：该APK需要和home/contacts进程共享数据。</strong></li><li><strong>media：该APK是media/download系统中的一环。</strong></li></ul><p><strong>LOCAL_PRODUCT_MODULE</strong></p><p>为true表示将此apk安装到priv-app目录下。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PRODUCT_MODULE := true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>LOCAL_SDK_VERSION</strong></p><p>标记SDK 的version 状态。取值范围有四个<code>current</code> <code>system_current</code> <code>test_current</code> <code>core_current</code> 。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_SDK_VERSION := current
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>LOCAL_PRIVATE_PLATFORM_APIS</strong></p><p>设置后，会使用sdk的hide的api來编译。编译的APK中使用了系统级API，必须设定该值。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PRIVATE_PLATFORM_APIS := true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>LOCAL_USE_AAPT2</strong></p><p>此值用于设定是否开启AAPT2打包APK，AAPT是Android Asset Packaging Tool的缩写，AAPT2在AAPT的基础做了优化。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_USE_AAPT2 := true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>LOCAL_STATIC_ANDROID_LIBRARIES</strong></p><p>此值用于设定依赖的静态Android库</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_STATIC_ANDROID_LIBRARIES := \\
    androidx-constraintlayout_constraintlayout \\
    androidx.slice_slice-builders \\
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>LOCAL_JAVA_LIBRARIES</strong></p><p>此值用于设定依赖的共享java类库。<code>LOCAL_JAVA_LIBRARIES</code>引用的外部Java库在编译时可以找到相关的东西，但并不打包到本模块，在runtime时需要从别的地方查找，这个别的地方就是在编译时将引用的外部Java库的模块名添加到<code>PRODUCT_BOOT_JARS</code>。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_JAVA_LIBRARIES := \\
    telephony-common \\
    ims-common
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>LOCAL_STATIC_JAVA_LIBRARIES</strong></p><p>此值用于设定依赖的静态java类库。<code>LOCAL_STATIC_JAVA_LIBRARIES</code>会把引用的外部Java库直接编译打包到本模块中，在runtime时可以直接从本模块中找到相关的jar。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_STATIC_JAVA_LIBRARIES := \\
    androidx-constraintlayout_constraintlayout-solver \\
    androidx.lifecycle_lifecycle-runtime \\
    androidx.lifecycle_lifecycle-extensions \\
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>LOCAL_PROGUARD_FLAG_FILES</strong></p><p>此值用于设定混淆的标志。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PROGUARD_FLAG_FILES := proguard.flags
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Android.mk中以LOCAL_XXX开头的描述变量非常多，这里只列举了一些常用的变量。</p><h2 id="六、函数宏" tabindex="-1"><a class="header-anchor" href="#六、函数宏" aria-hidden="true">#</a> 六、函数宏</h2><p>Android系统中提供了大量的宏函数，使用 <code>$(call &lt;function&gt;)</code> 可以对其进行求值，返回文本信息。</p><p><strong>my-dir</strong></p><p>这个宏返回最后包括的 makefile 的路径，<strong>通常是当前 <code>Android.mk</code> 的目录</strong>。<code>my-dir</code> 可用于在 <code>Android.mk</code> 文件开头定义 <code>LOCAL_PATH</code>。例如：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PATH := $(call my-dir)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>由于 GNU Make 的工作方式，这个宏实际返回的是构建系统解析构建脚本时包含的最后一个 makefile 的路径。因此，包括其他文件后就不应调用 <code>my-dir</code>。</p><p>例如：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PATH := $(call my-dir)
# ... declare one module
include $(LOCAL_PATH)/foo/\`Android.mk\`
LOCAL_PATH := $(call my-dir)
# ... declare another module
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里的问题在于，对 <code>my-dir</code> 的第二次调用将 <code>LOCAL_PATH</code> 定义为 <code>$PATH/foo</code>，而不是 <code>$PATH</code>，因为这是其最近的 include 所指向的位置。在 <code>Android.mk</code> 文件中的任何其他内容后指定额外的 include 可避免此问题。例如：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PATH := $(call my-dir)
# ... declare one module
LOCAL_PATH := $(call my-dir)
# ... declare another module
# extra includes at the end of the Android.mk file
include $(LOCAL_PATH)/foo/Android.mk
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果以这种方式构造文件不可行，请将第一个 <code>my-dir</code> 调用的值保存到另一个变量中。例如：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>MY_LOCAL_PATH := $(call my-dir)
LOCAL_PATH := $(MY_LOCAL_PATH)
# ... declare one module
include $(LOCAL_PATH)/foo/\`Android.mk\`
LOCAL_PATH := $(MY_LOCAL_PATH)#
 ... declare another module
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>几个常用的获取源文件的方法：</strong></p><ul><li><code>$(call all-java-files-under, src)</code> 获取指定目录下的所有 Java 文件。</li><li><code>$(call all-c-files-under, src) </code>获取指定目录下的所有 C 语言文件。</li><li><code>$(call all-Iaidl-files-under, src) </code>获取指定目录下的所有 AIDL 文件。</li><li><code>$(call all-makefiles-under, folder)</code>获取指定目录下的所有 Make 文件。</li></ul><h2 id="七、引入第三方库和androidx库-重要" tabindex="-1"><a class="header-anchor" href="#七、引入第三方库和androidx库-重要" aria-hidden="true">#</a> 七、引入第三方库和Androidx库（重要）</h2><p><strong>引入lib文件夹下的第三方库</strong></p><p>在实际开发中，我们经常需要在app中引入第三方的jar或aar，在Android.mk中，可以按照如下的方式描述：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PATH:= $(call my-dir)
include $(CLEAR_VARS)
# ...
LOCAL_STATIC_JAVA_LIBRARIES := \\
    contextualcards # 给引入的jar或aar 起一个别名
# ...
include $(BUILD_PACKAGE)
# ====  预制类库 ========================
include $(CLEAR_VARS)
LOCAL_PREBUILT_STATIC_JAVA_LIBRARIES := \\
    contextualcards:libs/contextualcards.aar # 指定contextualcards的实际路径
include $(BUILD_MULTI_PREBUILT)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>引入AndroidX库</strong></p><p>开发过程如果想要引入AndroidX的类库可以参考下面的方式编写。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PATH:= $(call my-dir)
include $(CLEAR_VARS)
# ...
LOCAL_STATIC_ANDROID_LIBRARIES := \\
    androidx-constraintlayout_constraintlayout \\
    androidx.appcompat_appcompat \\

LOCAL_STATIC_JAVA_LIBRARIES := \\
    androidx-constraintlayout_constraintlayout-solver \\
# ...
include $(BUILD_PAC
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的mk中主要是引入了<code>AndroidX</code>下的<code>appcompat</code>和<code>constraintlayout</code>库。其中<code>constraintlayout</code>不仅需要在<code>LOCAL_STATIC_ANDROID_LIBRARIES</code>引入<code>androidx-constraintlayout_constraintlayout</code>，还需要在<code>LOCAL_STATIC_JAVA_LIBRARIES</code>中引入<code>androidx-constraintlayout_constraintlayout-solver</code></p><blockquote><p>在控制台使用指令 <code>find prebuilts/sdk/ -name Android.bp|xargs grep &quot;name.*粗略的名字&quot;</code>查询类库的引入方式。使用之前需要先 # source build/envsetup.sh # lunch，不然无法执行find指令。 使用示例：<code>find prebuilts/sdk/ -name Android.bp|xargs grep &quot;name.*\`\`constraintlayout\`\`&quot;</code></p></blockquote><h2 id="八、参考『系统设置』的android-mk" tabindex="-1"><a class="header-anchor" href="#八、参考『系统设置』的android-mk" aria-hidden="true">#</a> 八、参考『系统设置』的Android.mk</h2><p>Android.mk的编写，我们很多时候可以参考系统中已有的Android.mk，例如下面给的就是Android R中系统设置的Android.mk。</p><blockquote><p>该mk的位于 packages/apps/Settings 下</p></blockquote><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PATH:= $(call my-dir)
include $(CLEAR_VARS)

LOCAL_SRC_FILES := \\
        $(call all-logtags-files-under, src)

LOCAL_MODULE := settings-logtags
# 构建一个 libsettings-logtags的静态java类库
include $(BUILD_STATIC_JAVA_LIBRARY)

# 构建一个Settings.apk
include $(CLEAR_VARS)

LOCAL_PACKAGE_NAME := Settings
LOCAL_PRIVATE_PLATFORM_APIS := true
LOCAL_CERTIFICATE := platform
LOCAL_PRODUCT_MODULE := true
LOCAL_PRIVILEGED_MODULE := true
LOCAL_REQUIRED_MODULES := privapp_whitelist_com.android.settings
LOCAL_MODULE_TAGS := optional
LOCAL_USE_AAPT2 := true

LOCAL_SRC_FILES := $(call all-java-files-under, src)

LOCAL_STATIC_ANDROID_LIBRARIES := \\
    androidx-constraintlayout_constraintlayout \\
    androidx.slice_slice-builders \\
    androidx.slice_slice-core \\
    androidx.slice_slice-view \\
    androidx.core_core \\
    androidx.appcompat_appcompat \\
    androidx.cardview_cardview \\
    androidx.preference_preference \\
    androidx.recyclerview_recyclerview \\
    com.google.android.material_material \\
    setupcompat \\
    setupdesign

LOCAL_JAVA_LIBRARIES := \\
    telephony-common \\
    ims-common

LOCAL_STATIC_JAVA_LIBRARIES := \\
    androidx-constraintlayout_constraintlayout-solver \\
    androidx.lifecycle_lifecycle-runtime \\
    androidx.lifecycle_lifecycle-extensions \\
    guava \\
    jsr305 \\
    settings-contextual-card-protos-lite \\
    settings-log-bridge-protos-lite \\
    contextualcards \\
    settings-logtags \\
    zxing-core-1.7

LOCAL_PROGUARD_FLAG_FILES := proguard.flags

ifneq ($(INCREMENTAL_BUILDS),)
    LOCAL_PROGUARD_ENABLED := disabled
    LOCAL_JACK_ENABLED := incremental
    LOCAL_JACK_FLAGS := --multi-dex native
endif

include frameworks/base/packages/SettingsLib/common.mk
include frameworks/base/packages/SettingsLib/search/common.mk

include $(BUILD_PACKAGE)

# ====  prebuilt library  ========================
include $(CLEAR_VARS)

LOCAL_PREBUILT_STATIC_JAVA_LIBRARIES := \\
    contextualcards:libs/contextualcards.aar
include $(BUILD_MULTI_PREBUILT)

# Use the following include to make our test apk.
ifeq (,$(ONE_SHOT_MAKEFILE))
include $(call all-makefiles-under,$(LOCAL_PATH))
endif
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="九、android-mk-与-makefile文件的区别" tabindex="-1"><a class="header-anchor" href="#九、android-mk-与-makefile文件的区别" aria-hidden="true">#</a> 九、android.mk 与 makefile文件的区别</h2><p>android.mk与makefile是一样的功能，只不过是一种特殊的“makefile”文件, 它是经过了android编译系统处理的，android.mk的格式就变得非常简单，且与普通的makefile文件书写格式不一样了，但这有利于为Android增加一个新的Component。</p><p>但android.mk文件最终还是要被android编译系统层层解析，转化为make命令能够读懂的格式，从而调用gcc编译器进行编译;</p><h2 id="十、android-mk的使用" tabindex="-1"><a class="header-anchor" href="#十、android-mk的使用" aria-hidden="true">#</a> 十、Android.mk的使用</h2><p><em><strong>*编译apk*</strong></em> 重点apk中的签名 和 apis</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PATH:=$(call my-dir)   #返回当前路径

include $(CLEAR_VARS)		  #清除除了LOCAL_PATH的，所有LACAL_开头的系统变量
LOCAL_SRC_FILE:=       #指定编译的文件 
CAL_PRIVATE_PLATFORM_APIS := true
LOCAL_CERTIFICATE := platform		
LOCAL_PACKAGE_NAME=ABC				#指定唯一的包名
include $(BUILD_PACKAGE)					#编译apk或者其他指定的文件
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em><strong>*编译静态库*</strong></em></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PATH := $(call my-dir) 

include $(CLEAR_VARS)  
LOCAL_MODULE = libhellos  
LOCAL_CFLAGS = $(L_CFLAGS)  
LOCAL_SRC_FILES = hellos.c  
LOCAL_C_INCLUDES = $(INCLUDES)  
LOCAL_SHARED_LIBRARIES := libcutils  
LOCAL_COPY_HEADERS_TO := libhellos  
LOCAL_COPY_HEADERS := hellos.h  
include $(BUILD_STATIC_LIBRARY)  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em><strong>*编译动态库*</strong></em></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PATH := $(call my-dir)  

include $(CLEAR_VARS)  
LOCAL_MODULE = libhellod  
LOCAL_SRC_FILES = hellod.c  
LOCAL_C_INCLUDES = $(INCLUDES)  
LOCAL_SHARED_LIBRARIES := libcutils  
LOCAL_SHARED_LIBRARIES := libcutils  #链接时需要的外部库
LOCAL_LDLIBS += -ldl  
LOCAL_CFLAGS := $(L_CFLAGS)  		#需要包含的头文件目录
LOCAL_COPY_HEADERS_TO := libhellod  
LOCAL_COPY_HEADERS := hellod.h  
include $(BUILD_SHARED_LIBRARY)  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em><strong>*使用静态库*</strong></em></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PATH := $(call my-dir)  

include $(CLEAR_VARS)  
LOCAL_MODULE := hellos  
LOCAL_STATIC_LIBRARIES := libhellos  
LOCAL_SHARED_LIBRARIES :=  
LOCAL_LDLIBS += -ldl  
LOCAL_CFLAGS := $(L_CFLAGS)  
LOCAL_SRC_FILES := mains.c  
LOCAL_C_INCLUDES := $(INCLUDES)  
include $(BUILD_EXECUTABLE)  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em><strong>*使用动态库*</strong></em></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)  
LOCAL_MODULE := hellod  
LOCAL_MODULE_TAGS := debug  
LOCAL_SHARED_LIBRARIES := libc libcutils libhellod  
LOCAL_LDLIBS += -ldl  
LOCAL_CFLAGS := $(L_CFLAGS)  
LOCAL_SRC_FILES := maind.c  
LOCAL_C_INCLUDES := $(INCLUDES)  
include $(BUILD_EXECUTABLE)  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em><strong>*拷贝文件到指定目录*</strong></em></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)
LOCAL_MODULE := bt_vendor.conf
LOCAL_MODULE_CLASS := ETC
LOCAL_MODULE_PATH := $(TARGET_OUT)/etc/bluetooth
LOCAL_MODULE_TAGS := eng
LOCAL_SRC_FILES := $(LOCAL_MODULE)
include $(BUILD_PREBUILT)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em><strong>*拷贝动态库到指定目录*</strong></em></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)
\\#the data or lib you want to copy
LOCAL_MODULE := libxxx.so
LOCAL_MODULE_CLASS := SHARED_LIBRARIES
LOCAL_MODULE_PATH := $(ANDROID_OUT_SHARED_LIBRARIES)
LOCAL_SRC_FILES := lib/$(LOCAL_MODULE )
OVERRIDE_BUILD_MODULE_PATH := 	$(TARGET_OUT_INTERMEDIATE_LIBRARIES)
include $(BUILD_PREBUILT)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_MODULE_TAGS :=optional	

user: 指该模块只在user版本下才编译
eng: 指该模块只在eng版本下才编译
tests: 指该模块只在tests版本下才编译
optional:指该模块在所有版本下都编译
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上是Android.mk的基本组成，当然除了apk的编译，其他的并不是最基本的，目前我只用到了apk和动态库和静态库的编译，一些系统变量和函数，要根据你实际的使用来选择，如果以后遇到不懂得函数和系统变量可以自行查阅文档。</p><h2 id="项目中怎么编译" tabindex="-1"><a class="header-anchor" href="#项目中怎么编译" aria-hidden="true">#</a> 项目中怎么编译</h2><p>在之前的JNI的使用中，Android.mk 文件位于项目 jni/ 目录的子目录中，可以通过ndk-build 脚本进行编译。</p><p>在我们的项目管理里面，需要进入kernel/android/R(对应版本11)：</p><p><strong>1、执行source build/envsetup.sh 脚本</strong></p><p><strong>2、lunch搭建环境，定义Product和编译过程中用到的全局变量。</strong></p><p><strong>3、使用mm或者mmm + 文件路径（vendor/toptech/apps/JNITest/） 编译</strong></p><p><strong>4、生成的apk文件在out\\target\\product\\Ateko\\system\\app\\SHUGAN（对应LOCAL_PACKAGE_NAME）目录下</strong></p><p><strong>5、编译成功后的一些文件（如Androidfest文件）在out\\target\\common\\obj\\APPS\\SHUGAN_intermediates目录下</strong></p><p><em><strong>*跑完之后生成apk文件，拷到U盘上就可以在TV上安装了。*</strong></em></p><p><a data-fancybox title="image-20220802160511441" href="https://s2.loli.net/2022/08/17/8wvh7qjVbzkYLNs.png"><img src="https://s2.loli.net/2022/08/17/8wvh7qjVbzkYLNs.png" alt="image-20220802160511441"></a></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PATH，          当前路径，必须定义。
LOCAL_PACKAGE_NAME，  必须定义，package的名字，这个名字在脚本中将标识app或package。
LOCAL_MODULE_SUFFIX， 不用定义，module的后缀，=.apk。
LOCAL_MODULE，        不用定义，=$(LOCAL_PACKAGE_NAME)。
LOCAL_JAVA_RESOURCE_DIRS，     不用定义。
LOCAL_JAVA_RESOURCE_FILES，    不用定义。
LOCAL_MODULE_CLASS，  不用定义。
LOCAL_MODULE_TAGS，   可选定义。默认optional。取值范围user debug eng tests optional samples shell_ash shell_mksh。
LOCAL_ASSET_DIR，     可选定义，推荐不定义。默认$(LOCAL_PATH)/assets
LOCAL_RESOURCE_DIR，  可选定义，推荐不定义。默认product package和device package相应的res路径和$(LOCAL_PATH)/res。
LOCAL_PROGUARD_ENABLED，       可选定义，默认为full，如果是user或userdebug。取值full, disabled, custom。
LOCAL_MANIFEST_FILE，        不用定义，=$(LOCAL_PATH)/AndroidManifest.xml。
LOCAL_EXPORT_PACKAGE_RESOURCES，    可选定义，默认null。如果允许app的资源被其它模块使用，则设置true。
LOCAL_CERTIFICATE，   可选定义，默认为testkey。最终
private_key := $(LOCAL_CERTIFICATE).pk8
certificate := $(LOCAL_CERTIFICATE).x509.pem
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,120),u={href:"https://www.jianshu.com/p/8aabfbbb18c3",target:"_blank",rel:"noopener noreferrer"},o={href:"https://blog.csdn.net/zcjxaiofeizhu/article/details/124402351",target:"_blank",rel:"noopener noreferrer"},m=l(`<p><strong>如果material报错则需要去掉该主题风格</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PATH:= $(call my-dir)
include $(CLEAR_VARS)
	
LOCAL_STATIC_ANDROID_LIBRARIES := \\
	com.google.android.material_material \\
	androidx-constraintlayout_constraintlayout \\
	androidx.appcompat_appcompat \\
#	android-support-v7-appcompat \\
	
	
LOCAL_STATIC_JAVA_LIBRARIES := \\
    androidx-constraintlayout_constraintlayout-solver \\
	
LOCAL_MODULE_TAGS := optional
LOCAL_PACKAGE_NAME := SHUGAN
LOCAL_SRC_FILES := $(call all-java-files-under, src)
#LOCAL_RESOURCE_DIR := $(LOCAL_PATH)/res
#LOCAL_MANIFEST_FILE := $(LOCAL_PATH)/AndroidManifest.xml
LOCAL_PRIVATE_PLATFORM_APIS := true
LOCAL_CERTIFICATE := platform

include $(BUILD_PACKAGE)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2);function A(L,_){const i=a("ExternalLinkIcon");return r(),c("div",null,[v,e("p",null,[e("a",u,[n("Android.mk编译生成apk模板"),d(i)])]),e("p",null,[e("a",o,[n("Android源码目录"),d(i)])]),m])}const p=s(t,[["render",A],["__file","AndroidMK.html.vue"]]);export{p as default};
