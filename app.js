var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var multer = require('multer');
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, function () {
    console.log('서버 실행');
});

var connection = mysql.createConnection({
    secret
});

const storage = multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, "project/communityimg/");
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const upload = multer({storage:storage});
 
app.post('/community/board/image', upload.array('photo',3), (req, res) => {
    console.log(req.files);
});

app.post('/user/join', function (req, res) {
    var User_name = req.body.User_name;
    var User_birth = req.body.User_birth;
    var User_id = req.body.User_id;
    var User_pwd = req.body.User_pwd;
    var User_gender= req.body.User_gender;
    var User_nickname= req.body.User_nickname;
    var User_phone= req.body.User_phone;
    var User_height= req.body.User_height;
    var User_weight= req.body.User_weight;
    var sql = 'INSERT INTO User_table (User_name, User_birth, User_id, User_pwd, User_gender, User_nickname, User_phone, User_height, User_weight ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    var params = [User_name, User_birth, User_id, User_pwd, User_gender, User_nickname, User_phone, User_height, User_weight];
    connection.query(sql, params, function (err, result) {
        if (err)
            console.log(err);
        else {
            res.json({
                result: true
            });
        }
    })
});

app.post('/user/join/checkId', function (req, res) {
    var User_id = req.body.User_id;
    var sql = 'select * from User_table where User_id = ?';
    connection.query(sql, User_id, function (err, result) {
        if (err)
            console.log(err);
        else {
            if (result.length === 0) {
                res.json({
                    result: true,
                    message: '사용가능한 아이디입니다.'
                });
            } else {
                res.json({
                        result: false,
                    message: '중복된 아이디가 존재합니다'
                });
            }
        }
    })
});

app.post('/user/join/checkNickname', function (req, res) {
    var User_nickname = req.body.User_nickname;
    var sql = 'select * from User_table where User_nickname = ?';
    connection.query(sql, User_nickname, function (err, result) {
        if (err)
            console.log(err);
        else {
            if (result.length === 0) {
                res.json({
                    result: true,
                    message: '사용가능한 닉네임입니다.'
                });
            } else {
                res.json({
                        result: false,
                    message: '중복된 닉네임이 존재합니다'
                });
            }
        }
    })
});

app.post('/user/login', function (req, res) {
    var User_id = req.body.User_id;
    var User_pwd = req.body.User_pwd;
    var sql = 'select * from User_table where User_id = ? AND User_pwd = ?';
    var params = [User_id, User_pwd];
    connection.query(sql, params, function (err,result) {
        if (err)
            console.log(err);
        else {
            if (result.length === 0) {
                res.json({
                    result: false,
                    message: '존재하지 않는 계정입니다!'
                });
            } else if (User_pwd !== result[0].User_pwd) {
                res.json({
                    result: false,
                    message: '비밀번호가 틀렸습니다!'
                });
            } else {
                res.json({
                    result: true,
                    message: '로그인 성공!',
                    User_id: User_id,
                    User_name: result[0].User_name,
                    User_birth: result[0].User_birth,
                    User_gender: result[0].User_gender,
                    User_nickname: result[0].User_nickname,
                    User_phone: result[0].User_phone,
                    User_height: result[0].User_height,
                    User_weight: result[0].User_weight,
                    User_strength: result[0].User_strength,
                    User_goal: result[0].User_goal
                });
            }
        }
    })
});

app.post('/community/write/', function (req, res) {
    var Board_date = req.body.Board_date;
    var User_id = req.body.User_id;
    var User_nickname = req.body.User_nickname;
    var Board_title = req.body.Board_title;
    var Board_context = req.body.Board_context;
    var Board_countcomment = req.body.Board_countcomment;
    var Img_num = req.body.Img_num;
    var sql = 'INSERT INTO Board (User_nickname, User_id, Board_date, Board_title, Board_context, Board_countcomment, Img_num ) VALUES (?, ?, ?, ?, ?, ?, ?)';
    var params = [User_nickname, User_id, Board_date, Board_title, Board_context, Board_countcomment, Img_num];

    connection.query(sql, params, function (err, result) {
        if (err) {
            res.json({
                result: false,
                message: 'fail'
            })
            console.log(err);
        }
        else {
            res.json({
                result: true,
                message: '게시글을 등록했습니다.'
            })
        }
    });
});

