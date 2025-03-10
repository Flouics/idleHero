
import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.sun.javafx.application.ParametersImpl;

import javafx.application.Application;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.concurrent.Task;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.control.ProgressIndicator;
import javafx.stage.Stage;


public class App extends Application {
    Task<?> copyWorker;
    Map<String, JSONObject> pool = new HashMap<String, JSONObject>();
    String confUrl, workUrl;
    Stage pStage;
    ArrayList<String> m_scPool = new ArrayList<String>();
    ArrayList<String> m_csPool = new ArrayList<String>();
    JSONObject confJson;
    @Override
    public void start(Stage primaryStage) throws Exception {
    	try {
    		Parent root = FXMLLoader.load(getClass().getResource("sample.fxml"));
 	    	primaryStage.setTitle("协议解析");
	        primaryStage.setScene(new Scene(root, 300, 300));
	        primaryStage.show();
	        pStage = primaryStage;
	        final Label label = (Label)root.lookup("#label");
	        ProgressIndicator progressBar = (ProgressIndicator)root.lookup("#probar");
	        progressBar.setProgress(0);
	
	        confUrl = ParametersImpl.getParameters(this).getRaw().get(0);
	        workUrl = ParametersImpl.getParameters(this).getRaw().get(1);
	        copyWorker = createWorker();
	        progressBar.progressProperty().unbind();
	        progressBar.progressProperty().bind(copyWorker.progressProperty());
	        copyWorker.messageProperty().addListener(new ChangeListener<String>() {
	            public void changed(ObservableValue<? extends String> observable, String oldValue,
	                                String newValue) {
	                label.setText(newValue);
	                if (newValue.equals("close")) {
	                    pStage.close();
	                }
	            }
	        });
	        new Thread(copyWorker).start();
	   	}catch(Exception e) {
	   		e.printStackTrace();
	    }
    }

    public Task<?> createWorker() {
        return new Task<Object>() {
            @Override
            protected Object call() throws Exception {
                try {
                    File confFile = new File(confUrl);
                    String confString = FileUtils.readFileToString(confFile, "UTF-8");
                    confJson = new JSONObject(confString);
                    //-------------------------------------tolua----------------------------------------
                    File inFile = new File(workUrl + confJson.getString("proto"));
                    File jsFile = new File(workUrl + confJson.getString("js"));
                    String pname = confJson.getString("name");
                    String zdName = confJson.getString("zd");
                    String content = FileUtils.readFileToString(inFile, "UTF-8");
                    StringBuilder out=new StringBuilder();
                    JSONArray json = new JSONArray(content);
                    out.append("local zd=require(\""+zdName+"\")");
                    out.append("\n");
                    out.append("----------------------------------------------------------------------\n");
                    out.append("\n");
                    out.append("local " + pname + "={}\n");
                    out.append("local  maker = {}\n");
                    double maxPro = json.length() + 2 +1;
                    double workDone = 0.0;
                    updateMessage("处理数据中...");
                    for (int i = 0; i < json.length(); i++) {
                        pool.put(json.getJSONObject(i).getString("n"), json.getJSONObject(i));
                        workDone+=1;
                        updateProgress(workDone, maxPro);
                    }
                    out.append("\n");
  

                    //20220831 新版解析，减少脏数据，增加创建请求接口传递参数功能,减少初始化前端请求时初始无效的协议
                    out.append(addSCProto("SC"));
                    updateProgress(++workDone, maxPro);

                    out.append(addCSProto("CS"));
                    updateProgress(++workDone, maxPro);

                    out.append(pname + ".sc={}\n");
                    out.append(pname + ".sc.new=function ()\n\treturn maker.SCT_SC()\nend\n");
                    out.append(pname + ".cs={}\n");
                    //out.append(pname + ".cs.new=function ()\n\treturn maker.CST_CS()\nend\n");
                    out.append(pname + ".cs.proxy=maker.CST_CS()\n");
                    out.append(pname + ".cs.new=function ()\n"
                            + "\tlocal obj ={}\n"
                            + "\tzd.makeLiteTable(obj,king.cs.proxy)\n"
                            + "\treturn obj\n"
                            + "end\n");
                    out.append(pname + ".metaType=zd.metaType\n");
	                out.append(pname + ".TYPE=zd.TYPE\n");
                    out.append("return " + pname + "\n");
                    updateMessage("写入文件中...");
                    FileUtils.write(jsFile, out, "UTF-8");
                    //-------------------------------------tolua----------------------------------------
                    
                    //-------------------------------------tohtml----------------------------------------
                    File htmlFile = new File(workUrl + confJson.getString("html"));
                    StringBuilder htmlOut=new StringBuilder();
                    htmlOut.append("<!DOCTYPE html><html><head><meta charset=\"utf-8\">");
                    htmlOut.append("<title>" + confJson.getString("title") + "</title>");
                    htmlOut.append("<link rel=\"stylesheet\" href=\"tools/webAssets/bootstrap.min.css\">");
                    htmlOut.append("<script src=\"tools/webAssets/jquery.js\"></script>");
                    htmlOut.append("<script src=\"tools/webAssets/bootstrap.min.js\"></script>");
                    htmlOut.append("</head><body>");
                    htmlOut.append("<ul id=\"myTab\" class=\"nav nav-tabs\">");
                    htmlOut.append("<li class=\"active\"><a href=\"#home\" data-toggle=\"tab\">服务器到客户端</a></li>");
                    htmlOut.append("<li><a href=\"#ios\" data-toggle=\"tab\">客户端到服务器</a></li>");
                    htmlOut.append(" </ul>");
                    htmlOut.append("<div id=\"myTabContent\" class=\"tab-content\">");
                    htmlOut.append("<div class=\"tab-pane fade in active\" id=\"home\">");
                    htmlOut.append("<div class=\"panel-group\" id=\"accordion\">");
                    htmlOut.append(addPart("SC"));
                    htmlOut.append("</div>");
                    htmlOut.append("</div>");
                    htmlOut.append("<div class=\"tab-pane fade\" id=\"ios\">");
                    htmlOut.append(addPart("CS"));
                    htmlOut.append("</div></div>");
                    htmlOut.append(" </body></html>");
                    FileUtils.write(htmlFile, htmlOut, "UTF-8");
                    updateProgress(++workDone, maxPro);
                    System.out.println(htmlFile);
                    updateMessage("处理完成 3秒后自动关闭...");
                    Thread.sleep(3000);
                    updateMessage("close");
                    return true;
                }catch (Exception e){
                    System.out.println(e);
                    updateMessage(e.toString());
                    Thread.sleep(3000);
                    updateMessage("close");
                    return false;
                }
            }
        };
    }

