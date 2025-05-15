---
title: Settings 搜索与数据库操作流程解析
date: 2025-04-26
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## Settings里搜索框的搜索流程

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images44c9b50d545ba05a8c57b6aa6b41956f.png)  
settings 里的 app info的搜索是单独的在InstalledAppResultTask 的query() 方法里，通过`Settings.ACTION_APPLICATION_DETAILS_SETTINGS`跳转

```java
final Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
        .setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
        .setData(Uri.fromParts(INTENT_SCHEME, info.packageName, null /* fragment */))
```

## Search完整流程

一、Settigs 里的查找有好几种,有数据库，应用，设备，辅助服务等，如下:

*   ![请添加图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesebb786e8e7862cba8dd4748552d10dfe.png)
*   除了数据库之外的其他几种都很直接，下面只看数据库的查找
*   直接看adapter ，SearchResultsAdapter:

### 设置viewHolder

```java
    // src/com/android/settings/intelligence/search/SearchResultsAdapter.java
    @Override
    public void onBindViewHolder(SearchViewHolder holder, int position) {
        holder.onBind(mFragment, mSearchResults.get(position));
    }
```

### 给view设置图片文字等

```java
    // src/com/android/settings/intelligence/search/SearchViewHolder.java

    public void onBind(SearchFragment fragment, SearchResult result) {
        titleView.setText(result.title);
        // TODO (b/36101902) remove check for DYNAMIC_PLACEHOLDER
        if (TextUtils.isEmpty(result.summary)
                || TextUtils.equals(result.summary, mPlaceholderSummary)
                || TextUtils.equals(result.summary, DYNAMIC_PLACEHOLDER)) {
            summaryView.setVisibility(View.GONE);
        } else {
            summaryView.setText(result.summary);
            summaryView.setVisibility(View.VISIBLE);
        }

        if (result instanceof AppSearchResult) {
            AppSearchResult appResult = (AppSearchResult) result;
            PackageManager pm = fragment.getActivity().getPackageManager();
            iconView.setImageDrawable(appResult.info.loadIcon(pm));
        } else {
            // Valid even when result.icon is null.
            iconView.setImageDrawable(result.icon);
        }

        bindBreadcrumbView(result);
    }
```

*   那么adapter的数据哪里来的呢?看SearchFragment:

### 得到搜索结果给adapter

```java
// src/com/android/settings/intelligence/search/SearchFragment.java  
    @Override
    public Loader<List<? extends SearchResult>> onCreateLoader(int id, Bundle args) {
        final Activity activity = getActivity();

        switch (id) {
            case SearchCommon.SearchLoaderId.SEARCH_RESULT:
                return mSearchFeatureProvider.getSearchResultLoader(activity, mQuery);
            default:
                return null;
        }
    }

	@Override
    public void onLoadFinished(Loader<List<? extends SearchResult>> loader,
            List<? extends SearchResult> data) {
        mSearchAdapter.postSearchResults(data);
    }
```

*   这里的LoaderManager 是用来帮助方便查询的，具体可以看
*   https://developer.android.google.cn/reference/android/app/LoaderManager?hl=en
*   mSearchFeatureProvider这里就是SearchFeatureProviderImpl,下面看这里的LoaderManager是如何查找到数据的

### LoaderManager是如何查找到数据的

```java
    // src/com/android/settings/intelligence/search/SearchFragment.java  
    
    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        mSearchFeatureProvider = FeatureFactory.get(context).searchFeatureProvider();
        mMetricsFeatureProvider = FeatureFactory.get(context).metricsFeatureProvider(context);
    }
```

*   restartLoaders() 这里设置loadermanager后马上会走onCreateLoader,细节可以点进去看就可以:createAndInstallLoader。

