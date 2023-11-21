---
title: logcat 日志工具使用
date: 2023-08-21
tags:
 - adb命令
categories: 
 - adb命令
sticky: 
   true
---

Logcat（Android日志工具）
----------------------------------------------------------------------------

Logcat 是一个命令行工具，用于转储系统消息日志，包括设备抛出错误时的堆栈轨迹，以及从应用使用 `Log` 类写入的消息。

**日志记录系统概览**

Android 日志记录系统是系统进程 `logd` 维护的一组结构化环形缓冲区。这组可用的缓冲区是固定的，并由系统定义。最相关的缓冲区为：`main`（用于存储大多数应用日志）、`system`（用于存储源自 Android 操作系统的消息）和 `crash`（用于存储崩溃日志）。每个日志条目都包含一个优先级（`VERBOSE`、`DEBUG`、`INFO`、`WARNING`、`ERROR` 或 `FATAL`）、一个标识日志来源的标记以及实际的日志消息。

日志记录系统的主接口是共享库 `liblog` 及其头文件 `<android/log.h>`。所有语言特定的日志记录工具最终都会调用函数 `__android_log_write`。默认情况下，它会调用函数 `__android_log_logd_logger`，该函数使用套接字将日志条目发送到 `logd`。从 API 级别 30 开始，可通过调用 `__android_set_log_writer` 更改日志记录函数。

运行 `adb logcat` 显示的日志要经过四个级别的过滤：

1.  编译时过滤：根据编译设置，某些日志可能会从二进制文件中完全移除。例如，可以将 ProGuard 配置为从 Java 代码中移除对 `Log.d` 的调用。
    
2.  系统属性过滤：`liblog` 会查询一组系统属性以确定要发送到 `logd` 的最低严重级别。如果日志具有 `MyApp` 标记，系统会检查以下属性，并且日志应包含最低严重级别的第一个字母（`V`、`D`、`I`、`W`、`E` 或 `S` 以停用所有日志）：
    
3.  *   `log.tag.MyApp`
    *   `persist.log.tag.MyApp`
    *   `log.tag`
    *   `persist.log.tag`
4.  应用过滤：如果未设置任何属性，`liblog` 会使用 `__android_log_set_minimum_priority` 设置的最低优先级。默认设置为 `INFO`。
    
5.  显示过滤：`adb logcat` 支持其他可减少 `logd` 显示的日志数量的过滤条件。
    

**命令行语法**

如需通过 adb shell 运行 Logcat，一般用法如下：

```sh
[adb] logcat [<option>] ... [<filter-spec>] ...
```

如需获取 `logcat` 在线帮助，请启动设备，然后执行以下命令：

```sh
adb logcat --help
```

_选项介绍_

