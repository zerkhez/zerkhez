# How to Add Labels in GitHub

Based on the message from Dr. Fatima Sabir, you need to use **GitHub Labels** to categorize your project tasks (Functional vs Non-Functional) and artifacts.

Since you are new to this, here is a step-by-step guide to doing this on the GitHub website.

## 1. What are Labels?
In GitHub, **Labels** are tags you put on **Issues** or **Pull Requests** to categorize them. You cannot put labels directly on "code files", but you can create "Issues" that represent your work (like "Implement Nitrogen Calculator") and label those.

## 2. How to Create New Labels
1.  Go to your GitHub repository page in your browser.
2.  Click on the **Issues** tab at the top.
3.  Click on the **Labels** button (usually on the right side of the search bar).
4.  Click **New label**.

## 3. Recommended Labels for your FYP
Based on your teacher's requirements, you should create these labels:

| Label Name | Color | Description |
| :--- | :--- | :--- |
| **Functional** | `blue` | Functional requirements (e.g., "Calculate Nitrogen", "Camera Input") |
| **Non-Functional** | `pink` | Non-functional requirements (e.g., "Performance", "Security", "UI Design") |
| **Phase-I** | `green` | Items related to Phase I deliverables |
| **Artifact** | `purple` | Released artifacts or documents |
| **Documentation** | `yellow` | Reports, guides, and manuals |

## 4. How to Assign Labels
1.  Go to **Issues** and find a task (e.g., "Create Nitrogen Calculator screen"). If you don't have issues, create them for each feature you built!
2.  On the right sidebar of the issue, click **Labels**.
3.  Select `Functional` (or whichever applies).

## 5. Suggested Issues for Your Project
Here is a list of features found in your code that you can create Issues for and label:

### Functional Requirements (Label: `Functional`)
- **Nitrogen Calculation**: Calculate nitrogen need based on DAT and leaf color.
- **Crop Selection**: Allow user to select from multiple rice varieties (e.g., Sona Super Basmati).
- **Date Validation**: Validate selected date against crop-specific DAT ranges.
- **Image Input**: Capture image via Camera.
- **Gallery Import**: Select existing image from Gallery.
- **User Guidance**: Show "Early" or "Late" warnings based on DAT.
- **Fertilizer Selection**: Choose fertilizer types for calculation.

### Non-Functional Requirements (Label: `Non-Functional`)
- **Urdu Localization**: Application interface must be in Urdu.
- **UI Animations**: Smooth transitions and entry animations (using Reanimated).
- **Visual Design**: Theme color implementation (`#4F611C`) and styling.
- **Performance**: Optimized list rendering for crop types.
- **Usability**: Large, accessible buttons for farmers.

## Example structure for your Teacher
If you need to provide a "Link of Online requirement... linked to labels":
1.  Create an Issue for a requirement: e.g., "User can calculate DAT for Rice".
2.  Assign the label **Functional**.
3.  Copy the URL of that Issue and put it in your Google Sheet.
