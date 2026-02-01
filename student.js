// Check authentication
if (sessionStorage.getItem('userType') !== 'student') {
    window.location.href = 'login.html';
}

const studentId = parseInt(sessionStorage.getItem('studentId'));
let currentCourseId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadStudentCourses();
});

function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}

function loadStudentCourses() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        alert('Student not found!');
        logout();
        return;
    }
    
    document.getElementById('welcomeMessage').textContent = `Welcome, ${student.username}!`;
    
    const allCourses = JSON.parse(localStorage.getItem('courses')) || [];
    const studentCourses = allCourses.filter(course => student.courses.includes(course.id));
    
    const coursesList = document.getElementById('coursesList');
    
    if (studentCourses.length === 0) {
        coursesList.innerHTML = '<p style="text-align: center; padding: 60px; color: #999;">You are not enrolled in any courses yet. Contact admin to get enrolled.</p>';
        return;
    }
    
    coursesList.innerHTML = studentCourses.map(course => `
        <div class="portal-course-card" onclick="viewCourse(${course.id})">
            <div class="portal-course-header">
                <h3>${course.name}</h3>
                <p>${course.description}</p>
            </div>
            <div class="portal-course-body">
                <p><strong>Classes:</strong> ${course.classes?.length || 0}</p>
                <p><strong>Exams:</strong> ${course.exams?.length || 0}</p>
                <div class="course-options">
                    <button class="option-btn" onclick="event.stopPropagation(); viewCourseContent(${course.id}, 'classes')">
                        📚 Classes
                    </button>
                    <button class="option-btn" onclick="event.stopPropagation(); viewCourseContent(${course.id}, 'exams')">
                        📝 Exams
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function viewCourse(courseId) {
    viewCourseContent(courseId, 'classes');
}

function viewCourseContent(courseId, type) {
    currentCourseId = courseId;
    
    const allCourses = JSON.parse(localStorage.getItem('courses')) || [];
    const course = allCourses.find(c => c.id === courseId);
    
    if (!course) return;
    
    document.getElementById('coursesView').style.display = 'none';
    document.getElementById('contentView').style.display = 'block';
    document.getElementById('courseTitle').textContent = course.name;
    
    displayContent(course, type);
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.content-tab-panel').forEach(panel => panel.classList.remove('active'));
    
    if (type === 'classes') {
        document.querySelector('.tab-btn:first-child').classList.add('active');
        document.getElementById('classesContent').classList.add('active');
    } else {
        document.querySelector('.tab-btn:last-child').classList.add('active');
        document.getElementById('examsContent').classList.add('active');
    }
}

function displayContent(course, type) {
    const contentKey = type === 'classes' ? 'classes' : 'exams';
    const content = course[contentKey] || [];
    const containerId = type === 'classes' ? 'classesContent' : 'examsContent';
    const container = document.getElementById(containerId);
    
    if (content.length === 0) {
        container.innerHTML = `<p style="text-align: center; padding: 40px; color: #999;">No ${type} available yet</p>`;
        return;
    }
    
    container.innerHTML = content.map(item => `
        <div class="content-view">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            ${item.link ? `<a href="${item.link}" target="_blank">Access Content →</a>` : ''}
        </div>
    `).join('');
}

function showMyCourses() {
    document.getElementById('contentView').style.display = 'none';
    document.getElementById('coursesView').style.display = 'block';
}

function showContentType(type) {
    const allCourses = JSON.parse(localStorage.getItem('courses')) || [];
    const course = allCourses.find(c => c.id === currentCourseId);
    
    if (!course) return;
    
    displayContent(course, type);
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.content-tab-panel').forEach(panel => panel.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(type + 'Content').classList.add('active');
}
