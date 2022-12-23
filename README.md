# auto-graphql-compose-cli <br />

cli que genera un CRUD para un componente basado en un modelo de base de datos<br />

# Como usar el cli <br />

1- Correr el comando "npm i -g auto-graphql-cli" <br />

2- Crear una carpeta con el nombre del componente en la carpeta de componentes del proyecto deseado.<br />

3- Agregar un archivo de texto llamado "table_model.txt" y agregar el modelo del componente en el siguiente formato:<br />
Table Content {<br />
\_id ObjectId [pk]<br />
title String<br />
description String [note: "WYSIWYG"]<br />
isPrivate Boolean<br />
creator User [ref: - User._id]<br />
category Category [ref: - Category._id]<br />
subcategory Subcategory [ref: - Subcategory._id]<br />
active Boolean<br />
createdAt Date<br />
updatedAt Date<br />
}<br />
4- Desde la carpeta creada para el componente en la terminal, correr el comando "auto".