```java
    @Override
    public boolean onQueryTextChange(String query) {
        if (TextUtils.equals(query, mQuery)) {
            return true;
        }
        mEnterQueryTimestampMs = System.currentTimeMillis();
        final boolean isEmptyQuery = TextUtils.isEmpty(query);

        // Hide no-results-view when the new query is not a super-string of the previous
        if (mQuery != null
                && mNoResultsView.getVisibility() == View.VISIBLE
                && query.length() < mQuery.length()) {
            mNoResultsView.setVisibility(View.GONE);
        }

        mNeverEnteredQuery = false;
        mQuery = query;

        // If indexing is not finished, register the query text, but don't search.
        if (!mSearchFeatureProvider.isIndexingComplete(getActivity())) {
            return true;
        }
        

        if (isEmptyQuery) {
            final LoaderManager loaderManager = getLoaderManager();
            loaderManager.destroyLoader(SearchCommon.SearchLoaderId.SEARCH_RESULT);
            mShowingSavedQuery = true;
            mSavedQueryController.loadSavedQueries();
            mSearchFeatureProvider.hideFeedbackButton(getView());
        } else {
            mMetricsFeatureProvider.logEvent(SettingsIntelligenceEvent.PERFORM_SEARCH);
            restartLoaders();
        }

        return true;
    }
```

*   LoaderManagerImpl: 这里就是LoaderManager中转的地方

```java
        void start() {
            if (mRetaining && mRetainingStarted) {
                // Our owner is started, but we were being retained from a
                // previous instance in the started state...  so there is really
                // nothing to do here, since the loaders are still started.
                mStarted = true;
                return;
            }

            if (mStarted) {
                // If loader already started, don't restart.
                return;
            }

            mStarted = true;
            
            if (DEBUG) Log.v(TAG, "  Starting: " + this);
            if (mLoader == null && mCallbacks != null) {
               mLoader = mCallbacks.onCreateLoader(mId, mArgs);
            }
            if (mLoader != null) {
                if (mLoader.getClass().isMemberClass()
                        && !Modifier.isStatic(mLoader.getClass().getModifiers())) {
                    throw new IllegalArgumentException(
                            "Object returned from onCreateLoader must not be a non-static inner member class: "
                            + mLoader);
                }
                if (!mListenerRegistered) {
                    mLoader.registerListener(mId, this);
                    mLoader.registerOnLoadCanceledListener(this);
                    mListenerRegistered = true;
                }
                mLoader.startLoading();//zsg 这个地方中转
            }
        }
```

*   AsyncLoader: 开始执行Loader里的方法

```java
    // src/com/android/settings/intelligence/utils/AsyncLoader.java
    
    @Override
    protected void onStartLoading() {
        if (mResult != null) {
            deliverResult(mResult);
        }

        if (takeContentChanged() || mResult == null) {
            forceLoad();//zsg 这里
        }
    }

```

*   AsyncTaskLoader: 这里是调用子类SearchResultLoader中的loadInBackground

```java
        /* Runs on a worker thread */
        @Override
        protected D doInBackground(Void... params) {
            if (DEBUG) Log.v(TAG, this + " >>> doInBackground");
            try {
                D data = AsyncTaskLoader.this.onLoadInBackground();//zsg 这里
                if (DEBUG) Log.v(TAG, this + "  <<< doInBackground");
                return data;
            } catch (OperationCanceledException ex) {
                if (!isCancelled()) {
                    // onLoadInBackground threw a canceled exception spuriously.
                    // This is problematic because it means that the LoaderManager did not
                    // cancel the Loader itself and still expects to receive a result.
                    // Additionally, the Loader's own state will not have been updated to
                    // reflect the fact that the task was being canceled.
                    // So we treat this case as an unhandled exception.
                    throw ex;
                }
                if (DEBUG) Log.v(TAG, this + "  <<< doInBackground (was canceled)", ex);
                return null;
            }
        }

```

*   Loader: 从AsyncTaskLoader里调用过来，最后调用到onLoadFinished。这里的listener就是LoaderManager

```java
    public void deliverResult(D data) {
        if (mListener != null) {
            mListener.onLoadComplete(this, data);
        }
    }
```

### 开始执行SearchFeatureProviderImpl里的Task

```java
//src/com/android/settings/intelligence/search/SearchResultAggregator.java    

   @NonNull
    public synchronized List<? extends SearchResult> fetchResults(Context context, String query) {
        final SearchFeatureProvider mFeatureProvider = FeatureFactory.get(context)
                .searchFeatureProvider();
        final ExecutorService executorService = mFeatureProvider.getExecutorService();

        final List<SearchQueryTask> tasks =
                mFeatureProvider.getSearchQueryTasks(context, query);
        // Start tasks
        for (SearchQueryTask task : tasks) {
            executorService.execute(task);//zsg 这里
        }
```

