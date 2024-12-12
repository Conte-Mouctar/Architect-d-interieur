const url = "http://localhost:5678";
const gallery = document.querySelector(".gallery");
const galleriePhotoModal = document.querySelector(".galleriePhotoModal");
let toutLesProjet = [];

// Pour recuperer les donnes Projet via L'API avec cet fonction

const recupereWorksApi = async () => {
  const urlEndPointWorks = "/api/works";
  try {
    const response = await fetch(`${url}${urlEndPointWorks}`);
    if (response.ok) {
      toutLesProjet = await response.json();
      affichageWorksSurlaPage(toutLesProjet);
    } else {
      throw new Error(`l'erreur est ${response.status}`);
    }
  } catch (error) {
    console.log(error);
  }
};

// Affichage des Works sur la page modal

const affichageWorkModal = (projects) => {
  const galleriePhotoModal = document.querySelector(".galleriePhotoModal");
  galleriePhotoModal.innerHTML = "";

  projects.forEach((project) => {
    const figure = document.createElement("figure");

    const image = document.createElement("img");
    image.src = project.imageUrl;
    image.classList.add("imageModale");

    const iconeDelete = document.createElement("img");
    iconeDelete.src =
      "./assets/icons/delete_16dp_FFFFFF_FILL0_wght400_GRAD0_opsz20.svg";
    iconeDelete.classList.add("iconeDelete");

    figure.appendChild(image);
    figure.appendChild(iconeDelete);
    galleriePhotoModal.appendChild(figure);
  });
  SupressionDesProjet();
};

// Mise en page des Projet recuperer via l'API

const affichageWorksSurlaPage = (projects) => {
  gallery.innerHTML = "";

  projects.forEach((project) => {
    const figure = document.createElement("figure");

    const image = document.createElement("img");
    image.src = project.imageUrl;
    image.alt = project.title;

    const caption = document.createElement("figcaption");
    caption.textContent = project.title;

    figure.appendChild(image);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  });
};

///////////////////////////////////////////////////////////////////////////////
// Recuperer les different menu via l'API

const recupererMenuApi = async (callback) => {
  const urlEndPointCategories = "/api/categories";
  try {
    const response = await fetch(`${url}${urlEndPointCategories}`);
    if (response.ok) {
      const responseJson = await response.json();

      if (callback) {
        callback(responseJson);
      }
    } else {
      throw new Error(`l'erreur est ${response.status}`);
    }
  } catch (error) {
    console.log(error);
  }
};

// Mise en page du menu des Projet

const menuDesProjet = async (filtres) => {
  const menu = document.querySelector(".menu");
  menu.innerHTML = " ";

  const tousButton = document.createElement("button");
  tousButton.classList.add("buttonMenu");
  const texteTous = document.createElement("h3");
  tousButton.innerText = "Tous";

  tousButton.addEventListener("click", () => {
    affichageWorksSurlaPage(toutLesProjet);
  });

  menu.appendChild(tousButton);
  tousButton.appendChild(texteTous);

  filtres.forEach((filtre) => {
    const button = document.createElement("button");
    button.classList.add("buttonMenu");
    const text = document.createElement("h3");
    text.textContent = filtre.name;

    button.addEventListener("click", () => {
      const menufiltreeParSecteur = toutLesProjet.filter(
        (project) => project.categoryId === filtre.id
      );
      affichageWorksSurlaPage(menufiltreeParSecteur);
    });

    button.appendChild(text);
    menu.appendChild(button);
  });
};

// Recuperation des elements pour les modals

const modal = document.querySelector(".modal");
const modal2 = document.querySelector(".modal2");
const modalAjoutPhoto = document.querySelector(".modal2");
const openModalBtn = document.querySelector(".jsModal");
const closeModalIcone = document.querySelector(".iconClose");
const modalWrapper = document.querySelector(".modal-wrapper");
const modalWrapper2 = document.querySelector(".modal-wrapper2");
const BtnAjoutPhoto = document.querySelector(".ajoutPhoto");
const iconeBackModal = document.querySelector(".iconeBackModal");
const closeModalIcone2 = document.querySelector(".closeModalIcone2");

// Function pour la modal Supression des projet
const openModal = () => {
  modal.style.display = "flex";
  affichageWorkModal(toutLesProjet);
};

const closeModal = () => {
  modal.style.display = "none";
};

//Function Pour la modal Ajout de Projet
const openModalAjoutPhoto = () => {
  modalAjoutPhoto.style.display = "flex";
  affichageWorkModal(toutLesProjet);
};

const closeModalAjoutPhoto = () => {
  modalAjoutPhoto.style.display = "none";
};

// Affichage de la page Modal suppression des projet

openModalBtn.addEventListener("click", openModal);
closeModalIcone.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (!modalWrapper.contains(event.target)) {
    closeModal();
  }
});

