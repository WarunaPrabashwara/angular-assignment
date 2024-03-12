// Import necessary modules
const express = require('express');
const router = express.Router();
const { prisma } = require("../src/database.js");
const sharp = require('sharp')
const path = require('path');
const { hash } = require('bcrypt')

const AWS = require('aws-sdk');
// Configure AWS credentials and region
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});
// Create S3 instance
const s3 = new AWS.S3();


// Define routes for user-related actions

// Parse multipart form data (e.g., FormData)
const multer = require('multer');
const upload = multer({
    limits: {
        fileSize: 10000000 // 10 mb
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|PNG)$/)) {
            return cb(new Error('Please upload a valid image file'))
        }
        cb(undefined, true)
    }
})

router.post('/search_courses', upload.none(), async (req, res) => {
    const course_name = req.body.name;
    const corse_category = req.body.category;
    const instructor = req.body.instructor;
    var instructor_ids = await prisma.users.findMany({ where: { name: { contains: instructor }, ulevel: 2 } }).then(instructors => {
        var instructor_ids = []
        instructors.forEach(instructor => {
            instructor_ids.push(instructor.id)
        })
        return instructor_ids
    }).catch(e => {
        console.log(e);
        return "error"
    })


    var courses = await prisma.courses.findMany({
        where: {
            AND: [
                {
                    OR: [
                        { title: { contains: course_name } },
                        { category: { contains: corse_category } },
                        { instructor_id: { in: instructor_ids } }
                    ]
                },
                {
                    is_active: true
                }
            ]
        }
    }).then(async courses => {
        var course_with_inst = await Promise.all(courses.map(async (course, index, arr) => {
            var instructor = await prisma.users.findFirst({
                where: { id: course.instructor_id },
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }).then(data => {
                return data
            }).catch((e) => {
                console.log(e);
                return {}
            })
            course['instructor'] = instructor
            return course
        }))
        res.status(200).json({
            status: true,
            data: course_with_inst,
        });
    }).catch((e) => {
        console.log(e)
        res.status(422).json({
            status: false,
            data: "Error in search ",
        });
    })

    return courses



});

router.get('/get_all_students', upload.none(), async (req, res) => {
    var student = await prisma.users.findMany({ where: { ulevel: 3 }, select: { id: true, createdAt: true, name: true, email: true } }).then(async (students) => {
        res.status(200).json({
            status: true,
            data: students,
        });

    }).catch((e) => {
        console.log(e)
        res.status(422).json({
            status: false,
            data: "Failed",
        });
    })
});

router.get('/get_all_instructors', upload.none(), async (req, res) => {
    var student = await prisma.users.findMany({ where: { ulevel: 2 }, select: { id: true, createdAt: true, name: true, email: true } }).then(async (students) => {
        res.status(200).json({
            status: true,
            data: students,
        });

    }).catch((e) => {
        console.log(e)
        res.status(422).json({
            status: false,
            data: "Failed",
        });
    })
});



router.get('/get_student_by_id', upload.none(), async (req, res) => {
    var student = await prisma.users.findFirst({ where: { id: Number(req.query.id), ulevel: 3 }, select: { id: true, createdAt: true, name: true, email: true } }).then(async (student) => {
        var courses_of_students = await prisma.course_studnts.findMany({ where: { id_of_stud: student.id } }).then(async (course_studnts, index, arr) => {

            var course_with_course_students = await Promise.all(course_studnts.map(async (course_student, index, arr) => {

                return prisma.courses.findFirst({
                    where: { id: course_student.id_of_course },
                }).then(data => {
                    course_student['course'] = data
                    return course_student
                }).catch((e) => {
                    console.log(e);
                    return {}
                })
            }))
            course_studnts['courses'] = course_with_course_students
            return course_studnts

        }).catch(e => {
            console.log(e)
            res.status(422).json({
                status: false,
                data: "Failed",
            });
        })

        student['courses'] = courses_of_students
        res.status(200).json({
            status: true,
            data: student,
        });
    }).catch((e) => {
        console.log(e)
        res.status(422).json({
            status: false,
            data: "Failed",
        });
    })
});

