# Eval sonuçları — v3-prompt2-flash-3.6

Model: `gemini-3.6-flash` · temperature 0 · tek çalıştırma

İki eşleşme ölçütü:
- **Katı:** aynı kategori ve alıntıların metindeki konumu örtüşüyor.
- **Hüküm:** aynı kategori ve alıntılar aynı paragrafta (aynı hükmün farklı cümlesi de sayılır).

Doğrulanamayan (metinde bulunamayan) iddialar rapora girmediği için yanlış alarm sayılmaz, ayrı sütunda gösterilir.

| Belge | Altın | Katı yakalanan | Katı kaçırılan | Katı yanlış alarm | Hüküm yakalanan | Hüküm kaçırılan | Hüküm yanlış alarm | Doğrulanamayan | Skor | Belirsiz |
|---|---|---|---|---|---|---|---|---|---|---|
| Spotify Kullanım Şartları (TR) | 18 | 6 | 12 | 3 | 8 | 10 | 1 | 0 | 100 | hayır |
| YouTube Hizmet Şartları (TR) | 8 | 5 | 3 | 0 | 5 | 3 | 0 | 0 | 85 | hayır |
| Amazon.com.tr Kullanım ve Satış Koşulları (TR) | 12 | 4 | 8 | 1 | 5 | 7 | 0 | 0 | 63 | hayır |
| Disney Gizlilik Politikası (TR) | 12 | 2 | 10 | 2 | 2 | 10 | 2 | 0 | 43 | hayır |
| Duolingo Terms and Conditions (EN) | 18 | 8 | 10 | 0 | 8 | 10 | 0 | 0 | 100 | hayır |

**Katı:** yakalanan 25, kaçırılan 43, yanlış alarm 6 · precision 81% · recall 37%

**Hüküm:** yakalanan 28, kaçırılan 40, yanlış alarm 3 · precision 90% · recall 41%

**Doğrulanamayan iddia:** 0 / 31 (0%); bunlar rapora girmedi.

## Spotify Kullanım Şartları (TR)

Kaynak: https://www.spotify.com/tr-tr/legal/end-user-agreement/ (alındı: 2026-10-11)

**Kaçırılan (hüküm ölçütü):**
- [refund_cancel] "Avantajlı Kullanım sona ermeden önce Ücretli Abonelik'i iptal etmezseniz cayma hakkınızı kaybedersiniz"
- [refund_cancel] "halihazırda yapmış olduğunuz ödemeleri iade etmeyeceğini kabul edersiniz"
- [unilateral_change] "Bu Şartlar'da yapılacak herhangi bir değişiklik sonrasında Spotify Hizmeti'ni kullanmanız, bu değişiklikleri kabul ettiğiniz anlamına gelir."
- [unilateral_change] "Spotify Hizmeti'nin tamamını veya bir kısmını değiştirebilir, askıya alabilir ya da (belirli işlevler, özellikler, abonelik planları ve promosyon teklifleri dahil) sağlamayı durdurabiliriz"
- [account_termination] "Ücretli Aboneliği en az 14 gün önceden size bildirerek herhangi bir zamanda sonlandırma hakkını saklı tutarız"
- [data_sharing] "size reklam ve diğer bilgileri sunmamıza ve Spotify Gizlilik Politikası uyarınca izin verildiği üzere iş ortaklarımızın da aynısını yapmasına izin vermek"
- [liability_limit] "(a) Spotify'a ilk iddiadan önceki on iki ay içinde ödemiş olduğunuz tutar veya (b) 30,00 $ arasında hangisi daha yüksekse ilgili tutardaki toplam yükümlülük"
- [liability_limit] "hiçbir türde açık, zımni veya yasal garanti olmaksızın sunulmaktadır"
- [arbitration_waiver] "zorunlu bağlayıcı bireysel tahkim ile çözümleneceğini"
- [arbitration_waiver] "BİR (1) YIL içinde bir talep gönderilerek başlatılmalıdır"

**Yanlış alarm (hüküm ölçütü):**
- [unilateral_change] "Spotify ya da ilgili sahipler belirli şarkılara, videolara, podcast'lere, sesli kitaplara ve diğer İçerikler'e erişimi önceden bildirimde bulunmaksızın kaldırabilir."

## YouTube Hizmet Şartları (TR)

Kaynak: https://www.youtube.com/t/terms?hl=tr (alındı: 2026-10-11)

**Kaçırılan (hüküm ölçütü):**
- [content_license] "YouTube'a Hizmetteki İçeriklerinizden para kazanma hakkı sunarsınız"
- [unilateral_change] "Yeni şartları kabul etmiyorsanız yüklediğiniz tüm İçerikleri kaldırmanız ve Hizmet'i kullanmayı bırakmanız gerekir."
- [liability_limit] "Geçerli yasaların izin verdiği ölçüde, YouTube ve İş Ortakları şunlardan sorumlu olmayacaktır"

## Amazon.com.tr Kullanım ve Satış Koşulları (TR)

