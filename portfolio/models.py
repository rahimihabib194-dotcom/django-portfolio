from django.db import models


class Skill(models.Model):
    """یک مهارت (مثل Python) با درصد تسلط."""

    name = models.CharField(max_length=100, verbose_name="نام مهارت")
    level = models.IntegerField(default=50, verbose_name="درصد تسلط (۰ تا ۱۰۰)")

    class Meta:
        verbose_name = "مهارت"
        verbose_name_plural = "مهارت‌ها"

    def __str__(self):
        return self.name


class Project(models.Model):
    """یک پروژه نمونه‌کار."""

    title = models.CharField(max_length=200, verbose_name="عنوان")
    description = models.TextField(verbose_name="توضیح")
    tech = models.CharField(max_length=200, blank=True, verbose_name="تکنولوژی‌ها")
    link = models.URLField(blank=True, verbose_name="لینک")
    featured = models.BooleanField(default=False, verbose_name="نمایش در صفحه اصلی")
    created_at = models.DateField(auto_now_add=True, verbose_name="تاریخ ثبت")

    class Meta:
        verbose_name = "پروژه"
        verbose_name_plural = "پروژه‌ها"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Message(models.Model):
    """پیام‌های فرم تماس که بازدیدکننده‌ها می‌فرستند."""

    name = models.CharField(max_length=100, verbose_name="نام")
    email = models.EmailField(verbose_name="ایمیل")
    text = models.TextField(verbose_name="متن پیام")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ")

    class Meta:
        verbose_name = "پیام"
        verbose_name_plural = "پیام‌ها"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.created_at:%Y-%m-%d})"
