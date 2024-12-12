1. Créez la base de données “ecommerce”, contenant les collections suivantes (en annexe) :
use ("ecommerce")
 //Users : 5 utilisateurs avec des commandes associées.
db.users.insertMany(
    [
        {
          "_id": 1,
          "name": "Alice Dupont",
          "email": "alice.dupont@example.com",
          "age": 30,
          "orders": [101, 102]
        },
        {
          "_id": 2,
          "name": "Bob Martin",
          "email": "bob.martin@example.com",
          "age": 40,
          "orders": [103, 104]
        },
        {
          "_id": 3,
          "name": "Claire Durand",
          "email": "claire.durand@example.com",
          "age": 25,
          "orders": [105]
        },
        {
          "_id": 4,
          "name": "David Bernard",
          "email": "david.bernard@example.com",
          "age": 35,
          "orders": [106, 107]
        },
        {
          "_id": 5,
          "name": "Emma Leroy",
          "email": "emma.leroy@example.com",
          "age": 28,
          "orders": [108, 109, 110]
        }
      ]);*/
//○ Products : 10 produits appartenant à différentes catégories.
db.products.insertMany(
    [
        { "_id": 1, "name": "Ordinateur Portable", "category": "Électronique", "price": 999 },
        { "_id": 2, "name": "Écouteurs Bluetooth", "category": "Électronique", "price": 79 },
        { "_id": 3, "name": "Clavier Mécanique", "category": "Accessoires", "price": 120 },
        { "_id": 4, "name": "Chaise Ergonomique", "category": "Mobilier", "price": 350 },
        { "_id": 5, "name": "Bouteille Isotherme", "category": "Cuisine", "price": 25 },
        { "_id": 6, "name": "Lampe de Bureau", "category": "Mobilier", "price": 45 },
        { "_id": 7, "name": "Livre: Python pour Débutants", "category": "Livres", "price": 29 },
        { "_id": 8, "name": "Tapis de Yoga", "category": "Sport", "price": 40 },
        { "_id": 9, "name": "Montre Connectée", "category": "Électronique", "price": 199 },
        { "_id": 10, "name": "Sac à Dos", "category": "Accessoires", "price": 70 }
]);
//○ Orders : 10 commandes, associées à des utilisateurs et comprenant plusieurs produits
db.orders.insertMany(
    [
        { 
            "_id": 101, 
            "user_id": 1, 
            "products": [1, 2], 
            "total_price": 1078, 
            "status": "Livré" 
          },
          { 
            "_id": 102, 
            "user_id": 1, 
            "products": [3, 4], 
            "total_price": 470, 
            "status": "En cours" 
          },
          { 
            "_id": 103, 
            "user_id": 2, 
            "products": [5, 6, 7], 
            "total_price": 99, 
            "status": "Livré" 
          },
          { 
            "_id": 104, 
            "user_id": 2, 
            "products": [8], 
            "total_price": 40, 
            "status": "Annulé" 
          },
          { 
            "_id": 105, 
            "user_id": 3, 
            "products": [9], 
            "total_price": 199, 
            "status": "En cours" 
          },
          { 
            "_id": 106, 
            "user_id": 4, 
            "products": [10, 1], 
            "total_price": 1069, 
            "status": "Livré" 
          },
          { 
            "_id": 107, 
            "user_id": 4, 
            "products": [2, 7], 
            "total_price": 108, 
            "status": "En cours" 
          },
          { 
            "_id": 108, 
            "user_id": 5, 
            "products": [3, 8, 4], 
            "total_price": 510, 
            "status": "Livré" 
          },
          { 
            "_id": 109, 
            "user_id": 5, 
            "products": [6], 
            "total_price": 45, 
            "status": "En attente" 
          },
          { 
            "_id": 110, 
            "user_id": 5, 
            "products": [1, 9], 
            "total_price": 1198, 
            "status": "En cours" 
          }

]);*/

//1. Requêtes simples :
//○ Listez tous les produits appartenant à une catégorie donnée.
db.products.find(
  { category: "Électronique" },
  { _id: 0, name: 1, price: 1, category: 1 }
);
//○ Affichez les commandes passées par un utilisateur spécifique.
db.orders.find(
  { user_id: 4},
  { _id: 1, items: 1, total: 1, status: 1 }
);

//○ Trouvez les produits ayant un prix supérieur à une valeur donnée
db.products.find(
  { "price": { "$gt": 80 } },
  { "_id": 0, "name": 1, "price": 1 }
);

