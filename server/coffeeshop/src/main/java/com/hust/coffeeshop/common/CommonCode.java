package com.hust.coffeeshop.common;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Random;

public class CommonCode {
    public  static String GenerateCodeRole(){
        String code = "R";
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
}
