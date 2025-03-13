from django.db import models
from django.conf import settings
# Create your models here.

class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}:{self.message}"
    
class AuditLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.SET_NULL, null= True)
    action = models.CharField(max_length=255)
    timestamp = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.timestamp}:{self.user}-{self.action}"
