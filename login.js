let currentUserType = 'admin';

// Initialize localStorage with default data
function initializeData() {
    if (!localStorage.getItem('adminCredentials')) {
        localStorage.setItem('adminCredentials', JSON.stringify({
            username: 'moshgul_hasan13',
            password: 'fI13rST_sT@RT_up'
        }));
    }

    if (!localStorage.getItem('students')) {
        localStorage.setItem('students', JSON.stringify([]));
    }

    if (!localStorage.getItem('courses')) {
        localStorage.setItem('courses', JSON.stringify([
            {
                id: 1,
                name: 'Class 8 Foundation',
                description: 'Math & Science',
                classes: [],
                exams: []
            },
            {
                id: 2,
                name: 'Class 9 Foundation',
                description: 'Math, Physics, Chemistry',
                classes: [],
                exams: []
            },
            {
                id: 3,
                name: 'Class 10 Foundation',
                description: 'Math, Physics, Chemistry',
                classes: [],
                exams: []
            },
            {
                id: 4,
                name: 'SSC Final Preparation',
                description: 'Complete Exam Readiness',
                classes: [],
                exams: []
            },
            {
                id: 5,
                name: 'HSC 1st Year Foundation',
                description: 'Math, Physics, Chemistry',
                classes: [],
                exams: []
            },
            {
                id: 6,
                name: 'HSC 2nd Year Foundation',
                description: 'Math, Physics, Chemistry',
                classes: [],
                exams: []
            },
            {
                id: 7,
                name: 'HSC ICT Foundation',
                description: 'Complete ICT Course',
                classes: [],
                exams: []
            },
            {
                id: 8,
                name: 'HSC Final Revision',
                description: 'Last Minute Excellence',
                classes: [],
                exams: []
            },
            {
                id: 9,
                name: 'Engineering Admission',
                description: 'BUET, KUET, RUET Prep',
                classes: [],
                exams: []
            },
            {
                id: 10,
                name: 'Varsity Admission',
                description: 'University Entrance Prep',
                classes: [],
                exams: []
            }
        ]));
    }

    if (!localStorage.getItem('enrollDescription')) {
        localStorage.setItem('enrollDescription', 
            'Welcome to Mishon Academy! Contact us to enroll in our courses and start your journey to academic excellence.');
    }
}

initializeData();

function selectUserType(type) {
    currentUserType = type;
    
    // Update button states
    document.querySelectorAll('.user-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.user-type-btn').classList.add('active');

    // Show/hide credentials based on user type
    const credentialsSection = document.getElementById('credentialsSection');
    if (type === 'guest') {
        credentialsSection.style.display = 'none';
    } else {
        credentialsSection.style.display = 'block';
    }
}

function handleLogin(event) {
    event.preventDefault();

    if (currentUserType === 'guest') {
        // Guest access - no credentials needed
        sessionStorage.setItem('userType', 'guest');
        window.location.href = 'guest-portal.html';
        return;
    }

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (currentUserType === 'admin') {
        const adminCreds = JSON.parse(localStorage.getItem('adminCredentials'));
        if (username === adminCreds.username && password === adminCreds.password) {
            sessionStorage.setItem('userType', 'admin');
            window.location.href = 'admin-portal.html';
        } else {
            alert('Invalid admin credentials!');
        }
    } else if (currentUserType === 'student') {
        const students = JSON.parse(localStorage.getItem('students'));
        const student = students.find(s => s.username === username && s.password === password);
        
        if (student) {
            sessionStorage.setItem('userType', 'student');
            sessionStorage.setItem('studentId', student.id);
            window.location.href = 'student-portal.html';
        } else {
            alert('Invalid student credentials!');
        }
    }
}

// Set initial user type
document.addEventListener('DOMContentLoaded', () => {
    selectUserType('admin');
});