*   上面就到了最开始截图部分的几个task了，也就是开始查询了，除了数据库之外都是直接查询的，但是数据库里的数据是哪里来的呢?
*   SearchFragment: Settings 11、updateIndexAsync 这里是最开始查找 

### 所有contentprovide 生成数据库的地方

```java
    // src/com/android/settings/intelligence/search/SearchFragment.java

	@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        long startTime = System.currentTimeMillis();
        setHasOptionsMenu(true);

        final LoaderManager loaderManager = getLoaderManager();
        mSearchAdapter = new SearchResultsAdapter(this /* fragment */);
        mSavedQueryController = new SavedQueryController(
                getContext(), loaderManager, mSearchAdapter);
        mSearchFeatureProvider.initFeedbackButton();

        if (savedInstanceState != null) {
            mQuery = savedInstanceState.getString(SearchCommon.STATE_QUERY);
            mNeverEnteredQuery = savedInstanceState.getBoolean(SearchCommon.STATE_NEVER_ENTERED_QUERY);
            mShowingSavedQuery = savedInstanceState.getBoolean(SearchCommon.STATE_SHOWING_SAVED_QUERY);
        } else {
            mShowingSavedQuery = true;
        }
        mSearchFeatureProvider.updateIndexAsync(getContext(), this /* indexingCallback */);
        if (SearchFeatureProvider.DEBUG) {
            Log.d(TAG, "onCreate spent " + (System.currentTimeMillis() - startTime) + " ms");
        }

        mmiIntent = new Intent(Intent.ACTION_MAIN);
        ComponentName mmiCtn = new ComponentName("com.qualcomm.qti.qmmi", "com.qualcomm.qti.qmmi.framework.HomeActivity");
        mmiIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        mmiIntent.setComponent(mmiCtn);

        hardwareInfoIntent = new Intent();
        ComponentName hardwareInfoCtn = new ComponentName("com.qualcomm.qti.qmmi",
                "com.qualcomm.qti.qmmi.framework.HardwareInfoActivity");
        hardwareInfoIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        hardwareInfoIntent.setComponent(hardwareInfoCtn);
    }

```

*   DatabaseIndexingManager 通过PROVIDER\_INTERFACE获取所有设置这个action的contentprovide

```java
    // src/com/android/settings/intelligence/search/indexing/DatabaseIndexingManager.java

	public void performIndexing() {
        final Intent intent = new Intent(SearchIndexablesContract.PROVIDER_INTERFACE);
        final List<ResolveInfo> providers =
                mContext.getPackageManager().queryIntentContentProviders(intent, 0);

        final boolean isFullIndex = IndexDatabaseHelper.isFullIndex(mContext, providers);

        if (isFullIndex) {
            rebuildDatabase();
        }

        PreIndexData indexData = getIndexDataFromProviders(providers, isFullIndex);

        final long updateDatabaseStartTime = System.currentTimeMillis();
        updateDatabase(indexData, isFullIndex);
        IndexDatabaseHelper.setIndexed(mContext, providers);
        if (DEBUG) {
            final long updateDatabaseTime = System.currentTimeMillis() - updateDatabaseStartTime;
            Log.d(TAG, "performIndexing updateDatabase took time: " + updateDatabaseTime);
        }
    }
```

*   PreIndexDataCollector 创建URI后通过getIndexablesForRawDataUri获取数据

### 通过getIndexablesForRawDataUri获取数据

