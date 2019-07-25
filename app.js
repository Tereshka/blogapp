var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');

var app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

const PORT = process.env.PORT || 3001; 

// mongoose.connect("mongodb://localhost/blogapp");
mongoose.connect("mongodb://blogapp:blogapp@ds233500.mlab.com:33500/blogapp", { useNewUrlParser: true });
var blogSchema = new mongoose.Schema({
	title: String,
	image: String, //{type: String, default: defaultImage.jpg}
	body: String,
	created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);
// Blog.create({
// 	title: "This is the first blog post (DON'T DELETE, PLEASE)",
// 	image: "https://media.istockphoto.com/vectors/welcome-sign-vector-id492418686?s=2048x2048",
// 	body: "Congratulations!<br>This is the first blog on this service. We have a lot to discuss. hope, you enjoy this site)<br>Have a good day.<br><br>Cheers))"
// });

app.get("/", (req,res) => {
	res.redirect("/blogs");
});

//INDEX
app.get("/blogs", (req, res) => {
	Blog.find({}, (err, blogs) => {
		if( err){
			console.log(err);
		} else {
			res.render("index", {blogs});
		}
	});
});

//CREATE 
app.post("/blogs", (req, res) => {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, (err, nb) => {
		if (err) {
			res.render("new");
		} else {
			res.redirect("/blogs");
		}
	});
});

//NEW and REDIRECT to blogs
app.get("/blogs/new", (req, res) => {
	res.render("new");
});

//SHOW
app.get("/blogs/:id", (req, res) => {
	Blog.findById(req.params.id, (err, blog) => {
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("blog", {blog});
		}
		
	})
});

//EDIT
app.get("/blogs/:id/edit", (req, res) => {
	Blog.findById(req.params.id, (err, blog) => {
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog});
		}
		
	})
});

//UPDATE after EDIT
app.put("/blogs/:id", (req, res) => {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, blog) => {
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/"+ req.params.id);
		}
		
	})
});

//DESTROY
app.delete("/blogs/:id", (req, res) => {
	Blog.findByIdAndRemove(req.params.id, (err, blog) => {
		if(err){
			res.redirect("/blogs/");
		} else {
			res.redirect("/blogs/");
		}
		
	})
});

app.get("*", (req, res) => {
	res.redirect("/blogs");
});


app.listen(PORT, () => {
	console.log("server starts");
});