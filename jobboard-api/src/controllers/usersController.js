import User from "../Model/Users.js";
import Application from "../Model/Applications.js";

// Liste des utilisateurs
export const listUsers = async (req, res) => {
  const users = await User.getAll();
  res.render("users/index", { users });
};

// Voir un utilisateur
export const showUser = async (req, res) => {
  const user = await User.getById(req.params.id);
  const applications = await Application.getByUserId(req.params.id);
  res.render("users/show", { user, applications });
};

// Formulaire d’ajout
export const addUserForm = (req, res) => {
  res.render("users/add");
};

// Créer un utilisateur
export const createUser = async (req, res) => {
  await User.create(req.body);
  res.redirect("/users");
};

// Modifier un utilisateur
export const updateUser = async (req, res) => {
  await User.update(req.params.id, req.body);
  res.redirect("/users");
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
  await User.delete(req.params.id);
  res.redirect("/users");
};

// 🆕 Page publique : profil utilisateur
export const renderUserProfile = async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) {
      return res.status(404).render("404", { message: "Utilisateur introuvable" });
    }

    const applications = await Application.getByUserId(req.params.id);
    res.render("users/profile", { user, applications });
  } catch (err) {
    console.error("Erreur profil utilisateur :", err);
    res.status(500).send("Erreur serveur");
  }
};

