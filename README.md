# auto-graphql-compose-cli

cli que genera un CRUD para un componente basado en un modelo de base de datos

# Como usar el cli

1- Correr el comando "npm i -g auto-graphql-cli"

2- Crear una carpeta con el nombre del componente en la carpeta de componentes del proyecto deseado.

3- Agregar un archivo de texto llamado "table_model.txt" y agregar el modelo del componente en el siguiente formato:
Table Content {
\_id ObjectId [pk]
title String
description String [note: "WYSIWYG"]
isPrivate Boolean
creator User [ref: - User._id]
category Category [ref: - Category._id]
subcategory Subcategory [ref: - Subcategory._id]
active Boolean
createdAt Date
updatedAt Date
}
4- Desde la carpeta creada para el componente en la terminal, correr el comando "auto".
