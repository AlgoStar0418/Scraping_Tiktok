from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


class User(AbstractUser):
    uid = models.UUIDField(default=uuid.uuid4, editable=False,
                           unique=True, primary_key=True, null=False, blank=False)
    email = models.EmailField(unique=True, null=False, blank=False)

    def __str__(self):
        return self.username
