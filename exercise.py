# exercise.py
# 운동 후 가중치 변경

import pymysql
import json
import sys
from sklearn.preprocessing import MinMaxScaler

conn = pymysql.connect(secret)
cursor = conn.cursor()

user_list = ['User_어깨','User_팔','User_가슴','User_등','User_복부','User_코어','User_엉덩이','User_허벅지','User_전신']

User_id = sys.argv[1]
Calendar_title = sys.argv[2]
Calendar_count = float(sys.argv[3])
Calendar_minute = sys.argv[4]
Calendar_second = sys.argv[5]
if Calendar_title == '플랭크' or Calendar_title == '크런치' or Calendar_title == '러닝' or Calendar_title == '홈사이클':
    Calendar_count = round(float(Calendar_minute) + (float(Calendar_second)/60), 4)

list1 = [0] * 9
list2 = [0] * 9
result = [0] * 9
index = 0

def calc_Calendar(title, count):
    sql = 'select difficulty from Exercise where name = '
    sql += "'" + title + "'"
    print("운동:",title,", 횟수:",count)
    
    cursor.execute(sql)
    
    rows = cursor.fetchall()

    a = float(rows[0][0])
    
    return round(a * count * 0.0005, 4)

def select_Exercise(name, result):
    a = [0] * 9
    sql = 'select 어깨,팔,가슴,등,복부,코어,엉덩이,허벅지,전신 from Exercise where name = '
    sql += "'" + name + "'"

    cursor.execute(sql)
    
    rows = cursor.fetchall()
    for j in range(len(rows)):
        a = [x+(y*result) for x,y in zip(a,rows[j])]
    return a

def select_User(id):
    b = [0] * 9
    sql = 'select User_어깨,User_팔,User_가슴,User_등,User_복부,User_코어,User_엉덩이,User_허벅지,User_전신 from User_routine where User_id = '
    sql += "'" + id + "'"

    cursor.execute(sql)

    rows = cursor.fetchall()

    for i in range(len(rows)):
        b = [x+y for x,y in zip(b,rows[i])]
    return b

def minmax(list):
    data = [[x] for x in list]

    scailer = MinMaxScaler()
    data = scailer.fit_transform(data)
    data = [round(x[0], 4) for x in data]
    return data

def update_User(list, id, index):
    sql = 'update User_routine set '
    for i in range(len(list)):
        sql += user_list[i] + ' = ' + str(list[i])
        if(i == len(list)-1):
            break
        sql += ', '
    sql += ', User_prefer = ' + str(index) + ' where User_id = ' + "'" + id + "'"

    cursor.execute(sql)
    conn.commit()

prm = calc_Calendar(Calendar_title, Calendar_count)
list1 = select_Exercise(Calendar_title, prm)
list2 = select_User(User_id)

for i in range(len(result)):
    result = [x+y for x,y in zip(list1,list2)]

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

update_User(result, User_id, index)


conn.close()