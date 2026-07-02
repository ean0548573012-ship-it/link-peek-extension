let previewBox = null;

function isDownloadLink(url, link) {
    if (link.hasAttribute('download')) return true;
    const downloadExtensions = /\.(zip|rar|7z|exe|msi|apk|pdf|doc|docx|xls|xlsx|mp3|mp4|avi|mkv)(\?.*)?$/i;
    try {
        const urlObj = new URL(url);
        if (downloadExtensions.test(urlObj.pathname)) return true;
        if (urlObj.pathname.toLowerCase().includes('/download/')) return true;
    } catch(e) {}
    return false;
}

document.addEventListener('mouseover', function(e) {
    if (e.target.closest('a') && e.shiftKey) {
        const link = e.target.closest('a');
        let url = link.href;
        
        if (!url.startsWith('http')) return;

        if (url.includes('wikipedia.org/wiki/')) {
            url = url.replace(/https?:\/\/([a-z0-9\-]+)\.wikipedia\.org\/wiki\//i, 'https://www.hamichlol.org.il/');
        }

        if (previewBox) {
            previewBox.remove();
        }

        // 1. יצירת מסגרת החלון החיצונית (בגודל נוח על המסך שלך)
        previewBox = document.createElement('div');
        previewBox.style.position = 'fixed';
        previewBox.style.bottom = '30px';
        previewBox.style.left = '30px'; 
        previewBox.style.width = '640px';  
        previewBox.style.height = '480px'; 
        previewBox.style.border = '1px solid #ccc';
        previewBox.style.borderRadius = '10px';
        previewBox.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
        previewBox.style.backgroundColor = '#fff';
        previewBox.style.zIndex = '999999';
        previewBox.style.overflowX = 'hidden'; // חוסם לחלוטין גלילה לצדדים בחלון הראשי
        previewBox.style.overflowY = 'auto';   // מאפשר גלילה למטה ולמעלה בחלון הראשי
        previewBox.style.overscrollBehavior = 'contain'; 

        if (isDownloadLink(url, link)) {
            const downloadContainer = document.createElement('div');
            downloadContainer.style.display = 'flex';
            downloadContainer.style.flexDirection = 'column';
            downloadContainer.style.alignItems = 'center';
            downloadContainer.style.justifyContent = 'center';
            downloadContainer.style.height = '100%';
            downloadContainer.style.fontFamily = 'Arial, sans-serif';
            downloadContainer.style.padding = '20px';
            downloadContainer.style.textAlign = 'center';

            const infoText = document.createElement('p');
            infoText.textContent = 'זהו קישור להורדת קובץ. ההורדה האוטומטית נחסמה בחלון התצוגה המקדימה.';
            infoText.style.marginBottom = '20px';
            infoText.style.color = '#333';
            infoText.style.fontSize = '16px';
            infoText.dir = 'rtl';

            const downloadBtn = document.createElement('a');
            downloadBtn.href = url;
            downloadBtn.textContent = 'לחץ כאן להורדת הקובץ';
            downloadBtn.setAttribute('download', '');
            downloadBtn.style.padding = '12px 24px';
            downloadBtn.style.backgroundColor = '#007bff';
            downloadBtn.style.color = '#fff';
            downloadBtn.style.textDecoration = 'none';
            downloadBtn.style.borderRadius = '6px';
            downloadBtn.style.fontWeight = 'bold';
            downloadBtn.style.fontSize = '16px';

            downloadContainer.appendChild(infoText);
            downloadContainer.appendChild(downloadBtn);
            previewBox.appendChild(downloadContainer);
        } else {
            // 2. יצירת האתר הפנימי עם "טריק הזום והרוחב הכפול"
            const iframe = document.createElement('iframe');
            iframe.src = url;
            
            // גורם לאתר לחשוב שהוא נפתח במסך גדול (רוחב 1280 וגובה 960)
            iframe.style.width = '1280px';
            iframe.style.height = '960px';
            iframe.style.border = 'none';
            iframe.style.backgroundColor = '#ffffff';
            
            // מכווץ את כל האתר ב-50% כדי שייכנס בדיוק בתוך ה-640x480 של החלון החיצוני
            iframe.style.transform = 'scale(0.5)';
            iframe.style.transformOrigin = 'top left'; 
            
            previewBox.appendChild(iframe);
        }

        document.body.appendChild(previewBox);
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.closest('a') && previewBox) {
        if (e.shiftKey) return; 
        previewBox.remove();
        previewBox = null;
    }
});

document.addEventListener('keyup', function(e) {
    if (e.key === 'Shift' && previewBox) {
        previewBox.remove();
        previewBox = null;
    }
});

document.addEventListener('mousedown', function(e) {
    if (previewBox && !previewBox.contains(e.target)) {
        previewBox.remove();
        previewBox = null;
    }
});
