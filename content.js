let previewBox = null;
let hoveredLink = null; // ה"זיכרון" שלנו ששומר את הקישור שעליו העכבר נמצא כרגע

// פונקציה שמזהה קישורי הורדה
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

// פונקציה מרכזית שפותחת את חלון התצוגה המקדימה
function showPreview(link) {
    let url = link.href;
    
    if (!url.startsWith('http')) return;

    if (url.includes('wikipedia.org/wiki/')) {
        url = url.replace(/https?:\/\/([a-z0-9\-]+)\.wikipedia\.org\/wiki\//i, 'https://www.hamichlol.org.il/');
    }

    if (previewBox) {
        previewBox.remove();
    }

    // יצירת חלונית התצוגה במצב נייד לגלילה מושלמת
    previewBox = document.createElement('div');
    previewBox.style.position = 'fixed';
    previewBox.style.bottom = '30px';
    previewBox.style.left = '30px'; 
    previewBox.style.width = '430px';  
    previewBox.style.height = '620px'; 
    previewBox.style.border = '1px solid #ccc';
    previewBox.style.borderRadius = '14px';
    previewBox.style.boxShadow = '0 12px 35px rgba(0,0,0,0.3)';
    previewBox.style.backgroundColor = '#fff';
    previewBox.style.zIndex = '999999';
    previewBox.style.overflow = 'hidden'; 
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

// 1. מאזין לכניסת עכבר: שומר את הקישור בזיכרון, ופותח חלונית אם ה-Shift כבר לחוץ
document.addEventListener('mouseover', function(e) {
    const link = e.target.closest('a');
    if (link) {
        hoveredLink = link;
        if (e.shiftKey) {
            showPreview(link);
        }
    }
});

// 2. מאזין ליציאת עכבר: מוחק מהזיכרון, ומעלים את החלונית אם לא מחזיקים Shift
document.addEventListener('mouseout', function(e) {
    if (e.target.closest('a')) {
        hoveredLink = null;
        if (e.shiftKey && previewBox) return; 
        if (previewBox) {
            previewBox.remove();
            previewBox = null;
        }
    }
});

// 3. מאזין ללחיצה על מקלדת: אם לחצו Shift *בזמן* שהעכבר על הקישור, נפתח את החלון!
document.addEventListener('keydown', function(e) {
    if (e.key === 'Shift' && hoveredLink && !previewBox) {
        showPreview(hoveredLink);
    }
});

// 4. מאזין לעזיבת מקש ה-Shift: סוגר את החלונית תמיד
document.addEventListener('keyup', function(e) {
    if (e.key === 'Shift' && previewBox) {
        previewBox.remove();
        previewBox = null;
    }
});

// 5. מאזין לקליק בחוץ: סגירת חלונית
document.addEventListener('mousedown', function(e) {
    if (previewBox && !previewBox.contains(e.target)) {
        previewBox.remove();
        previewBox = null;
    }
});
