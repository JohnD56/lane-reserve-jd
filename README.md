# lane-reserve-jd
# Lane Reservation Dashboard

A simple, web-based lane reservation system built with HTML, CSS, and JavaScript. Users can dynamically set up to 4 lanes, reserve and release lanes, manage a waitlist with removal via a trash icon, and track reservation timers.

---

## Features

* **Dynamic lane count** (1–4 lanes)
* **Reserve/Release** slots with prompts for user names
* **10-minute timers** on each reservation, auto-expiring
* **Extend time** in 10‑minute increments
* **Waitlist** when all lanes are full, with trash-icon removal
* **Active lanes** counter displayed in a dashboard card
* **Responsive dashboard UI** with sidebar, topbar, and cards

---

## File Structure

```
/ (project root)
├── index.html      # Main HTML structure
├── styles.css      # Dashboard and components styling
├── script.js       # Reservation logic and event handlers
└── README.md       # Project overview and instructions
```

---

## Usage

1. **Set lanes**

   * Enter a number (1–4) and click **Apply**.

2. **Reserve a slot**

   * Click **Add Reservation** or **Reserve** on an available lane.
   * Enter a name when prompted.

3. **Manage reservations**

   * **Release** frees a lane and pulls from the waitlist.
   * **Edit Name** lets you change the reservation name.
   * **+10 min** extends the timer by 10 minutes.

4. **Waitlist**

   * When lanes are full, new reservations join the waitlist.
   * Click the **trash icon** to remove someone from the waitlist.

---

## Customization

* **Max lanes**: Update the `max` attribute on the `#numLanes` input and the check in `initLanes()`.
* **Timer length**: Change the `timeLeft` initial value (currently `600` seconds) in `reserveLane()`.
* **Styling**: Tweak colors, fonts, and layouts in `styles.css`.

---
