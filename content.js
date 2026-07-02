let previewWindow = null;
let lastUrl = null;

// פונקציה שמזהה האם הקישור הוא קובץ להורדה
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

// מאזין לריחופים של העכבר
document.addEventListener('mouseover', function(e) {
    if (e.target.closest('a') && e.shiftKey) {
        const link = e.target.closest('a');
        let url = link.href;
        
        if (!url.startsWith('http')) return;
        if (url === lastUrl) return; // מונע פתיחה כפולה של אותו קישור

        // הפניה מוויקיפדיה למכלול
        if (url.includes('wikipedia.org/wiki/')) {
            url = url.replace(/https?:\/\/([a-z0-9\-]+)\.wikipedia\.org\/wiki\//i, 'https://www.hamichlol.org.il/');
        }

        // אם מדובר בקובץ להורדה, לא נפתח חלון צף (כדי למנוע הורדה אוטומטית)
        if (isDownloadLink(url, link)) return;

        // אם כבר יש חלון פתוח, נסגור אותו קודם
        if (previewWindow && !previewWindow.closed) {
            previewWindow.close();
        }

        lastUrl = url;

        // הגדרת מיקום וגודל לחלון הצף (בפינה השמאלית התחתונה של המסך)
        const width = 600;
        const height = 500;
        const left = 50;
        const top = window.screen.height - height - 100;

        // פתיחת חלון דפדפן צף עצמאי ונקי ללא סרגלי כלים
        previewWindow = window.open(
            url, 
            'LinkPeekWindow', 
            `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
        );
    }
});

// מאזין לעזיבת הקישור עם העכבר
document.addEventListener('mouseout', function(e) {
    if (e.target.closest('a')) {
        // אם המשתמש עדיין מחזיק את מקש Shift, נשאיר את החלון פתוח כדי שיוכל לגלול בו
        if (e.shiftKey) return; 
        
        if (previewWindow && !previewWindow.closed) {
            previewWindow.close();
            previewWindow = null;
            lastUrl = null;
        }
    }
});

// סגירת החלון הצף מיד ברגע שעוזבים את מקש ה-Shift
document.addEventListener('keyup', function(e) {
    if (e.key === 'Shift') {
        if (previewWindow && !previewWindow.closed) {
            previewWindow.close();
            previewWindow = null;
            lastUrl = null;
        }
    }
});

// ליתר ביטחון, אם המשתמש לוחץ קליק בעמוד הראשי - נסגור את החלון הצף
document.addEventListener('mousedown', function() {
    if (previewWindow && !previewWindow.closed) {
        previewWindow.close();
        previewWindow = null;
        lastUrl = null;
    }
});
