---
title: Android 自定义findViewById注解
date: 2023-04-04
tags:
 - android
categories: 
 - android
sticky: 
   true
---

为了简化在Android中编写findViewById方法的过程，可以使用自定义注解。自定义注解可用于向代码添加元数据，然后可以使用注解处理在编译时处理这些元数据。

以下是在Android中定义自定义注解的示例：

```java
//定义一个ViewFinder注解类
package com.example.myapplication.utils;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ViewFinder {
    int id() default -1;
}
```

```java
package com.example.myapplication.utils;

import java.lang.reflect.Field;

import android.app.Activity;
import android.app.Dialog;
import android.view.View;
import android.view.Window;

/**
 * @BelongsProject: My Application
 * @BelongsPackage: com.example.myapplication.utils
 * @Author: shugan
 * @CreateTime: 2023-03-15  21:58
 * @Description: TODO
 * @Version: 1.0
 */

public class ViewUtil {

    public static void findViews(View root, Object target, Class<? extends Object> clazz) {
        if (root == null || target == null || clazz == null) {
            return;
        }

        Field[] fields = clazz.getDeclaredFields();
        if (fields == null || fields.length == 0) {
            return;
        }
        for (Field field : fields) {
            if (field.isAnnotationPresent(ViewFinder.class)) {
                ViewFinder inject = field.getAnnotation(ViewFinder.class);
                int id = inject.id();
                if (id > 0) {
                    field.setAccessible(true);
                    try {
                        field.set(target, root.findViewById(id));
                    } catch (Exception e) {
                    }
                }
            }
        }
    }

    public static void findViews(View root, Object target) {
        if (root == null || target == null) {
            return;
        }
        findViews(root, target, target.getClass());
    }

    public static void findViews(Activity activity, Object target) {
        if (activity == null) {
            return;
        }
        Window window = activity.getWindow();
        if (window == null) {
            return;
        }
        View decorView = window.getDecorView();
        if (decorView == null) {
            return;
        }
        findViews(decorView, target);
    }

    public static void findViews(Dialog dialog) {
        findViews(dialog, dialog);
    }

    public static void findViews(Dialog dialog, Object target) {
        if (dialog == null) {
            return;
        }
        Window window = dialog.getWindow();
        if (window == null) {
            return;
        }
        View decorView = window.getDecorView();
        if (decorView == null) {
            return;
        }
        findViews(decorView, target);
    }

    public static void findViews(Activity activity) {
        findViews(activity, activity);
    }

    public static void findViews(View view) {
        findViews(view, view);
    }

}
```

