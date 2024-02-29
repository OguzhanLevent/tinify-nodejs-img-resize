const tinify = require("tinify");
const fs = require("fs");
const path = require("path");

// Tinify API anahtarını buraya girin
tinify.key = "YOUR_TOKEN";

// Resize edilmiş dosyayı kaydetmek için fonksiyon
async function saveResizedImage(inputPath, outputDir, fileName, width, height, suffix) {
    try {
        const source = tinify.fromFile(inputPath);
        const resized = source.resize({
            method: "fit",
            width: width,
            height: height
        });
        const outputPath = path.join(outputDir, fileName, `${fileName}-${suffix}.jpg`); // Dosya adına sonek ekleme
        await resized.toFile(outputPath);
        console.log("Resized image saved successfully:", outputPath);
    } catch (error) {
        console.error("Error occurred while resizing image:", error);
    }
}

// Birden fazla boyutta resimleri yeniden boyutlandırıp kaydetme
async function resizeAndSaveImages(inputDir, outputDir, sizes) {
    try {
        const files = fs.readdirSync(inputDir);

        for (const file of files) {
            const fileName = path.basename(file, path.extname(file));
            const outputSubDir = path.join(outputDir, fileName);
            if (!fs.existsSync(outputSubDir)) {
                fs.mkdirSync(outputSubDir, { recursive: true });
            }

            const inputPath = path.join(inputDir, file);

            for (const size of sizes) {
                const { width, height, suffix } = size;
                await saveResizedImage(inputPath, outputDir, fileName, width, height, suffix);
            }
        }
    } catch (error) {
        console.error("Error occurred while resizing images:", error);
    }
}

// Örnek kullanım
const inputDir = "input/";
const outputDir = "output/";
const sizes = [
    { width: 96, height: 120, suffix: "cart_default" },
    { width: 120, height: 150, suffix: "small_default" },
    { width: 240, height: 300, suffix: "medium_default" },
    { width: 480, height: 600, suffix: "home_default" },
    { width: 960, height: 1200, suffix: "large_default" },
    { width: 960, height: 1200, suffix: "category_default" },
    { width: 128, height: 160, suffix: "stores_default" },
    { width: 96, height: 120, suffix: "manu_default" },
    { width: 48, height: 60, suffix: "swatch_default" },
];

resizeAndSaveImages(inputDir, outputDir, sizes);
