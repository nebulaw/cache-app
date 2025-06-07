from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path("admin/", admin.site.urls),
    # Register /api/stats/get endpoint
    path("api/stats/", include("stats.urls")),
]
