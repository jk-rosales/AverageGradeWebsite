var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
	review: {
		type: String,
		required: true
	}
});

var averageGradeSchema = new mongoose.Schema({
	numberGrade:{
		type: Number,
		required: true
	},

	professor:{
		type:String,
		required: true
	}
});

var courseSchema = new mongoose.Schema({

	classID: {
		type: String,
		required: true
	},
	storeGrades: [averageGradeSchema],

	cumulativeGradeAverage: {
		type: Number,
		required: true
	},

	cumulativeGradeAverageByProfessor: {
		type: Number,
		required: true
	},

	reviews:[reviewSchema]
});

var Course = mongoose.model('Course', courseSchema);

module.exports = Course;