let previewBox = null;

// מאזין לתנועת העכבר
document.addEventListener('mouseover', function(e) {
    // בודק אם העכבר על קישור (תגית A) ואם המשתמש מחזיק את מקש Shift
    if (e.target.closest('a') && e.shiftKey) {
        const link = e.target.closest('a');
        const url = link.href;
        
        // מוודא שזה קישור אמיתי ולא פקודת רשת
        if (!url.startsWith('http')) return;

        // אם כבר יש חלונית פתוחה, נסגור אותה קודם
        if (previewBox) {
            previewBox.remove();
        }

        // יצירת חלונית התצוגה המקדימה
        previewBox = document.createElement('div');
        previewBox.style.position = 'fixed';
        previewBox.style.bottom = '20px';
        previewBox.style.left = '20px'; // ממוקם בצד שמאל למטה כדי לא להסתיר את מרכז המסך
        previewBox.style.width = '450px';
        previewBox.style.height = '350px';
        previewBox.style.border = '1px solid #ccc';
        previewBox.style.borderRadius = '10px';
        previewBox.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
        previewBox.style.backgroundColor = '#fff';
        previewBox.style.zIndex = '999999';
        previewBox.style.overflow = 'hidden';

        // יצירת האתר הפנימי (iframe)
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.backgroundColor = '#ffffff';

        // הוספת האתר לחלונית, ואת החלונית לעמוד
        previewBox.appendChild(iframe);
        document.body.appendChild(previewBox);
    }
});

// מאזין ליציאת העכבר מהקישור כדי להעלים את החלונית
document.addEventListener('mouseout', function(e) {
    if (e.target.closest('a') && previewBox) {
        previewBox.remove();
        previewBox = null;
    }
});

// סגירת החלונית גם כשעוזבים את מקש ה-Shift
document.addEventListener('keyup', function(e) {
    if (e.key === 'Shift' && previewBox) {
        previewBox.remove();
        previewBox = null;
    }
});
