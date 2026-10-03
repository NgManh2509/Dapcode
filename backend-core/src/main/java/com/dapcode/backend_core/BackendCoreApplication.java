package com.dapcode.backend_core;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendCoreApplication {

	public static void main(String[] args) {
		loadDotenv();
		SpringApplication.run(BackendCoreApplication.class, args);
	}

	private static void loadDotenv() {
		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
		if (dotenv.get("GOOGLE_CLIENT_ID") == null) {
			dotenv = Dotenv.configure().directory("backend-core").ignoreIfMissing().load();
		}
		dotenv.entries().forEach(entry -> {
			if (System.getProperty(entry.getKey()) == null) {
				System.setProperty(entry.getKey(), entry.getValue());
			}
		});
		String googleId = System.getProperty("GOOGLE_CLIENT_ID");
		if (googleId != null && !googleId.isBlank()) {
			System.out.println("[Dotenv] Loaded GOOGLE_CLIENT_ID: " + googleId.substring(0, Math.min(12, googleId.length())) + "...");
		} else {
			System.err.println("[Dotenv] WARNING: GOOGLE_CLIENT_ID not found in .env or system properties!");
		}
	}

}

