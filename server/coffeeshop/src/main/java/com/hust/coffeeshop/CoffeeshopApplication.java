package com.hust.coffeeshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import java.io.File;
import java.util.Date;
@EnableDiscoveryClient
@SpringBootApplication
public class CoffeeshopApplication {

	public static void main(String[] args) {
		//tạo thư mục tại ổ D khi chạy lần đầu
		File file = new File("D:\\coffeShop-img");
		if (!file.exists()) {
			if (file.mkdir()) {
				System.out.println("Directory is created!");
			} else {
				System.out.println("Failed to create directory!");
			}
		}
		SpringApplication.run(CoffeeshopApplication.class, args);
	}
}