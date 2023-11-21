---
title: android 通过反射修改Dialog的样式
date: 2022-12-19
tags:
 - android
categories: 
 - android
sticky: 
   true
---

Android开发中，AlertDialog因为使用起来方便，用的还是很多的，但有时领导还是很会挑刺的，说默认的按钮不够大、提示信息不够醒目。。。这里介绍一种不用通过自定义view便可修改这些样式的方法：

```java
AlertDialog dialog = new AlertDialog.Builder(context)
                            .setTitle("分拣中，不允许切换分拣方案")
                            .setMessage("是否清除在箱包裹？")
                            .setCancelable(false)
                            .setPositiveButton("确定", new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                        Toast.makeText(context, "清箱成功", Toast.LENGTH_SHORT).show();
                                    }
                                }
                            })
                            .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    dialog.dismiss();
                                }
                            })
                            .create();
                    dialog.show();
                    //修改“确认”、“取消”按钮的字体大小
                    dialog.getButton(AlertDialog.BUTTON_POSITIVE).setTextSize(26);
                    dialog.getButton(DialogInterface.BUTTON_NEGATIVE).setTextSize(26);
                    try {
                        Field mAlert = AlertDialog.class.getDeclaredField("mAlert");
                        mAlert.setAccessible(true);
                        Object mAlertController = mAlert.get(dialog);
                        //通过反射修改title字体大小和颜色
                        Field mTitle = mAlertController.getClass().getDeclaredField("mTitleView");
                        mTitle.setAccessible(true);
                        TextView mTitleView = (TextView) mTitle.get(mAlertController);
                        mTitleView.setTextSize(32);
                        mTitleView.setTextColor(Color.RED);
                        //通过反射修改message字体大小和颜色
                        Field mMessage = mAlertController.getClass().getDeclaredField("mMessageView");
                        mMessage.setAccessible(true);
                        TextView mMessageView = (TextView) mMessage.get(mAlertController);
                        mMessageView.setTextSize(28);
                        mMessageView.setTextColor(Color.GREEN);
                    } catch (IllegalAccessException e1) {
                        e1.printStackTrace();
                    } catch (NoSuchFieldException e2) {
                        e2.printStackTrace();
                    }
```


注意：AlertDialog样式的修改要在show方法之后进行，否则报错。