app.post('/community/write/comment', function (req, res) {
    var Board_number = req.body.Board_number;
    var Comment_date = req.body.Comments_date;
    var User_id = req.body.User_id;
    var User_nickname = req.body.User_nickname;
    var Comment_context = req.body.Comments_context;
    var sql = 'INSERT INTO Comments ( User_nickname, User_id, Board_number, Comments_date, Comments_context ) VALUES (?, ?, ?, ?, ?)';
    var params = [User_nickname, User_id, Board_number, Comment_date, Comment_context];

    connection.query(sql, params, function (err, result) {
        if (err) {
                res.json({
                result: false,
                message: 'fail'
            })
            console.log(err);
        }
        else {
            res.json({
                result: true,
                message: '정상적으로 댓글을 등록했습니다.'
            })
        }
    });
});

app.post('/community/load', function (req, res) {
var sql = 'select * from Board';
    var response = new Array();
    var a = new Object();
    connection.query(sql, function (err,result) {
        if (err)
            console.log(err);
        else {
            if (result.length === 0) {
                res.json({
                    result: false,
                    message: '게시글이 존재하지 않습니다'
                });
            } else {for ( i = result.length - 1 ; i > -1 ; i--) {
                a.User_id= result[i].User_id;
                a.User_nickname= result[i].User_nickname;
                a.Board_number= result[i].Board_number;
                a.Board_title= result[i].Board_title;
                a.Board_context= result[i].Board_context;
                a.Board_date= result[i].Board_date;
                a.Board_count= result[i].Board_count;
                a.Board_countcomment= result[i].Board_countcomment;
                a.Img_num= result[i].Img_num;
                response.push(a);
                a=new Object();
                }
                    res.json({
                    result: true,
                    message: '게시글을 불러왔습니다',
                    response
                });
                console.log(response);
            }
        }
    })
});

app.post('/community/load/comment', function (req, res) {
    var Board_number = req.body.Board_number;
    var sql = 'select * from Comments where Board_number = ?';
    var response = new Array();
    var a = new Object();
    var params = [Board_number];
    connection.query(sql,params, function (err,result) {
        if (err)
            console.log(err);
        else {
            if (result.length === 0) {
                res.json({
                    result: false,
                    message: '댓글이 존재하지않습니다.'
                });
            } else {for ( i = 0 ; i < result.length ; i++) {
                a.User_id= result[i].User_id;
                a.User_nickname= result[i].User_nickname;
                a.Comments_number= result[i].Comments_number;
                a.Board_number= result[i].Board_number;
                a.Comments_context= result[i].Comments_context;
                a.Comments_date= result[i].Comments_date;
                a.Comments_parentnumber= result[i].Comments_parentnumber;
                response.push(a);
                a=new Object();
                }
                    res.json({
                    result: true,
                    message: '댓글을 불러왔습니다',
                    response
                });
            }
        }
    })
});

app.post('/user/calendar/routine', function (req, res) {
    var User_id = req.body.User_id;
    var Calendar_date = req.body.Calendar_date;
    var Calendar_title = req.body.Calendar_title;
    var Calendar_count = req.body.Calendar_count;
    var Calendar_minute = req.body.Calendar_minute;
    var Calendar_second = req.body.Calendar_second;
    var Calendar_memo = req.body.Calendar_memo;
    var sql = 'insert into Calendar (User_id, Calendar_date, Calendar_title, Calendar_count, Calendar_minute, Calendar_second, Calendar_memo) values(?, ?, ?, ?, ?)';
    var params = [User_id, Calendar_date, Calendar_title, Calendar_count, Calendar_minute, Calendar_second, Calendar_memo];
    connection.query(sql, params, function (err,result) {
        if (err){
            res.json({
                result: false,
                message: 'fail'
            })
            console.log(err);
        }
        else{
            res.json({
                    result: true,
                    message: '저장되었습니다'
            });
            console.log("저장되었습니다");
        }
    })
    const spawn = require('child_process').spawn;

    const result = spawn('python', ['exercise.py',User_id,Calendar_title,Calendar_count, Calendar_minute, Calendar_second]);

    result.stdout.on('data', function(data) {
        console.log(data.toString());
    });

    result.stderr.on('data', function(data) {
        console.log(data.toString());
    });
});

