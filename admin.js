// Check authentication
if (sessionStorage.getItem('userType') !== 'admin') {
    window.location.href = 'login.html';
}

let currentContentCourse = null;
let currentContentType = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
    loadStudentsTable();
    loadCoursesList();
    loadEnrollDescription();
    populateCoursesDropdown();
});

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    event.target.classList.add('active');
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}

// Dashboard
function loadDashboardStats() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    
    let totalContent = 0;
    courses.forEach(course => {
        totalContent += (course.classes?.length || 0) + (course.exams?.length || 0);
    });
    
    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('totalCourses').textContent = courses.length;
    document.getElementById('totalContent').textContent = totalContent;
}

// Students Management
function loadStudentsTable() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const tbody = document.getElementById('studentsTable');
    
    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">No students added yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = students.map(student => `
        <tr>
            <td><strong>${student.username}</strong></td>
            <td>${student.institution}</td>
            <td>${student.batch}</td>
            <td>${student.email}</td>
            <td>${student.courses.length} courses</td>
            <td>
                <button class="action-btn edit-btn" onclick="showEditStudentModal(${student.id})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function showAddStudentModal() {
    populateCoursesCheckboxes('coursesCheckboxes');
    document.getElementById('addStudentModal').classList.add('active');
}

function showEditStudentModal(studentId) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(s => s.id === studentId);
    
    if (!student) return;
    
    document.getElementById('editStudentId').value = student.id;
    document.getElementById('editStudentUsername').value = student.username;
    document.getElementById('editStudentPassword').value = student.password;
    document.getElementById('editStudentInstitution').value = student.institution;
    document.getElementById('editStudentBatch').value = student.batch;
    document.getElementById('editStudentEmail').value = student.email;
    
    populateCoursesCheckboxes('editCoursesCheckboxes', student.courses);
    document.getElementById('editStudentModal').classList.add('active');
}

function populateCoursesCheckboxes(containerId, selectedCourses = []) {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const container = document.getElementById(containerId);
    
    container.innerHTML = '<div class="checkbox-group">' + courses.map(course => `
        <label class="checkbox-label">
            <input type="checkbox" value="${course.id}" 
                ${selectedCourses.includes(course.id) ? 'checked' : ''}>
            <span>${course.name}</span>
        </label>
    `).join('') + '</div>';
}

function addStudent(event) {
    event.preventDefault();
    
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const selectedCourses = Array.from(document.querySelectorAll('#coursesCheckboxes input:checked'))
        .map(cb => parseInt(cb.value));
    
    const newStudent = {
        id: Date.now(),
        username: document.getElementById('newStudentUsername').value,
        password: document.getElementById('newStudentPassword').value,
        institution: document.getElementById('newStudentInstitution').value,
        batch: document.getElementById('newStudentBatch').value,
        email: document.getElementById('newStudentEmail').value,
        courses: selectedCourses
    };
    
    students.push(newStudent);
    localStorage.setItem('students', JSON.stringify(students));
    
    closeModal('addStudentModal');
    loadStudentsTable();
    loadDashboardStats();
    event.target.reset();
    
    alert('Student added successfully!');
}

function updateStudent(event) {
    event.preventDefault();
    
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const studentId = parseInt(document.getElementById('editStudentId').value);
    const studentIndex = students.findIndex(s => s.id === studentId);
    
    if (studentIndex === -1) return;
    
    const selectedCourses = Array.from(document.querySelectorAll('#editCoursesCheckboxes input:checked'))
        .map(cb => parseInt(cb.value));
    
    students[studentIndex] = {
        ...students[studentIndex],
        username: document.getElementById('editStudentUsername').value,
        password: document.getElementById('editStudentPassword').value,
        institution: document.getElementById('editStudentInstitution').value,
        batch: document.getElementById('editStudentBatch').value,
        email: document.getElementById('editStudentEmail').value,
        courses: selectedCourses
    };
    
    localStorage.setItem('students', JSON.stringify(students));
    
    closeModal('editStudentModal');
    loadStudentsTable();
    
    alert('Student updated successfully!');
}

function deleteStudent(studentId) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    let students = JSON.parse(localStorage.getItem('students')) || [];
    students = students.filter(s => s.id !== studentId);
    localStorage.setItem('students', JSON.stringify(students));
    
    loadStudentsTable();
    loadDashboardStats();
    
    alert('Student deleted successfully!');
}

