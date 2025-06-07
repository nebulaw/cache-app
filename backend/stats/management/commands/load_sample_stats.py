from django.core.management.base import BaseCommand
from stats.models import Stat
import argparse


class Command(BaseCommand):
    help = "Load sample data into the Stat model"
    
    def add_arguments(self, parser):
        def positive_int(value):
            ivalue = int(value)
            if ivalue <= 0:
                raise argparse.ArgumentTypeError("%s is an invalid positive int value" % value)
            return ivalue
        
        parser.add_argument(
            "--n-sample",
            type=positive_int,
            default=16,
            help="Number of sample stats to load",
            required=False,
            dest="n_sample",
            action="store",
            metavar="N",
        )

    def handle(self, *args, **kwargs):
        n_sample = kwargs.get("n_sample", 16)
        last_id = Stat.objects.latest("id").id
        if last_id is None or last_id == 0:
            last_id = 1
        counter = 0
        for i in range(1, n_sample + 1):
            step = i + last_id
            stat = Stat.objects.create(name=f"stat{step}", value=step * 10)
            if stat.id is not None:
                counter += 1

        if counter == n_sample:
            self.stdout.write(self.style.SUCCESS("Stats loaded successfully!"))
        else:
            self.stdout.write(self.style.WARNING(f"{counter} stats were loaded!"))
