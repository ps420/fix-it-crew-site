Fix-It Crew Website Deployment Notes
===================================

Files in this package:
- index.html
- styles.css
- script.js
- README.txt

Before publishing:
1. Open script.js
2. Edit the BUSINESS_CONFIG object at the top:
   - businessName
   - phoneRaw
   - phoneDisplay
   - whatsAppNumber
   - whatsAppDisplay
   - email
   - serviceArea
   - serviceAreaShort
   - businessHours

Also update these SEO placeholders in index.html:
- og:url
- og:image
- twitter:image
- JSON-LD "image"
- JSON-LD "url"
- JSON-LD "telephone"
- JSON-LD "email"
- JSON-LD "areaServed" if needed
- JSON-LD "openingHours" if needed

Netlify upload:
- Go to Netlify
- Choose Add new site -> Deploy manually
- Drag and drop the extracted files or the ZIP contents
- Make sure index.html is in the root, not inside another folder

cPanel upload:
- Open File Manager
- Go to public_html/ or your domain root
- Upload the extracted files
- If an old site exists, back it up first
- Confirm index.html is in the root folder beside styles.css and script.js

After upload:
- Test phone link
- Test WhatsApp button
- Test email link
- Test quote form
- Check favicon loads
- Re-scan the site title/preview with your final domain
