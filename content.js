let previewBox = null;

// פונקציה שמזהה האם הקישור הוא קובץ להורדה כדי למנוע הורדה אוטומטית
function isDownloadLink(url, link) {
    if (link.hasAttribute('download')) return true;
    // רשימת סיומות של קבצים נפוצים להורדה
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
    // בודק אם העכבר על קישור (תגית A) ואם המשתמש מחזיק את מקש Shift
    if (e.target.closest('a') && e.shiftKey) {
        const link = e.target.closest('a');
        let url = link.href;
        
        // מוודא שזה קישור אמיתי ולא פקודת רשת
        if (!url.startsWith('http')) return;

        // --- תיקון 3: החלפת קישורי ויקיפדיה לאתר המכלול ---
        if (url.includes('wikipedia.org/wiki/')) {
            url = url.replace(/https?:\/\/([a-z0-9\-]+)\.wikipedia\.org\/wiki\//i, 'https://www.hamichlol.org.il/');
        }

        // אם כבר יש חלונית פתוחה, נסגור אותה קודם
        if (previewBox) {
            previewBox.remove();
        }

        // יצירת חלונית התצוגה המקדימה
        previewBox = document.createElement('div');
        previewBox.style.position = 'fixed';
        previewBox.style.bottom = '20px';
        previewBox.style.left = '20px'; // ממוקם בצד שמאל למטה
        previewBox.style.width = '450px';
        previewBox.style.height = '350px';
        previewBox.style.border = '1px solid #ccc';
        previewBox.style.borderRadius = '10px';
        previewBox.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
        previewBox.style.backgroundColor = '#fff';
        previewBox.style.zIndex = '999999';
        previewBox.style.overflow = 'hidden';

        // --- תיקון 2: חסימת הורדה אוטומטית והצגת כפתור במקום ---
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
            // יצירת האתר הפנימי (iframe) כרגיל לאתרים שהם לא קובץ להורדה
            const iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.style.backgroundColor = '#ffffff';
            previewBox.appendChild(iframe);
        }

        document.body.appendChild(previewBox);
    }
});

// מאזין ליציאת העכבר מהקישור כדי להעלים את החלונית
document.addEventListener('mouseout', function(e) {
    if (e.target.closest('a') && previewBox) {
        // --- תיקון 1: אם המשתמש עדיין מחזיק את מקש Shift, לא נסגור את החלון! ---
        if (e.shiftKey) return; 
        
        previewBox.remove();
        previewBox = null;
    }
});

// סגירת החלונית רק כשעוזבים את מקש ה-Shift
document.addEventListener('keyup', function(e) {
    if (e.key === 'Shift' && previewBox) {
        previewBox.remove();
        previewBox = null;
    }
});