app.post('/user/calendar', function (req, res) {
    var User_id = req.body.User_id;
    var Calendar_date = req.body.Calendar_date;
    var Calendar_title = req.body.Calendar_title;
    var Calendar_count = req.body.Calendar_count;
    var Calendar_minute = req.body.Calendar_min;
    var Calendar_second = req.body.Calendar_sec;
    var Calendar_memo = req.body.Calendar_memo;
    var sql = 'insert into Calendar (User_id, Calendar_date, Calendar_title, Calendar_count, Calendar_minute, Calendar_second, Calendar_memo) values(?, ?, ?, ?, ?, ?, ?)';
    var params = [User_id, Calendar_date, Calendar_title, Calendar_count, Calendar_minute, Calendar_second, Calendar_memo];
    connection.query(sql, params, function (err,result) {
        if (err){
            res.json({
                result: false,
                message: 'fail'
            })
            console.log(err);
        }
        else{
            res.json({
                    result: true,
                    message: '저장되었습니다'
            });
        }
    })
    const spawn = require('child_process').spawn;

    const result = spawn('python', ['exercise.py',User_id,Calendar_title,Calendar_count, Calendar_minute, Calendar_second]);

    result.stdout.on('data', function(data) {
        console.log(data.toString());
    });

    result.stderr.on('data', function(data) {
        console.log(data.toString());
    });
});

app.post('/user/calendar/date', function (req, res) {
    var User_id = req.body.User_id;
    var sql = 'select Calendar_date from Calendar where User_id = ?';
    var response = new Array();
    var a = new Object();
    var params = [User_id];
    connection.query(sql,params, function (err,result) {
        if (err)
            console.log(err);
        else {
            if (result.length === 0) {
                res.json({
                    result: false,
                    message: '운동한 날이 없습니다.'
                });
            } else {for ( i = 0 ; i < result.length ; i++) {
                a.Calendar_date= result[i].Calendar_date;
                response.push(a);
                a=new Object();
                }
                    res.json({
                    result: true,
                    message: '캘린더를 불러왔습니다.',
                    response
                });
            }
        }
    })
});

app.post('/user/calendar/data', function (req, res) {
    var User_id = req.body.User_id;
    var Calendar_date = req.body.Calendar_date;
    var sql = 'select id, Calendar_date,Calendar_title,Calendar_count,Calendar_memo,Calendar_minute,Calendar_second from Calendar where User_id = ? AND Calendar_date = ?';
    var response = new Array();
    var a = new Object();
    var params = [User_id, Calendar_date];
    connection.query(sql,params, function (err,result) {
        if (err)
            console.log(err);
        else {
            if (result.length === 0) {
                res.json({
                    result: false,
                    message: '운동한기록이 없습니다.'
                });
            } else {for ( i = 0 ; i < result.length ; i++) {
                a = new Object();
                a.id= result[i].id;
                a.Calendar_date= result[i].Calendar_date;
                a.Calendar_title= result[i].Calendar_title;
                a.Calendar_count= result[i].Calendar_count;
                a.Calendar_memo= result[i].Calendar_memo;
                a.Calendar_min= result[i].Calendar_minute;
                a.Calendar_sec= result[i].Calendar_second;
                response.push(a);
                }
                    res.json({
                    result: true,
                    message: '기록을 불러왔습니다.',
                    response
                });
            }
        }
    })
});

