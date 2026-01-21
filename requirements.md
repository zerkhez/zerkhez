# Requirements Document - Zerkhez Nitrogen Calculator

## 1. Project Overview
Zerkhez is a mobile application designed to assist farmers in determining the optimal nitrogen fertilizer requirements for their crops (specifically Rice and Wheat). It utilizes image processing techniques to analyze the color of crop leaves compared to a reference strip ("Kaafi" / Non-limiting) to calculate the Nitrogen need and provide specific fertilizer recommendations.

## 2. Functional Requirements

### 2.1 Crop Management
*   **FR-01: Crop Selection**
    *   The system must allow the user to select the crop type: **Rice** or **Wheat**.
*   **FR-02: Variety Selection (Rice)**
    *   For Rice, the system must allow the user to select a specific variety from a predefined list (e.g., Sona super Basmati, Kisan Basmati, Super Basmati, Basmati 515, PK 1121 Aromatic, Pk 2021 Aromatic).
    *   Calculations must use variety-specific formulas defined in the backend.

### 2.2 Input Parameters
*   **FR-03: Growth Stage Input**
    *   **Rice:** User must input **Days After Transplanting (DAT)**.
    *   **Wheat:** User must input **Days After Sowing (DAS)**.
    *   The system must validate that DAT/DAS is a positive number.

### 2.3 Image Acquisition
*   **FR-04: Reference Image (Kaafi)**
    *   The system must allow the user to capture or upload an image of the "Kaafi" (Non-limiting/Reference) strip.
*   **FR-05: Test Image (Aam)**
    *   The system must allow the user to capture or upload an image of the "Aam" (Test/Field) crop.
*   **FR-06: Image Validation**
    *   The system must ensure both images are provided before proceeding to calculation.

### 2.4 Analysis and Calculation
*   **FR-07: Image Processing (Backend)**
    *   The system must analyze the uploaded images to detect green pixels based on the condition `(G > R) and (G > B)`.
    *   It must calculate the **Green Index (GI)** using the crop/variety-specific formula.
*   **FR-08: Indices Calculation**
    *   The system must calculate **NDVI** (Normalized Difference Vegetation Index) based on the GI.
    *   It must calculate **IEY** (In-season Estimation of Yield).
    *   It must calculate **RI** (Response Index) and **PYP** (Potential Yield).
*   **FR-09: Nitrogen Rate Calculation**
    *   The system must calculate the required Nitrogen rate (kg/ha) based on the difference between Potential Yield with Nitrogen (PYPN) and Potential Yield (PYP).

### 2.5 Recommendations
*   **FR-10: Fertilizer Dosage**
    *   The system must translate the Nitrogen rate into specific fertilizer dosages (kg/acre) for:
        *   **Urea**
        *   **CAN** (Calcium Ammonium Nitrate)
        *   **Ammonium Sulfate**
*   **FR-11: Result Display**
    *   The system must display the recommended dosages clearly to the user.
    *   (Optional) Display calculation details (Green Pixels, NDVI, Yield estimates) for transparency.

### 2.6 Educational & Support Features
*   **FR-12: Instructional Content**
    *   The app must provide instructions for different crop stages (e.g., Pre-planting, Sprout, Gobh).
    *   The app must provide guides on how to take correct photos for analysis.
*   **FR-13: Video Tutorials**
    *   The app should include video tutorials to guide users on how to use the application effectively.

## 3. Non-Functional Requirements

### 3.1 Usability
*   **NFR-01: User Interface**
    *   The application must have a clean, intuitive, and mobile-friendly interface suitable for use by farmers.
    *   The design should be visually appealing ("Zerkhez" theme).
*   **NFR-02: Localization (Implicit)**
    *   (Future Scope) The app structure should support potential localization (Urdu/English) given the target audience (farmers in Pakistan/South Asia), though current requirements are in English/Roman Urdu terms ("Kaafi", "Aam").

### 3.2 Performance
*   **NFR-03: Response Time**
    *   Image processing and calculation via the API should ideally complete within a few seconds (under 5-10s) to maintain user engagement, dependent on network speed.
*   **NFR-04: Efficient Processing**
    *   The backend should handle image resizing or processing efficiently to minimize memory usage.

### 3.3 Reliability & Availability
*   **NFR-05: Calculation Accuracy**
    *   Calculations must strictly adhere to the defined scientific formulas for Rice and Wheat to ensure agronomic validity.
*   **NFR-06: Error Handling**
    *   The system must provide clear error messages if issues occur (e.g., "No green pixels detected," "Server error," "Invalid input").

### 3.4 Compatibility
*   **NFR-07: Mobile Platform**
    *   The application must be built using **Expo/React Native** to support both **Android** and **iOS** platforms.
*   **NFR-08: Camera Access**
    *   The app requires permission and capability to access the device camera and gallery.

### 3.5 Interface Requirements
*   **NFR-09: Connectivity**
    *   The app requires an active internet connection to communicate with the backend Flask API for image processing.