// Courses Management
function loadCoursesList() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const container = document.getElementById('coursesList');
    
    container.innerHTML = courses.map(course => `
        <div class="course-item">
            <h3>${course.name}</h3>
            <p>${course.description}</p>
            <p><strong>Classes:</strong> ${course.classes?.length || 0} | <strong>Exams:</strong> ${course.exams?.length || 0}</p>
        </div>
    `).join('');
}

// Course Content Management
function populateCoursesDropdown() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const select = document.getElementById('contentCourseSelect');
    
    select.innerHTML = '<option value="">-- Select a Course --</option>' +
        courses.map(course => `<option value="${course.id}">${course.name}</option>`).join('');
}

function loadCourseContent() {
    const courseId = parseInt(document.getElementById('contentCourseSelect').value);
    
    if (!courseId) {
        document.getElementById('contentManagement').style.display = 'none';
        return;
    }
    
    currentContentCourse = courseId;
    document.getElementById('contentManagement').style.display = 'block';
    
    updateContentLists();
}

function showContentTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.content-tab-panel').forEach(panel => panel.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tab + 'Content').classList.add('active');
}

function updateContentLists() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const course = courses.find(c => c.id === currentContentCourse);
    
    if (!course) return;
    
    // Update Classes List
    const classesList = document.getElementById('classesList');
    if (!course.classes || course.classes.length === 0) {
        classesList.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">No classes added yet</p>';
    } else {
        classesList.innerHTML = course.classes.map((item, index) => `
            <div class="content-item">
                <div class="content-item-info">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    ${item.link ? `<a href="${item.link}" target="_blank">View Link →</a>` : ''}
                </div>
                <div class="content-item-actions">
                    <button class="action-btn delete-btn" onclick="deleteContent('classes', ${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }
    
    // Update Exams List
    const examsList = document.getElementById('examsList');
    if (!course.exams || course.exams.length === 0) {
        examsList.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">No exams added yet</p>';
    } else {
        examsList.innerHTML = course.exams.map((item, index) => `
            <div class="content-item">
                <div class="content-item-info">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    ${item.link ? `<a href="${item.link}" target="_blank">View Link →</a>` : ''}
                </div>
                <div class="content-item-actions">
                    <button class="action-btn delete-btn" onclick="deleteContent('exams', ${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }
}

function showAddContentModal(type) {
    currentContentType = type;
    document.getElementById('contentType').value = type;
    document.getElementById('contentModalTitle').textContent = `Add ${type === 'class' ? 'Class' : 'Exam'}`;
    document.getElementById('addContentModal').classList.add('active');
}

function addContent(event) {
    event.preventDefault();
    
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const courseIndex = courses.findIndex(c => c.id === currentContentCourse);
    
    if (courseIndex === -1) return;
    
    const newContent = {
        title: document.getElementById('contentTitle').value,
        description: document.getElementById('contentDescription').value,
        link: document.getElementById('contentLink').value
    };
    
    const contentKey = currentContentType === 'class' ? 'classes' : 'exams';
    
    if (!courses[courseIndex][contentKey]) {
        courses[courseIndex][contentKey] = [];
    }
    
    courses[courseIndex][contentKey].push(newContent);
    localStorage.setItem('courses', JSON.stringify(courses));
    
    closeModal('addContentModal');
    updateContentLists();
    loadDashboardStats();
    loadCoursesList();
    event.target.reset();
    
    alert('Content added successfully!');
}

function deleteContent(type, index) {
    if (!confirm('Are you sure you want to delete this content?')) return;
    
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const courseIndex = courses.findIndex(c => c.id === currentContentCourse);
    
    if (courseIndex === -1) return;
    
    courses[courseIndex][type].splice(index, 1);
    localStorage.setItem('courses', JSON.stringify(courses));
    
    updateContentLists();
    loadDashboardStats();
    loadCoursesList();
    
    alert('Content deleted successfully!');
}

// Enroll Page Management
function loadEnrollDescription() {
    const description = localStorage.getItem('enrollDescription') || '';
    document.getElementById('enrollDescription').value = description;
}

function saveEnrollDescription() {
    const description = document.getElementById('enrollDescription').value;
    localStorage.setItem('enrollDescription', description);
    alert('Enroll page updated successfully!');
}

// Modal Management
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}
