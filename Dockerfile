# Utilisez une image de base appropriée, par exemple une image Node.js pour une application JavaScript/Node.js
FROM node:20.1.0

# Définissez le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Copiez les fichiers package.json et package-lock.json (ou yarn.lock) dans le conteneur
COPY back/package*.json ./

# Installez les dépendances de l'application
RUN npm install

# Copiez le reste des fichiers de votre application dans le conteneur
COPY . .

# Exposez le port sur lequel votre application écoute (si nécessaire)
EXPOSE 3000

# Démarrez votre application lorsque le conteneur est lancé
# une CMD par dockerfile
CMD [ "npm", "start" ]
