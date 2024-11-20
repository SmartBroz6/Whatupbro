const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const qrCodeImage = new Image();
qrCodeImage.src = 'path-to-your-qr-code-image.png'; // แก้เป็น path หรือ URL ที่ถูกต้องของ QR Code

// โหลดฟอนต์ Prompt
function loadFonts() {
    return new Promise((resolve, reject) => {
        const font = new FontFace('Prompt', 'url(/assets/fonts/prompt.woff)');
        font.load()
            .then(loadedFont => {
                document.fonts.add(loadedFont);
                resolve();
            })
            .catch(reject);
    });
}

// ฟังก์ชันวาดข้อความพร้อมจัดรูปแบบ
function drawText(ctx, text, x, y, maxWidth, lineHeight, align = 'left') {
    ctx.textAlign = align;
    const lines = text.split('<br>');
    lines.forEach((line, index) => {
        const posY = y + (index * lineHeight);
        ctx.fillText(line, x, posY, maxWidth);
    });
}

// ฟังก์ชันวาดแบตเตอรี่
function drawBattery(ctx, x, y, width, height, charge) {
    // กรอบแบตเตอรี่
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // เติมสีแบตเตอรี่
    const batteryLevelWidth = Math.max(0, (width - 2) * (charge / 100));
    ctx.fillStyle = charge > 20 ? 'green' : 'red'; // สีเขียวเมื่อแบตเหลือมากกว่า 20% สีแดงเมื่อเหลือน้อยกว่า
    ctx.fillRect(x + 1, y + 1, batteryLevelWidth, height - 2);
}

// ฟังก์ชันอัปเดตหน้าจอหลัก
function updateDisplay() {
    const width = canvas.width;
    const height = canvas.height;

    // เคลียร์หน้าจอ
    ctx.clearRect(0, 0, width, height);

    // ตั้งค่าฟอนต์และสี
    ctx.font = '18px Prompt';
    ctx.fillStyle = 'black';

    // ข้อมูลตัวอย่าง
    const date = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
    const text = 'ตัวอย่างข้อความยาวๆ<br>และมีหลายบรรทัด<br>จัดข้อความให้อยู่ตรงกลาง';
    const batteryCharge = 75; // เปอร์เซ็นต์แบตเตอรี่

    // วาดข้อความ
    drawText(ctx, text, width / 2, 50, width - 40, 25, 'center');

    // วาดวันที่
    ctx.textAlign = 'left';
    ctx.fillText(`วันที่: ${date}`, 20, 30);

    // วาดแบตเตอรี่
    drawBattery(ctx, width - 120, 10, 100, 20, batteryCharge);

    // วาด QR Code
    const qrSize = 150;
    ctx.drawImage(qrCodeImage, (width - qrSize) / 2, height - qrSize - 20, qrSize, qrSize);
}

// โหลดฟอนต์และเริ่มการแสดงผล
loadFonts()
    .then(() => {
        qrCodeImage.onload = updateDisplay; // รอให้ QR Code โหลดสำเร็จ
    })
    .catch(error => {
        console.error('Error loading fonts:', error);
        updateDisplay(); // ถ้าฟอนต์โหลดไม่สำเร็จ จะยังคงแสดงผลด้วยฟอนต์สำรอง
    });
