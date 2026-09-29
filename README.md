# Prabhu Labs — Digital Solutions

A modern web service platform for providing digital solutions to businesses and individuals.

## 🚀 Features

* Responsive modern website
* Service showcase
* Contact / enquiry form
* WhatsApp contact integration
* Backend API using FastAPI
* Admin panel for managing enquiries
* Database integration
* Separate frontend and backend structure

## 🛠️ Technologies Used

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Python
* FastAPI

### Database

* SQLite

### Tools

* Git
* GitHub
* VS Code

## 📁 Project Structure

```text
my-web-service/
│
├── Backend/
│   ├── main.py
│   ├── database.py
│   └── models.py
│
├── admin/
│   ├── index.html
│   ├── login.html
│   ├── admin.js
│   ├── admin.css
│   ├── login.js
│   └── login.css
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── index.html
├── .gitignore
└── README.md
```

## ⚙️ Running Locally

Clone the repository:

```bash
git clone https://github.com/rnprabhu/my-web-service.git
```

Go into the project:

```bash
cd my-web-service
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

Windows PowerShell:

```powershell
venv\Scripts\Activate.ps1
```

Install the required packages:

```bash
pip install -r requirements.txt
```

Start the FastAPI backend:

```bash
uvicorn Backend.main:app --reload
```

## 🌐 Deployment

The project is intended to be deployed using **Vercel** for the web application.

## 👨‍💻 Developer

**RN Prabhu**

Computer Science & Engineering Student

---

⭐ If you find this project useful, consider giving the repository a star.
