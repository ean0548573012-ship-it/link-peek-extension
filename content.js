let previewBox = null;

// פונקציה שמזהה האם הקישור הוא קובץ להורדה כדי למנוע הורדה אוטומטית
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

// מאזין לתנועת העכבר
document.addEventListener('mouseover', function(e) {
    if (e.target.closest('a') && e.shiftKey) {
        const link = e.target.closest('a');
        let url = link.href;
        
        if (!url.startsWith('http')) return;

        // החלפת קישורי ויקיפדיה לאתר המכלול
        if (url.includes('wikipedia.org/wiki/')) {
            url = url.replace(/https?:\/\/([a-z0-9\-]+)\.wikipedia\.org\/wiki\//i, 'https://www.hamichlol.org.il/');
        }

        if (previewBox) {
            previewBox.remove();
        }

        // יצירת חלונית התצוגה המקדימה 
        previewBox = document.createElement('div');
        previewBox.style.position = 'fixed';
        previewBox.style.bottom = '30px';
        previewBox.style.left = '30px'; 
        previewBox.style.width = '600px';
        previewBox.style.height = '450px';
        previewBox.style.border = '1px solid #ccc';
        previewBox.style.borderRadius = '10px';
        previewBox.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
        previewBox.style.backgroundColor = '#fff';
        previewBox.style.zIndex = '999999';
        previewBox.style.overflow = 'auto'; 
        previewBox.style.overscrollBehavior = 'contain'; 

        // חסימת הורדה אוטומטית והצגת כפתור במקום
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
            const iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.style.backgroundColor = '#ffffff';
            
            // --- תוספת קריטית נגד אתרים "שובבים" שמנסים לשבור את החלון ---
            iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups';
            
            previewBox.appendChild(iframe);
        }

        document.body.appendChild(previewBox);
    }
});

// מאזין ליציאת העכבר מהקישור כדי להעלים את החלונית
document.addEventListener('mouseout', function(e) {
    if (e.target.closest('a') && previewBox) {
        if (e.shiftKey) return; 
        previewBox.remove();
        previewBox = null;
    }
});

// סגירת החלונית כשעוזבים את מקש ה-Shift
document.addEventListener('keyup', function(e) {
    if (e.key === 'Shift' && previewBox) {
        previewBox.remove();
        previewBox = null;
    }
});

// סגירת החלונית בקליק בחוץ
document.addEventListener('mousedown', function(e) {
    if (previewBox && !previewBox.contains(e.target)) {
        previewBox.remove();
        previewBox = null;
    }
});
