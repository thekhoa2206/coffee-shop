package com.hust.coffeeshop.services.impl;

import com.hust.coffeeshop.common.FileDownloadUtil;
import com.hust.coffeeshop.models.dto.FileResponse;
import com.hust.coffeeshop.models.dto.customer.CustomerResponse;
import com.hust.coffeeshop.models.entity.File;
import com.hust.coffeeshop.models.exception.ErrorException;
import com.hust.coffeeshop.models.repository.FileRepository;
import com.hust.coffeeshop.services.FileStorageService;
import lombok.val;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;

@Service
public class FileStorageServiceImpl implements FileStorageService {
private final FileRepository fileRepository;
    @Value("${file.upload-dir}")
    private String sourceFile;

    public FileStorageServiceImpl(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }
    @Override
    public FileResponse uploadFile(MultipartFile[] files) throws IOException {
        FileResponse fileResponse = new FileResponse();
        for(val file : files) {
            // lấy tên file
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            if (!file.getContentType().equals("image/jpeg"))
                throw new ErrorException("file không đúng định dạng image/jpeg");
            // Check nếu tên file trống báo lỗi
            if (fileName.contains("..")) {
                throw new ErrorException("Tên file chứa path không hợp lệ" + fileName);
            }
            File fileNew = new File();
            fileNew.setName(fileName);
            fileNew.setSize(file.getSize());
            fileNew.setPath(file.getOriginalFilename());
            fileNew.setType(file.getContentType());
            //Chuyển file cần lưu vào folder lưu trữ
            file.transferTo(new java.io.File(
                    sourceFile + file.getOriginalFilename()));

            try {
                val dbFile = fileRepository.save(fileNew);
                String fileUrL = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/file/view" + dbFile.getId())
                        .toUriString();

                fileResponse.setFileUrl(fileUrL);
                fileResponse.setId(dbFile.getId());
                fileResponse.setFileName(fileName);
            } catch (Exception e) {
                throw new ErrorException("lưu file hàng thất bại");
            }


        }
            return fileResponse;

    }
    @Override
    public ResponseEntity<byte[]> getImage (int id) throws IOException {
        val dbFile = fileRepository.findById(id);
        FileDownloadUtil downloadUtil = new FileDownloadUtil();
        Resource resource = null;
        try {
            resource = downloadUtil.getFileAsResource(dbFile.get().getName(), sourceFile);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
        BufferedImage originalImage = ImageIO.read(resource.getInputStream());
        int originalHeight = originalImage.getHeight();
        int originalWidth = originalImage.getWidth();
        int newWidth = (int) Math.round((double) 20 / originalHeight * originalWidth);
        Image scaledImage = originalImage.getScaledInstance(720, 300, Image.SCALE_SMOOTH);
        BufferedImage bufferedScaledImage = new BufferedImage(720, 300, BufferedImage.TYPE_INT_RGB);
        bufferedScaledImage.getGraphics().drawImage(scaledImage, 0, 0 , null);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(bufferedScaledImage, "jpg", baos);
        byte[] imageBytes = baos.toByteArray();
        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG)
                .body(imageBytes);
    }

}
