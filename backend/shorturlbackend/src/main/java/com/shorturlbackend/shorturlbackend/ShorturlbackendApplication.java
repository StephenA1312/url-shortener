package com.shorturlbackend.shorturlbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableCaching
public class ShorturlbackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShorturlbackendApplication.class, args);
	}

}
