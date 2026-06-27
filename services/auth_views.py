from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db import IntegrityError

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken


# =========================
# SIGNUP
# =========================
@api_view(["POST"])
def signup(request):
    name = request.data.get("name")
    email = request.data.get("email")
    password = request.data.get("password")

    if not name or not email or not password:
        return Response(
            {"error": "All fields are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already registered"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=name
        )

        return Response({
            "success": True,
            "message": "Account created successfully",
            "user": {
                "id": user.id,
                "name": user.first_name,
                "email": user.email,
                "username": user.username,
            }
        }, status=status.HTTP_201_CREATED)

    except IntegrityError:
        return Response(
            {"error": "User creation failed (duplicate or invalid data)"},
            status=status.HTTP_400_BAD_REQUEST
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# =========================
# LOGIN
# =========================
@api_view(["POST"])
def login_user(request):
    email_or_username = request.data.get("email")
    password = request.data.get("password")

    if not email_or_username or not password:
        return Response(
            {"error": "Email/username and password required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = None

        # check email first
        if User.objects.filter(email=email_or_username).exists():
            user_obj = User.objects.get(email=email_or_username)
            user = authenticate(username=user_obj.username, password=password)

        # fallback username login
        if user is None and User.objects.filter(username=email_or_username).exists():
            user_obj = User.objects.get(username=email_or_username)
            user = authenticate(username=user_obj.username, password=password)

        if user is None:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_400_BAD_REQUEST
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            "success": True,
            "message": "Login successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "name": user.first_name,
                "email": user.email,
                "username": user.username,
            }
        })

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )