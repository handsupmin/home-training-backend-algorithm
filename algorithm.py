# algorithm.py
# 사용자 운동 추천 알고리즘

import pymysql
import json
import sys
from sklearn.preprocessing import MinMaxScaler

conn = pymysql.connect(secret)
cursor = conn.cursor()

lines = sys.stdin.readlines()

user_list = ['User_어깨','User_팔','User_가슴','User_등','User_복부','User_코어','User_엉덩이','User_허벅지','User_전신']
User_id = int(json.loads(lines[0])['User_id'])
Exercise_id = json.loads(lines[0])['id']
list1 = [0] * 9
list2 = [0] * 9
result = [0] * 9
index = 0

def select_Exercise(Exercise_id):
    a = [0] * 9
    sql = 'select 어깨,팔,가슴,등,복부,코어,엉덩이,허벅지,전신 from Exercise where '

    for i in range(len(Exercise_id)):
        sql += 'id = ' + Exercise_id[i]
        if(i == len(Exercise_id)-1):
            break;
        sql += ' or '

    cursor.execute(sql)
    
    rows = cursor.fetchall()

    for j in range(len(rows)):
        a = [x+y for x,y in zip(a,rows[j])]
    print("운동 가중치: ",a)
    return a

def select_User(id):
    b = [0] * 9
    sql = 'select User_어깨,User_팔,User_가슴,User_등,User_복부,User_코어,User_엉덩이,User_허벅지,User_전신 from User_routine where id = '
    sql += str(id)

    cursor.execute(sql)

    rows = cursor.fetchall()

    for i in range(len(rows)):
        b = [x+y for x,y in zip(b,rows[i])]
    print("유저 가중치: ",b)
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
            break;
        sql += ', '
    sql += ', User_prefer = ' + str(index) + ' where id = ' + str(id)

    cursor.execute(sql)
    conn.commit()



list1 = minmax(select_Exercise(Exercise_id))
list2 = minmax(select_User(User_id))

for i in range(len(result)):
    result = [x+y for x,y in zip(list1,list2)]

result = minmax(result)

print('=' * 20, end=" ")
print("연산", end=" ")
print('=' * 20)

print("운동 가중치: ",list1)
print("유저 가중치: ",list2)
print("가중합 결과: ",result)

for i in range(len(result)):
    if result[i] == 1:
        index = i+1

update_User(result, User_id, index)

conn.close()
