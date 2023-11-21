---
title: ADB 常用命令写成bat脚本
date: 2023-07-13
tags:
 - adb命令
categories: 
 - adb命令
sticky: 
   true
---

### 操作步骤

1、新建txt文档  

2、复制代码到文档  

3、修改尾缀txt为bat

## 1.自定义截屏

```basic
@echo off
set /p a=请输入截图的名称:
adb shell screencap -p /sdcard/%a%.png
adb pull /sdcard/%a%.png
echo. & pause
```

2.快速截屏到桌面
-------------------------------------------------------------------------

代码如下（示例）：

```basic
@ECHO OFF  

ECHO.[快速手机截屏]  

ECHO.-------------------------------  

ECHO.[Exce ] 手机截屏  

adb shell screencap -p /sdcard/screen.png  

ECHO.[Tips ] 拷贝截屏图片至电脑  

adb pull /sdcard/screen.png "%~dp0\screen.png"  

ren screen.png "%date:~0,4%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%%time:~6,2%.png"  

adb shell rm /sdcard/screen.png  

ECHO [暂停2秒自动关闭...]  

ping -n 2 127.0.0.1>nul  

@ECHO ON  
```

3.录屏
--------------------------------------------------------------------

```basic
@ECHO OFF
CLS
color 0a
set SCREEN_RECORD_SAVE_DIR=/sdcard/screenrecord
set SCREEN_RECORD_NAME=screenrecord.mp4
set SCREEN_RECORD_WIN_SAVE_DIR=screenrecord
set SCREEN_CAPTURE_SAVE_DIR=/sdcard/screencap
set SCREEN_CAPTURE_NAME=screencap.png
set SCREEN_CAPTURE_WIN_SAVE_DIR=screencap
REM when hour bit < 10,should if check
set NOW_TIME_HH=%time:~0,2%
if "%NOW_TIME_HH%" lss "10"  (set NOW_TIME_HH=0%time:~1,1%) else (set NOW_TIME_HH=%time:~0,2%)
set NOW_TIME=%date:~0,4%%date:~5,2%%date:~8,2%%NOW_TIME_HH%%time:~3,2%%time:~6,2%
GOTO MENU
:MENU
ECHO.
ECHO. Android Screen MP4 Record
ECHO.
ECHO. 1 Record MP4
ECHO.
ECHO. 2 Pull MP4 file
ECHO.
ECHO. 3 Screen capture
ECHO.
ECHO. 4 Exit
ECHO.
ECHO.
REM echo. pls choose number：
set /p id= Pls choose number:
if "%id%"=="1" goto cmd1  
 
if "%id%"=="2" goto cmd2
if "%id%"=="3" goto cmd3  
 
IF "%id%"=="4" exit ELSE (
echo Enter number %id% is not recognited,pls enter again!
pause
GOTO MENU
)  
 
@REM Recording MP4
:cmd1
echo Recording MP4,pls waiting...
ECHO.
adb shell rm    -rf  %SCREEN_RECORD_SAVE_DIR%
adb shell mkdir -p   %SCREEN_RECORD_SAVE_DIR%
adb shell screenrecord --bugreport --bit-rate 6000000  %SCREEN_RECORD_SAVE_DIR%/%SCREEN_RECORD_NAME%
GOTO PUASE
@REM Pull MP4 file
:cmd2
echo Pulling MP4 file,pls waiting...
ECHO.
REM rd /S /Q %SCREEN_RECORD_WIN_SAVE_DIR%
if not exist %SCREEN_RECORD_WIN_SAVE_DIR% mkdir %SCREEN_RECORD_WIN_SAVE_DIR%
adb pull %SCREEN_RECORD_SAVE_DIR%/%SCREEN_RECORD_NAME%  %SCREEN_RECORD_WIN_SAVE_DIR%
cd %SCREEN_RECORD_WIN_SAVE_DIR%
REM for MP4 file add time stamp
ren %SCREEN_RECORD_NAME%  %NOW_TIME%%SCREEN_RECORD_NAME%
ECHO.
echo %SCREEN_RECORD_NAME% file has pulled!!
ECHO.
GOTO PUASE
@REM Screen capture
:cmd3
echo Doing screen capture,pls waiting...
ECHO.
adb shell rm    -rf  %SCREEN_CAPTURE_SAVE_DIR%
adb shell mkdir -p   %SCREEN_CAPTURE_SAVE_DIR%
adb shell screencap -p %SCREEN_CAPTURE_SAVE_DIR%/%SCREEN_CAPTURE_NAME%
if not exist %SCREEN_CAPTURE_WIN_SAVE_DIR% mkdir %SCREEN_CAPTURE_WIN_SAVE_DIR%
adb pull  %SCREEN_CAPTURE_SAVE_DIR%/%SCREEN_CAPTURE_NAME%  %SCREEN_CAPTURE_WIN_SAVE_DIR%
cd %SCREEN_CAPTURE_WIN_SAVE_DIR%
REM for png file add time stamp
ren %SCREEN_CAPTURE_NAME%  %NOW_TIME%%SCREEN_CAPTURE_NAME%
ECHO.
echo %SCREEN_CAPTURE_NAME% file has pulled!!
ECHO.
GOTO PUASE
:PUASE
pause
echo.  
```

该处使用的url网络请求的数据。

* * *

## 4.输出logat日志到桌面

```basic
@ECHO OFF  

ECHO.[导出logcat日志]  

ECHO.-------------------------------  

adb logcat -d>"%date:~0,4%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%%time:~6,2%.log"  

ECHO.[暂停5秒自动关闭...]  

ping -n 5 127.0.0.1>nul  

@ECHO ON  
```



本文转自 [https://blog.csdn.net/penghang1223/article/details/121212817](https://blog.csdn.net/penghang1223/article/details/121212817)，如有侵权，请联系删除。