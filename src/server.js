const { Router } = require("express");
const express = require("express");
const upload = require("./lib/multer");
const app = express();
const PORT = 8080;
const router = new Router();
let productos = require("./productos.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    productos,
  });
});

router.get("/:id", (req, res) => {
  const {
    params: { id },
  } = req;
  const producto = productos.filter((prd) => prd.id == id);
  if (!producto.length) {
    return res.status(400).json({
      ok: false,
      error: "Producto no encontrado",
    });
  }
  res.status(200).json({
    ok: true,
    producto,
  });
});

router.post("/", upload.single("foto"), (req, res) => {
  const { body } = req;
  const id = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
  const nuevoProducto = {
    title: body.title,
    price: body.price,
    thumbnail: req.file.originalname,
    id,
  };
  productos.push(nuevoProducto);
  res.status(201).json({
    ok: true,
    id,
    info: "Se ha guardado un nuevo producto",
  });
});

router.put("/:id", upload.single("foto"), (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const producto = productos.filter((prd) => prd.id == id);
  if (!producto.length) {
    return res.status(400).json({
      ok: false,
      error: "Producto no encontrado",
    });
  }
  producto[0].title = body.title;
  producto[0].price = body.price;
  producto[0].thumbnail = req.file.originalname;
  res.status(200).json({
    ok: true,
    id,
    info: "Producto modificado",
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const productosUpgrade = productos.filter((prd) => prd.id != id);
  productos = productosUpgrade;
  res.status(200).json({
    ok: true,
    info: "Producto eliminado",
  });
});

app.use("/api/productos", router);

app.use("/", express.static("./src/public"));

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