```java
	// src/com/android/settings/intelligence/search/indexing/PreIndexDataCollector.java    

	private void addIndexablesFromRemoteProvider(String packageName, String authority) {
        try {
            final Context context = mContext.createPackageContext(packageName, 0);

            final Uri uriForResources = buildUriForXmlResources(authority);
            mIndexData.addDataToUpdate(authority, getIndexablesForXmlResourceUri(
                    context, packageName, uriForResources,
                    SearchIndexablesContract.INDEXABLES_XML_RES_COLUMNS));

            final Uri uriForRawData = buildUriForRawData(authority);
            mIndexData.addDataToUpdate(authority, getIndexablesForRawDataUri(
                    context, packageName, uriForRawData,
                    SearchIndexablesContract.INDEXABLES_RAW_COLUMNS));

            final Uri uriForSiteMap = buildUriForSiteMap(authority);
            mIndexData.addSiteMapPairs(getSiteMapFromProvider(context, uriForSiteMap));
        } catch (PackageManager.NameNotFoundException e) {
            Log.w(TAG, "Could not create context for " + packageName + ": "
                    + Log.getStackTraceString(e));
        }
    }
```

*   这里就会去查询对应的contentprovide，以Settings的contentprovide为例
*   SearchIndexablesProvider: 这里在framework里调用对应contentprovide的query

```java
    
	@Override
    public Cursor query(Uri uri, String[] projection, String selection, String[] selectionArgs,
                        String sortOrder) {
        try {
            switch (mMatcher.match(uri)) {
                case MATCH_RES_CODE:
                    return queryXmlResources(null);
                case MATCH_RAW_CODE:
                    return queryRawData(null);
                case MATCH_NON_INDEXABLE_KEYS_CODE:
                    return queryNonIndexableKeys(null);
                case MATCH_SITE_MAP_PAIRS_CODE:
                    return querySiteMapPairs();
                case MATCH_SLICE_URI_PAIRS_CODE:
                    return querySliceUriPairs();
                case MATCH_DYNAMIC_RAW_CODE:
                    return queryDynamicRawData(null);
                default:
                    throw new UnsupportedOperationException("Unknown Uri " + uri);
            }
        } catch (UnsupportedOperationException e) {
            throw e;
        } catch (Exception e) {
            Log.e(TAG, "Provider querying exception:", e);
            return null;
        }
    }
```

*   SettingsSearchIndexablesProvider: 最后调用到settings 里设置的用来搜索的BaseSearchIndexProvider ，这个不是contentprovide，只是继承了settinglib里的SearchIndexProvider接口，用来注解生成代码

```java
    private List<SearchIndexableRaw> getSearchIndexableRawFromProvider(Context context) {
        final Collection<SearchIndexableData> bundles = FeatureFactory.getFactory(context)
                .getSearchFeatureProvider().getSearchIndexableResources().getProviderValues();
        final List<SearchIndexableRaw> rawList = new ArrayList<>();

        for (SearchIndexableData bundle : bundles) {
            Indexable.SearchIndexProvider provider = bundle.getSearchIndexProvider();
            final List<SearchIndexableRaw> providerRaws = provider.getRawDataToIndex(context,
                    true /* enabled */);//zsg 这里

            if (providerRaws == null) {
                continue;
            }

            for (SearchIndexableRaw raw : providerRaws) {
                // The classname and intent information comes from the PreIndexData
                // This will be more clear when provider conversion is done at PreIndex time.
                raw.className = bundle.getTargetClass().getName();
            }
            rawList.addAll(providerRaws);
        }

        return rawList;
    }
```

## setting数据库查看到底被哪个进程修改了

settings 里设置的值如何在手机里查看,可以看是某个app设置的

/data/system/users/0/settings\_secure.xml  

/data/system/users/0/settings\_global.xml  

/data/system/users/0/settings\_global.xml  

例如：

```xml
<setting id="64" name="keyboard_backlight_enable" value="0" package="android" defaultValue="0" defaultSysSet="true" />
<setting id="89" name="user_setup_personalization_state" value="0" package="com.google.android.setupwizard" defaultValue="0" defaultSysSet="true" />
<setting id="98" name="clock_seconds" package="com.android.systemui" />
```

`/data/system/users/0/appwidgets.xml`  widgets的存放路径

## settings中通过action跳转页面