app.post('/community/board/del', function (req, res) {
    var Board_number = req.body.Board_number;
    var sql = 'delete from Board where Board_number = ?';
    var sql2 = 'delete from Comments where Board_number = ?';
    var params = [Board_number];
    connection.query(sql, params, function (err,result) {
        if (err)
            console.log(err);
    })
    connection.query(sql2, params, function (err,result) {
        if (err)
            console.log(err);
        else{
            res.json({
                result: true,
                message: '삭제되었습니다'
            });
        }
    })
});

app.post('/user/calendar/deletefit', function (req, res) {
    var id = req.body.id;
    var sql = 'delete from Calendar where id = ?';
    var params = [id];
    connection.query(sql, params, function (err,result) {
        if (err)
            console.log(err);
        else{
            res.json({
                result: true,
                message: '삭제되었습니다'
            });
        }
    })
});

app.post('/user/calendar/modifyfit', function (req, res) {
    var id = req.body.id;
    var Calendar_title = req.body.Calendar_title;
    var Calendar_count = req.body.Calendar_count;
    var Calendar_memo = req.body.Calendar_memo;
    var Calendar_min = req.body.Calendar_min;
    var Calendar_sec = req.body.Calendar_sec;
    var sql = 'update Calendar set Calendar_title=?, Calendar_count=?, Calendar_memo=?, Calendar_minute=?, Calendar_second=? where id = ?';
    var params = [Calendar_title,Calendar_count,Calendar_memo,Calendar_min,Calendar_sec,id];
    connection.query(sql, params, function (err,result) {
        if (err)
            console.log(err);
        else {
            res.json({
                result: true,
                message: '수정 성공!'
            });
        }
    })
});

app.post('/community/comment/del', function (req, res) {
    var Comments_number = req.body.Comments_number;
    var sql = 'delete from Comments where Comments_number = ?';
    var params = [Comments_number];
    connection.query(sql, params, function (err,result) {
        if (err)
            console.log(err);
        else{
            res.json({
                result: true,
                message: '삭제되었습니다'
            });
        }
    })
});

app.post('/community/comment/modify', function (req, res) {
    var Comments_number = req.body.Comments_number;
    var Comments_context = req.body.Comments_context;
    var Comments_date = req.body.Comments_date;
    var sql = 'update Comments set Comments_context=?, Comments_date=? where Comments_number = ?';
    var params = [Comments_context,Comments_date,Comments_number];
    connection.query(sql, params, function (err,result) {
        if (err)
            console.log(err);
        else {
            res.json({
                result: true,
                message: '수정 성공!'
            });
        }
    })
});

app.post('/community/board/Modify', function (req, res) {
    var Board_number = req.body.Board_number;
    var Board_title = req.body.Board_title;
    var Board_context = req.body.Board_context;
    var Board_date = req.body.Board_date;
    var sql = 'update Board set Board_title=?, Board_context=?, Board_date=? where Board_number = ?';
    var params = [Board_title,Board_context,Board_date,Board_number];
    connection.query(sql, params, function (err,result) {
        if (err)
            console.log(err);
        else {
            res.json({
                result: true,
                message: '수정 성공!'
            });
        }
    })
});

app.post('/user/part_preference', function (req, res) {
    var User_id = req.body.User_id;
    var Part_shoulder = req.body.Part_shoulder;
    var Part_arm = req.body.Part_arm;
    var Part_Chest = req.body.Part_Chest;
    var Part_back = req.body.Part_back;
    var Part_abdominal = req.body.Part_abdominal;
    var Part_core = req.body.Part_core;
    var Part_Hip = req.body.Part_Hip;
    var Part_thigh = req.body.Part_thigh;
    var Part_Wholebody = req.body.Part_Wholebody;
    var sql = 'update User_routine set User_어깨=?, User_팔=?, User_가슴=?, User_등=?, User_복부=?, User_코어=?, User_엉덩이=?, User_허벅지=?, User_전신=? where User_id = ?';
    var params = [Part_shoulder,Part_arm,Part_Chest,Part_back,Part_abdominal,Part_core,Part_Hip,Part_thigh,Part_Wholebody,User_id];
    connection.query(sql, params, function (err,result) {
        if (err)
            console.log(err);
        else {
            res.json({
                result: true,
                message: '등록 성공!'
            });
        }
    })
});

