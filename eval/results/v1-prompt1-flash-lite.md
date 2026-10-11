# Eval sonuçları — v1-prompt1-flash-lite

Model: `gemini-3.5-flash-lite` · temperature 0 · tek çalıştırma

İki eşleşme ölçütü:
- **Katı:** aynı kategori ve alıntıların metindeki konumu örtüşüyor.
- **Hüküm:** aynı kategori ve alıntılar aynı paragrafta (aynı hükmün farklı cümlesi de sayılır).

Doğrulanamayan (metinde bulunamayan) iddialar rapora girmediği için yanlış alarm sayılmaz, ayrı sütunda gösterilir.

| Belge | Altın | Katı: yakalanan / kaçırılan / yanlış alarm | Hüküm: yakalanan / kaçırılan / yanlış alarm | Doğrulanamayan | Skor | Belirsiz |
|---|---|---|---|---|---|---|
| Spotify Kullanım Şartları (TR) | 18 | 4 | 14 | 1 | 5 | 13 | 0 | 1 | 100 | hayır |
| YouTube Hizmet Şartları (TR) | 8 | 4 | 4 | 1 | 3 | 5 | 2 | 0 | 83 | hayır |
| Amazon.com.tr Kullanım ve Satış Koşulları (TR) | 12 | 3 | 9 | 0 | 3 | 9 | 0 | 1 | 45 | hayır |
| Disney Gizlilik Politikası (TR) | 12 | 1 | 11 | 1 | 1 | 11 | 1 | 0 | 33 | hayır |
| Duolingo Terms and Conditions (EN) | 18 | 5 | 13 | 1 | 6 | 12 | 0 | 1 | 100 | hayır |

**Katı:** yakalanan 17, kaçırılan 51, yanlış alarm 4 · precision 81% · recall 25%

**Hüküm:** yakalanan 18, kaçırılan 50, yanlış alarm 3 · precision 86% · recall 26%

**Doğrulanamayan iddia:** 3 / 24 (13%); bunlar rapora girmedi.

## Spotify Kullanım Şartları (TR)

Kaynak: https://www.spotify.com/tr-tr/legal/end-user-agreement/ (alındı: 2026-10-11)

**Kaçırılan (hüküm ölçütü):**
- [refund_cancel] "Bu Şartlar'da aksi belirtilmediği sürece kısmi üyelik dönemleri için iade veya kredi sunmayız."
- [refund_cancel] "Avantajlı Kullanım sona ermeden önce Ücretli Abonelik'i iptal etmezseniz cayma hakkınızı kaybedersiniz"
- [refund_cancel] "Satın alma işleminizin hemen sonrasında tarafınıza hizmeti sağlayacağımızı, cayma hakkınızı kaybedeceğinizi"
- [refund_cancel] "halihazırda yapmış olduğunuz ödemeleri iade etmeyeceğini kabul edersiniz"
- [unilateral_change] "Bu Şartlar'da yapılacak herhangi bir değişiklik sonrasında Spotify Hizmeti'ni kullanmanız, bu değişiklikleri kabul ettiğiniz anlamına gelir."
- [unilateral_change] "Spotify Hizmeti'nin tamamını veya bir kısmını değiştirebilir, askıya alabilir ya da (belirli işlevler, özellikler, abonelik planları ve promosyon teklifleri dahil) sağlamayı durdurabiliriz"
- [account_termination] "Spotify, herhangi bir zamanda bu Şartlar'ı (buraya dahil edilen ek Spotify şartları ve koşulları dahil) feshedebilir ya da Spotify Hizmeti'ne erişiminizi askıya alabilir."
- [account_termination] "Ücretli Aboneliği en az 14 gün önceden size bildirerek herhangi bir zamanda sonlandırma hakkını saklı tutarız"
- [data_sharing] "size reklam ve diğer bilgileri sunmamıza ve Spotify Gizlilik Politikası uyarınca izin verildiği üzere iş ortaklarımızın da aynısını yapmasına izin vermek"
- [liability_limit] "tek ve münhasır çözüm yolunuzun tüm Spotify yazılımını kaldırmak ve Spotify Hizmeti'ni kullanmayı durdurmak olduğunu kabul edersiniz"
- [liability_limit] "hiçbir türde açık, zımni veya yasal garanti olmaksızın sunulmaktadır"
- [arbitration_waiver] "zorunlu bağlayıcı bireysel tahkim ile çözümleneceğini"
- [arbitration_waiver] "BİR (1) YIL içinde bir talep gönderilerek başlatılmalıdır"

