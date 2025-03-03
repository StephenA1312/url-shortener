package com.shorturlbackend.shorturlbackend.models;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Getter
@Setter
public class UrlShorternerRequest {
    private String url;
}
