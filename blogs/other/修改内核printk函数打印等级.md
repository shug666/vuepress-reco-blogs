---
title: Android 修改内核printk函数打印等级
date: 2023-09-15
tags:
 - android
categories: 
 - android
sticky: 
   true
---

1、前言
-----------------------------------------------------------------------

> 内核是很庞大的，其中的打印信息也很多，太多的打印信息会拖慢内核的启动速度，也不利于我们查找有用的打印信息。于是内核有了打印优先级的机制，在用printk()打印信息时需要设置优先级，如果不设置优先级也会有一个默认的优先级。只有打印优先级高于控制台输出的优先级时打印信息才会被打印出来，于是我们可以通过修改控制台输出的优先级来控制打印信息的多少，根据想要查看的打印信息的优先级来修改控制台输出的优先级，这样可以确保能打印出我们想要的打印信息，又尽可能少的打印不需要的信息。

2、console\_printk数组
--------------------------------------------------------------------------------------

```c
//内核打印等级
#define	KERN_EMERG		"<0>"	/* system is unusable	最高级别，一般只用来打印崩溃信息*/
#define	KERN_ALERT		"<1>"	/* action must be taken immediately	 需要立即处理的信息*/
#define	KERN_CRIT		"<2>"	/* critical conditions	关键信息：严重的硬件和软件错误	*/
#define	KERN_ERR		"<3>"	/* error conditions		 用来显示硬件错误	*/
#define	KERN_WARNING	"<4>"	/* warning conditions	显示不会造成严重错误的警告信息		*/
#define	KERN_NOTICE		"<5>"	/* normal but significant condition	 显示需要引起注意的信息*/
#define	KERN_INFO		"<6>"	/* informational	　显示一般信息，例如驱动所发现的硬件列表		*/
#define	KERN_DEBUG		"<7>"	/* debug-level messages		用来显示调试信息	*/

/* printk's without a loglevel use this.. */
#define DEFAULT_MESSAGE_LOGLEVEL 4 /* KERN_WARNING */

/* We show everything that is MORE important than this.. */
#define MINIMUM_CONSOLE_LOGLEVEL 1 /* Minimum loglevel we let people use */
#define DEFAULT_CONSOLE_LOGLEVEL 7 /* anything MORE serious than KERN_DEBUG */

int console_printk[4] = {
	DEFAULT_CONSOLE_LOGLEVEL,	/* console_loglevel */
	DEFAULT_MESSAGE_LOGLEVEL,	/* default_message_loglevel */
	MINIMUM_CONSOLE_LOGLEVEL,	/* minimum_console_loglevel */
	DEFAULT_CONSOLE_LOGLEVEL,	/* default_console_loglevel */
};

```

> console\_printk数组在kernel/printk.c里定义，其中4个元素是默认的优先级。  
>
> (1)**DEFAULT\_CONSOLE\_LOGLEVEL**:控制台日志级别，优先级高于该值的消息将被打印至控制台;  
>
> (2)**DEFAULT\_MESSAGE\_LOGLEVEL**:默认的消息日志级别，将用该优先级来打印没有指定优先级的消息。
>
> (3)**MINIMUM\_CONSOLE\_LOGLEVEL**:控制台日志级别可被设置的最小值(最高优先级)。  
>
> (4)**DEFAULT\_CONSOLE\_LOGLEVEL**:默认的控制台日志级别，控制台日志级别的缺省值。

3、源代码修改控制台输出级别
---------------------------------------------------------------------------------

> 将DEFAULT\_CONSOLE\_LOGLEVEL修改为你想要的等级，一般设置成你想要打印出的消息的等级，这样可以确保打印出你需要的信息，又尽可能少的打印无用信息。

4、动态修改控制台输出等级
--------------------------------------------------------------------------------

### 4.1、查看当前的控制台输出等级

```sh
cat /proc/sys/kernel/printk 
7                            4                    1                  7
当前的日志级别	未明确指定日志级别的默认消息级别	最小允许的日志级别	引导时的默认日志级别
```

### 4.2、修改当前的输出等级

```sh
echo 4 > proc/sys/kernel/printk
```

> 上面就是通过echo命令往printk文件写数据，将当前的日志级别改为4；

5、频繁打印带来的问题
------------------------------------------------------------------------------

> (1)慢速控制台设备输出过多的消息导致系统变慢，因为控制台会频繁的占用CPU；  
>
> (2)当程序出错后会不停的打印出错信息。虽然我们设置的输出等级，但是一般都会运行printk输出出错打印，程序正常运行时不会有打印，但是当程序出错后，程序有可能会不停的打印出错信息，这样也会造成输出巨量消息；

6、限制频繁打印信息的措施
--------------------------------------------------------------------------------

### 6.1、printk\_ratelimit()函数

```c
if(printk_ratelimit())
{	
printk(KERN_NOTICE "The printer is still on fire\n");
}
```

> printk\_ratelimit()通过跟踪发送到控制台的消息数量，如果输出的速度超过一个阈值则返回零，从而避免发送重复消息；

### 6.2、printk\_ratelimit和printk\_ratelimit\_burst

```sh
~ # cat /proc/sys/kernel/printk_ratelimit
5
~ # 
~ # 
~ # cat /proc/sys/kernel/printk_ratelimit_burst 
10
```

> (1)printk\_ratelimit文件：在重新打开消息之前应该等待的秒数；  
> (2)printk\_ratelimit\_burst文件：在进行速度限制之前可以接受的消息数；

 

## [printk()和printf()的比较](https://blog.csdn.net/weixin_42031299/article/details/121448380)

但是在Android中，直接使用printf是无法将信息输出到串口中显示的（除非直接通过串口运行可执行程序）。为了继续使用printf，可以使用重定向的方式，将printf的输出从STDOUT转到文件中，同时方便串口输入命令调试，也不影响日志的记录。

freopen("/data/flash/stdout.txt","w",stdout);

仅需在使用printf前调用上面的函数即可，同时在使用printf后为了保证输出及时写入文件，需要使用fflush函数。当然，也有说可以调用 setvbuf(stdout,NULL,_IONBF,0)来完成缓冲区的设置，但是不一定有效。


本文转自 [https://blog.csdn.net/weixin\_42031299/article/details/121734876](https://blog.csdn.net/weixin_42031299/article/details/121734876)，如有侵权，请联系删除。