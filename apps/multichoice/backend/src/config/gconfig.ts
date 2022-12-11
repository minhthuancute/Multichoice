export class GConfig {
  public static MES_NOT_FOUND(name: string): string {
    return `${name} không tìm thấy`;
  }
  public static MES_ALREADY_EXISTS(name: string): string {
    return `${name} đã tồn tại`;
  }
  public static MES_NOT_EMPTY(name: string): string {
    return `${name} không được để trống`;
  }

  public static EMAIL_NOT_FOUND = this.MES_NOT_FOUND('Email');
  public static EMAIL_ALREADY_EXISTS = this.MES_ALREADY_EXISTS('Email');
  public static USER_NOT_FOUND = this.MES_NOT_FOUND('User');

  public static TOPIC_NOT_FOUND = this.MES_NOT_FOUND('Topic');
  public static NAME_NOT_FOUND = this.MES_NOT_FOUND('Name');

  public static USERNAME_NOT_EMPTY = this.MES_NOT_EMPTY('Tên');

  public static NOT_PERMISSION_VIEW = 'Bạn không có quyền xem';
  public static NOT_PERMISSION_DELETE = 'Bạn không có quyền xóa';
  public static NOT_PERMISSION_EDIT = 'Bạn không có quyền sửa';
  public static NOT_PERMISSION = 'Bạn không có quyền';
  public static NOT_PERMISSION_ADD_USER_FOR_GROUP =
    'Bạn không có quyền thêm user vào group này';
  public static NOT_PERMISSION_ADD_GROUP_FOR_TOPIC =
    'Bạn không có quyền thêm group vào topic này';
  public static NOT_PERMISSION_EXAM_TOPIC =
    'Bạn không có quyền tham gia bài thi này';
  public static ANSWERS_NOT_EMPTY = this.MES_NOT_EMPTY('Answers');

  public static LOGIN_ERROR = 'Email hoặc mật khẩu sai';

  public static QUESTION_NOT_FOUND = this.MES_NOT_FOUND('Question');

  public static URL_NOT_EMPTY = this.MES_NOT_EMPTY('URL');

  public static TOPIC_NOT_REALTIME = 'Topic này không phải realtime';
  public static TOPIC_NOT_FIXEDTIME = 'Topic này không phải fixedtime';

  public static USER_EXISTS_USEREXAM = 'Bạn đã làm bài thi này ';

  public static PASSWORD_IS_INCORRECT = 'Mật khẩu không đúng';
  public static PASSWORD_OLD_IS_INCORRECT = 'Mật khẩu cũ không đúng';
  public static SUCESS = 'Thành công';
  public static ADD_MES_SUCESS = 'Thêm mới thành công';
  public static DELETE_MES_SUCESS = 'Xóa thành công';
  public static UPDATE_MES_SUCESS = 'Sủa mới thành công';
  public static RESET_MES_SUCESS = 'Reset mật khẩu  mới thành công';
  public static EXPRIED_TIME = 'Không thể nộp bài';
  public static EXPRIED_EMAIL_LINK = 'Link hết thời gian hoặc không tồn tại';
  public static EXPRIED_TOKEN_REDIS = 300;
  public static EMAIL_CHECK = 'Vui lòng kiểm tra email của bạn';
}
