const fs = require("fs");

class Contenedor {
  constructor(nameFile) {
    this.nameFile = nameFile;
  }

  async save(data, foto) {
    try {
      let contenido = await fs.promises.readFile(this.nameFile, "utf-8");
      data.id = 1;
      if (contenido != "") {
        contenido = JSON.parse(contenido);
        data.id = contenido[contenido.length - 1].id + 1;
      }
      let array = [
        ...contenido,
        {
          title: data.title,
          price: data.price,
          thumbnail: foto,
          id: data.id,
        },
      ];
      await fs.promises.writeFile(
        this.nameFile,
        JSON.stringify(array, null, 2)
      );
      console.log(`subido el producto ${data.title}`);
      return data.id;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(data, id) {
    try {
      let contenido = await fs.promises.readFile(this.nameFile, "utf-8");
      contenido = JSON.parse(contenido);
      let index = null;
      let producto = null;
      contenido.map((prd, key) => {
        if (prd.id == id) {
          producto = prd;
          index = key;
          return;
        }
      });
      //console.log(producto);

      producto.title = data.title;
      producto.price = data.price;
      producto.thumbnail = data.foto;

      contenido[index] = producto;
      await fs.promises.writeFile(
        this.nameFile,
        JSON.stringify(contenido, null, 2)
      );
      return;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById(id) {
    try {
      let contentFile = await fs.promises.readFile(this.nameFile, "utf-8");
      contentFile = JSON.parse(contentFile);
      return contentFile.filter((item) => item.id == id);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll() {
    try {
      let content = await fs.promises.readFile(this.nameFile, "utf-8");
      if (content == "") return [];
      return JSON.parse(content);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteById(id) {
    try {
      let contentFile = await fs.promises.readFile(this.nameFile, "utf-8");
      if (contentFile == "") return "Nada para eliminar";
      contentFile = JSON.parse(contentFile);
      let nuevoContenido = contentFile.filter((item) => item.id != id);
      nuevoContenido =
        nuevoContenido.length == 0
          ? ""
          : JSON.stringify(nuevoContenido, null, 2);
      await fs.promises.writeFile(this.nameFile, nuevoContenido);
      return;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = Contenedor;
