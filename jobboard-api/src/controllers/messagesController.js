import Message from "../Model/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const { prenom, nom, email, sujet, message } = req.body;

    if (!prenom || !nom || !email || !sujet || !message) {
      return res.status(400).render("pages/contact", { message: "Tous les champs sont requis." });
    }

    await Message.create({ prenom, nom, email, sujet, message });
    res.render("pages/contact", { message: "✅ Votre message a bien été envoyé !" });
  } catch (error) {
    console.error("Erreur lors de l’envoi du message :", error);
    res.status(500).render("pages/contact", { message: "❌ Erreur lors de l’envoi du message." });
  }
};