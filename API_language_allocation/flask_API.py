from flask import Flask
from flask import jsonify
from flask import request, session, url_for, redirect, make_response
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
import bson.json_util
import json
import pymongo
import random
import string
from ast import literal_eval
from flask_cors import CORS, cross_origin
import data_structs
from solver import *

site_url = 'localhost'


app = Flask(__name__)
cors = CORS(app, resources={r"/*":{"origins": site_url}})




app.config['MONGO_DBNAME'] = 'language_allocation_database'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/language_allocation_database'
app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy dog'
app.config['CORS_HEADERS'] = 'Content-Type'

mongo = PyMongo(app)


def get_max_collection_id(collection):
    max_column = collection.find_one(sort=[("id", -1)])
    if max_column==None:
        return 0
    return int(max_column["id"])



@app.route('/courses/', methods=['GET'])
@cross_origin(origin=site_url,headers=['Content-Type','Authorization'])
def get_all_courses():
    courses = mongo.db.courses
    all_courses = courses.find()
    if all_courses:
        Output = []
        for course in all_courses:
            output={}
            output["id"] = course["id"]
            output["name"] = course["name"]
            output["language"] = course["language"]
            output["creneaux"] = course["creneaux"]
            output["min_students"] = course["min_students"]
            output["max_students"] = course["max_students"]
            Output.append(output)
        html_code = 200
    else:
        output = "No courses"
        html_code = 400
    return jsonify({'result': Output}), html_code



@app.route('/courses/<course_id>', methods=['GET'])
@cross_origin(origin=site_url,headers=['Content-Type','Authorization'])
def get_course_by_id(course_id):
    courses = mongo.db.courses
    course = courses.find_one({"id": int(course_id)})
    if course:
        output={}
        output["id"] = course["id"]
        output["name"] = course["name"]
        output["language"] = course["language"]
        output["creneaux"] = course["creneaux"]
        output["min_students"] = course["min_students"]
        output["max_students"] = course["max_students"]
        html_code = 200
    else:
        output = "No matching course for id " + str(course_id)
        html_code = 400
    return jsonify({'result': output}), html_code


@app.route('/courses/by-language/<language>', methods=['GET'])
@cross_origin(origin=site_url,headers=['Content-Type','Authorization'])
def get_course_by_language(language):
    courses = mongo.db.courses
    courses_of_language = courses.find({"language": language})
    if courses_of_language:
        Output = []
        for course in courses_of_language:
            output={}
            output["id"] = course["id"]
            output["name"] = course["name"]
            output["language"] = course["language"]
            output["creneaux"] = course["creneaux"]
            output["min_students"] = course["min_students"]
            output["max_students"] = course["max_students"]
            Output.append(output)
        html_code = 200
    else:
        Output = "No matching course for language " + str(language)
        html_code = 400
    return jsonify({'result': Output}), html_code

@app.route('/courses/not-english/', methods=['GET'])
@cross_origin(origin=site_url,headers=['Content-Type','Authorization'])
def get_course_not_english():
    courses = mongo.db.courses
    Output = []
    for course in courses_of_language:
        if course["language"] != "Anglais":
            output={}
            output["id"] = course["id"]
            output["name"] = course["name"]
            output["language"] = course["language"]
            output["creneaux"] = course["creneaux"]
            output["min_students"] = course["min_students"]
            output["max_students"] = course["max_students"]
            Output.append(output)
        html_code = 200
    return jsonify({'result': Output}), html_code


@app.route('/courses/<course_id>', methods=['POST'])
@cross_origin(origin=site_url,headers=['Content-Type','Authorization'])
def update_course(course_id):
    courses = mongo.db.courses
    new_name = request.get_json(force=True)['name']
    new_language = request.get_json(force=True)['language']
    new_creneaux = request.get_json(force=True)['creneaux']
    new_min_students = request.get_json(force=True)['min_students']
    new_max_students = request.get_json(force=True)['max_students']
    course_update = courses.update({"id":int(course_id)}, {"id":int(course_id),
                                                           "name":new_name,
                                                           "language":new_language,
                                                           "creneaux":new_creneaux,
                                                           "min_students":new_min_students,
                                                           "max_students":new_max_students})
    if course_update:
        output = "Course with id "+course_id+" updated successfully"
        html_code = 200
    else:
        output = "No matching course for id " + str(course_id)
        html_code = 400
    return jsonify({'result': output}), html_code


