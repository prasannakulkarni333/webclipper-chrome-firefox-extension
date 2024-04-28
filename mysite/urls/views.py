from django.shortcuts import render
from django.http import HttpResponse
from django.views import View
from .models import Url
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

# Create your views here.


class Home(View):
    def post(self, request):
        url = request.GET["page"]
        if url:
            Url.objects.create(url=url)
            return HttpResponse("URL saved")
        else:
            return HttpResponse("URL not saved", status=400)

    def get(self, request):
        urls = Url.objects.all()
        return HttpResponse("urls" + str(urls))
