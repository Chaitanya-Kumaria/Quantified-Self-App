from flask_security import UserMixin,RoleMixin
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

roles_users = db.Table('roles_users',
db.Column('user_id',db.Integer,db.ForeignKey('user.id')),
db.Column('role_id',db.Integer,db.ForeignKey('role.id'))
)

class User(db.Model,UserMixin):
    id = db.Column(db.Integer,primary_key=True)
    email = db.Column(db.String(100),unique=True)
    username=db.Column(db.String(100),unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean)

    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role',
            secondary=roles_users,
            backref=db.backref('users',lazy='dynamic'))

class Role(db.Model,RoleMixin):
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(40))
    description = db.Column(db.String(255))

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

