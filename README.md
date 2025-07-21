Neuro-Symbolic Alzheimer’s Detection Web Application
Overview

A neuro-symbolic model for early Alzheimer’s disease (AD) detection, combining deep learning for brain MRI analysis (hippocampal atrophy) with symbolic reasoning for Mini-Mental State Examination (MMSE) scores and patient metadata. The web app, built with Create React App and Tailwind CSS, offers two features:

MMSE Report: Input MMSE scores and metadata for AD risk assessment with interpretable rules.

MRI Scan Report: Upload MRI scans for AD likelihood prediction with explanations.

Differentiates AD from conditions like normal pressure hydrocephalus (NPH).

Prerequisites

Node.js: 16.x+

Python: 3.8+

Dependencies:

Python: tensorflow, flask, numpy, scikit-learn

Frontend: React (CRA), Tailwind CSS

Hardware: GPU recommended

Data: MRI dataset (DICOM) and MMSE data (CSV/JSON)

Installation

Backend

Clone repo:

git clone https://github.com/your-repo/neuro-symbolic-ad-detection.git
cd neuro-symbolic-ad-detection

Set up Python environment:

python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install tensorflow flask numpy scikit-learn

Configure model in backend/config.py (add MRI dataset and model.h5).

Run Flask:
cd backend
python app.py

API at http://localhost:5000.

Frontend

Navigate to frontend:

cd frontend

Install dependencies:

npm install
npm install -D tailwindcss
npx tailwindcss init

Start React:

npm start

Open http://localhost:3000.

Usage

MMSE Report: Enter MMSE scores (0–30) and metadata in the web form for AD risk and rule-based explanation (e.g., “MMSE < 24, age > 65: high AD risk”).

MRI Scan Report: Upload MRI (DICOM) for CNN-based AD prediction and interpretable output (e.g., “Hippocampal atrophy detected; AD likely”).

Output: AD likelihood (0–100%), rule-based explanation, and NPH differentiation.

Scripts (Frontend)

npm start: Run dev server at http://localhost:3000.

npm test: Run tests. See running tests.

npm run build: Build for production. See deployment.

npm run eject: Customize CRA config (irreversible).
