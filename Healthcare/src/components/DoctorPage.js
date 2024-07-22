import { Search, CaretDown } from "react-bootstrap-icons";
import Record from "./Record";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";

function DoctorPage() {
  const {
    getContractForRead,
    getContractForWrite,
    contractForRead,
    contractForWrite,
    getUserData,
    userName,
    userAddress,
    addPatient,
    getPatient,
    patient,
  } = useContext(AppContext);

  const [havePatient, setHavePatient] = useState(false);

  const [addPatientArrow, setAddPatientArrow] = useState(true);

  const [newPatientId, setNewPatientId] = useState(null);
  const [id, setId] = useState(null);

  const [name, setName] = useState("");
  const [ph, setPh] = useState("");
  const [dob, setDob] = useState();
  const [address, setAddress] = useState("");

  useEffect(() => {
    async function fetchData() {
      await getContractForRead();
      await getContractForWrite();
      await getUserData();
    }
    fetchData();
  }, []);
  return (
    <div className="flex flex-col items-center mt-4 mb-4 gap-4">
      <img className="w-24 absolute top-1 left-1" src="./logo.png" alt="logo" />
      <h1 className="text-3xl font-bold text-gray-600 tracking-wide uppercase mb-4 bg-gray-200 py-2 px-4 border border-gray-300 rounded-lg">
        Patient record
      </h1>
      <div className=" rounded-sm border-[1px] border-gray-300 p-3">
        <span className="bg-gray-200 rounded-sm p-2">Doctor:</span> {userName} -
        {userAddress}
      </div>
      <div className="search-bar flex gap-2">
        <input
          className=" border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
          type="number"
          placeholder="Enter Patient id here"
          onChange={(e) => {
            setId(e.target.value.trim());
          }}
        />
        <button
          onClick={async () => {
            await getPatient(id);
            // console.log(patient);
            setHavePatient(true);
            setAddPatientArrow(false);
          }}
          className="text-gray-600 hover:text-gray-900  border-[1px] border-gray-500 p-2  bg-gray-200 py-2 rounded-lg  hover:bg-gray-300"
        >
          <Search className="w-max h-6" />
        </button>
      </div>
      <div className="AddPatient flex flex-col items-center justify-center">
        <div
          onClick={() => {
            setAddPatientArrow(!addPatientArrow);
          }}
          className="flex items-center justify-center bg-gray-200 w-[400px] rounded-sm text-slate-900 cursor-pointer hover:bg-gray-300"
        >
          <CaretDown />
          Add new patient here
        </div>
        {addPatientArrow && (
          <div className="AddPatient flex flex-col items-center justify-center gap-4 mt-4">
            <input
              className=" border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
              type="text"
              placeholder="Enter Patient name here"
              onChange={(e) => {
                setName(e.target.value.trim());
              }}
            />
            <input
              className=" border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
              type="text"
              placeholder="Enter Patient Phone no. here"
              onChange={(e) => {
                setPh(e.target.value.trim());
              }}
            />
            <input
              className=" border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
              type="date"
              placeholder="Enter Patient DOB here"
              onChange={(e) => {
                setDob(e.target.value);
              }}
            />
            <input
              className=" border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
              type="text"
              placeholder="Enter Patient address here"
              onChange={(e) => {
                setAddress(e.target.value.trim());
              }}
            />
            <button
              className=" bg-green-600 rounded-lg p-2 text-white font-semibold hover:bg-green-800"
              onClick={async () => {
                let id = await addPatient(name, ph, dob, address);
                setNewPatientId(id);
              }}
            >
              Add
            </button>
            {newPatientId && (
              <div className="bg-gray-200 py-2 px-4 mb-4 rounded-xl font-semibold text-blue-600 border-[1px] border-gray-400">
                <span className="text-black"> Patient Id:</span>{" "}
                {newPatientId.toString()}
                <span className="text-red-600">(don't forget)</span>
              </div>
            )}
          </div>
        )}
      </div>
      {havePatient && <Record />}
    </div>
  );
}

export default DoctorPage;
