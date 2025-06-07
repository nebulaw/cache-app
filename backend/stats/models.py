from django.db import models
from concurrency.fields import IntegerVersionField


# Simple Stat model that stores a name and a value
class Stat(models.Model):
    name = models.CharField(max_length=255)
    value = models.IntegerField(default=0)
    version = IntegerVersionField()  # this is for optimistic locking
    updated_at = models.DateTimeField(
        auto_now=True
    )  # just to display the last update date

    def __str__(self):
        return f"<Stat {self.name}:{self.value}, version:{self.version}, update_date:{self.updated_at}>"