    private String addSCProto(String val) {
        if (!pool.containsKey(val))
            return val;
        if (m_scPool.contains(val))
            return "";
        m_scPool.add(val);
        StringBuilder sb = new StringBuilder(1024);
        JSONObject kind = pool.get(val);
        String name = kind.getString("n");
        if (kind.has("e")) {
            JSONArray eProperty = kind.getJSONArray("e");
            ArrayList<String> eList = new ArrayList<String>();
            for (int j = 0; j < eProperty.length(); j++) {
                eList.add("\"" + eProperty.getJSONArray(j).getString(0) + "\"");
            }
            sb.append("maker.SCT_" + name + "=zd.Enum:new(\"" + confJson.getString("name") + "." + name + "\"," + String.join(",", eList) + ")\n");
        } else {
            sb.append("maker.SCT_" + name + "=function()\n");
            sb.append("\tlocal obj={}\n");
            sb.append("\tzd.makeDataTable(obj)\n");
            if (kind.has("p")) {
                JSONObject property = kind.getJSONObject("p");
                for (Object jp : property.keySet()) {
                    String subKey = (String) jp;
                    JSONArray subArray = property.getJSONArray(subKey);
                    Object subVal = subArray.get(0);
                    sb.append("\tzd.initSet(obj,\"" + subKey + "\"," + checkVal(subVal) + ")\n");
                }
            }
            sb.append("\treturn obj\n");
            sb.append("end\n");

            //子级解析
            if (kind.has("p")) {
                JSONObject property = kind.getJSONObject("p");
                for (Object jp : property.keySet()) {
                    String subKey = (String) jp;
                    JSONArray subArray = property.getJSONArray(subKey);
                    Object subVal = subArray.get(0);
                    String temp = checkSCVal(subVal);
                    if (!temp.equals(""))
                        sb.append(temp);
                }
            }
        }
        return sb.toString();
    }

