require("dotenv").config();
const multer = require("multer");
const path = require("path");
const upload = multer({
  storage: multer.diskStorage({
    // 저장한 공간 정보 : 하드디스크에 저장
    destination(req, file, done) {
      // 저장 위치
      done(null, process.env.FILELINK);
    },
    filename(req, file, done) {
      // 파일명을 어떤 이름으로 올릴지
      const ext = path.extname(file.originalname); // 파일의 확장자
      done(null, path.basename(file.originalname, ext) + Date.now() + ext); // 파일이름 + 날짜 + 확장자 이름으로 저장
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20메가로 용량 제한
});

module.exports = upload;
