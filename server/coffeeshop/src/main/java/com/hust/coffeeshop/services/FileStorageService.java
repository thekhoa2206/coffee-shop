package com.hust.coffeeshop.services;

import com.hust.coffeeshop.models.dto.FileResponse;
<<<<<<< HEAD
import org.springframework.http.ResponseEntity;
=======
>>>>>>> origin/tungnb
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileStorageService {
    FileResponse uploadFile(MultipartFile file) throws IOException;
    ResponseEntity<byte[]> getImage (int id) throws IOException;
}
