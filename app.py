# Trying to create a login page
from flask import (Flask,
                    render_template,
                    request,
                    session,
                    redirect,
                    url_for)

from flask_sqlalchemy import SQLAlchemy

from datetime import datetime

import matplotlib.pyplot as  plt
import matplotlib
matplotlib.use('Agg')

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///quantified_self.sqlite3'
db = SQLAlchemy()
db.init_app(app)
app.app_context().push()

app.secret_key ="secretkey"

class Registered(db.Model):
    __tablename__ = "registered"
    ID = db.Column(db.Integer,autoincrement = True, primary_key = True)
    Username = db.Column(db.String,unique = True, nullable = False)

class Trackers(db.Model):
    __tablename__= "trackers"
    T_id = db.Column(db.Integer,autoincrement = True,primary_key = True)
    username = db.Column(db.String,nullable = False)
    Tracker_name = db.Column(db.String,nullable = False)
    Tracker_type = db.Column(db.String,nullable = False)
    Time_created = db.Column(db.String,nullable = False)
    Tracker_description = db.Column(db.String)
    settings = db.Column(db.String)


class Values(db.Model):
    __tablename__ = "value"
    id = db.Column(db.Integer,autoincrement = True,primary_key = True)
    username = db.Column(db.String,db.ForeignKey("trackers.username"),nullable = False)
    Tracker_name = db.Column(db.String,db.ForeignKey("trackers.Tracker_name"),nullable = False)
    Time_stamp = db.Column(db.String,nullable = False)
    Value = db.Column(db.String, nullable = False)
    Note = db.Column(db.String)


@app.route("/")
def front():
    trackers=[]
    try:
        session["username"]
        user = session["username"]
    
        trackers = list(Trackers.query.filter(Trackers.username == user).all())

        return render_template("index.html",trackers = trackers)
    except:
        return render_template("index.html")


@app.route("/login",methods = ["GET","POST"])
def login():
    
    
    if request.method == "POST":
        username = request.form.get("username")
        session['username'] = username
        user = session["username"]
        trackers = list(Trackers.query.filter(Trackers.username == user).all())

        return render_template("index.html",trackers = trackers)
    
    return render_template("login.html")
@app.route("/logout")
def logout():
    session.pop("username",None)
    return redirect("/")

@app.route("/add",methods = ["GET","POST"])
def add():
    username = session["username"]
    if request.method == "POST":
        tracker_name = request.form.get("name")
        session["t_name"] = tracker_name
        tracker_type = request.form.get("Tracker_type")
        description = request.form.get("description")
        settings = request.form.get("settings")
        time_created = datetime.now()
        
        t = Trackers(username = username, Tracker_name =tracker_name,Tracker_type= tracker_type,Time_created =datetime.now(),Tracker_description = description,settings = settings )
        db.session.add(t)
        db.session.commit()
        return redirect("/")
    return render_template("add.html")

@app.route("/view/<t_name>")
def view(t_name):
    username = session["username"]
    
    records1 = list(Values.query.filter(Values.Tracker_name == t_name and Values.username == username).all())
    records = [r for r in records1 if r.username == username]
    tracker = Trackers.query.filter(Trackers.Tracker_name == t_name ).all()
   
    
        
    l =[]
    mean_l = 0
    if tracker.Tracker_type not in ["mcq","Boolean"]:
           
        l = [float(t.Value) for t in records]
        val = [i for i in range(len(l))]
        mean_l = 0
        if len(l) !=0:
            mean_l = sum(l)/len(l)
        plt.clf()
        plt.plot(l,val)
        plt.xlabel("Values")
        plt.ylabel("Index")
        plt.savefig("static/value.png")
        
    return render_template("view.html",t_name = t_name,records = records,l = l, a = tracker.Tracker_type,mean_l = round(mean_l,2))
@app.route("/add_t/<tracker_name>", methods = ["GET","POST"])
def add_t(tracker_name):
    ts = datetime.now()
    if request.method == "POST":
        
        Value = request.form.get("value")
        note = request.form.get("note")
        t = Values(username = session["username"],Tracker_name = tracker_name,Time_stamp = ts,Value = Value, Note = note )
        db.session.add(t)
        db.session.commit()
        return redirect(url_for("view",t_name =t.Tracker_name ))
    tracker_all = list(Trackers.query.filter(Trackers.Tracker_name == tracker_name ).all())
    for t in tracker_all:
        if t.username == session["username"]:
            tracker = t
    l = tracker.settings
    l1 = list(l.split(","))
    return render_template("add_t.html",tracker_name = tracker_name,tracker = tracker,l =l1)

@app.route("/delete/<tracker>")
def delete_tracker(tracker):
    username = session["username"]
    data_l = list(Trackers.query.filter(Trackers.Tracker_name == tracker ).all())
    for data in data_l:
        if data.username == username:
            db.session.delete(data)
            db.session.commit()
    val_del = list(Values.query.filter(Values.Tracker_name == tracker).all())
    for t in val_del:
        if t.username == username:
            db.session.delete(t)
            db.session.commit()
    return redirect("/")

@app.route("/delete/<int:id>")
def delete(id):
    val_del = Values.query.filter(Values.id== id).one()
    tracker = val_del.Tracker_name
   
    db.session.delete(val_del)
    db.session.commit()
    return redirect(url_for("view",t_name = tracker))

@app.route("/update/<int:id>",methods = ["GET","POST"])
def update(id):
    if request.method == "GET":
        data = Values.query.filter(Values.id == id).one()
        tracker_type = Trackers.query.filter(Trackers.Tracker_name == data.Tracker_name).first()
        tt = tracker_type.Tracker_type
        l = tracker_type.settings
        l1 = list(l.split(","))
        return render_template("update.html",data = data,tt = tt,l =l1)
    else:
        new = Values.query.filter(Values.id == id).one()
        new.Value = request.form.get("Value")
        new.Note = request.form.get("Note")
        new.Time_stamp = datetime.now()
        db.session.commit()
        return redirect(url_for("view",t_name =new.Tracker_name ))

if __name__ == "__main__":
    app.run(debug = True, port = '5000')