@app.route('/courses/', methods=['PUT'])
@cross_origin(origin=site_url,headers=['Content-Type','Authorization'])
def add_course():
    courses = mongo.db.courses
    id = get_max_collection_id(courses)+1
    new_name = request.get_json(force=True)['name']
    new_language = request.get_json(force=True)['language']
    new_creneaux = request.get_json(force=True)['creneaux']
    new_min_students = request.get_json(force=True)['min_students']
    new_max_students = request.get_json(force=True)['max_students']
    course_inserted = courses.insert({"id":int(id),
                                                           "name":new_name,
                                                           "language":new_language,
                                                           "creneaux":new_creneaux,
                                                           "min_students":new_min_students,
                                                           "max_students":new_max_students})
    if course_inserted:
        output = {"id":id}
        html_code = 200
    else:
        output = "Could not add course"
        html_code = 400
    return jsonify({'result': output}), html_code


@app.route('/courses/<course_id>', methods=['DELETE'])
@cross_origin(origin=site_url,headers=['Content-Type','Authorization'])
def remove_course(course_id):
    courses = mongo.db.courses
    course_removed = courses.remove({"id":int(course_id)})
    if course_removed:
        output = "Course successfully removed"
        html_code = 200
    else:
        output = "Could not remove course"
        html_code = 400
    return jsonify({'result': output}), html_code



@app.route('/creneaux/', methods=['GET'])
@cross_origin(origin=site_url,headers=['Content-Type','Authorization'])
def get_all_creneaux():
    creneaux = mongo.db.creneaux
    all_creneaux = creneaux.find()
    Output = []
    for creneau in all_creneaux:
        output={}
        output["id"] = creneau["id"]
        output["day"] = creneau["day"]
        output["begin"] = creneau["begin"]
        output["end"] = creneau["end"]
        output["type"] = creneau["type"]
        Output.append(output)
        html_code = 200
    return jsonify({'result': Output}), html_code


@app.route('/creneaux/<creneaux_id>', methods=['GET'])
@cross_origin(origin=site_url,headers=['Content-Type','Authorization'])
def get_creneau_by_id(creneau_id):
    creneaux = mongo.db.creneaux
    creneau = creneaux.find_one({"id": int(creneau_id)})
    if creneau:
        output={}
        output["id"] = creneau["id"]
        output["day"] = creneau["day"]
        output["begin"] = creneau["begin"]
        output["end"] = creneau["end"]
        output["type"] = creneau["type"]
        html_code = 200
    else:
        output = "No matching creneau for id " + str(course_id)
        html_code = 400
    return jsonify({'result': output}), html_code

@app.route('/creneaux/by-promotion/<promo>', methods=['GET'])
@cross_origin(origin=site_url,headers=['Content-Type','Authorization'])
def get_creneau_by_promo(promo):
    creneaux = mongo.db.creneaux.find({"type" : {'$regex': promo}})
    Output = []
    for creneau in creneaux:
        if promo in creneau["type"]:
            output={}
            output["id"] = creneau["id"]
            output["day"] = creneau["day"]
            output["begin"] = creneau["begin"]
            output["end"] = creneau["end"]
            output["type"] = creneau["type"]
            Output.append(output)
        html_code = 200
    return jsonify({'result': Output}), html_code


@app.route('/creneaux/<creneau_id>', methods=['POST'])
@cross_origin(origin=site_url,headers=['Content-Type','Authorization'])
def update_creneau(creneau_id):
    creneaux = mongo.db.creneaux
    new_day = request.get_json(force=True)['day']
    new_begin = request.get_json(force=True)['begin']
    new_end = request.get_json(force=True)['end']
    new_type = request.get_json(force=True)['type']
    creneau_updated = courses.update({"id":int(creneau_id)}, {"id":int(creneau_id),
                                                           "day":new_day,
                                                           "begin":new_begin,
                                                           "end":new_end,
                                                           "type":new_type})
    if creneau_updated:
        output = "Creneau with id "+creneau_id+" updated successfully"
        html_code = 200
    else:
        output = "No matching creneau for id " + str(creneau_id)
        html_code = 400
    return jsonify({'result': output}), html_code


@app.route('/creneaux/', methods=['PUT'])
@cross_origin(origin=site_url,headers=['Content-Type','Authorization'])
def add_creneau():
    creneaux = mongo.db.creneaux
    id = get_max_course_id()+1
    new_day = request.get_json(force=True)['day']
    new_begin = request.get_json(force=True)['begin']
    new_end = request.get_json(force=True)['end']
    new_type = request.get_json(force=True)['type']
    creneau_inserted = courses.insert({"id":int(creneau_id),
                                                           "day":new_day,
                                                           "begin":new_begin,
                                                           "end":new_end,
                                                           "type":new_type})
    if course_inserted:
        output = {"id":id}
        html_code = 200
    else:
        output = "Could not add course"
        html_code = 400
    return jsonify({'result': output}), html_code


