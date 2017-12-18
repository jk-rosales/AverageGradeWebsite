var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var _ = require('underscore');
var mongoose = require('mongoose');
var app = express();
var fetch = require('node-fetch');
var dataUtil = require("./data-util");
var Course = require('./models/Course');
var dotenv = require('dotenv')

dotenv.load();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5 
 * endpoints for the API, and 5 others. 
 */
var courses = [{"course_id":"CMSC122","name":"Introduction to Computer Programming via the Web","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"3","grading_method":["Regular"],"core":["I"],"gen_ed":["DSSP"],"description":"Introduction to computer programming in the context of developing full featured dynamic web sites. Uses a problem solving approach to teach basics of program design and implementation using JavaScript; relates these skills to creation of dynamic web sites; then explores both the potential and limits of web-based information sources for use in research. Intended to help relate a student's major to these emerging technologies.","relationships":{"prereqs":null,"coreqs":null,"restrictions":"Must not have completed any courses from CMSC131-499 course range; and must not be concurrently enrolled in CMSC131.","credit_granted_for":"CMSC122 or CMSC198N.","also_offered_as":null,"formerly":"CMSC198N.","additional_info":null},"sections":["CMSC122-0101","CMSC122-0201","CMSC122-0301"]},{"course_id":"CMSC131","name":"Object-Oriented Programming I","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"4","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"Introduction to programming and computer science. Emphasizes understanding and implementation of applications using object-oriented techniques. Develops skills such as program design and testing as well as implementation of programs using a graphical IDE. Programming done in Java.","relationships":{"prereqs":null,"coreqs":"MATH140; and permission of CMNS-Computer Science department.","restrictions":null,"credit_granted_for":null,"also_offered_as":null,"formerly":null,"additional_info":null},"sections":["CMSC131-0101","CMSC131-0102","CMSC131-0103","CMSC131-0104","CMSC131-0201","CMSC131-0202","CMSC131-0203","CMSC131-0301","CMSC131-0302","CMSC131-0303","CMSC131-0304","CMSC131-0401","CMSC131-0402","CMSC131-0403","CMSC131-0404","CMSC131-0405","CMSC131-0406","CMSC131-0407"]},{"course_id":"CMSC132","name":"Object-Oriented Programming II","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"4","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"Introduction to use of computers to solve problems using software engineering principles. Design, build, test, and debug medium -size software systems and learn to use relevant tools. Use object-oriented methods to create effective and efficient problem solutions. Use and implement application programming interfaces (APIs). Programming done in Java.","relationships":{"prereqs":"Minimum grade of C- in CMSC131; or must have earned a score of 5 on the A Java AP exam.","coreqs":null,"restrictions":null,"credit_granted_for":null,"also_offered_as":null,"formerly":null,"additional_info":"Or permission of the department based on satisfactory performance on the department placement exam; and minimum grade of C- in MATH140; and permission of CMNS-Computer Science department."},"sections":["CMSC132-0101","CMSC132-0102","CMSC132-0103","CMSC132-0104","CMSC132-0105","CMSC132-0106","CMSC132-0107","CMSC132-0108","CMSC132-0201","CMSC132-0202","CMSC132-0203","CMSC132-0204","CMSC132-0401","CMSC132-0402","CMSC132-0403","CMSC132-0404"]},{"course_id":"CMSC132A","name":"Object-Oriented Programming II","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"4","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"Introduction to use of computers to solve problems using software engineering principles. Design, build, test, and debug medium -size software systems and learn to use relevant tools. Use object-oriented methods to create effective and efficient problem solutions. Use and implement application programming interfaces (APIs). Programming done in Java.","relationships":{"prereqs":"Minimum grade of C- in CMSC131; or must have earned a score of 5 on the A Java AP exam.","coreqs":null,"restrictions":null,"credit_granted_for":null,"also_offered_as":null,"formerly":null,"additional_info":"Or permission of the department based on satisfactory performance on the department placement exam; and minimum grade of C- in MATH140; and permission of CMNS-Computer Science department."},"sections":["CMSC132A-0501","CMSC132A-0502","CMSC132A-0503","CMSC132A-0504"]},{"course_id":"CMSC132H","name":"Object-Oriented Programming II","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"4","grading_method":["Regular","Pass-Fail","Audit"],"core":[],"gen_ed":[],"description":"Introduction to use of computers to solve problems using software engineering principles. Design, build, test, and debug medium -size software systems and learn to use relevant tools. Use object-oriented methods to create effective and efficient problem solutions. Use and implement application programming interfaces (APIs). Programming done in Java.","relationships":{"prereqs":"Minimum grade of C- in CMSC131; or must have earned a score of 5 on the A Java AP exam.","coreqs":null,"restrictions":null,"credit_granted_for":null,"also_offered_as":null,"formerly":null,"additional_info":"Or permission of the department based on satisfactory performance on the department placement exam; and minimum grade of C- in MATH140; and permission of CMNS-Computer Science department."},"sections":["CMSC132H-0101"]},{"course_id":"CMSC216","name":"Introduction to Computer Systems","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"4","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"Machine representation of data including integers and floating point. Modern computer architectural features and their interaction with software (registers, caches). Interaction between user programs and the OS: system class, process, and thread management. Optimizing software to improve runtime performance using both compilers and hand turning.","relationships":{"prereqs":"Minimum grade of C- in CMSC132; and minimum grade of C- in MATH141.","coreqs":"CMSC250.","restrictions":null,"credit_granted_for":"CMSC212, (CMSC213 and CMSC313), or CMSC216.","also_offered_as":null,"formerly":null,"additional_info":null},"sections":["CMSC216-0101","CMSC216-0102","CMSC216-0103","CMSC216-0104","CMSC216-0201","CMSC216-0202","CMSC216-0203","CMSC216-0204","CMSC216-0301","CMSC216-0302","CMSC216-0303","CMSC216-0304","CMSC216-0305","CMSC216-0306","CMSC216-0307","CMSC216-0308"]},{"course_id":"CMSC216H","name":"Introduction to Computer Systems","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"4","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"Machine representation of data including integers and floating point. Modern computer architectural features and their interaction with software (registers, caches). Interaction between user programs and the OS: system class, process, and thread management. Optimizing software to improve runtime performance using both compilers and hand turning.","relationships":{"prereqs":"Minimum grade of C- in CMSC132; and minimum grade of C- in MATH141.","coreqs":"CMSC250.","restrictions":null,"credit_granted_for":"CMSC212, (CMSC213 and CMSC313), or CMSC216.","also_offered_as":null,"formerly":null,"additional_info":null},"sections":["CMSC216H-0101"]},{"course_id":"CMSC250","name":"Discrete Structures","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"4","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"Fundamental mathematical concepts related to computer science, includin finite and infinite sets, relations, functions, and propositional logic. Introduction to other techniques, modeling and solving problems in computer science.  Introduction to permutations, combinations, graphs, and trees with selected applications.","relationships":{"prereqs":"Minimum grade of C- in CMSC131; and minimum grade of C- in MATH141.","coreqs":null,"restrictions":"Permission of CMNS-Computer Science department.","credit_granted_for":null,"also_offered_as":null,"formerly":"CMSC150.","additional_info":null},"sections":["CMSC250-0101","CMSC250-0102","CMSC250-0103","CMSC250-0104","CMSC250-0105","CMSC250-0106","CMSC250-0107","CMSC250-0108","CMSC250-0301","CMSC250-0302","CMSC250-0303","CMSC250-0304","CMSC250-0401","CMSC250-0402","CMSC250-0403","CMSC250-0404"]},{"course_id":"CMSC250H","name":"Discrete Structures","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"4","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"Fundamental mathematical concepts related to computer science, includin finite and infinite sets, relations, functions, and propositional logic. Introduction to other techniques, modeling and solving problems in computer science.  Introduction to permutations, combinations, graphs, and trees with selected applications.","relationships":{"prereqs":"Minimum grade of C- in CMSC131; and minimum grade of C- in MATH141.","coreqs":null,"restrictions":"Permission of CMNS-Computer Science department.","credit_granted_for":null,"also_offered_as":null,"formerly":"CMSC150.","additional_info":null},"sections":["CMSC250H-0101"]},{"course_id":"CMSC289I","name":"Rise of the Machines: Artificial Intelligence Comes of Age","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"3","grading_method":["Regular"],"core":["MS"],"gen_ed":["DSSP","SCIS"],"description":null,"relationships":{"prereqs":null,"coreqs":null,"restrictions":null,"credit_granted_for":null,"also_offered_as":null,"formerly":null,"additional_info":null},"sections":["CMSC289I-0101"]},{"course_id":"CMSC298A","name":"Special Topics in Computer Science","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"1","grading_method":["Sat-Fail"],"core":[],"gen_ed":[],"description":null,"relationships":{"prereqs":null,"coreqs":null,"restrictions":null,"credit_granted_for":null,"also_offered_as":null,"formerly":null,"additional_info":null},"sections":[]},{"course_id":"CMSC320","name":"Introduction to Data Science","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"3","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"An introduction to the data science pipeline, i.e., the end-to-end process of going from unstructured, messy data to knowledge and actionable insights. Provides a broad overview of several topics including statistical data analysis, basic data mining and machine learning algorithms, large-scale data management, cloud computing, and information visualization.","relationships":{"prereqs":"Minimum grade of C- in CMSC216 and CMSC250.","coreqs":null,"restrictions":"Permission of CMNS-Computer Science department.","credit_granted_for":null,"also_offered_as":null,"formerly":null,"additional_info":null},"sections":["CMSC320-0101"]},{"course_id":"CMSC330","name":"Organization of Programming Languages","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"3","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"The semantics of programming languages and their run-time organization. Several different models of languages are discussed, including procedural (e.g., C, Pascal), functional (e.g., ML, LISP), rule-based (e.g., Prolog), and object-oriented (e.g., C++, Smalltalk). Run-time structures, including dynamic versus static scope rules, storage for strings, arrays, records, and object inheritance are explored.","relationships":{"prereqs":"Minimum grade of C- in CMSC250 and CMSC216; and permission of CMNS-Computer Science department.","coreqs":null,"restrictions":null,"credit_granted_for":null,"also_offered_as":null,"formerly":null,"additional_info":null},"sections":["CMSC330-0101","CMSC330-0102","CMSC330-0103","CMSC330-0201","CMSC330-0202","CMSC330-0203","CMSC330-0204","CMSC330-0301","CMSC330-0302","CMSC330-0303","CMSC330-0304","CMSC330-0305","CMSC330-0306","CMSC330-0307","CMSC330-0308"]},{"course_id":"CMSC351","name":"Algorithms","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"3","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"A systematic study of the complexity of some elementary algorithms related to sorting, graphs and trees, and combinatorics. Algorithms are analyzed using mathematical techniques to solve recurrences and summations.","relationships":{"prereqs":"Minimum grade of C- in CMSC250 and CMSC216; and permission of CMNS-Computer Science department.","coreqs":null,"restrictions":null,"credit_granted_for":"CMSC251 or CMSC351.","also_offered_as":null,"formerly":null,"additional_info":"CMSC351 may not count as one of the required upper level CMSC courses for students who are required to have 24 upper level CMSC credits for graduation, i.     e. for students who became computer science majors prior to Fall, 2002."},"sections":["CMSC351-0101","CMSC351-0201","CMSC351-0301","CMSC351-0401"]},{"course_id":"CMSC389N","name":"Special Topics in Computer Science; Introduction to PHP & Javascript","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"3","grading_method":["Regular"],"core":[],"gen_ed":[],"description":null,"relationships":{"prereqs":"Minimum grade of C- in CMSC250 and CMSC216; and permission of CMNS-Computer Science department.","coreqs":null,"restrictions":null,"credit_granted_for":null,"also_offered_as":null,"formerly":null,"additional_info":null},"sections":["CMSC389N-0101"]},{"course_id":"CMSC390","name":"Honors Paper","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"3","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"Special study or research directed toward preparation of honors paper.","relationships":{"prereqs":null,"coreqs":null,"restrictions":"Must be admitted to the Computer Science Honors Program.","credit_granted_for":null,"also_offered_as":null,"formerly":null,"additional_info":null},"sections":[]},{"course_id":"CMSC396H","name":"Computer Science Honors Seminar","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"1","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"Overview of computer science research activities, techniques, and tools. Diverse research areas will be covered, including systems, networks, artificial intelligence, human-computer interaction, software engineering, graphics, vision, and theory.","relationships":{"prereqs":"Must have admission into Computer Science Departmental Honors Program.","coreqs":null,"restrictions":"Permission of CMNS-Computer Science department.","credit_granted_for":"CMSC297 or CMSC396.","also_offered_as":null,"formerly":"CMSC297.","additional_info":null},"sections":["CMSC396H-0101"]},{"course_id":"CMSC411","name":"Computer Systems Architecture","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"3","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"Input/output processors and techniques. Intra-system communication, buses, caches. Addressing and memory hierarchies. Microprogramming, parallelism, and pipelining.","relationships":{"prereqs":"Minimum grade of C- in CMSC330; or must be in the (Computer Science (Doctoral), Computer Science (Master's)) program.","coreqs":null,"restrictions":"Permission of CMNS-Computer Science department.","credit_granted_for":"ENEE446 or CMSC411.","also_offered_as":null,"formerly":null,"additional_info":null},"sections":["CMSC411-0101"]},{"course_id":"CMSC412","name":"Operating Systems","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"4","grading_method":["Regular"],"core":["S"],"gen_ed":[],"description":"A hands-on introduction to operating systems, including topics in: multiprogramming, communication and synchronization, memory management, IO subsystems, and resource scheduling polices. The laboratory component consists of constructing a small kernel, including functions for device IO, multi-tasking, and memory management.","relationships":{"prereqs":"1 course with a minimum grade of C- from (CMSC414, CMSC417, CMSC420, CMSC430, CMSC433, CMSC435, ENEE440).","coreqs":null,"restrictions":"Permission of CMNS-Computer Science department; or must be in one of the following programs (Computer Science (Master's); Computer Science (Doctoral)).","credit_granted_for":"CMSC412 or ENEE447.","also_offered_as":null,"formerly":null,"additional_info":null},"sections":["CMSC412-0101","CMSC412-0102"]},{"course_id":"CMSC414","name":"Computer and Network Security","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"3","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"An introduction to the topic of security in the context of computer systems and networks. Identify, analyze, and solve network-related security problems in computer systems. Fundamentals of number theory, authentication, and encryption technologies, as well as the practical problems that have to be solved in order to make those technologies workable in a networked environment, particularly in the wide-area Internet environment.","relationships":{"prereqs":"Minimum grade of C- in CMSC330 and CMSC351; or must be in the (Computer Science (Doctoral), Computer Science (Master's)) program.","coreqs":null,"restrictions":"Permission of CMNS-Computer Science department.","credit_granted_for":"CMSC414, ENEE459C, or ENEE457.","also_offered_as":null,"formerly":null,"additional_info":null},"sections":["CMSC414-0101","CMSC414-0201"]},{"course_id":"CMSC417","name":"Computer Networks","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"3","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"Computer networks and architectures. The OSI model including discussion and examples of various network layers. A general introduction to existing network protocols. Communication protocol specification, analysis, and testing.","relationships":{"prereqs":"Minimum grade of C- in CMSC351 and CMSC330; and permission of CMNS-Computer Science department.","coreqs":null,"restrictions":null,"credit_granted_for":null,"also_offered_as":null,"formerly":null,"additional_info":"Or must be in the (Computer Science (Doctoral), Computer Science (Master's)) program."},"sections":["CMSC417-0201"]},{"course_id":"CMSC420","name":"Data Structures","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"3","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"Description, properties, and storage allocation of data structures including lists and trees. Algorithms for manipulating structures. Applications from areas such as data processing, information retrieval, symbol manipulation, and operating systems.","relationships":{"prereqs":"Minimum grade of C- in CMSC351 and CMSC330; and permission of CMNS-Computer Science department.","coreqs":null,"restrictions":null,"credit_granted_for":null,"also_offered_as":null,"formerly":null,"additional_info":"Or must be in the (Computer Science (Doctoral), Computer Science (Master's)) program."},"sections":["CMSC420-0101","CMSC420-0201","CMSC420-0301"]},{"course_id":"CMSC421","name":"Introduction to Artificial Intelligence","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"3","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"Areas and issues in artificial intelligence, including search, inference, knowledge representation, learning, vision, natural languages, expert systems, robotics. Implementation and application of programming languages (e.g. LISP, PROLOG, SMALLTALK), programming techniques (e.g. pattern matching, discrimination networks) and control structures (e.g. agendas, data dependencies).","relationships":{"prereqs":"Minimum grade of C- in CMSC351 and CMSC330; and permission of CMNS-Computer Science department.","coreqs":null,"restrictions":null,"credit_granted_for":null,"also_offered_as":null,"formerly":null,"additional_info":"Or must be in the (Computer Science (Doctoral), Computer Science (Master's)) program."},"sections":["CMSC421-0101"]},{"course_id":"CMSC422","name":"Introduction to Machine Learning","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"3","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"Machine Learning studies representations and algorithms that allow machines to improve their performance on a task from experience. This is a broad overview of existing methods for machine learning and an introduction to adaptive systems in general. Emphasis is given to practical aspects of machine learning and data mining.","relationships":{"prereqs":"Minimum grade of C- in CMSC320, CMSC330, and CMSC351; and 1 course with a minimum grade of C- from (MATH240, MATH461); and permission of CMNS-Computer Science department.","coreqs":null,"restrictions":null,"credit_granted_for":null,"also_offered_as":null,"formerly":null,"additional_info":null},"sections":["CMSC422-0101","CMSC422-0201"]},{"course_id":"CMSC423","name":"Bioinformatic Algorithms, Databases, and Tools","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"3","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"An introduction to the main algorithms, databases, and tools used in bioinformatics. Topics may include assembly and analysis of genome sequences, reconstructing evolutionary histories, predicting protein structure, and clustering of biological data. Use of scripting languages to perform analysis tasks on biological data. No prior knowledge of biology is assumed.","relationships":{"prereqs":"Minimum grade of C- in CMSC351 and CMSC330; and permission of CMNS-Computer Science department.","coreqs":null,"restrictions":null,"credit_granted_for":null,"also_offered_as":null,"formerly":null,"additional_info":"Or must be in the (Computer Science (Doctoral), Computer Science (Master's)) program."},"sections":["CMSC423-0101"]},{"course_id":"CMSC424","name":"Database Design","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"3","grading_method":["Regular"],"core":["S"],"gen_ed":[],"description":"Students are introduced to database systems and motivates the database approach as a mechanism for modeling the real world. An in-depth coverage of the relational model, logical database design, query languages, and other database concepts including query optimization, concurrency control; transaction management, and log based crash recovery. Distributed and Web database architectures are also discussed.","relationships":{"prereqs":"Minimum grade of C- in CMSC351 and CMSC330; and permission of CMNS-Computer Science department.","coreqs":null,"restrictions":null,"credit_granted_for":null,"also_offered_as":null,"formerly":null,"additional_info":"Or must be in the (Computer Science (Doctoral), Computer Science (Master's)) program."},"sections":["CMSC424-0101","CMSC424-0201"]},{"course_id":"CMSC425","name":"Game Programming","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"3","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"An introduction to the principles and practice of computer game programming and design. This includes an introduction to game hardware and systems, the principles of game design, object and terrain modeling, game physics, artificial intelligence for games, networking for games, rendering and animation, and aural rendering. Course topics are reinforced through the design and implementation of a working computer game.","relationships":{"prereqs":"Minimum grade of C- in CMSC420.","coreqs":null,"restrictions":null,"credit_granted_for":null,"also_offered_as":null,"formerly":null,"additional_info":null},"sections":["CMSC425-0101"]},{"course_id":"CMSC426","name":"Computer Vision","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"3","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"An introduction to basic concepts and techniques in computervision. This includes low-level operations such as image filtering and edge detection, 3D reconstruction of scenes using stereo and structure from motion, and object detection, recognition and classification.","relationships":{"prereqs":"Minimum grade of C- in CMSC330 and CMSC351; or must be in the (Computer Science (Doctoral), Computer Science (Master's)) program.","coreqs":null,"restrictions":"Permission of CMNS-Computer Science department.","credit_granted_for":null,"also_offered_as":null,"formerly":null,"additional_info":null},"sections":["CMSC426-0101"]},{"course_id":"CMSC427","name":"Computer Graphics","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"3","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"An introduction to the principles of computer graphics. Includes an introduction to graphics displays and systems. Introduction to the mathematics of affine and projective transformations, perspective, curve and surface modeling, algorithms for hidden-surface removal, color models, methods for modeling illumination, shading, and reflection.","relationships":{"prereqs":"MATH240; and minimum grade of C- in CMSC420; and permission of CMNS-Computer Science department.","coreqs":null,"restrictions":null,"credit_granted_for":null,"also_offered_as":null,"formerly":null,"additional_info":"Or must be in the (Computer Science (Doctoral), Computer Science (Master's)) program."},"sections":["CMSC427-0101"]},{"course_id":"CMSC433","name":"Programming Language Technologies and Paradigms","dept_id":"CMSC","department":"Computer Science","semester":"201801","credits":"3","grading_method":["Regular"],"core":[],"gen_ed":[],"description":"Programming language technologies (e.g., object-oriented programming), their implementations and use in software design and implementation.","relationships":{"prereqs":"Minimum grade of C- in CMSC330; or must be in the (Computer Science (Doctoral), Computer Science (Master's)) program.","coreqs":null,"restrictions":"Permission of CMNS-Computer Science department.","credit_granted_for":null,"also_offered_as":null,"formerly":null,"additional_info":null},"sections":["CMSC433-0101"]}];
//var _DATA = dataUtil.loadData().objects;

mongoose.connect(process.env.MONGODB, {
	useMongoClient: true
});

app.listen(3000, function() {
    console.log('House of Representatives listening on port 3000!');
});

app.get("/", function(req,res) {

	var courseArr = {};

	
	Course.find({}, function(err, courseGrades) {
        if (err) throw err;

        for(var i = 0; i < courseGrades.length; i++ ){
        	courseArr[courseGrades[i].classID] = courseGrades[i]._id;
        }

        res.render('home', {
			courses:courseArr
		});
    });
})

app.post('/course', function(req, res) {
	var courseGrades = new Course({
		classID: req.body.classID,
		storeGrades: [],
		cumulativeGradeAverage: parseInt(req.body.cumulativeGradeAverage),
		cumulativeGradeAverageByProfessor: parseInt(req.body.cumulativeGradeAverageByProfessor),
		reviews: []
	});

	courseGrades.save(function(err){
		if (err) throw err;
		return res.send('Succesfully inserted movie.');
	});
});

app.get('/api/course', function(req, res) {

	var json = {};

    Course.find({}, function(err, courseGrades) {
        if (err) throw err;

        for(var i = 0; i < courseGrades.length; i++){
        	var jsonString = JSON.stringify(courseGrades[i]);
        	json[i] = jsonString;
        }

        json = JSON.stringify(json);
        

        console.log(jsonString);

        res.send(json);
    });
})

app.post("/api/:id/addGrades", function(req,res) {

	var average;
	var sum = 0;
	Course.findOne({_id: req.params.id}, function(err, course) {
		if (err) throw err;
		if(!course) return res.send("No course found with that ID.");

		course.storeGrades.push({
			numberGrade: parseFloat(req.body.numberGrade),
			professor: req.body.professor
		});

		for(i = 0; i < course.storeGrades.length; i++){
			sum = sum + course.storeGrades[i].numberGrade;
		}

		average = sum/course.storeGrades.length;

		course.cumulativeGradeAverage = average;

		course.save(function(err) {
			if (err) throw err;
			return res.send("Added grade");
		});
	});

});

app.get("/:id/addGrades", function(req,res) {
	res.render('add',{
		id: req.params.id
	});
});

app.post("/api/:id/addReview", function(req,res){
	Course.findOne({_id: req.params.id}, function(err, course){
		if (err) throw err;
		if(!course) return res.send("No course found with that ID.");

		course.reviews.push({
			review: req.body.review
		});

		course.save(function(err) {
			if (err) throw err;
			res.send("Added review");
		});
	});	
});

app.get("/:id/review", function(req,res){
	res.render('addReview',{
		id:req.params.id
	});
});

app.get("/viewDetails/:id", function(req,res){

	var average;
	var review1;
	Course.findOne({_id: req.params.id}, function(err, course){
		if (err) throw err;
		if(!course) return res.send("No course found with that ID.");

		average = course.cumulativeGradeAverage;

		course.reviews.push({
			review: ""
		}); 

		review1 = course.reviews[0].review;
		

		res.render('details',{
			average: average,
			id: req.params.id,
			review: review1
		});
	});	
});

app.get("/alphabet", function(req,res){

	var courseArr = [];
	var courseMap2 = {};
	
	Course.find({}, function(err, courseGrades) {
		for(var i = 0; i < courseGrades.length; i++ ){
			var courseMap = {};
        	courseMap["classID"] = courseGrades[i].classID
        	courseMap["_id"] = courseGrades[i]._id;
        	courseArr[i] = courseMap;
        }		

        courseArr.sort(function(a,b) {
        	var textA = a.classID;
    		var textB = b.classID;
    		return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });

        for(var i = 0; i < courseArr.length; i++){
        	courseMap2[courseArr[i].classID] = courseArr[i]._id;
        }

        console.log(courseArr);

		res.render('alphabet', {
			courseGrades: courseMap2
		});
	});


});

app.get("/easy", function(req,res) {
	var courseArr = [];
	var courseMap2 = {};
	
	Course.find({}, function(err, courseGrades) {
		for(var i = 0; i < courseGrades.length; i++ ){
			var courseMap = {};
        	courseMap["grade"] = courseGrades[i].cumulativeGradeAverage;
        	courseMap["classID"] = courseGrades[i].classID;
        	courseMap["_id"] = courseGrades[i]._id;
        	courseArr[i] = courseMap;
        }		

        courseArr.sort(function(a,b) {
        	var textA = a.grade;
    		var textB = b.grade;
    		return (textA < textB) ? (textA > textB) ? 0 : 1 : -1 ;
        });

        for(var i = 0; i < courseArr.length; i++){
        	courseMap2[courseArr[i].classID] = courseArr[i]._id;
        }

        console.log(courseArr);

		res.render('alphabet', {
			courseGrades: courseMap2
		});
	});
});

app.get("/professors", function(req,res) {
	var courseArr = [];

	
	Course.find({}, function(err, courseGrades) {

		for(var i = 0; i < courseGrades.length; i++ ){
			for(var j = 0; j< courseGrades[i].storeGrades.length;j++){
				courseArr.push(courseGrades[i].storeGrades[j].professor);
			}
        }		

        
    	function removeDuplicates(arr){
    		let unique_array = []
    		for(let i = 0;i < arr.length; i++){
        		if(unique_array.indexOf(arr[i]) == -1){
            		unique_array.push(arr[i])
        		}
    		}
    		return unique_array;
    	}
    

        
        courseArr = removeDuplicates(courseArr);

        console.log(courseArr);


		res.render('professor', {
			courseGrades: courseArr
		});
	});
});

app.get("/random", function(req,res) {

	

	Course.find({}, function(err, courseGrades) {
		var x = courseGrades.length
		var randomNumber = Math.floor(Math.random() * x);

		var id = courseGrades[randomNumber]._id;
		var classID = courseGrades[randomNumber].classID;

		res.render('random', {
			id: id,
			classID: classID
		});

	});
});	