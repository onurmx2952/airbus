# Codex Task

Bu proje önceki amatör prototipin yerine hazırlanmış daha düzgün bir başlangıçtır.

## Hedef

Uçak state verisini PFD ekranına bağlayan, ILS sapmasını hesaplayan ve mini-map ile doğrulayan çalışır bir prototipi geliştir.

## Mimariyi koru

```text
Aircraft State
  -> calculateILS()
  -> drawPFD()
  -> drawMiniMap()
```

## İstenen geliştirmeler

1. `js/navdata.js` yapısını büyüt:
   - airport
   - runway
   - ident
   - frequency
   - course
   - threshold lat/lon
   - elevation
   - glideslope

2. `js/ils.js` hesaplarını düzelt:
   - localizer angular deviation
   - glideslope angular deviation
   - DME
   - course intercept bilgisi

3. PFD geliştirme:
   - Daha okunaklı speed tape
   - Daha okunaklı altitude tape
   - FD barları opsiyonel eklensin
   - AP/LOC/G/S mode durumları state'e bağlansın

4. Mini-map geliştirme:
   - yaklaşma hattı
   - runway sembolü
   - uçak izi
   - ölçek çizgisi

5. Kesinlikle ağır framework ekleme.
6. Düşük güçlü mini PC'de akıcı çalışmalı.
7. HTML + CSS + vanilla JavaScript yeterli.

## Kullanıcının gerçek amacı

GeoFS benzeri ama daha basit bir sistem:
- harita veya 2D dünya
- uçak konumu
- navdata dosyalarından ILS/VOR bilgisi
- PFD/ND gibi cockpit ekranları
- throttle, gear, flap gibi sistem state değerleri

Bu prototip sadece ilk basamak: PFD + ILS.
