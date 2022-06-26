# algorithm.py
# 사용자 운동 추천 알고리즘

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


def select_exercise(exercise_id):
    exercise_weight = [0] * 9
    sql = 'SELECT 어깨, 팔, 가슴, 등, 복부, 코어, 엉덩이, 허벅지, 전신 FROM exercise WHERE id IN %s'
    param = str(tuple(exercise_id))

    cursor.execute(sql % (param))

    rows = cursor.fetchall()

    for j in range(len(rows)):
        exercise_weight = [x + y for x, y in zip(exercise_weight, rows[j])]

    print("운동 가중치: ", exercise_weight)
    return exercise_weight


def select_user(user_id):
    user_weight = [0] * 9

    sql = 'SELECT user_어깨, user_팔, user_가슴, user_등, user_복부, user_코어, user_엉덩이, user_허벅지, user_전신 FROM user_routine WHERE id = %s'

    cursor.execute(sql, user_id)

    rows = cursor.fetchall()

    for i in range(len(rows)):
        user_weight = [x + y for x, y in zip(user_weight, rows[i])]

    print("유저 가중치: ", user_weight)
    return user_weight


def minmax(list):
    data = [[x] for x in list]

    scailer = MinMaxScaler()

    data = scailer.fit_transform(data)
    data = [round(x[0], 4) for x in data]

    return data


def update_user(weights, id, index):
    sql = 'UPDATE user_routine SET '
    param = tuple(weights) + (index, id)

    for i in range(len(weights)):
        sql += part_list[i] + ' = %s, '

    sql += ' user_prefer = %s WHERE id = %s'

    cursor.execute(sql, param)
    conn.commit()


conn = connect_db()
cursor = conn.cursor()

# lines = sys.stdin.readlines()
lines = '''{
    "user_id": 1,
    "id": [1, 2, 3]
}'''

part_list = ['user_어깨', 'user_팔', 'user_가슴', 'user_등', 'user_복부', 'user_코어', 'user_엉덩이', 'user_허벅지', 'user_전신']

user_id = int(json.loads(lines)['user_id'])
exercise_id = json.loads(lines)['id']

list1 = [0] * 9
list2 = [0] * 9
result = [0] * 9
index = 0

list1 = minmax(select_exercise(exercise_id))
list2 = minmax(select_user(user_id))

for i in range(len(result)):
    result = [x + y for x, y in zip(list1, list2)]

result = minmax(result)

print("=" * 30 + "연산" + "=" * 30)

print("운동 가중치: ", list1)
print("유저 가중치: ", list2)
print("가중합 결과: ", result)

for i in range(len(result)):
    if result[i] == 1:
        index = i + 1

update_user(result, user_id, index)

conn.close()
