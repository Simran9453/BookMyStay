const Listing = require("../models/listing");

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings});
};

module.exports.createListing = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,"..",filename);
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url,filename};
    await newlisting.save();
    req.flash("success","new listing created!!");
    res.redirect("/listings");
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if (!listing) {
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.renderListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
};

module.exports.updateListing = async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing");
    }
    let {id} = req.params;
    req.body.listing.image = {
        url: req.body.listing.image,
        filename: "listingimage"
    };
     await Listing.findByIdAndUpdate(id,{...req.body.listing});
     req.flash("success","listing updated!");
     res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};