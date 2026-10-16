// Tüm diller için ortak içerik tipleri.
export type Line = { code: string; note: string }
export type Item = {
  name: string // Neyi anlattığı, kısa ad
  syntax: string // Ana listede gösterilen yapı (örnek değer yok)
  note: string // Kısa açıklama, tek cümle
  desc: string // Ne olduğu
  basit?: string // Hiç bilmeyen için benzetmeli, jargonsuz anlatım (sağ panelde "Basitçe" kutusu)
  when?: string // Ne zaman kullanılır
  examples: string[][] // Gerçek örnekler, her biri satır listesi
  parts?: Line[] // Kod parçalarının anlamı
  tips?: string[] // Kısa notlar
  warning?: string // Sık yapılan hata
  links?: { name: string; url: string; info: string }[] // Program adı, indirme bağlantısı, kurulum bilgisi
  quiz?: { q: string; o: string[]; a: number } // Pratik sorusu, seçenekler, doğru seçeneğin sırası
}
export type Intro = { what: string; why: string; where: string }
export type Topic = { id: string; title: string; intro: Intro; items: Item[] }
export type Language = {
  id: string // Adres ve renklendirme anahtarı: csharp, python
  title: string // Üst sekmede görünen ad
  comment: string // Dilin yorum işareti, listede açıklamanın önüne gelir: // veya #
  commentEnd?: string // Kapanış gerektiren yorumlar için: --> veya */
  hl?: string // Renklendirme anahtarı; verilmezse id kullanılır (SQL lehçeleri 'sql' paylaşır)
  group?: { id: string; title: string } // Üst sekmede açılır menü altında toplanan diller (SQL lehçeleri)
  giris: { q: string; a: string }[] // Dil giriş sayfası soru-cevapları
  topics: Topic[]
}
