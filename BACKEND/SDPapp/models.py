from django.db import models
from django.core.validators import MaxLengthValidator
from django.utils.translation import gettext_lazy as _


class Department(models.Model):

    """
    Represents an academic department within the institution.
    """
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name=_("Department Name"),
        help_text=_("The name of the academic department.")
    )

    
    head = models.ForeignKey(
        'accounts.CustomUser',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': 'LECTURER'},
        related_name='headed_departments',
        verbose_name=_("Department Head"),
        help_text="The lecturer designated as head of this department."
    )

    class Meta:
        verbose_name = _("Department")
        verbose_name_plural = _("Departments")
        ordering = ['name']


    def __str__(self):
        return self.name

class Issue(models.Model):

    """
    Represents an academic issue raised by a student regarding marks or other academic matters.
    """
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        ASSIGNED = 'assigned', _('Assigned')
        RESOLVED = 'resolved', _('Resolved')

    class Category(models.TextChoices):
        MISSING_MARKS = 'missing_marks', _('Missing Marks')
        APPEAL = 'appeal', _('Appeal')
        CORRECTIONS = 'corrections', _('Corrections')
        OTHER = 'other', _('Other')

    title = models.CharField(
        max_length=200,
        verbose_name=_("Issue Title"),
        help_text=_("A brief title describing the issue.")
    )
    category = models.CharField(
        max_length=30,
        choices=Category.choices,
        verbose_name=_("Category"),
        help_text=_("The type of issue being reported.")
    )
    status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.PENDING,
        verbose_name=_("Status"),
        help_text=_("The current status of the issue.")
    )
    description = models.TextField(
        validators=[MaxLengthValidator(1000)],
        verbose_name=_("Description"),
        help_text=_("Detailed description of the issue (max 1000 characters).")
    )
    course_code = models.CharField(
        max_length=20,
        verbose_name=_("Course Code"),
        help_text=_("The course code related to this issue.")
    )
    user = models.ForeignKey(
        'accounts.CustomUser',
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'STUDENT'},
        related_name='reported_issues',
        verbose_name=_("Reported By"),
        help_text="The student who logged this issue."
    )
    assigned_to = models.ForeignKey(
        'accounts.CustomUser',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_issues',
        limit_choices_to={'role__in': ['LECTURER', 'REGISTRAR']},
        verbose_name=_("Assigned To"),
        help_text="The lecturer or registrar assigned to resolve this issue."
    )
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='issues',
        verbose_name=_("Department"),
        help_text="The department related to this issue."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.course_code})"

class AuditLog(models.Model):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='audit_logs')
    user = models.ForeignKey('accounts.CustomUser', on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=100)  # e.g., "Created", "Assigned", "Resolved"
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True)  # e.g., "Assigned to Lecturer X"

    def __str__(self):
        return f"{self.action} on {self.issue} by {self.user}"