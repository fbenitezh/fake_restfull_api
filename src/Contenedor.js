let productos = require("./productos.json");

class Contenedor {
  save(data, filename) {
    try {
      const id =
        productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
      const nuevoProducto = {
        title: data.title,
        price: data.price,
        thumbnail: filename,
        id,
      };
      productos.push(nuevoProducto);
      return id;
    } catch (error) {
      throw new Error(error);
    }
  }

  update(data, id) {
    try {
      const producto = productos.filter((prd) => prd.id == id);
      if (!producto.length) {
        throw new Error("Producto no encontrado");
      }
      producto[0].title = data.title;
      producto[0].price = data.price;
      producto[0].thumbnail = data.filename;
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  getById(id) {
    try {
      const producto = productos.filter((prd) => prd.id == id);
      return producto;
    } catch (error) {
      throw new Error(error);
    }
  }

  getAll() {
    return productos;
  }

  deleteById(id) {
    try {
      const productosUpgrade = productos.filter((prd) => prd.id != id);
      productos = productosUpgrade;
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = Contenedor;
