import http from 'k6/http';
import { check, sleep } from 'k6';

// 300 Teachers opening sessions, followed by 15,000 students scanning.
export const options = {
  stages: [
    { duration: '30s', target: 300 },   // Ramp-up to 300 teachers
    { duration: '1m', target: 300 },    // Teachers open sessions
    { duration: '1m', target: 5000 },   // Massive spike: 5000 concurrent students scanning
    { duration: '2m', target: 5000 },   // Sustained load
    { duration: '30s', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<150'], // 95% of requests must complete below 150ms
    http_req_failed: ['rate<0.01'],   // Error rate must be less than 1%
  },
};

const BASE_URL = 'http://localhost:3000'; // Replace with staging URL

export default function () {
  // Simulate teacher login & session start
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: 'teacher@campusflow.test',
    password: 'password123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  if (loginRes.status === 200) {
    const token = loginRes.json('access_token');
    
    // Simulate teacher opening session
    const sessionRes = http.post(`${BASE_URL}/attendance/sessions`, JSON.stringify({
      classId: 'dummy-class-id',
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    check(sessionRes, {
      'session created successfully': (r) => r.status === 201,
    });
  }

  sleep(1);

  // Simulate multiple students scanning simultaneously for that teacher's session
  const scanRes = http.post(`${BASE_URL}/attendance/scan`, JSON.stringify({
    sessionId: 'dummy-session-id', // Extracted from sessionRes in real test
    qrIdentifier: `STUDENT_QR_${Math.floor(Math.random() * 10000)}`,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(scanRes, {
    'scan successful': (r) => r.status === 200 || r.status === 201 || r.status === 409, // 409 is already scanned
  });

  sleep(1);
}
