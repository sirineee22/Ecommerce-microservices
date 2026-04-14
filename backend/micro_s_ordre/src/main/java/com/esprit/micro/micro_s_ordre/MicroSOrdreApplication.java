package com.esprit.micro.micro_s_ordre;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MicroSOrdreApplication {

	public static void main(String[] args) {
		SpringApplication.run(MicroSOrdreApplication.class, args);
	}

}
