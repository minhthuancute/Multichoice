export class GConfig {
  public static MES_NOT_FOUND(name: string): string {
    return `${name} is not found`;
  }
  public static MES_ALREADY_EXISTS(name: string): string {
    return `${name} already exists`;
  }
  public static MES_NOT_EMPTY(name: string): string {
    return `${name} is not empty`;
  }

  public static EMAIL_NOT_FOUND = this.MES_NOT_FOUND('Email');
  public static EMAIL_ALREADY_EXISTS = this.MES_ALREADY_EXISTS('Email');
  public static USER_NOT_FOUND = this.MES_NOT_FOUND('User');

  public static TOPIC_NOT_FOUND = this.MES_NOT_FOUND('Topic');

  public static NOT_PERMISSION_VIEW = 'You do not have permission to view';
  public static NOT_PERMISSION_DELETE = 'You do not have permission to delete';
  public static NOT_PERMISSION_EDIT = 'You do not have permission to edit';

  public static ANSWERS_NOT_EMPTY = this.MES_NOT_EMPTY('Answers');

  public static QUESTION_NOT_FOUND = this.MES_NOT_FOUND('Question');

  public static PASSWORD_IS_INCORRECT = 'Password is incorrect';
  public static SUCESS = 'Sucess';
  public static EXPRIED_TIME = 'Hết thời gian làm bài';
}
