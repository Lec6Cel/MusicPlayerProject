const router = require("express").Router();

const artist = require("../models/artist");
//songs model
const song = require("../models/song");

router.get("/getOne/:id", async ( req, res ) => {
    const filter = { _id: req.params.id };

    const data = await song.findOne(filter);


    if (data) {
       return  res.status(200).send({success : true, song: data})
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

    const data = await song.find({},null, options);
    if (data) {
        return  res.status(200).send({success : true, song: data})
    } else {
        return  res.status(400).send({success : false, msg : "Data not Found"})
    };
});

router.get("/getFavouritesSongs", async (req, res) => {
    const query = req.query.id;
    res.send(query);
  });

router.post("/save", async (req, res) => {
    const newSong = song({
     name: req.body.name,
     imageURL: req.body.imageURL,
     songURL: req.body.songURL,
     album : req.body.album,
     artist: req.body.artist,
     language: req.body.language,
     category: req.body.category
    });
    try {
      const saveSong = await newSong.save();
      return res.status(200).send({ success: true, song: saveSong });
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
        const result = await song.findOneAndUpdate(
            filter, 
            {
                name: req.body.name,
                imageURL: req.body.imageURL,
                songURL: req.body.songURL,
                album : req.body.album,
                artist: req.body.artist,
                language: req.body.language,
                category: req.body.category
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

    const result = await song.deleteOne(filter);
    if(result) {
        return res.status(200).send({success : true, msg : "Data Deleted successfully", data : result})
    } else {
        return res.status(400).send({success : false, msg : "Data not Found"})
    }
});

module.exports = router;