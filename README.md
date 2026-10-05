# نمونه‌کار شخصی جنگو — سایت سه‌بعدی

سایت شخصی با فریم‌ورک **Django**، تم تیره شیشه‌ای (Glassmorphism)، راست‌چین و فارسی،
با پس‌زمینه سه‌بعدی تعاملی (Three.js).

## نصب و اجرا (ویندوز)

```bat
cd django-portfolio
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata initial_data
python manage.py createsuperuser
python manage.py runserver
```

بعد مرورگر را باز کن: http://127.0.0.1:8000/

## نصب و اجرا (لینوکس / مک)

```bash
cd django-portfolio
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata initial_data
python manage.py createsuperuser
python manage.py runserver
```

## بخش‌های سایت

| آدرس | توضیح |
|---|---|
| `/` | صفحه اصلی: هیرو سه‌بعدی + مهارت‌ها + پروژه‌های منتخب |
| `/projects/` | لیست همه پروژه‌ها |
| `/projects/<id>/` | جزئیات هر پروژه |
| `/contact/` | فرم تماس (پیام‌ها در دیتابیس ذخیره می‌شن) |
| `/admin/` | پنل مدیریت جنگو |

## شخصی‌سازی

- مهارت‌ها و پروژه‌ها را از پنل ادمین (`/admin/`) اضافه/ویرایش کن،
  یا فایل `portfolio/fixtures/initial_data.json` را عوض کن و دوباره `loaddata` بزن.
- نام و متن‌ها داخل `templates/` هستن.
- صحنه سه‌بعدی داخل `static/js/main.js` — شکل، رنگ و سرعت را عوض کن.

## دیپلوی رایگان روی Render + دامنه habibullahrahimi.com

> اگه Railway داری و trialش تموم شده، Render بهترین جایگزین رایگانه:
> پلن Free (بدون کارت بانکی)، دامنه اختصاصی رایگان، HTTPS خودکار.
> نکته: پلن رایگان بعد از ۱۵ دقیقه بدون بازدید می‌خوابه و بازدید بعدی ~۳۰ ثانیه طول می‌کشه تا بیدار بشه.

### ۱) پوش به گیت‌هاب (مثل قبل)
```bat
git add .
git commit -m "render deploy"
git push
```

### ۲) ساخت سرویس در Render
1. برو به [render.com](https://render.com) و با گیت‌هاب ثبت‌نام/لاگین کن
2. Dashboard → **New +** → **Web Service** → ریپوی `django-portfolio` را انتخاب کن (اگه نیست روی Connect GitHub بزن)
3. این‌ها را وارد کن (یا اگه از Blueprint استفاده می‌کنی خودکار پر می‌شن):
   - **Name:** `django-portfolio`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt && python manage.py collectstatic --noinput`
   - **Start Command:** `python manage.py migrate && gunicorn config.wsgi --log-file -`
   - **Instance Type:** Free
4. توی **Environment Variables** این‌ها را اضافه کن (بعضی‌ها از render.yaml خودکار میان):
   - `DJANGO_SECRET_KEY` = یه رشته تصادفی طولانی (یا Generate)
   - `DJANGO_DEBUG` = `False`
   - `DJANGO_ALLOWED_HOSTS` = `.onrender.com,habibullahrahimi.com,www.habibullahrahimi.com`
5. **Create Web Service** را بزن و ۳-۵ دقیقه صبر کن تا Live بشه

### ۳) دیتای اولیه (یک‌بار)
توی داشبورد سرویس → **Shell** (سمت چپ) و این‌ها را بزن:
```
python manage.py loaddata initial_data
python manage.py createsuperuser
```

### ۴) وصل کردن دامنه
1. توی سرویس → **Settings** → **Custom Domains** → **Add Custom Domain** → `habibullahrahimi.com` را وارد کن
2. Render بهت می‌گه چه رکورد DNS بسازی (یه CNAME به آدرس onrender) — اون را توی پنل DNS دامنه‌ات اضافه کن
3. چند دقیقه تا چند ساعت صبر کن تا DNS ست بشه؛ بعد سایتت روی دامنه خودته! 🎉

> نکته دیتابیس: روی پلن رایگان دیسک ماندگار نیست؛ با هر دیپلوی جدید دیتابیس SQLite ریست می‌شه
> (پیام‌های فرم تماس پاک می‌شن). برای شروع اشکالی نداره؛ بعداً می‌تونی Postgres رایگان Render را اضافه کنی.
