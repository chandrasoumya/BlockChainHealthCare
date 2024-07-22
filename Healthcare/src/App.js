import React, { createContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Web3 from "web3";
import AdminPage from "./components/AdminPage";
import DoctorPage from "./components/DoctorPage";
import Login from "./components/Login";
import { differenceInYears } from "date-fns";

const ABI = require("./artifacts/contracts/Healthcare.sol/Healthcare.json");
const abi = ABI.abi;

// Creating context to manage states
const AppContext = createContext();

function App() {
  const [connectedAccount, setConnectedAccount] = useState("");
  const [contractForRead, setContractForRead] = useState(null);
  const [contractForWrite, setContractForWrite] = useState(null);
  const [ownerName, setOwnerName] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [userName, setUserName] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [patient, setPatient] = useState(null);

  // Getting contract for reading purpose
  async function getContractForRead() {
    try {
      const web3 = new Web3(process.env.REACT_APP_ALCHEMY_PROVIDER);
      const contract = new web3.eth.Contract(
        abi,
        process.env.REACT_APP_DEPLOYED_ADDRESS
      );
      setContractForRead(contract);
    } catch (error) {
      console.log("Error getting contract for read:", error);
    }
  }

  // Getting contract for writing purpose
  async function getContractForWrite() {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const selectedAccount = window.ethereum.selectedAddress;
        setConnectedAccount(selectedAccount);
        const contract = new web3.eth.Contract(
          abi,
          process.env.REACT_APP_DEPLOYED_ADDRESS
        );
        setContractForWrite(contract);
      } catch (error) {
        console.log("Error getting contract for write:", error);
      }
    } else {
      console.log("Ethereum object not found");
    }
  }

  // Check if admin
  async function isAdmin(account) {
    if (contractForRead) {
      try {
        const check = await contractForRead.methods.adminStatus(account).call();
        return check;
      } catch (error) {
        console.log("Error checking admin status:", error);
      }
    } else {
      console.log("Don't have contract for read");
    }
    return false;
  }

  // Check if doctor
  async function isDoctor(account) {
    if (contractForRead) {
      try {
        const check = await contractForRead.methods
          .doctorStatus(account)
          .call();
        return check;
      } catch (error) {
        console.log("Error checking doctor status:", error);
      }
    } else {
      console.log("Don't have contract for read");
    }
    return false;
  }

  // Getting owner data
  async function getOwnerData() {
    if (contractForRead) {
      try {
        const owner = await contractForRead.methods.owner().call();
        setOwnerName(owner.name);
        setOwnerAddress(owner.account);
      } catch (error) {
        console.log("Error getting owner data:", error);
      }
    } else {
      console.log("Don't have contract for read");
    }
  }

  // Getting user data
  async function getUserData() {
    if (contractForRead) {
      try {
        const isAdminCheck = await isAdmin(connectedAccount);
        const isDoctorCheck = await isDoctor(connectedAccount);

        if (isAdminCheck) {
          const name = await contractForRead.methods
            .getAdminNameByAddress(connectedAccount)
            .call();
          setUserName(name);
          setUserAddress(connectedAccount);
        } else if (isDoctorCheck) {
          const name = await contractForRead.methods
            .getDoctorNameByAddress(connectedAccount)
            .call();
          setUserName(name);
          setUserAddress(connectedAccount);
        }
      } catch (error) {
        console.log("Error getting user data:", error);
      }
    } else {
      console.log("Don't have contract for read");
    }
  }

  // Add admin
  async function addAdmin(name, account) {
    if (contractForWrite) {
      if (name === "" || account === "") {
        window.alert("Enter all fields");
      } else {
        try {
          const isAdminCheck = await isAdmin(account);
          if (isAdminCheck) {
            window.alert("Already an admin");
          } else {
            await contractForWrite.methods
              .addAdmin(name, account)
              .send({ from: connectedAccount, gas: 300000 });
            window.alert("Admin Added Successfully!");
          }
        } catch (error) {
          console.log("Error adding admin:", error);
          window.alert("Failed to add Admin. Check console for details.");
        }
      }
    } else {
      console.log("Don't have contract for write");
    }
  }

  // Add new doctor
  async function addDoctor(name, account) {
    if (contractForWrite) {
      if (name === "" || account === "") {
        window.alert("Enter all fields");
      } else {
        try {
          const isDoctorCheck = await isDoctor(account);
          if (isDoctorCheck) {
            window.alert("Already a doctor");
          } else {
            await contractForWrite.methods
              .addDoctor(name, account)
              .send({ from: connectedAccount, gas: 300000 });
            window.alert("Doctor Added Successfully!");
          }
        } catch (error) {
          console.log("Error adding doctor:", error);
          window.alert("Failed to add Doctor. Check console for details.");
        }
      }
    } else {
      console.log("Don't have contract for write");
    }
  }

  // Getting all admins
  async function getAdmins() {
    if (contractForRead) {
      try {
        let admins = [];
        const adminCount = await contractForRead.methods.adminCount().call();
        for (let i = 1; i <= adminCount; i++) {
          const admin = await contractForRead.methods.admins(i).call();
          admins.push(admin);
        }
        return admins;
      } catch (error) {
        console.log("Error getting all admins:", error);
      }
    } else {
      console.log("Don't have contract for read");
    }
    return [];
  }

  // Getting all doctors
  async function getDoctors() {
    if (contractForRead) {
      try {
        let doctors = [];
        const doctorCount = await contractForRead.methods.doctorCount().call();
        for (let i = 1; i <= doctorCount; i++) {
          const doctor = await contractForRead.methods.doctors(i).call();
          doctors.push(doctor);
        }
        return doctors;
      } catch (error) {
        console.log("Error getting all doctors:", error);
      }
    } else {
      console.log("Don't have contract for read");
    }
    return [];
  }

  // Delete admin
  async function deleteAdmin(account) {
    if (contractForWrite) {
      try {
        if (ownerAddress) {
          if (ownerAddress === account) {
            window.alert("Owner can't be deleted");
          } else {
            await contractForWrite.methods
              .deleteAdmin(account)
              .send({ from: connectedAccount, gas: 300000 });
            window.alert("Admin Deleted Successfully!");
          }
        } else {
          window.alert("Not getting the owner address");
        }
      } catch (error) {
        console.log("Error deleting admin:", error);
        window.alert("Failed to Delete Admin. Check console for details.");
      }
    } else {
      console.log("Don't have contract for write");
    }
  }

  // Delete admin
  async function deleteDoctor(account) {
    if (contractForWrite) {
      try {
        await contractForWrite.methods
          .deleteDoctor(account)
          .send({ from: connectedAccount, gas: 300000 });
        window.alert("Doctor Deleted Successfully!");
      } catch (error) {
        console.log("Error deleting Doctor:", error);
        window.alert("Failed to Delete Doctor. Check console for details.");
      }
    } else {
      console.log("Don't have contract for write");
    }
  }
  // Function to calculate age
  function calculateAge(dob) {
    const dobDate = new Date(dob);
    const currentDate = new Date();
    const age = differenceInYears(currentDate, dobDate);
    return age;
  }

  // Phone number validation
  function validPh(ph) {
    if (ph.length != 10) {
      return false;
    } else if (!parseInt(ph)) {
      return false;
    } else {
      return true;
    }
  }

  // Add patient
  async function addPatient(name, ph, dob, address) {
    if (contractForWrite) {
      try {
        if (name === "" || ph === "" || dob === "" || address === "") {
          window.alert("Enter all fields");
          return;
        }
        if (!validPh(ph)) {
          window.alert("Enter a valid phone number");
          return;
        }
        let age = calculateAge(dob);
        await contractForWrite.methods
          .addPatient(name, ph, dob, age, address)
          .send({ from: connectedAccount, gas: 300000 });
        let id = await contractForWrite.methods
          .getPatientId()
          .call({ from: connectedAccount });
        return id;
      } catch (error) {
        console.log("Error to Add Patient: ", error);
        window.alert("Failed to Add Patient. Check console for details.");
      }
    } else {
      console.log("Don't have contract for write");
    }
  }

  // get patient
  async function getPatient(id) {
    if (contractForRead) {
      try {
        let patient = await contractForRead.methods.patients(id).call();
        setPatient(patient);
      } catch (error) {
        console.log("Error to Get Patient: ", error);
        window.alert("Failed to Get Patient. Check console for details.");
      }
    } else {
      console.log("Don't have contract for read");
    }
  }

  // delete patient
  async function deletePatient(id) {
    if (contractForWrite) {
      try {
        await contractForWrite.methods
          .deletePatient(id)
          .send({ from: connectedAccount, gas: 300000 });
        window.alert("Patient is deleted");
      } catch (error) {
        console.log("Error to Delete Patient: ", error);
        window.alert("Failed to Delete Patient. Check console for details.");
      }
    } else {
      console.log("Don't have contract for write");
    }
  }

  // edit patient biodata
  async function editBiodata(id, name, ph, dob, address) {
    if (contractForWrite) {
      try {
        if (!validPh(ph)) {
          window.alert("Enter a valid phone number");
          return;
        }
        let age = calculateAge(dob);
        await contractForWrite.methods
          .editPatient(id, name, ph, dob, age, address)
          .send({ from: connectedAccount, gas: 300000 });
      } catch (error) {
        console.log("Error to Edit Patient: ", error);
        window.alert("Failed to Edit Patient. Check console for details.");
      }
    } else {
      console.log("Don't have contract for write");
    }
  }

  // add records
  async function addRecords(
    id,
    startdate,
    enddate,
    issue,
    medication,
    lab,
    doctor
  ) {
    if (contractForWrite) {
      try {
        if (
          id === "" ||
          startdate === "" ||
          enddate === "" ||
          issue === "" ||
          medication === "" ||
          lab === "" ||
          doctor === ""
        ) {
          window.alert("Enter all fields");
          return;
        }
        await contractForWrite.methods
          .addRecord(id, startdate, enddate, issue, medication, lab, doctor)
          .send({ from: connectedAccount, gas: 300000 });
      } catch (error) {
        console.log("Error to Add Recor: ", error);
        window.alert("Failed to Add Record. Check console for details.");
      }
    } else {
      console.log("Don't have contract for write");
    }
  }

  // get records
  async function getRecords(patientId, recordCount) {
    if (contractForRead) {
      try {
        let recs = [];
        for (let i = 1; i <= recordCount; i++) {
          const record = await contractForRead.methods
            .getRecord(patientId, i)
            .call({ from: connectedAccount });
          recs.push(record);
        }
        return recs;
      } catch (error) {
        console.log("Error to Get Recor: ", error);
        window.alert("Failed to Get Record. Check console for details.");
      }
    } else {
      console.log("Don't have contract for read");
    }
  }

  // edit records
  async function editRecords(patientId, recordId, enddate, medication, lab) {
    if (contractForWrite) {
      try {
        if (
          patientId === "" ||
          recordId === "" ||
          enddate === "" ||
          medication === "" ||
          lab === ""
        ) {
          window.alert("Enter all fields");
          return;
        }
        await contractForWrite.methods
          .editRecord(patientId, recordId, enddate, medication, lab)
          .send({ from: connectedAccount, gas: 300000 });
      } catch (error) {
        console.log("Error to Edit Recor: ", error);
        window.alert("Failed to Edit Record. Check console for details.");
      }
    } else {
      console.log("Don't have contract for write");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await getContractForRead();
    };
    fetchData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        getContractForRead,
        getContractForWrite,
        connectedAccount,
        contractForRead,
        contractForWrite,
        isAdmin,
        isDoctor,
        ownerName,
        ownerAddress,
        getOwnerData,
        userName,
        userAddress,
        getUserData,
        addAdmin,
        addDoctor,
        getAdmins,
        getDoctors,
        deleteAdmin,
        deleteDoctor,
        addPatient,
        getPatient,
        patient,
        deletePatient,
        editBiodata,
        addRecords,
        getRecords,
        editRecords,
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/adminPage" element={<AdminPage />} />
          <Route path="/doctorPage" element={<DoctorPage />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
export { AppContext };
