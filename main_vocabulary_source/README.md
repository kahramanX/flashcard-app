# Main Vocabulary Source

[Türkçe](#türkçe) | [English](#english)

---

## Türkçe

Bu klasör, uygulamanın kelime veritabanı için kullanılan ana kaynak olan `American_Oxford_3000.pdf` dosyasını içerir.

### Kullanım

Bu PDF dosyası, Oxford 3000 kelime listesini ve CEFR seviyelerini (A1, A2, B1, vb.) içerir. Uygulamadaki kelimelerin seviyelere ayrılması, anlamlarının bulunması ve temel veri dosyalarının (örn. `words.json`, `meanings.json`) oluşturulması tamamen bu PDF referans alınarak yapılmaktadır.

Eğer bu kaynak dosya değiştirilecekse veya yeni bir kelime listesi eklenecekse, ana dizindeki `README.md` dosyasında belirtilen adımları takip edebilir ve oradaki örnek AI prompt'unu kullanarak sistemi yeni PDF'e uyarlayabilirsiniz.

---

## English

This folder contains the `American_Oxford_3000.pdf` file, which serves as the primary source for the application's vocabulary database.

### Usage

This PDF file includes the Oxford 3000 word list along with their CEFR difficulty levels (A1, A2, B1, etc.). The categorization of words into levels, finding their meanings, and the generation of core data files (e.g., `words.json`, `meanings.json`) are all based entirely on this PDF.

If this source file is to be changed or if a new word list is to be added, you should follow the instructions provided in the main directory's `README.md` file. You can use the example AI prompt located there to adapt the system to the new PDF.