**Doğrulanamayan (rapora girmedi):**
- [account_termination] "Bu Şartlar'ı ihlal ettiğinizi düşünürsek, tarafınıza makul bir süre öncesinde bildirimde bulunarak Spotify Hizmeti'ni ya da herhangi bir önemli bileşenini tarafınıza sağlamayı durdurursak veya geçerli kanunlara uyum amacıyla bunun gerekli olduğunu düşündüğümüz durumlarda Spotify, herhangi bir zamanda bu Şartlar'ı ... feshedebilir ya da Spotify Hizmeti'ne erişiminizi askıya alabilir."

## YouTube Hizmet Şartları (TR)

Kaynak: https://www.youtube.com/t/terms?hl=tr (alındı: 2026-10-11)

**Kaçırılan (hüküm ölçütü):**
- [content_license] "YouTube'a Hizmetteki İçeriklerinizden para kazanma hakkı sunarsınız"
- [unilateral_change] "özellik ve işlev ekleme veya kaldırma, yeni dijital içerikler veya hizmetler sunma ya da eskilerini kullanımdan kaldırma gibi (Hizmet'in tamamında veya bir kısmında geçerli olacak) değişiklikler yapabiliriz"
- [unilateral_change] "Yeni şartları kabul etmiyorsanız yüklediğiniz tüm İçerikleri kaldırmanız ve Hizmet'i kullanmayı bırakmanız gerekir."
- [liability_limit] "YouTube Hizmet'e dair belirli hiçbir vaatte bulunmamaktadır"
- [liability_limit] "Geçerli yasaların izin verdiği ölçüde, YouTube ve İş Ortakları şunlardan sorumlu olmayacaktır"

**Yanlış alarm (hüküm ölçütü):**
- [unilateral_change] "Bu Sözleşme'yi, örneğin (1) Hizmet'teki veya çalışma şeklimizdeki değişiklikleri (yeni ürünler veya özellikler eklememiz ya da eskilerini kaldırmamız gibi) yansıtmak amacıyla, (2) yasal, mevzuata ilişkin ya da güvenlikle ilgili nedenlerden dolayı veya (3) kötüye kullanımı ya da zararı önlemek amacıyla değiştirebiliriz."
- [liability_limit] "Geçerli yasaların izin verdiği ölçüde, YouTube ve İş Ortakları şunlardan sorumlu olmayacaktır: YouTube'un ya da İş Ortaklarının bu Sözleşme'yi ihlal etmesinden kaynaklanmayan kayıplar"

## Amazon.com.tr Kullanım ve Satış Koşulları (TR)

Kaynak: https://www.amazon.com.tr/gp/help/customer/display.html?nodeId=GLSBYFE9MGKKQXXM (alındı: 2026-10-11)

