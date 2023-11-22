import{_ as e,r as i,o as t,c as l,b as a,d as n,e as c,a as d}from"./app-f541e591.js";const p={},u=d(`<h2 id="_1、给app设置home属性" tabindex="-1"><a class="header-anchor" href="#_1、给app设置home属性" aria-hidden="true">#</a> 1、给APP设置HOME属性</h2><p>将自己开发的APP设置为主界面Launcher，需要添加如下属性：</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>category</span> <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>android.intent.category.HOME<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>application</span>
        <span class="token attr-name"><span class="token namespace">android:</span>allowBackup</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span>
        <span class="token attr-name"><span class="token namespace">android:</span>icon</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>@mipmap/ic_launcher<span class="token punctuation">&quot;</span></span>
        <span class="token attr-name"><span class="token namespace">android:</span>label</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>@string/app_name<span class="token punctuation">&quot;</span></span>
        <span class="token attr-name"><span class="token namespace">android:</span>supportsRtl</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span>
        <span class="token attr-name"><span class="token namespace">android:</span>theme</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>@style/AppTheme<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>activity</span> <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>.MainActivity<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>intent-filter</span><span class="token punctuation">&gt;</span></span>
                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>action</span> <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>android.intent.action.MAIN<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>

                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>category</span> <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>android.intent.category.LAUNCHER<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>category</span> <span class="token attr-name"><span class="token namespace">android:</span>name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>android.intent.category.HOME<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>intent-filter</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>activity</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2、给app设置system属性" tabindex="-1"><a class="header-anchor" href="#_2、给app设置system属性" aria-hidden="true">#</a> 2、给APP设置system属性</h2><p>设置app system的属性：</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code>android:sharedUserId=&quot;android.uid.system&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="_3、给app签名" tabindex="-1"><a class="header-anchor" href="#_3、给app签名" aria-hidden="true">#</a> 3、给APP签名</h2><p>为了设置system属性，就需要对app进行签名：<br><img src="https://raw.githubusercontent.com/shug666/image/main/images/357f8c8a3f394329b9081fcd8b07d42c.png" alt="在这里插入图片描述"></p><p>编译app并安装到开发板，重新启动开发板，在进入桌面的阶段，会让我们选择要启动的Launcher：默认的Launcher3和我们添加的Launcher。</p><h2 id="_4、内置apk" tabindex="-1"><a class="header-anchor" href="#_4、内置apk" aria-hidden="true">#</a> 4、内置APK</h2><p><strong>这里以HiTvLauncher为例，然后将需要内置apk放入到其中，并写好配置文件</strong></p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code>LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)

LOCAL_MODULE_TAGS := optional

src_dirs :=app/src/main/java/
LOCAL_SRC_FILES := $(call all-java-files-under, $(src_dirs))

source_dir:=app/src/main/
LOCAL_RESOURCE_DIR := $(LOCAL_PATH)/$(source_dir)/res
LOCAL_FULL_MANIFEST_FILE := $(LOCAL_PATH)/$(source_dir)/AndroidManifest.xml

$(warning $(SUPPORT_OVERSEAAPP))
LOCAL_PRIVATE_PLATFORM_APIS := true

LOCAL_PACKAGE_NAME := HiTvLauncher

LOCAL_JAVA_LIBRARIES := HitvManager HitvShare HiDtvShare

LOCAL_USES_LIBRARIES := HitvManager HiDtvShare HitvShare

LOCAL_CERTIFICATE := platform
LOCAL_JNI_SHARED_LIBRARIES := libhitvclient

LOCAL_PRIVATE_PLATFORM_APIS := true

LOCAL_OVERRIDES_PACKAGES := platform

LOCAL_PROGUARD_ENABLED := disabled
LOCAL_OVERRIDES_PACKAGES := Home Launcher3 Launcher3QuickStep

LOCAL_MULTILIB := 32

include $(BUILD_PACKAGE)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以智象luncher为例</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)
LOCAL_MODULE := Whale_RCA

LOCAL_REQUIRED_MODULES := \\
    LAUNCHER_WHALE \\
    Store_RCA_Whale \\

include $(BUILD_PHONY_PACKAGE)

include $(CLEAR_VARS)
LOCAL_MODULE_TAGS := optional

LOCAL_MODULE := LAUNCHER_WHALE
LOCAL_BUILT_MODULE_STEM := LAUNCHER_WHALE.apk
LOCAL_SRC_FILES := LAUNCHER_WHALE.apk
LOCAL_MODULE_CLASS := APPS
LOCAL_MODULE_SUFFIX := $(COMMON_ANDROID_PACKAGE_SUFFIX)
LOCAL_REQUIRED_MODULES += whiteList.conf
LOCAL_CERTIFICATE := platform
LOCAL_OVERRIDES_PACKAGES := Home Launcher3
include $(BUILD_PREBUILT)

include $(CLEAR_VARS)
LOCAL_MODULE_TAGS := optional

LOCAL_MODULE := Store_RCA_Whale
LOCAL_BUILT_MODULE_STEM := Store_RCA_Whale.apk
LOCAL_SRC_FILES := Store_RCA_Whale.apk
LOCAL_MODULE_CLASS := APPS

LOCAL_MODULE_SUFFIX := $(COMMON_ANDROID_PACKAGE_SUFFIX)
LOCAL_CERTIFICATE := platform
include $(BUILD_PREBUILT)

include $(call all-makefiles-under, $(LOCAL_PATH))
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5、去掉原有的launcher3" tabindex="-1"><a class="header-anchor" href="#_5、去掉原有的launcher3" aria-hidden="true">#</a> 5、去掉原有的Launcher3</h2><p>Android10.0默认的主界面程序是谷歌开发的Launcher3，现在有了关闭主界面程序的需求。我们的思路比较简单：去掉Launcher3编译生成的apk。<br> 禁掉Launcher3源码的编译，在源码中去掉Launcher3的编译文件：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>mv packages/apps/Launcher3/Android.mk packages/apps/Launcher3/Android.mk.txt
mv packages/apps/Launcher3/SecondaryDisplayLauncher/Android.mk packages/apps/Launcher3/SecondaryDisplayLauncher/Android.mk.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>删除Launcher3的历史编译结果：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>find ./out/ -name &quot;Launcher3*&quot; | xargs rm -rf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>重新编译测试，Launcher3主界面程序已经不再启动。</p>`,21),r={href:"https://blog.csdn.net/scottmvp/article/details/123394929",target:"_blank",rel:"noopener noreferrer"};function o(v,m){const s=i("ExternalLinkIcon");return t(),l("div",null,[u,a("p",null,[n("本文转自 "),a("a",r,[n("https://blog.csdn.net/scottmvp/article/details/123394929"),c(s)]),n("，如有侵权，请联系删除。")])])}const _=e(p,[["render",o],["__file","Android-jiangAPPshezhiweizhujiemianLauncher.html.vue"]]);export{_ as default};
