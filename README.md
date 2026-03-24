# Arreglado — Barangay Event Management System

A web-based event management system for Barangay Pandacaqui, Municipality of Mexico, Pampanga. Built with Angular.

---

## Installation

1. Create a new Angular project:
   ```
   ng new arreglado_official
   ```

2. Download the files from GitHub and overwrite the files inside `arreglado_official`.

3. Extract the files from `zone.js.zip` and place them inside the `node_modules` folder.

4. Start the development server:
   ```
   ng serve
   ```

5. Open your browser and go to `http://localhost:4200`.

---

## Accessing the Admin Panel

The public-facing site loads by default at `/client/eventpage`. To access the admin side:

1. In the browser address bar, navigate to:
   ```
   /admin
   ```
   You will be redirected to the login page automatically.

2. Enter the following credentials:

   | Field    | Value         |
   |----------|---------------|
   | Username | `kapitan`     |
   | Password | `pandacaqui`  |

3. Click **Sign In to Dashboard** to proceed.

> The admin session is tied to the browser tab. Closing the tab or navigating to the public client side will log you out automatically.
