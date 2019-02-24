import random as rd


class course:
    def __init__(self):
        self.min_students = 0
        self.max_students = 0
        self.id = -1
        self.language = ''
        self.name = ''
        self.creneau = -1
    def __eq__(self, other):
        return self.id == other.id

class vow:
    def __init__(self):
        self.nb_courses = 0
        self.courses = []
        self.id = -1
    def __hash__(self):
        return hash((self.id))
    def __eq__(self, other):
        if self.nb_courses == other.nb_courses:
            for i_course in range(self.nb_courses):
                if self.courses[i_course] != other.courses[i_course]:
                    return False
            return True
        return False


class student:
    def __init__(self):
        self.name = ''
        self.vows = []
