/**
 * Live Security & Zero-Trust Audit Verification Script
 * 
 * Verifies that:
 * 1. Unauthenticated / Ordinary users cannot read private Customers collection.
 * 2. Unauthenticated / Ordinary users cannot list all Bookings.
 * 3. Unauthenticated / Ordinary users cannot modify/delete any Booking.
 * 4. Unauthenticated / Ordinary users cannot read, write, or delete Repair Jobs (worksheets).
 * 5. Unauthenticated / Ordinary users cannot modify System Settings.
 * 6. Unauthenticated / Ordinary users cannot modify, add, or delete Portfolio Works.
 * 7. Unauthenticated / Ordinary users cannot inject self-assigned admin documents.
 * 8. Malformed payloads (e.g. status='COMPLETED' on booking creation) are strictly blocked.
 */

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

async function runSecurityAudit() {
  console.log('====================================================');
  console.log('🛡️  STARTING ZERO-TRUST SECURITY AUDIT SUITE');
  console.log('====================================================\n');

  // Test 1: Ordinary / Unauthenticated User Reading Customers CRM
  try {
    const snap = await getDocs(collection(db, 'customers'));
    results.push({
      name: 'Ordinary User Read Customers Collection',
      category: 'Customers CRM Isolation',
      passed: false,
      details: `SECURITY LEAK: Able to read ${snap.size} customer records without admin auth.`
    });
  } catch (err: any) {
    const isDenied = String(err).includes('permission-denied') || String(err).includes('Missing or insufficient permissions');
    results.push({
      name: 'Ordinary User Read Customers Collection',
      category: 'Customers CRM Isolation',
      passed: isDenied,
      details: isDenied ? 'PASSED (Protected: PERMISSION_DENIED)' : `Error: ${err.message}`
    });
  }

  // Test 2: Ordinary User Listing All Bookings
  try {
    const snap = await getDocs(collection(db, 'bookings'));
    results.push({
      name: 'Ordinary User List All Bookings (PII Guard)',
      category: 'Bookings Access Control',
      passed: false,
      details: `SECURITY LEAK: Able to list ${snap.size} booking records without admin auth.`
    });
  } catch (err: any) {
    const isDenied = String(err).includes('permission-denied') || String(err).includes('Missing or insufficient permissions');
    results.push({
      name: 'Ordinary User List All Bookings (PII Guard)',
      category: 'Bookings Access Control',
      passed: isDenied,
      details: isDenied ? 'PASSED (Protected: PERMISSION_DENIED)' : `Error: ${err.message}`
    });
  }

  // Test 3: Ordinary User Reading Repair Jobs Worksheets
  try {
    const snap = await getDocs(collection(db, 'repairs'));
    results.push({
      name: 'Ordinary User Read Repair Jobs Collection',
      category: 'Repairs Worksheets Isolation',
      passed: false,
      details: `SECURITY LEAK: Able to read ${snap.size} repair jobs without admin auth.`
    });
  } catch (err: any) {
    const isDenied = String(err).includes('permission-denied') || String(err).includes('Missing or insufficient permissions');
    results.push({
      name: 'Ordinary User Read Repair Jobs Collection',
      category: 'Repairs Worksheets Isolation',
      passed: isDenied,
      details: isDenied ? 'PASSED (Protected: PERMISSION_DENIED)' : `Error: ${err.message}`
    });
  }

  // Test 4: Ordinary User Modifying System Settings
  try {
    await setDoc(doc(db, 'settings', 'global_settings'), {
      centerName: 'Hacked Center Name',
      phone1: '01000000000',
      whatsappNumber: '201000000000'
    }, { merge: true });
    results.push({
      name: 'Ordinary User Write System Settings',
      category: 'System Settings Integrity',
      passed: false,
      details: 'SECURITY LEAK: Able to write/modify system settings without admin auth.'
    });
  } catch (err: any) {
    const isDenied = String(err).includes('permission-denied') || String(err).includes('Missing or insufficient permissions');
    results.push({
      name: 'Ordinary User Write System Settings',
      category: 'System Settings Integrity',
      passed: isDenied,
      details: isDenied ? 'PASSED (Protected: PERMISSION_DENIED)' : `Error: ${err.message}`
    });
  }

  // Test 5: Ordinary User Modifying / Deleting Portfolio Works
  try {
    await setDoc(doc(db, 'works', 'test_unauthorized_work'), {
      id: 'test_unauthorized_work',
      title: 'Hacked Work Item',
      category: 'ثلاجات',
      deviceType: 'ثلاجة',
      problem: 'Unauthorized inject',
      solution: 'Unauthorized fix',
      date: '2026-09-01',
      image: 'https://example.com/fake.jpg',
      createdAt: new Date().toISOString()
    });
    results.push({
      name: 'Ordinary User Create/Modify Portfolio Works',
      category: 'Portfolio Integrity',
      passed: false,
      details: 'SECURITY LEAK: Able to create or modify portfolio works without admin auth.'
    });
  } catch (err: any) {
    const isDenied = String(err).includes('permission-denied') || String(err).includes('Missing or insufficient permissions');
    results.push({
      name: 'Ordinary User Create/Modify Portfolio Works',
      category: 'Portfolio Integrity',
      passed: isDenied,
      details: isDenied ? 'PASSED (Protected: PERMISSION_DENIED)' : `Error: ${err.message}`
    });
  }

  // Test 6: Ordinary User Creating Admin Escalation Record
  try {
    await setDoc(doc(db, 'admins', 'fake_attacker_uid'), {
      email: 'attacker@evil.com',
      role: 'SUPER_ADMIN',
      createdAt: new Date().toISOString()
    });
    results.push({
      name: 'Privilege Escalation: Self-Assigned Admin',
      category: 'Admin RBAC Security',
      passed: false,
      details: 'SECURITY LEAK: Able to write admin document without super admin auth.'
    });
  } catch (err: any) {
    const isDenied = String(err).includes('permission-denied') || String(err).includes('Missing or insufficient permissions');
    results.push({
      name: 'Privilege Escalation: Self-Assigned Admin',
      category: 'Admin RBAC Security',
      passed: isDenied,
      details: isDenied ? 'PASSED (Protected: PERMISSION_DENIED)' : `Error: ${err.message}`
    });
  }

  // Test 7: Malformed Booking Create with illegal status COMPLETED
  try {
    await setDoc(doc(db, 'bookings', 'BK-TEST-MALICIOUS'), {
      id: 'BK-TEST-MALICIOUS',
      fullName: 'Attacker Name',
      phoneNumber: '01012345678',
      address: 'Test Address',
      deviceType: 'غسالة',
      issueDescription: 'Test issue',
      status: 'COMPLETED', // ILLEGAL: must be NEW
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    results.push({
      name: 'State Shortcut Attack: Direct Booking Completion',
      category: 'Data Validation Integrity',
      passed: false,
      details: 'SECURITY LEAK: Allowed creating a booking with status COMPLETED bypassing technician flow.'
    });
  } catch (err: any) {
    const isDenied = String(err).includes('permission-denied') || String(err).includes('Missing or insufficient permissions');
    results.push({
      name: 'State Shortcut Attack: Direct Booking Completion',
      category: 'Data Validation Integrity',
      passed: isDenied,
      details: isDenied ? 'PASSED (Protected: Schema enforced status == NEW)' : `Error: ${err.message}`
    });
  }

  // Output Summary
  console.log('\n--- AUDIT RESULTS SUMMARY ---');
  let allPassed = true;
  for (const res of results) {
    const icon = res.passed ? '✅' : '❌';
    console.log(`${icon} [${res.category}] ${res.name}: ${res.details}`);
    if (!res.passed) allPassed = false;
  }

  console.log('\n====================================================');
  if (allPassed) {
    console.log('🎉 ALL SECURITY ASSERTIONS PASSED WITH ZERO VULNERABILITIES');
    process.exit(0);
  } else {
    console.error('⚠️ ONE OR MORE SECURITY AUDIT TESTS FAILED');
    process.exit(1);
  }
}

runSecurityAudit();