@app.route('/creneaux/<creneau_id>', methods=['DELETE'])
@cross_origin(origin=site_url,headers=['Content-Type','Authorization'])
def remove_creneau(creneau_id):
    creneaux = mongo.db.creneaux
    creneau_removed = creneaux.remove({"id":int(creneau_id)})
    if creneau_removed:
        output = "Creneau successfully removed"
        html_code = 200
    else:
        output = "Could not remove creneau"
        html_code = 400
    return jsonify({'result': output}), html_code

@app.route('/users/students/<student_id>', methods=['GET'])
@cross_origin(origin=site_url,headers=['Content-Type','Authorization'])
def get_student_by_id(student_id):
    users = mongo.db.users
    student = users.find_one({"type": "student", "id": int(student_id)})
    if student:
        output={}
        output["id"] = student["id"]
        output["name"] = student["name"]
        output["email"] = student["email"]
        output["vows"] = student["vows"]
        html_code = 200
    else:
        output = "No matching student for id " + str(student_id)
        html_code = 400
    return jsonify({'result': output}), html_code

@app.route('/users/students/', methods=['GET'])
@cross_origin(origin=site_url,headers=['Content-Type','Authorization'])
def get_student_by_session():
    users = mongo.db.users
    try:
        current_id = session["id"]
    except:
        res = make_response("Error 300 : Unauthorized Access")

        return res, html_code
    student = users.find_one({"type": "student", "id": int(session["id"])})
    if student:
        output={}
        output["id"] = student["id"]
        output["name"] = student["name"]
        output["email"] = student["email"]
        output["vows"] = student["vows"]
        html_code = 200
    else:
        output = "No matching student for id " + str(student_id)
        html_code = 400
    return jsonify({'result': output}), html_code

@app.route('/users/students/', methods=['PUT'])
@cross_origin(origin=site_url,headers=['Content-Type','Authorization'])
def add_student():
    users = mongo.db.users
    id = get_max_collection_id(users)+1
    new_name = request.get_json(force=True)['name']
    new_email = request.get_json(force=True)['email']
    new_token = ''.join(random.choices(string.ascii_uppercase +string.ascii_lowercase+ string.digits, k=35))
    student_inserted = users.insert({"id":int(id),
                                                           "name":new_name,
                                                           "email":new_email,
                                                           "token":new_token,
                                                           "vows":[],
                                                           "courses":[],
                                                           "type":"student"})
    if student_inserted:
        output = {"id":id}
        html_code = 200
    else:
        output = "Could not add student"
        html_code = 400
    return jsonify({'result': output}), html_code

@app.route('/users/students/<student_id>', methods=['POST'])
@cross_origin(origin=site_url,headers=['Content-Type','Authorization'])
def update_student_vows(student_id):
    users = mongo.db.users
    new_vows = request.get_json(force=True)['vows']
    student_updated = users.update({"id":int(student_id)}, {"vows": new_vows})
    if student_updated:
        html_code = 200
    else:
        output = "Could not add student"
        html_code = 400
    return jsonify({'result': output}), html_code


@app.route('/login/')
@cross_origin(origin=site_url,headers=['Content-Type','Authorization'])
def login_service():
    token = request.args.get('id')
    users = mongo.db.users
    student = users.find_one({"token" : token})
    if student:
        session["user_id"] = student["id"]

        html_code = 200
        res = make_response(redirect("http://www.localhost:3000/"))

        return res, html_code
    else:
        output = "No matching student for this token"
        html_code = 400
        return jsonify({"result":output}),html_code






@app.route('/solve-courses/', methods=['POST'])
@cross_origin(origin=site_url,headers=['Content-Type','Authorization'])
def solve_courses():
    students_from_db = mongo.db.users.find({"type" : "student"})
    students = []
    for student_from_db in students_from_db:
        current_student = data_structs.student(id = student_from_db["id"])
        current_vows = []
        for vow_from_db in student_from_db["vows"]:
            current_vow = data_structs.vow()
            current_vow.from_dict(vow_from_db)
            current_student.vows.append(current_vow)

        current_student.name = student_from_db["name"]
        current_student.id = student_from_db["id"]
        students.append(current_student)
    courses_from_db = mongo.db.courses.find()
    courses = []
    for course_from_db in courses_from_db:
        course = data_structs.course(course_from_db["id"],
                        course_from_db["name"],
                        course_from_db["language"],
                        course_from_db["creneaux"],
                        course_from_db["min_students"],
                        course_from_db["max_students"])
        courses.append(course)
    solve(courses, students)
    for student in students:
        mongo.db.users.update_one({"id" : student.id}, {"$set":{"courses" : [c.to_dict() for c in student.courses]}})
    return jsonify(students), 400




if __name__ == '__main__':
    app.run(debug=True)