app.post('/routine/Recommend', function (req, res) {
    var User_id = req.body.User_id;
    var a;
    var b;
    var c;
    var response = new Array();
    var aa = new Object();
    var params = [User_id];
    var sql = 'select User_어깨, User_팔, User_가슴, User_등, User_복부, User_코어, User_엉덩이, User_허벅지, User_전신 from User_routine where User_id = ?';
    var sql1 = 'Select name from Exercise where ? = 2'
    connection.query(sql,params, function (err,result) {
        if (err)
            console.log(err);
        else {
            if(result[0].User_어깨 < result[0].User_팔) {
                a = result[0].User_팔;
                b=1;
            }
            else{
                a = result[0].User_어깨;
                b=0;
            }
            if(a < result[0].User_가슴) {
                a = result[0].User_가슴;
                b=2;
            }
            if(a < result[0].User_등) {
                a = result[0].User_등;
                b=3;
            }
            if(a < result[0].User_복부) {
                a = result[0].User_복부;
                b=4;
            }
            if(a < result[0].User_코어) {
                a = result[0].User_코어;
                b=5;
            }
            if(a < result[0].User_엉덩이) {
                a = result[0].User_엉덩이;
                b=6;
            }
            if(a < result[0].User_허벅지) {
                a = result[0].User_허벅지;
                b=7;
            }
            if(a < result[0].User_전신) {
                a = result[0].User_전신;
                b=8;
            }
        }

        if(b===0)sql1 = 'Select name from Exercise where 어깨 = 2 OR 어깨 = 1';
        if(b===1)sql1 = 'Select name from Exercise where 팔 = 2 OR 팔 = 1';
        if(b===2)sql1 = 'Select name from Exercise where 가슴 = 2 OR 가슴 = 1';
        if(b===3)sql1 = 'Select name from Exercise where 등 = 2 OR 등 = 1';
        if(b===4)sql1 = 'Select name from Exercise where 복부 = 2 OR 복부 = 1';
        if(b===5)sql1 = 'Select name from Exercise where 코어 = 2 OR 코어 = 1';
        if(b===6)sql1 = 'Select name from Exercise where 엉덩이 = 2 OR 엉덩이 = 1';
        if(b===7)sql1 = 'Select name from Exercise where 허벅지 = 2 OR 허벅지 = 1';
        if(b===8)sql1 = 'Select name from Exercise where 전신 = 2 OR 전신 = 1';
        connection.query(sql1, function (err,result){
            if (err)
            console.log(err);
            else{
                for ( i = 0 ; i < result.length ; i++){
                    aa= new Object();
                    aa.name = result[i].name;
                    aa.count = 10;
                    aa.set = 5;
                    if(aa.name==="러닝"||aa.name==="홈사이클"){
                        aa.count = 30;
                        aa.set = 10;
                    }
                    else if(aa.name==="플랭크"){
                        aa.count = 1;
                        aa.set = 0;
                        response.push(aa);
                        response.push(aa);
                        response.push(aa);
                        response.push(aa);
                    }
                    response.push(aa);
                }
                res.json({
                    result: true,
                    message: '루틴을 불러왔습니다.',
                    response
                });
                console.log(response);
            }
        })
    })
});

app.post('/user/exercise_form_preference', function (req, res) {
    var response = new Array();
    var a = new Object();
    var sql = 'select name from Exercise ';
    connection.query(sql, function (err,result) {
        if (err)
            console.log(err);
        else {
            if (result.length === 0) {
                res.json({
                    result: false,
                    message: '운동이 없습니다.'
                });
            } else {for ( i = 0 ; i < result.length ; i++) {
                    a = new Object();
                    a.Exercise_title= result[i].name;
                    response.push(a);
                }
                res.json({
                    result: true,
                    message: '운동을 불러왔습니다.',
                    response
                });
            }
        }
    })
});

