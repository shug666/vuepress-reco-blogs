---
title: Java 读写文件
date: 2023-04-18
tags:
 - java
categories: 
 - java
sticky: 
   true
---

## 1、一次性读取整个文件内容

```java
/**
     * 一次性读取全部文件数据
     * @param strFile
     */
    public static void readFile(String strFile){
        try{
            InputStream is = new FileInputStream(strFile);
            int iAvail = is.available();
            byte[] bytes = new byte[iAvail];
            is.read(bytes);
            logger.info("文件内容:\n" + new String(bytes));
            is.close();
        }catch(Exception e){
            e.printStackTrace();
        }
    }
```

2、字符流按行读取文件
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

```java
/**
     * 按行读取文件
     * @param strFile
     */
    public static void readFileByLine(String strFile){
        try {
            File file = new File(strFile);
            BufferedReader bufferedReader = new BufferedReader(new FileReader(file));
            String strLine = null;
            int lineCount = 1;
            while(null != (strLine = bufferedReader.readLine())){
                logger.info("第[" + lineCount + "]行数据:[" + strLine + "]");
                lineCount++;
            }
        }catch(Exception e){
            e.printStackTrace();
        }
    }
```

3、字节流按行读取文件
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

```java
 /**
     * 按行读取全部文件数据
     *
     * @param strFile
     */
    public static StringBuffer readFile(String strFile) throws IOException {
        StringBuffer strSb = new StringBuffer();
        InputStreamReader inStrR = new InputStreamReader(new FileInputStream(strFile), "UTF-8");
        // character streams
        BufferedReader br = new BufferedReader(inStrR);
        String line = br.readLine();
        while (line != null) {
            strSb.append(line).append("\r\n");
            line = br.readLine();
        }
        return strSb;
    }
```

4、写文件
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

```java
  /**
     * 写入文件
     * @param fileName
     * @param s
     * @throws IOException
     */
    public static void writeToFile(String fileName,String s) throws IOException {
        File f1 = new File(fileName);
        OutputStream out = null;
        BufferedWriter bw = null;
        if (f1.exists()) {
            out = new FileOutputStream(f1);
            bw = new BufferedWriter(new OutputStreamWriter(out, "utf-8"));
            bw.write(s);
            bw.flush();
            bw.close();
        } else {
            System.out.println("文件不存在");
        }
    }
```

5、写文件，追加内容
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

```java
/**
     * 追加文件
     */
    public static void writeToFileAppend(String fileName, String text) {
        FileWriter fw = null;
        try {
            //如果文件存在，则追加内容；如果文件不存在，则创建文件
            File f = new File(fileName);
            fw = new FileWriter(f, true);
        } catch (IOException e) {
            e.printStackTrace();
        }
        PrintWriter pw = new PrintWriter(fw);
        pw.println(text);
        pw.flush();
        try {
            fw.flush();
            pw.close();
            fw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
```

6、读取子目录所有文件
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

```java
 /**
     * 读取所有子文件
     * @param dirPath
     * @param allFileList
     */
    public static void getAllFile(File dirPath, List<File> allFileList) {
        File[] fileList = dirPath.listFiles();
        assert fileList != null;
        for (File file : fileList) {
            if (file.isDirectory()) {
                getAllFile(file, allFileList);
            } else {
                allFileList.add(file);
            }
        }
    }
```

 

  

本文转自 [https://blog.csdn.net/qq\_39898191/article/details/104500896?ops\_request\_misc=&request\_id=&biz\_id=102&utm\_term=java%20%E8%AF%BB%E5%86%99%E6%96%87%E4%BB%B6&utm\_medium=distribute.pc\_search\_result.none-task-blog-2~all~sobaiduweb~default-0-104500896.nonecase&spm=1018.2226.3001.4187](https://blog.csdn.net/qq_39898191/article/details/104500896?ops_request_misc=&request_id=&biz_id=102&utm_term=java%20%E8%AF%BB%E5%86%99%E6%96%87%E4%BB%B6&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-0-104500896.nonecase&spm=1018.2226.3001.4187)，如有侵权，请联系删除。