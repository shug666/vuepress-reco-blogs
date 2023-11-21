---
title: android 解决RecyclerView刷新后自动滚动的问题
date: 2022-12-20
tags:
 - android
categories: 
 - android
sticky: 
   true
---



首先需要在点击条目的时候获取RecyclerView的保存状态

```java
    private Parcelable recyclerViewState;
 
    @Override
    public void onItemCallback(int position) {
        //此处在需要跳转到下一个页面的地方获取RecycleView保存的状态
        recyclerViewState = recyclerView.getLayoutManager().onSaveInstanceState();
        Intent intent = new Intent(this, AppointTaskListActivity.class);
        startActivity(intent);
        }
    }
```

然后在返回刷新的地方设置RecyclerView的状态就可以了

```java
private void initData() {
        disposableAddWithoutProgress(RemoteWorkCruisers
                        .getInstance()
                        .new_service_query_company_testing_task_list(loginName, unitLogin, taskDate, buildName, task_state),
          back -> {
              list.clear();
              list = back.getData();
              //刷新RecycleView
              tasksOfEnterpriseAdapter.setData(list);
              //设置RecycleView的保存状态
              recyclerView.getLayoutManager().onRestoreInstanceState(recyclerViewState);
              refresh_data();
          });
    }
```

这时返回刷新以后，RecyclerView就不会滚动置顶了