app.post('/user/exercise_preference', function (req, res) {
    var id = new Array();
    var User_id = req.body.User_id;
    var t;
    var x;
    var sql = 'select id from User_table where User_id = ?';
    var params = [User_id];

    function go_py(prm) {
        const spawn = require('child_process').spawn;
        const result = spawn('python', ['algorithm.py']);
        let data = {
            User_id: prm,
            id
        };
        console.log('data')
        console.log(data)

        result.stdout.on('data', function(data) {
        console.log(data.toString());
        });
        result.stderr.on('data', function(data) {
        console.log(data.toString());
        });
        result.stdin.write(JSON.stringify(data));

        result.stdin.end();
    }
    
    for(i=0;i<req.body.Exercise_name.length;i++){
        if(req.body.Exercise_name[i]===6){
            x=String(i+1);
            id.push(x)
        }
    }
    connection.query(sql,params, function (err,result) {
        if (err)
            console.log(err);
        else {
            t=String(result[0].id);
            go_py(t)

            res.json({
                result: true,
                message:'완료'
            });
        }    
    })
});

app.post('/user/routine/loadexcerciseinfo', function (req, res) {
    var response = new Array();
    var a = new Object();
    var sql = 'select * from Exercise';
    connection.query(sql, function (err,result) {
        if (err)
            console.log(err);
        else {
            if (result.length === 0) {
                res.json({
                    result: false,
                    message: '운동이 없습니다.'
                });
            } else {for ( i = 0 ; i < result.length ; i++) {
                    a = new Object();
                    a.Exercise_title= result[i].name;
                    a.Excerise_Data =[result[i].어깨,result[i].팔,result[i].가슴,result[i].등,result[i].복부,result[i].코어,result[i].엉덩이,result[i].허벅지,result[i].전신];
                    response.push(a);
                }
                res.json({
                    result: true,
                    message: '운동을 불러왔습니다.',
                    response
                });
            }
        }
    })
});

app.post('/user/routine/RecommendExericse', function (req, res) {
    var a;
    var b;
    var User_id = req.body.User_id;
    var params = [User_id];
    var sql = 'select User_어깨, User_팔, User_가슴, User_등, User_복부, User_코어, User_엉덩이, User_허벅지, User_전신 from User_routine where User_id = ?';
    connection.query(sql,params, function (err,result) {
        if (err)
            console.log(err);
        else {
            if(result[0].User_어깨 < result[0].User_팔) {
                a = result[0].User_팔;
                b=1;
            }
            else{
                a = result[0].User_어깨;
                b=0;
            }
            if(a < result[0].User_가슴) {
                a = result[0].User_가슴;
                b=2;
            }
            if(a < result[0].User_등) {
                a = result[0].User_등;
                b=3;
            }
            if(a < result[0].User_복부) {
                a = result[0].User_복부;
                b=4;
            }
            if(a < result[0].User_코어) {
                a = result[0].User_코어;
                b=5;
            }
            if(a < result[0].User_엉덩이) {
                a = result[0].User_엉덩이;
                b=6;
            }
            if(a < result[0].User_허벅지) {
                a = result[0].User_허벅지;
                b=7;
            }
            if(a < result[0].User_전신) {
                a = result[0].User_전신;
                b=8;
            }
            res.json({
                result: b,
                message: '값 주기 성공'
            });
        }
    })
});

