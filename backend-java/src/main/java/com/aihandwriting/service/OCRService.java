package com.aihandwriting.service;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class OCRService {

    private final ITesseract tesseract;

    @org.springframework.beans.factory.annotation.Value("${tesseract.datapath:C:\\Program Files\\Tesseract-OCR\\tessdata}")
    private String datapath;

    public OCRService() {
        this.tesseract = new Tesseract();
    }

    @jakarta.annotation.PostConstruct
    public void init() {
        // If datapath is provided and exists, use it. Otherwise rely on system default (for Linux/Docker)
        if (datapath != null && !datapath.isEmpty() && new File(datapath).exists()) {
            this.tesseract.setDatapath(datapath);
        }
        this.tesseract.setLanguage("eng");
    }


    public String extractText(File imageFile) {
        try {
            return tesseract.doOCR(imageFile);
        } catch (TesseractException e) {
            throw new RuntimeException("OCR failed: " + e.getMessage(), e);
        }
    }
}
//tesseract "C:\Users\Aseuro\Pictures\Screenshot2.jpg" stdout 