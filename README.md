# Mars Terminal Interface

A retro-styled, website that fetches and displays the latest image transmissions from Mars Rovers (Curiosity and Perseverance), alongside deep-space imagery from NASA's Astronomy Picture of the Day (APOD) archive. 

## Features

* **Retro Terminal :** Custom CSS featuring Old retro CRT TV vibes makes it looks very Retro-ish.
* **Live Mars Rover Feeds:** Steals NASA's Data to pull the latest photos from Mars rovers ( Curiosity and Perseverance).
* **Deep Space Archive Fallback:** If the rovers haven't sent back recent images (or if the API is rate-limited), the terminal automatically transitions to fetching stunning imagery and detailed explanations from the APOD archive.
* **Detailed Briefings:** Displays contextual information for the images, including the capturing rover, camera used, Earth date, and detailed APOD scientific explanations.


## Setup & Installation

Click on this link to get direct acess to the website https://the-degenerate-otaku.github.io/Mars-Terminal/

## How It Works

1. **Initialization:** On load, the app sets the mission clock and begins the "uplink" process.
2. **Primary Uplink (Rovers):** The script attempts to fetch the absolute latest photo from the Mars Rovers. 
3. **Data Injection:** If successful (if you are lucky somehow), it extracts the image URL, rover name, sol, and camera data, then injects it into the DOM.
4. **Fallback Mechanism:** If the rover API fails or rate-limits the connection, the script catches the error and triggers `startApodFallback()`, seamlessly transitioning the terminal to display a rotating feed of Deep Space images (really cool).

## 🛰️ Credits

* Imagery and Data provided by the [NASA Open APIs](https://api.nasa.gov/) (absolute GOATS fr)

# Tech Stack

* HTML
* CSS
* JS