Kaynak: https://www.amazon.com.tr/gp/help/customer/display.html?nodeId=GLSBYFE9MGKKQXXM (alındı: 2026-10-11)

**Kaçırılan (hüküm ölçütü):**
- [account_termination] "Amazon hesabınızı kapatabilir veya Amazon Hizmetleri’ne erişiminizi ve bu hizmetlerini kullanımınızı kısıtlayabiliriz"
- [account_termination] "herhangi bir Amazon Yazılımı'nı kullanma hakkınızı herhangi bir zamanda önceden bildirimde bulunmaksızın feshedebiliriz"
- [liability_limit] "Amazon ve iştirakleri (i) kendisinin ihlaline bağlı olmaksızın ortaya çıkan zararlardan"
- [liability_limit] "Amazon, tüm bunların veya diğer herhangi bir üçüncü tarafın eylemleri, ürünleri ve içerikleri için herhangi bir sorumluluk veya yükümlülük üstlenmemektedir"
- [unilateral_change] "web sitesinde yaptığımız değişiklikleri yansıtmak için herhangi bir zamanda değiştirme hakkını saklı tutarız"
- [refund_cancel] "ilk satın almanız ile ilgili teslimat masraflarını iade etmeyeceğiz. Benzer bir şekilde, nakliye riski ve iade masrafları da size aittir"
- [refund_cancel] "Aşağıdakilere ilişkin sözleşmelerde iptal hakkı bulunmamaktadır veya zaman aşımına uğramaktadır"

## Disney Gizlilik Politikası (TR)

Kaynak: https://www.disneyplus.com/tr-tr/legal/ (alındı: 2026-10-11)

**Kaçırılan (hüküm ölçütü):**
- [data_sharing] "Sitelerimiz ve uygulamalarımızdaki ve üçüncü taraf siteler ve uygulamalardaki etkinliğiniz temelinde size hedefe yönelik reklamlar sağlamak"
- [data_sharing] "kendi adlarına kullanım için (veri denetleyicileri olarak) bilgilerinize erişim sağlayabilir"
- [data_sharing] "Hulu hizmetini sunmaya yardımcı olan iş ortaklarıyla bilgi paylaşabilir"
- [data_sharing] "Bir faaliyetin satışıyla bağlantılı olarak"
- [data_sharing] "tüm dünyada farklı yerlerde bulunan Walt Disney Şirketleri’ne bağlı bağımsız şirketlere veya üçüncü taraflara aktarabiliriz"
- [data_sharing] "diğer şirketin almış olduğu bilgilerin artık bu şirketin denetiminde olduğunu ve onun gizlilik uygulamalarına tabi hale geldiğini"
- [data_sharing] "oturum açmış veya kaydolmuş olup olmamanız fark etmeksizin tanımlama bilgileri, Flash tanımlama bilgileri, pikseller, etiketler"
- [data_sharing] "IP adreslerini kişisel bilgilerle birleştirebiliriz"
- [data_sharing] "herhangi bir sınırlama olmaksızın herkese açık bir şekilde yayınlanabilir veya bir başka şekilde açıklanabilir"
- [liability_limit] "hiçbir güvenlik önleminin mükemmel olmadığını veya her türlü korumayı sağlamadığını"

**Yanlış alarm (hüküm ölçütü):**
- [liability_limit] "sitelerimizde ve uygulamalarımızda bizim kontrolümüzde olmayan diğer sitelere bağlantılar olabileceğini ve bu sitelerin gizlilik uygulamalarından sorumlu olmadığımızı da unutmayın."
- [data_sharing] "National Geographic Partners bu bilgileri National Geographic Society ile paylaşabilir ve paylaşıldıktan sonra bu bilgiler National Geographic Society’nin denetiminde olur"

## Duolingo Terms and Conditions (EN)

Kaynak: https://www.duolingo.com/terms (alındı: 2026-10-11)

**Kaçırılan (hüküm ölçütü):**
- [unilateral_change] "Any revisions to these Terms and Conditions will become effective the earlier of (i) the end of such 7-day period or (ii) the first time you access or use the Service after such changes."
- [unilateral_change] "Duolingo may manage, regulate, control, modify, or eliminate Virtual Items at any time, with or without notice."
- [unilateral_change] "Duolingo may revise the pricing for the goods and services offered through the Service at any time."
- [content_license] "you hereby assign to Duolingo any and all rights, title, and interest, including any intellectual property rights or proprietary rights, in the Activity Materials"
- [auto_renewal] "you will automatically become a recurring subscriber to the subscription plan you selected after your extended free trial ends"
- [liability_limit] "ARE PROVIDED TO YOU ON AN “AS IS” BASIS"
- [liability_limit] "or any claim that any translation we provide to you is inaccurate, inappropriate or defective in any way whatsoever"
- [arbitration_waiver] "There shall be no class or collective arbitration, or joinder of claims"
- [arbitration_waiver] "regardless of your country of origin or where you access the Service"
- [data_sharing] "Duolingo and its third party providers and partners may place such advertising in connection with the display of content or information submitted by you or others"
