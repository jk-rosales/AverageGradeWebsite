
# GPA Average For Classes

---

Name: Jonathan Wang

Date: 12/8/2017

Project Topic: Average GPA for class by professor

URL: https://p5-reddit-clone-hsgxavncgp.now.sh

---


### 1. Data Format and Storage

Data point fields:
- `Field 1`: Class ID       `Type: String`
- `Field 2`: Store Grades       `Type: [averageGradeSchema]`
- `Field 3`: Average Grade     `Type: Number`
- `Field 4`: Average Grade by Professor      `Type: Number`
- `Field 5`: Review       `Type: [reviewSchema]`

Schema: 
```javascript
Course Schema
{
   classID: {
      type: String,
      required: true
   },

   storeGrades: [averageGradeSchema],

   cumulativeGradeAverage: {
    type: String,
    required: true
   },

   cumulativeGradeAverageByProfessor: {
    type: Int,
    required: true
   },

   reviews:[reviewSchema]
}

averageGradeSchema
{
    numberGrade:{
      type: Number,
      required: true
    },

    professor:{
      type:String,
      required: true
    }
}

reviewSchema
{
    review: {
      type: String,
      required: true
    }
}
```

### 2. Add New Data

HTML form route: `/:id/addGrades`

POST endpoint route: `/api/:id/addGrades`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/:id/addGrades',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
       numberGrade: '3.3',
       professor: 'Anwar Mamat'
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint route: `/api/course`

### 4. Search Data

Search Field: classID

### 5. Navigation Pages

Navigation Filters
1. Home -> ` /`
2. Alphabetical Courses -> `/alphabet`
3. Easiest to Hardest -> `/easy `
4. CS Professors -> ` /professors`
5. Random -> ` /random  `

