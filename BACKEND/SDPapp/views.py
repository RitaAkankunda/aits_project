from rest_framework import viewsets, status, generics, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from .models import CustomUser, Department, Issue, Token
from .serializers import CustomUserSerializer, DepartmentSerializer, IssueSerializer, TokenSerializer
from notifications.models import Notification
import logging
from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from rest_framework import status
from django.conf import settings
from datetime import datetime, timedelta
import hashlib
import uuid
from django.utils import timezone
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.authtoken.models import Token

SALT = "8b4f6b2cc1868d75ef79e5cfb8779c11b6a374bf0fce05b485581bf4e1e25b96c8c2855015de8449"
URL = "http://localhost:5173"

def mail_template(content, button_url, button_text):
    return f"""<!DOCTYPE html>
            <html>
            <body style="text-align: center; font-family: "Verdana", serif; color: #000;">
                <div style="max-width: 600px; margin: 10px; background-color: #fafafa; padding: 25px; border-radius: 20px;">
                <p style="text-align: left;">{content}</p>
                <a href="{button_url}" target="_blank">
                    <button style="background-color: #444394; border: 0; width: 200px; height: 30px; border-radius: 6px; color: #fff;">{button_text}</button>
                </a>
                <p style="text-align: left;">
                    If you are unable to click the above button, copy paste the below URL into your address bar
                </p>
                <a href="{button_url}" target="_blank">
                    <p style="margin: 0px; text-align: left; font-size: 10px; text-decoration: none;">{button_url}</p>
                </a>
                </div>
            </body>
            </html>"""


class ResetPasswordView(APIView):
    def post(self, request, format=None):
        user_id = request.data["id"]
        token = request.data["token"]
        password = request.data["password"]

        token_obj = Token.objects.filter(user_id=user_id).order_by("-created_at")[0]
        if token_obj.expires_at < timezone.now():
            return Response(
                {"success": False, "message": "Password Reset Link has expired!"},
                status=status.HTTP_200_OK,
            )
        elif token_obj is None or token != token_obj.token or token_obj.is_used:
            return Response(
                {"success": False, "message": "Reset Password link is invalid!"},
                status=status.HTTP_200_OK,
            )
        else:
            token_obj.is_used = True
            # Remove the custom salt
            hashed_password = make_password(password)  # Let Django handle salting
            ret_code = CustomUser.objects.filter(id=user_id).update(password=hashed_password)
            if ret_code:
                token_obj.save()
                return Response(
                    {"success": True, "message": "Your password reset was successful!"},
                    status=status.HTTP_200_OK,
                )
class ForgotPasswordView(APIView):
    def post(self, request, format=None):
        email = request.data["email"]
        user = CustomUser.objects.get(email=email)
        created_at = timezone.now()
        expires_at = timezone.now() + timezone.timedelta(1)
        salt = uuid.uuid4().hex
        token = hashlib.sha512(
            (str(user.id) + user.password + created_at.isoformat() + salt).encode(
                "utf-8"
            )
        ).hexdigest()
        token_obj = {
            "token": token,
            "created_at": created_at,
            "expires_at": expires_at,
            "user_id": user.id,
        }
        serializer = TokenSerializer(data=token_obj)
        if serializer.is_valid():
            serializer.save()
            subject = "Forgot Password Link"
            content = mail_template(
                "We have received a request to reset your password. Please reset your password using the link below.",
                f"{URL}/resetPassword?id={user.id}&token={token}",
                "Reset Password",
            )
            send_mail(
                subject=subject,
                message=content,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                html_message=content,
            )
            return Response(
                {
                    "success": True,
                    "message": "A password reset link has been sent to your email.",
                },
                status=status.HTTP_200_OK,
            )
        else:
            error_msg = ""
            for key in serializer.errors:
                error_msg += serializer.errors[key][0]
            return Response(
                {
                    "success": False,
                    "message": error_msg,
                },
                status=status.HTTP_200_OK,
            )



class RegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        data = request.data.copy()  # Work on a copy of the data

        serializer = CustomUserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"success": True, "message": "You are now registered!"},
                status=status.HTTP_201_CREATED,
            )
        else:
            error_msg = [msg[0] for field, msg in serializer.errors.items()]
            return Response(
                {"success": False, "message": " ".join(error_msg)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class LoginView(APIView):
    authentication_classes = []  # Disable authentication for login endpoint
    permission_classes = []      # Disable permissions for login endpoint

    

    def post(self, request, format=None):
        email = request.data.get("email")
        password = request.data.get("password")

        

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response(
                {"success": False, "message": "Invalid login credentials! User does not exist."},
                status=status.HTTP_200_OK,
            )

        user = authenticate(request, username=email, password=password)
        
        if user is None:
            return Response(
                {"success": False, "message": "Invalid login credentials! Incorrect password."},
                status=status.HTTP_200_OK,
            )
        if user:
            token, _ = Token.objects.get_or_create(user=user)  
            return Response({
                "success": True,
                "message": "You are now logged in!",
                "role": user.role,
                "student_number": user.student_number,
                "token": token.key,  # Include the student's number
            })
        else:
            print(f"Authentication failed for {email}")  # Debug auth failure
            return Response({"success": False}, status=401)


        
@api_view(['PUT'])
def update_profile(request):
    """
    Update the user's profile: password, student/lecturer/registrar number.
    """
    user = request.user
    serializer = CustomUserSerializer(user, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()  # Save the updated user details
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'message': 'Profile updated successfully.'
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# CustomUser API
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]


# Department API
class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]



class IssueViewSet(viewsets.ModelViewSet):
    serializer_class = IssueSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """ 
        Get issues for the currently authenticated student
        """
        return Issue.objects.filter(
            student_number=self.request.user.student_number
        )

    def perform_create(self, serializer):
        """
        Automatically set student_number from logged-in user
        """
        serializer.save(
            student_number=self.request.user.student_number,
            user=self.request.user
        )