    private String addCSProto(String val) {
        if (!pool.containsKey(val))
            return val;
        if (m_csPool.contains(val))
            return "";
        m_csPool.add(val);
        StringBuilder sb = new StringBuilder(1024);
        JSONObject kind = pool.get(val);
        String name = kind.getString("n");
        if (kind.has("e")) {
            sb.append("maker.CST_" + name + "=maker.SCT_" + name + "\n");
        } else if (kind.has("p")) {
            JSONObject property = kind.getJSONObject("p");
            sb.append("maker.CST_" + name + "=function()\n");
            sb.append("\tlocal obj={}\n");
            sb.append("\tzd.makeLiteTable(obj)\n");
            for (Object jp : property.keySet()) {
                String subKey = (String) jp;
                JSONArray subArray = property.getJSONArray(subKey);
                Object subVal = subArray.get(0);
                String subValue = checkLiteVal(subVal);
                sb.append("\tzd.initLiteSet(obj,\"" + subKey + "\"," + subValue + ")\n");
            }
            sb.append("\treturn obj\n");
            sb.append("end\n");

            //子级解析
            for (Object jp : property.keySet()) {
                String subKey = (String) jp;
                JSONArray subArray = property.getJSONArray(subKey);
                Object subVal = subArray.get(0);
                String temp = checkCSVal(subVal);
                if (!temp.equals(""))
                    sb.append(temp);
            }
        }
        return sb.toString();
    }
    private String checkSCVal(Object subVal) {
        if (subVal instanceof String) {
            String subString = subVal.toString();
            if (pool.containsKey(subString))
                return addSCProto(subString);
        } else if (subVal instanceof JSONArray) {
            JSONArray subArray = (JSONArray) subVal;
            Object subVal2 = subArray.get(0);
            return checkSCVal(subVal2);
        }
        return "";
    }
    private String checkCSVal(Object subVal) {
        if (subVal instanceof String) {
            String subString = subVal.toString();
            if (pool.containsKey(subString))
                return addCSProto(subString);
        } else if (subVal instanceof JSONArray) {
            JSONArray subArray = (JSONArray) subVal;
            Object subVal2 = subArray.get(0);
            return checkSCVal(subVal2);
        }
        return "";
    }
    private String addPart(String val) {
        StringBuilder htmlOut=new StringBuilder();
        JSONObject scJson = pool.get(val).getJSONObject("p");
        for (Object htmlitem : scJson.keySet()) {
            String htmlItemName = (String) htmlitem;
            JSONArray scmsArray = scJson.getJSONArray(htmlItemName);
            Object subName = scmsArray.get(0);
            if (!pool.containsKey(subName)) {
                System.out.print("找不到模块 " + subName);
            }
            Object aString;
            if (scmsArray.isNull(1)) {
                aString = pool.get(subName).getString("a");
            } else {
                aString = scmsArray.getString(1);
            }
            String idName = val + "_" + htmlItemName;
            htmlOut.append("<div class=\"panel panel-default\">");
            htmlOut.append("<div class=\"panel-heading\">");
            htmlOut.append("<h4 class=\"panel-title\">");
            htmlOut.append("<a data-toggle=\"collapse\" data-parent=\"#accordion\"href=\"#" + idName + "\">");
            htmlOut.append(aString + "(" + htmlItemName + ")");
            htmlOut.append("</a></h4></div>");
            htmlOut.append("<div id=\"" + idName + "\" class=\"panel-collapse collapse\">");
            htmlOut.append("<div class=\"panel-body\">");
            htmlOut.append("<div class=\"panel-group\" id=\"" + idName + "Accordion\">");
            if (pool.get(subName).has("p")) {
                JSONObject subJson = pool.get(subName).getJSONObject("p");
                for (Object subHtmlitem : subJson.keySet()) {
                    String subHtmlItemName = (String) subHtmlitem;
                    JSONArray subScmsArray = subJson.getJSONArray(subHtmlItemName);
                    Object subHSubName = subScmsArray.get(0);
                    String subAString;
                    if (subScmsArray.isNull(1)) {
                        subAString = pool.get(subHSubName).getString("a");
                    } else {
                        subAString = subScmsArray.getString(1);
                    }
                    String subIdName = idName + "_" + subHtmlItemName;
                    htmlOut.append("<div class=\"panel panel-default\">");
                    htmlOut.append("<div class=\"panel-heading\">");
                    htmlOut.append("<h4 class=\"panel-title\">");
                    htmlOut.append("<a data-toggle=\"collapse\" data-parent=\"#" + idName + "Accordion\"href=\"#" + subIdName + "\">");
                    htmlOut.append(subAString + "(" + subHtmlItemName + ")");
                    htmlOut.append("</a></h4></div>");
                    htmlOut.append("<div id=\"" + subIdName + "\" class=\"panel-collapse collapse\">");
                    htmlOut.append("<div class=\"panel-body\">");
                    htmlOut.append("<table class=\"table table-striped\">");
                    htmlOut.append("<thead><tr><th>名称</th><th>路径</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>");
                    htmlOut.append("<tbody>");
                    htmlOut.append(getItem("", htmlItemName + "." + subHtmlItemName, subHSubName, subAString));
                    htmlOut.append("</tbody>");
                    htmlOut.append("</table>");
                    htmlOut.append("</div></div></div>");
                }
                htmlOut.append("</div>");
                htmlOut.append("</div></div></div>");
            } else {
                System.out.print(subName);
            }
        }
        return htmlOut.toString();
    }

