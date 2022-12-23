# auto-graphql-compose-cli <br />

cli que genera un CRUD para un componente basado en un modelo de base de datos<br />

# Como usar el cli <br />

1- Correr el comando "npm i -g auto-graphql-cli" <br />

2- Crear una carpeta con el nombre del componente en la carpeta de componentes del proyecto deseado.<br />

3- Agregar un archivo de texto llamado "table_model.txt" y agregar el modelo del componente en el siguiente formato:<br />
Table Content {<br />
&emsp;\_id ObjectId [pk]<br />
&emsp;title String<br />
&emsp;description String [note: "WYSIWYG"]<br />
&emsp;isPrivate Boolean<br />
&emsp;creator User [ref: - User._id]<br />
&emsp;category Category [ref: - Category._id]<br />
&emsp;subcategory Subcategory [ref: - Subcategory._id]<br />
&emsp;active Boolean<br />
&emsp;createdAt Date<br />
&emsp;updatedAt Date<br />
}<br />
4- Desde la carpeta creada para el componente en la terminal, correr el comando "auto".
