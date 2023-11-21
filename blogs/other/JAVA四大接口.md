---
title: JAVA四大接口
date: 2023-05-08
tags:
 - java
categories: 
 - java
sticky: 
   true
---

 java8出现了四大接口：消费型，供给型，函数式，断言式

## 一、Comsumer接口

这个接口里面有两个方法，一个叫accept，一个叫andThen；

### （1）accept：

在创建一个消费型的实现类时，要传入一个泛型参数，这个泛型参数也是accept的接受参数类型，如下例代码：

```java
public class Main {
    public static void main(String[] args) {
        //创建一个实现类，并实现其方法，注意这里需要指明泛型。
        Test("lbwnb", new Consumer<String>() {
            @Override
            public void accept(String s) {
                System.out.println("说得好:" + s);    //说得好:lbwnb
            }
        });
    }

    //创建一个接受消费实现类的静态方法，在里卖弄直接调用里面的accept函数
    public static void Test(String data,Consumer<String> consumer){
        consumer.accept(data);
    }

}
```

        消费型接口有一个显然得特点：有来无回。它接受一个参数，在里面执行一些操作，执行完过后是没有返回值的。

### （2）andThen:

这个方法也与Function接口的andThen相似，也就是你传入的另外一个方法的执行顺序，下面来看示例：

```java
public class Main {
    public static void main(String[] args) {
        Consumer<String> consumer1=new Consumer<String>() {
            @Override
            public void accept(String s) {
                System.out.println("小明说："+s);
            }
        };
        Consumer<String> consumer2=new Consumer<String>() {
            @Override
            public void accept(String s) {
                System.out.println("小红说："+s);
            }
        };
        //小明说：lbwnb
        //小红说：lbwnb
        consumer1.andThen(consumer2).accept("lbwnb");
    }
}

```

        这个方法允许对传入的数据进行操作，但是要注意，只是对数据源进行操作，如果你的操作并不会直接或者间接改变数据源，那很遗憾，你第一个操作不会影响到操作二的数据。

## 二、Supplier接口

        这个接口相对来说理解就更加的简单，因为它只有一个方法：get()。这个方法没有参数传入，只有返回值，有小伙伴就疑问了，没有参数传入，那岂不是返回的数值是一个定值咯，其实不然，只要你合理运用就会有奇特的效果。
    
        下面来看代码：

先创建一个Student类，给每个字段配上getter，setter。并且重写toString方法。

```java
public class Student {
    private String name;
    private Integer age;


    public Student(String name, Integer age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    //重写toString方法
    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

然后开始使用：

```java
public class Main {
    public static void main(String[] args) {
        //创建学生列表，并添加数据。
        List<Student> students=new ArrayList<>();
        students.add(new Student("lbw",18));
        students.add(new Student("小刚",17));
        students.add(new Student("小红",26));
        students.add(new Student("小川",13));
        students.add(new Student("李华",19));

        //调用方法--返回已成年的学生列表
        Test(students).forEach(e->{
            System.out.println(e);
        });
    }
    public static List<Student> Test(List<Student> list){

        Supplier<List<Student>> supplier=new Supplier<List<Student>>() {
            @Override
            public List<Student> get() {
                //创建一个返回列表
                List<Student> res= new ArrayList();
                //将年龄大于等于18的加入列表
                list.forEach(e->{
                    if(e.getAge()>=18){
                        res.add(e);
                    }
                });
                //返回列表
                return res;
            }
        };

        return supplier.get();
    }
}

```

        这个例子中，它主要是利用作用域特点的方式来获取外界的值（传入学生列表，对列表进行滤）。有人就问，我为啥直接不省去这个接口实现类，直接将逻辑写在里面，但是你得考虑它的万一有复杂的逻辑，或者其他需求呢。

## 三、Function接口

```java
@FunctionalInterface
public interface Function<T, R> {

    R apply(T t);

    default <V> Function<V, R> compose(Function<? super V, ? extends T> before) {
        Objects.requireNonNull(before);
        return (V v) -> apply(before.apply(v));
    }


    default <V> Function<T, V> andThen(Function<? super R, ? extends V> after) {
        Objects.requireNonNull(after);
        return (T t) -> after.apply(apply(t));
    }


