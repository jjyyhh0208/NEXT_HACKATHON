from django.db import models

# Create your models here.


class User(models.Model):
    username = models.CharField(max_length=50, primary_key=True)
    score = models.IntegerField(null=True, default=0)
    dateJoined = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username


class Department(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Professor(models.Model):
    name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='professor_photos/')

    def __str__(self):
        return self.name