//Requêtes avancées :
//○ Calculez le chiffre d’affaires total de la plateforme.
db.orders.aggregate([
  {
      $group: {
          _id: null,
          TotalChiffreAffaire: { $sum: "$total_price" }
      }
  }
])
//○ Identifiez les trois produits les plus vendus en termes de quantité
db.orders.aggregate([
  { $unwind: "$products" },
  {
      $group: {
          _id: "$products",
          totalVendu: { $sum: 1 }
      }
  },
  { $sort: { totalVendu: -1 } },
  { $limit: 4 }
])
//Jointures entre collections :
//○ Affichez les détails de chaque commande (nom de l’utilisateur, produits commandés 
//avec leurs quantités et le total). Astuce : Utilisez $lookup pour relier les collections.
db.orders.aggregate([
  {
      $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userDetails"
      }
  },
  { $unwind: "$userDetails" },
  {
      $lookup: {
          from: "products",
          localField: "products",
          foreignField: "_id",
          as: "productDetails"
      }
  },
  {
      $project: {
          orderId: "$_id",
          userName: "$userDetails.name",
          userEmail: "$userDetails.email",
          products: "$productDetails.name",
          totalPrice: "$total_price",
          status: "$status"
      }
  }
])

//4. Statistiques par utilisateur :
//○ Calculez le total des dépenses pour chaque utilisateur.
db.orders.aggregate([
  {
      $group: {
          _id: "$user_id",
          totalDepense: { $sum: "$total_price" }
      }
  },
  {
      $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
      }
  },
  { $unwind: "$userDetails" },
  {
      $project: {
          userId: "$_id",
          userName: "$userDetails.name",
          userEmail: "$userDetails.email",
          totalDepense: 1
      }
  }
])
//○ Identifiez les utilisateurs ayant passé plus de 3 commandes.
db.orders.aggregate([
  {
      $group: {
          _id: "$user_id",
          orderCount: { $sum: 1 }
      }
  },
  { $match: { orderCount: { $gt: 3 } } },
  {
      $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
      }
  },
  { $unwind: "$userDetails" },
  {
      $project: {
          userId: "$_id",
          userName: "$userDetails.name",
          userEmail: "$userDetails.email",
          orderCount: 1
      }
  }
])
//1. Analyse avec explain() :
//○ Analysez les performances d’une requête d’agrégation complexe, comme celle pour 
//trouver les produits les plus vendus.
db.orders.aggregate([
  { $unwind: "$products" },
  {
      $group: {
          _id: "$products",
          totalVendu: { $sum: 1 }
      }
  },
  { $sort: { totalVendu: -1 } },
  { $limit: 3 }
]).explain("executionStats")
//○ Interprétez les résultats fournis par explain() (nombre de documents examinés, 
//utilisation des index, etc.).
Nombre de documents examinés : Indique l'efficacité de la requête. Plus il est faible, mieux c'est.
Utilisation des index : Si un index est utilisé, cela réduit le temps d'exécution.
Étapes clés : Vérifiez si la requête fait un scan complet de la collection. Cela doit être évité pour les grosses collections.


2. Indexation :
○ Proposez des index pour améliorer les performances des requêtes ci-dessus.

db.orders.createIndex({ "products": 1 })


db.orders.createIndex({ "user_id": 1 })

○ Justifiez vos choix : sur quels champs les index sont-ils nécessaires, et pourquoi ?

Index sur products dans orders : Optimise les requêtes qui comptent les produits les plus vendus.
Index sur user_id dans orders : Accélère les jointures avec Users.
Index sur _id dans users et products : Déjà présents par défaut, nécessaires pour les jointures.

Ces index réduisent les scans complets et améliorent les performances des requêtes d'agrégation et des jointures.

/*Identifier des utilisateurs VIP
○ Définissez les utilisateurs VIP comme ceux qui :
■ Ont passé au moins 5 commandes.
■ Ont un total de dépenses supérieur à 500 €.
○ Écrivez une requête d’agrégation pour détecter ces utilisateurs et affichez leur nom, 
email et total de dépenses.*/
db.orders.aggregate([
  {
      $group: {
          _id: "$user_id",
          totalDepense: { $sum: "$total_price" },
          totalCommande: { $sum: 1 }
      }
  },
  {
      $match: {
          totalCommande: { $gte: 5 },
          totalDepense: { $gt: 500 }
      }
  },
  {
      $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
      }
  },
  { $unwind: "$userDetails" },
  {
      $project: {
          userName: "$userDetails.name",
          userEmail: "$userDetails.email",
          totalCommande: 1,
          totalDepense: 1
      }
  }
])

//Détection des produits sous-performants
//○ Ajoutez un champ date dans les commandes pour simuler des dates.
const currentDate = new Date();
db.orders.find().forEach(order => {
    const randomDaysAgo = Math.floor(Math.random() * 60);
    const randomDate = new Date(currentDate);
    randomDate.setDate(currentDate.getDate() - randomDaysAgo);
    db.Orders.updateOne({ _id: order._id }, { $set: { date: randomDate } });
});
//○ Identifiez les produits ayant été commandés moins de 3 fois dans les 30 derniers jours.
///○ Affichez leur nom et leur nombre de commandes.
db.orders.aggregate([
  {
      $match: {
          date: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
      }
  },
  { $unwind: "$products" },
  {
      $group: {
          _id: "$products",
          orderCount: { $sum: 1 }
      }
  },
  { $match: { orderCount: { $lt: 3 } } },
  {
      $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
      }
  },
  { $unwind: "$productDetails" },
  {
      $project: {
          productName: "$productDetails.name",
          orderCount: 1
      }
  }
])