**Kaçırılan (hüküm ölçütü):**
- [content_license] "söz konusu içeriği dünya çapında kullanmak, çoğaltmak, yayınlamak, görüntülemek, tercüme etmek ve adapte etmek (bu lisansları üçüncü kişilere alt lisanslama hakkı da dahil) için münhasır olmayan, telifsiz hak veriyor olacaksınız"
- [account_termination] "yasal nedenlerle size önceden bildirim yapmayabiliriz"
- [account_termination] "herhangi bir Amazon Yazılımı'nı kullanma hakkınızı herhangi bir zamanda önceden bildirimde bulunmaksızın feshedebiliriz"
- [data_sharing] "işlemler ile ilgili bilgilerinizi söz konusu taraf ile paylaşabiliriz"
- [liability_limit] "Amazon ve iştirakleri (i) kendisinin ihlaline bağlı olmaksızın ortaya çıkan zararlardan"
- [liability_limit] "Amazon, tüm bunların veya diğer herhangi bir üçüncü tarafın eylemleri, ürünleri ve içerikleri için herhangi bir sorumluluk veya yükümlülük üstlenmemektedir"
- [unilateral_change] "bu Satış Koşulları’nda herhangi bir zamanda değişiklik yapma hakkını saklı tutarız"
- [refund_cancel] "ilk satın almanız ile ilgili teslimat masraflarını iade etmeyeceğiz. Benzer bir şekilde, nakliye riski ve iade masrafları da size aittir"
- [refund_cancel] "Aşağıdakilere ilişkin sözleşmelerde iptal hakkı bulunmamaktadır veya zaman aşımına uğramaktadır"

**Doğrulanamayan (rapora girmedi):**
- [content_license] "müşteri incelemeleri, yorumları, müşteri soruları veya cevapları yayınlamanız veya internet sitesinde gösterilmesi için herhangi bir içerik üretmeniz durumunda: (a) Amazon'a, söz konusu içeriği dünya çapında kullanmak, çoğaltmak, yayınlamak, görüntülemek, tercüme etmek ve adapte etmek [...] için münhasır olmayan, telifsiz hak veriyor olacaksınız"

## Disney Gizlilik Politikası (TR)

Kaynak: https://www.disneyplus.com/tr-tr/legal/ (alındı: 2026-10-11)

**Kaçırılan (hüküm ölçütü):**
- [data_sharing] "belirli tanımlayıcılar veya karma e-posta adresi gibi sizinle ilgili sınırlı kişisel bilgileri üçüncü taraflarla paylaşabiliriz"
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
- [data_sharing] "Bu şirketlerin ürün ve hizmetleri hakkında size teklif ve promosyonlar gönderebilmesi için kişisel bilgilerinizi dikkatlice seçilmiş şirketlerle paylaşmayı tercih ederek kişisel verilerinizi başka bir şirketle paylaşmamıza izin verdiğinizde;"

## Duolingo Terms and Conditions (EN)

Kaynak: https://www.duolingo.com/terms (alındı: 2026-10-11)

**Kaçırılan (hüküm ölçütü):**
- [unilateral_change] "Duolingo may, in its sole discretion and at any time, update, change, suspend, make improvements to or discontinue any aspect of the Service"
- [unilateral_change] "Duolingo may manage, regulate, control, modify, or eliminate Virtual Items at any time, with or without notice."
- [unilateral_change] "Duolingo may revise the pricing for the goods and services offered through the Service at any time."
- [content_license] "you hereby assign to Duolingo any and all rights, title, and interest, including any intellectual property rights or proprietary rights, in the Activity Materials"
- [auto_renewal] "you will automatically become a recurring subscriber to the subscription plan you selected after your extended free trial ends"
- [liability_limit] "IS LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO DUOLINGO FOR THE SERVICE IN THE 12 MONTHS PRIOR TO THE INITIAL ACTION GIVING RISE TO LIABILITY"
- [liability_limit] "ARE PROVIDED TO YOU ON AN “AS IS” BASIS"
- [liability_limit] "or any claim that any translation we provide to you is inaccurate, inappropriate or defective in any way whatsoever"
- [arbitration_waiver] "There shall be no class or collective arbitration, or joinder of claims"
- [arbitration_waiver] "regardless of your country of origin or where you access the Service"
- [data_sharing] "Duolingo may share data relating to your use of the Promotion Code with your Code Provider, including both anonymized, aggregate data, and individual usage data"
- [data_sharing] "Duolingo and its third party providers and partners may place such advertising in connection with the display of content or information submitted by you or others"

**Doğrulanamayan (rapora girmedi):**
- [liability_limit] "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL DUOLINGO BE LIABLE TO YOU OR ANY THIRD PARTY... FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES"
