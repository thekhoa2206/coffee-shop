package com.hust.coffeeshop.common;

import lombok.val;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.*;

public class CommonCode
{
    private static final List<DateTimeFormatter> DATE_FORMATS = Arrays.asList(
            DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss'Z'"), DateTimeFormat.forPattern("yyyy-MM-dd  HH:mm:ss"),
            DateTimeFormat.forPattern("yyyy-MM-dd HH:mm"), DateTimeFormat.forPattern("yyyy-MM-dd"),
            DateTimeFormat.forPattern("yyyyMMdd"), DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss.SSS"),
            DateTimeFormat.forPattern("dd-MM-yyy"));

    public  static String GenerateCodeRole(){
        String code = "R";
        Random rand = new Random();
        int ranNum = rand.nextInt((99999 - 10000) + 1) + 10000;
        code = code + String.valueOf(ranNum);
        return code;
    }
    public  static String GenerateCodeWarehouse(){
        String code = "NK";
        Random rand = new Random();
        int ranNum = rand.nextInt((99999 - 10000) + 1) + 10000;
        code = code + String.valueOf(ranNum);
        return code;
    }
    public  static String GenerateCodeexport(){
        String code = "XK";
        Random rand = new Random();
        int ranNum = rand.nextInt((99999 - 10000) + 1) + 10000;
        code = code + String.valueOf(ranNum);
        return code;
    }
    public static long getTimestamp() {
        ZonedDateTime now = ZonedDateTime.now(ZoneOffset.UTC);
        return Date.from(now.toInstant()).getTime() ;
    }
    public  static String GeneratePassword(String password) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        password = encoder.encode(password);
        return password;
    }
    public static long getMilliSeconds( String myDate, String pattern) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat(pattern == null ? "yyyy/MM/dd HH:mm:ss": pattern);
        Date date = sdf.parse(myDate);
        long millis = date.getTime();
        return millis;
    }

    public static String getStringDate(Date myDate, String pattern) throws ParseException {

        SimpleDateFormat sdf = new SimpleDateFormat(pattern == null ? "yyyy/MM/dd HH:mm:ss": pattern);
        String date = sdf.format(myDate);
        return date;
    }

}
