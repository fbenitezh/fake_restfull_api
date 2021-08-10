const { Router } = require("express");
const express = require("express");
const Contenedor = require("./Contenedor");
const upload = require("./lib/multer");
const app = express();
const PORT = 8080;
const router = new Router();
const contenedor = new Contenedor();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  const productos = contenedor.getAll();
  res.status(200).json({
    ok: true,
    productos,
  });
});

router.get("/:id", (req, res) => {
  const {
    params: { id },
  } = req;
  const producto = contenedor.getById(id);
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
  try {
    const lastInsertId = contenedor.save(body, req.file.originalname);
    res.status(201).json({
      ok: true,
      id: lastInsertId,
      info: "Se ha guardado un nuevo producto",
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
});

router.put("/:id", upload.single("foto"), (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  body.filename = req.file.originalname;
  try {
    contenedor.update(body, id);
    res.status(200).json({
      ok: true,
      id,
      info: "Producto modificado",
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  try {
    contenedor.deleteById(id);
    res.status(200).json({
      ok: true,
      info: "Producto eliminado",
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
});

app.use("/api/productos", router);

app.use("/", express.static("./src/public"));

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
