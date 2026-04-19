import { Platform } from 'react-native';
import { File } from 'expo-file-system/next';
import jpeg from 'jpeg-js';
import { Buffer } from 'buffer';

export interface ImageStats {
    total_pixels: number;
    green_pixels: number;
    ratio: number;
    mean_rgb: [number, number, number];
}

export async function processImageStats(uri: string): Promise<ImageStats> {
    if (Platform.OS === 'web') {
        return processImageWeb(uri);
    } else {
        return processImageNative(uri);
    }
}

async function processImageWeb(uri: string): Promise<ImageStats> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error("Could not get 2d context on web canvas"));
            }
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            let green_pixels = 0;
            let sum_r = 0;
            let sum_g = 0;
            let sum_b = 0;
            const total_pixels = canvas.width * canvas.height;
            
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i+1];
                const b = data[i+2];
                // Green Pixel Condition: G > R and G > B
                if (g > r && g > b) {
                    green_pixels++;
                    sum_r += r;
                    sum_g += g;
                    sum_b += b;
                }
            }
            
            const ratio = total_pixels > 0 ? green_pixels / total_pixels : 0;
            const mean_r = green_pixels > 0 ? sum_r / green_pixels : 0;
            const mean_g = green_pixels > 0 ? sum_g / green_pixels : 0;
            const mean_b = green_pixels > 0 ? sum_b / green_pixels : 0;
            
            resolve({
                total_pixels,
                green_pixels,
                ratio,
                mean_rgb: [mean_r, mean_g, mean_b]
            });
        };
        img.onerror = (e) => reject(e);
        img.src = uri;
    });
}

async function processImageNative(uri: string): Promise<ImageStats> {
    try {
        const file = new File(uri);
        const base64Str = await file.base64();
        const imgBuffer = Buffer.from(base64Str, 'base64');
        const rawImageData = jpeg.decode(imgBuffer, { useTArray: true, maxMemoryUsageInMB: 1024 });
        
        const data = rawImageData.data; // Uint8Array [r,g,b,a, r,g,b,a...]
        const total_pixels = rawImageData.width * rawImageData.height;
        
        let green_pixels = 0;
        let sum_r = 0;
        let sum_g = 0;
        let sum_b = 0;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i+1];
            const b = data[i+2];
            // Green Pixel Condition: G > R and G > B
            if (g > r && g > b) {
                green_pixels++;
                sum_r += r;
                sum_g += g;
                sum_b += b;
            }
        }
        
        const ratio = total_pixels > 0 ? green_pixels / total_pixels : 0;
        const mean_r = green_pixels > 0 ? sum_r / green_pixels : 0;
        const mean_g = green_pixels > 0 ? sum_g / green_pixels : 0;
        const mean_b = green_pixels > 0 ? sum_b / green_pixels : 0;
        
        return {
            total_pixels,
            green_pixels,
            ratio,
            mean_rgb: [mean_r, mean_g, mean_b]
        };
    } catch (error) {
        console.error("Error processing local native JPEG:", error);
        throw error;
    }
}
