Cloner le projet :
git clone git@github.com:Shamourai47/editor_2.git
cd editor_2

Lancer le back sur Windows :

c:\Python38\python.exe -m venv venv
(Set-ExecutionPolicy Unrestricted -Scope Process)
.\venv\Script\activate
pip install -r requirements.txt

set FLASK_APP=app.py
$env:FLASK_APP = "app.py"

flask run

Lancer le front sur Windows :
cd front
npm i
npm start