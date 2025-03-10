import jxl.*;
import jxl.read.biff.BiffException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Storm,Earth,Fire-------->");
        String filePath = args[0];
        File inFile = new File(filePath);
        String workPath= args[1];
        Map<String, File> outFileMap = new HashMap<String, File>();
        Map<String, JSONObject> outJsonMap = new HashMap<String, JSONObject>();
        String fileKeyName = "";
        JSONObject fileKey = new JSONObject(true);
        try {
            WorkbookSettings workbookSettings = new WorkbookSettings();
            workbookSettings.setEncoding("UTF8");
            Workbook book = Workbook.getWorkbook(inFile, workbookSettings);
            Sheet sheet = book.getSheet(0);
            for (int i = 1; i < sheet.getRows(); i++) {
                if(sheet.getCell(0, i).getContents().trim().equals("")){
                    break;
                }
                String srcName = workPath+sheet.getCell(0, i).getContents();
                String sheetName = sheet.getCell(1, i).getContents();
                String outName = sheet.getCell(2, i).getContents();
                String outPath =  workPath+sheet.getCell(3, i).getContents();
                String time = sheet.getCell(4, i).getContents();
                int x = Integer.parseInt(sheet.getCell(5, i).getContents());
                int y = Integer.parseInt(sheet.getCell(6, i).getContents());
                fileKey.put(outName, outPath.substring(outPath.lastIndexOf("/") + 1, outPath.lastIndexOf(".")));
                if (fileKeyName == "") {
                    fileKeyName = outPath.substring(0, outPath.lastIndexOf("/") + 1) + "fileKey.json";
                }
                if (outJsonMap.get(outPath) == null) {
                    outJsonMap.put(outPath, new JSONObject());
                    outFileMap.put(outPath, new File(outPath));
                }
                JSONObject outJson = outJsonMap.get(outPath);
                JSONArray sheetJson = new JSONArray();
                JSONObject indexJson = new JSONObject();
                outJson.put(outName, sheetJson);
                //outJson.put(outName + "_index", indexJson);
                Sheet srcSheet = getSheet(srcName, sheetName);
                if (time.equals("0")) {
                    break;
                }
                if (srcSheet == null) {
                    System.out.println("找不到该表" + srcName + " " + sheetName);
                    break;
                }
                int steSheetCols = srcSheet.getColumns();
                for (int j = y; j < srcSheet.getRows(); j++) {
                    if (!Tools.checkEmpty(srcSheet.getCell(0, j))) {
                        JSONObject itemJson = new JSONObject();
                        sheetJson.put(itemJson);
                        itemJson.put("_id", sheetJson.length() - 1);
                        for (int k = 7; k < sheet.getRow(i).length; k++) {
                            Cell cell = sheet.getCell(k, i);
                            if (!Tools.checkEmpty(cell)) {
                                if (steSheetCols > k - 7 + x){ //当前列数大于总列数 会取不到数据getCell会报错
                                    Cell srcCell = srcSheet.getCell(k - 7 + x, j);
                                    if (!Tools.checkEmpty(srcCell)) {
                                        String key;
                                        if (cell.getContents().substring(0, 1).equals("*")) {
                                            key = cell.getContents().substring(1);
                                           //indexJson.put(key + "_" + srcCell.getContents(), sheetJson.length() - 1);
                                        } else {
                                            key = cell.getContents();
                                        }
                                        String[] keyTypes = key.split("\\.",2);
                                        if (keyTypes.length>1 && keyTypes[1].equals("big")){
                                            key = keyTypes[0];
                                            itemJson.put(key, "☯" + srcCell.getContents() + "☯");
                                        }else if (keyTypes.length>1 && keyTypes[1].equals("str")){
                                            key = keyTypes[0];
                                            if (isNumeric(srcCell.getContents())) {
                                                itemJson.put(key, "☯" + srcCell.getContents() + "☯");
                                            }else{
                                                itemJson.put(key, srcCell.getContents());
                                            }
                                        }else if (srcCell.getType() == CellType.BOOLEAN) {
                                            BooleanCell booleanCell = (BooleanCell) srcCell;
                                            itemJson.put(key, booleanCell.getValue());
                                        } else if (srcCell.getType() == CellType.NUMBER) {
                                            NumberCell numberCell = (NumberCell) srcCell;
                                            itemJson.put(key, numberCell.getValue());
                                        } else {
                                            String jsOut=srcCell.getContents();
                                            try{
                                                JSONObject jsObject =new JSONObject(jsOut);
                                                itemJson.put(key, jsObject);
                                            }catch (JSONException e){
                                                try{

                                                    JSONArray jsArray =new JSONArray(jsOut);
                                                    itemJson.put(key, jsArray);
                                                }catch (JSONException ea){
                                                    itemJson.put(key, jsOut);
                                                }
                                            }
                                        }
                                    }
                                }else{
                                    System.out.println("error cell pos ("+excelColIndexToStr(k-7+x)+", " + (j+1) +") in excel "+ srcName + " " + srcSheet.getName());
                                }
                            }
                        }
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        } catch (BiffException e) {
            e.printStackTrace();
        }
        Tools.write(new File(fileKeyName), fileKey.toString(4));
        for (Map.Entry<String, File> entry : outFileMap.entrySet()) {
            if (entry.getValue().getPath().indexOf(".json") != -1) {
                String writeString = outJsonMap.get(entry.getKey()).toString(4);
                Tools.write(entry.getValue(), writeString.replaceAll("\\n*\\s*\\\"\\s*(\\-*[\\d]+)\\s*\\\"\\s*\\n*", "$1"));
            }
        }
        System.out.println("----->HEAD MY CALL DONE");
    }

    public static Sheet getSheet(String fileName, String sheetName) {
        Workbook book = null;
        try {
            WorkbookSettings workbookSettings = new WorkbookSettings();
            workbookSettings.setEncoding("UTF8");
            File file = new File(fileName.trim());
            if (!file.exists()) {
                return null;
            }
            book = Workbook.getWorkbook(file,workbookSettings);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (BiffException e) {
            e.printStackTrace();
        }
        assert book != null;
        Sheet outSheet;
        try {
            int sheetNameInt=Integer.parseInt(sheetName.trim());
            outSheet=book.getSheet(sheetNameInt);
        }catch (NumberFormatException error){
            outSheet=book.getSheet(sheetName);
        }
        return outSheet;
    }
    public static String excelColIndexToStr(int columnIndex) {
        if (columnIndex <= 0) {
            return null;
        }
        String columnStr = "";
        do {
            if (columnStr.length() > 0) {
                columnIndex--;
            }
            columnStr = ((char) (columnIndex % 26 + (int) 'A')) + columnStr;
            columnIndex = (columnIndex - columnIndex % 26) / 26;
        } while (columnIndex > 0);
        return columnStr;
    }
    public static boolean isNumeric(String str) {
        try {
            new BigDecimal(str.trim()).toString();
        } catch (Exception e) {
            return false;
        }
        return true;
    }
}
