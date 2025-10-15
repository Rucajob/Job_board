export const getIndustryPage = (req, res) => {
    try {
      // Données fictives (tu pourras les remplacer par des données DB plus tard)
      const entrepriseData = {
        entrepriseNom: "Naghmouchi Riyad",
        entrepriseEmail: "riyad@test.fr",
        entrepriseTel: "+33601020304",
        entrepriseAdresse: "1 rue de Nice, 06000 Nice",
      };
  
      // Rend la vue EJS
      res.render("pages/industry", {
        ...entrepriseData,
        title: "Ruca — Page Entreprise",
      });
    } catch (err) {
      console.error("Erreur lors du rendu de la page entreprise :", err);
      res.status(500).send("Erreur interne du serveur");
    }
  };
  