router.post('/assign_student_to_course', upload.none(), async (req, res) => {
    const student_id = req.body.student_id;
    const course_id = req.body.course_id;

    var res = await prisma.course_studnts.create({
        data: {
            id_of_stud: Number(student_id),
            id_of_course: Number(course_id),
            status: 2,
            progress: 0
        }
    }).then(data => {
        res.status(200).json({
            status: true,
            data: "Succesfully added",
        });
    }).catch(e => {
        console.log(e)
        res.status(422).json({
            status: false,
            data: "Failed",
        });
    })

    return res

});

router.put('/unenrolling_user_from_course', upload.none(), async (req, res) => {
    const id = req.body.id;
    const student_id = req.body.student_id;
    const course_id = req.body.course_id;

    var res = await prisma.course_studnts.update({
        where: {
            id: Number(id),
        },
        data: {
            status: 1
        }
    }).then(data => {
        res.status(200).json({
            status: true,
            data: "success",
        });
    }).catch(e => {
        console.log(e)
        res.status(422).json({
            status: false,
            data: "failed",
        });
    })
    return res

});

router.post('/add_user', upload.none(), async (req, res) => {
    const hashedpassword = await hash(req.body.pswd, 10)
    await prisma.users.create({
        data: {
            ulevel: Number(req.body.ulevel),
            name: req.body.name,
            email: req.body.email,
            pswd: hashedpassword,
        }
    }).then((data) => {
        res.status(200).json({
            status: true,
            data: "Added",
        });
    }).catch((e) => {
        console.log(e)
        res.status(422).json({
            status: false,
            data: "Error occured",
        });
    })

})

router.post('/courses', upload.single('file'), async (req, res) => {
    var currenttime = new Date() - 1
    var link_for_img = currenttime.toString() + '.jpg'
    await prisma.courses.create({
        data: {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            instructor_id: Number(req.body.instructor_id),
            rating: 0.0,
            is_active: true,
            link_for_img: link_for_img,
            price: Number(req.body.price)
        }
    }).then(async data => {

        // Image Upload
        try {

            /* below is the way to store in the local storage
            const imagePath = path.join(__dirname, '..', 'uploads', 'images', link_for_img);
            await sharp(req.file.buffer).resize({ width: 350 }).png().toFile(imagePath)
            res.status(200).json({
                status: true,
                data: "Added",
            });
            */
            // Read the file from the temporary directory, resize and compress it
            const image = await sharp(req.file.buffer)
                .resize({ width: 350 }) // width=300 & height=150
                .toFormat('jpg') // convert to JPEG
                .jpeg({ quality: 100 }) // compress it with a quality level of 80 out of 100
                .toBuffer();

            const params = {
                Bucket: 'assignmentbywaruna',
                Key: `${link_for_img}`,
                Body: image,
                ContentType: 'image/jpeg',
                ACL: 'public-read'
            };

            s3.upload(params, (err, data) => {
                if (err) {
                    console.error('Error uploading image to S3:', err);
                    res.status(422).json({
                        status: false,
                        data: "Error occured",
                    });

                } else {
                    //  console.log('Image uploaded to S3:', data.Location);
                    res.status(200).json({
                        status: true,
                        data: "Succesfully added",
                    });
            
                }
            });

        }
        catch (error) {
            console.log(error)
            res.status(422).json({
                status: false,
                data: "Error occured",
            });
        }


    }).catch((e) => {
        console.log(e)
        res.status(422).json({
            status: false,
            data: e,
        });
    })



});

router.get('/courses', upload.none(), async (req, res) => {
    var courses = await prisma.courses.findMany({}).then(async data => {
        var course_with_inst = await Promise.all(data.map(async (course, index, arr) => {
            var instructor = await prisma.users.findFirst({
                where: { id: course.instructor_id },
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }).then(data => {
                return data
            }).catch((e) => {
                console.log(e);
                return {}
            })
            course['instructor'] = instructor
            return course
        }))
        res.status(200).json({
            status: true,
            data: course_with_inst,
        });
    }).catch((e) => {
        console.log(e);
        res.status(422).json({
            status: false,
            data: "Error occured",
        });
    })
    return courses
});

// Export the router to make it accessible in other files
module.exports = router;
