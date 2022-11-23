from flask_restful import Resource,Api,reqparse,fields,marshal_with,abort
from models import User as User_model,db
from models import Trackers as Trackers_model
from models import Values as Values_model
from flask_security.utils import hash_password

from datetime import datetime
from cache import cache
# from redis import redis
api = Api()

User_req = reqparse.RequestParser()
User_req.add_argument('username',type = str, help = 'username required and should be string')
User_req.add_argument ('email', type = str,  help = 'email  is required and should be a string')
User_req.add_argument('password',type = str, help = 'password is a string')



# THIS DICTIONARY HELPS CONVERT THE INPUT INTO JSON SERIALIZABLE OBJECT
User_field = { 
    'id' : fields.Integer,
    'email' : fields.String,
    'username' : fields.String,
    'password' : fields.String,
    #'url':fields.Url(absolute=True)
}
class User(Resource):

    @marshal_with(User_field)
    
    def get(self,username = None):
        if username == None:
            user = User_model.query.all()
            return user,200
        user = User_model.query.filter(User_model.username==username).first()
        if id:
            if not user:
                abort(404, message = "user not found")
            else:
                return user, 200
        else:
            
            return "Internal server error",500
    @marshal_with(User_field)
    def post(self):
        data = User_req.parse_args()
        user = User_model(username=data.username,email = data.email,password = hash_password(data.password),fs_uniquifier = data.email,active=1) 
        db.session.add(user)
        db.session.commit()
        return user,201

        

    def delete(self,id = None):
        if id:
            student = User_model.query.get(id)
            if not student:
                abort(404,message = 'user not found ')
            db.session.delete(student)
            db.session.commit()
            return "Successfully deleted",200
        else:
            abort(500,message = 'internal server error')
    
    
api.add_resource(User,'/api/user','/api/user/<string:username>')

# for trackers table
Trackers_req = reqparse.RequestParser()
Trackers_req.add_argument('username',type=str,help='username is string type')
Trackers_req.add_argument('Tracker_name',type = str, help = 'trackers name is required and should be string')
Trackers_req.add_argument ('Tracker_type', type = str,  help = 'trackers type is required and should be string')
Trackers_req.add_argument('Tracker_description',type = str, help = 'trackers description should be a string')
Trackers_req.add_argument('settings',type= str)
#This dictionary helps make trackers table JSON serializable
Trackers_field = { 
    'T_id' : fields.Integer,
    'username':fields.String,
    'Tracker_name' : fields.String,
    'Tracker_type' : fields.String,
    'Time_created':fields.String,
    'Tracker_description' : fields.String,
    'settings':fields.String
    #'url':fields.Url(absolute=True)
}

class Trackers(Resource):
    
    @marshal_with(Trackers_field)
    @cache.memoize(timeout=120)
    def get(self,username = None):
        trackers = Trackers_model.query.filter(Trackers_model.username==username).all()
        
        if username:
            if not trackers:
                abort(404, message = "Trackers or username not found")
            else:
                return trackers, 200
        else:
            
            return "Internal Server Error",500
        
    
    @marshal_with(Trackers_field)
    def post(self,username= None):
        data = Trackers_req.parse_args()
        
        
        tracker = Trackers_model(username=username,Tracker_name = data.Tracker_name,Tracker_type = data.Tracker_type,Tracker_description = data.Tracker_description,Time_created=str(datetime.now()),settings= data.settings) 
        db.session.add(tracker)
        db.session.commit()
        return tracker,201


    
        
    def delete(self,id = None):
        
        if id:
            trackers = Trackers_model.query.filter(Trackers_model.T_id==id).first()
            val  = list(Values_model.query.filter(Values_model.username == trackers.username,Values_model.Tracker_name == trackers.Tracker_name).all())

            if not trackers:
                abort(404,message = 'trackers not found ')
            db.session.delete(trackers)
            for i in val:
                db.session.delete(i)
            db.session.commit()
            return "Successfully deleted",200, cache.clear()
        else:
            abort(500,message = 'internal server error')
       
       
    
    
    
api.add_resource(Trackers,'/api/trackers', '/api/trackers/<int:id>','/api/trackers/<string:username>')

# for Values table
Valuesreq = reqparse.RequestParser()
Valuesreq.add_argument ('Value', type = str,  help = 'Value is of type str')
Valuesreq.add_argument ('Note', type = str,  help = 'Value is of type str')

#This dictionary helps make Values table JSON serializable
Valuesfield = { 
    'id' : fields.Integer,
    'username' : fields.String,
    'Tracker_name' : fields.String,
    'Time_Stamp':fields.String,
    'Value':fields. String,
    'Note':fields.String
    #'url':fields.Url(absolute=True)
}

class Values(Resource):

    @marshal_with(Valuesfield)
    def get(self,username = None,tracker_name=None):
        values = Values_model.query.filter(Values_model.username==username,Values_model.Tracker_name==tracker_name).all()
        
        if username and tracker_name:
            if not values:
                abort(404, message = "No value found")
            else:
                return values, 200
        else:
            
            return values,500
        
            
    @marshal_with(Valuesfield)
    def post(self,username=None,tracker_name=None):
        data = Valuesreq.parse_args()

        Value = Values_model(username= username,Tracker_name=tracker_name,Time_stamp=datetime.now(),Value=data.Value,Note=data.Note)
        
        db.session.add(Value)
        db.session.commit()
        return Value,201

   
    @marshal_with(Valuesfield)
    def put(self,id=None):
        if not id:
            abort(400,message="id not given")
        else:
             data = Valuesreq.parse_args()
             values = Values_model.query.filter_by(id = id)
             if not values.first():
                abort(404,message="value not found")
             else:
                values.update(data)
                db.session.commit()
                return "updated successfully",200   
    def delete(self,id=None):
        if id:
            values = Values_model.query.filter(Values_model.id == id).first()
            if not values:
                abort(404,message = 'Values for id not found')
            db.session.delete(values)
            db.session.commit()
            return "Successfully deleted",200
        else:
            abort(400,message = 'invalid Valueid')


    
    
    
api.add_resource(Values,'/api/value/<int:id>','/api/trackers/<string:username>/<string:tracker_name>')


