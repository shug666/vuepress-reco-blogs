---
title: android 增加标签属性
date: 2022-10-31
tags:
 - android
categories: 
 - android
sticky: 
   true
---

Android中常常用到写自己的控件来满足自己的开发需求，[自定义控件](https://so.csdn.net/so/search?q=自定义控件&spm=1001.2101.3001.7020)在布局中使用的时候，如何增加标签属性来配置控件属性，又如何在控件中使用自己添加的属性

## 一、在资源文件中配置标签属性

在资源文件res/values/attrs.[xml](https://so.csdn.net/so/search?q=xml&spm=1001.2101.3001.7020)中增加 declare-styleable 节点，name为自定义控件名字；如下

```xml
<resources>
    <declare-styleable name="CustomerView">
        //项目中资源id
	    <attr name="background" format="reference" />
        <attr name="src" format="reference" />
        //颜色
        <attr name = "textColor" format = "color" /> 
        //布尔值
        <attr name = "focusable" format = "boolean" /> 
        //尺寸值 dp，sp，px等
        <attr name = "width" format = "dimension" />
        //字符串 
        <attr name = "textStr" format = "string" /> 
        //枚举值
        <attr name="orientation"> 
            <enum name="horizontal" value="0" /> 
            <enum name="vertical" value="1" /> 
        </attr> 
    </declare-styleable>
</resources>
```

其中子节点attr中的name值backound、src、textColor、focusable、width、textStr均为范例，自己写的时候自定义属性名称

## 二、xml布局文件的控件中引用自己定义的属性

1、引入app的命名空间，自定义属性以"app:"为前缀

```xml
<layout xmlns:app="http://schemas.android.com/apk/res-auto">
	<com.example.weiget.CustomerView
		app:textStr="@string/app_name"
		app:background="@string/app_name"
		android:src="@drawable/compile"
		android:layout_width="match_parent"
		android:layout_height="match_parent"/>
</layout>
```

## 三、项目中自定义属性和布局文件中的属性值都配置好了，如何在自定义控件文件中拿到配置的参数呢；如

```java
public class CustomerView extends AppCompatImageView {
    public CustomerView(Context context) {
        super(context);
        init(context,null);
    }
 
 
    public CustomerView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context,attrs);
    }
 
    public CustomerView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context,attrs);
    }
 
    private void init(Context context, AttributeSet attrs) {
        if(attrs != null) {
            //从项目style中文件中取出样式数组
            TypedArray typedArray = context.obtainStyledAttributes(attrs, R.styleable.CustomerView);
            //取到xml布局文件中配置的资源文件
            Drawable drawable = typedArray.getDrawable(R.styleable.CustomerView_src);
            //字符串
            String string = typedArray.getString(R.styleable.CustomerView_textStr);
            //布尔值
            boolean aBoolean = typedArray.getBoolean(R.styleable.CustomerView_focusable, false);
        }
    }
}
```

从typeArray数组中取值的参数，其中参数命门规则为R.styleable.控件名_属性名