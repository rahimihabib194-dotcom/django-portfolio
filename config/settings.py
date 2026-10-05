"""
Django settings for the personal portfolio project.

لوکال: همون‌طور که هست کار می‌کنه (SQLite + DEBUG=True).
پروداکشن (Railway): این متغیرهای محیطی را ست کن:
    DJANGO_SECRET_KEY   کلید secret تصادفی
    DJANGO_DEBUG        False
    DJANGO_ALLOWED_HOSTS  دامین‌ها با کاما جدا شده
    DATABASE_URL        (خودکار توسط Railway ست می‌شه اگه Postgres اضافه کنی)
"""

import os
from pathlib import Path

import dj_database_url

# مسیر ریشه پروژه
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "django-insecure-change-me-in-production")

DEBUG = os.environ.get("DJANGO_DEBUG", "True") == "True"

ALLOWED_HOSTS = [
    h.strip() for h in os.environ.get(
        "DJANGO_ALLOWED_HOSTS",
        ".up.railway.app,.onrender.com,habibullahrahimi.com,www.habibullahrahimi.com,127.0.0.1,localhost",
    ).split(",") if h.strip()
]

CSRF_TRUSTED_ORIGINS = [
    o.strip() for o in os.environ.get(
        "DJANGO_CSRF_TRUSTED",
        "https://*.up.railway.app,https://*.onrender.com,https://habibullahrahimi.com,https://www.habibullahrahimi.com",
    ).split(",") if o.strip()
]

# اپلیکیشن‌ها
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "portfolio",  # اپ نمونه‌کارها
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",  # سرو فایل‌های استاتیک در پروداکشن
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],  # پوشه تمپلیت‌های سراسری
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# دیتابیس: اگه DATABASE_URL باشه (Postgres روی Railway) از اون استفاده می‌کنه،
# وگرنه SQLite لوکال
DATABASES = {
    "default": dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600,
    )
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "fa"

TIME_ZONE = "Asia/Kabul"

USE_I18N = True

USE_TZ = True

# فایل‌های استاتیک (CSS / JS / عکس)
STATIC_URL = "static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"  # خروجی collectstatic برای پروداکشن

STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
