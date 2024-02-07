import{_ as e,r as n,o as s,c as o,b as i,d as t,e as r,a as c}from"./app-668506b4.js";const A={},p=c('<h2 id="taskaffinity" tabindex="-1"><a class="header-anchor" href="#taskaffinity" aria-hidden="true">#</a> taskAffinity</h2><blockquote><p>每个Activity都有taskAffinity属性，这个属性指出了它希望进入的Task。</p></blockquote><p>android:taskAffinity=&quot;&quot; ，在AndoridManifest.xml文件中作为Activity的属性使用。</p><p><strong>先检查包名是否相同，然后检查taskAffinity是否相同，如果都相同，intent的flag设置为flag_activity_new_task的activity与启动它的activity入同一个栈，否则建立新的task然后入栈。</strong></p><h2 id="task" tabindex="-1"><a class="header-anchor" href="#task" aria-hidden="true">#</a> Task</h2><p>Task就是一个任务栈，里面用来存放Activity，第一个进去的（Activity）处于栈的最下面，而最后创建的（Activity）则处于栈的最上面。从Task中取出（Activity）是从最顶端取出，也就是说先进后出，后进先出。而Activity在Task中的顺序是可以控制的，在Activity跳转时用到Intent Flag可以设置新建Activity的创建方式。</p><h2 id="activity-intent-flag" tabindex="-1"><a class="header-anchor" href="#activity-intent-flag" aria-hidden="true">#</a> Activity Intent FLAG</h2><ul><li><p><strong>FLAG_ACTIVITY_NEW_TASK</strong></p><p>先检查包名是否相同，然后检查taskAffinity是否相同，如果都相同，intent的flag设置为flag_activity_new_task的activity与启动它的activity入同一个栈，否则建立新的task然后入栈。</p></li><li><p><strong>FLAG_ACTIVITY_CLEAR_TASK</strong></p><p>会导致含有待启动Activity的Task在Activity被启动前清空。也就是说，这个Activity会成为一个新的root，并且所有旧的activity都被finish掉。这个标志只能与FLAG_ACTIVITY_NEW_TASK 一起使用。</p></li><li><p><strong>FLAG_ACTIVITY_SINGLE_TOP</strong></p><p>相当于LaunchMode中的SingleTop模式</p></li><li><p><strong>FLAG_ACTIVITY_CLEAR_TOP</strong></p><p>相当于LaunchMode中的SingleTask模式</p></li><li><p><strong>FLAG_ACTIVITY_NO_HISTORY</strong></p><p>使用这个FLAG启动的Activity一但退出，就不会存在于栈中。（即，不存在历史记录）</p></li><li><p><strong>FLAG_ACTIVITY_NO_USER_ACTION</strong></p><p>使用这个FLAG启动的Activity，可以在避免用户离开当前Activity时回调到 onUserLeaveHint()。</p></li><li><p><strong>FLAG_ACTIVITY_BROUGHT_TO_FRONT</strong></p><p>task中顺序ABC时，由C启动B并设置intent FLAG为此，则顺序变为ACB。</p></li></ul><h2 id="拓展" tabindex="-1"><a class="header-anchor" href="#拓展" aria-hidden="true">#</a> 拓展</h2><p><strong>onUserLeaveHint()：</strong></p><p>作为Activity的生命周期回调的部分，会在用户决定将Acitivity放到后台时被调用。例如：当用户按下Home键，onUserLeaveHint就会被调用。但是当来电话时，来电界面会自动弹出，onUserLeaveHint就不会被调用。当该方法被调用时，他会恰好在onPause调用之前。</p>',11),_={href:"http://events.jianshu.io/p/6c449ca2499a",target:"_blank",rel:"noopener noreferrer"};function l(f,h){const a=n("ExternalLinkIcon");return s(),o("div",null,[p,i("p",null,[t("本文转自 "),i("a",_,[t("http://events.jianshu.io/p/6c449ca2499a"),r(a)]),t("，如有侵权，请联系删除。")])])}const v=e(A,[["render",l],["__file","taskAffinityheFLAGtanjiu.html.vue"]]);export{v as default};
