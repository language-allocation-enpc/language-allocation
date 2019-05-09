import random as rd


class course:
    def __init__(self, id=-1, min_students=0, max_students=0):
        self.min_students = min_students
        self.max_students = max_students
        self.id = id
    def __eq__(self, other):
        return self.id == other.id

class vow:
    def __init__(self, courses=[]):
        self.nb_courses = len(courses)
        self.courses = courses
    def __eq__(self, other):
        if self.nb_courses == other.nb_courses:
            for i_course in range(self.nb_courses): #les voeux doivent être ordonnées pour garantir une comparaison correcte
                if self.courses[i_course] != other.courses[i_course]:
                    return False
            return True
        return False


class student:
    def __init__(self):
        self.name = ''
        self.vows = []
