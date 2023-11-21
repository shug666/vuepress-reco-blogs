import{_ as a,r as n,o as l,c as s,b as t,d as e,e as r,a as o}from"./app-ee4ba21e.js";const d={},c={id:"https-www-jianshu-com-p-cc553c9c75b0",tabindex:"-1"},_=t("a",{class:"header-anchor",href:"#https-www-jianshu-com-p-cc553c9c75b0","aria-hidden":"true"},"#",-1),p={href:"https://www.jianshu.com/p/cc553c9c75b0",target:"_blank",rel:"noopener noreferrer"},m=o('<h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h3><ol><li><p>待机、睡眠与休眠的区别</p><p>实际上待机（standby）与睡眠（mem）属于不同模式，但现在大多操作系统都不支持待机模式了，我们也习惯将待机等同于睡眠，睡眠属于STR，休眠属于STD，Android手机不支持休眠！！！</p></li><li><p>Android开发者官网当中提到“idle state”，该如何理解，这个状态会对设备及我们的程序造成何种影响</p></li><li><p>所谓的idle状态，就是指系统进入某个低功耗状态，以MTK为例，常见的状态有soidle、rgidle以及dpidle。rgidle只是限制我们程序使用某些模块，如Doze模式中不能访问网络；而dpidle则会冻结所有进程，系统进入睡眠。</p></li><li><p>进入Doze模式中的idle状态，我们的程序还能运行吗？</p></li><li><p>Doze模式中的idle概念上属于rgidle状态，此时我们的程序是能运行的，只是不能访问网络等，但是在这个过程中，系统可能会满足进入睡眠条件，冻结所有进程，这样我们的程序就不会得到执行。</p></li><li><p>可以自己写个死循环的线程(普通线程，非looper线程)，强制手机进入Doze的idle模式，你会发现你的程序依旧在执行，但是静置在哪儿一段时间后，你会发现你的线程被冻结，不会执行，当你点亮屏幕，你的线程又会继续工作。</p></li><li><p>手机睡眠之后，为何我们写Alarm程序、来电显示程序依旧会生效？</p></li><li><p>Android在硬件架构上将处理器分为AP与BP，应用程序运行与AP之中，睡眠只是将AP断电，BP（Modem）不会断电，当有来电时，BP将会唤醒AP。<br> Alarm在硬件上依赖的是Modem中的PMIC的RTC模块，而不是AP中的RTC模块，当定时器触发时，可以唤醒AP，使我们的Alarm程序依旧会得到执行</p></li></ol>',2),h={href:"https://blog.csdn.net/haigand/article/details/100867396?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522168223432716800211570553%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fall.%2522%257D&request_id=168223432716800211570553&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~first_rank_ecpm_v1~rank_v31_ecpm-14-100867396-null-null.142%5Ev86%5Einsert_down28,239%5Ev2%5Einsert_chatgpt&utm_term=android%20str%E5%BE%85%E6%9C%BA&spm=1018.2226.3001.4187",target:"_blank",rel:"noopener noreferrer"};function u(A,b){const i=n("ExternalLinkIcon");return l(),s("div",null,[t("h3",c,[_,e(),t("a",p,[e("https://www.jianshu.com/p/cc553c9c75b0"),r(i)])]),m,t("p",null,[e("本文转自 "),t("a",h,[e("https://blog.csdn.net/haigand/article/details/100867396?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522168223432716800211570553%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fall.%2522%257D&request_id=168223432716800211570553&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~first_rank_ecpm_v1~rank_v31_ecpm-14-100867396-null-null.142^v86^insert_down28,239^v2^insert_chatgpt&utm_term=android%20str%E5%BE%85%E6%9C%BA&spm=1018.2226.3001.4187"),r(i)]),e("，如有侵权，请联系删除。")])])}const g=a(d,[["render",u],["__file","Android-xiumianzhuangtai.html.vue"]]);export{g as default};
