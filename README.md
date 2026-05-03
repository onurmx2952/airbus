# Airbus-style PFD + ILS Prototype v2

Bu prototipin amacı görsel olarak profesyonel bir sim yapmak değil; doğru mimariyi çalışır şekilde kurmak:

```text
Aircraft State -> ILS Calculation -> PFD Rendering -> Mini Map
```

## Çalıştırma

En temiz yol:

```bash
python -m http.server 8000
```

Sonra tarayıcıda:

```text
http://localhost:8000
```

Doğrudan `index.html` ile de çoğu tarayıcıda çalışır.

## Ne var?

- Airbus tarzı PFD canvas
- Hız bandı
- İrtifa bandı
- Heading bandı
- Pitch / roll yapay ufuk
- Vertical speed göstergesi
- ILS localizer diamond
- ILS glideslope diamond
- ILS seçim dropdown'ı
- Basit mini-map
- Pist hattı, localizer hattı, uçak ikonu
- Debug JSON

## Ana dosyalar

```text
js/aircraft.js  -> uçak state ve hareket
js/navdata.js   -> örnek ILS kayıtları
js/ils.js       -> localizer / glideslope hesabı
js/pfd.js       -> PFD çizimi
js/map.js       -> mini-map çizimi
js/main.js      -> uygulama döngüsü
```

## Codex için hedef

Bunu geliştirirken framework ekleme. Önce bu mimariyi sağlamlaştır:

1. Gerçek navdata parser
2. earth_nav.dat / apt.dat okuma
3. Daha doğru localizer/glideslope hesapları
4. ND ekranı
5. Flap / gear / throttle state
6. Basit autopilot / approach mode
