from django import forms
from .models import Message


class ContactForm(forms.ModelForm):
    """فرم تماس — پیام بازدیدکننده را در دیتابیس ذخیره می‌کند."""

    class Meta:
        model = Message
        fields = ["name", "email", "text"]
        labels = {
            "name": "نام",
            "email": "ایمیل",
            "text": "پیام",
        }
        widgets = {
            "name": forms.TextInput(attrs={"placeholder": "نامت"}),
            "email": forms.EmailInput(attrs={"placeholder": "example@mail.com"}),
            "text": forms.Textarea(attrs={"placeholder": "پیامت را بنویس...", "rows": 5}),
        }
