from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm

 # Registration View

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'accounts/register.html', {'form': form})

# Login View
def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('profile')
        else:
            messages.error(request, 'Invalid credentials')
    return render(request, 'accounts/login.html')

# Logout View
def logout_view(request):
    logout(request)
    return redirect('login')