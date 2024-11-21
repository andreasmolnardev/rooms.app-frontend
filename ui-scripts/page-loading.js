



export function showPage(type) {
  document.getElementsByClassName("loader")[0].style.display = "none";
  if (type == "admin") {
    document.getElementsByClassName("app")[0].style.display = "flex";
  } else {
    document.getElementsByClassName("app")[0].style.display = "grid";
  }
}


