package com.shorturlbackend.shorturlbackend.repositories;

import com.shorturlbackend.shorturlbackend.models.ShortenedUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShortenedUrlRepository extends JpaRepository<ShortenedUrl, Long> {
    ShortenedUrl findByOriginalUrl(String originalUrl);
    ShortenedUrl findByShortUrl(String shortUrl);
}