package com.hust.coffeeshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Date;

@SpringBootApplication
public class CoffeeshopApplication {

	public static void main(String[] args) {
		SpringApplication.run(CoffeeshopApplication.class, args);
		System.out.println((new Date()).getTime());
	}
}