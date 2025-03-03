package com.shorturlbackend.shorturlbackend.services;

import com.shorturlbackend.shorturlbackend.models.ShortenedUrl;
import com.shorturlbackend.shorturlbackend.models.User;
import com.shorturlbackend.shorturlbackend.repositories.ShortenedUrlRepository;
import com.shorturlbackend.shorturlbackend.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.net.URL;
import java.security.SecureRandom;


@Service
@Slf4j
public class AccountService {

    private final UserRepository userRepository;
    private final ShortenedUrlRepository shortenedUrlRepository;
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private final SecureRandom random = new SecureRandom();

    @Autowired
    public AccountService(UserRepository userRepository, ShortenedUrlRepository shortenedUrlRepository) {
        this.userRepository = userRepository;
        this.shortenedUrlRepository = shortenedUrlRepository;
    }

    public boolean validateCredentials(String username, String password) {
        // look up the user in the database and check the password
        User user = userRepository.findByUsername(username);
        if (user != null) {
            log.info("User found: {}", user.getPassword());
            return user.getPassword().equals(password);
        }
        return false;
    }

    //find original url
    public String findOriginalUrl(String shortUrl) {
        ShortenedUrl shortenedUrl = shortenedUrlRepository.findByShortUrl(shortUrl);
        if (shortenedUrl != null) {
            return shortenedUrl.getOriginalUrl();
        }
        return null;
    }

    @Cacheable(value = "shortenedUrls", key = "#url")
    public String shortenUrl(String url) {
        if (!isValidUrl(url)) {
            throw new IllegalArgumentException("Invalid URL format");
        }

        ShortenedUrl existingUrl = shortenedUrlRepository.findByOriginalUrl(url);
        if (existingUrl != null) {
            return existingUrl.getShortUrl();
        }

        String shortUrl;
        do {
            shortUrl = generateRandomString(3);
        } while (shortenedUrlRepository.findByShortUrl(shortUrl) != null);
        ShortenedUrl shortenedUrl = new ShortenedUrl();
        shortenedUrl.setOriginalUrl(url);
        shortenedUrl.setShortUrl(shortUrl);
        shortenedUrlRepository.save(shortenedUrl);

        return shortUrl;
    }

    private String generateRandomString(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }

    private boolean isValidUrl(String url) {
        try {
            new URL(url);
            return true;
        } catch (MalformedURLException e) {
            return false;
        }
    }
}
