package com.shorturlbackend.shorturlbackend.controller;

import com.shorturlbackend.shorturlbackend.models.UrlShorternerRequest;
import com.shorturlbackend.shorturlbackend.services.AccountService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@CrossOrigin(origins = "http://localhost:8080") // Adjust to match your frontend
public class ShortenerController {

    private final AccountService accountService;

    public ShortenerController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/api/url/shorten")
    public ResponseEntity<String> shortenUrl(@RequestBody UrlShorternerRequest urlShorternerRequest) {
        String url = urlShorternerRequest.getUrl();
        String shortenedUrl = accountService.shortenUrl(url);
        String baseUrl = "http://localhost:8081/";
        return ResponseEntity.ok(baseUrl + shortenedUrl);
    }

    @GetMapping("/{url}")
    public ResponseEntity<Void> redirectToOriginalUrl(@PathVariable String url) {
        String originalUrl = accountService.findOriginalUrl(url);
        if (originalUrl != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(URI.create(originalUrl));
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        }
        return ResponseEntity.notFound().build();
    }

}
