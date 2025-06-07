from rest_framework import serializers
from .models import Stat


class StatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stat
        fields = ["id", "name", "value", "version", "updated_at"]
        read_only_fields = ["id", "name", "version", "updated_at"]
