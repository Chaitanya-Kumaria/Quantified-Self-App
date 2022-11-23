from distutils.log import debug
import resource
from flask import Flask,render_template,url_for,request,redirect
from api.resource import User,api
from models import db,User as user_model,Values as value_model,Trackers as tracker_model
from security import user_datastore,sec
from flask_security import hash_password
from cache import cache
import config
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SECRET_KEY'] = "thisissecret"
app.config['SECURITY_PASSWORD_SALT'] = 'salt'
app.config['WTF_CSRF_ENABLED'] = False
app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER'] = "Authentication-Token"
app.config['SECURITY_PASSWORD_HASH'] = 'bcrypt'

api.init_app(app)
db.init_app(app)
sec.init_app(app,user_datastore)
app.config.from_object(config)
cache.init_app(app)

@app.before_first_request
def create_db():
    db.create_all()
    if not user_datastore.find_user(email='ram@gmail.com'):
        user_datastore.create_user(username="ram",email="ram@gmail.com",password=hash_password('1234'))
        db.session.commit()
    if not user_datastore.find_role('admin'):
        user_datastore.create_role(name="admin",description="Admin related role")
        db.session.commit()
@app.route("/")
@cache.cached(timeout=100)
def home():
    return render_template('index.html')
@app.route("/register",methods=['GET','POST'])
# @cache.cached(timeout= 120)
def register():
    if(request.method == 'POST'):
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        user_datastore.create_user(username=username,email=email,password=hash_password(password))
        db.session.commit()
        return redirect("/#/login")
    return render_template('register.html')

SERVER_SMTP_HOST = 'localhost'
SERVER_SMTP_PORT = 1025

SENDER_ADDRESS ='21f1000479@student.onlinedegree.iitm.ac.in'
SENDER_PASSWORD=''
def send_email(to_address,subject,message):
    msg = MIMEMultipart()
    msg['To']=to_address
    msg['From']=SENDER_ADDRESS
    msg['Subject']=subject
    msg.attach(MIMEText(message,'html'))
    s = smtplib.SMTP(host=SERVER_SMTP_HOST,port=SERVER_SMTP_PORT)
    s.login(SENDER_ADDRESS,SENDER_PASSWORD)
    s.send_message(msg)
    return True

 
if __name__ == "__main__":
    app.run(debug = True)
