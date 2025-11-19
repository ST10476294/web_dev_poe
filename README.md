# Sol de Janeiro — Static Landing Page

A responsive, single-page-style website for the Sol de Janeiro brand, built with semantic HTML, custom CSS, and vanilla JavaScript. The project showcases various product lines and includes interactive features like a dynamic product grid, store locator map, and validated contact forms.

## Quick start

1.  Open the project folder in your editor (e.g., VS Code).
2.  Open [`index.html`](/Users/wanga/Documents/code/code_reviews/Wanga%20tshidada%20web%20dev%20part%203/index.html) in a browser, or use the "Live Server" extension for automatic reloading.
3.  All custom styles are located in [`style.css`](/Users/wanga/Documents/code/code_reviews/Wanga%20tshidada%20web%20dev%20part%203/style.css).
4.  All JavaScript functionality is in [`main.js`](/Users/wanga/Documents/code/code_reviews/Wanga%20tshidada%20web%20dev%20part%203/main.js).

## Features

-   **Responsive Design**: Mobile-first layout that adapts to tablet and desktop screens.
-   **Interactive Widgets**: Includes tabs, an accordion for FAQs, and a modal-based gallery lightbox.
-   **Dynamic Product Grid**: Products are rendered from a JavaScript array, with client-side search and sort functionality.
-   **Cart Persistence**: "Add to Cart" status is saved to `localStorage`, so it persists across page reloads.
-   **Interactive Map**: A Leaflet.js map displays store locations.
-   **Form Validation**: Client-side validation for both the contact and enquiry forms, with clear user feedback.
-   **AJAX Form Submission**: Forms submit without a page reload, using a simulated API to prevent errors.
-   **SEO Optimized**: Semantic HTML, unique page titles, meta descriptions, `sitemap.xml`, and `robots.txt` are included.

## File structure

-   `index.html` — The main landing page.
-   `contact.html` — The general contact form.
-   `enquiry.html` — The detailed enquiry form.
-   `style.css` — All custom CSS styles.
-   `main.js` — All JavaScript logic for interactivity.
-   `images/` — Contains all image assets.
-   `icons/` — Contains SVG icons.
-   `sitemap.xml` — Provides a site map for search engine crawlers.
-   `robots.txt` — Instructs search engine crawlers.

## Changelog & Development History

### Part 3: Functionality and SEO Implementation

-   **JavaScript Interaction**:
    -   Implemented `initTabs` and `initAccordion` for the FAQ and interactive sections.
    -   Added Leaflet.js integration for the "Find Stores" map.
    -   Created a "Lightbox" gallery for expanding images.
-   **Dynamic Product Grid**:
    -   Implemented `initProducts` to render product data dynamically.
    -   Added Search and Sort (Price/Name) functionality.
    -   **Feature:** Added `localStorage` persistence to the "Add to Cart" buttons.
-   **Forms & Validation**:
    -   Created `validateForm` with RegEx for Email and Phone validation.
    -   Implemented simulated AJAX submission in `postJSON` to handle form data without page reloads and prevent console errors.
    -   Added dynamic response messages for Enquiry (Product availability calculation) and Contact forms.
-   **SEO**:
    -   Added unique `<title>` and `<meta name="description">` tags to all pages.
    -   Created `sitemap.xml` and `robots.txt`.
 
    -   