    static <T> Function<T, T> identity() {
        return t -> t;
    }
}
```

### （1）apply：

创建一个函数式接口，你需要制订两个泛型参数（姑且这么叫吧）。第一个泛型参数是apply传入的参数类型，第二个是返回参数类型。

你创建了一个Function实现类（用的匿名内部内）：你可以通过调用函数的apply来使用该函数。

```java
        //Function f= (Function<String, String>) s -> "我想说"+s; lambda表达式
        Function f=new Function<String, String>() {
            @Override
            public String apply(String s) {
                return "我想说"+s;
            }
        };
        String res=(String) f.apply("lbwnb");
        System.out.println(res);
```

### （2）compose：

你看了源码就知道这玩意儿也是返回一个Function：那这玩意儿有啥用呢：

它允许接受一个Function，返回一个新的Function，他源码也是用的lambda表达式，基础薄弱的同学可能看不懂，我就重新写一下（我写的看不懂也是正常的，只是让你们知道个流程）：

```java
        Function f1=new Function<Integer, Integer>() {
            @Override
            public Integer apply(Integer n) {
                return n+1;
            }

            @Override
            public <V> Function<V, Integer> compose(Function<? super V, ? extends   Integer> before) {
                Function<Integer,Integer> that=this;  //保存this的指向
                return new Function<V, Integer>() {
                    @Override
                    public Integer apply(V v) {
                        Integer tmp=before.apply(v);  //传入函数先调用
                        return that.apply(tmp);        //返回外部this调用的apply的值
                    }
                };
            }
        };
```

 然后我们就可以开始我们的使用流程

```java
Function f1=new Function<Integer, Integer>() {
            @Override
            public Integer apply(Integer n) {
                return n+1;
            }
        };
        Function f2=new Function<Integer, Integer>() {
            @Override
            public Integer apply(Integer n) {
                return n*n;
            }
        };
        //先执将2的值传f2的方法执行完过后，再将返回值作为f1的apply参数
        //所以先是2*2=4 再4+1=5
        Integer res=(Integer) f1.compose(f2).apply(2);
        System.out.println(res);
```

使用这个函数就可以嵌套的控制函数的执行顺序，举个简单的例子（可能不完全恰当哈）：a操作依赖于b，b依赖于c，c依赖于d，所以你调用函数的顺序是d，c，b，a。这样有个啥子问题呢，你这样代码量少还好，要是逻辑啥的强了，代码多了，你就不能很好的确定他们的调用顺序了，使用函数式接口，就做到了一个串联，环环相扣，所有的执行操作，中间产生的数据都不会暴露给外部，外部无法修改，读取（也算是保证了数据流的安全）。我们只管调用。你无需还要中间变量进行接受，并且你不能保证中间产生的数据是否会被修改。这只是衍生出的一小部分使用而已。

###  （3）andThen

这个方法于上一个相反，是先调用this指向的apply，再将返回值给传入的函数实现类的apply

```java
       Function f1=new Function<Integer, Integer>() {
            @Override
            public Integer apply(Integer n) {
                return n + 1;
            }
        };
        Function f2=new Function<Integer, Integer>() {
            @Override
            public Integer apply(Integer n) {
                return n*n;
            }
        };
        Integer res=(Integer) f1.andThen(f2).apply(2);
        System.out.println(res);
```

 res的值显然就是9，   2+1=3；3\*3=9

调用顺序而已

### （4）identify

        最后这个是一个静态方法，它也是返回一个Function函数，这个函数的默认实现  你看源码就知道它是直接返回你传入的那个值，就是默认apply实现：t->t  这样；有啥大用我不知道，但它确实可以快速生成一个Function实现类，用于你需要一个Function实现类，而你不想它有啥操作，直接返回原来的值就行。

```java
//1
System.out.println(Function.<Integer>identity().apply(1));
```



## 四、Predicate接口

### （1）test

这个方法就是你需要去实现的一个方法，这个方法接受一个参数，返回一个boolean值，你可以用于判断传入的参数是否符合某种要求。

```java
       //lambda表达式
       Predicate<Student> predicate=o->o.getAge()>=18;
       //返回真如果传入的数值大于等于18
       Predicate<Student> predicate1=new Predicate<Student>() {
           @Override
           public boolean test(Student s) {
               return s.getAge() >= 18;
           }
       };
       //添加数据
        List<Student> students=new ArrayList<>();
        students.add(new Student("lbw",18));
        students.add(new Student("小刚",17));
        students.add(new Student("小红",26));
        students.add(new Student("小川",13));
        students.add(new Student("李华",19));

        //对数据源，转化成stream流用过滤器过滤未成年学生，最后收集成列表
        List<Student>         
        list=students.stream().filter(predicate).collect(Collectors.toList());
        //打印数据
        list.forEach(e-> System.out.println(e));
