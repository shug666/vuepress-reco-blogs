---
title: 深入使用clipChildren和clipToPadding
date: 2024-03-11
tags:
 - android
categories: 
 - android
sticky: 
   true
---

先抛出一个问题：**很多博客说只要根布局clipChildren设置为false，子View就可以正常放大显示**。  
看完这篇你就能知道答案了。

# 1、 简介

clipChildren和clipToPadding是ViewGroup的方法。

*   clipChildren: ViewGroup的子View的绘制是否可以超出子View实际的大小区域。默认值是true,不允许超出实际的大小区域。
*   clipToPadding:ViewGroup的子View的绘制时是否可以使用ViewGroup的padding区域。默认值是true，不允许使用ViewGroup的padding区域。

常见的应用场景有：View动画放大时View超出实际大小、列表滑动比如RecyclerView滑动时可以使用margin或者padding的空间、底部导航栏中某一个导航超出父容器的效果。

听起来比较抽象我们先看个TV端应用例子：![情况1动画放大效果](https://raw.githubusercontent.com/shug666/image/main/images20200927225520675.gif)  
图中 “情况1“ View 聚焦时进行了X和Y的拉伸动画。我们看到情况1放大后大小是超出了View实际的大小的。  
有的同学可能有疑问我对View进行动画拉升，本身就可以实现这个效果啊？往下看你就知道了。

# 2、使用介绍

## 2.1、clipChildren使用

下面的示例情况中，原始TextView背景色为红色,铺满父View,文字大小如下图所示。  
后面示例中的布局层级结构中，第一层FrameLayout是根布局是铺满容器的，是图中黑色部分，其他层级结构表示的是图中红色区域部分  
![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images20201020224240645.png)

*   第一种情况

![](https://raw.githubusercontent.com/shug666/image/main/images20201019211708114.png)

TextView可以获取焦点，我们对TextView进行x和y方向做2倍的scale拉伸动画动画。效果如下  
![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images2020102022470358.png)  
现象：发现文字变大了，TextView没有正常放大两倍显示。

*   第二种情况  
*   ![](https://raw.githubusercontent.com/shug666/image/main/images20201019213208749.png)  
    和上面一样我们只把最外层的FrameLayout的clipChildren = false，我们继续看效果  
    ![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images20201020224935469.png)  
    现象：TextView放大两倍了正常显示

通过对比情况1和情况2我们可以发现根布局的FrameLayout的clipChildren为false的时候可以让他的子View的绘制时候超出自己的大小。

**细心的朋友会发现，TextView是上套了两层FrameLayout的，我们只是把最外层的clipChildren设置为了false,里层的FrameLayout的clipChildren是true,TextView怎么就可以绘制超出了呢?**

这个地方确实很奇怪，理论上确实不应该的，估计Android设计的时候，对这种情况进行了处理。

就是本例中如果FrameLayout的clipChildren为false,FrameLayout的子View是有能力绘制超出区域的（**注意只是有能力,实际能不能超出还是要看View的层级的）**  
就是下面的图解：  
![](https://raw.githubusercontent.com/shug666/image/main/images20200928075328233.png)

*   第三种情况  
    ![](https://raw.githubusercontent.com/shug666/image/main/images20201019214456766.png)  
    我们在加一层,看下效果，除了最外层的clipChildren为false，其他都是true  
    ![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images20201021080729722.png)  
    我们看到 TextView无法继续正常放大了。和上面的结论是相符的，就是clipChildren属性只能往下影响两层。

这种情况如果我们想TextView正常放大:  
只需要将第二层FrameLayout设置clipChildren为false,如下  
![](https://raw.githubusercontent.com/shug666/image/main/images20201021081451945.png)

**如果我们把上面分层图第一层的FrameLayout的clipChildren设置为true的话** 就无法放大显示了。因为绘制是一层一层往外绘制的，最里面的TextView如果要放大超出自身的绘制区域，需要他的父容器也就是第二层的FrameLayout是可以超出绘制区域的。

## 2.2 clipToPadding使用

示例中：TextView为图中红色部分,黄色部分是FrameLayout并设置了20的padding值  
![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images20201021211512723.png)

*   第一种情况

![](https://raw.githubusercontent.com/shug666/image/main/images20201021211927824.png) 我们对TextView进行x和y方向2倍的拉伸动画，效果如下：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images20201021212054786.png)  
TextView不能完全正常显示。原因就是TextView的直接父View,FrameLayout的clipToPadding是true。那我们改成clipToPadding为false，看看下面第二种情况：

*   第二种情况

![](https://raw.githubusercontent.com/shug666/image/main/images20201021212310956.png)

实际效果：  
![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images20201021212429115.png)  
TextView正常展示了。

*   第三种情况  
    上面我们说clipChildren的时候,如果FrameLayout的clipChildren为false，那么往下  
    两层子View都是有能力绘制超出大小,我们看看clipToPadding是否可以往下影响两层

![](https://raw.githubusercontent.com/shug666/image/main/images20201021213147193.png)

实际效果：  
![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images2020102121323917.png)  
TextView不能正常显示。说明clipToPadding只针对ViewGroup的直接子View有效，不能往下传递

# 3、View放大正常显示的几种处理方法

## 3.1、父View足够的大,子View进行放大绘制时不会超出父View并且正常显示

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images20201021214302639.png)  
图中绿色区域是父View的大小，红色区域是子View区域

# 4、使用总结

首先两个属性都是ViewGroup的

* **clipChildren**:  

  1、clipChildren的含义是子View是否可以绘制超出其实际的大小,默认值是true，不可以绘制超出子View的实际大小  
  2、ViewGroup的clipChildren属性设置为false,往下两层View绘制时都有能力超出View的实际大小  
  3、一个子View要绘制超出其实际大小的前提是,**其直接父View的直接父View，也就是往上第二层的ViewGroup，clipChildren必须为false**，如果层级过深,最好层层都设置clipChildren为false,不然不能正常显示

* **clipToPadding**:  

  1、clipToPadding的含义是子View的绘制是否可以使用父View设置的padding区域，默认值是true,不可以绘制使用父View设置的padding区域  
  2、clipToPadding不能往下传递，只对当前ViewGroup的直接子View有效  
  3、**clipToPadding的优先级比clipChildren高，如果clipToPadding为true,不能使用父View的padding区域，所以绘制区域就已经被限制在了padding以外的区域了，所以不能正常放大显示**，举个例子：  
  ![](https://raw.githubusercontent.com/shug666/image/main/images20201021211927824.png)  
  第二层FrameLayout的clipToPadding为true,即使上面的clipChildren为false,对TextView进行放大也不能正常显示

*   **一个特殊情况**  
    ![](https://raw.githubusercontent.com/shug666/image/main/images20201022100809218.png)  
    第一层是DecorView,我去看了下代码并没有设置clipChildren为false,但是我们最上层的FrameLayout进行放大是可以超出其自身大小的。猜测DecorView通过其他方式让clipChildren生效了，这样也刚好满足我们上面说的往下两层view可以绘制超出其自身大小的结论；
    

**通常情况下，TV开发时，遇到ViewGroup clipChildren和clipToPadding都设置为false，防止放大遮挡。**

**解答开篇的问题：**  

根布局clipChildren设置为false，这个ViewGroup往下两层的子View是可以放大显示的。在往下面层，比如第3、4层的子View放大就不能正常显示了。

 

  

本文转自 [https://blog.csdn.net/txksnail/article/details/108837991?utm\_medium=distribute.pc\_relevant.none-task-blog-2~default~baidujs\_baidulandingword~default-1-108837991-blog-102459112.235^v43^pc\_blog\_bottom\_relevance\_base5&spm=1001.2101.3001.4242.2&utm\_relevant\_index=4](https://blog.csdn.net/txksnail/article/details/108837991?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_baidulandingword~default-1-108837991-blog-102459112.235^v43^pc_blog_bottom_relevance_base5&spm=1001.2101.3001.4242.2&utm_relevant_index=4)，如有侵权，请联系删除。