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
    var user_name = req.body.user_name;
    var user_birth = req.body.user_birth;
    var user_id = req.body.user_id;
    var user_pwd = req.body.user_pwd;
    var user_gender= req.body.user_gender;
    var user_nickname= req.body.user_nickname;
    var user_phone= req.body.user_phone;
    var user_height= req.body.user_height;
    var user_weight= req.body.user_weight;

    var sql = 'INSERT INTO user_table (user_name, user_birth, user_id, user_pwd, user_gender, user_nickname, user_phone, user_height, user_weight ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    var params = [user_name, user_birth, user_id, user_pwd, user_gender, user_nickname, user_phone, user_height, user_weight];

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
    var user_id = req.body.user_id;

    var sql = 'select * from user_table where user_id = ?';

    connection.query(sql, user_id, function (err, result) {
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
    var user_nickname = req.body.user_nickname;

    var sql = 'select * from user_table where user_nickname = ?';

    connection.query(sql, user_nickname, function (err, result) {
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
    var user_id = req.body.user_id;
    var user_pwd = req.body.user_pwd;

    var sql = 'select * from user_table where user_id = ? AND user_pwd = ?';
    var params = [user_id, user_pwd];

    connection.query(sql, params, function (err,result) {
        if (err)
            console.log(err);
        else {
            if (result.length === 0) {
                res.json({
                    result: false,
                    message: '존재하지 않는 계정입니다!'
                });
            } else if (user_pwd !== result[0].user_pwd) {
                res.json({
                    result: false,
                    message: '비밀번호가 틀렸습니다!'
                });
            } else {
                res.json({
                    result: true,
                    message: '로그인 성공!',
                    user_id: user_id,
                    user_name: result[0].user_name,
                    user_birth: result[0].user_birth,
                    user_gender: result[0].user_gender,
                    user_nickname: result[0].user_nickname,
                    user_phone: result[0].user_phone,
                    user_height: result[0].user_height,
                    user_weight: result[0].user_weight,
                    user_strength: result[0].user_strength,
                    user_goal: result[0].user_goal
                });
            }
        }
    })
});

app.post('/community/write/', function (req, res) {
    var board_date = req.body.board_date;
    var user_id = req.body.user_id;
    var user_nickname = req.body.user_nickname;
    var board_title = req.body.board_title;
    var board_context = req.body.board_context;
    var board_countcomment = req.body.board_countcomment;
    var Img_num = req.body.Img_num;

    var sql = 'INSERT INTO Board (user_nickname, user_id, board_date, board_title, board_context, board_countcomment, Img_num ) VALUES (?, ?, ?, ?, ?, ?, ?)';
    var params = [user_nickname, user_id, board_date, board_title, board_context, board_countcomment, Img_num];

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
    var board_number = req.body.board_number;
    var comment_date = req.body.comments_date;
    var user_id = req.body.user_id;
    var user_nickname = req.body.user_nickname;
    var comment_context = req.body.comments_context;

    var sql = 'INSERT INTO comments ( user_nickname, user_id, board_number, comments_date, comments_context ) VALUES (?, ?, ?, ?, ?)';
    var params = [user_nickname, user_id, board_number, comment_date, comment_context];

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
    var response = new Array();
    var a = new Object();

    var sql = 'select * from Board';

    connection.query(sql, function (err,result) {
        if (err)
            console.log(err);
        else {
            if (result.length === 0) {
                res.json({
                    result: false,
                    message: '게시글이 존재하지 않습니다'
                });
            } else {for (i = result.length - 1 ; i > -1 ; i--) {
                a = new Object();

                a.user_id = result[i].user_id;
                a.user_nickname = result[i].user_nickname;
                a.board_number = result[i].board_number;
                a.board_title = result[i].board_title;
                a.board_context = result[i].board_context;
                a.board_date = result[i].board_date;
                a.board_count = result[i].board_count;
                a.board_countcomment = result[i].board_countcomment;
                a.Img_num = result[i].Img_num;

                response.push(a);
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
    var board_number = req.body.board_number;
    var response = new Array();
    var a = new Object();

    var sql = 'select * from comments where board_number = ?';
    var params = [board_number];

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
                a = new Object();

                a.user_id = result[i].user_id;
                a.user_nickname = result[i].user_nickname;
                a.comments_number = result[i].comments_number;
                a.board_number = result[i].board_number;
                a.comments_context = result[i].comments_context;
                a.comments_date = result[i].comments_date;
                a.comments_parentnumber = result[i].comments_parentnumber;

                response.push(a);
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
    var user_id = req.body.user_id;
    var calendar_date = req.body.calendar_date;
    var calendar_title = req.body.calendar_title;
    var calendar_count = req.body.calendar_count;
    var calendar_minute = req.body.calendar_minute;
    var calendar_second = req.body.calendar_second;
    var calendar_memo = req.body.calendar_memo;

    var sql = 'insert into Calendar (user_id, calendar_date, calendar_title, calendar_count, calendar_minute, calendar_second, calendar_memo) values(?, ?, ?, ?, ?)';
    var params = [user_id, calendar_date, calendar_title, calendar_count, calendar_minute, calendar_second, calendar_memo];

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

    const result = spawn('python', ['exercise.py', user_id, calendar_title, calendar_count, calendar_minute, calendar_second]);

    result.stdout.on('data', function(data) {
        console.log(data.toString());
    });

    result.stderr.on('data', function(data) {
        console.log(data.toString());
    });
});

app.post('/user/calendar', function (req, res) {
    var user_id = req.body.user_id;
    var calendar_date = req.body.calendar_date;
    var calendar_title = req.body.calendar_title;
    var calendar_count = req.body.calendar_count;
    var calendar_minute = req.body.calendar_min;
    var calendar_second = req.body.calendar_sec;
    var calendar_memo = req.body.calendar_memo;

    var sql = 'insert into Calendar (user_id, calendar_date, calendar_title, calendar_count, calendar_minute, calendar_second, calendar_memo) values(?, ?, ?, ?, ?, ?, ?)';
    var params = [user_id, calendar_date, calendar_title, calendar_count, calendar_minute, calendar_second, calendar_memo];

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

    const result = spawn('python', ['exercise.py', user_id, calendar_title, calendar_count, calendar_minute, calendar_second]);

    result.stdout.on('data', function(data) {
        console.log(data.toString());
    });

    result.stderr.on('data', function(data) {
        console.log(data.toString());
    });
});

app.post('/user/calendar/date', function (req, res) {
    var response = new Array();
    var a = new Object();
    var user_id = req.body.user_id;

    var sql = 'select calendar_date from Calendar where user_id = ?';
    var params = [user_id];

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
                a.calendar_date = result[i].calendar_date;
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
    var user_id = req.body.user_id;
    var calendar_date = req.body.calendar_date;
    var response = new Array();
    var a = new Object();

    var sql = 'select id, calendar_date,calendar_title,calendar_count,calendar_memo,calendar_minute,calendar_second from Calendar where user_id = ? AND calendar_date = ?';
    var params = [user_id, calendar_date];

    connection.query(sql, params, function (err,result) {
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
                a.id = result[i].id;
                a.calendar_date = result[i].calendar_date;
                a.calendar_title = result[i].calendar_title;
                a.calendar_count = result[i].calendar_count;
                a.calendar_memo = result[i].calendar_memo;
                a.calendar_min = result[i].calendar_minute;
                a.calendar_sec = result[i].calendar_second;
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
    var board_number = req.body.board_number;

    var sql = 'delete from Board where board_number = ?; delete from comments where board_number = ?;';
    var params = [board_number, board_number];

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
    var calendar_title = req.body.calendar_title;
    var calendar_count = req.body.calendar_count;
    var calendar_memo = req.body.calendar_memo;
    var calendar_min = req.body.calendar_min;
    var calendar_sec = req.body.calendar_sec;

    var sql = 'UPDATE Calendar SET calendar_title=?, calendar_count=?, calendar_memo=?, calendar_minute=?, calendar_second=? where id = ?';
    var params = [calendar_title,calendar_count,calendar_memo,calendar_min,calendar_sec,id];

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
    var comments_number = req.body.comments_number;

    var sql = 'delete from comments where comments_number = ?';
    var params = [comments_number];

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
    var comments_number = req.body.comments_number;
    var comments_context = req.body.comments_context;
    var comments_date = req.body.comments_date;

    var sql = 'UPDATE comments SET comments_context=?, comments_date=? where comments_number = ?';
    var params = [comments_context,comments_date,comments_number];

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
    var board_number = req.body.board_number;
    var board_title = req.body.board_title;
    var board_context = req.body.board_context;
    var board_date = req.body.board_date;

    var sql = 'UPDATE Board SET board_title=?, board_context=?, board_date=? where board_number = ?';
    var params = [board_title,board_context,board_date,board_number];

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
    var user_id = req.body.user_id;
    var Part_shoulder = req.body.Part_shoulder;
    var Part_arm = req.body.Part_arm;
    var Part_Chest = req.body.Part_Chest;
    var Part_back = req.body.Part_back;
    var Part_abdominal = req.body.Part_abdominal;
    var Part_core = req.body.Part_core;
    var Part_Hip = req.body.Part_Hip;
    var Part_thigh = req.body.Part_thigh;
    var Part_Wholebody = req.body.Part_Wholebody;

    var sql = 'UPDATE user_routine SET user_어깨=?, user_팔=?, user_가슴=?, user_등=?, user_복부=?, user_코어=?, user_엉덩이=?, user_허벅지=?, user_전신=? where user_id = ?';
    var params = [Part_shoulder,Part_arm,Part_Chest,Part_back,Part_abdominal,Part_core,Part_Hip,Part_thigh,Part_Wholebody,user_id];

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
    var user_id = req.body.user_id;
    var a;
    var b;
    var c;
    var response = new Array();
    var aa = new Object();
    var params = [user_id];
    var sql = 'select user_어깨, user_팔, user_가슴, user_등, user_복부, user_코어, user_엉덩이, user_허벅지, user_전신 from user_routine where user_id = ?';
    var sql1 = 'Select name from exercise where ? = 2'
    connection.query(sql,params, function (err,result) {
        if (err)
            console.log(err);
        else {
            if(result[0].user_어깨 < result[0].user_팔) {
                a = result[0].user_팔;
                b=1;
            }
            else{
                a = result[0].user_어깨;
                b=0;
            }
            if(a < result[0].user_가슴) {
                a = result[0].user_가슴;
                b=2;
            }
            if(a < result[0].user_등) {
                a = result[0].user_등;
                b=3;
            }
            if(a < result[0].user_복부) {
                a = result[0].user_복부;
                b=4;
            }
            if(a < result[0].user_코어) {
                a = result[0].user_코어;
                b=5;
            }
            if(a < result[0].user_엉덩이) {
                a = result[0].user_엉덩이;
                b=6;
            }
            if(a < result[0].user_허벅지) {
                a = result[0].user_허벅지;
                b=7;
            }
            if(a < result[0].user_전신) {
                a = result[0].user_전신;
                b=8;
            }
        }

        if(b===0)sql1 = 'Select name from exercise where 어깨 = 2 OR 어깨 = 1';
        if(b===1)sql1 = 'Select name from exercise where 팔 = 2 OR 팔 = 1';
        if(b===2)sql1 = 'Select name from exercise where 가슴 = 2 OR 가슴 = 1';
        if(b===3)sql1 = 'Select name from exercise where 등 = 2 OR 등 = 1';
        if(b===4)sql1 = 'Select name from exercise where 복부 = 2 OR 복부 = 1';
        if(b===5)sql1 = 'Select name from exercise where 코어 = 2 OR 코어 = 1';
        if(b===6)sql1 = 'Select name from exercise where 엉덩이 = 2 OR 엉덩이 = 1';
        if(b===7)sql1 = 'Select name from exercise where 허벅지 = 2 OR 허벅지 = 1';
        if(b===8)sql1 = 'Select name from exercise where 전신 = 2 OR 전신 = 1';
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
    var sql = 'select name from exercise ';
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
                    a.exercise_title= result[i].name;
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
    var user_id = req.body.user_id;
    var t;
    var x;
    var sql = 'select id from user_table where user_id = ?';
    var params = [user_id];

    function go_py(prm) {
        const spawn = require('child_process').spawn;
        const result = spawn('python', ['algorithm.py']);
        let data = {
            user_id: prm,
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

    for(i=0;i<req.body.exercise_name.length;i++){
        if(req.body.exercise_name[i]===6){
            x=String(i+1);
            id.push(x)
        }
    }
    connection.query(sql, params, function (err,result) {
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

app.post('/user/routine/loadexerciseinfo', function (req, res) {
    var response = new Array();
    var a = new Object();
    var sql = 'select * from exercise';
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
                    a.exercise_title= result[i].name;
                    a.exercise_Data =[result[i].어깨,result[i].팔,result[i].가슴,result[i].등,result[i].복부,result[i].코어,result[i].엉덩이,result[i].허벅지,result[i].전신];
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
    var user_id = req.body.user_id;
    var params = [user_id];
    var sql = 'select user_어깨, user_팔, user_가슴, user_등, user_복부, user_코어, user_엉덩이, user_허벅지, user_전신 from user_routine where user_id = ?';
    connection.query(sql,params, function (err,result) {
        if (err)
            console.log(err);
        else {
            if(result[0].user_어깨 < result[0].user_팔) {
                a = result[0].user_팔;
                b=1;
            }
            else{
                a = result[0].user_어깨;
                b=0;
            }
            if(a < result[0].user_가슴) {
                a = result[0].user_가슴;
                b=2;
            }
            if(a < result[0].user_등) {
                a = result[0].user_등;
                b=3;
            }
            if(a < result[0].user_복부) {
                a = result[0].user_복부;
                b=4;
            }
            if(a < result[0].user_코어) {
                a = result[0].user_코어;
                b=5;
            }
            if(a < result[0].user_엉덩이) {
                a = result[0].user_엉덩이;
                b=6;
            }
            if(a < result[0].user_허벅지) {
                a = result[0].user_허벅지;
                b=7;
            }
            if(a < result[0].user_전신) {
                a = result[0].user_전신;
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
    var user_id = req.body.user_id;
    var params = [user_id];
    var sql = 'select user_어깨, user_팔, user_가슴, user_등, user_복부, user_코어, user_엉덩이, user_허벅지, user_전신 from user_routine where user_id = ?';
    connection.query(sql,params, function (err,result) {
        if (err)
            console.log(err);
        else {
            if(result[0].user_어깨 < result[0].user_팔) {
                a = result[0].user_팔;
                b=1;
            }
            else{
                a = result[0].user_어깨;
                b=0;
            }
            if(a < result[0].user_가슴) {
                a = result[0].user_가슴;
                b=2;
            }
            if(a < result[0].user_등) {
                a = result[0].user_등;
                b=3;
            }
            if(a < result[0].user_복부) {
                a = result[0].user_복부;
                b=4;
            }
            if(a < result[0].user_코어) {
                a = result[0].user_코어;
                b=5;
            }
            if(a < result[0].user_엉덩이) {
                a = result[0].user_엉덩이;
                b=6;
            }
            if(a < result[0].user_허벅지) {
                a = result[0].user_허벅지;
                b=7;
            }
            if(a < result[0].user_전신 ){
                a = result[0].user_전신;
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
    var user_id = req.body.user_id;
    var Month = req.body.Month;
    var a = new Object();
    var response = new Array();
    var xd = new Array();
    var jsonobj;
    console.log(user_id);
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

    go_py(user_id,Month);

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

app.post('/user/routine/Statistic/exercise', function (req, res) {
    var user_id = req.body.user_id;
    var exercise = req.body.exercise;
    var Month = req.body.Month;
    var response = new Array();
    var a = new Object();
    var params = [user_id,exercise];
    var sql = 'select calendar_date, calendar_title, calendar_count, calendar_minute, calendar_second from Calendar where user_id = ? AND calendar_title = ? AND calendar_date like ';
    sql+="'%" + Month + "%' ORDER BY calendar_date ASC";
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
                    a.date = result[i].calendar_date.substring(8,10);
                    a.count = result[i].calendar_count;
                    a.min = result[i].calendar_minute;
                    a.second = result[i].calendar_second;
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
    var user_id = req.body.user_id;
    var Part = req.body.Part;
    var Month = req.body.Month;
    var response = new Array();
    var a = new Object();
    var params = [user_id,Month];
    var sql = 'select calendar_date, calendar_title from Calendar where user_id = ? AND calendar_date like ';
    sql+="'%" + Month + "%' ORDER BY calendar_date ASC";

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
                        if(result[i].calendar_title===("숄더 프레스")||result[i].calendar_title===("사이드 레터럴 레이즈")||result[i].calendar_title===("벤트 오버 레터럴 레이즈")){
                        a = new Object();
                        a.date= result[i].calendar_date.substring(8,10);
                        response.push(a);
                        }
                    }
                    else if(Part==="팔"){
                        if(result[i].calendar_title==="덤벨 컬"||result[i].calendar_title==="컨센트레이션 컬"||result[i].calendar_title==="벤치 딥"){
                        a = new Object();
                        a.date= result[i].calendar_date.substring(8,10);
                        response.push(a);
                        }
                    }
                    else if(Part==="가슴"){
                        if(result[i].calendar_title==="푸쉬 업"||result[i].calendar_title==="다이아몬드 푸쉬업"){
                        a = new Object();
                        a.date= result[i].calendar_date.substring(8,10);
                        response.push(a);
                        }
                    }
                    else if(Part==="등"){
                        if(result[i].calendar_title==="랫 풀 다운"||result[i].calendar_title==="풀 업"||result[i].calendar_title==="친 업"){
                        a = new Object();
                        a.date= result[i].calendar_date.substring(8,10);
                        response.push(a);
                        }
                    }
                    else if(Part==="복부"){
                        if(result[i].calendar_title==="크런치"||result[i].calendar_title==="니 업"||result[i].calendar_title==="레그 레이즈"||result[i].calendar_title==="윗몸 일으키기"){
                        a = new Object();
                        a.date= result[i].calendar_date.substring(8,10);
                        response.push(a);
                        }
                    }
                    else if(Part==="코어"){
                        if(result[i].calendar_title==="버드 독"||result[i].calendar_title==="플랭크"||result[i].calendar_title==="힙 브릿지"||result[i].calendar_title==="런지"){
                        a = new Object();
                        a.date= result[i].calendar_date.substring(8,10);
                        response.push(a);
                        }
                    }
                    else if(Part==="엉덩이"){
                        if(result[i].calendar_title==="힐 킥"||result[i].calendar_title==="케틀벨 스윙"){
                        a = new Object();
                        a.date= result[i].calendar_date.substring(8,10);
                        response.push(a);
                        }
                    }
                    else if(Part==="허벅지"){
                        if(result[i].calendar_title==="스쿼트"||result[i].calendar_title==="홈사이클"){
                        a = new Object();
                        a.date= result[i].calendar_date.substring(8,10);
                        response.push(a);
                        }
                    }
                    else if(Part==="전신"){
                        if(result[i].calendar_title==="팔벌려뛰기"||result[i].calendar_title==="버피테스트"||result[i].calendar_title==="러닝"){
                        a = new Object();
                        a.date= result[i].calendar_date.substring(8,10);
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
