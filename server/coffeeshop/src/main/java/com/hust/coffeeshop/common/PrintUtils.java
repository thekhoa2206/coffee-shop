package com.hust.coffeeshop.common;

import freemarker.cache.StringTemplateLoader;
import freemarker.template.*;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.Set;

public class PrintUtils {
    public static String process(String printForm, Object model, HashMap<String, String> variableMaps)
        throws IOException, TemplateException {

    String freemarkerTemplateSource = getSourceTemplateFromPrintForm(printForm, variableMaps);

    Template template = getTemplate(freemarkerTemplateSource);

    HashMap<String, Object> models = new HashMap<String, Object>();
    models.put("model", model);

    Writer writer = new StringWriter();

    template.process(models, writer);

    String htmlResult = writer.toString();

    return htmlResult;
}

    private static String getSourceTemplateFromPrintForm(String printForm, HashMap<String, String> variableMaps) {
        Set<String> keys = variableMaps.keySet();
        for (String key : keys) {
            printForm = printForm.replace(key, variableMaps.get(key));
        }
        return printForm;
    }

    private static Template getTemplate(String freemarkerTemplateSource) throws IOException {

        StringTemplateLoader stringLoader = new StringTemplateLoader();
        stringLoader.putTemplate("template", freemarkerTemplateSource);

        Configuration configuration = config(stringLoader);

        Template template = configuration.getTemplate("template");
        return template;
    }

    private static Configuration config(StringTemplateLoader stringLoader) {
        Configuration configuration = new Configuration(Configuration.VERSION_2_3_23);
        configuration.setTemplateLoader(stringLoader);
        configuration.setObjectWrapper(new DefaultObjectWrapper(Configuration.VERSION_2_3_23));
        configuration.setTemplateExceptionHandler(TemplateExceptionHandler.IGNORE_HANDLER);
        return configuration;
    }

    public String removeHtmlComment(String htmlCode) {
        String freemarkerCode = htmlCode.replace("<!--", "<#--");
        return freemarkerCode;
    }

    public String removeFreemarkerComment(String freemarkerCode) {
        String htmlCode = freemarkerCode.replace("<#--", "<!--");
        return htmlCode;
    }


}
