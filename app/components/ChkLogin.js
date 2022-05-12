function ChkLogin() {
  return Boolean(localStorage.getItem("complexappToken"));
}

export default ChkLogin;
