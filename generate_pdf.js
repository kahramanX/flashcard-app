const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    console.log('Navigating to http://localhost:3000/levels ...');
    await page.goto('http://localhost:3000/levels', { waitUntil: 'networkidle2' });
    
    console.log('Adjusting styles to remove margins...');
    await page.addStyleTag({
      content: `
        @media print {
          /* Remove the side paddings and margins */
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: none !important;
          }
          
          .max-w-6xl {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
          }

          /* Hide jump-to navigation */
          .sticky {
            display: none !important;
          }

          /* Hide back button */
          a[href="/"] {
            display: none !important;
          }
          
          @page {
            margin: 1cm;
          }
        }
      `
    });

    console.log('Generating PDF...');
    await page.pdf({
      path: 'levels.pdf',
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        bottom: '1cm',
        left: '1cm',
        right: '1cm'
      }
    });

    console.log('Done! Saved to levels.pdf');
    await browser.close();
  } catch (err) {
    console.error('Error generating PDF:', err);
    process.exit(1);
  }
})();
