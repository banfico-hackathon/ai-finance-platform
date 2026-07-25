from django.urls import path
from .views import chat_api_view, recommendations_api_view

urlpatterns = [
    path('api/chat/', chat_api_view, name='chat-api'),
    path('api/chat', chat_api_view, name='chat-api-no-slash'),
    path('api/recommendations/', recommendations_api_view, name='recommendations-api'),
    path('api/recommendations', recommendations_api_view, name='recommendations-api-no-slash'),
]
