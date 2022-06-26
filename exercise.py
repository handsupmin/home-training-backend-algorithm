# exercise.py
# 운동 후 가중치 변경

import sys
import pymysql
import json
import config
from sklearn.preprocessing import MinMaxScaler


def connect_db():
    conn = pymysql.connect(host=config.DATABASE_CONFIG['host'],
                           user=config.DATABASE_CONFIG['user'],
                           password=config.DATABASE_CONFIG['password'],
                           db=config.DATABASE_CONFIG['dbname'],
                           port=config.DATABASE_CONFIG['port'])

    return conn


def calc_Calendar(title, count):
    sql = 'SELECT difficulty FROM exercise WHERE name = '
    sql += "'" + title + "'"
    print("운동:", title, ", 횟수:", count)

    cursor.execute(sql)

    rows = cursor.fetchall()

    a = float(rows[0][0])

    return round(a * count * 0.0005, 4)


def select_exercise(name, result):
    a = [0] * 9
    sql = 'SELECT 어깨,팔,가슴,등,복부,코어,엉덩이,허벅지,전신 FROM exercise WHERE name = '
    sql += "'" + name + "'"

    cursor.execute(sql)

    rows = cursor.fetchall()
    for j in range(len(rows)):
        a = [x+(y*result) for x, y in zip(a, rows[j])]
    return a


def select_user(id):
    b = [0] * 9
    sql = 'SELECT user_어깨,user_팔,user_가슴,user_등,user_복부,user_코어,user_엉덩이,user_허벅지,user_전신 FROM user_routine WHERE user_id = '
    sql += "'" + id + "'"

    cursor.execute(sql)

    rows = cursor.fetchall()

    for i in range(len(rows)):
        b = [x+y for x, y in zip(b, rows[i])]
    return b


def minmax(list):
    data = [[x] for x in list]

    scailer = MinMaxScaler()

    data = scailer.fit_transform(data)
    data = [round(x[0], 4) for x in data]

    return data


def update_user(list, id, index):
    sql = 'UPDATE user_routine SET '

    for i in range(len(list)):
        sql += user_list[i] + ' = ' + str(list[i])
        if(i == len(list)-1):
            break
        sql += ', '

    sql += ', user_prefer = ' + str(index) + ' WHERE user_id = ' + "'" + id + "'"

    cursor.execute(sql)
    conn.commit()


conn = connect_db()
cursor = conn.cursor()

user_list = ['user_어깨', 'user_팔', 'user_가슴', 'user_등', 'user_복부', 'user_코어', 'user_엉덩이', 'user_허벅지', 'user_전신']

user_id = sys.argv[1]
calendar_title = sys.argv[2]
calendar_count = float(sys.argv[3])
calendar_minute = sys.argv[4]
calendar_second = sys.argv[5]

if calendar_title == '플랭크' or calendar_title == '크런치' or calendar_title == '러닝' or calendar_title == '홈사이클':
    calendar_count = round(float(calendar_minute) + (float(calendar_second)/60), 4)

list1 = [0] * 9
list2 = [0] * 9
result = [0] * 9
index = 0

prm = calc_Calendar(calendar_title, calendar_count)
list1 = select_exercise(calendar_title, prm)
list2 = select_user(user_id)

for i in range(len(result)):
    result = [x+y for x, y in zip(list1, list2)]

result = minmax(result)

print('=' * 20, end=" ")
print("연산", end=" ")
print('=' * 20)

print("계산 가중합: ", list1)
print("유저 가중치: ", list2)
print("가중치 연산 결과: ", result)

for i in range(len(result)):
    if result[i] == 1:
        index = i+1

update_user(result, user_id, index)

conn.close()