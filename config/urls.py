"""URLهای اصلی پروژه."""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("portfolio.urls")),  # روت‌های اپ نمونه‌کار
]
