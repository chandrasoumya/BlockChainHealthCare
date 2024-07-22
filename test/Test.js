const { expect } = require("chai");
const hre = require("hardhat");
const { differenceInYears } = require("date-fns");

describe("Healthcare", function () {
  let healthcare;
  let owner, admin, doctor;
  let ownerName,
    adminName,
    doctorName,
    patientName,
    patientPhone,
    patientDob,
    patientEditedDob,
    patientAddress,
    startDate,
    endDate,
    issue,
    medication,
    lab,
    doc;

  beforeEach(async () => {
    [owner, admin, doctor] = await ethers.getSigners();
    ownerName = "Dr. R. Das";
    adminName = "Dr. B. Pal";
    doctorName = "Dr. S. Dey";
    patientName = "Lalit Yadav";
    patientPhone = 6963258496;
    patientDob = "2000-12-12";
    patientEditedDob = "2000-11-1";
    patientAddress = "Kanchannagar, Purba-Bardhaman-713102";
    startDate = "2024-1-1";
    endDate = "ongoing";
    editedEndDate = "2024-5-5";
    issue = "Hypertension";
    medication = "NA";
    lab = "NA";
    doc = "Dr. R. Pal";

    healthcare = await hre.ethers.deployContract("Healthcare", [ownerName]);
  });

  it("Should set the right owner", async () => {
    const ownerDetails = await healthcare.owner();
    expect(ownerDetails.account).to.equal(owner.address);
    expect(ownerDetails.name).to.equal(ownerName);
  });

  it("Should add new admin", async () => {
    await healthcare.addAdmin(adminName, admin.address);
    expect(await healthcare.adminCount()).to.equal(2);
    expect(await healthcare.adminStatus(admin.address)).to.be.true;
    const newadmin = await healthcare.admins(2);
    expect(await newadmin.name).to.equal(adminName);
    expect(await newadmin.account).to.equal(admin.address);
  });

  it("Should return all admins", async () => {
    let admins = [];
    const adminCount = await healthcare.adminCount();
    for (let i = 1; i <= adminCount; i++) {
      let admin = await healthcare.admins(i);
      admins.push(admin);
    }
    for (let i = 0; i < admin.length; i++) {
      expect(admins[0].name).to.equal(ownerName);
      expect(admins[0].account).to.equal(owner.address);
    }
  });

  it("Should delete the previous admin", async () => {
    await healthcare.deleteAdmin(admin.address);
    expect(await healthcare.adminCount()).to.equal(1);
    expect(await healthcare.adminStatus(admin.address)).to.be.false;
  });

  it("Should add new doctor", async () => {
    await healthcare.addDoctor(doctorName, doctor.address);
    expect(await healthcare.doctorCount()).to.equal(1);
    expect(await healthcare.doctorStatus(doctor.address)).to.be.true;
    const newdoctor = await healthcare.doctors(1);
    expect(await newdoctor.name).to.equal(doctorName);
    expect(await newdoctor.account).to.equal(doctor.address);
  });

  it("Should return all doctors", async () => {
    let doctors = [];
    const doctorCount = await healthcare.doctorCount();
    for (let i = 1; i <= doctorCount; i++) {
      let doctor = await healthcare.doctors(i);
      doctors.push(doctor);
    }
    for (let i = 0; i < doctors.length; i++) {
      expect(doctors[i].name).to.equal(doctorName);
      expect(doctors[i].account).to.equal(doctor.address);
    }
  });

  it("Should delete the previous doctor", async () => {
    await healthcare.deleteDoctor(doctor.address);
    expect(await healthcare.doctorCount()).to.equal(0);
    expect(await healthcare.doctorStatus(doctor.address)).to.be.false;
  });

  it("Should add new patient", async () => {
    function calculateAge(dob) {
      const dobDate = new Date(dob);
      const currentDate = new Date();
      const age = differenceInYears(currentDate, dobDate);
      return age;
    }

    // it is fof only doctor so i need to ad the owner/deployer as a doctor
    await healthcare.addDoctor(ownerName, owner.address);
    // now  it will work
    const patientAge = calculateAge(patientDob);
    const tx = await healthcare.addPatient(
      patientName,
      patientPhone,
      patientDob,
      patientAge,
      patientAddress
    );
    const patient = await healthcare.patients(1001);

    expect(patient.biodata.name).to.equal(patientName);
    expect(patient.biodata.ph).to.equal(patientPhone);
    expect(patient.biodata.dob).to.equal(patientDob);
    expect(patient.biodata.age).to.equal(patientAge);
    expect(patient.biodata._address).to.equal(patientAddress);
    expect(patient.recordCount).to.equal(0);
  });

  it("Should edit existing patient", async () => {
    function calculateAge(dob) {
      const dobDate = new Date(dob);
      const currentDate = new Date();
      const age = differenceInYears(currentDate, dobDate);
      return age;
    }
    const patientAge = calculateAge(patientDob);
    // it is fof only doctor so i need to ad the owner/deployer as a doctor
    await healthcare.addDoctor(ownerName, owner.address);
    // first need to add a patient
    const tx = await healthcare.addPatient(
      patientName,
      patientPhone,
      patientDob,
      patientAge,
      patientAddress
    );
    // now  it will work
    const patientAge2 = calculateAge(patientEditedDob);

    const tx2 = await healthcare.editPatient(
      1001,
      patientName,
      patientPhone,
      patientEditedDob,
      patientAge2,
      patientAddress
    );
    const patient = await healthcare.patients(1001);

    expect(patient.biodata.name).to.equal(patientName);
    expect(patient.biodata.ph).to.equal(patientPhone);
    expect(patient.biodata.dob).to.equal(patientEditedDob);
    expect(patient.biodata.age).to.equal(patientAge2);
    expect(patient.biodata._address).to.equal(patientAddress);
    expect(patient.recordCount).to.equal(0);
  });

  it("Should add new patient record and get record by id", async () => {
    // it is fof only doctor so i need to ad the owner/deployer as a doctor
    await healthcare.addDoctor(ownerName, owner.address);
    // now  it will work
    await healthcare.addRecord(
      1001,
      startDate,
      endDate,
      issue,
      medication,
      lab,
      doc
    );
    const patient = await healthcare.patients(1001);
    expect(patient.recordCount).to.equal(1);
    const record = await healthcare.getRecord(1001, 1);
    expect(record.startdate).to.equal(startDate);
    expect(record.enddate).to.equal(endDate);
    expect(record.issue).to.equal(issue);
    expect(record.medication).to.equal(medication);
    expect(record.lab).to.equal(lab);
    expect(record.doctor).to.equal(doc);
  });

  it("Should edit patient record and get record by id", async () => {
    // it is fof only doctor so i need to ad the owner/deployer as a doctor
    await healthcare.addDoctor(ownerName, owner.address);
    // also we need to add a record first
    await healthcare.addRecord(
      1001,
      startDate,
      endDate,
      issue,
      medication,
      lab,
      doc
    );
    // now  it will work
    await healthcare.editRecord(1001, 1, editedEndDate, medication, lab);
    const patient = await healthcare.patients(1001);
    expect(patient.recordCount).to.equal(1);
    const record = await healthcare.getRecord(1001, 1);
    expect(record.startdate).to.equal(startDate);
    expect(record.enddate).to.equal(editedEndDate);
    expect(record.issue).to.equal(issue);
    expect(record.medication).to.equal(medication);
    expect(record.lab).to.equal(lab);
    expect(record.doctor).to.equal(doc);
  });

  it("Should return admin & doctor name by address", async () => {
    // first we need to add admin and doctor
    await healthcare.addAdmin(adminName, admin.address);
    await healthcare.addDoctor(doctorName, doctor.address);

    const Admin = await healthcare.getAdminNameByAddress(admin.address);
    expect(Admin).to.equal(adminName);
    const Doctor = await healthcare.getDoctorNameByAddress(doctor.address);
    expect(Doctor).to.equal(doctorName);
  });
});
