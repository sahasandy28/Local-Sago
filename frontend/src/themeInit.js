const savedTheme = localStorage.getItem("localSahaTheme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-theme");
} else {
  document.body.classList.remove("dark-theme");
}