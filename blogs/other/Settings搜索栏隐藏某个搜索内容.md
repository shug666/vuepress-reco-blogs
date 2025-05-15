---
title: Settings 搜索栏隐藏某个搜索内容
date: 2025-04-26
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 背景

        目的：根据项目需要，删除"Ethernet"和"Ethernet tethering"相关内容，即在Settings应用中的搜索框中，无法搜索到相应的内容。

过程
--

        首先，需要找到涉及"Ethernet tethering"的类，以及对应的布局文件：

```xml
res/xml/network_provider_settings.xml

    <Preference
        android:key="connected_ethernet_network"
        android:title="@string/ethernet"
        android:summary="@string/to_switch_networks_disconnect_ethernet"
        android:icon="@drawable/ic_settings_ethernet"/>
```

        根据network\_provider\_settings，去找加载这个布局的类：

NetworkProviderSettings.java

```java
    public static final SearchIndexProvider SEARCH_INDEX_DATA_PROVIDER =
            new SearchIndexProvider(R.xml.network_provider_settings);

    @VisibleForTesting
    static class SearchIndexProvider extends BaseSearchIndexProvider {

        private final WifiRestriction mWifiRestriction;

        SearchIndexProvider(int xmlRes) {
            super(xmlRes);
            mWifiRestriction = new WifiRestriction();
        }

        @VisibleForTesting
        SearchIndexProvider(int xmlRes, WifiRestriction wifiRestriction) {
            super(xmlRes);
            mWifiRestriction = wifiRestriction;
        }

        // 获取不可索引keys。在搜索中，如果在这里面keys.add了相应的参数，则在Search bar中无法搜索到
        @Override
        public List<String> getNonIndexableKeys(Context context) {
            final List<String> keys = super.getNonIndexableKeys(context);

            if (!mWifiRestriction.isChangeWifiStateAllowed(context)) {
                keys.add(PREF_KEY_WIFI_TOGGLE);
            }

            final WifiManager wifiManager = context.getSystemService(WifiManager.class);
            if (wifiManager == null) return keys;

            if (WifiSavedConfigUtils.getAllConfigsCount(context, wifiManager) == 0) {
                keys.add(PREF_KEY_SAVED_NETWORKS);
            }

            if (!DataUsageUtils.hasWifiRadio(context)) {
                keys.add(PREF_KEY_DATA_USAGE);
            }
            // 这里添加了"PREF_KEY_CONNECTED_ETHERNET_NETWORK"，目的是为了将"Ethernet"添加到不可搜索数组中。
            keys.add(PREF_KEY_CONNECTED_ETHERNET_NETWORK);
            return keys;
        }
    }
```

同理，找到可以找到all\_tether\_prefs.xml以及对应的类：AllInOneTetherSettings.java

```java
    public static final BaseSearchIndexProvider SEARCH_INDEX_DATA_PROVIDER =
            new BaseSearchIndexProvider(R.xml.all_tether_prefs) {

                @Override
                public List<String> getNonIndexableKeys(Context context) {
                    final List<String> keys = super.getNonIndexableKeys(context);

                    if (!TetherUtil.isTetherAvailable(context)) {
                        keys.add(KEY_WIFI_TETHER_NETWORK_NAME);
                        keys.add(KEY_WIFI_TETHER_NETWORK_PASSWORD);
                        keys.add(KEY_WIFI_TETHER_AUTO_OFF);
                        keys.add(KEY_WIFI_TETHER_NETWORK_AP_BAND);
                        keys.add(KEY_WIFI_TETHER_SECURITY);
                    }
                    // 将"Ethernet tethering"添加到不可索引数据中。
                    keys.add(ETHERNET_TETHER_KEY);
                    return keys;
                }

                @Override
                protected boolean isPageSearchEnabled(Context context) {
                    return FeatureFlagUtils.isEnabled(context, FeatureFlags.TETHER_ALL_IN_ONE);
                }

                @Override
                public List<AbstractPreferenceController> createPreferenceControllers(
                        Context context) {
                    return buildPreferenceControllers(context, null /*listener*/);
                }
            };
```

## 终极版

在`packages/apps/SettingsIntelligence/src/com/android/settings/intelligence/search/SearchResultAggregator.java`

```java
private List<? extends SearchResult> mergeSearchResults(
            Map<Integer, List<? extends SearchResult>> taskResults) {

        final List<SearchResult> searchResults = new ArrayList<>();
        // First add db results as a special case
        searchResults.addAll(taskResults.remove(DatabaseResultTask.QUERY_WORKER_ID));

        // Merge the rest into result list: add everything to heap then pop them out one by one.
        final PriorityQueue<SearchResult> heap = new PriorityQueue<>();
        for (List<? extends SearchResult> taskResult : taskResults.values()) {
            heap.addAll(taskResult);
        }
        while (!heap.isEmpty()) {
            searchResults.add(heap.poll());
        }

+
+        Iterator<SearchResult> searchResultIterator = searchResults.iterator();
+        while (searchResultIterator.hasNext()) {
+            String dataKey = searchResultIterator.next().dataKey;
+            if ("device_and_call_settings".equals(dataKey) ||
+                    "com.google.android.cellbroadcastreceiver".equals(dataKey)) {
+                Log.i(TAG, "searchResult: dataKey = " + dataKey);
+                searchResultIterator.remove();
+            }
+        }

        return searchResults;
    }
```

下面这种效率较低，但比较直接，实在不行，可考虑此种方法，一般建议上面这种方法

在`packages/apps/SettingsIntelligence/src/com/android/settings/intelligence/search/SearchResultsAdapter.java`

```java
-    public void postSearchResults(List<? extends SearchResult> newSearchResults,Context context) {
-        for (int i =0;i < newSearchResults.size();i++) {
-            if (newSearchResults.get(i).breadcrumbs.toString().trim()
-                    .contains(context.getString(R.string.applications_settings).trim())
-                    && newSearchResults.get(i).dataKey.equals("com.google.android.cellbroadcastreceiver")) {
-                newSearchResults.remove(i);
-            }
-        }
         final DiffUtil.DiffResult diffResult = DiffUtil.calculateDiff(
                 new SearchResultDiffCallback(mSearchResults, newSearchResults));
         mSearchResults.clear();
         mSearchResults.addAll(newSearchResults);
+        android.util.Log.i("ww","mSearchResults :"+mSearchResults.toString());
         diffResult.dispatchUpdatesTo(this);
         mFragment.onSearchResultsDisplayed(mSearchResults.size());
     }
```

结论：
---

        注意：make成功后，push或install后，此时只是将当前的修改生效，但是数据库中仍然保留了之前的搜索记录，因此需要删除对应的数据库。

```bash
$ adb shell
$ cd data/data/com.android.xxx.intelligence/
$ rm -rf databases
$ reboot
```

        删除后，重启生效。此时就不会再搜索到对应的内容了。        

注：此篇以记录处理问题时，忽略的小细节。不足之处请指出。



PS: xml中修改`settings:searchable="false"` 

 

本文转自 [https://blog.csdn.net/m0\_59266526/article/details/135848375](https://blog.csdn.net/m0_59266526/article/details/135848375)，如有侵权，请联系删除。