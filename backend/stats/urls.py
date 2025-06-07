from django.urls import path
from .views import StatGetAPIView

# Expose StatGetAPIView as a URL
urlpatterns = [path("get", StatGetAPIView.as_view(), name="get-stats")]
