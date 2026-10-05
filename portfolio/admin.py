from django.contrib import admin
from .models import Skill, Project, Message


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "level")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "featured", "created_at")
    list_filter = ("featured",)


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "created_at")
    readonly_fields = ("created_at",)
