from celery import Celery
from celery.schedules import crontab
from json import dumps
from httplib2 import Http
from flask import Flask
from app import send_email
from jinja2 import Template
import requests
import ast

# celery -A tasks.cel beat --max-interval 2 -l info // save tasks
# celery -A tasks.cel worker


cel = Celery('My_Task',broker='redis://localhost',backend='redis://localhost')
@cel.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    
    sender.add_periodic_task(crontab(hour=15,minute=50,day_of_month=12), user_view.s(), name='sends mail on 12th of every month')

    

    sender.add_periodic_task(
        crontab(hour=12, minute=00),
        main.s(),
    )



@cel.task
def main():
    """Hangouts Chat incoming webhook quickstart."""
    url = 'https://chat.googleapis.com/v1/spaces/AAAA_C3YrS4/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=Wu2T8-KFfIUWE7Fyjr6tJqT4fCYmKQTmnZOPCoKiKfA%3D'
    bot_message = {
        'text': 'Good Evening guys, heres a daily reminder for you to track your daily activity!'}
    message_headers = {'Content-Type': 'application/json; charset=UTF-8'}
    http_obj = Http()
    response = http_obj.request(
        uri=url,
        method='POST',
        headers=message_headers,
        body=dumps(bot_message),
    )
    print(response)

    

@cel.task
def user_view():
    with open('./templates/mail.html','r') as f:
        template=Template(f.read())
    url = "http://127.0.0.1:5000/api/user"

    response= requests.request('GET',url)
    l = ast.literal_eval(response.text)
    for user in l:
        trackers_url = "http://127.0.0.1:5000/api/trackers/"+user["username"]
        response_= requests.request('GET',trackers_url)
        l1 = ast.literal_eval(response_.text)

        send_email(user["email"],'Welcome',template.render(user= user["username"],trackers=l1))
    print("sent")