const router = require("express").Router();
const FoodModel = require("../models/Food.model.js")
const uploader = require("../middlewares/uploader");
const isAuthenticated = require("../middlewares/isAuthenticated.js");

//GET '/api/alimentos' => Renderizamos la lista de alimentos
router.get('/', async (req, res, next) => {
  try {
    // Seleccionamos las comidas a mostrar por nombre
    const response = await FoodModel.find()
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// POST '/api/alimentos => Añadir un nuevo alimento
router.post('/',isAuthenticated, uploader.single("image"), async (req, res, next) => {
  const { name, type, season, image} = req.body
  try {
    //Controlamos que el alimento no se repita por nombre
    const foundFood = await FoodModel.findOne({name})
    if(foundFood !== null){
      res.status(400).json({errorMessage: "El alimento ya existe"})
      return;
    }
    //Creamos un nuevo alimento que será añadido a la lista
    const response = await FoodModel.create({
      name,
      image,
      type,
      season
    })
    res.json(response)
  } catch (error) {
    next(error)
  }
})

//GET '/api/alimentos/:id => Mostramos detalles del alimento
router.get('/:id', async (req, res, next) => {
  const{ id } = req.params //*Requerimos la id del Params
  try {
    //Buscamos el alimento a mostrar por su Id
    const response = await FoodModel.findById(id)
    res.json(response)
  } catch (error) {
    next(error)
  }
})

//PATCH '/api/alimentos/:id' => Editamos el alimento
router.patch('/:id',isAuthenticated, uploader.single("image"), async (req, res, next) => {
  const { id } = req.params
  const { name, type, season, image } = req.body

  try {
    await FoodModel.findByIdAndUpdate(id,{
    name,
    image,
    type,
    season
  })
  res.json("El alimento se actualizo correctamente")
  } catch (error) {
    next(error)
  }
})

//DELETE '/api/alimentos/:id' => Borrado de un alimento de nuestr lista
router.delete('/:id',isAuthenticated, async (req, res, next) => {
  const { id } = req.params
  try{
    await FoodModel.findByIdAndDelete(id)
    res.json("El alimento ha sido eliminado")
  }catch (error){
    next (error)
  }
})

module.exports = router;