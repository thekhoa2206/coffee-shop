package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.FileResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileStorageService {
    FileResponse uploadFile(MultipartFile file, String description) throws IOException;
}
