const connexion = async () => {
  const endPointUsersLogin = "/api/users/login";

  const form = document.querySelector(".formConnexion");
  const texteErreur = document.querySelector(".messageErreur");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const emailDeConexion = document.getElementById("email").value;
    const motDePasseConnexion = document.getElementById("motDePasse").value;

    try {
      const response = await fetch(`${url}${endPointUsersLogin}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailDeConexion,
          password: motDePasseConnexion,
        }),
      });
      if (response.ok) {
        const responseJson = await response.json();
        window.localStorage.setItem("token", responseJson.token);
        window.location.href = "./index.html";
      } else if (response.status === 401 || response.status === 404) {
        texteErreur.textContent = "Nom d'utilisateur ou mot de passe incorrect";
        texteErreur.style.display = "block";
      } else {
        throw new Error(`L'erreur provien de ${response.status}`);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

connexion();
