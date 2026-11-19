OPUS ONE — THE CHRISTMAS GIFTING EXPERIENCE
Standalone HTML package
Prepared: 19 November 2026

QUICK START
-----------
1. Extract the ZIP file.
2. Open index.html in a modern browser.
3. For the most reliable local preview, run a simple local web server in this
   folder (for example: python3 -m http.server 8000) and open
   http://localhost:8000.

No build step, database, backend, framework, or Lovable account is required.
The experience uses only HTML, CSS, JavaScript, and local media assets.


WHAT IS INCLUDED
----------------
- Responsive one-page Christmas gifting experience
- Five-question accessible gifting quiz
- JavaScript recommendation engine with one primary and two alternatives
- Quiz-aware WhatsApp inquiry messages
- Complete catalogue navigation with four category panels
- Corporate gifting section
- Centralized catalogue/PDF configuration
- Locally stored, official Opus One imagery
- User-initiated, looped Christmas music with mute control
- No forced autoplay and no personal-data collection


CONFIGURATION
-------------
Open js/script.js and edit the CONFIG object at the top of the file.

WhatsApp number:
  CONFIG.whatsappNumber

Use international format without +, spaces, or punctuation.
The verified number included in this build is 628112340951.

Catalogue/PDF destinations:
  CONFIG.catalogues.general.url
  CONFIG.catalogues.giftSet.url
  CONFIG.catalogues.hampersBox.url
  CONFIG.catalogues.hampersTinggi.url
  CONFIG.catalogues.collaborations.url

The general destination is the official Opus One Christmas 2026 catalogue
folder published on opusone.id/link-in-bio/.

Category-specific catalogue links were not publicly verified when this package
was prepared. Those values are intentionally null. A null value changes the
button into a WhatsApp request for the latest catalogue. Do not replace null
with an invented URL. When Opus One supplies a verified PDF, put the full URL
inside quotation marks, for example:

  giftSet: {
    label: "Gift Set Catalogue",
    url: "https://verified.example/catalogue.pdf"
  }

A local PDF may also be placed in assets/documents/ and referenced with a
relative path such as:

  url: "assets/documents/gift-set-catalogue.pdf"


UPDATING PRODUCT INFORMATION
----------------------------
Verified Gift Box Set product cards are in index.html inside the element with
class "product-grid". Update the product name, official product-page link,
image path, and alt text together.

Recommendation categories and packaging directions are stored in the
RECOMMENDATIONS object near the top of js/script.js. Scoring rules are in the
scoreRecommendations() function.

Do not add product names, contents, prices, dimensions, availability claims, or
specifications unless they have been confirmed by Opus One.


UPDATING IMAGES
---------------
1. Save a verified Opus One image in assets/images/.
2. Replace the relevant src path in index.html or js/script.js.
3. Update the alt text so it accurately describes the image.
4. Keep a record of the official source URL.

All product and lifestyle images included in this package were downloaded from
opusone.id. The current package does not use generic stock photography.


MUSIC
-----
The local file is:
  assets/audio/jingle-bells-instrumental.wav

It is an original, computer-rendered bell-and-piano arrangement prepared for
this package from the public-domain composition "Jingle Bells". It does not use
or copy a third-party sound recording. The player starts only after the visitor
presses the Music control, loops at low volume, and can be muted at any time.

To replace it, save a legally usable WAV file at the same path, or update the
<source> element near the end of index.html. Confirm the correct MIME type.


VERIFIED SOURCE NOTES
---------------------
Verified against official pages on 19 November 2026:

Official website:
  https://opusone.id/

Official Instagram destination:
  https://www.instagram.com/opusone.id/

Official link-in-bio page and current catalogue destination:
  https://opusone.id/link-in-bio/
  https://drive.google.com/drive/folders/1VM7Fjpm_-Q8R0I4zUT91P7_mW1ZiOiAh?usp=sharing

Official WhatsApp destination:
  https://wa.me/628112340951

Verified product pages:
  https://opusone.id/product/opus-one-gift-box-set-frida-luzia-a-25567/
  https://opusone.id/product/opus-one-gift-box-set-frida-luzia-b-blue-25826/
  https://opusone.id/product/opus-one-gift-box-set-frida-luzia-b-green-25827/
  https://opusone.id/product/opus-one-gift-box-set-frida-luzia-c-blue-25569/

Collaboration names (Opus One x Sucre, Little Puff, and Amora) came from the
supplied campaign brief. Public product details were not independently verified,
so the website shows names only and marks availability for confirmation.


TESTING CHECKLIST
-----------------
- Open index.html or serve the folder locally.
- Start and complete the five-step quiz.
- Use Back and Continue, then retake the quiz.
- Confirm that a primary and two alternative recommendations appear.
- Confirm that the recommendation WhatsApp message includes every quiz answer.
- Switch all catalogue tabs.
- Confirm the general catalogue opens in a new tab.
- Confirm unavailable category catalogues create a WhatsApp request.
- Test corporate and general WhatsApp buttons.
- Turn music on and off after a user interaction.
- Test desktop and mobile widths.


FILE MAP
--------
index.html                         Main website
css/style.css                      Visual design and responsive styles
js/script.js                       Configuration, quiz, recommendations, links
assets/images/                     Local official Opus One imagery
assets/audio/                      Local instrumental audio
assets/documents/                  Optional local PDF catalogues
assets/icons/                      Optional local icon assets
README.txt                         This guide

