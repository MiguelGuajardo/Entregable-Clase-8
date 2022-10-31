const express = require("express");
const { userInfo } = require("os");
const app = express();
const {Router} = express;
const router = Router();
const path = require("path");
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ---Lógica */
let products = []

  app.use("/api/products", router);

  router.get("/", (req,res)=>{
    if(products.length === 0){
        res.json({error:"No hay productos cargados"})
    }else{
        res.json(products);
    }
  } )
  /* --Product by Id-- */

  router.get("/:productId", (req,res)=>{
    if (products.indexOf(products[req.params.productId - 1]) === -1) {
        res.json({ error: "producto no encontrado" });
      } else {
        res.json(products[req.params.productId - 1]);
      }
  })
 /* --CreateNewProduct-- */

 router.post("/", (req,res) =>{
        if (products.length > 0) {
          let lastId = products.reduce(
            (acc, item) => (item.id > acc ? (acc = item.id) : acc),
            0
          );
      
          let newProduct = {
            id: lastId + 1,
            ...req.body,
          };
      
          products.push(newProduct);
          res.json(newProduct);
        } else {
          let newProduct = {
            id: 1,
            ...req.body,
          };
      
          products.push(newProduct);
          res.json(newProduct);
        }
      
  })
  /* --Modified Product-- */

  router.put("/:productId",(req,res)=>{
      const {title,price,thumbnail} = req.body;
    const id = req.params.productId;

    const product = products.find((product)=> product.id == id);

    if (products.indexOf(product) === -1) {
        res.json({error:"Producto no encontrado"});
      } else {

            if(title) product.title = title;
            if(price) product.price = price;
            if(thumbnail) product.thumbnail = thumbnail;
    
        res.json(product);
        res.send(`El producto con el id ${id} fue modificado`)
      }
})
    /* --Delete Product-- */

  router.delete("/:productId", (req,res)=>{
    const id = req.params.productId;
    products = products.filter((product)=> product.id != id )
    res.send(`El producto con el id ${id} fue eliminado `)
  });


const server = app.listen(PORT, (req,res) => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))
