var express = require("express");

var usersRouter = require("./routes/users");
var registerRouter = require("./routes/register");
var loginRouter = require("./routes/login");
var editRouter = require("./routes/edit");
var writeRouter = require("./routes/write");

var app = express();

var request = require("request"); // 일기 내용 담는 변수

var result = ""

// FLASK-NODEJS 연동
app.post("/writetest", (req, res) => {
    console.log("text: ", req.body.text);

    // REACT로부터 일기 내용 받아오기
    let body = req.body;
    const diarycontent = body.text

  // FLASK로 일기 내용 보내기
  const ModelResult = (callback) => {
    const options = {
      method: "POST",
      uri: "http://127.0.0.1:4000/sendmodeltext",
      qs: {
        text: diarycontent,
      },
    };
    request(options, function (err, res, body) {
      callback(undefined, {
        result: body,
      });
    });
  };

  //FLASK로부터 변경 내용 받아서 REACT로 넘기기
  ModelResult((err, { result } = {}) => {
    if (err) {
      console.log("error!!!!");
      res.send({
        message: "fail",
        status: "fail",
      });
    }

    let json = JSON.parse(result);
    console.log(json);
    res.send({
      message: "from flask",
      status: "success",
      data: {
        json,
      },
    });
  });
});

app.use("/users", usersRouter);
app.use("/members/new", registerRouter);
app.use("/members/login", loginRouter);
app.use("/members/:{id}/edit", editRouter);
app.use("/members/test/write", writeRouter); //test 끼워넣기는 front팀과 일치시키기 위함

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
