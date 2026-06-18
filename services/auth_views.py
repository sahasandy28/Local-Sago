from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


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

    if User.objects.filter(email=email).exists():
        return Response(
            {"error": "This email is already registered"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=email).exists():
        return Response(
            {"error": "This username is already taken"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=name
    )

    return Response(
        {
            "success": True,
            "message": "Account created successfully",
            "user": {
                "id": user.id,
                "name": user.first_name,
                "email": user.email,
                "username": user.username,
            }
        },
        status=status.HTTP_201_CREATED
    )


@api_view(["POST"])
def login_user(request):
    email_or_username = request.data.get("email")
    password = request.data.get("password")

    if not email_or_username or not password:
        return Response(
            {"error": "Email/username and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user_obj = User.objects.filter(email=email_or_username).first()

    if not user_obj:
        user_obj = User.objects.filter(username=email_or_username).first()

    if not user_obj:
        return Response(
            {"error": "Invalid email/username or password"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(
        username=user_obj.username,
        password=password
    )

    if user is None:
        return Response(
            {"error": "Invalid email/username or password"},
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