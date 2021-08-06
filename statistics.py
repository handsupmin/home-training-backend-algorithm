# statistics.py
# 통계 계산

import pymysql
import json
import sys

conn = pymysql.connect(secret)
cursor = conn.cursor()

User_id = sys.argv[1]
Calendar_month = sys.argv[2]


calendar = [0] * 32
part = [0] * 9
part_name = ['어깨','팔','가슴','등','복부','코어','엉덩이','허벅지','전신']
exercise_minute = [0] * 4
exercise_second = [0] * 4 

time_exercise_name = []
time_exercise_time = []
time_exercise_minute = []
time_exercise_second = []
time_exercise_freq = []
count_exercise_name = []
count_exercise_count = []
count_exercise_freq = []


def select_Calendar(User_id, Calendar_month):
    sql = 'select Calendar_date, Calendar_title, Calendar_count, Calendar_minute, Calendar_second from Calendar where User_id = '
    sql += "'" + User_id + "' AND Calendar_date like '%" + Calendar_month + "%'"
    cursor.execute(sql)    
    rows = cursor.fetchall()
    return rows

def select_Exercise():
    sql = 'select id, name from Exercise'
    cursor.execute(sql)    
    rows = cursor.fetchall()
    exercise = [0] * (len(rows) + 1)
    for j in range(len(rows)):
        exercise[rows[j][0]] = rows[j][1]

    return exercise

def printer(data):
    for j in range(len(data)):
        print(data[j])

def calc_Count(data):
    t_list = [12, 17, 25, 26]
    for i in range(len(data)):
        date = data[i][0][-3] + data[i][0][-2]
        calendar[int(date)] += 1
        index = exercise_list.index(data[i][1])
        if index == 12 or index == 17 or index == 25 or index == 26:
            if index == 12:
                exercise_minute[0] += data[i][3]
                exercise_second[0] += data[i][4]
            elif index == 17:
                exercise_minute[1] += data[i][3]
                exercise_second[1] += data[i][4]
            elif index == 25:
                exercise_minute[2] += data[i][3]
                exercise_second[2] += data[i][4]
            else:
                exercise_minute[3] += data[i][3]
                exercise_second[3] += data[i][4]
            exercise_frequency[index] += 1
        else:
            exercise_frequency[index] += 1
            exercise_count[index] += data[i][2]
    for i in range(4):
        exercise_minute[i] += exercise_second[i] // 60
        exercise_second[i] %= 60
        exercise_count[t_list[i]] += exercise_minute[i] + round(exercise_second[i]*0.01,3)

def calc_Part(data):
    for j in range(len(data)):
        global part
        sql = 'select 어깨,팔,가슴,등,복부,코어,엉덩이,허벅지,전신 from Exercise where name = '
        sql += "'" + data[j][1] + "'"

        cursor.execute(sql)
        
        rows = cursor.fetchall()
        for j in range(len(rows)):
            part = [x+y for x,y in zip(part,rows[j])]

def split_List():
    for i in range(1, len(exercise_list)):
        if exercise_frequency[i] != 0:
            if i == 12 or i == 17 or i == 25 or i == 26:
                time_exercise_name.append(exercise_list[i])
                time_exercise_time.append(round(exercise_count[i],3))
                time_exercise_freq.append(exercise_frequency[i])
            else:
                count_exercise_name.append(exercise_list[i])
                count_exercise_count.append(exercise_count[i])
                count_exercise_freq.append(exercise_frequency[i])

def quick_sort(array, array1, array2, start, end):
    if start >= end:
        return
    pivot = start
    left = start + 1
    right = end
    while left <= right:
        while left <= end and array[left] <= array[pivot]:
            left += 1
        while right > start and array[right] >= array[pivot]:
            right -= 1
        if left > right:
            array[pivot], array[right] = array[right], array[pivot]
            array1[pivot], array1[right] = array1[right], array1[pivot]
            array2[pivot], array2[right] = array2[right], array2[pivot]
        else:
            array[right], array[left] = array[left], array[right]
            array1[right], array1[left] = array1[left], array1[right]
            array2[right], array2[left] = array2[left], array2[right]
    quick_sort(array,array1,array2, start, right - 1)
    quick_sort(array,array1,array2, right + 1, end)

def quick_sort2(array, array1, start, end):
    if start >= end:
        return
    pivot = start
    left = start + 1
    right = end
    while left <= right:
        while left <= end and array[left] <= array[pivot]:
            left += 1
        while right > start and array[right] >= array[pivot]:
            right -= 1
        if left > right:
            array[pivot], array[right] = array[right], array[pivot]
            array1[pivot], array1[right] = array1[right], array1[pivot]
        else:
            array[right], array[left] = array[left], array[right]
            array1[right], array1[left] = array1[left], array1[right]
    quick_sort2(array,array1, start, right - 1)
    quick_sort2(array,array1, right + 1, end)

exercise_list = select_Exercise()
exercise_count = [0] * len(exercise_list)
exercise_frequency = [0] * len(exercise_list)

data = select_Calendar(User_id, Calendar_month)

calc_Count(data)
calc_Part(data)
split_List()
quick_sort(time_exercise_time,time_exercise_name,time_exercise_freq, 0, len(time_exercise_time)-1)
quick_sort(count_exercise_count,count_exercise_name,count_exercise_freq, 0, len(count_exercise_count)-1)
quick_sort2(part, part_name, 0, len(part)-1)
time_exercise_time.reverse()
for i in range(len(time_exercise_time)):
    a, b = map(int, str(time_exercise_time[i]).split('.'))
    time_exercise_minute.append(a)
    time_exercise_second.append(b)
time_exercise_name.reverse()
time_exercise_freq.reverse()
count_exercise_count.reverse()
count_exercise_name.reverse()
count_exercise_freq.reverse()
part.reverse()
part_name.reverse()

print('가장 많이 한 부위')
print(part_name)
print(part)
print('운동 한 날짜(1부터 31), 0번째 인덱스 제외')
print(calendar)
print('시간 별 정렬')
print(time_exercise_name)
print('분')
print(time_exercise_minute)
print('초')
print(time_exercise_second)
print('빈도')
print(time_exercise_freq)
print('개수 별 정렬')
print(count_exercise_name)
print('개수')
print(count_exercise_count)
print('빈도')
print(count_exercise_freq)
    
conn.close()