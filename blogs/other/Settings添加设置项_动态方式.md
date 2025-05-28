---
title: 添加设置项-动态方式
date: 2025-05-24
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 为什么要这样做？

上一篇[通过静态方式添加配置项](https://blog.csdn.net/u012932409/article/details/106574155?spm=a2c6h.12873639.article-detail.4.31c11f0bzTIERV)，应用场景太局限。

所以继续研究加载原理,终于发现了动态加载的奥秘。

## 文件清单

`frameworks\base\packages\SettingsLib\Tile\src\com\android\settingslib\drawer\TileUtils.java`
`vendor\mediatek\proprietary\packages\apps\MtkSettings\src\com\android\settings\dashboard\DashboardFragment.java`

## 实现过程

### 取消系统应用限制

去除 TileUtils 中是否系统App判断逻辑, 注释 getTilesForAction() 中 resolved.system 判断

`frameworks\base\packages\SettingsLib\Tile\src\com\android\settingslib\drawer\TileUtils.java`

```java
static void getTilesForAction(Context context,
            UserHandle user, String action, Map<Pair<String, String>, Tile> addedCache,
            String defaultCategory, List<Tile> outTiles, boolean requireSettings) {
        final Intent intent = new Intent(action);
        if (requireSettings) {
            intent.setPackage(SETTING_PKG);
        }
        final PackageManager pm = context.getPackageManager();
        List<ResolveInfo> results = pm.queryIntentActivitiesAsUser(intent,
                PackageManager.GET_META_DATA, user.getIdentifier());
        for (ResolveInfo resolved : results) {
            if (!resolved.system) {
                // Do not allow any app to add to settings, only system ones.
                Log.w(LOG_TAG, "not allow  app " + resolved.activityInfo.name);
				//cczheng annotaion for 3rd app can add setting preference
                //continue;
            }
            Log.w(LOG_TAG, "resolved.targetUserId="+resolved.targetUserId);
            ActivityInfo activityInfo = resolved.activityInfo;
            Bundle metaData = activityInfo.metaData;
            String categoryKey = defaultCategory;

```

系统修改就已经搞定了，我去，这也太简单了吧，不是，你骗我的吧。大兄弟真的搞定了，只要注释 continue; 就行了

### 三方应用清单文件

接下来就可以为所欲为的添加配置项了。客户只需要在自己 app 的 AndroidManifest.xml 中配置属性给要跳转的Activity即可

```xml
<activity android:name=".activity.SettingPreferenceActivity">
    <intent-filter >
        <action android:name="com.android.settings.action.EXTRA_SETTINGS" />
    </intent-filter>
    <meta-data
               android:name="com.android.settings.category"
               android:value="com.android.settings.category.ia.homepage" /> 主要在这里定义
    <meta-data
               android:name="com.android.settings.order"
               android:value="-150" />
    <meta-data
               android:name="com.android.settings.icon"
               android:resource="@mipmap/ic_icon" />
    <meta-data
               android:name="com.android.settings.summary"
               android:resource="@string/title_activity_settings" />
</activity>
```

解释下各个属性意义

> com.android.settings.action.EXTRA_SETTINGS 设置遍历所有应用解析标记
>
> com.android.settings.category.ia.homepage 在设置主界面显示 路径`frameworks/base/packages/SettingsLib/src/com/android/settingslib/drawer/CategoryKey.java`
>
> com.android.settings.order 设置主界面排序，网络和互联网默认-120，只要大于即可排到第一
>
> com.android.settings.icon 显示图标
>
> com.android.settings.summary 显示子标题文字

## 遇到的问题解决

当动态添加设置项对应app卸载后，再次进入设置页面，会看到如下bug

![trfMh6.png](https://raw.githubusercontent.com/shug666/image/main/imagesjjv67obwemye6_a85c81c83c5c4aaf91fd94e27a04a92c.png)

问题日志如下，app卸载后由于设置应用没有重新初始化，缓存了刚刚的状态，加载设置项对应icon找不到资源，就出现上述bug，

当你把设置强行停止再进入发现bug消失了，但总不能要求客户也这么操作吧。

```bash
2020-06-05 16:39:56.964 6059-6059/com.android.settings D/AdaptiveHomepageIcon: Setting background color -15043608
2020-06-05 16:39:56.965 6059-6059/com.android.settings I/TopLevelSettings: key dashboard_tile_pref_com.cczheng.androiddemo.activity.SettingPreferenceActivity
2020-06-05 16:39:56.965 6059-6059/com.android.settings D/TopLevelSettings: tile null
2020-06-05 16:39:56.966 6059-6059/com.android.settings D/Tile: Can't find package, probably uninstalled.
2020-06-05 16:39:56.966 6059-6059/com.android.settings W/ziparchive: Unable to open '/data/app/com.cczheng.androiddemo-tcKDlXiPvEgQLoVFL4Pd3g==/base.apk': No such file or directory
2020-06-05 16:39:56.967 6059-6059/com.android.settings E/ndroid.setting: Failed to open APK '/data/app/com.cczheng.androiddemo-tcKDlXiPvEgQLoVFL4Pd3g==/base.apk' I/O error
2020-06-05 16:39:56.967 6059-6059/com.android.settings E/ResourcesManager: failed to add asset path /data/app/com.cczheng.androiddemo-tcKDlXiPvEgQLoVFL4Pd3g==/base.apk
2020-06-05 16:39:56.967 6059-6059/com.android.settings W/PackageManager: Failure retrieving resources for com.cczheng.androiddemo
2020-06-05 16:39:56.968 6059-6059/com.android.settings D/Tile: Can't find package, probably uninstalled.
2020-06-05 16:39:56.970 6059-6059/com.android.settings D/Tile: Couldn't find info
    android.content.pm.PackageManager$NameNotFoundException: com.cczheng.androiddemo
        at android.app.ApplicationPackageManager.getApplicationInfoAsUser(ApplicationPackageManager.java:414)
        at android.app.ApplicationPackageManager.getApplicationInfo(ApplicationPackageManager.java:395)
        at android.app.ApplicationPackageManager.getResourcesForApplication(ApplicationPackageManager.java:1545)
        at com.android.settingslib.drawer.Tile.getSummary(Tile.java:220)
        at com.android.settings.dashboard.DashboardFeatureProviderImpl.bindSummary(DashboardFeatureProviderImpl.java:172)
        at com.android.settings.dashboard.DashboardFeatureProviderImpl.bindPreferenceToTile(DashboardFeatureProviderImpl.java:117)
        at com.android.settings.dashboard.DashboardFragment.refreshDashboardTiles(DashboardFragment.java:511)
        at com.android.settings.dashboard.DashboardFragment.refreshAllPreferences(DashboardFragment.java:394)
        at com.android.settings.dashboard.DashboardFragment.onCreatePreferences(DashboardFragment.java:170)
        at androidx.preference.PreferenceFragmentCompat.onCreate(PreferenceFragmentCompat.java:160)
        at com.android.settingslib.core.lifecycle.ObservablePreferenceFragment.onCreate(ObservablePreferenceFragment.java:61)
```

### 解决办法

依旧是通过检测APP是否已经卸载来决定是否加载对应配置项，依旧是在 DashboardFragment 中

`vendor\mediatek\proprietary\packages\apps\MtkSettings\src\com\android\settings\dashboard\DashboardFragment.java`

```java
void refreshDashboardTiles(final String TAG) {
        ......
        // Install dashboard tiles.
        final boolean forceRoundedIcons = shouldForceRoundedIcon();
        for (Tile tile : tiles) {
            final String key = mDashboardFeatureProvider.getDashboardKeyForTile(tile);
            if (TextUtils.isEmpty(key)) {
                Log.d(TAG, "tile does not contain a key, skipping " + tile);
                continue;
            }

            Log.i(TAG, "key " +  key);
            Log.d(TAG, "tile " +  tile.getKey(getContext()));
			//cczheng add for fix app uninstall show bug
            if (!checkTilePackage(tile.getPackageName())) {
                Log.d(TAG, "Can't find package, probably uninstalled don't load");
                continue;
            }//E check  Can't find package, probably uninstalled.
           
            if (!displayTile(tile)) {
                continue;
            }

			......
}

 private boolean checkTilePackage(String packageName){
      try { 
           android.content.pm.PackageManager pm =  getContext().getPackageManager();
           pm.getApplicationInfo(packageName, android.content.pm.PackageManager.GET_UNINSTALLED_PACKAGES);
           android.util.Log.e("DashboardAdapter", packageName + " app exists show voip dashboard");
           return true; 
      }catch (Exception e){ 
          android.util.Log.e("DashboardAdapter", packageName + " app don't exists"); 
          return false; 
      } 
  }
```

好了，至此需求已经搞定了。如果你想知道为啥这样改，请继续往下看。

## 原理分析

### **从启动开始说起**

进入setting的AndroidManifest.xml里看一看，找启动Activity

```xml
 <!-- Alias for launcher activity only, as this belongs to each profile. -->
        <activity-alias android:name="Settings"
                android:label="@string/settings_label_launcher"
                android:launchMode="singleTask"
                android:targetActivity=".homepage.SettingsHomepageActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            <meta-data android:name="android.app.shortcuts" android:resource="@xml/shortcuts"/>
        </activity-alias>
```

发现启动Activity是Settings,但是前面的标签是activity-alias，所以这是另一个Activity的别名，然后它真实的启动Activity应该是targetActivity所标注的SettingsHomepageActivity。

### **走进SettingsHomepageActivity.java**

`vendor\mediatek\proprietary\packages\apps\MtkSettings\src\com\android\settings\homepage\SettingsHomepageActivity.java`

```java
public class SettingsHomepageActivity extends FragmentActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.settings_homepage_container);
        final View root = findViewById(R.id.settings_homepage_container);
        root.setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);

        
        setHomepageContainerPaddingTop();

        final Toolbar toolbar = findViewById(R.id.search_action_bar);
        FeatureFactory.getFactory(this).getSearchFeatureProvider()
                .initSearchToolbar(this /* activity */, toolbar, SettingsEnums.SETTINGS_HOMEPAGE);

        final ImageView avatarView = findViewById(R.id.account_avatar);
        final AvatarViewMixin avatarViewMixin = new AvatarViewMixin(this, avatarView);
        getLifecycle().addObserver(avatarViewMixin);

        if (!getSystemService(ActivityManager.class).isLowRamDevice()) {
            // Only allow contextual feature on high ram devices.
            showFragment(new ContextualCardsFragment(), R.id.contextual_cards_content);
        }
        showFragment(new TopLevelSettings(), R.id.main_content);
        ((FrameLayout) findViewById(R.id.main_content))
                .getLayoutTransition().enableTransitionType(LayoutTransition.CHANGING);
    }

    private void showFragment(Fragment fragment, int id) {
        final FragmentManager fragmentManager = getSupportFragmentManager();
        final FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        final Fragment showFragment = fragmentManager.findFragmentById(id);

        if (showFragment == null) {
            fragmentTransaction.add(id, fragment);
        } else {
            fragmentTransaction.show(showFragment);
        }
        fragmentTransaction.commit();
    }

    @VisibleForTesting
    void setHomepageContainerPaddingTop() {
        final View view = this.findViewById(R.id.homepage_container);

        final int searchBarHeight = getResources().getDimensionPixelSize(R.dimen.search_bar_height);
        final int searchBarMargin = getResources().getDimensionPixelSize(R.dimen.search_bar_margin);

        // The top padding is the height of action bar(48dp) + top/bottom margins(16dp)
        final int paddingTop = searchBarHeight + searchBarMargin * 2;
        view.setPadding(0 /* left */, paddingTop, 0 /* right */, 0 /* bottom */);
    }
}
```

代码不多，布局文件对应 settings_homepage_container.xml, 布局加载完成后增加顶部padding为了给SearchActionBar预留空间，

如果不需要SeacherActionBar直接将这部分代码注释即可。接下来看到新创建 TopLevelSettings 填充 main_content，主角登场啦。

TopLevelSettings 就是我们看到的Settings主界面。

### **进入TopLevelSettings**

`vendor\mediatek\proprietary\packages\apps\MtkSettings\src\com\android\settings\homepage\TopLevelSettings.java`

```java
public class TopLevelSettings extends DashboardFragment implements
        PreferenceFragmentCompat.OnPreferenceStartFragmentCallback {

    private static final String TAG = "TopLevelSettings";

    public TopLevelSettings() {
        final Bundle args = new Bundle();
        // Disable the search icon because this page uses a full search view in actionbar.
        args.putBoolean(NEED_SEARCH_ICON_IN_ACTION_BAR, false);
        setArguments(args);
    }

    @Override
    protected int getPreferenceScreenResId() {
        return R.xml.top_level_settings;
    }
```

#### **top_level_settings.xml**

`vendor\mediatek\proprietary\packages\apps\MtkSettings\res\xml\top_level_settings.xml`

```xml
<PreferenceScreen
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:settings="http://schemas.android.com/apk/res-auto"
    android:key="top_level_settings">

    <Preference
        android:key="top_level_network"
        android:title="@string/network_dashboard_title"
        android:summary="@string/summary_placeholder"
        android:icon="@drawable/ic_homepage_network"
        android:order="-120"
        android:fragment="com.android.settings.network.NetworkDashboardFragment"
        settings:controller="com.android.settings.network.TopLevelNetworkEntryPreferenceController"/>

    <Preference
        android:key="top_level_connected_devices"
        android:title="@string/connected_devices_dashboard_title"
        android:summary="@string/summary_placeholder"
        android:icon="@drawable/ic_homepage_connected_device"
        android:order="-110"
        android:fragment="com.android.settings.connecteddevice.ConnectedDeviceDashboardFragment"
        settings:controller="com.android.settings.connecteddevice.TopLevelConnectedDevicesPreferenceController"/>

    <Preference
        android:key="top_level_apps_and_notifs"
        android:title="@string/app_and_notification_dashboard_title"
        android:summary="@string/app_and_notification_dashboard_summary"
        android:icon="@drawable/ic_homepage_apps"
        android:order="-100"
        android:fragment="com.android.settings.applications.AppAndNotificationDashboardFragment"/>
```

可以看到主界面对应布局 top_level_settings.xml中都是一个个Preference，也就对应了主页面每一个条目，可以看到

xml中Preference数目和主界面显示数目是不对等了，为啥呢？因为存在**动态添加**的，查阅 TopLevelSettings 代码发现没啥

特殊而且代码量很少，看到 TopLevelSettings 继承DashboardFragment，点进去看看

### **DashboardFragment.java**

`vendor\mediatek\proprietary\packages\apps\MtkSettings\src\com\android\settings\dashboard\DashboardFragment.java`

```java
@Override
    public void onAttach(Context context) {
        super.onAttach(context);
        mSuppressInjectedTileKeys = Arrays.asList(context.getResources().getStringArray(
                R.array.config_suppress_injected_tile_keys));
        mDashboardFeatureProvider = FeatureFactory.getFactory(context).
                getDashboardFeatureProvider(context);
        final List<AbstractPreferenceController> controllers = new ArrayList<>();
        // Load preference controllers from code
        final List<AbstractPreferenceController> controllersFromCode =
                createPreferenceControllers(context);
        // Load preference controllers from xml definition
        final List<BasePreferenceController> controllersFromXml = PreferenceControllerListHelper
                .getPreferenceControllersFromXml(context, getPreferenceScreenResId());
        // Filter xml-based controllers in case a similar controller is created from code already.
        final List<BasePreferenceController> uniqueControllerFromXml =
                PreferenceControllerListHelper.filterControllers(
                        controllersFromXml, controllersFromCode);

        // Add unique controllers to list.
        if (controllersFromCode != null) {
            controllers.addAll(controllersFromCode);
        }
        controllers.addAll(uniqueControllerFromXml);

      
    }
```

注释已经写得很清楚了，分别从java代码和xml中加载PreferenceController，然后过滤去重最终加载页面显示。

java代码加载

`createPreferenceControllers() return null`,  而且子类TopLevelSettings并未覆盖实现，所以 controllersFromCode 为 null

xml加载

`getPreferenceControllersFromXml(context, getPreferenceScreenResId())`, getPreferenceScreenResId对应刚刚的 top_level_settings

具体的遍历解析xml文件代码就不看了，可以自行跟进去查看

controllers 集合获取完成，那么这个 Controller 究竟有什么用呢？

看Settings中的Preference你会发信几乎每个都对应一个 settings:controller 属性，xml中若没有那么也会在java代码中对应增加 controller 

Controller 可以用来处理 Preference的显示和点击。扯远了回到主题，继续寻找和动态增加相关线索

```java
@Override
public void onCreatePreferences(Bundle savedInstanceState, String rootKey) {
    refreshAllPreferences(getLogTag());
}

private void refreshAllPreferences(final String TAG) {
        final PreferenceScreen screen = getPreferenceScreen();
        // First remove old preferences.
        if (screen != null) {
            // Intentionally do not cache PreferenceScreen because it will be recreated later.
            screen.removeAll();
        }

        // Add resource based tiles.
        displayResourceTiles();

        refreshDashboardTiles(TAG);

        final Activity activity = getActivity();
        if (activity != null) {
            Log.d(TAG, "All preferences added, reporting fully drawn");
            activity.reportFullyDrawn();
        }

        updatePreferenceVisibility(mPreferenceControllers);
}

```

嗯，这下有点意思了，refreshAllPreferences() 一上来移除所有的Preference，通过 displayResourceTiles()

加载指定xml中的所有Preference

```java
private void displayResourceTiles() {
    final int resId = getPreferenceScreenResId();
    if (resId <= 0) {
        return;
    }
    addPreferencesFromResource(resId);
    final PreferenceScreen screen = getPreferenceScreen();
    screen.setOnExpandButtonClickListener(this);
    mPreferenceControllers.values().stream().flatMap(Collection::stream).forEach(
        controller -> controller.displayPreference(screen));
}
```

好像也不是我们要找的，再往下看 refreshDashboardTiles(TAG);

```java
void refreshDashboardTiles(final String TAG) {
        final PreferenceScreen screen = getPreferenceScreen();

        final DashboardCategory category =
                mDashboardFeatureProvider.getTilesForCategory(getCategoryKey());
        Log.e(TAG, "refreshDashboardTiles key="+ getCategoryKey());
        if (category == null) {
            Log.d(TAG, "NO dashboard tiles for " + TAG);
            return;
        }
        final List<Tile> tiles = category.getTiles();
        if (tiles == null) {
            Log.d(TAG, "tile list is empty, skipping category " + category.key);
            return;
        }
         Log.e(TAG, "tile list size="+tiles.size());
        // Create a list to track which tiles are to be removed.
        final List<String> remove = new ArrayList<>(mDashboardTilePrefKeys);

        // There are dashboard tiles, so we need to install SummaryLoader.
        if (mSummaryLoader != null) {
            mSummaryLoader.release();
        }
        final Context context = getContext();
        mSummaryLoader = new SummaryLoader(getActivity(), getCategoryKey());
        mSummaryLoader.setSummaryConsumer(this);
        // Install dashboard tiles.
        final boolean forceRoundedIcons = shouldForceRoundedIcon();
        for (Tile tile : tiles) {
            final String key = mDashboardFeatureProvider.getDashboardKeyForTile(tile);
            if (TextUtils.isEmpty(key)) {
                Log.d(TAG, "tile does not contain a key, skipping " + tile);
                continue;
            }

            Log.i(TAG, "key " +  key);
            Log.d(TAG, "tile " +  tile.getKey(getContext()));
           
            if (!displayTile(tile)) {
                continue;
            }
            if (mDashboardTilePrefKeys.contains(key)) {
                // Have the key already, will rebind.
                final Preference preference = screen.findPreference(key);
                mDashboardFeatureProvider.bindPreferenceToTile(getActivity(), forceRoundedIcons,
                        getMetricsCategory(), preference, tile, key,
                        mPlaceholderPreferenceController.getOrder());
            } else {
                // Don't have this key, add it.
                final Preference pref = new Preference(getPrefContext());
                mDashboardFeatureProvider.bindPreferenceToTile(getActivity(), forceRoundedIcons,
                        getMetricsCategory(), pref, tile, key,
                        mPlaceholderPreferenceController.getOrder());
                screen.addPreference(pref);
                mDashboardTilePrefKeys.add(key);
            }
            remove.remove(key);
        }
        // Finally remove tiles that are gone.
        for (String key : remove) {
             Log.d(TAG, "remove tiles that are gone " +  key);
            mDashboardTilePrefKeys.remove(key);
            final Preference preference = screen.findPreference(key);
            if (preference != null) {
                screen.removePreference(preference);
            }
        }
        mSummaryLoader.setListening(true);
    }
```

哈哈哈，终于找到奥秘所在了，因为这个方法中有调用 addPreference(),页面中要想增加Preference条目必须调用此方法，

接下来逐行来看这个方法都干什么了？

`final DashboardCategory category = mDashboardFeatureProvider.getTilesForCategory(getCategoryKey());`

来看传递参数 getCategoryKey()

```java
public String getCategoryKey() {
        return DashboardFragmentRegistry.PARENT_TO_CATEGORY_KEY_MAP.get(getClass().getName());
}
```

`getClass().getName()` 获取当前调用类名，我们从 TopLevelSettings 中进来的，那自然是它

`DashboardFragmentRegistry.PARENT_TO_CATEGORY_KEY_MAP` 是静态MAP集合，看下初始赋值

`vendor\mediatek\proprietary\packages\apps\MtkSettings\src\com\android\settings\dashboard\DashboardFragmentRegistry.java`

看到 TopLevelSettings 对应 String 为 CategoryKey.CATEGORY_HOMEPAGE，也就是 getCategoryKey() 返回值

**为 `com.android.settings.category.ia.homepage`**

`frameworks\base\packages\SettingsLib\src\com\android\settingslib\drawer\CategoryKey.java`

```java
public final class CategoryKey {

    // Activities in this category shows up in Settings homepage.
    public static final String CATEGORY_HOMEPAGE = "com.android.settings.category.ia.homepage";

    // Top level category.
    public static final String CATEGORY_NETWORK = "com.android.settings.category.ia.wireless";
    
```

进入 getTilesForCategory() 中获取 DashboardCategory

`vendor\mediatek\proprietary\packages\apps\MtkSettings\src\com\android\settings\dashboard\CategoryManager.java`

```java
public synchronized DashboardCategory getTilesByCategory(Context context, String categoryKey) {
        tryInitCategories(context);

        return mCategoryByKeyMap.get(categoryKey);
    }
```

可以看到从 mCategoryByKeyMap 中获取 key为`com.android.settings.category.ia.homepage` 对应 DashboardCategory

mCategoryByKeyMap 赋值在 tryInitCategories() 中

```java
private synchronized void tryInitCategories(Context context, boolean forceClearCache) {
        if (mCategories == null) {
            if (forceClearCache) {
                mTileByComponentCache.clear();
            }
            mCategoryByKeyMap.clear();
            mCategories = TileUtils.getCategories(context, mTileByComponentCache);
            for (DashboardCategory category : mCategories) {
                 android.util.Log.i("settingslib", "category.key="+category.key);
                mCategoryByKeyMap.put(category.key, category);
            }
            backwardCompatCleanupForCategory(mTileByComponentCache, mCategoryByKeyMap);
            sortCategories(context, mCategoryByKeyMap);
            filterDuplicateTiles(mCategoryByKeyMap);
        }
    }
```

`frameworks\base\packages\SettingsLib\Tile\src\com\android\settingslib\drawer\TileUtils.java`

```java
    /**
     * Build a list of DashboardCategory.
     */
    public static List<DashboardCategory> getCategories(Context context,
            Map<Pair<String, String>, Tile> cache) {
        final long startTime = System.currentTimeMillis();
        boolean setup = Global.getInt(context.getContentResolver(), Global.DEVICE_PROVISIONED, 0)
                != 0;
        ArrayList<Tile> tiles = new ArrayList<>();
        UserManager userManager = (UserManager) context.getSystemService(Context.USER_SERVICE);
        for (UserHandle user : userManager.getUserProfiles()) {
            // TODO: Needs much optimization, too many PM queries going on here.
            loge("getIdentifier="+user.getIdentifier());
            loge("getCurrentUser="+ActivityManager.getCurrentUser());//
            if (user.getIdentifier() == ActivityManager.getCurrentUser()) {
                // Only add Settings for this user.
                getTilesForAction(context, user, SETTINGS_ACTION, cache, null, tiles, true);
                getTilesForAction(context, user, OPERATOR_SETTINGS, cache,
                        OPERATOR_DEFAULT_CATEGORY, tiles, false);
                getTilesForAction(context, user, MANUFACTURER_SETTINGS, cache,
                        MANUFACTURER_DEFAULT_CATEGORY, tiles, false);
            }
            if (setup) {
                getTilesForAction(context, user, EXTRA_SETTINGS_ACTION, cache, null, tiles, false);
                getTilesForAction(context, user, IA_SETTINGS_ACTION, cache, null, tiles, false);
            }
        }

        HashMap<String, DashboardCategory> categoryMap = new HashMap<>();
        for (Tile tile : tiles) {
            final String categoryKey = tile.getCategory();
            DashboardCategory category = categoryMap.get(categoryKey);
            if (category == null) {
                category = new DashboardCategory(categoryKey);

                if (category == null) {
                    Log.w(LOG_TAG, "Couldn't find category " + categoryKey);
                    continue;
                }
                categoryMap.put(categoryKey, category);
            }
            category.addTile(tile);
        }
        ArrayList<DashboardCategory> categories = new ArrayList<>(categoryMap.values());
        for (DashboardCategory category : categories) {
            category.sortTiles();
        }

        if (DEBUG_TIMING) {
            Log.d(LOG_TAG, "getCategories took "
                    + (System.currentTimeMillis() - startTime) + " ms");
        }
        return categories;
    }
```

可以看到开始创建空集合 tiles，通过调用getTilesForAction() 进行赋值。赋值后遍历 tiles，获取

tile中 DashboardCategory，判断 categoryMap 中是否包含，不包含则往里添加。最终创建 ArrayList categories，

并赋值 categoryMap.values()，进行排序后 return categories

核心还是在 tiles 赋值，再来看 getTilesForAction()

```java
static void getTilesForAction(Context context,
            UserHandle user, String action, Map<Pair<String, String>, Tile> addedCache,
            String defaultCategory, List<Tile> outTiles, boolean requireSettings) {
        loge("action="+action);
        final Intent intent = new Intent(action);
        if (requireSettings) {
            intent.setPackage(SETTING_PKG);
        }
        final PackageManager pm = context.getPackageManager();
        List<ResolveInfo> results = pm.queryIntentActivitiesAsUser(intent,
                PackageManager.GET_META_DATA, user.getIdentifier());
        for (ResolveInfo resolved : results) {
            if (!resolved.system) {
                // Do not allow any app to add to settings, only system ones.
                Log.w(LOG_TAG, "not allow  app " + resolved.activityInfo.name);
                continue;
            }
            Log.w(LOG_TAG, "resolved.targetUserId="+resolved.targetUserId);
            ActivityInfo activityInfo = resolved.activityInfo;
            Bundle metaData = activityInfo.metaData;
            String categoryKey = defaultCategory;

            // Load category
            if ((metaData == null || !metaData.containsKey(EXTRA_CATEGORY_KEY))
                    && categoryKey == null) {
                Log.w(LOG_TAG, "Found " + resolved.activityInfo.name + " for intent "
                        + intent + " missing metadata "
                        + (metaData == null ? "" : EXTRA_CATEGORY_KEY));
                loge("Found " + resolved.activityInfo.name + " for intent "
                        + intent + " missing metadata "
                        + (metaData == null ? "" : EXTRA_CATEGORY_KEY));
                continue;
            } else {
                categoryKey = metaData.getString(EXTRA_CATEGORY_KEY);
            }

            Pair<String, String> key = new Pair<>(activityInfo.packageName, activityInfo.name);
            Tile tile = addedCache.get(key);
            if (tile == null) {
                tile = new Tile(activityInfo, categoryKey);
                addedCache.put(key, tile);
            } else {
                tile.setMetaData(metaData);
            }

            if (!tile.userHandle.contains(user)) {
                tile.userHandle.add(user);
            }
            if (!outTiles.contains(tile)) {
                outTiles.add(tile);
            }
            loge("tile key="+tile.getPackageName());
        }
    }
```

通过 PackageManager 查询系统中所有带指定 Action 的 Intent 对应信息 ResolveInfo 集合，然后遍历该集合

获取符合条件应用信息包名、类名、icon等构造 tile，最终添加进 outTiles 中。

可以看到循环一开始就有硬性判断，`if (!resolved.system)`

`// Do not allow any app to add to settings, only system ones.`

必须是系统应用才能向Setting主界面中添加配置项，这显然不是我们希望的，我们既然是开放给客户的，自然不需要这个判断

注释 continue 即可。

上面说到必须是指定action，才能被 PackageManager 搜索到，来看下都有哪些Action

```java
private static final String SETTINGS_ACTION = "com.android.settings.action.SETTINGS";
private static final String OPERATOR_SETTINGS = "com.android.settings.OPERATOR_APPLICATION_SETTING";
private static final String MANUFACTURER_SETTINGS = "com.android.settings.MANUFACTURER_APPLICATION_SETTING";
public static final String EXTRA_SETTINGS_ACTION = "com.android.settings.action.EXTRA_SETTINGS";
public static final String IA_SETTINGS_ACTION = "com.android.settings.action.IA_SETTINGS";

private static final String EXTRA_CATEGORY_KEY = "com.android.settings.category";
public static final String META_DATA_KEY_ORDER = "com.android.settings.order";

getTilesForAction(context, user, SETTINGS_ACTION, cache, null, tiles, true);
getTilesForAction(context, user, OPERATOR_SETTINGS, cache, OPERATOR_DEFAULT_CATEGORY, tiles, false);
getTilesForAction(context, user, MANUFACTURER_SETTINGS, cache, MANUFACTURER_DEFAULT_CATEGORY, tiles, false);

getTilesForAction(context, user, EXTRA_SETTINGS_ACTION, cache, null, tiles, false);
getTilesForAction(context, user, IA_SETTINGS_ACTION, cache, null, tiles, false);
```

可以看到我们上面指定的就是 `com.android.settings.action.EXTRA_SETTINGS`，google 的 GMSCore app 采用的是

`com.android.settings.action.IA_SETTINGS`

配置了指定Action后，还需要配置 meta-data 节点，别忘记了 Settings 中匹配 category 通过 `key=com.android.settings.category.ia.homepage`

```java
// Load category
if ((metaData == null || !metaData.containsKey(EXTRA_CATEGORY_KEY))
        && categoryKey == null) {
    Log.w(LOG_TAG, "Found " + resolved.activityInfo.name + " for intent "
            + intent + " missing metadata "
            + (metaData == null ? "" : EXTRA_CATEGORY_KEY));
    loge("Found " + resolved.activityInfo.name + " for intent "
            + intent + " missing metadata "
            + (metaData == null ? "" : EXTRA_CATEGORY_KEY));
    continue;
} else {
    categoryKey = metaData.getString(EXTRA_CATEGORY_KEY);
}
```

所以要增加 meta-data 才能显示在主页中

```xml
 <meta-data
    android:name="com.android.settings.category"
    android:value="com.android.settings.category.ia.homepage" />
```

通过Tile构造函数发现还有其它可选 meta-data 配置，

`com.android.settings.order` 对应Preference排序

`com.android.settings.icon` 对应Preference图标

`com.android.settings.summary` 对应Preference子标题

所以最终xml中配置为

```xml
<activity android:name=".activity.SettingPreferenceActivity">
    <intent-filter >
        <action android:name="com.android.settings.action.EXTRA_SETTINGS" />
    </intent-filter>
    <meta-data
               android:name="com.android.settings.category"
               android:value="com.android.settings.category.ia.homepage" />
    <meta-data
               android:name="com.android.settings.order"
               android:value="-150" />
    <meta-data
               android:name="com.android.settings.icon"
               android:resource="@mipmap/ic_icon" />
    <meta-data
               android:name="com.android.settings.summary"
               android:resource="@string/title_activity_settings" />
</activity>
```

嗯，数据加载搞清了，现在我们回到 DashboardFragment 中的 refreshDashboardTiles()

如果未遍历到key=com.android.settings.category.ia.homepage 对应 DashboardCategory 则直接 return，

无需刷新，比如当进入二级页面时，key将不再是com.android.settings.category.ia.homepage，若 category 中

tile集合为空也直接return，因为没有需要添加的条目。接下来就是遍历 tiles 通过 PreferenceScreen.addPreference

添加自定义条目了。