# AITS PROJECT

## Group C Members

| Name                  | Registration Number |
| --------------------- | ------------------- |
| Kato Adrian Mugerwa   | 24/U/25909/PS       |
| Tino Zoe Ramona       | 24/U/11508/PS       |
| Akankunda Rita        | 24/U/03072/PS       |
| Nakawunde Cana        | 24/U/08407/PS       |
| Ayesiga Calvin Rodney | 24/U/04101/PS       |
| nicole mariah         | 24/U/04101/PS       |

backendurl = "https://backendaits.onrender.com/api/"

This project is a web application for managing academic issues. It currently supports:

- **User Authentication**: Login and Signup.
- **Issue Management**: Students can create issues and view the issues they've created.

## Step 1: Pull the Latest Changes

1. **Navigate to the Project Directory**:

   ```bash
   cd aits_project
   ```

2. **Pull the Latest Changes**:

   ```bash
   git pull origin main  # Replace 'main' with your branch name if needed
   ```

3. **Resolve Database Conflicts (If Any)**:
   - If you encounter database-related errors (e.g., merge conflicts), delete your `db.sqlite3` file, and delete everything inside migrations folder except(\_init-.py) and run migrations:
     ```bash
     python manage.py makemigrations
     python manage.py migrate
     ```

---

## Step 2: Install Dependencies

1. **Backend Dependencies**:

   - Create a Virtual Environment: Create a new virtual environment in the project directory. This step ensures that all dependencies are isolated for the project:

   ```bash
   python -m venv venv
   ```

   - Activate the Virtual Environment:(make sure you're in the backend folder first)

   On Windows:

   ```bash
   venv\Scripts\activate
   ```

   - Install Dependencies: Once the virtual environment is activated, they will install the required dependencies using the requirements.txt file:

   ```bash
   pip install -r requirements.txt
   ```

2. **Frontend Dependencies**:
   - Navigate to the `frontend` folder:
     ```bash
     cd ../frontend
     ```
   - Install Node.js dependencies:
     ```bash
     npm install
     ```

---

## Step 3: Run the Backend Server

1. **Navigate to the Backend Directory**:

   ```bash
   cd ../backend
   ```

2. **Run the Backend Server**:

   ```bash
   python manage.py runserver
   ```

   - The backend will be available at `http://127.0.0.1:8000/`.

3. **Create a Superuser (If Needed)**:
   - If you don't have a superuser and need one, create one to access the Django admin panel:
     ```bash
     python manage.py createsuperuser
     ```

---

## Step 4: Run the Frontend Server

1. **Navigate to the Frontend Directory**:

   ```bash
   cd ../frontend
   ```

2. **Run the Frontend Server**:
   ```bash
   npm run dev
   ```
   - The frontend will be available at `http://localhost:5173/`.

---

## Step 5: View the Frontend

1. **Signup**:

   - Go to `http://localhost:5173/signup` to create a new account.

2. **Login**:

   - Go to `http://localhost:5173/login` to log in to your account.

3. **Create an Issue**:

   - After logging in, you will be redirected to the dashboard where you can create and view issues.

4. **View Your Issues**:
   - Your created issues will be displayed in the dashboard.

---

## Important Notes

1. **Database**:

   - Do **not** push the `db.sqlite3` file to the repository. It causes merge conflicts and is specific to your local environment.
   - If you need to recreate the database and migrations, run:
     ```bash
     python manage.py makemigrations
     python manage.py migrate
     ```

2. **Frontend**:

   - Use `npm run dev` to start the frontend server.
   - Ensure the backend server is running (`python manage.py runserver`) for the frontend to work properly.

3. **Authentication**:
   - You must sign up or log in to access the different dashboards.
