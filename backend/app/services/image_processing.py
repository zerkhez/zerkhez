import numpy as np
from PIL import Image

def process_image(image_file):
    """
    Process image to find Green Pixels (GP), Total Pixels (TP), and mean RGB of Green Pixels.
    Green Pixel Condition: G > R and G > B
    """
    img = Image.open(image_file).convert('RGB')
    img_arr = np.array(img)
    
    # Extract channels
    R = img_arr[:, :, 0]
    G = img_arr[:, :, 1]
    B = img_arr[:, :, 2]
    
    # Mask for green pixels
    mask = (G > R) & (G > B)
    
    green_pixels = img_arr[mask]
    
    GP = len(green_pixels)
    TP = img_arr.shape[0] * img_arr.shape[1]
    
    if GP == 0:
        return 0, TP, 0, 0, 0 # Avoid division by zero later
        
    # Mean RGB of green pixels
    mean_R = np.mean(green_pixels[:, 0])
    mean_G = np.mean(green_pixels[:, 1])
    mean_B = np.mean(green_pixels[:, 2])
    
    return GP, TP, mean_R, mean_G, mean_B