// Affichage de la Page modal - Ajout photo
BtnAjoutPhoto.addEventListener("click", openModalAjoutPhoto);
BtnAjoutPhoto.addEventListener("click", closeModal);

iconeBackModal.addEventListener("click", closeModalAjoutPhoto);
iconeBackModal.addEventListener("click", openModal);
closeModalIcone2.addEventListener("click", closeModalAjoutPhoto);
modal2.addEventListener("click", (event) => {
  if (!modalWrapper2.contains(event.target)) {
    closeModalAjoutPhoto();
  }
});

// Mode admin vs Mode utilisateurs

const modeAdmin = () => {
  const token = window.localStorage.getItem("token");
  const logout = document.querySelector(".logout");
  const menu = document.querySelector(".menu");
  const btnModifier = document.querySelector(".jsModal");
  const BarreModeEdit = document.querySelector(".modeEdition");

  if (token) {
    logout.innerHTML = "logout";
    logout.href = "#";
    menu.style.display = "none";
    btnModifier.style.display = "flex";
    logout.addEventListener("click", (event) => {
      window.localStorage.removeItem("token");
      logout.innerHTML = "login";
      logout.href = "./login.html";
      menu.style.display = "flex";
      BarreModeEdit.style.display = "flex";
    });
  } else {
    btnModifier.style.display = "none";
    BarreModeEdit.style.display = "none";
  }
};

// Pour la supression des works

const SupressionDesProjet = () => {
  const iconeDelete = document.querySelectorAll(".iconeDelete");
  const token = window.localStorage.getItem("token");

  iconeDelete.forEach((icone, index) => {
    icone.addEventListener("click", async () => {
      const id = toutLesProjet[index].id;
      const endPoint = `/api/works/${id}`;

      try {
        const response = await fetch(`${url}${endPoint}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          toutLesProjet = toutLesProjet.filter((project) => project.id !== id);
          affichageWorkModal(toutLesProjet);
          affichageWorksSurlaPage(toutLesProjet);
        }
      } catch (error) {
        console.log(error);
      }
    });
  });
};

// Pour l'affichage des Categorie dans la modal ajout Photo

const affichageMenuModalPhoto = (categories) => {
  const formCategorie = document.querySelector("#categorieForm");
  formCategorie.innerHTML = "";

  categories.forEach((categorie) => {
    const option = document.createElement("option");
    option.textContent = categorie.name;
    option.value = categorie.id;
    formCategorie.appendChild(option);
  });
};

// Requete Formulaire pour ajouter un projet

const ajoutProjet = () => {
  const formulaireAjout = document.querySelector("#formAjoutPhoto");

  formulaireAjout.addEventListener("submit", async (event) => {
    event.preventDefault();

    const titre = document.getElementById("titresImageForm").value.trim();
    const categorie = document.getElementById("categorieForm").value;
    const image = document.getElementById("imageProjet").files[0];
    const formData = new FormData();

    formData.append("title", titre);
    formData.append("category", categorie);
    formData.append("image", image);

    try {
      const token = window.localStorage.getItem("token");
      const endPoint = "/api/works";

      const response = await fetch(`${url}${endPoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        const responseJson = await response.json();

        toutLesProjet.push(responseJson);
        formulaireAjout.reset();
        affichageWorkModal(toutLesProjet);
        affichageWorksSurlaPage(toutLesProjet);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

// Changement de couleur quand le formulaire est remplie
const btnValideVert = () => {
  const formulaireAjout = document.querySelector("#formAjoutPhoto");
  const btnValidationForm = document.querySelector(".btnValidationForm");

  const verifierFormulaire = () => {
    const titre = document.getElementById("titresImageForm").value.trim();
    const categorie = document.getElementById("categorieForm").value;
    const image = document.getElementById("imageProjet").files[0];

    if (titre && categorie && image) {
      btnValidationForm.style.backgroundColor = "green";
    } else {
      btnValidationForm.style.backgroundColor = "grey";
    }
  };

  formulaireAjout.addEventListener("change", verifierFormulaire);
};

// Chargement de l'image telecharger en arriere plan dans la modale photo
const inputFile = document.getElementById("imageProjet");
const previewDiv = document.getElementById("backgroundImageForm");
const miniatureImage = document.querySelector(".miniatureImage");
const imageProjet = document.querySelector("#imageProjet");
const tailleFichier = document.querySelector(".tailleFichier");

inputFile.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewDiv.style.backgroundImage = `url('${e.target.result}')`;
      previewDiv.style.backgroundSize = "contain";
      previewDiv.style.backgroundRepeat = "no-repeat";
      previewDiv.style.backgroundPosition = "center";

      miniatureImage.style.display = "none";
      imageProjet.style.display = "none";
      tailleFichier.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

recupereWorksApi();
recupererMenuApi(menuDesProjet);
recupererMenuApi(affichageMenuModalPhoto);
modeAdmin();
ajoutProjet();
btnValideVert();
