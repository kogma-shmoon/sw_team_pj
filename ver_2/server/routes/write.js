var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const db = require("../../server/config/db.js");

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

var request = require('request');

//date(String), title(), content, (token) 전달받음
router.post("/", (req, res) => {
  console.log("/members/test/write 호출됨");
  const date = req.body.date;
  const title = req.body.title;
  const content = req.body.content;
  const token = req.body.token;

  try {
    var check = jwt.verify(token, "secretKey");
    if (check) {
      console.log("token 검증", check.user_id);
    }
  } catch {
    console.log("token 검증 오류");
  }

  var query = "select * from diary";
  console.log("date", date);
  console.log("title", title);
  console.log("content", content);

  // FLASK로 일기 내용 보내기
  const ModelResult  = (callback)=>{
    const options = {
        method: 'POST',
        uri: "http://127.0.0.1:4000/sendmodeltext",
        qs: {
            text: content
        }
    }
    request(options, function (err, res, body) {
        callback(undefined, {
            result:body
        });
    });
  }

  ModelResult((err, {result}={})=>{
    if(err){
        console.log("error!!!!");
        res.send({
            message: "fail",
            status: "fail"
        });
    }

    let json = JSON.parse(result);

    console.log(json.key_list);

    //플레이리스트 id추출
    let emotion = json.emotion;
    db.query("SELECT PLAYLIST_ID, PLAYLIST_TITLE FROM playlist WHERE PLAYLIST_EMOTION = ? ORDER BY RAND() LIMIT 1;",emotion, function (error, results, fields) {
      if (error) throw error;
    // console.log('records: ', results[0].PLAYLIST_ID);
    });

    //키워드에 대한 카테고리 추출
    let key_arr = [];
    let key_arr2 = [];
    key_arr = json.key_list;
    var len = 10 - key_arr.length
    for(var i = 0; i < len; i++){
      key_arr.push('0');
    } 
    // console.log(key_arr[1]);
    let cate = "";
    key_arr2 = key_arr.concat(key_arr)
    db.query("SELECT CATEGORY FROM keyword where keyword in (?,?,?,?,?,?,?,?,?,?) ORDER BY FIELD(keyword,?,?,?,?,?,?,?,?,?,?) limit 1;",key_arr2,function (error, results) {
      if (error) throw error;
      if (results.length > 0) {
        cate = results[0].CATEGORY
        console.log('cate:'+ cate)
      } else {
        console.log('No records found.');
      }
    });
    }
  )

  db.query(query, (err, data) => {
    if (!err) {
      console.log("오류X");
    } else {
      console.log("오류");
    }
  });
});

module.exports = router;

/*
[흐름 정리]

home(날짜 선택) (date, token 전달)
-> 일기 없으면(write) (현재)
-> 일기 있으면(diary) ->후에 개발




날짜, token 전달받으면,
token verify해서 user_id 받기
user_id랑 날짜 이용해서 diary 정보 받아옴
1) diary table에 해당 날짜 일기 O
    content 받아와서 뿌려줌
2) diary table에 해당 날짜 일기 X
    빈 페이지
*/