| 选项 | 说明 |
| :-- | :-- |
| `-b <buffer>` | 加载可供查看的备用日志缓冲区，例如 `events` 或 `radio`。默认使用 `main`、`system` 和 `crash` 缓冲区集。请参阅[查看备用日志缓冲区](https://developer.android.com/tools/debugging/debugging-log#alternativeBuffers)。 |
| `-c, --clear` | 清除（清空）所选的缓冲区并退出。默认缓冲区集为 `main`、`system` 和 `crash`。如需清除所有缓冲区，请使用 `-b all -c`。 |
| `-e <expr>, --regex=<expr>` | 只输出日志消息与 `<expr>` 匹配的行，其中 `<expr>` 是正则表达式。<br />比如：adb logcat -e 客户端请求数据 -m 5<br />打印日志中包含“客户端请求数据”字样的5条数据 |
| `-m <count>, --max-count=<count>` | 输出 `<count>` 行后退出。这样是为了与 `--regex` 配对，但可以独立运行。 |
| `--print` | 与 `--regex` 和 `--max-count` 配对，使内容绕过正则表达式过滤器，但仍能够在获得适当数量的匹配时停止。 |
| `-d` | 将日志转储到屏幕并退出。 |
| `-f <filename>` | 将日志消息输出写入 `<filename>`。默认值为 `stdout`。 |
| `-g, --buffer-size` | 输出指定日志缓冲区的大小并退出。 |
| `-n <count>` | 将轮替日志的数量上限设置为 `<count>`。默认值为 4。需要使用 `-r` 选项。 |
| `-r <kbytes>` | 每输出 `<kbytes>` 时轮替日志文件。默认值为 16。需要 `-f` 选项。 |
| `-s` | 相当于过滤器表达式 `'*:S'`；它将所有标记的优先级设为“静默”，并用于放在可添加内容的过滤器表达式列表之前。如需了解详情，请转到介绍[过滤日志输出](https://developer.android.com/studio/command-line/logcat#filteringOutput)的部分。 |
| `-v <format>` | 设置日志消息的输出格式。默认格式为 `threadtime`。如需查看支持的格式列表，请参阅介绍[控制日志输出格式](https://developer.android.com/studio/command-line/logcat#outputFormat)的部分。 |
| `-D, --dividers` | 输出各个日志缓冲区之间的分隔线。 |
| `-c` | 清空（清除）整个日志并退出。 |
| `-t <count>` | 仅输出最新的行数。此选项包括 `-d` 功能。 |
| `-t '<time>'` | 输出自指定时间以来的最新行。此选项包括 `-d` 功能。如需了解如何引用带有嵌入空格的参数，请参阅 [\-P 选项](https://developer.android.com/studio/command-line/logcat#quotes)。`adb logcat -t '01-26 20:52:41.820'` |
| `-T <count>` | 输出自指定时间以来的最新行数。此选项不包括 `-d` 功能。 |
| `-T '<time>'` | 输出自指定时间以来的最新行。此选项不包括 `-d` 功能。如需了解如何引用带有嵌入空格的参数，请参阅 [\-P 选项](https://developer.android.com/studio/command-line/logcat#quotes)。`adb logcat -t '01-26 20:52:41.820'` |
| `-L, -last` | 在最后一次重新启动之前转储日志。 |
| `-B, --binary` | 以二进制文件形式输出日志。 |
| `-S, --statistics` | 在输出中包含统计信息，以帮助您识别和定位日志垃圾信息发送者。 |
| `-G <size>` | 设置日志环形缓冲区的大小。可以在结尾处添加 `K` 或 `M`，以指示单位为千字节或兆字节。 |
| `-p, --prune` | 输出（读取）当前的允许 (`white`) 列表和拒绝 (`black`) 列表，不采用任何参数，如下所示：`adb logcat -p` |
| `-P '<list> ...'--prune '<list> ...' -P '<white_and_black_list>'` | 写入（设置）允许 (`white`) 列表和拒绝 (`black`) 列表以出于特定目的调整日志记录内容。您可以提供允许 (`<white>`) 列表和拒绝 (`~<black>`) 列表条目的混合内容，其中 `<white>` 或 `<black>` 可以是 UID、UID/PID 或 /PID。在 Logcat 统计信息 (`logcat -S`) 的指导下，您可以考虑出于各种目的调整允许 (`white`) 列表和拒绝 (`black`) 列表，例如：通过 UID 选择使特定日志记录内容具有最长保留期限。阻止人 (UID) 或物 (PID) 消耗相应资源，以帮助增加日志跨度，从而更深入地了解正在诊断的问题。默认情况下，日志记录系统会自动以动态方式阻止日志统计信息中最严重的违规内容，以便为新的日志消息腾出空间。一旦它用尽启发法，系统便会删除最旧的条目，以便为新消息腾出空间。添加许可名单 (`whitelist`) 可保护您的 Android 识别码 (AID)，它会变成进程的 AID 和 GID，而不会被声明为违规内容；添加拒绝列表有助于在相应内容被视为最严重的违规内容之前即释放空间。您可以选择删除内容的程度和频率；也可以关闭删除功能，这样，系统便仅会移除各个日志缓冲区中最旧条目的内容。**引号**`adb logcat` 不会保留引号，因此指定允许 (`white`) 列表和拒绝 (`black`) 列表的语法如下所示：`$ adb logcat -P '"<white_and_blacklist>"' *or* adb shell $ logcat -P '<white_and_blacklist>'`以下示例指定了一个包含 PID 32676 和 UID 675 的允许 (`white`) 列表，以及一个包含 PID 32677 和 UID 897 的拒绝 (`black`) 列表。拒绝列表中的 PID 32677 经过加权处理，以便可以更快删除。`adb logcat -P '"/32676 675 ~/32677 897"'`其他您可以使用的允许 (`white`) 列表和拒绝 (`black`) 列表命令变体如下所示：`~! worst uid blacklist ~1000/! worst pid in system (1000)` |
| `--pid=<pid> ...` | 仅输出来自给定 PID 的日志。 |
| `--wrap` | 休眠 2 小时或者当缓冲区即将封装时（两者取其先）。通过提供即将封装唤醒来提高轮询的效率。 |

**过滤日志输出**

*   日志消息的标记是一个简短的字符串，指示消息所源自的系统组件（例如，“View”表示视图系统）。
*   优先级是以下字符值之一（按照从最低到最高优先级的顺序排列）：
*   *   `V`：详细（最低优先级）
    *   `D`：调试
    *   `I`：信息
    *   `W`：警告
    *   `E`：错误
    *   `F`：严重错误
    *   `S`：静默（最高优先级，绝不会输出任何内容）

通过运行 Logcat 并观察每条消息的前两列，您可以获取系统中使用的带有优先级的标记列表，格式为 `<priority>/<tag>`。

以下是使用 `logcat -v brief output` 命令获取的简短 Logcat 输出的示例。它表明消息与优先级“I”和标记“ActivityManager”相关：

```sh
I/ActivityManager(  585): Starting activity: Intent { action=android.intent.action...}
```

如要将日志输出降低到可管理的水平，可以使用过滤器表达式限制日志输出。通过过滤器表达式，可以向系统指明感兴趣的标记/优先级组合，系统会针对指定的标记抑制其他消息。

过滤器表达式采用 `tag:priority ...` 格式，其中 `tag` 指示您感兴趣的标记，`priority` 指示可针对该标记报告的最低优先级。不低于指定优先级的标记的消息会写入日志。可以在一个过滤器表达式中提供任意数量的 `tag:priority` 规范。一系列规范使用空格分隔。

以下是一个过滤器表达式的示例，该表达式会抑制除标记为“ActivityManager”、优先级不低于“信息”的日志消息，以及标记为“MyApp”、优先级不低于“调试”的日志消息以外的所有其他日志消息：

```sh
adb logcat ActivityManager:I MyApp:D *:S
```

上述表达式中最后一个元素 `*:S` 将所有标记的优先级设为“静默”，从而确保系统仅显示标记为“ActivityManager”和“MyApp”的日志消息。使用 `*:S` 是确保日志输出受限于已明确指定的过滤器的绝佳方式，它可以让过滤器充当日志输出的“许可名单”。

以下过滤器表达式显示了优先级不低于“警告”的所有标记的所有日志消息：

```sh
adb logcat *:W
```

**控制日志输出格式**

除标记和优先级外，日志消息还包含许多元数据字段。可以修改消息的输出格式，以便它们显示特定的元数据字段。为此，可以使用 `-v` 选项，并指定下列某一受支持的输出格式。

*   `brief`：显示优先级、标记以及发出消息的进程的 PID。
*   `long`：显示所有元数据字段，并使用空白行分隔消息。
*   `process`：仅显示 PID。
*   `raw`：显示不包含其他元数据字段的原始日志消息。
*   `tag`：仅显示优先级和标记。
*   `thread:`：旧版格式，显示优先级、PID 以及发出消息的线程的 TID。
*   `threadtime`（默认值）：显示日期、调用时间、优先级、标记、PID 以及发出消息的线程的 TID。
*   `time`：显示日期、调用时间、优先级、标记以及发出消息的进程的 PID。

启动 Logcat 时，您可以使用 `-v` 选项指定所需的输出格式：

```sh
[adb] logcat [-v <format>]
```

以下示例显示了如何生成输出格式为 `time` 的消息：

```sh
adb logcat -v time
```

请注意，只能使用 `-v` 选项指定一种输出格式，但可以指定任意数量的有意义的修饰符。Logcat 会忽略没有意义的修饰符。

```sh
pidof com.ccc.tct 查询com.ccc.tct包名的pid
logcat -b all --pid=`pidof com.ccc.tct` 根据包名查询日志
```

  

本文转自 [https://blog.csdn.net/a1sd1/article/details/121027771](https://blog.csdn.net/a1sd1/article/details/121027771)，如有侵权，请联系删除。