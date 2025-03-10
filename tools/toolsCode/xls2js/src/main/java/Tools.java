import jxl.Cell;
import jxl.CellType;
import org.apache.commons.io.FileUtils;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.io.File;
import java.io.IOException;

public class Tools {
    public static void write(File file, String data) {

        try {
            FileUtils.write(file, data, "UTF-8");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    public static String jsonToLua(String json) {
        return  jsonToLua(json,"");
    }
    public static String jsonToLua(String json,String add) {
        String out;
        out = json.replaceAll("\\[", "{");
        out = out.replaceAll("\\]", "}");
        out = out.replaceAll("\\\\\\\\", "\\\\");
        out = out.replaceAll("\\\\/", "/");
        out = out.replaceAll("\"true\"", "true");
        out = out.replaceAll("\"false\"", "false");
        out = out.replaceAll("\"([_a-zA-Z0-9.-]+)\"\\s*:\\s*", "[\"$1\"]=");
        out = out.replaceAll("☯", "\"");
        out = out.replaceAll("\\n*\\s*\\\"\\s*(-?[0-9]+(\\.[0-9]+)?)\\s*\\\"\\s*\\n*", "$1");
        out = "local root=\n" + out + add + "\nreturn root";
        return unicodeToString(out);
    }

    public static boolean checkEmpty(Cell cell) {
        return cell.getType() == CellType.EMPTY || cell.getContents().equals("") || cell.getContents().equals(" ");
    }
    public static String unicodeToString(String str) {
        Pattern pattern = Pattern.compile("(\\\\u(\\p{XDigit}{4}))");
        Matcher matcher = pattern.matcher(str);
        char ch;
        while (matcher.find()) {
            String group = matcher.group(2);
            ch = (char) Integer.parseInt(group, 16);
            String group1 = matcher.group(1);
            str = str.replace(group1, ch + "");
        }
        return str;
    }
}

