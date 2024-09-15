export class NumberUtil {
  static generateVerificationCode() {
    const code = Math.floor(1000 + Math.random() * 9000);
    return code.toString();
  }
}
