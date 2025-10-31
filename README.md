## NourishNet — Smarter Food Bank Operations

NourishNet is an AI-powered mobile and web platform that streamlines food bank operations, enhances communication, and creates a dignified experience for donors, staff, volunteers, and recipients.

### Vision
Create a cohesive, intelligent platform that maximizes resources, reduces waste, and better meets diverse nutritional and cultural needs in the fight against food insecurity.

### Problem
Food security organizations face fragmented communication, inefficient inventory and donation management, and logistical bottlenecks—leading to wasted resources, staff burnout, and reduced impact.

### Solution
A centralized hub providing intelligent inventory management, streamlined operations and communication, and data-driven insights. Automates tedious tasks, surfaces actionable data, and connects stakeholders seamlessly.

## Target Audience & Personas
- **Mary Johnson — Food Bank Staff (Considerate Caregiver)**: Needs simpler daily workflows and better operational insights.
- **Jenny Jones — Donor (Considerate Empath)**: Wants meaningful donations aligned with current needs and visibility into her impact.
- **Robert Reed — Recipient (Provider)**: Seeks convenient, dignified access to nutritious, culturally relevant food.
- **James Smith — New Volunteer (Eager Helper)**: Needs clear onboarding, task clarity, and documentation.
- **Mason Carter — Organization Coordinator (Detail-oriented)**: Manages partner relationships; needs organized communication and tracking.
- **Cynthia Harmon — Nutrition Advocate**: Pushes for improved food systems; often faces bureaucratic hurdles.

## Key Themes & Needs
- **Operations & Logistics**: Streamlined inventory, volunteer coordination, and actionable daily insights.
- **Resource Acquisition & Partnerships**: Tools to manage donations and partner relationships across businesses and farms.
- **Communication & Outreach**: Centralized messaging and visibility; reduce confusion and friction.
- **Client & End-User Experience**: Meet dietary and cultural needs; support recipients lacking full kitchen facilities.

## Core Features & Design Concepts
### Module 1: Intelligent Inventory & Sourcing Management
- Predictive inventory alerts powered by ML.
- Collaborative, real-time sourcing list for staff and field volunteers.
- Camera-based donation scanning with nutrition lookup.

### Module 2: Streamlined Operations & Communication
- Dashboard-based task tracking for daily clarity.
- AI summaries that extract logistics and auto-generate calendar events or reminders.
- Event-based pipeline view of deliveries, pickups, and shifts.

### Module 3: Enhanced Recipient & Donor Experience
- QR code recipe generation tailored to each package.
- Donor history and real-time needs lists for impactful giving.
- Community impact dashboard for service metrics and reporting.

## High-Level Use Cases (Epics)
- **Inventory Replenishment (UC-9/10/11)**: Staff review AI alerts, build sourcing lists; volunteers update fulfillment in real time.
- **Donation Processing & Packaging (UC-5/6)**: Scan donations via camera; generate QR codes with culturally relevant recipes.
- **Operational Coordination (UC-7/12/13)**: Central task dashboard; auto-create delivery events from incoming communications.
- **Data Analysis & Reporting (UC-15/16)**: Auto-generate logistics spreadsheets and produce customizable reports.

## This Repository
This repo contains a single-page landing site to collect early access interest while product development is underway.

### Live Preview
- Open `index.html` in a browser (no build or server required).

### Editing the Landing Page
- **Hero video**: Replace the `<source>` inside `video#heroVideo` in `index.html` with your file.
- **Copy & sections**: Update text directly in `index.html`.
- **Colors & visuals**: Tweak CSS variables in `styles.css` under `:root`.
- **Animations & interactions**: Adjust logic in `script.js` (reveal, tilt, parallax, confetti).

### Email Capture (Apps Script)
- Forms POST the `email` field to a Google Apps Script endpoint (connected to Google Sheets).
- To change the endpoint, edit `window.NOURISHNET_APPSCRIPT_URL` in `index.html` near the bottom.

### Analytics
- Google Analytics is integrated via `gtag.js` in `index.html`. Replace the measurement ID if needed.

### Folder Structure
```
Team_Food_Insecurity_Landing_Page/
├─ index.html      # Landing page structure, GA, Apps Script endpoint
├─ styles.css      # Visual design, layout, responsive styles, animations
├─ script.js       # Interactions, form handling, effects
├─ Product Details # Product brief used to author this README
└─ notes.txt       # Analytics ID and Apps Script endpoint reference
```

## License
All rights reserved. If you’d like to use or contribute, please open an issue or contact the maintainer.
