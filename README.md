
# 📚 CollegeHub – Online Assignment Submission Portal

A modern AI-powered assignment management platform that streamlines the workflow between students and educators.
CollegeHub enables students to submit assignments online while allowing teachers to evaluate, detect plagiarism, and provide feedback, all in one centralized system.


# 🚀 Features

👨‍🎓 Student Features

* Submit assignments online

* Track submission status (Submitted / Late / Graded)

* View grades and teacher feedback

* Join subjects using subject codes

* Download assignment resources

* Real-time chat with teachers

* Notifications for deadlines and announcements

👩‍🏫 Teacher Features

* Create and manage assignments

* Set deadlines and grading ranges

* View and evaluate student submissions

* Detect plagiarism automatically

* Provide grades and feedback

* Communicate with students via chat

* Post notices and announcements

🛠 Admin Features

* Manage users (students & teachers)

* Monitor system activity

* View and resolve feedback reports

* Maintain platform integrity


# 🤖 AI-Powered Evaluation System

The platform integrates an AI backend service that performs advanced assignment analysis.

**Key AI Capabilities**

* Plagiarism Detection

* Cosine Similarity

* Jaccard Similarity

**Rubric-based Evaluation**

* Originality

* Structure

* Grammar

* Completeness

**AI Text Detection**

* Perplexity analysis

* Burstiness metrics

This helps identify AI-generated content and ensures academic integrity.

# 🏗 System Architecture

The system follows a full-stack MERN architecture with an additional AI evaluation microservice.
```
Frontend (React + Tailwind)
        ↓
Backend API (Node.js + Express)
        ↓
Database (MongoDB)
        ↓
File Storage (Cloudinary)
        ↓
AI Evaluation Service (Flask + Python NLP)
```
# Tech Stack

**Frontend**

* React.js

* Tailwind CSS

**Backend**

* Node.js

* Express.js

**Database**

* MongoDB

**AI / NLP Service**

* Python

* Flask

* NLTK

* Scikit-learn

* NumPy

**File Processing**

* PyMuPDF

* python-docx

* python-pptx

**Other Tools**

* Cloudinary (file storage)

* Git (version control)


# 🗂 Database Schema

**User**
```
firstName
lastName
email
password (hashed)
role (student / teacher)
subjects[]
profileImage
rollNo / employeeId
```
**Subject**
```
subjectName
subjectCode
teacherId
studentsId[]
assignmentsId[]
```

**Assignment**
```
title
description
deadline
minMarks
maxMarks
createdBy
subjectId
```

**Submission**
```
assignmentId
studentId
fileURL
submissionDate
grade
feedback
status
```

**Message**
```
senderId
receiverId
text
image
isRead
```

**Notification**
```
senderId
receiverId
content
status
```


# 📊 Plagiarism Detection

Two NLP similarity algorithms are used:

**Cosine Similarity**

Measures similarity between two documents using vector space representation.
```
similarity = (A · B) / (||A|| ||B||)
```
**Jaccard Similarity**

Measures lexical overlap between two documents.
```
J(A,B) = |A ∩ B| / |A ∪ B|
```
Combining both improves plagiarism detection accuracy.
# Installation

1️⃣ Clone the Repository

```bash
  git clone https://github.com/yourusername/collegehub.git
  cd collegehub
```

2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

3️⃣ Install Frontend Dependencies

```bash
cd frontend
npm install
```

4️⃣ Run the Application

Start backend
```bash
npm run dev
```
Start frontend
```bash
npm start
```



    
# 🎯 Project Objectives

* Digitize assignment submission workflow

* Improve communication between students and teachers

* Ensure academic integrity through plagiarism detection

* Provide automated evaluation assistance

* Create a scalable platform for educational institutions


# 🔮 Future Improvements

* AI-based automated grading

* Integration with LMS platforms

* Advanced plagiarism detection using deep learning

* Mobile application support

* Real-time collaborative editing
# 📜 License

This project is intended for educational and research purposes.