    private String getItem(String key, String path, Object itemName, String sm) {
        StringBuilder out=new StringBuilder();
        if (itemName instanceof Integer) {
            out.append(getTR(key, path, "数字",itemName.toString(), sm));
        } else if (itemName instanceof String) {

            String itemString = (String) itemName;
            if (pool.containsKey(itemString)) {
                JSONObject itemJson = pool.get(itemString);
                if (itemJson.has("e")) {
                    JSONArray eItemJson = itemJson.getJSONArray("e");
                    ArrayList<String> ePath=new ArrayList<String>();
                    ArrayList<String> eSM=new ArrayList<String>();
                    for (int i = 0; i < eItemJson.length() ; i++) {
                        JSONArray subEItemJson=eItemJson.getJSONArray(i);
                        ePath.add(i+"="+subEItemJson.getString(0));
                        eSM.add(subEItemJson.getString(1));
                    }

                    out.append(getTR(key, path+" ("+String.join(",", ePath) +")", "枚举",itemName.toString(), sm+" ("+String.join(",", eSM) +")"));
                } else {
                    JSONObject subItemJson = itemJson.getJSONObject("p");
                    for (Object subItemName : subItemJson.keySet()) {
                        String subItemString = (String) subItemName;
                        JSONArray subItemArray = subItemJson.getJSONArray(subItemString);
                        Object val = subItemArray.get(0);
                        String subAString = "";
                        if (subItemArray.isNull(1)) {
//                    // 可能报错
                        } else {
                            subAString = subItemArray.getString(1);
                        }
                        out.append(getItem(subItemString, path + "." + subItemString, val, sm + "-" + subAString));
                    }
                }
            } else {
                out.append(getTR(key, path, "字符串","\""+itemName.toString()+"\"", sm));
            }
        } else if (itemName instanceof JSONArray) {
            JSONArray itemNameArray = (JSONArray) itemName;
            out.append(getItem("", path + "[]", itemNameArray.get(0), sm));
        }
        return out.toString();
    }

    private String getTR(String key, String path, String type, String defaultValue, String sm) {
        StringBuilder out=new StringBuilder();
        out.append("<tr>");
        out.append("<td>" + key + "</td>");
        out.append("<td>" + path + "</td>");
        out.append("<td>" + type + "</td>");
        out.append("<td>" + defaultValue + "</td>");
        out.append("<td>" + sm + "</td>");
        out.append("</tr>");
        return out.toString();
    }

    private String checkVal(Object subVal) {
        StringBuilder out=new StringBuilder();
        if (subVal instanceof Integer) {
            out.append(subVal);
        } else if (subVal instanceof String) {
            String subString = (String) subVal;
            if (pool.containsKey(subString)) {
                if (pool.get(subString).has("e")){
                    out.append("maker.SCT_" + subVal + "[1]");
                }else{
                    out.append("maker.SCT_" + subVal + "()");
                }

            } else {
                out.append("\"" + subVal + "\"");
            }
        } else if (subVal instanceof JSONArray) {
            JSONArray subArray = (JSONArray) subVal;
            StringBuilder arrOut=new StringBuilder();
            for (int i = 1; i < subArray.length(); i++) {
                arrOut.append(",\"" + subArray.get(i) + "\"");
            }
            out.append("zd.makeDataArray(" + checkVal(subArray.get(0)) + arrOut + ")");
        }
        return out.toString();
    }

    private String checkLiteVal(Object subVal) {
        StringBuilder out=new StringBuilder();
        if (subVal instanceof Integer) {
            out.append(subVal);
        } else if (subVal instanceof String) {
            String subString = (String) subVal;
            if (pool.containsKey(subString)) {
                if (pool.get(subString).has("e")){
                    out.append("maker.CST_" + subVal + "[1]");
                }else{
                    out.append("maker.CST_" + subVal + "()");
                }
            } else {
                out.append("\"" + subVal + "\"");
            }
        } else if (subVal instanceof JSONArray) {
            JSONArray subArray = (JSONArray) subVal;
            out.append("zd.makeLiteArray(" + checkVal(subArray.get(0)) + ")");
        }
        return out.toString();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
