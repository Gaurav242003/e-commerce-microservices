const Product = require("../models/products");

const registerProduct = async (req, res) =>{
     try{
        const {heading, description, price} = req.body;
        const product = new Product({
            heading: heading,
            description: description,
            price: price

        })

        await product.save();
        res.send({
            "product registered": product
        });
     }catch(err){
        console.log({"Product error": err});
     }
}

module.exports = registerProduct;