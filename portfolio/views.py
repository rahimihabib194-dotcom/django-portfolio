from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from .models import Project, Skill
from .forms import ContactForm


def home(request):
    """صفحه اصلی: هیرو + مهارت‌ها + پروژه‌های منتخب."""
    skills = Skill.objects.all()
    featured = Project.objects.filter(featured=True)[:3]
    return render(
        request,
        "portfolio/home.html",
        {"skills": skills, "featured": featured},
    )


def projects(request):
    """لیست همه پروژه‌ها."""
    all_projects = Project.objects.all()
    return render(request, "portfolio/projects.html", {"projects": all_projects})


def project_detail(request, pk):
    """صفحه جزئیات یک پروژه."""
    project = get_object_or_404(Project, pk=pk)
    return render(request, "portfolio/project_detail.html", {"project": project})


def contact(request):
    """فرم تماس: پیام را ذخیره می‌کند و پیام موفقیت نشان می‌دهد."""
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "پیامت با موفقیت فرستاده شد! به‌زودی جواب می‌دم.")
            return redirect("contact")
    else:
        form = ContactForm()
    return render(request, "portfolio/contact.html", {"form": form})
