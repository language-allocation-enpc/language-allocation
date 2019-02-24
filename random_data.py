import names
import string
from data_structs import *
from utils import weights_list
import random as rd

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
    result.name = generate_random_string()
    result.creneau = rd.randint(1, 9)
    return result


def generate_random_course_list():
    id = 0
    result = []
    result_size = rd.randint(10,15)
    for i in range(result_size):
        result.append(generate_random_course(id))
        id+=1
    return result

def generate_vow_dic(courses):
    vow_dic = {}
    current_id = 1
    for course_1 in courses:
        for course_2 in courses:
            vow_1_2 = vow()
            vow_1_2.courses = [course_1, course_2]
            vow_1_2.nb_courses = 2
            if vow_1_2 not in vow_dic.values() and course_1 != course_2:
                vow_1_2.id = current_id
                vow_dic[vow_1_2.id] = vow_1_2
                current_id += 1
            for course_3 in courses:
                vow_1_2_3 = vow()
                vow_1_2_3.courses = [course_1, course_2, course_3]
                vow_1_2_3.nb_courses = 3
                if vow_1_2_3 not in vow_dic.values() and course_1 != course_2 and course_1 != course_3 and course_2 != course_3:
                    vow_1_2_3.id = current_id
                    vow_dic[vow_1_2_3.id] = vow_1_2_3
                    current_id += 1
    return vow_dic

def add_implicit_vows(student, vow_dic):
    original_vows = student.vows.copy()
    for vow in vow_dic.values():
        if vow not in original_vows:
            student.vows += [vow]


def generate_random_vow(courses, vow_dic):
    return rd.choice(list(vow_dic.values()))


def generate_random_student(courses, vow_dic):
    result = student()
    result.name = generate_random_name()
    nb_vows = rd.randint(1,30)
    for i in range(nb_vows):
        current_vow = generate_random_vow(courses, vow_dic)
        result.vows.append(current_vow)
    add_implicit_vows(result, vow_dic)
    return result


def generate_random_population(courses, vow_dic, size):
    return [generate_random_student(courses, vow_dic) for i in range(size)]


if __name__ == '__main__':
    POP_SIZE = 50
    courses = generate_random_course_list()
    population = generate_random_population(courses, POP_SIZE)
    for stu in population:
        print(stu.name)
        for vow in stu.vows:
            print(str([vow.courses[i].name for i in range(len(vow.courses))])+' , '+ str(vow.weight))
        print('\n')
