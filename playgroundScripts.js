/****************PLAYGROUND*******************/

const movieSchema = new mongoose.Schema({
  title: String,
  rating: Number,
  releaseDate: { type: Date, default: Date.now },
});

const Movie = mongoose.model("Movie", movieSchema);

const movie = new Movie({
  title: "new girl",
  rating: 3.2,
});

movie.save().then((res) => {
  //	dbDebugger(res);
});

//////////////////////////// PAGINATION ///////////////////////////////////////

let pageSize = 10;
let pageNumber = 3;

Movie
  // .find({title : /^girl/})
  .find({ title: { $gte: 4 } })
  .select({ title: 1, id: -1 })
  .or({ title: "new girl" }, { genre: "thriller" })
  .skip((pageNumber - 1) * pageSize)
  .limit(pageSize)
  // .count()
  .then((res) => {
    dbDebugger("movies: ", res);
  });

/////////////////////////////////////////////////////////////////////////////////

////////////////// VALIDATION //////////////////////////////////////////////

const courseSchemea = new mongoose.Schema({
  name: { type: String, required: true },
  author: String,
  tags: {
    type: [String],
    validate: {
      validator: function (tags) {
        const filtered = tags.filter(Boolean);
        return filtered && filtered.length > 0;
      },
      message: "A course should atleast have one tag bro.",
    },
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
  },
  category: {
    type: String,
    enum: ["some", "america", "by"],
  },
});

const Course = mongoose.model("Course", courseSchemea);

//////////////////////////////////////////////////////////////////// ////////////

/////////////////////////// CREATE DATA //////////////////////////////////

const addCourse = async () => {
  const course = new Course({
    name: "Some shit here",
    author: "don give a s",
    tags: [],
    isPublished: true,
    // price: 199.99,
    category: "shii",
  });

  try {
    const res = await course.save();
    console.log(res);
  } catch (err) {
    for (field in err.errors) {
      console.log(err.errors[field].message);
    }
  }
};

addCourse();

///////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// DATA QUERY OPTIONS /////////////////////////////////////////

Course.find({ isPublished: true, tags: { $in: ["frontend", "backend"] } })
  .sort("-price")
  .select("name author price")
  .then((res) => dbDebugger("courses: ", res));

Course.find({ isPublished: true })
  .or([{ name: /.*by.*/ }, { price: { $gte: 15 } }])
  .then((res) => dbDebugger("courses: ", res));

///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////// DATA UPDATE /////////////////////////////////////////////////////

const updateCourse = async (id) => {
  // const course = await  Course.findById(id);
  // if(!course) return dbDebugger("Noting by that id bro");

  // course.name = "shit is happening";
  // course.author = "I make shit happen";

  // const newCourse = await course.save();
  // dbDebugger("new course: " , newCourse)

  const result = await Course.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        author: "Ugggglllyy betty",
      },
    },
    { new: true }
  );

  dbDebugger("new course: ", result);
};

updateCourse("5a68fde3f09ad7646ddec17e");

////////////////////////////////////////////////////////////////////////////////////////

///////////////////////// REALTIONS ///////////////////////////////////////////

// 1.reference type (normalization)
const courseSchema = new mongoose.Schema({
  name: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },
});

const authorSchema = new mongoose.Schema({
  name: String,
  website: String,
  students: Number,
});

const Author = mongoose.model("Author", authorSchema);

// 2.embeding type (denormalization)
const courseSchema = new mongoose.Schema({
  name: String,
  author: authorSchema,
});

const Course = mongoose.model("Course", courseSchema);

const createAuthor = async () => {
  const author = new Author({
    name: "Someone",
    website: "someone.me",
    students: 3444444,
  });
  const response = await author.save();
  dbDebugger("author: ", response);
};

createAuthor();

const createCourse = async () => {
  const course = new Course({
    name: "shity course",
    author: new Author({
      name: "Someone",
      website: "someone.me",
      students: 3444444,
    }),
  });

  const response = await course.save();
  dbDebugger("course: ", response);
};

createCourse();

const allCourses = async () => {
  const courses = await Course.find()
    .populate("author", "name website -_id")
    .select("name author");

  dbDebugger("courses: ", courses);
};

allCourses();

const allAuthors = async () => {
  const authors = await Author.find();
  dbDebugger("authors: ", authors);
};

allAuthors();

////////////////////////////////////////////////////////////////////////////////////
