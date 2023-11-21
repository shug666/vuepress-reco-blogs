---
title: android.mk宏变量和android.bp的对应转换关系
date: 2023-08-21
tags:
 - android
categories: 
 - android
sticky: 
   true
---

1.Android.mk和bp的转换关系
-----------------------------------------------------------------------------------------------------------

可以参考build\\soong\\androidmk\\androidmk进行查找

```sh
	"LOCAL_32_BIT_ONLY":           local32BitOnly,
	"LOCAL_AIDL_INCLUDES":         localAidlIncludes,
	"LOCAL_ASSET_DIR":             localizePathList("asset_dirs"),
	"LOCAL_C_INCLUDES":            localIncludeDirs,
	"LOCAL_EXPORT_C_INCLUDE_DIRS": exportIncludeDirs,
	"LOCAL_JARJAR_RULES":          localizePath("jarjar_rules"),
	"LOCAL_LDFLAGS":               ldflags,
	"LOCAL_MODULE_CLASS":          prebuiltClass,
	"LOCAL_MODULE_STEM":           stem,
	"LOCAL_MODULE_HOST_OS":        hostOs,
	"LOCAL_RESOURCE_DIR":          localizePathList("resource_dirs"),
	"LOCAL_SANITIZE":              sanitize(""),
	"LOCAL_SANITIZE_DIAG":         sanitize("diag."),
	"LOCAL_STRIP_MODULE":          strip(),
	"LOCAL_CFLAGS":                cflags,
	"LOCAL_UNINSTALLABLE_MODULE":  invert("installable"),
	"LOCAL_PROGUARD_ENABLED":      proguardEnabled,
	"LOCAL_MODULE_PATH":           prebuiltModulePath,
	"LOCAL_MODULE":                  "name",
	"LOCAL_CXX_STL":                 "stl",
	"LOCAL_MULTILIB":                "compile_multilib",
	"LOCAL_ARM_MODE_HACK":           "instruction_set",
	"LOCAL_SDK_VERSION":             "sdk_version",
	"LOCAL_MIN_SDK_VERSION":         "min_sdk_version",
	"LOCAL_NDK_STL_VARIANT":         "stl",
	"LOCAL_JAR_MANIFEST":            "manifest",
	"LOCAL_CERTIFICATE":             "certificate",
	"LOCAL_PACKAGE_NAME":            "name",
	"LOCAL_MODULE_RELATIVE_PATH":    "relative_install_path",
	"LOCAL_PROTOC_OPTIMIZE_TYPE":    "proto.type",
	"LOCAL_MODULE_OWNER":            "owner",
	"LOCAL_RENDERSCRIPT_TARGET_API": "renderscript.target_api",
	"LOCAL_NOTICE_FILE":             "notice",
	"LOCAL_JAVA_LANGUAGE_VERSION":   "java_version",
	"LOCAL_INSTRUMENTATION_FOR":     "instrumentation_for",
	"LOCAL_MANIFEST_FILE":           "manifest",
	"LOCAL_DEX_PREOPT_PROFILE_CLASS_LISTING": "dex_preopt.profile",
	"LOCAL_TEST_CONFIG":                      "test_config",
	"LOCAL_SRC_FILES":                     "srcs",
	"LOCAL_SRC_FILES_EXCLUDE":             "exclude_srcs",
	"LOCAL_HEADER_LIBRARIES":              "header_libs",
	"LOCAL_SHARED_LIBRARIES":              "shared_libs",
	"LOCAL_STATIC_LIBRARIES":              "static_libs",
	"LOCAL_WHOLE_STATIC_LIBRARIES":        "whole_static_libs",
	"LOCAL_SYSTEM_SHARED_LIBRARIES":       "system_shared_libs",
	"LOCAL_ASFLAGS":                       "asflags",
	"LOCAL_CLANG_ASFLAGS":                 "clang_asflags",
	"LOCAL_COMPATIBILITY_SUPPORT_FILES":   "data",
	"LOCAL_CONLYFLAGS":                    "conlyflags",
	"LOCAL_CPPFLAGS":                      "cppflags",
	"LOCAL_REQUIRED_MODULES":              "required",
	"LOCAL_HOST_REQUIRED_MODULES":         "host_required",
	"LOCAL_TARGET_REQUIRED_MODULES":       "target_required",
	"LOCAL_OVERRIDES_MODULES":             "overrides",
	"LOCAL_LDLIBS":                        "host_ldlibs",
	"LOCAL_CLANG_CFLAGS":                  "clang_cflags",
	"LOCAL_YACCFLAGS":                     "yacc.flags",
	"LOCAL_SANITIZE_RECOVER":              "sanitize.recover",
	"LOCAL_LOGTAGS_FILES":                 "logtags",
	"LOCAL_EXPORT_HEADER_LIBRARY_HEADERS": "export_header_lib_headers",
	"LOCAL_EXPORT_SHARED_LIBRARY_HEADERS": "export_shared_lib_headers",
	"LOCAL_EXPORT_STATIC_LIBRARY_HEADERS": "export_static_lib_headers",
	"LOCAL_INIT_RC":                       "init_rc",
	"LOCAL_VINTF_FRAGMENTS":               "vintf_fragments",
	"LOCAL_TIDY_FLAGS":                    "tidy_flags",
	// TODO: This is comma-separated, not space-separated
	"LOCAL_TIDY_CHECKS":           "tidy_checks",
	"LOCAL_RENDERSCRIPT_INCLUDES": "renderscript.include_dirs",
	"LOCAL_RENDERSCRIPT_FLAGS":    "renderscript.flags",

	"LOCAL_JAVA_RESOURCE_DIRS":    "java_resource_dirs",
	"LOCAL_JAVA_RESOURCE_FILES":   "java_resources",
	"LOCAL_JAVACFLAGS":            "javacflags",
	"LOCAL_ERROR_PRONE_FLAGS":     "errorprone.javacflags",
	"LOCAL_DX_FLAGS":              "dxflags",
	"LOCAL_JAVA_LIBRARIES":        "libs",
	"LOCAL_STATIC_JAVA_LIBRARIES": "static_libs",
	"LOCAL_JNI_SHARED_LIBRARIES":  "jni_libs",
	"LOCAL_AAPT_FLAGS":            "aaptflags",
	"LOCAL_PACKAGE_SPLITS":        "package_splits",
	"LOCAL_COMPATIBILITY_SUITE":   "test_suites",
	"LOCAL_OVERRIDES_PACKAGES":    "overrides",

	"LOCAL_ANNOTATION_PROCESSORS": "plugins",

	"LOCAL_PROGUARD_FLAGS":      "optimize.proguard_flags",
	"LOCAL_PROGUARD_FLAG_FILES": "optimize.proguard_flags_files",

	// These will be rewritten to libs/static_libs by bpfix, after their presence is used to convert
	// java_library_static to android_library.
	"LOCAL_SHARED_ANDROID_LIBRARIES": "android_libs",
	"LOCAL_STATIC_ANDROID_LIBRARIES": "android_static_libs",
	"LOCAL_ADDITIONAL_CERTIFICATES":  "additional_certificates",

	// Jacoco filters:
	"LOCAL_JACK_COVERAGE_INCLUDE_FILTER": "jacoco.include_filter",
	"LOCAL_JACK_COVERAGE_EXCLUDE_FILTER": "jacoco.exclude_filter",

	"LOCAL_FULL_LIBS_MANIFEST_FILES": "additional_manifests",
	"LOCAL_IS_HOST_MODULE":             "host",
	"LOCAL_CLANG":                      "clang",
	"LOCAL_FORCE_STATIC_EXECUTABLE":    "static_executable",
	"LOCAL_NATIVE_COVERAGE":            "native_coverage",
	"LOCAL_NO_CRT":                     "nocrt",
	"LOCAL_ALLOW_UNDEFINED_SYMBOLS":    "allow_undefined_symbols",
	"LOCAL_RTTI_FLAG":                  "rtti",
	"LOCAL_PACK_MODULE_RELOCATIONS":    "pack_relocations",
	"LOCAL_TIDY":                       "tidy",
	"LOCAL_USE_CLANG_LLD":              "use_clang_lld",
	"LOCAL_PROPRIETARY_MODULE":         "proprietary",
	"LOCAL_VENDOR_MODULE":              "vendor",
	"LOCAL_ODM_MODULE":                 "device_specific",
	"LOCAL_PRODUCT_MODULE":             "product_specific",
	"LOCAL_SYSTEM_EXT_MODULE":          "system_ext_specific",
	"LOCAL_EXPORT_PACKAGE_RESOURCES":   "export_package_resources",
	"LOCAL_PRIVILEGED_MODULE":          "privileged",
	"LOCAL_AAPT_INCLUDE_ALL_RESOURCES": "aapt_include_all_resources",
	"LOCAL_DONT_MERGE_MANIFESTS":       "dont_merge_manifests",
	"LOCAL_USE_EMBEDDED_NATIVE_LIBS":   "use_embedded_native_libs",
	"LOCAL_USE_EMBEDDED_DEX":           "use_embedded_dex",

	"LOCAL_DEX_PREOPT":                  "dex_preopt.enabled",
	"LOCAL_DEX_PREOPT_APP_IMAGE":        "dex_preopt.app_image",
	"LOCAL_DEX_PREOPT_GENERATE_PROFILE": "dex_preopt.profile_guided",

	"LOCAL_PRIVATE_PLATFORM_APIS": "platform_apis",
	"LOCAL_JETIFIER_ENABLED":      "jetifier",
	"CLEAR_VARS", 			clear_vars
	"my-dir", mydir
	"all-java-files-under", allFilesUnder("*.java")
	"all-proto-files-under", allFilesUnder("*.proto")
	"all-aidl-files-under", allFilesUnder("*.aidl")
	"all-Iaidl-files-under", allFilesUnder("I*.aidl")
	"all-logtags-files-under", allFilesUnder("*.logtags"
	"all-subdir-java-files", allSubdirJavaFiles
		"BUILD_SHARED_LIBRARY":        "cc_library_shared",
	"BUILD_STATIC_LIBRARY":        "cc_library_static",
	"BUILD_HOST_SHARED_LIBRARY":   "cc_library_host_shared",
	"BUILD_HOST_STATIC_LIBRARY":   "cc_library_host_static",
	"BUILD_HEADER_LIBRARY":        "cc_library_headers",
	"BUILD_EXECUTABLE":            "cc_binary",
	"BUILD_HOST_EXECUTABLE":       "cc_binary_host",
	"BUILD_NATIVE_TEST":           "cc_test",
	"BUILD_HOST_NATIVE_TEST":      "cc_test_host",
	"BUILD_NATIVE_BENCHMARK":      "cc_benchmark",
	"BUILD_HOST_NATIVE_BENCHMARK": "cc_benchmark_host",

	"BUILD_JAVA_LIBRARY":             "java_library_installable", // will be rewritten to java_library by bpfix
	"BUILD_STATIC_JAVA_LIBRARY":      "java_library",
	"BUILD_HOST_JAVA_LIBRARY":        "java_library_host",
	"BUILD_HOST_DALVIK_JAVA_LIBRARY": "java_library_host_dalvik",
	"BUILD_PACKAGE":                  "android_app",

	"BUILD_CTS_EXECUTABLE":          "cc_binary",               // will be further massaged by bpfix depending on the output path
	"BUILD_CTS_SUPPORT_PACKAGE":     "cts_support_package",     // will be rewritten to android_test by bpfix
	"BUILD_CTS_PACKAGE":             "cts_package",             // will be rewritten to android_test by bpfix
	"BUILD_CTS_TARGET_JAVA_LIBRARY": "cts_target_java_library", // will be rewritten to java_library by bpfix
	"BUILD_CTS_HOST_JAVA_LIBRARY":   "cts_host_java_library",   // will be rewritten to java_library_host by bpfix
	{"arm", "arch.arm"},
	{"arm64", "arch.arm64"},
	{"mips", "arch.mips"},
	{"mips64", "arch.mips64"},
	{"x86", "arch.x86"},
	{"x86_64", "arch.x86_64"},
	{"32", "multilib.lib32"},
	// 64 must be after x86_64
	{"64", "multilib.lib64"},
	{"darwin", "target.darwin"},
	{"linux", "target.linux_glibc"},
	{"windows", "target.windows"},

```

2.mk转bp
----------------------------------------------------------------------------------------------

7.androidmk, .mk文件转.bp命令(Android Q及以后版本支持) 使用示例：androidmk Android.mk > Android.bp – – – – 将Android.mk转换为Android.bp文件.适用于了解Android.bp文件语法，androidmk是个可执行文件，需要配置

环境变量后使用 source build/envsetup.sh;lunch xxxxx(TARGET\_PRODUCT)后，执行make androidmk，在out/soong/host/linux-x86/bin/androidmk中生成androidmk可执行文件，然后方可执行转换操作

```sh
androidmk Android.mk > Android.bp
```

## 3.apk使用签名文件

```sh
presigned: true, //apk自己的签名
//指向build/make/target/product/security/ 中的XXXX.x509.pem
certificate: "platform", //系统签名。
```

 

  

本文转自 [https://blog.csdn.net/qq\_18906227/article/details/120737147?spm=1001.2014.3001.5502](https://blog.csdn.net/qq_18906227/article/details/120737147?spm=1001.2014.3001.5502)，如有侵权，请联系删除。