app.post('/user/routine/FavoriteExericse', function (req, res) {
    var a;
    var b;
    var User_id = req.body.User_id;
    var params = [User_id];
    var sql = 'select User_어깨, User_팔, User_가슴, User_등, User_복부, User_코어, User_엉덩이, User_허벅지, User_전신 from User_routine where User_id = ?';
    connection.query(sql,params, function (err,result) {
        if (err)
            console.log(err);
        else {
            if(result[0].User_어깨 < result[0].User_팔) {
                a = result[0].User_팔;
                b=1;
            }
            else{
                a = result[0].User_어깨;
                b=0;
            }
            if(a < result[0].User_가슴) {
                a = result[0].User_가슴;
                b=2;
            }
            if(a < result[0].User_등) {
                a = result[0].User_등;
                b=3;
            }
            if(a < result[0].User_복부) {
                a = result[0].User_복부;
                b=4;
            }
            if(a < result[0].User_코어) {
                a = result[0].User_코어;
                b=5;
            }
            if(a < result[0].User_엉덩이) {
                a = result[0].User_엉덩이;
                b=6;
            }
            if(a < result[0].User_허벅지) {
                a = result[0].User_허벅지;
                b=7;
            }
            if(a < result[0].User_전신 ){
                a = result[0].User_전신;
                b=8;
            }
            res.json({
                result: b,
                message: '값 주기 성공'
            });
        }
    })
});

app.post('/user/routine/Statistic', function (req, res) {
    var User_id = req.body.User_id;
    var Month = req.body.Month;
    var a = new Object();
    var response = new Array();
    var xd = new Array();
    var jsonobj;
    console.log(User_id);
    console.log(Month);
    function go_py(prm1,prm2) {
        const spawn = require('child_process').spawn;
        const response1 = spawn('python', ['statistics2.py',prm1,prm2]);
        response1.stdout.on('data', function(data) {
            console.log(data.toString());
        });
        response1.stderr.on('data', function(data) {
            console.log(data.toString());
        });
    }

    go_py(User_id,Month);

    const fs = require('fs');
    function go_Json(){
        console.log('파일읽기프로세스시작...');
        fs.readFile('file516.json', 'utf8', function (err, data) {
                if(err) return console.log(err);
            jsonobj = JSON.parse(data);
            const count_exercise_name = jsonobj.count_exercise_name;
            const count_exercise_count = jsonobj.count_exercise_count;
            const part_name = jsonobj.part_name;
            const time_exercise_name = jsonobj.time_exercise_name;
            const time_exercise_minute = jsonobj.time_exercise_minute;
            const time_exercise_second = jsonobj.time_exercise_second;
            const time_exercise_freq = jsonobj.time_exercise_freq;
            const count_exercise_freq = jsonobj.count_exercise_freq;
            
            a.data = time_exercise_name;
            response.push(a);
            a = new Object();
            a.data = time_exercise_minute;
            response.push(a);
            a = new Object();
            a.data = time_exercise_second;
            response.push(a);
            a = new Object();
            a.data = time_exercise_freq;
            response.push(a);
            a = new Object();
            a.data = count_exercise_name;
            response.push(a);
            a = new Object();
            a.data = count_exercise_count;
            response.push(a);
            a = new Object();
            a.data = count_exercise_freq;
            response.push(a);
            a = new Object();
            a.data = part_name;
            response.push(a);

            res.json({
                result: true,
                message: '통계 불러왔습니다.',
                response
            });
            console.log(response);
        });
    }
    setTimeout(function() {
        go_Json();
    }, 500);

});

app.post('/user/routine/Statistic/Excerise', function (req, res) {
    var User_id = req.body.User_id;
    var Exercise = req.body.Exercise;
    var Month = req.body.Month;
    var response = new Array();
    var a = new Object();
    var params = [User_id,Exercise];
    var sql = 'select Calendar_date, Calendar_title, Calendar_count, Calendar_minute, Calendar_second from Calendar where User_id = ? AND Calendar_title = ? AND Calendar_date like ';
    sql+="'%" + Month + "%' ORDER BY Calendar_date ASC";
    connection.query(sql,params, function (err,result) {
        if (err)
            console.log(err);
        else {
            if (result.length === 0) {
                res.json({
                    result: false,
                    message: '운동이 없습니다.'
                });
            } else {for ( i = 0 ; i < result.length ; i++) {
                    a = new Object();
                    a.date = result[i].Calendar_date.substring(8,10);
                    a.count = result[i].Calendar_count;
                    a.min = result[i].Calendar_minute;
                    a.second = result[i].Calendar_second;
                    response.push(a);
                }
                res.json({
                    result: true,
                    message: '운동을 불러왔습니다.',
                    response
                });
                console.log(response);
            }
        }
    })
});

