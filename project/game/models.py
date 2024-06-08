from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length = 50, primary_key = True)
    score = models.IntegerField(null = True, default = 0)
    dateJoined = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username    