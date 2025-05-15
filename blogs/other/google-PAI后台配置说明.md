---
title: google PAI后台配置说明
date: 2024-09-27
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## google PAI （play auto install）后台配置说明

自从2019年9月份开始，谷歌的PAI推送网站有了很大的变化。下面的介绍也都是关于新网站的。

## 一，新网站PAI服务器配置的步骤

- 1.[进入此地址](https://partner.android.com/approvals/builds/)然后选择Devices and Products(https://partner.android.com/approvals/builds/)

- 2.Devices and Products界面如下，每一个Device name 代表一个平台或者具体的区域

  ![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images162b8437603e4d20017c5bc43eb7c903.jpeg)

  - 3.点击后进入PAI的主界面

    ![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images84d3802f73e65f6b2c2bfb55c4589093.jpeg)

    - 这里1处有三个按钮，分别代表 DEBUG(用于调试PAI相关)，CREATE NEW（创建一个新的PAI推送）
      PUBLISH（创建好后点击按钮进行发布）
    - 2处代表要推送的软件的一些信息
    - 3处是已经推送过的或者编辑过的PAI的清单，这里随便点击进去一个就可以进行再次编辑或者删除
    - 4处表示在此版本的软件下进行PAI操作的一些历史记录，例如创建，删除，编辑的一些具体的时间以及内容等等，如果发现推送出问题了，则可以在这找到推送的历史记录

  - 4.这里我们点击CREATE NEW 按钮来看下如何具体的创建一个PAI 推送（至于再次编辑也可以参考这个）

    ![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesc7e920979af69a8972fb3a4d3001862a.jpeg)

    以下为PIA具体配置的选项的说明：
    （1）1处，Name ： 必填项。建议按照以下的命名规则来命名

    ```
           推送用途+推送的国家+推送国家的缩写+日期
           推送用途：如谷歌测试，或者量产软件测试
           推送国家：国家全拼+国家缩写，不填国家时，此项默认为all
    ```

    - 假如为谷歌测试：
      Google_Test_All_190710
    - 假如为我们自己DQA，DQM主观测试：
      DQM_India_IN_190710, DQM_All_190711
    - 假如为客户样机推送：
      Customer_Kenya_KE_190529
    - 假如为量产软件：
      Publish_Maldives_MY_190528, Publish_All_190726
      **基本都量产都会按国家推送，不会根据区域推送，如果一次推送的国家比较多，命名中也可以直接使用ALL，这个只是个命名而已，能区分每一笔推送即可。**
      （2）2处，取消或者保存按钮
      （3）3处Fingerprint : 必填项，为对应软件的fingerprint，可以通过释放软件的项目经理拿，也可以将软件升级好后，通过命令在串口获取：getprop ro.build.fingerprint 。**（注意，新网站升级后这项只能填入已经过了google 认证或者已经有在网站上报备过fingerprint才能是合法的）** 选择勾选Enable。
      （4）Country：可选项，建议选择。如果不选择，则默认此版软件对应的全部国家都生效。另外，此国家与开机导航中选择的国家没有一点关系。而是与连接的网络IP对应的国家有关。例如，此处选择印度，则只有连接IP为印度的网络，才能出现PAI界面，否则出不来。
      （5）Carrier: 运营商选择，默认不选择。
      （6） ro.oem.key1: 默认不填
      （7）Hardware Ids：TV的设备号串号。可选填，**建议测试的时候填写**（这样可以保证测试完成后，后台的PAI配置万一忘记删除，也不会影响量产软件的推送）。量产的时候不填写。默认全部设备都推送，也可通过文件方式批量上传ids。
      （8） Config APK：必选项，即包含即将给用户推送的应用的信息的apk。由开发人员提供.另外关于config apk 这里有以下说明：
      **因为新网站目前支持直接在服务器后台配置需要推送的apk，故这里的config apk 里面只默认带一两个其他的app，配置时需要时可以保留，不需要请务必删除。**
      （9） 自定义配置文件，默认不选择
    - 5.PAI服务器端具体配置页面![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/1d6c75d34be968cc746ed7b8d633abc9.png#pic_center)
      - **以上为新网站最大的改动地方，即开发和运营解耦**之前使用旧网站时，如果需要给用户推送app，则需要将每个app的包名加入到源码中，编译再上传。而现在使用新网站后。则可以直接在网页上编辑想要推送的app清单。如上图，推送者在第四项的图中标注的第八点中选择上传开发提供的APP后，则会出现上图，一般开发提供的config app里面会默认有几个app清单（如上图中的两个），推送者可以根据自己的需求去删除或者增加app清单即可。
      - 一般的话只选择在Google 行添加，不在OEM行添加（如果在OEM行添加app的话，则将来在PAI推送界面会出现OEM厂商的标题，即我们将会多出现以Skyworth 行开头的推荐）。我们默认不推送OEM行。只推送google 行。
      - 上图 Required 选择默认为给用户强制推送，用户不能取消。一般不选择。Install default 选择，则默认PAI界面对应app默认勾选，用户可以取消。但是无论选哪个，安装都是在google play store 中下载。安装好之后，用户还是可以手动卸载的。
    - 6.编辑完成后点击save，然后再点击publish。

## 二，PAI 配置时需要注意的几个地方

------

想要在开机导航出现后台推荐的特色app，有以下几个条件，如果推送后PAI仍然显示不出来，可以对照以下几条是否满足条件：

- 1.检查系统中是否有和服务器中对应包名的apk
  PAI 预制需要两个apk，一个stub.apk 需预制进系统的system/app 下，一个config.apk，配置后台服务器中使用。这两个apk 包名必须一样。服务器中的config.apk 的包名在上传服务器后就可以看到，系统中的stub.apk，可以在串口的/data/data/ 底下通过ls 看到。

- 2.服务器中添加的国家和实际连接网络的IP对应的国家是否对应

- 3.是否点击了publish 按钮

- 4.如果推送后未出现PAI界面，也可在服务器的推送历史中查找推送历史记录

- 5.有的apk只针对有的国家区域才会有，所以有时候后台推送了，却少了某个apk，可能是因为在此时电视连接网络的国家或者地区没有这个apk。

  ------

  **建议测试PAI功能时，如果测试完成后，应该及时在后台删除掉创建的PAI列表，尤其是在即将量产测试版本上PAI功能建议在闭环前两三个版本再开始测试**，因为此功能大部分为谷歌的功能，我们可控的不多，一般也没什么大问题。

## 三，PAI 推送相关的疑问

------

- 1.验证PAI推送时，需要登录谷歌账号吗？
  不需要，只需要连接网络就可以，区别在于登录账号后，谷歌会随机多推送几个app（可能是根据对应账号的使用习惯）
- 2.PAI推送时app显示的顺序和在服务器配置的顺序是否一致？
  PAI显示的顺序和服务器配置的顺序是一致的
- 3.PAI推送的国家是如何与ip mapping的？
  PAI推送是在服务器选择国家之后，谷歌后台自动去和对应国家的Ip Mapping 起来的。与用户在开机导航选择国家无关
- 4.PAI将会在开机导航的哪个阶段显示出来？
  后台配置正确后，PAI将会在谷歌的开机导航走完，我们自己的开机导航出现之前显示。
- 5.PAI推送最多能推送多少个app？
  谷歌官方表明是50个，建议是10~15个，我们这边测试最多可以出现30个。另外，PAI推送至少要推2个 以上才能成 功。具体以推送结果为准。
- 6.我要想推送某个app，需要获取这个app的什么信息？
  需要获取其包名：可以在android TV的google store下载，然后进入setting==》app查看此app的包 名，或者也可在主页apps ，将焦点放在某个app上，然后 长按ok键，选择app info 查看。还需要知道这个app是否在即将推送的国家或者地区存在。
- 7.PAI推送时出现的界面

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images8b7678210e2799352000963e4ff95f52.png)

- 8.同样是预制 或者推荐特色app，PAI功能和 feature partner row有何区别
  PAI：不跟随img，只需后台配置一下，即可在开机导航想用户推荐app，不需要时可自动在后台删除或者编辑添加，可以区分国家的IP进行自由推送feature partner row：跟随img，没有后台。软件中一次添加，后续只有通过OTA的方式来改变
- 9.此种安装的app可以卸载吗？
  可以，PAI安装是在google play store 中下载安装的。和安装第三方应用一样，都是安装在data 分区，都是可以卸载的。
- 10.PAI推送时，需要的fingerprint和串号如何获取？
  fingerprint 可以向项目经理咨询，如有串口，也可以通过 getprop ro.build.fingerprint获取。
  串号可以通过：settings–device preferences–about–status–serial number查看
- 11.PAI后台配置时，编辑推送的app时，此app在服务器上的icon获取不到，可以推送吗？
  获取不到icon的，大部分都不能推送。但不是都不能推送。

## 四，附录

------

### 附录1 PAI 官方说明网站：

https://partner.android.com/#virtualpreloadedit:pid=F0C4BBAC&vid=8B4F0563

### 附录2 国家缩写对照表

| AC      |                  |
| ------- | ---------------- |
| AD      | 安道尔共和国     |
| AF      | 阿富汗           |
| AG      | 安提瓜和巴布达   |
| AI      | 阿尔巴尼亚       |
| AM      | 亚美尼亚         |
| AO      | 安哥拉           |
| AQ      |                  |
| AR      | 阿根廷           |
| AS      |                  |
| AT      | 奥地利           |
| AU      | 澳大利亚         |
| AW      |                  |
| AX      |                  |
| AZ      | 阿塞拜疆         |
| BA      |                  |
| BB      | 巴巴多斯         |
| BD      | 孟加拉国         |
| BE      | 比利时           |
| BF      | 布基纳法索       |
| BG      | 保加利亚         |
| BH      | 巴林             |
| BI      | 布隆迪           |
| BL      | 巴勒斯坦         |
| BM      | 百慕大群岛       |
| BN      | 文莱             |
| BO      | 玻利维亚         |
| BQ      |                  |
| AC      |                  |
| BR      | 巴西             |
| BS      | 巴哈马           |
| BT      |                  |
| BV      |                  |
| BW      | 博茨瓦纳         |
| BY      | 白俄罗斯         |
| BZ      | 伯利兹           |
| CA      | 加拿大           |
| CC      |                  |
| CD      |                  |
| CF      | 中非共和国       |
| CG      | 刚果             |
| CH      | 瑞士             |
| CI      |                  |
| CK      | 库克群岛         |
| CL      | 智利             |
| CM      | 喀麦隆           |
| CN      | 中国             |
| CO      | 哥伦比亚         |
| CP      |                  |
| CR      | 哥斯达黎加       |
| CU      | 古巴             |
| CV      |                  |
| CW      |                  |
| CX      |                  |
| CY      | 塞浦路斯         |
| CZ      | 捷克             |
| DE      | 德国             |
| AC      |                  |
| DG      |                  |
| DJ      | 吉布提           |
| DK      | 丹麦             |
| DM      |                  |
| DO      | 多米尼加共和国   |
| DZ      | 阿尔及利亚       |
| EA      |                  |
| EC      | 厄瓜多尔         |
| EE      | 爱沙尼亚         |
| EG      | 埃及             |
| EH      |                  |
| ER      |                  |
| ES      | 西班牙           |
| ET      | 埃塞俄比亚       |
| FI      | 芬兰             |
| FJ      | 斐济             |
| FK      |                  |
| FM      |                  |
| FO      |                  |
| FR      | 法国             |
| GA      | 加蓬             |
| GB      | 英国             |
| GD      | 格林纳达         |
| GE      | 格鲁吉亚         |
| GF      | 法属圭亚那       |
| GG      |                  |
| GH      | 加纳             |
| GL      |                  |
| AC      |                  |
| GM      | 冈比亚           |
| GN      | 几内亚           |
| GP      |                  |
| GQ      |                  |
| GR      | 希腊             |
| GS      |                  |
| GT      | 危地马拉         |
| GU      | 关岛             |
| GW      |                  |
| GY      | 圭亚那           |
| HK      | 香港特别行政区   |
| HM      |                  |
| HN      | 洪都拉斯         |
| HR      |                  |
| HT      | 海地             |
| HU      | 匈牙利           |
| IC      |                  |
| ID      | 印度尼西亚       |
| IE      | 爱尔兰           |
| IL      | 以色列           |
| IM      |                  |
| IN      | 印度             |
| IO      |                  |
| IQ      | 伊拉克           |
| IR      | 伊朗             |
| IS      | 冰岛             |
| IT      | 意大利           |
| JE      |                  |
| JM      | 牙买加           |
| JO 约旦 |                  |
| JP      | 日本             |
| KE      | 肯尼亚           |
| KG      | 吉尔吉斯坦       |
| KH      | 柬埔寨           |
| KI      |                  |
| KM      |                  |
| KN      |                  |
| KP      | 朝鲜             |
| KR      | 韩国             |
| KW      | 科威特           |
| KY      |                  |
| KZ      | 哈萨克斯坦       |
| LA      | 老挝             |
| LB      | 黎巴嫩           |
| HU      | 匈牙利           |
| LC      | 圣卢西亚         |
| LI      | 列支敦士登       |
| LK      | 斯里兰卡         |
| LR      | 利比里亚         |
| LS      | 莱索托           |
| LT      | 立陶宛           |
| LU      | 卢森堡           |
| LV      | 拉脱维亚         |
| LY      | 利比亚           |
| MA      | 摩洛哥           |
| MC      | 摩纳哥           |
| MD      | 摩尔多瓦         |
| ME      |                  |
| MF      |                  |
| MG      | 马达加斯加       |
| MH      |                  |
| MK      |                  |
| ML      | 马里             |
| MM      | 缅甸             |
| MN      | 蒙古             |
| MO      | 澳门             |
| MP      |                  |
|         | MQ               |
| MR      |                  |
| MS      | 蒙特塞拉特岛     |
| MT      | 马耳他           |
| MU      | 毛里求斯         |
| MV      | 马尔代夫         |
| HU      | 匈牙利           |
| MW      | 马拉维           |
| MZ      |                  |
| MY      | 马来西亚         |
| MZ      | 莫桑比克         |
| NA      | 纳米比亚         |
| NC      |                  |
| NE      | 尼日尔           |
| NF      |                  |
| NG      | 尼日利亚         |
| NI      | 尼加拉瓜         |
| NL      | 荷兰             |
| NO      | 挪威             |
| NP      | 尼泊尔           |
| NU      |                  |
| NZ      | 新西兰           |
| OM      | 阿曼             |
| PA      | 巴拿马           |
| PE      | 秘鲁             |
| PF      | 法属玻利尼西亚   |
| PG      | 巴布亚新几内亚   |
| PH      | 菲律宾           |
| PK      | 巴基斯坦         |
| PL      | 波兰             |
| PM      |                  |
| PN      |                  |
| PR      | 波多黎各         |
| PS      |                  |
| PT      | 葡萄牙           |
| HU      | 匈牙利           |
| PW      |                  |
| PY      | 巴拉圭           |
| QA      | 卡塔尔           |
| RE      |                  |
| RO      |                  |
| RS      |                  |
| RU      |                  |
| RW      |                  |
| SA      | 沙特阿拉伯       |
| SB      | 所罗门群岛       |
| SC      | 塞舌尔           |
| SD      | 苏丹             |
| SE      | 瑞典             |
| SG      | 新加坡           |
| SH      |                  |
| SI      | 斯洛文尼亚       |
| SJ      |                  |
| SK      | 斯洛伐克         |
| SL      | 塞拉利昂         |
| SM      | 圣马力诺         |
| SN      | 塞内加尔         |
| SO      | 索马里           |
| SR      | 苏里南           |
| SS      |                  |
| ST      | 圣多美和普林西比 |
| SV      | 萨尔瓦多         |
| SZ      |                  |
| SY      | 叙利亚           |
| SZ      | 斯威士兰         |
| TA      |                  |
| TC      |                  |
| TD      | 乍得             |
| TF      |                  |
| TG      | 多哥             |
| TH      | 泰国             |
| TJ      | 塔吉克斯坦       |
| TK      |                  |
| TL      |                  |
| TM      | 土库曼斯坦       |
| TN      | 突尼斯           |
| TO      | 汤加             |
| TR      | 土耳其           |
| TT      | 特立尼达和多巴哥 |
| SH      |                  |
| TV      |                  |
| TW      | 台湾省           |
| TZ      | 坦桑尼亚         |
| UA      | 乌克兰           |
| UG      | 乌干达           |
| UM      |                  |
| US      | 美国             |
| UY      | 乌拉圭           |
| UZ      | 乌兹别克斯坦     |
| VA      |                  |
| VC      | 圣文森特岛       |
| VE      | 委内瑞拉         |
| VG      |                  |
| VI      |                  |
| VN      | 越南             |
| VU      |                  |
| WF      |                  |
| WS      |                  |
| XK      |                  |
| YE      | 也门             |
| YT      |                  |
| ZA      | 南非             |
| ZM      | 赞比亚           |
| ZW      | 津巴布韦         |