app.post('/user/routine/Statistic/Part', function (req, res) {
    var User_id = req.body.User_id;
    var Part = req.body.Part;
    var Month = req.body.Month;
    var response = new Array();
    var a = new Object();
    var params = [User_id,Month];
    var sql = 'select Calendar_date, Calendar_title from Calendar where User_id = ? AND Calendar_date like ';
    sql+="'%" + Month + "%' ORDER BY Calendar_date ASC";

    connection.query(sql,params, function (err,result) {
        if (err)
            console.log(err);
        else {
            if (result.length === 0) 
            {
                res.json({
                    result: false,
                    message: '운동이 없습니다.'
                });
            } 
            
            else
            {
                for ( i = 0 ; i < result.length ; i++) 
                {
                    if(Part===("어깨")){
                        if(result[i].Calendar_title===("숄더 프레스")||result[i].Calendar_title===("사이드 레터럴 레이즈")||result[i].Calendar_title===("벤트 오버 레터럴 레이즈")){
                        a = new Object();
                        a.date= result[i].Calendar_date.substring(8,10);
                        response.push(a);
                        }
                    }
                    else if(Part==="팔"){
                        if(result[i].Calendar_title==="덤벨 컬"||result[i].Calendar_title==="컨센트레이션 컬"||result[i].Calendar_title==="벤치 딥"){
                        a = new Object();
                        a.date= result[i].Calendar_date.substring(8,10);
                        response.push(a);
                        }
                    }
                    else if(Part==="가슴"){
                        if(result[i].Calendar_title==="푸쉬 업"||result[i].Calendar_title==="다이아몬드 푸쉬업"){
                        a = new Object();
                        a.date= result[i].Calendar_date.substring(8,10);
                        response.push(a);
                        }
                    }
                    else if(Part==="등"){
                        if(result[i].Calendar_title==="랫 풀 다운"||result[i].Calendar_title==="풀 업"||result[i].Calendar_title==="친 업"){
                        a = new Object();
                        a.date= result[i].Calendar_date.substring(8,10);
                        response.push(a);
                        }
                    }
                    else if(Part==="복부"){
                        if(result[i].Calendar_title==="크런치"||result[i].Calendar_title==="니 업"||result[i].Calendar_title==="레그 레이즈"||result[i].Calendar_title==="윗몸 일으키기"){
                        a = new Object();
                        a.date= result[i].Calendar_date.substring(8,10);
                        response.push(a);
                        }
                    }
                    else if(Part==="코어"){
                        if(result[i].Calendar_title==="버드 독"||result[i].Calendar_title==="플랭크"||result[i].Calendar_title==="힙 브릿지"||result[i].Calendar_title==="런지"){
                        a = new Object();
                        a.date= result[i].Calendar_date.substring(8,10);
                        response.push(a);
                        }
                    }
                    else if(Part==="엉덩이"){
                        if(result[i].Calendar_title==="힐 킥"||result[i].Calendar_title==="케틀벨 스윙"){
                        a = new Object();
                        a.date= result[i].Calendar_date.substring(8,10);
                        response.push(a);
                        }
                    }
                    else if(Part==="허벅지"){
                        if(result[i].Calendar_title==="스쿼트"||result[i].Calendar_title==="홈사이클"){
                        a = new Object();
                        a.date= result[i].Calendar_date.substring(8,10);
                        response.push(a);
                        }
                    }
                    else if(Part==="전신"){
                        if(result[i].Calendar_title==="팔벌려뛰기"||result[i].Calendar_title==="버피테스트"||result[i].Calendar_title==="러닝"){
                        a = new Object();
                        a.date= result[i].Calendar_date.substring(8,10);
                        response.push(a);
                        }
                    }

                }
                res.json({
                    result: true,
                    message: '운동을 불러왔습니다.',
                    response
                });
                console.log(response);
            }
        }
    })
});
