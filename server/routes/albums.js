const router = require("express").Router();

//albums model
const album = require("../models/album");

router.get("/getOne/:id", async ( req, res ) => {
    const filter = { _id: req.params.id };

    const data = await album.findOne(filter);

    if (data) {
       return  res.status(200).send({success : true, album: data})
    } else {
       return  res.status(400).send({success : false, msg : "Data not Found"})
    }
});

router.get("/getAll", async ( req, res ) => {
    const options = {
        sort : {
            // sap xep cac thong tin nghe si theo thu tu da tao truoc do
            createdAt : 1
        },
    };

    const data = await album.find({},null, options);
    if (data) {
        return  res.status(200).send({success : true, album: data})
    } else {
        return  res.status(400).send({success : false, msg : "Data not Found"})
    };
});

router.post("/save", async (req, res) => {
    const newAlbum = album({
     name: req.body.name,
     imageURL: req.body.imageURL,
    });
    try {
      const saveAlbum = await newAlbum.save();
      return res.status(200).send({ success: true, album: saveAlbum });
    } catch (error) {
     return res.status(400).send({ success: false, msg: error });
    } 
 });

 router.put("/update/:id", async (req, res) => {
    const filter = { _id: req.params.id };
    const options = { 
        upsert: true, 
        new: true 
    };
    
    try {
        const result = await album.findOneAndUpdate(
            filter, 
            {
                name: req.body.name,
                imageURL: req.body.imageURL,
            },
            options
        );
        return res.status(200).send({success : true, data : result});
    } catch (error) {
        return res.status(400).send({success : false, msg : error});
    }
});

router.delete("/delete/:id", async (req, res) => {
    const filter = { _id: req.params.id };

    const result = await album.deleteOne(filter);
    if(result) {
        return res.status(200).send({success : true, msg : "Data Deleted successfully", data : result})
    } else {
        return res.status(400).send({success : false, msg : "Data not Found"})
    }
});

module.exports = router;