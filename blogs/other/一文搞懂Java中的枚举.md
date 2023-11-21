---
title: 一文搞懂Java中的枚举
date: 2023-09-15
tags:
 - java
categories: 
 - java
sticky: 
   true
---

> 知识点

![](https://raw.githubusercontent.com/shug666/image/main/images/1218593-20200506175014574-278182070.webp)

概念
--

`enum`的全称为 enumeration， 是 JDK 1.5 中引入的新特性。

在Java中，被 `enum`关键字修饰的类型就是枚举类型。形式如下：

```java
enum Color { RED, GREEN, BLUE }
```

如果枚举不添加任何方法，**枚举值默认为从0开始的有序数值**。以 Color 枚举类型举例，它的枚举常量依次为 `RED：0，GREEN：1，BLUE：2`。

**枚举的好处**：可以将常量组织起来，统一进行管理。

**枚举的典型应用场景**：错误码、状态机等。

### 枚举类型的本质

尽管 `enum`看起来像是一种新的数据类型，事实上，**enum是一种受限制的类，并且具有自己的方法**。

创建enum时，编译器会为你生成一个相关的类，这个类继承自 `java.lang.Enum`。

`java.lang.Enum`类声明

```java
public abstract class Enum<E extends Enum<E>>
        implements Comparable<E>, Serializable { ... }
```

枚举的方法
-----

在enum中，提供了一些基本方法：

`values()`：返回 enum 实例的数组，而且该数组中的元素严格保持在 enum 中声明时的顺序。

`name()`：返回实例名。

`ordinal()`：返回实例声明时的次序，从0开始。

`getDeclaringClass()`：返回实例所属的 enum 类型。

`equals()`：判断是否为同一个对象。

可以使用 `==`来比较`enum`实例。

此外，`java.lang.Enum`实现了`Comparable`和 `Serializable`接口，所以也提供 `compareTo()`方法。[关于Java序列化你应该知道的一切](http://mp.weixin.qq.com/s?__biz=MzI3ODcxMzQzMw==&mid=2247484372&idx=1&sn=381af66344b4b50d033c38e51bcb0e21&chksm=eb5386e2dc240ff4fbee79af445ffeb3856da484a8f5206bcaf4531f0d510564943b213f948c&scene=21#wechat_redirect)，推荐大家阅读。

**例：展示enum的基本方法**

```java
public class EnumMethodDemo {
    enum Color {RED, GREEN, BLUE;}
    enum Size {BIG, MIDDLE, SMALL;}
    public static void main(String args[]) {
        System.out.println("=========== Print all Color ===========");
        for (Color c : Color.values()) {
            System.out.println(c + " ordinal: " + c.ordinal());
        }
        System.out.println("=========== Print all Size ===========");
        for (Size s : Size.values()) {
            System.out.println(s + " ordinal: " + s.ordinal());
        }

        Color green = Color.GREEN;
        System.out.println("green name(): " + green.name());
        System.out.println("green getDeclaringClass(): " + green.getDeclaringClass());
        System.out.println("green hashCode(): " + green.hashCode());
        System.out.println("green compareTo Color.GREEN: " + green.compareTo(Color.GREEN));
        System.out.println("green equals Color.GREEN: " + green.equals(Color.GREEN));
        System.out.println("green equals Size.MIDDLE: " + green.equals(Size.MIDDLE));
        System.out.println("green equals 1: " + green.equals(1));
        System.out.format("green == Color.BLUE: %b\n", green == Color.BLUE);
    }
}

```

**输出**

```java
=========== Print all Color ===========
RED ordinal: 0
GREEN ordinal: 1
BLUE ordinal: 2
=========== Print all Size ===========
BIG ordinal: 0
MIDDLE ordinal: 1
SMALL ordinal: 2
green name(): GREEN
green getDeclaringClass(): class org.zp.javase.enumeration.EnumDemo$Color
green hashCode(): 460141958
green compareTo Color.GREEN: 0
green equals Color.GREEN: true
green equals Size.MIDDLE: false
green equals 1: false
green == Color.BLUE: false
```

枚举的特性
-----

枚举的特性，归结起来就是一句话：

> **除了不能继承，基本上可以将 `enum`看做一个常规的类**。

但是这句话需要拆分去理解，让我们细细道来。

### 枚举可以添加方法

在概念章节提到了，**枚举值默认为从0开始的有序数值**。那么问题来了：如何为枚举显示的赋值。

#### Java 不允许使用 = 为枚举常量赋值

如果你接触过C/C++，你肯定会很自然的想到赋值符号 `=`。在C/C++语言中的enum，可以用赋值符号`=`显示的为枚举常量赋值；但是 ，很遗憾，**Java 语法中却不允许使用赋值符号 `=`为枚举常量赋值**。

**例：C/C++ 语言中的枚举声明**

```java
typedef enum{
    ONE = 1,
    TWO,
    THREE = 3,
    TEN = 10
} Number;
```

#### 枚举可以添加普通方法、静态方法、抽象方法、构造方法

Java 虽然不能直接为实例赋值，但是它有更优秀的解决方案：**为 enum 添加方法来间接实现显示赋值**。

创建 `enum`时，可以为其添加多种方法，甚至可以为其添加构造方法。

**注意一个细节：如果要为enum定义方法，那么必须在enum的最后一个实例尾部添加一个分号。此外，在enum中，必须先定义实例，不能将字段或方法定义在实例前面。否则，编译器会报错。**

**例：全面展示如何在枚举中定义普通方法、静态方法、抽象方法、构造方法**

```java
public enum ErrorCode {
    OK(0) {
        public String getDescription() {
            return "成功";
        }
    },
    ERROR_A(100) {
        public String getDescription() {
            return "错误A";
        }
    },
    ERROR_B(200) {
        public String getDescription() {
            return "错误B";
        }
    };

    private int code;

    private ErrorCode(int number) {
        this.code = number;
    }
    public int getCode() {
        return code;
    }
    public abstract String getDescription();
    public static void main(String args[]) {
        for (ErrorCode s : ErrorCode.values()) {
            System.out.println("code: " + s.getCode() + ", description: " + s.getDescription());
        }
    }
}
```

注：上面的例子并不可取，仅仅是为了展示枚举支持定义各种方法。下面是一个简化的例子

**例：一个错误码枚举类型的定义**

本例和上例的执行结果完全相同。

```java
public enum ErrorCodeEn {
    OK(0, "成功"),
    ERROR_A(100, "错误A"),
    ERROR_B(200, "错误B");

    ErrorCodeEn(int number, String description) {
        this.code = number;
        this.description = description;
    }
    private int code;
    private String description;
    public int getCode() {
        return code;
    }
    public String getDescription() {
        return description;
    }
    public static void main(String args[]) {
        for (ErrorCodeEn s : ErrorCodeEn.values()) {
            System.out.println("code: " + s.getCode() + ", description: " + s.getDescription());
        }
    }
}
```

### 枚举可以实现接口

**`enum`可以像一般类一样实现接口。**

同样是实现上一节中的错误码枚举类，通过实现接口，可以约束它的方法。

```java
public interface INumberEnum {
    int getCode();
    String getDescription();
}

public enum ErrorCodeEn2 implements INumberEnum {
    OK(0, "成功"),
    ERROR_A(100, "错误A"),
    ERROR_B(200, "错误B");

    ErrorCodeEn2(int number, String description) {
        this.code = number;
        this.description = description;
    }

    private int code;
    private String description;

    @Override
    public int getCode() {
        return code;
    }

    @Override
    public String getDescription() {
        return description;
    }
}
```

### 枚举不可以继承

**enum 不可以继承另外一个类，当然，也不能继承另一个 enum 。**

因为 `enum`实际上都继承自 `java.lang.Enum`类，而 Java 不支持多重继承，所以 `enum`不能再继承其他类，当然也不能继承另一个 `enum`。另外，关注微信公众号：Java技术栈，在后台回复：**java**，可以获取我整理的 N 篇最全 Java 教程，都是干货。

枚举的应用场景
-------

### 组织常量

在JDK1.5 之前，在Java中定义常量都是`public static final TYPE a;`这样的形式。有了枚举，你可以将有关联关系的常量组织起来，使代码更加易读、安全，并且还可以使用枚举提供的方法。

#### 枚举声明的格式

**注：如果枚举中没有定义方法，也可以在最后一个实例后面加逗号、分号或什么都不加。**

下面三种声明方式是等价的：

```java
enum Color { RED, GREEN, BLUE }
enum Color { RED, GREEN, BLUE, }
enum Color { RED, GREEN, BLUE; }
```

### switch 状态机

我们经常使用switch语句来写状态机。JDK7以后，switch已经支持 `int`、`char`、`String`、`enum`类型的参数。《[switch case 支持的 6 种数据类型](http://mp.weixin.qq.com/s?__biz=MzI3ODcxMzQzMw==&mid=2247485927&idx=2&sn=d1c4521b27d4b473aea09386b4794b64&chksm=eb538cd1dc2405c7b553b7d0c16a9d28564778a0b0856b27ab7b7697ec27ba8a6a8e23dddb36&scene=21#wechat_redirect)》这篇总结的比较全。这几种类型的参数比较起来，使用枚举的switch代码更具有可读性。

```java
enum Signal {RED, YELLOW, GREEN}

public static String getTrafficInstruct(Signal signal) {
    String instruct = "信号灯故障";
    switch (signal) {
        case RED:
            instruct = "红灯停";
            break;
        case YELLOW:
            instruct = "黄灯请注意";
            break;
        case GREEN:
            instruct = "绿灯行";
            break;
        default:
            break;
    }
    return instruct;
}
```

### 组织枚举

可以将类型相近的枚举通过接口或类组织起来。

但是一般用接口方式进行组织。

原因是：Java接口在编译时会自动为enum类型加上`public static`修饰符；Java类在编译时会自动为 `enum`类型加上static修饰符。看出差异了吗？没错，就是说，在类中组织 `enum`，如果你不给它修饰为 `public`，那么只能在本包中进行访问。

**例：在接口中组织 enum**

```java
public interface Plant {
    enum Vegetable implements INumberEnum {
        POTATO(0, "土豆"),
        TOMATO(0, "西红柿");

        Vegetable(int number, String description) {
            this.code = number;
            this.description = description;
        }

        private int code;
        private String description;

        @Override
        public int getCode() {
            return 0;
        }

        @Override
        public String getDescription() {
            return null;
        }
    }

    enum Fruit implements INumberEnum {
        APPLE(0, "苹果"),
        ORANGE(0, "桔子"),
        BANANA(0, "香蕉");

        Fruit(int number, String description) {
            this.code = number;
            this.description = description;
        }

        private int code;
        private String description;

        @Override
        public int getCode() {
            return 0;
        }

        @Override
        public String getDescription() {
            return null;
        }
    }
}
```

**例：在类中组织 enum**

本例和上例效果相同。

```java
public class Plant2 {
    public enum Vegetable implements INumberEnum {...}
    public enum Fruit implements INumberEnum {...}
}
```

### 策略枚举

EffectiveJava中展示了一种策略枚举。这种枚举通过枚举嵌套枚举的方式，将枚举常量分类处理。

这种做法虽然没有switch语句简洁，但是更加安全、灵活。

**例：EffectvieJava中的策略枚举范例**

```java
enum PayrollDay {
    MONDAY(PayType.WEEKDAY), TUESDAY(PayType.WEEKDAY), WEDNESDAY(
            PayType.WEEKDAY), THURSDAY(PayType.WEEKDAY), FRIDAY(PayType.WEEKDAY), SATURDAY(
            PayType.WEEKEND), SUNDAY(PayType.WEEKEND);

    private final PayType payType;

    PayrollDay(PayType payType) {
        this.payType = payType;
    }

    double pay(double hoursWorked, double payRate) {
        return payType.pay(hoursWorked, payRate);
    }

    private enum PayType {
        WEEKDAY {
            double overtimePay(double hours, double payRate) {
                return hours <= HOURS_PER_SHIFT ? 0 : (hours - HOURS_PER_SHIFT)
                        * payRate / 2;
            }
        },
        WEEKEND {
            double overtimePay(double hours, double payRate) {
                return hours * payRate / 2;
            }
        };
        private static final int HOURS_PER_SHIFT = 8;

        abstract double overtimePay(double hrs, double payRate);

        double pay(double hoursWorked, double payRate) {
            double basePay = hoursWorked * payRate;
            return basePay + overtimePay(hoursWorked, payRate);
        }
    }
}
```

**测试**

```java
System.out.println("时薪100的人在周五工作8小时的收入：" + PayrollDay.FRIDAY.pay(8.0, 100));
System.out.println("时薪100的人在周六工作8小时的收入：" + PayrollDay.SATURDAY.pay(8.0, 100));
```

EnumSet和EnumMap
---------------

Java 中提供了两个方便操作enum的工具类——EnumSet 和 EnumMap。

`EnumSet`是枚举类型的高性能 `Set`实现。它要求放入它的枚举常量必须属于同一枚举类型。  
`EnumMap`是专门为枚举类型量身定做的 `Map`实现。虽然使用其它的 Map 实现（如HashMap）也能完成枚举类型实例到值得映射，但是使用 EnumMap 会更加高效：它只能接收同一枚举类型的实例作为键值，并且由于枚举类型实例的数量相对固定并且有限，所以 EnumMap 使用数组来存放与枚举类型对应的值。这使得 EnumMap 的效率非常高。

```java
System.out.println("EnumSet展示");
EnumSet<ErrorCodeEn> errSet = EnumSet.allOf(ErrorCodeEn.class);
for (ErrorCodeEn e : errSet) {
    System.out.println(e.name() + " : " + e.ordinal());
}

System.out.println("EnumMap展示");
EnumMap<StateMachine.Signal, String> errMap = new EnumMap(StateMachine.Signal.class);
errMap.put(StateMachine.Signal.RED, "红灯");
errMap.put(StateMachine.Signal.YELLOW, "黄灯");
errMap.put(StateMachine.Signal.GREEN, "绿灯");
for (Iterator<Map.Entry<StateMachine.Signal, String>> iter = errMap.entrySet().iterator(); iter.hasNext();) {
    Map.Entry<StateMachine.Signal, String> entry = iter.next();
    System.out.println(entry.getKey().name() + " : " + entry.getValue());
}
```

**推荐去我的博客阅读更多：**

1.[Java JVM、集合、多线程、新特性系列教程](http://www.javastack.cn/categories/Java/)

2.[Spring MVC、Spring Boot、Spring Cloud 系列教程](http://www.javastack.cn/categories/Spring/)

3.[Maven、Git、Eclipse、Intellij IDEA 系列工具教程](http://www.javastack.cn/categories/%E5%B7%A5%E5%85%B7/)

4.[Java、后端、架构、阿里巴巴等大厂最新面试题](http://www.javastack.cn/categories/%E9%9D%A2%E8%AF%95%E9%A2%98/)

觉得不错，别忘了点赞+转发哦！

  

本文转自 [https://www.cnblogs.com/javastack/p/12837890.html](https://www.cnblogs.com/javastack/p/12837890.html)，如有侵权，请联系删除。