# Flashcard English Vocabulary App 📚

[Türkçe](#türkçe) | [English](#english)

---

## Türkçe

### Projenin Amacı
Bu proje, İngilizce kelime dağarcığını geliştirmek isteyenler için tasarlanmış modern, şık ve kullanımı kolay bir flashcard (kelime kartı) uygulamasıdır. Kullanıcılar İngilizce kelimelerin Türkçe anlamlarını öğrenirken, seviyelerine (A1, A2, B1, B2, C1, C2) göre kelime çalışması yapabilir. Kullanıcı, ezberleyemediği veya bilmediği kelimeleri işaretleyerek bu kelimeleri ayrı bir listede toplayıp üzerine odaklanabilir.

### Sayfalar ve İşlevleri
1. **Ana Sayfa (Flashcard Ekranı - `/`):** Kelimeleri interaktif bir kart yapısında gösterir. Kartın üzerine tıklandığında dönme (flip) animasyonuyla arka yüzdeki Türkçe anlam ortaya çıkar. Kullanıcılar burada bilmedikleri kelimeleri "Mark as Unknown" butonuyla kaydedebilirler.
2. **All Words (`/levels`):** Projede yer alan tüm kelimeleri seviyelerine göre gruplayarak tablo halinde listeler. Kullanıcılar bu sayfadan kelimeleri incelerken tek tıkla "Bilinmeyenlere Ekle/Çıkar" işlemi yapabilir.
3. **Unknown Words (`/unknown`):** Kullanıcının özellikle "bilmiyorum" diye işaretlediği kelimeleri gösterir. Kelimeler seviyelere göre gruplandırılmıştır. Kullanıcı bir kelimeyi öğrendiğinde, onu bu listeden silebilir.
4. **PDF Çıktı Sayfaları (`/pdf`, `/pdf/all-words`, `/pdf/unknown`):** Kullanıcının kelimeleri fiziksel kağıda basmak istemesi durumunda, mürekkep tasarrufu (beyaz arkaplan, siyah metin, kompakt tablo yapısı) sağlayan özel yazıcı dostu (print-friendly) sayfalardır.

### Bilinmeyen Kelimeleri (Unknown Words) Sıfırlama
Kelime çalışmasını baştan almak veya bilmediğiniz kelimeleri sıfırlamak isterseniz, en temiz ve önerilen yöntem **yeni bir Git branch'i (dalı)** açmaktır. Yeni bir branch açarak eski ilerlemenizi (hangi kelimeleri işaretlediğinizi) diğer dalda güvende tutabilir, yeni branch üzerinde `unknown_words.json` dosyasını sıfırlayarak yepyeni bir çalışma süreci başlatabilirsiniz.

---

## English

### Project Purpose
This project is a modern, elegant, and user-friendly flashcard application designed for users who want to improve their English vocabulary. Users can study English words with their Turkish meanings, categorized by CEFR levels (A1, A2, B1, B2, C1, C2). By marking words they don't know, users can build a personalized "Unknown Words" list to focus their studying efforts effectively.

### Pages & Features
1. **Home Page (Flashcard Screen - `/`):** Displays vocabulary in an interactive flashcard format. Clicking the card triggers a 3D flip animation to reveal the Turkish meaning on the back. Users can mark words as "Unknown" directly from here.
2. **All Words (`/levels`):** Displays a comprehensive table of all words available in the app, grouped by their difficulty levels. Users can easily toggle words as known or unknown from this list.
3. **Unknown Words (`/unknown`):** Shows only the words the user has explicitly marked as "unknown". The words are grouped by level. Once a user learns a word, they can easily remove it from this list.
4. **PDF Print Views (`/pdf`, `/pdf/all-words`, `/pdf/unknown`):** Specialized, printer-friendly pages designed to save ink. They provide a clean, compact, black-and-white layout ideal for printing vocabulary lists onto physical paper.

### Resetting Unknown Words
If you want to start your vocabulary training over and reset the words you've marked as unknown, the recommended approach is to create a **new Git branch**. By creating a new branch, you preserve your historical progress in the old branch while giving yourself a clean slate. Once in the new branch, you can simply clear the contents of your `unknown_words.json` file to begin from scratch.
