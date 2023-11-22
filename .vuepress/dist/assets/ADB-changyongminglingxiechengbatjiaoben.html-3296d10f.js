import{_ as e,r as p,o,c as t,b as s,d as n,e as c,a as l}from"./app-f541e591.js";const r={},i=l(`<h3 id="操作步骤" tabindex="-1"><a class="header-anchor" href="#操作步骤" aria-hidden="true">#</a> 操作步骤</h3><p>1、新建txt文档</p><p>2、复制代码到文档</p><p>3、修改尾缀txt为bat</p><h2 id="_1-自定义截屏" tabindex="-1"><a class="header-anchor" href="#_1-自定义截屏" aria-hidden="true">#</a> 1.自定义截屏</h2><div class="language-basic line-numbers-mode" data-ext="basic"><pre class="language-basic"><code>@echo <span class="token keyword">off</span>
<span class="token function">set</span> <span class="token operator">/</span>p a<span class="token operator">=</span>请输入截图的名称<span class="token punctuation">:</span>
adb <span class="token keyword">shell</span> screencap <span class="token operator">-</span>p <span class="token operator">/</span>sdcard<span class="token operator">/</span>%a%.png
adb pull <span class="token operator">/</span>sdcard<span class="token operator">/</span>%a%.png
echo. <span class="token operator">&amp;</span> pause
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-快速截屏到桌面" tabindex="-1"><a class="header-anchor" href="#_2-快速截屏到桌面" aria-hidden="true">#</a> 2.快速截屏到桌面</h2><p>代码如下（示例）：</p><div class="language-basic line-numbers-mode" data-ext="basic"><pre class="language-basic"><code>@ECHO <span class="token keyword">OFF</span>  

ECHO.[快速手机截屏]  

ECHO.<span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span>  

ECHO.[Exce ] 手机截屏  

adb <span class="token keyword">shell</span> screencap <span class="token operator">-</span>p <span class="token operator">/</span>sdcard<span class="token operator">/</span>screen.png  

ECHO.[Tips ] 拷贝截屏图片至电脑  

adb pull <span class="token operator">/</span>sdcard<span class="token operator">/</span>screen.png &quot;%~dp0\\screen.png&quot;  

ren screen.png &quot;%<span class="token function">date</span><span class="token punctuation">:</span>~<span class="token number">0</span><span class="token punctuation">,</span><span class="token number">4</span>%%<span class="token function">date</span><span class="token punctuation">:</span>~<span class="token number">5</span><span class="token punctuation">,</span><span class="token number">2</span>%%<span class="token function">date</span><span class="token punctuation">:</span>~<span class="token number">8</span><span class="token punctuation">,</span><span class="token number">2</span>%%<span class="token function">time</span><span class="token punctuation">:</span>~<span class="token number">0</span><span class="token punctuation">,</span><span class="token number">2</span>%%<span class="token function">time</span><span class="token punctuation">:</span>~<span class="token number">3</span><span class="token punctuation">,</span><span class="token number">2</span>%%<span class="token function">time</span><span class="token punctuation">:</span>~<span class="token number">6</span><span class="token punctuation">,</span><span class="token number">2</span>%.png&quot;  

adb <span class="token keyword">shell</span> rm <span class="token operator">/</span>sdcard<span class="token operator">/</span>screen.png  

ECHO [暂停<span class="token number">2</span>秒自动关闭...]  

ping <span class="token operator">-</span>n <span class="token number">2</span> <span class="token number">127.0</span><span class="token number">.0</span><span class="token number">.1</span><span class="token operator">&gt;</span><span class="token function">nul</span>  

@ECHO <span class="token keyword">ON</span>  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-录屏" tabindex="-1"><a class="header-anchor" href="#_3-录屏" aria-hidden="true">#</a> 3.录屏</h2><div class="language-basic line-numbers-mode" data-ext="basic"><pre class="language-basic"><code>@ECHO <span class="token keyword">OFF</span>
<span class="token keyword">CLS</span>
<span class="token function">color</span> <span class="token number">0</span>a
<span class="token function">set</span> SCREEN_RECORD_SAVE_DIR<span class="token operator">=</span><span class="token operator">/</span>sdcard<span class="token operator">/</span>screenrecord
<span class="token function">set</span> SCREEN_RECORD_NAME<span class="token operator">=</span>screenrecord.mp4
<span class="token function">set</span> SCREEN_RECORD_WIN_SAVE_DIR<span class="token operator">=</span>screenrecord
<span class="token function">set</span> SCREEN_CAPTURE_SAVE_DIR<span class="token operator">=</span><span class="token operator">/</span>sdcard<span class="token operator">/</span>screencap
<span class="token function">set</span> SCREEN_CAPTURE_NAME<span class="token operator">=</span>screencap.png
<span class="token function">set</span> SCREEN_CAPTURE_WIN_SAVE_DIR<span class="token operator">=</span>screencap
<span class="token comment"><span class="token keyword">REM</span> when hour bit &lt; 10,should if check</span>
<span class="token function">set</span> NOW_TIME_HH<span class="token operator">=</span>%<span class="token function">time</span><span class="token punctuation">:</span>~<span class="token number">0</span><span class="token punctuation">,</span><span class="token number">2</span>%
<span class="token keyword">if</span> <span class="token string">&quot;%NOW_TIME_HH%&quot;</span> lss <span class="token string">&quot;10&quot;</span>  <span class="token punctuation">(</span><span class="token function">set</span> NOW_TIME_HH<span class="token operator">=</span><span class="token number">0</span>%<span class="token function">time</span><span class="token punctuation">:</span>~<span class="token number">1</span><span class="token punctuation">,</span><span class="token number">1</span>%<span class="token punctuation">)</span> <span class="token keyword">else</span> <span class="token punctuation">(</span><span class="token function">set</span> NOW_TIME_HH<span class="token operator">=</span>%<span class="token function">time</span><span class="token punctuation">:</span>~<span class="token number">0</span><span class="token punctuation">,</span><span class="token number">2</span>%<span class="token punctuation">)</span>
<span class="token function">set</span> NOW_TIME<span class="token operator">=</span>%<span class="token function">date</span><span class="token punctuation">:</span>~<span class="token number">0</span><span class="token punctuation">,</span><span class="token number">4</span>%%<span class="token function">date</span><span class="token punctuation">:</span>~<span class="token number">5</span><span class="token punctuation">,</span><span class="token number">2</span>%%<span class="token function">date</span><span class="token punctuation">:</span>~<span class="token number">8</span><span class="token punctuation">,</span><span class="token number">2</span>%%NOW_TIME_HH%%<span class="token function">time</span><span class="token punctuation">:</span>~<span class="token number">3</span><span class="token punctuation">,</span><span class="token number">2</span>%%<span class="token function">time</span><span class="token punctuation">:</span>~<span class="token number">6</span><span class="token punctuation">,</span><span class="token number">2</span>%
<span class="token keyword">GOTO</span> MENU
<span class="token punctuation">:</span>MENU
ECHO.
ECHO. Android Screen MP4 <span class="token function">Record</span>
ECHO.
ECHO. <span class="token number">1</span> <span class="token function">Record</span> MP4
ECHO.
ECHO. <span class="token number">2</span> Pull MP4 file
ECHO.
ECHO. <span class="token number">3</span> Screen capture
ECHO.
ECHO. <span class="token number">4</span> <span class="token keyword">Exit</span>
ECHO.
ECHO.
<span class="token comment"><span class="token keyword">REM</span> echo. pls choose number：</span>
<span class="token function">set</span> <span class="token operator">/</span>p id<span class="token operator">=</span> Pls choose number<span class="token punctuation">:</span>
<span class="token keyword">if</span> <span class="token string">&quot;%id%&quot;</span><span class="token operator">=</span><span class="token operator">=</span><span class="token string">&quot;1&quot;</span> <span class="token keyword">goto</span> cmd1  
 
<span class="token keyword">if</span> <span class="token string">&quot;%id%&quot;</span><span class="token operator">=</span><span class="token operator">=</span><span class="token string">&quot;2&quot;</span> <span class="token keyword">goto</span> cmd2
<span class="token keyword">if</span> <span class="token string">&quot;%id%&quot;</span><span class="token operator">=</span><span class="token operator">=</span><span class="token string">&quot;3&quot;</span> <span class="token keyword">goto</span> cmd3  
 
<span class="token keyword">IF</span> <span class="token string">&quot;%id%&quot;</span><span class="token operator">=</span><span class="token operator">=</span><span class="token string">&quot;4&quot;</span> <span class="token keyword">exit</span> <span class="token keyword">ELSE</span> <span class="token punctuation">(</span>
echo Enter number %id% <span class="token function">is</span> <span class="token operator">not</span> recognited<span class="token punctuation">,</span>pls enter again!
pause
<span class="token keyword">GOTO</span> MENU
<span class="token punctuation">)</span>  
 
@<span class="token comment"><span class="token keyword">REM</span> Recording MP4</span>
<span class="token punctuation">:</span>cmd1
echo Recording MP4<span class="token punctuation">,</span>pls waiting...
ECHO.
adb <span class="token keyword">shell</span> rm    <span class="token operator">-</span>rf  %SCREEN_RECORD_SAVE_DIR%
adb <span class="token keyword">shell</span> <span class="token keyword">mkdir</span> <span class="token operator">-</span>p   %SCREEN_RECORD_SAVE_DIR%
adb <span class="token keyword">shell</span> screenrecord <span class="token operator">-</span><span class="token operator">-</span>bugreport <span class="token operator">-</span><span class="token operator">-</span>bit<span class="token operator">-</span>rate <span class="token number">6000000</span>  %SCREEN_RECORD_SAVE_DIR%<span class="token operator">/</span>%SCREEN_RECORD_NAME%
<span class="token keyword">GOTO</span> PUASE
@<span class="token comment"><span class="token keyword">REM</span> Pull MP4 file</span>
<span class="token punctuation">:</span>cmd2
echo Pulling MP4 file<span class="token punctuation">,</span>pls waiting...
ECHO.
<span class="token comment"><span class="token keyword">REM</span> rd /S /Q %SCREEN_RECORD_WIN_SAVE_DIR%</span>
<span class="token keyword">if</span> <span class="token operator">not</span> exist %SCREEN_RECORD_WIN_SAVE_DIR% <span class="token keyword">mkdir</span> %SCREEN_RECORD_WIN_SAVE_DIR%
adb pull %SCREEN_RECORD_SAVE_DIR%<span class="token operator">/</span>%SCREEN_RECORD_NAME%  %SCREEN_RECORD_WIN_SAVE_DIR%
cd %SCREEN_RECORD_WIN_SAVE_DIR%
<span class="token comment"><span class="token keyword">REM</span> for MP4 file add time stamp</span>
ren %SCREEN_RECORD_NAME%  %NOW_TIME%%SCREEN_RECORD_NAME%
ECHO.
echo %SCREEN_RECORD_NAME% file has pulled<span class="token comment">!!</span>
ECHO.
<span class="token keyword">GOTO</span> PUASE
@<span class="token comment"><span class="token keyword">REM</span> Screen capture</span>
<span class="token punctuation">:</span>cmd3
echo Doing screen capture<span class="token punctuation">,</span>pls waiting...
ECHO.
adb <span class="token keyword">shell</span> rm    <span class="token operator">-</span>rf  %SCREEN_CAPTURE_SAVE_DIR%
adb <span class="token keyword">shell</span> <span class="token keyword">mkdir</span> <span class="token operator">-</span>p   %SCREEN_CAPTURE_SAVE_DIR%
adb <span class="token keyword">shell</span> screencap <span class="token operator">-</span>p %SCREEN_CAPTURE_SAVE_DIR%<span class="token operator">/</span>%SCREEN_CAPTURE_NAME%
<span class="token keyword">if</span> <span class="token operator">not</span> exist %SCREEN_CAPTURE_WIN_SAVE_DIR% <span class="token keyword">mkdir</span> %SCREEN_CAPTURE_WIN_SAVE_DIR%
adb pull  %SCREEN_CAPTURE_SAVE_DIR%<span class="token operator">/</span>%SCREEN_CAPTURE_NAME%  %SCREEN_CAPTURE_WIN_SAVE_DIR%
cd %SCREEN_CAPTURE_WIN_SAVE_DIR%
<span class="token comment"><span class="token keyword">REM</span> for png file add time stamp</span>
ren %SCREEN_CAPTURE_NAME%  %NOW_TIME%%SCREEN_CAPTURE_NAME%
ECHO.
echo %SCREEN_CAPTURE_NAME% file has pulled<span class="token comment">!!</span>
ECHO.
<span class="token keyword">GOTO</span> PUASE
<span class="token punctuation">:</span>PUASE
pause
echo.  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>该处使用的url网络请求的数据。</p><hr><h2 id="_4-输出logat日志到桌面" tabindex="-1"><a class="header-anchor" href="#_4-输出logat日志到桌面" aria-hidden="true">#</a> 4.输出logat日志到桌面</h2><div class="language-basic line-numbers-mode" data-ext="basic"><pre class="language-basic"><code>@ECHO <span class="token keyword">OFF</span>  

ECHO.[导出logcat日志]  

ECHO.<span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span>  

adb logcat <span class="token operator">-</span>d<span class="token operator">&gt;</span>&quot;%<span class="token function">date</span><span class="token punctuation">:</span>~<span class="token number">0</span><span class="token punctuation">,</span><span class="token number">4</span>%%<span class="token function">date</span><span class="token punctuation">:</span>~<span class="token number">5</span><span class="token punctuation">,</span><span class="token number">2</span>%%<span class="token function">date</span><span class="token punctuation">:</span>~<span class="token number">8</span><span class="token punctuation">,</span><span class="token number">2</span>%%<span class="token function">time</span><span class="token punctuation">:</span>~<span class="token number">0</span><span class="token punctuation">,</span><span class="token number">2</span>%%<span class="token function">time</span><span class="token punctuation">:</span>~<span class="token number">3</span><span class="token punctuation">,</span><span class="token number">2</span>%%<span class="token function">time</span><span class="token punctuation">:</span>~<span class="token number">6</span><span class="token punctuation">,</span><span class="token number">2</span>%.<span class="token function">log</span>&quot;  

ECHO.[暂停<span class="token number">5</span>秒自动关闭...]  

ping <span class="token operator">-</span>n <span class="token number">5</span> <span class="token number">127.0</span><span class="token number">.0</span><span class="token number">.1</span><span class="token operator">&gt;</span><span class="token function">nul</span>  

@ECHO <span class="token keyword">ON</span>  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,15),d={href:"https://blog.csdn.net/penghang1223/article/details/121212817",target:"_blank",rel:"noopener noreferrer"};function u(k,v){const a=p("ExternalLinkIcon");return o(),t("div",null,[i,s("p",null,[n("本文转自 "),s("a",d,[n("https://blog.csdn.net/penghang1223/article/details/121212817"),c(a)]),n("，如有侵权，请联系删除。")])])}const b=e(r,[["render",u],["__file","ADB-changyongminglingxiechengbatjiaoben.html.vue"]]);export{b as default};
