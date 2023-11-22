---
title: Java 子类与父类构造方法的问题
date: 2022-10-10
tags:
 - java
categories: 
 - java
sticky: 
   true
---

## Java 子类构造方法与父类构造方法的问题

看一段代码

```java
class Base{
	public Base(String s){
   	    System.out.print("B");
	}
}
public class Derived extends Base{
	public Derived (String s) {
    	    System.out.print("D");
	}
	public static void main(String[] args){
   	    new Derived("C");
	}
}
12345678910111213
```

Eclipse敲出这些代码，会提示错误，无法编译。 具体是什么原因呢？

## 先来看一下类的初始化顺序

Child.java

```java
class Parent{
	{
		System.out.println("Parent代码块");
	}
	static {
		System.out.println("Parent静态代码块");
	}
	public Parent() {
		System.out.println("Parent无参构造函数");
	}
}
class Child extends Parent{
	{
		System.out.println("Child代码块");
	}
	static {
		System.out.println("Child静态代码块");
	}
	public Child() {
		System.out.println("Child无参构造函数");
	}	
	public static void main(String[] args) {
		new Child();

	}
}
1234567891011121314151617181920212223242526
```

初始化Child()类的执行结果：

```java
Parent静态代码块
Child静态代码块
Parent代码块
Parent无参构造函数
Child代码块
Child无参构造函数
123456
```

## 总结以上类的初始化顺序为

1. 父类静态代码块
2. 子类静态代码块
3. 父类代码块
4. 父类无参构造函数
5. 子类代码块
6. 子类无参构造函数

再把文章刚开始的代码修改一下，在子类的带参构造函数中加入super(s)，代码即可正常编译运行

```java
class Base{
    public Base(String s){
       	 System.out.print("B");
    }
}
public class Derived extends Base{
    public Derived (String s) {
    	super(s);
        System.out.print("D");
	}
    public static void main(String[] args){
       	new Derived("C");
    }
}
1234567891011121314
```

## 总结一下

在调用子类构造器之前，会**先调用父类构造器**，当子类构造器中没有使用"super(参数或无参数)"指定调用父类构造器时，是**默认调用父类的无参构造器**，如果父类中包含有参构造器，却没有无参构造器，则在子类构造器中**一定要使用“super(参数)”指定调用父类的有参构造器**，不然就会报错

补充：

1.首先，初始化父类中的静态成员变量和静态代码块，按照在程序中出现的顺序初始化；
2.然后，初始化子类中的静态成员变量和静态代码块，按照在程序中出现的顺序初始化；
3.其次，初始化父类的普通成员变量和代码块，在执行父类的[构造方法](https://so.csdn.net/so/search?q=构造方法&spm=1001.2101.3001.7020)；
4.最后，初始化子类的普通成员变量和代码块，在执行子类的构造方法；
