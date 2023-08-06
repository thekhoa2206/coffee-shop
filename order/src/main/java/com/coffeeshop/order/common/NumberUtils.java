package com.coffeeshop.order.common;
import freemarker.template.utility.StringUtil;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.util.HashMap;
import java.util.Locale;

public class NumberUtils {
    public static final HashMap<String, String> DIGITS = new HashMap<String, String>() {
        private static final long serialVersionUID = 1L;

        {
            put("1", "một ");
            put("2", "hai ");
            put("3", "ba ");
            put("4", "bốn ");
            put("5", "năm ");
            put("6", "sáu ");
            put("7", "bảy ");
            put("8", "tám ");
            put("9", "chín ");
            put("0", "không ");
            put(",", "phẩy ");
        }
    };

    public static final HashMap<String, String> LANGUAGE_RULES = new HashMap<String, String>() {
        private static final long serialVersionUID = 1L;

        {
            put("không mươi", "lẻ ");
            put("mươi năm", "mươi lăm ");
        }
    };

    public static final String[] THOUSAND_LEVEL = new String[]{"", "nghìn ", "triệu ", "tỷ ", "nghìn tỷ ",
            "triệu tỷ ", "tỷ tỷ ", "nghìn tỷ tỷ ", "triệu tỷ tỷ ", "tỷ tỷ tỷ ", "to quá đọc không nổi"};

    public static final String[] UNIT_LEVEL = new String[]{"", "mươi ", "trăm "};

    private static final BigDecimal DEVIATION = BigDecimal.ONE;

    public static boolean isEqual(BigDecimal pNumber1, BigDecimal pNumber2) {
        if (pNumber1 == null) {
            if (pNumber2 == null)
                return true;
            return false;
        }

        if (pNumber2 == null)
            return false;
        return pNumber1.compareTo(pNumber2) == 0;
    }

    public static BigDecimal scale(BigDecimal number, int scale) {
        return number.setScale(scale, RoundingMode.HALF_UP);
    }

    public static String readNumber(BigDecimal number) {
        String readResult = "";
        String textNumber = getNumberInVietnameseFormat(number);
        HashMap<String, String> fractions = divideNumberFraction(textNumber);
        String naturalFraction = readNaturalFraction(fractions.get("natural"));
        readResult += naturalFraction;
        if (fractions.size() == 1)
            return readResult;

        readResult += fractions.get("delimiter");

        String decimalFraction = readDecimalFraction(fractions.get("decimal"));
        readResult += decimalFraction;

        readResult = reformatWithLanguageSyntax(readResult);
        return readResult;
    }

    private static String getNumberInVietnameseFormat(BigDecimal number) {
        BigDecimal roundedNumber = number.setScale(2, RoundingMode.HALF_UP);
        Locale locale = new Locale("vi");
        NumberFormat formatter = NumberFormat.getCurrencyInstance(locale);
        String formatResult = formatter.format(roundedNumber);
        formatResult = formatResult.substring(0, formatResult.length() - 2);
        return formatResult;
    }
    public static String getNumberEnFormat(BigDecimal number) {
        boolean isNegative;

        if (number == null || number.equals(BigDecimal.ZERO)) {
            return "0";
        }
        if (number.compareTo(BigDecimal.ZERO) < 0) {
            isNegative = true;
            number = number.abs();
        } else isNegative = false;

        BigDecimal roundedNumber = number.setScale(3, RoundingMode.HALF_UP);
        Locale locale = new Locale("en");
        NumberFormat formatter = NumberFormat.getCurrencyInstance(locale);
        formatter.setMaximumFractionDigits(3);
        formatter.setMinimumFractionDigits(0);
        String formatResult = formatter.format(roundedNumber);
        formatResult = formatResult.substring(1);
        //to avoid special symbol, add minus sign if number is negative
        if (isNegative) formatResult = "-".concat(formatResult);
        return formatResult;
    }

    private static HashMap<String, String> divideNumberFraction(String number) {
        HashMap<String, String> fractions = new HashMap<String, String>();
        String[] parts = StringUtil.split(number, ',');
        fractions.put("natural", parts[0]);
        if (parts.length == 1)
            return fractions;

        fractions.put("decimal", parts[1]);
        fractions.put("delimiter", "phẩy ");
        return fractions;
    }

    private static String readNaturalFraction(String naturalFraction) {
        String sound = "";
        String[] divisions = StringUtil.split(naturalFraction, '.');
        for (int i = 0; i < divisions.length; i++) {
            String division = divisions[i].trim();
            String divisionSound = readSetOfThreeDigit(division);
            if (divisionSound.trim().equals("không trăm không mươi không"))
                continue;
            String largeLevel = THOUSAND_LEVEL[divisions.length - 1 - i];
            String levelDivisionSound = divisionSound + largeLevel;
            sound += levelDivisionSound;
        }
        return sound;
    }

    private static String readDecimalFraction(String decimalFraction) {
        String sound = "";
        for (int i = 0; i < decimalFraction.length(); i++) {
            sound += DIGITS.get(decimalFraction.substring(i, i + 1));
        }
        return sound;
    }

    private static String reformatWithLanguageSyntax(String numberText) {
        String readResult = numberText.replace("không mươi", "linh");
        readResult = readResult.replace("linh không", "");
        readResult = readResult.replace("một mươi", "mười");
        readResult = readResult.replace("mười không", "mười");
        readResult = readResult.replace("mươi không", "mươi");
        readResult = readResult.replace("mươi một", "mươi mốt");
        readResult = readResult.replace("mươi năm", "mươi lăm");

        while (readResult.trim().endsWith("không"))
            readResult = readResult.substring(0, readResult.length() - 6).trim();

        if (readResult.trim().endsWith("phẩy"))
            readResult = readResult.substring(0, readResult.length() - 5).trim();

        StringBuilder builder = new StringBuilder(readResult);
        String firstChar = builder.substring(0, 1).toUpperCase();
        builder.replace(0, 1, firstChar);

        return builder.toString();
    }

    private static String readSetOfThreeDigit(String input) {
        String result = "";
        int length = input.length();
        for (int i = 0; i <= length - 1; i++) {
            result += DIGITS.get(input.substring(i, i + 1));
            String level = UNIT_LEVEL[length - 1 - i];
            result += level;
        }
        return result;
    }

    public static String convertCurrencyNumberToText(BigDecimal number, String delimiter, String separator) {
        String vietnameseText = getNumberInVietnameseFormat(number);

        String formattedText = vietnameseText.replace(".", delimiter);
        formattedText = formattedText.replace(",", separator);

        return formattedText;
    }

    public static int compareToWithDeviation(BigDecimal num1, BigDecimal num2) {
        assert num1 != null && num2 != null;
        if (num1.subtract(num2).abs().compareTo(DEVIATION) <= 0) {
            return 0;
        }
        return num1.compareTo(num2);
    }

}
