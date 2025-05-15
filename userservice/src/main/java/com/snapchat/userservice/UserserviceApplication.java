package com.snapchat.userservice;

import com.snapchat.userservice.security.dto.RegisterRequest;
import com.snapchat.userservice.user.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

@SpringBootApplication
public class UserserviceApplication {

	@Bean
	@Profile("!test")
	public CommandLineRunner createDefaultUsers(UserService userService) {
		return args -> {

			//create admin
			if (userService.getOneUserByEmail("hamza@hamza.com") == null) {
				userService.createUser(new User("Hamza","hamza@hamza.com", "UserPass123!"));
				System.out.println("Hamza added.");
			}

			//create user
			if (userService.getOneUserByEmail("saad@saad.com") == null) {
				userService.createUser(new RegisterRequest("Saad", "saad@saad.com", "UserPass123!"));
				System.out.println("Saad added.");
			}


		};
	}

	public static void main(String[] args) {
		SpringApplication.run(UserserviceApplication.class, args);
	}

}