- ACTION\_SETTINGS 系统设置界面  
- ACTION\_APN\_SETTINGS APN设置界面  
- ACTION\_LOCATION\_SOURCE\_SETTINGS 定位设置界面  
- ACTION\_AIRPLANE\_MODE\_SETTINGS 更多连接方式设置界面  
- ACTION\_DATA\_ROAMING\_SETTINGS 双卡和移动网络设置界面  
- ACTION\_ACCESSIBILITY\_SETTINGS 无障碍设置界面/辅助功能界面  
- ACTION\_SYNC\_SETTINGS 同步设置界面  
- ACTION\_ADD\_ACCOUNT 添加账户界面  
- ACTION\_NETWORK\_OPERATOR\_SETTINGS 选取运营商的界面  
- ACTION\_SECURITY\_SETTINGS 安全设置界面  
- ACTION\_PRIVACY\_SETTINGS 备份重置设置界面  
- ACTION\_VPN\_SETTINGS VPN设置界面,可能不存在  
- ACTION\_WIFI\_SETTINGS 无线网设置界面  
- ACTION\_WIFI\_IP\_SETTINGS WIFI的IP设置  
- ACTION\_BLUETOOTH\_SETTINGS 蓝牙设置  
- ACTION\_CAST\_SETTINGS 投射设置  
- ACTION\_DATE\_SETTINGS 日期时间设置  
- ACTION\_SOUND\_SETTINGS 声音设置  
- ACTION\_DISPLAY\_SETTINGS 显示设置  
- ACTION\_LOCALE\_SETTINGS 语言设置  
- ACTION\_VOICE\_INPUT\_SETTINGS 辅助应用和语音输入设置  
- ACTION\_INPUT\_METHOD\_SETTINGS 语言和输入法设置  
- ACTION\_USER\_DICTIONARY\_SETTINGS 个人字典设置界面  
- ACTION\_INTERNAL\_STORAGE\_SETTINGS 存储空间设置的界面  
- ACTION\_SEARCH\_SETTINGS 搜索设置界面  
- ACTION\_APPLICATION\_DEVELOPMENT\_SETTINGS 开发者选项  
- ACTION\_DEVICE\_INFO\_SETTINGS 手机状态信息的界面  
- ACTION\_DREAM\_SETTINGS 互动屏保设置的界面 
- 
  ACTION\_NOTIFICATION\_LISTENER\_SETTINGS 通知使用权设置的界面  
- ACTION\_NOTIFICATION\_POLICY\_ACCESS\_SETTINGS 勿扰权限设置的界面  
- ACTION\_CAPTIONING\_SETTINGS 字幕设置的界面  
- ACTION\_PRINT\_SETTINGS 打印设置界面  
- ACTION\_BATTERY\_SAVER\_SETTINGS 节电助手界面  
- ACTION\_HOME\_SETTINGS 主屏幕设置界面  
- ACTION\_APPLICATION\_DETAILS\_SETTINGS 根据包名跳转到系统自带的应用程序信息  
- ACTION\_APPLICATION\_SETTINGS 应用程序列表  
- ACTION\_MANAGE\_ALL\_APPLICATIONS\_SETTINGS 应用程序界面【所有的】  
- ACTION\_MANAGE\_APPLICATIONS\_SETTINGS 应用程序列表界面【已安装的】  
- ACTION\_INPUT\_METHOD\_SUBTYPE\_SETTINGS 【API 11及以上】语言选择界面 【多国语言选择】  
- ACTION\_NFCSHARING\_SETTINGS 显示NFC共享设置【API 14及以上】  
- ACTION\_NFC\_SETTINGS 显示NFC设置【API 16及以上】  
- ACTION\_QUICK\_LAUNCH\_SETTINGS 快速启动设置界面

其中，根据包名跳转到系统自带的应用程序信息界面的方式为：

```java
Uri packageURI = Uri.parse("package:" + "com.tencent.WBlog");  
Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,packageURI);  
startIntent(intent);
```

  

本文转自 [https://blog.csdn.net/qq\_34250794/article/details/116014891?utm\_medium=distribute.pc\_relevant.none-task-blog-2~default~baidujs\_baidulandingword~default-0-116014891-blog-106889572.235^v43^pc\_blog\_bottom\_relevance\_base7&spm=1001.2101.3001.4242.1&utm\_relevant\_index=3](https://blog.csdn.net/qq_34250794/article/details/116014891?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_baidulandingword~default-0-116014891-blog-106889572.235^v43^pc_blog_bottom_relevance_base7&spm=1001.2101.3001.4242.1&utm_relevant_index=3)，如有侵权，请联系删除。