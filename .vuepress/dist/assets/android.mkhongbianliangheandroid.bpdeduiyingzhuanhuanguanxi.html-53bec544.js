import{_ as t,r as i,o as l,c as e,b as n,d as s,e as o,a as p}from"./app-ee4ba21e.js";const u={},c=p(`<h2 id="_1-android-mk和bp的转换关系" tabindex="-1"><a class="header-anchor" href="#_1-android-mk和bp的转换关系" aria-hidden="true">#</a> 1.Android.mk和bp的转换关系</h2><p>可以参考build\\soong\\androidmk\\androidmk进行查找</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>	<span class="token string">&quot;LOCAL_32_BIT_ONLY&quot;</span><span class="token builtin class-name">:</span>           local32BitOnly,
	<span class="token string">&quot;LOCAL_AIDL_INCLUDES&quot;</span><span class="token builtin class-name">:</span>         localAidlIncludes,
	<span class="token string">&quot;LOCAL_ASSET_DIR&quot;</span><span class="token builtin class-name">:</span>             localizePathList<span class="token punctuation">(</span><span class="token string">&quot;asset_dirs&quot;</span><span class="token punctuation">)</span>,
	<span class="token string">&quot;LOCAL_C_INCLUDES&quot;</span><span class="token builtin class-name">:</span>            localIncludeDirs,
	<span class="token string">&quot;LOCAL_EXPORT_C_INCLUDE_DIRS&quot;</span><span class="token builtin class-name">:</span> exportIncludeDirs,
	<span class="token string">&quot;LOCAL_JARJAR_RULES&quot;</span><span class="token builtin class-name">:</span>          localizePath<span class="token punctuation">(</span><span class="token string">&quot;jarjar_rules&quot;</span><span class="token punctuation">)</span>,
	<span class="token string">&quot;LOCAL_LDFLAGS&quot;</span><span class="token builtin class-name">:</span>               ldflags,
	<span class="token string">&quot;LOCAL_MODULE_CLASS&quot;</span><span class="token builtin class-name">:</span>          prebuiltClass,
	<span class="token string">&quot;LOCAL_MODULE_STEM&quot;</span><span class="token builtin class-name">:</span>           stem,
	<span class="token string">&quot;LOCAL_MODULE_HOST_OS&quot;</span><span class="token builtin class-name">:</span>        hostOs,
	<span class="token string">&quot;LOCAL_RESOURCE_DIR&quot;</span><span class="token builtin class-name">:</span>          localizePathList<span class="token punctuation">(</span><span class="token string">&quot;resource_dirs&quot;</span><span class="token punctuation">)</span>,
	<span class="token string">&quot;LOCAL_SANITIZE&quot;</span><span class="token builtin class-name">:</span>              sanitize<span class="token punctuation">(</span><span class="token string">&quot;&quot;</span><span class="token punctuation">)</span>,
	<span class="token string">&quot;LOCAL_SANITIZE_DIAG&quot;</span><span class="token builtin class-name">:</span>         sanitize<span class="token punctuation">(</span><span class="token string">&quot;diag.&quot;</span><span class="token punctuation">)</span>,
	<span class="token string">&quot;LOCAL_STRIP_MODULE&quot;</span><span class="token builtin class-name">:</span>          strip<span class="token punctuation">(</span><span class="token punctuation">)</span>,
	<span class="token string">&quot;LOCAL_CFLAGS&quot;</span><span class="token builtin class-name">:</span>                cflags,
	<span class="token string">&quot;LOCAL_UNINSTALLABLE_MODULE&quot;</span><span class="token builtin class-name">:</span>  invert<span class="token punctuation">(</span><span class="token string">&quot;installable&quot;</span><span class="token punctuation">)</span>,
	<span class="token string">&quot;LOCAL_PROGUARD_ENABLED&quot;</span><span class="token builtin class-name">:</span>      proguardEnabled,
	<span class="token string">&quot;LOCAL_MODULE_PATH&quot;</span><span class="token builtin class-name">:</span>           prebuiltModulePath,
	<span class="token string">&quot;LOCAL_MODULE&quot;</span><span class="token builtin class-name">:</span>                  <span class="token string">&quot;name&quot;</span>,
	<span class="token string">&quot;LOCAL_CXX_STL&quot;</span><span class="token builtin class-name">:</span>                 <span class="token string">&quot;stl&quot;</span>,
	<span class="token string">&quot;LOCAL_MULTILIB&quot;</span><span class="token builtin class-name">:</span>                <span class="token string">&quot;compile_multilib&quot;</span>,
	<span class="token string">&quot;LOCAL_ARM_MODE_HACK&quot;</span><span class="token builtin class-name">:</span>           <span class="token string">&quot;instruction_set&quot;</span>,
	<span class="token string">&quot;LOCAL_SDK_VERSION&quot;</span><span class="token builtin class-name">:</span>             <span class="token string">&quot;sdk_version&quot;</span>,
	<span class="token string">&quot;LOCAL_MIN_SDK_VERSION&quot;</span><span class="token builtin class-name">:</span>         <span class="token string">&quot;min_sdk_version&quot;</span>,
	<span class="token string">&quot;LOCAL_NDK_STL_VARIANT&quot;</span><span class="token builtin class-name">:</span>         <span class="token string">&quot;stl&quot;</span>,
	<span class="token string">&quot;LOCAL_JAR_MANIFEST&quot;</span><span class="token builtin class-name">:</span>            <span class="token string">&quot;manifest&quot;</span>,
	<span class="token string">&quot;LOCAL_CERTIFICATE&quot;</span><span class="token builtin class-name">:</span>             <span class="token string">&quot;certificate&quot;</span>,
	<span class="token string">&quot;LOCAL_PACKAGE_NAME&quot;</span><span class="token builtin class-name">:</span>            <span class="token string">&quot;name&quot;</span>,
	<span class="token string">&quot;LOCAL_MODULE_RELATIVE_PATH&quot;</span><span class="token builtin class-name">:</span>    <span class="token string">&quot;relative_install_path&quot;</span>,
	<span class="token string">&quot;LOCAL_PROTOC_OPTIMIZE_TYPE&quot;</span><span class="token builtin class-name">:</span>    <span class="token string">&quot;proto.type&quot;</span>,
	<span class="token string">&quot;LOCAL_MODULE_OWNER&quot;</span><span class="token builtin class-name">:</span>            <span class="token string">&quot;owner&quot;</span>,
	<span class="token string">&quot;LOCAL_RENDERSCRIPT_TARGET_API&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;renderscript.target_api&quot;</span>,
	<span class="token string">&quot;LOCAL_NOTICE_FILE&quot;</span><span class="token builtin class-name">:</span>             <span class="token string">&quot;notice&quot;</span>,
	<span class="token string">&quot;LOCAL_JAVA_LANGUAGE_VERSION&quot;</span><span class="token builtin class-name">:</span>   <span class="token string">&quot;java_version&quot;</span>,
	<span class="token string">&quot;LOCAL_INSTRUMENTATION_FOR&quot;</span><span class="token builtin class-name">:</span>     <span class="token string">&quot;instrumentation_for&quot;</span>,
	<span class="token string">&quot;LOCAL_MANIFEST_FILE&quot;</span><span class="token builtin class-name">:</span>           <span class="token string">&quot;manifest&quot;</span>,
	<span class="token string">&quot;LOCAL_DEX_PREOPT_PROFILE_CLASS_LISTING&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;dex_preopt.profile&quot;</span>,
	<span class="token string">&quot;LOCAL_TEST_CONFIG&quot;</span><span class="token builtin class-name">:</span>                      <span class="token string">&quot;test_config&quot;</span>,
	<span class="token string">&quot;LOCAL_SRC_FILES&quot;</span><span class="token builtin class-name">:</span>                     <span class="token string">&quot;srcs&quot;</span>,
	<span class="token string">&quot;LOCAL_SRC_FILES_EXCLUDE&quot;</span><span class="token builtin class-name">:</span>             <span class="token string">&quot;exclude_srcs&quot;</span>,
	<span class="token string">&quot;LOCAL_HEADER_LIBRARIES&quot;</span><span class="token builtin class-name">:</span>              <span class="token string">&quot;header_libs&quot;</span>,
	<span class="token string">&quot;LOCAL_SHARED_LIBRARIES&quot;</span><span class="token builtin class-name">:</span>              <span class="token string">&quot;shared_libs&quot;</span>,
	<span class="token string">&quot;LOCAL_STATIC_LIBRARIES&quot;</span><span class="token builtin class-name">:</span>              <span class="token string">&quot;static_libs&quot;</span>,
	<span class="token string">&quot;LOCAL_WHOLE_STATIC_LIBRARIES&quot;</span><span class="token builtin class-name">:</span>        <span class="token string">&quot;whole_static_libs&quot;</span>,
	<span class="token string">&quot;LOCAL_SYSTEM_SHARED_LIBRARIES&quot;</span><span class="token builtin class-name">:</span>       <span class="token string">&quot;system_shared_libs&quot;</span>,
	<span class="token string">&quot;LOCAL_ASFLAGS&quot;</span><span class="token builtin class-name">:</span>                       <span class="token string">&quot;asflags&quot;</span>,
	<span class="token string">&quot;LOCAL_CLANG_ASFLAGS&quot;</span><span class="token builtin class-name">:</span>                 <span class="token string">&quot;clang_asflags&quot;</span>,
	<span class="token string">&quot;LOCAL_COMPATIBILITY_SUPPORT_FILES&quot;</span><span class="token builtin class-name">:</span>   <span class="token string">&quot;data&quot;</span>,
	<span class="token string">&quot;LOCAL_CONLYFLAGS&quot;</span><span class="token builtin class-name">:</span>                    <span class="token string">&quot;conlyflags&quot;</span>,
	<span class="token string">&quot;LOCAL_CPPFLAGS&quot;</span><span class="token builtin class-name">:</span>                      <span class="token string">&quot;cppflags&quot;</span>,
	<span class="token string">&quot;LOCAL_REQUIRED_MODULES&quot;</span><span class="token builtin class-name">:</span>              <span class="token string">&quot;required&quot;</span>,
	<span class="token string">&quot;LOCAL_HOST_REQUIRED_MODULES&quot;</span><span class="token builtin class-name">:</span>         <span class="token string">&quot;host_required&quot;</span>,
	<span class="token string">&quot;LOCAL_TARGET_REQUIRED_MODULES&quot;</span><span class="token builtin class-name">:</span>       <span class="token string">&quot;target_required&quot;</span>,
	<span class="token string">&quot;LOCAL_OVERRIDES_MODULES&quot;</span><span class="token builtin class-name">:</span>             <span class="token string">&quot;overrides&quot;</span>,
	<span class="token string">&quot;LOCAL_LDLIBS&quot;</span><span class="token builtin class-name">:</span>                        <span class="token string">&quot;host_ldlibs&quot;</span>,
	<span class="token string">&quot;LOCAL_CLANG_CFLAGS&quot;</span><span class="token builtin class-name">:</span>                  <span class="token string">&quot;clang_cflags&quot;</span>,
	<span class="token string">&quot;LOCAL_YACCFLAGS&quot;</span><span class="token builtin class-name">:</span>                     <span class="token string">&quot;yacc.flags&quot;</span>,
	<span class="token string">&quot;LOCAL_SANITIZE_RECOVER&quot;</span><span class="token builtin class-name">:</span>              <span class="token string">&quot;sanitize.recover&quot;</span>,
	<span class="token string">&quot;LOCAL_LOGTAGS_FILES&quot;</span><span class="token builtin class-name">:</span>                 <span class="token string">&quot;logtags&quot;</span>,
	<span class="token string">&quot;LOCAL_EXPORT_HEADER_LIBRARY_HEADERS&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;export_header_lib_headers&quot;</span>,
	<span class="token string">&quot;LOCAL_EXPORT_SHARED_LIBRARY_HEADERS&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;export_shared_lib_headers&quot;</span>,
	<span class="token string">&quot;LOCAL_EXPORT_STATIC_LIBRARY_HEADERS&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;export_static_lib_headers&quot;</span>,
	<span class="token string">&quot;LOCAL_INIT_RC&quot;</span><span class="token builtin class-name">:</span>                       <span class="token string">&quot;init_rc&quot;</span>,
	<span class="token string">&quot;LOCAL_VINTF_FRAGMENTS&quot;</span><span class="token builtin class-name">:</span>               <span class="token string">&quot;vintf_fragments&quot;</span>,
	<span class="token string">&quot;LOCAL_TIDY_FLAGS&quot;</span><span class="token builtin class-name">:</span>                    <span class="token string">&quot;tidy_flags&quot;</span>,
	// TODO: This is comma-separated, not space-separated
	<span class="token string">&quot;LOCAL_TIDY_CHECKS&quot;</span><span class="token builtin class-name">:</span>           <span class="token string">&quot;tidy_checks&quot;</span>,
	<span class="token string">&quot;LOCAL_RENDERSCRIPT_INCLUDES&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;renderscript.include_dirs&quot;</span>,
	<span class="token string">&quot;LOCAL_RENDERSCRIPT_FLAGS&quot;</span><span class="token builtin class-name">:</span>    <span class="token string">&quot;renderscript.flags&quot;</span>,

	<span class="token string">&quot;LOCAL_JAVA_RESOURCE_DIRS&quot;</span><span class="token builtin class-name">:</span>    <span class="token string">&quot;java_resource_dirs&quot;</span>,
	<span class="token string">&quot;LOCAL_JAVA_RESOURCE_FILES&quot;</span><span class="token builtin class-name">:</span>   <span class="token string">&quot;java_resources&quot;</span>,
	<span class="token string">&quot;LOCAL_JAVACFLAGS&quot;</span><span class="token builtin class-name">:</span>            <span class="token string">&quot;javacflags&quot;</span>,
	<span class="token string">&quot;LOCAL_ERROR_PRONE_FLAGS&quot;</span><span class="token builtin class-name">:</span>     <span class="token string">&quot;errorprone.javacflags&quot;</span>,
	<span class="token string">&quot;LOCAL_DX_FLAGS&quot;</span><span class="token builtin class-name">:</span>              <span class="token string">&quot;dxflags&quot;</span>,
	<span class="token string">&quot;LOCAL_JAVA_LIBRARIES&quot;</span><span class="token builtin class-name">:</span>        <span class="token string">&quot;libs&quot;</span>,
	<span class="token string">&quot;LOCAL_STATIC_JAVA_LIBRARIES&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;static_libs&quot;</span>,
	<span class="token string">&quot;LOCAL_JNI_SHARED_LIBRARIES&quot;</span><span class="token builtin class-name">:</span>  <span class="token string">&quot;jni_libs&quot;</span>,
	<span class="token string">&quot;LOCAL_AAPT_FLAGS&quot;</span><span class="token builtin class-name">:</span>            <span class="token string">&quot;aaptflags&quot;</span>,
	<span class="token string">&quot;LOCAL_PACKAGE_SPLITS&quot;</span><span class="token builtin class-name">:</span>        <span class="token string">&quot;package_splits&quot;</span>,
	<span class="token string">&quot;LOCAL_COMPATIBILITY_SUITE&quot;</span><span class="token builtin class-name">:</span>   <span class="token string">&quot;test_suites&quot;</span>,
	<span class="token string">&quot;LOCAL_OVERRIDES_PACKAGES&quot;</span><span class="token builtin class-name">:</span>    <span class="token string">&quot;overrides&quot;</span>,

	<span class="token string">&quot;LOCAL_ANNOTATION_PROCESSORS&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;plugins&quot;</span>,

	<span class="token string">&quot;LOCAL_PROGUARD_FLAGS&quot;</span><span class="token builtin class-name">:</span>      <span class="token string">&quot;optimize.proguard_flags&quot;</span>,
	<span class="token string">&quot;LOCAL_PROGUARD_FLAG_FILES&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;optimize.proguard_flags_files&quot;</span>,

	// These will be rewritten to libs/static_libs by bpfix, after their presence is used to convert
	// java_library_static to android_library.
	<span class="token string">&quot;LOCAL_SHARED_ANDROID_LIBRARIES&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;android_libs&quot;</span>,
	<span class="token string">&quot;LOCAL_STATIC_ANDROID_LIBRARIES&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;android_static_libs&quot;</span>,
	<span class="token string">&quot;LOCAL_ADDITIONAL_CERTIFICATES&quot;</span><span class="token builtin class-name">:</span>  <span class="token string">&quot;additional_certificates&quot;</span>,

	// Jacoco filters:
	<span class="token string">&quot;LOCAL_JACK_COVERAGE_INCLUDE_FILTER&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;jacoco.include_filter&quot;</span>,
	<span class="token string">&quot;LOCAL_JACK_COVERAGE_EXCLUDE_FILTER&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;jacoco.exclude_filter&quot;</span>,

	<span class="token string">&quot;LOCAL_FULL_LIBS_MANIFEST_FILES&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;additional_manifests&quot;</span>,
	<span class="token string">&quot;LOCAL_IS_HOST_MODULE&quot;</span><span class="token builtin class-name">:</span>             <span class="token string">&quot;host&quot;</span>,
	<span class="token string">&quot;LOCAL_CLANG&quot;</span><span class="token builtin class-name">:</span>                      <span class="token string">&quot;clang&quot;</span>,
	<span class="token string">&quot;LOCAL_FORCE_STATIC_EXECUTABLE&quot;</span><span class="token builtin class-name">:</span>    <span class="token string">&quot;static_executable&quot;</span>,
	<span class="token string">&quot;LOCAL_NATIVE_COVERAGE&quot;</span><span class="token builtin class-name">:</span>            <span class="token string">&quot;native_coverage&quot;</span>,
	<span class="token string">&quot;LOCAL_NO_CRT&quot;</span><span class="token builtin class-name">:</span>                     <span class="token string">&quot;nocrt&quot;</span>,
	<span class="token string">&quot;LOCAL_ALLOW_UNDEFINED_SYMBOLS&quot;</span><span class="token builtin class-name">:</span>    <span class="token string">&quot;allow_undefined_symbols&quot;</span>,
	<span class="token string">&quot;LOCAL_RTTI_FLAG&quot;</span><span class="token builtin class-name">:</span>                  <span class="token string">&quot;rtti&quot;</span>,
	<span class="token string">&quot;LOCAL_PACK_MODULE_RELOCATIONS&quot;</span><span class="token builtin class-name">:</span>    <span class="token string">&quot;pack_relocations&quot;</span>,
	<span class="token string">&quot;LOCAL_TIDY&quot;</span><span class="token builtin class-name">:</span>                       <span class="token string">&quot;tidy&quot;</span>,
	<span class="token string">&quot;LOCAL_USE_CLANG_LLD&quot;</span><span class="token builtin class-name">:</span>              <span class="token string">&quot;use_clang_lld&quot;</span>,
	<span class="token string">&quot;LOCAL_PROPRIETARY_MODULE&quot;</span><span class="token builtin class-name">:</span>         <span class="token string">&quot;proprietary&quot;</span>,
	<span class="token string">&quot;LOCAL_VENDOR_MODULE&quot;</span><span class="token builtin class-name">:</span>              <span class="token string">&quot;vendor&quot;</span>,
	<span class="token string">&quot;LOCAL_ODM_MODULE&quot;</span><span class="token builtin class-name">:</span>                 <span class="token string">&quot;device_specific&quot;</span>,
	<span class="token string">&quot;LOCAL_PRODUCT_MODULE&quot;</span><span class="token builtin class-name">:</span>             <span class="token string">&quot;product_specific&quot;</span>,
	<span class="token string">&quot;LOCAL_SYSTEM_EXT_MODULE&quot;</span><span class="token builtin class-name">:</span>          <span class="token string">&quot;system_ext_specific&quot;</span>,
	<span class="token string">&quot;LOCAL_EXPORT_PACKAGE_RESOURCES&quot;</span><span class="token builtin class-name">:</span>   <span class="token string">&quot;export_package_resources&quot;</span>,
	<span class="token string">&quot;LOCAL_PRIVILEGED_MODULE&quot;</span><span class="token builtin class-name">:</span>          <span class="token string">&quot;privileged&quot;</span>,
	<span class="token string">&quot;LOCAL_AAPT_INCLUDE_ALL_RESOURCES&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;aapt_include_all_resources&quot;</span>,
	<span class="token string">&quot;LOCAL_DONT_MERGE_MANIFESTS&quot;</span><span class="token builtin class-name">:</span>       <span class="token string">&quot;dont_merge_manifests&quot;</span>,
	<span class="token string">&quot;LOCAL_USE_EMBEDDED_NATIVE_LIBS&quot;</span><span class="token builtin class-name">:</span>   <span class="token string">&quot;use_embedded_native_libs&quot;</span>,
	<span class="token string">&quot;LOCAL_USE_EMBEDDED_DEX&quot;</span><span class="token builtin class-name">:</span>           <span class="token string">&quot;use_embedded_dex&quot;</span>,

	<span class="token string">&quot;LOCAL_DEX_PREOPT&quot;</span><span class="token builtin class-name">:</span>                  <span class="token string">&quot;dex_preopt.enabled&quot;</span>,
	<span class="token string">&quot;LOCAL_DEX_PREOPT_APP_IMAGE&quot;</span><span class="token builtin class-name">:</span>        <span class="token string">&quot;dex_preopt.app_image&quot;</span>,
	<span class="token string">&quot;LOCAL_DEX_PREOPT_GENERATE_PROFILE&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;dex_preopt.profile_guided&quot;</span>,

	<span class="token string">&quot;LOCAL_PRIVATE_PLATFORM_APIS&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;platform_apis&quot;</span>,
	<span class="token string">&quot;LOCAL_JETIFIER_ENABLED&quot;</span><span class="token builtin class-name">:</span>      <span class="token string">&quot;jetifier&quot;</span>,
	<span class="token string">&quot;CLEAR_VARS&quot;</span>, 			clear_vars
	<span class="token string">&quot;my-dir&quot;</span>, mydir
	<span class="token string">&quot;all-java-files-under&quot;</span>, allFilesUnder<span class="token punctuation">(</span><span class="token string">&quot;*.java&quot;</span><span class="token punctuation">)</span>
	<span class="token string">&quot;all-proto-files-under&quot;</span>, allFilesUnder<span class="token punctuation">(</span><span class="token string">&quot;*.proto&quot;</span><span class="token punctuation">)</span>
	<span class="token string">&quot;all-aidl-files-under&quot;</span>, allFilesUnder<span class="token punctuation">(</span><span class="token string">&quot;*.aidl&quot;</span><span class="token punctuation">)</span>
	<span class="token string">&quot;all-Iaidl-files-under&quot;</span>, allFilesUnder<span class="token punctuation">(</span><span class="token string">&quot;I*.aidl&quot;</span><span class="token punctuation">)</span>
	<span class="token string">&quot;all-logtags-files-under&quot;</span>, allFilesUnder<span class="token punctuation">(</span><span class="token string">&quot;*.logtags&quot;</span>
	<span class="token string">&quot;all-subdir-java-files&quot;</span>, allSubdirJavaFiles
		<span class="token string">&quot;BUILD_SHARED_LIBRARY&quot;</span><span class="token builtin class-name">:</span>        <span class="token string">&quot;cc_library_shared&quot;</span>,
	<span class="token string">&quot;BUILD_STATIC_LIBRARY&quot;</span><span class="token builtin class-name">:</span>        <span class="token string">&quot;cc_library_static&quot;</span>,
	<span class="token string">&quot;BUILD_HOST_SHARED_LIBRARY&quot;</span><span class="token builtin class-name">:</span>   <span class="token string">&quot;cc_library_host_shared&quot;</span>,
	<span class="token string">&quot;BUILD_HOST_STATIC_LIBRARY&quot;</span><span class="token builtin class-name">:</span>   <span class="token string">&quot;cc_library_host_static&quot;</span>,
	<span class="token string">&quot;BUILD_HEADER_LIBRARY&quot;</span><span class="token builtin class-name">:</span>        <span class="token string">&quot;cc_library_headers&quot;</span>,
	<span class="token string">&quot;BUILD_EXECUTABLE&quot;</span><span class="token builtin class-name">:</span>            <span class="token string">&quot;cc_binary&quot;</span>,
	<span class="token string">&quot;BUILD_HOST_EXECUTABLE&quot;</span><span class="token builtin class-name">:</span>       <span class="token string">&quot;cc_binary_host&quot;</span>,
	<span class="token string">&quot;BUILD_NATIVE_TEST&quot;</span><span class="token builtin class-name">:</span>           <span class="token string">&quot;cc_test&quot;</span>,
	<span class="token string">&quot;BUILD_HOST_NATIVE_TEST&quot;</span><span class="token builtin class-name">:</span>      <span class="token string">&quot;cc_test_host&quot;</span>,
	<span class="token string">&quot;BUILD_NATIVE_BENCHMARK&quot;</span><span class="token builtin class-name">:</span>      <span class="token string">&quot;cc_benchmark&quot;</span>,
	<span class="token string">&quot;BUILD_HOST_NATIVE_BENCHMARK&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;cc_benchmark_host&quot;</span>,

	<span class="token string">&quot;BUILD_JAVA_LIBRARY&quot;</span><span class="token builtin class-name">:</span>             <span class="token string">&quot;java_library_installable&quot;</span>, // will be rewritten to java_library by bpfix
	<span class="token string">&quot;BUILD_STATIC_JAVA_LIBRARY&quot;</span><span class="token builtin class-name">:</span>      <span class="token string">&quot;java_library&quot;</span>,
	<span class="token string">&quot;BUILD_HOST_JAVA_LIBRARY&quot;</span><span class="token builtin class-name">:</span>        <span class="token string">&quot;java_library_host&quot;</span>,
	<span class="token string">&quot;BUILD_HOST_DALVIK_JAVA_LIBRARY&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;java_library_host_dalvik&quot;</span>,
	<span class="token string">&quot;BUILD_PACKAGE&quot;</span><span class="token builtin class-name">:</span>                  <span class="token string">&quot;android_app&quot;</span>,

	<span class="token string">&quot;BUILD_CTS_EXECUTABLE&quot;</span><span class="token builtin class-name">:</span>          <span class="token string">&quot;cc_binary&quot;</span>,               // will be further massaged by bpfix depending on the output path
	<span class="token string">&quot;BUILD_CTS_SUPPORT_PACKAGE&quot;</span><span class="token builtin class-name">:</span>     <span class="token string">&quot;cts_support_package&quot;</span>,     // will be rewritten to android_test by bpfix
	<span class="token string">&quot;BUILD_CTS_PACKAGE&quot;</span><span class="token builtin class-name">:</span>             <span class="token string">&quot;cts_package&quot;</span>,             // will be rewritten to android_test by bpfix
	<span class="token string">&quot;BUILD_CTS_TARGET_JAVA_LIBRARY&quot;</span><span class="token builtin class-name">:</span> <span class="token string">&quot;cts_target_java_library&quot;</span>, // will be rewritten to java_library by bpfix
	<span class="token string">&quot;BUILD_CTS_HOST_JAVA_LIBRARY&quot;</span><span class="token builtin class-name">:</span>   <span class="token string">&quot;cts_host_java_library&quot;</span>,   // will be rewritten to java_library_host by bpfix
	<span class="token punctuation">{</span><span class="token string">&quot;arm&quot;</span>, <span class="token string">&quot;arch.arm&quot;</span><span class="token punctuation">}</span>,
	<span class="token punctuation">{</span><span class="token string">&quot;arm64&quot;</span>, <span class="token string">&quot;arch.arm64&quot;</span><span class="token punctuation">}</span>,
	<span class="token punctuation">{</span><span class="token string">&quot;mips&quot;</span>, <span class="token string">&quot;arch.mips&quot;</span><span class="token punctuation">}</span>,
	<span class="token punctuation">{</span><span class="token string">&quot;mips64&quot;</span>, <span class="token string">&quot;arch.mips64&quot;</span><span class="token punctuation">}</span>,
	<span class="token punctuation">{</span><span class="token string">&quot;x86&quot;</span>, <span class="token string">&quot;arch.x86&quot;</span><span class="token punctuation">}</span>,
	<span class="token punctuation">{</span><span class="token string">&quot;x86_64&quot;</span>, <span class="token string">&quot;arch.x86_64&quot;</span><span class="token punctuation">}</span>,
	<span class="token punctuation">{</span><span class="token string">&quot;32&quot;</span>, <span class="token string">&quot;multilib.lib32&quot;</span><span class="token punctuation">}</span>,
	// <span class="token number">64</span> must be after x86_64
	<span class="token punctuation">{</span><span class="token string">&quot;64&quot;</span>, <span class="token string">&quot;multilib.lib64&quot;</span><span class="token punctuation">}</span>,
	<span class="token punctuation">{</span><span class="token string">&quot;darwin&quot;</span>, <span class="token string">&quot;target.darwin&quot;</span><span class="token punctuation">}</span>,
	<span class="token punctuation">{</span><span class="token string">&quot;linux&quot;</span>, <span class="token string">&quot;target.linux_glibc&quot;</span><span class="token punctuation">}</span>,
	<span class="token punctuation">{</span><span class="token string">&quot;windows&quot;</span>, <span class="token string">&quot;target.windows&quot;</span><span class="token punctuation">}</span>,

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-mk转bp" tabindex="-1"><a class="header-anchor" href="#_2-mk转bp" aria-hidden="true">#</a> 2.mk转bp</h2><p>7.androidmk, .mk文件转.bp命令(Android Q及以后版本支持) 使用示例：androidmk Android.mk &gt; Android.bp – – – – 将Android.mk转换为Android.bp文件.适用于了解Android.bp文件语法，androidmk是个可执行文件，需要配置</p><p>环境变量后使用 source build/envsetup.sh;lunch xxxxx(TARGET_PRODUCT)后，执行make androidmk，在out/soong/host/linux-x86/bin/androidmk中生成androidmk可执行文件，然后方可执行转换操作</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>androidmk Android.mk <span class="token operator">&gt;</span> Android.bp
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="_3-apk使用签名文件" tabindex="-1"><a class="header-anchor" href="#_3-apk使用签名文件" aria-hidden="true">#</a> 3.apk使用签名文件</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>presigned: true, //apk自己的签名
//指向build/make/target/product/security/ 中的XXXX.x509.pem
certificate: <span class="token string">&quot;platform&quot;</span>, //系统签名。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,9),r={href:"https://blog.csdn.net/qq_18906227/article/details/120737147?spm=1001.2014.3001.5502",target:"_blank",rel:"noopener noreferrer"};function q(d,k){const a=i("ExternalLinkIcon");return l(),e("div",null,[c,n("p",null,[s("本文转自 "),n("a",r,[s("https://blog.csdn.net/qq_18906227/article/details/120737147?spm=1001.2014.3001.5502"),o(a)]),s("，如有侵权，请联系删除。")])])}const b=t(u,[["render",q],["__file","android.mkhongbianliangheandroid.bpdeduiyingzhuanhuanguanxi.html.vue"]]);export{b as default};
