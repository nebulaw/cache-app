from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from concurrency.exceptions import RecordModifiedError
from django.core.cache import cache

from .models import Stat
from .serializers import StatSerializer


class StatGetAPIView(APIView):
    def get(self, request):
        """
        Return data from Redis or PostgreSQL. If cache is not found,
        it acquires a lock on the key to prevent cache stampede, then
        fetches data from PostgreSQL and saves it in the cache for a minute
        """
        # Check if the key is associated with a value in the cache
        key = "stats"
        data = cache.get(key)
        if data is None:
            # Avoid cache stampede by locking the key (backed by python-redis-lock)
            with cache.lock(key):
                # Check again if the key is associated with a value in the cache
                data = cache.get(key)
                if data is None:
                    try:
                        # If a cache was not found, fetch data from PostgreSQL
                        # Wait a bit to simulate an expensive operation
                        import time

                        time.sleep(2)
                        stats = Stat.objects.all().order_by("id")
                        data = StatSerializer(stats, many=True).data
                        # Saving the cache for a minute for demonstrative purposes
                        cache.set(key, data, timeout=60)
                    except Exception:
                        return Response(
                            {"error": "Database error"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        )
        # return the cached data
        return Response(data)

    def post(self, request):
        """
        Updates the value of a stat and saves it in the cache It also
        invalidates the cache to avoid stale data.  Optimistic locking is backed
        by django-concurrency - on each instance update, the version field
        (IntegerVersonField) is automatically updated. This is used to check if
        the object has been updated by another thread since the last read.
        """
        try:
            stat = Stat.objects.get(pk=request.data["id"])
            stat.value = request.data.get("value", stat.value)
            stat.save()  # Save the updated stat
            cache.delete("stats")
            data = StatSerializer(stat).data
            return Response(data)
        except RecordModifiedError:
            return Response(
                {"error": "Stats was modified by another process"},
                status=status.HTTP_409_CONFLICT,
            )
        except Stat.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
