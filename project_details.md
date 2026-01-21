# Zerkhez: AI-Based Nitrogen Fertilizer Optimizer

## About the Project

Zerkhez is an AI-based mobile application designed to help farmers optimize the use of nitrogen fertilizer for major crops such as **rice, wheat, and maize**. In Pakistan, many farmers lack access to expensive nitrogen estimation tools like GreenSeeker devices and satellite-based systems. This often results in over-fertilization or under-fertilization, leading to reduced crop yields, increased costs, and environmental harm.

Zerkhez addresses this problem by providing a **low-cost, accessible, and offline-capable solution**. Using image processing and machine learning techniques, the application estimates nitrogen levels from images of crop leaves captured using a smartphone. Based on these estimates, along with crop age and recent weather data, the app provides personalized fertilizer recommendations. Voice assistance and alerts are included to support farmers with low literacy levels and limited internet connectivity.

---

## Project Scope

The scope of the Zerkhez project includes the following features and functionalities:

- **Nitrogen Estimation**
  - Estimation of nitrogen levels in rice, wheat, and maize crops.
  - Leaf color analysis using image segmentation and color-based features.

- **Fertilizer Recommendation**
  - Personalized fertilizer type and dosage recommendations.
  - Adjustments based on crop growth stage and age.

- **Crop Yield Optimization**
  - Improving yield through efficient nitrogen usage.
  - Reducing fertilizer waste and improving Nitrogen Use Efficiency (NUE).

- **Mobile Application Features**
  - Image capture and upload via smartphone camera.
  - Offline-first design for rural environments.
  - Voice assistance for navigation and recommendations.
  - Alerts and reminders for nitrogen rechecking and fertilizer application.

- **Validation**
  - Validation of nitrogen estimation results against GreenSeeker device readings.

---

## Tech Stack

### Frontend
- **React Native** – Cross-platform mobile application development
- **Expo CLI** – Simplified build and testing
- **SpeechRecognition** – Voice commands and audio feedback
- **Axios** – API communication

### Backend
- **Python 3.12**
- **Flask** – RESTful API development
- **Node.js** – Backend runtime and API integration

### AI & Image Processing
- **TensorFlow** – Deep learning model training
- **OpenCV** – Image preprocessing and segmentation
- **NumPy** – Numerical computation and feature extraction
- **K-Means Clustering** – Leaf segmentation and nitrogen-related color analysis

### Database
- **SQLite** – Lightweight database for user data and history

### Development & Tools
- **Git & GitHub** – Version control and collaboration
- **Jupyter Notebook** – Model training and experimentation
- **Postman** – API testing
- **Android Studio** – Emulator and debugging
- **Visual Studio Code** – Development environment

---

## Resources

### Data Resources
- Crop leaf image datasets for rice, wheat, and maize
- GreenSeeker readings for model validation
- Historical weather data (previous 10 days)

### Human Resources
- AI/ML model development and validation
- Mobile application development
- Backend and API development
- Project management and documentation

### Hardware & Software
- Smartphones with cameras for image capture
- Development systems for training and testing
- Open-source libraries and frameworks

---

## Research Contributions

This project contributes to research and applied development in **precision agriculture** by:

- Providing a **cost-effective alternative** to expensive nitrogen estimation tools.
- Applying **image segmentation and color-based analysis** for nitrogen estimation.
- Validating smartphone-based nitrogen estimation against GreenSeeker measurements.
- Designing an **offline-first, voice-assisted agricultural AI application**.
- Demonstrating practical deployment of machine learning for farmers in developing regions.

---

## Success Criteria

The project will be considered successful when the following criteria are achieved:

- **Model Accuracy**
  - At least **85% accuracy** in nitrogen estimation compared to GreenSeeker readings.

- **User Satisfaction**
  - At least **90% user satisfaction** based on usability and clarity of recommendations.

- **System Reliability**
  - Core features (image processing, nitrogen estimation, fertilizer recommendations) function correctly in offline mode.

- **Practical Impact**
  - Reduced fertilizer misuse.
  - Improved decision-making and crop management for farmers.

---

## Group Members & Responsibilities

| Name | Registration No. | Role / Responsibilities | Email | Phone |
|-----|------------------|-------------------------|-------|-------|
| **Zainab Mehmood** (Group Lead) | BCSF22M038 | Project coordination, frontend development (React Native), system architecture, weather & crop age integration | bcsf22m038@pucit.edu.pk | 0320-4186900 |
| **Hamid Ahmad** | BCSF22M011 | Literature review, backend development (Flask APIs), AI model integration | bcsf22m011@pucit.edu.pk | 0307-4583757 |
| **Ashjia Alvi** | BCSF22M032 | Dataset collection, UI/UX design, database setup and management | bcsf22m032@pucit.edu.pk | 0300-2441561 |
| **M. Aaqil Irshad** | BCSF22M053 | AI/ML model development, image processing, voice assistant, alerts & reminders, frontend development | bcsf22m053@pucit.edu.pk | 0318-2256854 |

---

## Project Advisor

**Dr. M. Shahid Farid**  
Associate Professor  
Department of Computer Science  
University of the Punjab

---

