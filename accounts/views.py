from rest_framework import generics, permissions, status
from rest_framework.response import Response
from knox.models import AuthToken

from .models import *
from .serializers import *

# Create your views here.

class RegisterView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                "message":"Registered Successfully!",
                "username": user.username,
                "email": user.email,  
                "token": AuthToken.objects.create(user)[1]              
                }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        return Response({"message":"Login Successfully!","token": AuthToken.objects.create(user)[1]}, status=status.HTTP_200_OK)


class LogoutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        user = request.user

        # Delete the current user's token(s)
        AuthToken.objects.filter(user=user).delete()
        
        return Response({"message": "Logout successful.", "Token" : 'Token Destroyed'}, status=status.HTTP_200_OK)