```

这里主要的思路就是创建一个实现类，如果传入的Student对象的年龄满足成年，就返回true，利用过滤器将不满足数据过滤掉（stream流后面会讲的）

### （2）and

这玩意儿接受一个predicate的实现类，返回一个实现类，表明只要传入的实现类和和本来的实现类都满足才返回true

```java
      //名字包含‘小’字的学生
       Predicate<Student> predicate1=o->o.getName().contains("小");
       //返回真如果传入的数值大于等于18
       Predicate<Student> predicate2=new Predicate<Student>() {
           @Override
           public boolean test(Student s) {
               return s.getAge() >= 18;
           }
       };
        //返回一个新的的实现类。即年龄大于等于18并且名字包含‘小’字的同学
       Predicate<Student> predicate=predicate1.and(predicate2);
       //添加数据
        List<Student> students=new ArrayList<>();
        students.add(new Student("lbw",18));
        students.add(new Student("小刚",17));
        students.add(new Student("小红",26));
        students.add(new Student("小川",13));
        students.add(new Student("李华",19));

        //对数据源，转化成stream流用过滤器过滤学生，最后收集成列表
        List<Student>             
        list=students.stream().filter(predicate).collect(Collectors.toList());
        //打印数据
        list.forEach(e-> System.out.println(e));
```

### （3）or

这个就相当于and那个了，这个是只要有一个满足那就是true，都不满足才会是false

### （4）negate

这个单词你用翻译器翻译过来就是否定的意思，意思就是说接受一个它会返回一个实现类，但内部的test方法是与原来test方法相反的结果。

```java
//返回真如果传入的数值大于等于18
       Predicate<Student> predicate=new Predicate<Student>() {
           @Override
           public boolean test(Student s) {
               return s.getAge() >= 18;
           }
       };
       //添加数据
        List<Student> students=new ArrayList<>();
        students.add(new Student("lbw",18));
        students.add(new Student("小刚",17));
        students.add(new Student("小红",26));
        students.add(new Student("小川",13));
        students.add(new Student("李华",19));

        //对数据源，转化成stream流用过滤器过滤学生，最后收集成列表（这里调用的negate，返回与test相反的结果）
        List<Student> list=students.stream().filter(predicate.negate()).collect(Collectors.toList());
        //打印数据
        list.forEach(e-> System.out.println(e));
        //Student{name='小刚', age=17}
        //Student{name='小川', age=13}
    }
```

这个附上源码：

```java
default Predicate<T> negate() {
        return (t) -> !test(t);
    }
```

### （5）isEqual

这个方法是一个静态方法，它允许传入一个对象，然后返回一个是否Predicate实现类，内部test判断传入参数是否等于该对象：

```java
        Student student=new Student("lbw",18);
        Student student1=new Student("lbw",18);
        //返回一个判断是否等于student的Predicate实现类
        Predicate predicate=Predicate.isEqual(student);
        //true
        System.out.println(predicate.test(student));
        //false
        System.out.println(predicate.test(student1));
```

附上源代码：

```java
    static <T> Predicate<T> isEqual(Object targetRef) {
        return (null == targetRef)
                ? Objects::isNull
                : object -> targetRef.equals(object);
    }
```

注意，它内部是有个优化的哈。如果你传入的是null，那么它后续就是判断是否为空就行了。

本文转自 [https://blog.csdn.net/qq\_61592687/article/details/127722564?spm=1001.2014.3001.5502](https://blog.csdn.net/qq_61592687/article/details/127722564?spm=1001.2014.3001.5502)，如有侵权，请联系删除。