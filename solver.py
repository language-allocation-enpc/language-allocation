from pymprog import *
from random_data import *
import random as rd
from utils import *



#Generating data
NB_STUDENTS = rd.randint(15, 30)
COURSES = generate_random_course_list()
VOWS = generate_vow_dic(COURSES)
STUDENTS = generate_random_population(COURSES, VOWS, NB_STUDENTS)

for student in STUDENTS:
    print([v.id for v in student.vows])
NB_VOWS = len(VOWS)
print('done with generating')
#indexing the set of students
S=range(len(STUDENTS))

#indexing the set of courses
C=range(len(COURSES))

#indexation of wishes for cartesian product
V=range(NB_VOWS)

#cartesian product of S and W
SxV=iprod(S, V)


##solving linear problem

assignment_model = model("assign")

# Variables
course_is_open = assignment_model.var('course is open', C)
course_headcount = assignment_model.var('course headcount', C)
student_gets_vow = assignment_model.var('student gets wish', SxV)

# Objective function
assignment_model.min(sum(
    weights_list(len(STUDENTS[s].vows), len(V))[v] * student_gets_vow[s, v]
    for s, v in SxV
))

# Constraints
for student in S:
    sum(student_gets_vow[student, v] for v in V) == 1
for course in C:
    course_is_open[course]<=1
    sum(student_gets_vow[s, v] * int(COURSES[course] in STUDENTS[s].vows[v].courses) for s, v in SxV) == course_headcount[course]
    COURSES[course].min_students*course_is_open[course] <= course_headcount[course]
    COURSES[course].max_students*course_is_open[course] >= course_headcount[course]

# Solve
assignment_model.solve()

## building results

result=[0 for student in S]

for student, vow in SxV:
    if student_gets_vow[student, vow].primal!=0:
        result[student]=vow

## results display

print("Total cost = ", assignment_model.vobj())
