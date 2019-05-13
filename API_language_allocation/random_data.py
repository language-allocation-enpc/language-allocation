import names
import string
from data_structs import *
import random as rd
import numpy as np

LANGUAGES = ['Anglais', 'Espagnol', 'Allemand', 'Russe', 'Italien', 'Arabe', 'Japonais']


def generate_random_string():
    len = rd.randint(7,35)
    allchar = string.ascii_letters + ' '
    return ''.join([rd.choice(allchar) for i in range(len)])


def generate_random_name():
    return names.get_full_name()


def generate_random_names(n):
    return [generate_random_name() for i in range(n)]


def generate_random_course(last_id):
    result = course()
    result.min_students = rd.randint(2,9)
    result.max_students = rd.randint(result.min_students+4, 30)
    result.id = last_id + 1
    return result


def generate_random_course_list(result_size):
    id = 0
    result = []
    for i in range(result_size):
        result.append(generate_random_course(id))
        id+=1
    return result


def generate_random_vow(courses, nb_courses_in_vow=3): #generates a vow with nb_courses_in_vow courses
    result = vow()
    random_distinct_courses=[]
    for i in range(nb_courses_in_vow):
        random_course=rd.choice(courses)
        while( random_course in random_distinct_courses):
            random_course=rd.choice(courses)
        random_distinct_courses.append(random_course)
    random_distinct_courses.sort(key=lambda x: x.id) #sorts the list of courses by id
    result.courses=random_distinct_courses
    result.nb_courses=len(random_distinct_courses)
    return result

def generate_random_vow_matrix_and_weight_matrix(num_students, num_vows, courses):
    vow_matrix=np.zeros((num_students, num_vows, len(courses)))
    weight_matrix=np.zeros((num_students, num_vows))
    for student in range(num_students):
        current_cost=rd.randint(10, 20)
        for student_vow in range(num_vows):
            new_vow=generate_random_vow(courses, rd.randint(1, 4))
            for course_in_vow in range(len(new_vow.courses)):
                vow_matrix[student, student_vow, new_vow.courses[course_in_vow].id-1]=1
            weight_matrix[student, student_vow]=current_cost
            current_cost+=rd.randint(1, 4)
    return vow_matrix, weight_matrix



def generate_random_student(courses, nb_vows, nb_courses_in_vow):
    result = student()
    result.name = generate_random_name()
    for i in range(nb_vows):
        current_vow = generate_random_vow(courses, nb_courses_in_vow)
        result.vows.append(current_vow)
    return result


def generate_random_population(courses, nb_vows, nb_courses_in_vow, size):
    return [generate_random_student(courses, nb_vows, nb_courses_in_vow) for i in range(size)]


"""if __name__ == '__main__':
    POP_SIZE = 50
    courses = generate_random_course_list()
    population = generate_random_population(courses, POP_SIZE)
    for stu in population:
        print(stu.name)
        for vow in stu.vows:
            print(str([vow.courses[i].name for i in range(len(vow.courses))])+' , '+ str(vow.weight))
        print('\n')"""
