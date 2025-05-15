import { defineUserConfig } from "vuepress";
import type { DefaultThemeOptions } from "vuepress";
import recoTheme from "vuepress-theme-reco";

export default defineUserConfig({
  title: "vuepress-theme-reco",
  description: "Just playing around",
  base: "/vuepress-reco-blogs/",
  theme: recoTheme({
    style: "@vuepress-reco/style-default",
    logo: "/logo.png",
    author: "reco_luan",
    authorAvatar: "/head.png",
    docsRepo: "https://github.com/vuepress-reco/vuepress-theme-reco-next",
    docsBranch: "main",
    docsDir: "example",
    lastUpdatedText: "",
    // series 为原 sidebar
    series: {
      "/docs/theme-reco/": [
        {
          text: "module one",
          children: ["home", "theme"],
        },
        {
          text: "module two",
          children: ["api", "plugin"],
        },
      ],
      "/docs/jobs/": [ 'Gitminglingqingdan', 'AndroidMK', 'makefile', 'xitongshuxing', 'kaijijingling', 'adbmingling', 'yaokongqipeizhi','shelljiaoben', 'klwenjianjixiangguanmingling' ],
      "/docs/custom-view/": [ 'zidingyiView1-1-huizhijichu', 'zidingyiView1-2-Paintxiangjie', 'zidingyiView1-3-drawTextwenzidehuizhi', 'zidingyiView1-4-Canvasduihuizhidefuzhu', 'zidingyiView1-5-huizhishunxu', 'zidingyiView1-6-shuxingdonghuaPropertyAnimation', 'zidingyiView1-7-shuxingdonghuaPropertyAnimation', 'zidingyiView1-8-yingjianjiasu', 'zidingyiView2-1-bujujichu' ],
      "/docs/kotlin-basic-learning/": [ 'kotlindebianliang_hanshuheleixing', 'kotlinlinaxiebushinamexiede', 'kotlinlinaxiegengfangbiande', 'kotlindefanxing', 'kotlindexiechengyonglipieyiyan', 'kotlinxiechengdeguaqi', 'xiechengdefeizusaishiguaqi', 'kotlindelambdabiaodashi', 'kotlindekuozhanhanshuhekuozhanshuxing', 'kotlindenoinlinehecrossinline', 'androiddejianzhiduicunchu', 'kotlin_unitxiangjie', 'kotlindenothingxiangjie', 'fudianshudekanghenshen', 'kotlindejiekouweituoshizhemeyongde', 'kotlindechengyuankuozhanhanshuheimplicit_receiver', 'composedezuoyongyujizhi', 'kotlindejiaqiangbanleixingtuiduanbuilderinference' ]
    },
    navbar: [
      { text: "随意一点的主页", link: "/" },
      { text: "踩雷避坑请注意", link: "/categories/android/1/" },
      { text: "各种大杂烩系列", link: "/tags/android/1/" },
      {
        text: "很厉害的文章",
        children: [
          { text: "工作学习", link: "/docs/jobs/Gitminglingqingdan" },
          { text: "自定义View", link: "/docs/custom-view/zidingyiView1-1-huizhijichu" },
          { text: "Kotlin基础学习", link: "/docs/kotlin-basic-learning/kotlindebianliang_hanshuheleixing" },
          { text: "vuepress-theme-reco", link: "/blogs/other/guide" },
        ],
      },
    ],
    // bulletin: {
    //   body: [
    //     {
    //       type: "text",
    //       content: `🎉🎉🎉 reco 主题 2.x 已经接近 Beta 版本，在发布 Latest 版本之前不会再有大的更新，大家可以尽情尝鲜了，并且希望大家在 QQ 群和 GitHub 踊跃反馈使用体验，我会在第一时间响应。`,
    //       style: "font-size: 12px;",
    //     },
    //     {
    //       type: "hr",
    //     },
    //     {
    //       type: "title",
    //       content: "QQ 群",
    //     },
    //     {
    //       type: "text",
    //       content: `
    //       <ul>
    //         <li>QQ群1：1037296104</li>
    //         <li>QQ群2：1061561395</li>
    //         <li>QQ群3：962687802</li>
    //       </ul>`,
    //       style: "font-size: 12px;",
    //     },
    //     {
    //       type: "hr",
    //     },
    //     {
    //       type: "title",
    //       content: "GitHub",
    //     },
    //     {
    //       type: "text",
    //       content: `
    //       <ul>
    //         <li><a href="https://github.com/vuepress-reco/vuepress-theme-reco-next/issues">Issues<a/></li>
    //         <li><a href="https://github.com/vuepress-reco/vuepress-theme-reco-next/discussions/1">Discussions<a/></li>
    //       </ul>`,
    //       style: "font-size: 12px;",
    //     },
    //     {
    //       type: "hr",
    //     },
    //     {
    //       type: "buttongroup",
    //       children: [
    //         {
    //           text: "打赏",
    //           link: "/docs/others/donate.html",
    //         },
    //       ],
    //     },
    //   ],
    // },
    // commentConfig: {
    //   type: 'valie',
    //   // options 与 1.x 的 valineConfig 配置一致
    //   options: {
    //     // appId: 'xxx',
    //     // appKey: 'xxx',
    //     // placeholder: '填写邮箱可以收到回复提醒哦！',
    //     // verify: true, // 验证码服务
    //     // notify: true,
    //     // recordIP: true,
    //     // hideComments: true // 隐藏评论
    //   },
    // },
  }),
  // debug: true,
});
