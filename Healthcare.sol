// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Healthcare {
    // structure for admin & doctors
    struct person{
        string name;
        address account;
    }
    // structure for patient
    struct bio{
        uint256 id;
        string name;
        uint256 ph;
        string dob;
        uint256 age;
        string _address;
    }
    struct record{
        string startdate;
        string enddate;
        string issue;
        string medication;
        string lab;
        string doctor;
    }
    struct patient{
        bio biodata;
        mapping(uint256=>record) records;
        uint256 recordCount;
    }

    person public owner; // owner of the contract
    uint256 private idCounter; // iit hepls to generate unique id for patients
    uint256 public adminCount; // count total admins
    uint256 public doctorCount; // count total doctors
    mapping (uint256 => person) public admins; // store admins and get list of admins
    mapping (uint256 => person) public doctors; // store doctors and get list of doctors
    mapping(address => bool) public adminStatus; // to check a person is admin or not
    mapping(address => bool) public doctorStatus; // to check a person is doctor or not
    mapping(uint256 => patient ) public patients; // store the patients , here the  uint256 will be the patient id

    constructor(string memory name ) {
        owner = person(name,msg.sender);
        adminCount = 1;
        doctorCount = 0;
        admins[1] = owner;
        adminStatus[msg.sender] = true;
        idCounter = 1000;
    }

    modifier onlyOwner() {
        require(msg.sender == owner.account,"You are not the owner");
        _;
    }

    modifier onlyAdmin() {
        require(adminStatus[msg.sender],"You are not a admin");
        _;
    }

    modifier onlyDoctor() {
        require(doctorStatus[msg.sender],"You are not a doctor");
        _;
    }

    // add new admin
    function addAdmin(string calldata name , address account) external  onlyOwner {
        adminCount++;
        admins[adminCount] = person(name, account);
        adminStatus[account] = true;
    }

    // delete admin
    function deleteAdmin(address account) external  onlyOwner {
        adminStatus[account] = false;
        for (uint256 i = 1; i <= adminCount ; i++) 
        {
            if(admins[i].account == account){
                for (uint256 j = i; j < adminCount; j++) {
                    admins[j] = admins[j + 1];
                }
                delete admins[adminCount];
                adminCount--;
                break;
            }
        }
    }


    // find admin name by address
    function findAdminNameByAddress(address adminAddress) external view returns (string memory) {
        for (uint256 i = 1; i <= adminCount; i++) {
            if (admins[i].account == adminAddress) {
                return admins[i].name;
            }
        }
        revert("Admin not found");
    }

    // add new doctor
    function addDoctor(string calldata name , address account) external  onlyAdmin {
        doctorCount++;
        doctors[doctorCount] = person(name, account);
        doctorStatus[account] = true;
    }

    // delete doctor
    function deleteDoctor(address account) external  onlyAdmin {
        doctorStatus[account] = false;
        for (uint256 i = 1; i <= doctorCount; i++) {
            if (doctors[i].account == account) {
                for (uint256 j = i; j < doctorCount; j++) {
                  doctors[j] = doctors[j + 1];
                }
                delete doctors[doctorCount];
                doctorCount--;
                break;
            }
        }
    }

    // find doctor name by address
    function findDoctorNameByAddress(address doctorAddress) external  view returns (string memory) {
    for (uint256 i = 1; i <= doctorCount; i++) {
            if (doctors[i].account == doctorAddress) {
                return doctors[i].name;
            }
        }
        revert("Doctor not found");
    }


    // add new patient
    function addPatient(string calldata name, uint256 ph, string calldata dob, uint256 age, string calldata _address) external onlyDoctor returns (uint256) {
        idCounter++;
        patients[idCounter].biodata = bio(idCounter, name, ph, dob, age, _address); 
        patients[idCounter].recordCount = 0;
        return idCounter;
    }

    // delete patient
    function deletePatient(uint256 patientId) external onlyDoctor {
        delete patients[patientId];
    }

    // edit patient biodata
    function editPatient(uint256 patientId, string calldata name, uint256 ph, string calldata dob , uint256 age , string calldata _address) external onlyDoctor {
        bio storage b = patients[patientId].biodata ;
        b.name = name;
        b.ph = ph;
        b.dob = dob;
        b.age = age;
        b._address = _address;
    }

    // add patient records
    function addRecord(uint256 patientId,string memory startdate, string memory enddate, string memory issue, string memory medication, string memory lab, string memory doctor) external onlyDoctor {
        // memory is used insted of calldata as the stack is too deep with calldata(too many arguments) 
        patient storage p = patients[patientId];
        uint256 recordNumber = ++p.recordCount;
        p.records[recordNumber] = record(startdate,enddate,issue,medication,lab,doctor);
    }

    // edit patient records
    function editRecord(uint256 patientId, uint256 recordNumber, string calldata enddate, string calldata medication, string calldata lab) external onlyDoctor {
        record storage r = patients[patientId].records[recordNumber];
        r.enddate = enddate;
        r.medication = medication;
        r.lab = lab;
    }
}
