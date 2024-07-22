import { useContext, useEffect, useState } from "react";
import { CaretDown, Pencil, Trash } from "react-bootstrap-icons";
import { AppContext } from "../App";

function Record() {
  const {
    getContractForRead,
    getContractForWrite,
    contractForRead,
    contractForWrite,
    patient,
    deletePatient,
    editBiodata,
    addRecords,
    userName,
    getRecords,
    editRecords,
  } = useContext(AppContext);

  const [addRecordArrow, setAddRecordArrow] = useState(false);
  const [editPatient, setEditPatient] = useState(false);
  const [editRecord, setEditRecord] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [issue, setIssue] = useState("");
  const [med, setMed] = useState("");
  const [lab, setLab] = useState("");

  const [records, setRecords] = useState([]);

  const [editPatientId, setEditPatientId] = useState("");
  const [editPatientName, setEditPatientName] = useState("");
  const [editPatientPh, setEditPatientPh] = useState("");
  const [editPatientDob, setEditPatientDob] = useState("");
  const [editPatientAddress, setEditPatientAddress] = useState("");

  const [editRecordEnd, setEditRecordEnd] = useState("");
  const [editRecordMed, setEditRecordMed] = useState("");
  const [editRecordLab, setEditRecordLab] = useState("");
  const [editRecordId, setEditRecordId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await getContractForRead();
      await getContractForWrite();
      let recs = await getRecords(patient.biodata.id, patient.recordCount);

      setRecords(recs);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-4 mb-4">
      {patient.biodata.id != 0 ? (
        <div className="biodata">
          <div className="w-[500px] p-4 border border-gray-300 rounded-lg shadow-md">
            <div className="bg-gray-200 py-2 px-4 mb-4">
              <h2 className="text-lg font-bold">Patient Details</h2>
            </div>
            <div className="text-gray-700">
              <div className="flex mb-4">
                <div className="w-1/4 text-lg font-bold">Id:</div>
                <div className="w-3/4">{patient.biodata.id.toString()}</div>
              </div>
              <div className="flex mb-4">
                <div className="w-1/4 text-lg font-bold">Name:</div>
                <div className="w-3/4">{patient.biodata.name}</div>
              </div>
              <div className="flex mb-4">
                <div className="w-1/4 text-lg font-bold">Phone:</div>
                <div className="w-3/4">{patient.biodata.ph.toString()}</div>
              </div>
              <div className="flex mb-4">
                <div className="w-1/4 text-lg font-bold">DOB:</div>
                <div className="w-3/4">{patient.biodata.dob}</div>
              </div>
              <div className="flex mb-4">
                <div className="w-1/4 text-lg font-bold">Age:</div>
                <div className="w-3/4">{patient.biodata.age.toString()}</div>
              </div>
              <div className="flex mb-4">
                <div className="w-1/4 text-lg font-bold">Address:</div>
                <div className="w-3/4">{patient.biodata._address}</div>
              </div>
            </div>

            <div className="flex w-[100%] justify-center h-10">
              <Pencil
                onClick={() => {
                  setEditPatientId(patient.biodata.id.toString());
                  setEditPatientName(patient.biodata.name);
                  setEditPatientPh(patient.biodata.ph.toString());
                  setEditPatientDob(patient.biodata.dob);
                  setEditPatientAddress(patient.biodata._address);
                  setEditPatient(!editPatient);
                }}
                className="flex w-[50%] justify-center bg-blue-100 py-2 h-[100%] hover:bg-blue-200 cursor-pointer"
              />
              <Trash
                onClick={async () => {
                  await deletePatient(patient.biodata.id);
                }}
                className="flex w-[50%] justify-center bg-red-100 py-2 h-[100%] hover:bg-red-200 cursor-pointer "
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-200 py-2 px-4 mb-4 rounded-xl font-semibold text-red-600 border-[1px] border-gray-400">
          Patient not found
        </div>
      )}

      {editPatient && (
        <div className="EditPatient flex flex-col items-center justify-center gap-4 mt-4">
          <input
            className="border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
            type="text"
            placeholder="Enter Patient id here"
            value={editPatientId}
            onChange={(e) => setEditPatientId(e.target.value)}
            readOnly
          />
          <input
            className="border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
            type="text"
            placeholder="Enter Patient name here"
            value={editPatientName}
            onChange={(e) => setEditPatientName(e.target.value)}
          />
          <input
            className="border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
            type="text"
            placeholder="Enter Patient Phone no. here"
            value={editPatientPh}
            onChange={(e) => setEditPatientPh(e.target.value)}
          />
          <input
            className="border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
            type="text"
            placeholder="Enter Patient DOB here"
            value={editPatientDob}
            onChange={(e) => setEditPatientDob(e.target.value)}
          />
          <input
            className="border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
            type="text"
            placeholder="Enter Patient address here"
            value={editPatientAddress}
            onChange={(e) => setEditPatientAddress(e.target.value)}
          />
          <button
            onClick={async () =>
              await editBiodata(
                editPatientId,
                editPatientName,
                editPatientPh,
                editPatientDob,
                editPatientAddress
              )
            }
            className="bg-green-600 rounded-lg p-2 text-white font-semibold hover:bg-green-800"
          >
            Edit
          </button>
        </div>
      )}
      <div className="AddRecord flex flex-col items-center justify-center">
        {patient.biodata.id && (
          <div
            onClick={() => setAddRecordArrow(!addRecordArrow)}
            className="flex items-center justify-center bg-gray-200 w-[400px] rounded-sm text-slate-900 cursor-pointer hover:bg-gray-300"
          >
            <CaretDown />
            Add new health record here
          </div>
        )}
        {addRecordArrow && (
          <div className="AddPatient flex flex-col items-center justify-center gap-4 mt-4">
            <input
              className="border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
              type="date"
              placeholder="Enter start date here"
              onChange={(e) => {
                setStartDate(e.target.value.trim());
              }}
            />
            <input
              className="border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
              type="date"
              placeholder="Enter end date here"
              onChange={(e) => {
                setEndDate(e.target.value.trim());
              }}
            />
            <input
              className="border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
              type="text"
              placeholder="Enter issue here"
              onChange={(e) => {
                setIssue(e.target.value.trim());
              }}
            />
            <input
              className="border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
              type="text"
              placeholder="Enter medication here"
              onChange={(e) => {
                setMed(e.target.value.trim());
              }}
            />
            <input
              className="border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
              type="text"
              placeholder="Enter lab result here"
              onChange={(e) => {
                setLab(e.target.value.trim());
              }}
            />
            <button
              onClick={async () => {
                await addRecords(
                  patient.biodata.id,
                  startDate,
                  endDate,
                  issue,
                  med,
                  lab,
                  userName
                );
              }}
              className="bg-green-600 rounded-lg p-2 text-white font-semibold hover:bg-green-800"
            >
              Add
            </button>
          </div>
        )}
      </div>
      <div className="patientrecord">
        {patient.recordCount != 0 ? (
          <table className="w-[800px] text-left border border-gray-300 rounded-lg shadow-md mt-2">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4">No.</th>
                <th className="py-2 px-4">Start Date</th>
                <th className="py-2 px-4">End Date</th>
                <th className="py-2 px-4">Health Issue</th>
                <th className="py-2 px-4">Medication</th>
                <th className="py-2 px-4">Lab Result</th>
                <th className="py-2 px-4">Doctor</th>
                <th className="py-2 px-4">Edit</th>
              </tr>
            </thead>
            <tbody>
              {records ? (
                records.map((record, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{record.startdate}</td>
                    <td className="py-2 px-4">{record.enddate}</td>
                    <td className="py-2 px-4">{record.issue}</td>
                    <td className="py-2 px-4">{record.medication}</td>
                    <td className="py-2 px-4">{record.lab}</td>
                    <td className="py-2 px-4">{record.doctor}</td>
                    <td className="py-2 px-4 hover:bg-gray-300 ">
                      <Pencil
                        onClick={() => {
                          setEditRecordId(index + 1);
                          setEditRecordEnd(record.enddate);
                          setEditRecordMed(record.medication);
                          setEditRecordLab(record.lab);
                          setEditRecord(!editRecord);
                        }}
                        className="cursor-pointer"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <div className="bg-gray-200 py-2 px-4 mb-4 rounded-xl font-semibold text-red-600 border-[1px] border-gray-400">
                  Patient don't have any past record
                </div>
              )}
            </tbody>
          </table>
        ) : (
          patient.biodata.id && (
            <div className="bg-gray-200 py-2 px-4 mb-4 rounded-xl font-semibold text-red-600 border-[1px] border-gray-400">
              Patient don't have any past record
            </div>
          )
        )}
      </div>
      {editRecord && (
        <div className="EditRecord flex flex-col items-center justify-center gap-4 mt-4">
          <input
            className="border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
            type="date"
            placeholder="Enter end date here"
            value={editRecordEnd}
            onChange={(e) => setEditRecordEnd(e.target.value)}
          />
          <input
            className="border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
            type="text"
            placeholder="Enter medication here"
            value={editRecordMed}
            onChange={(e) => setEditRecordMed(e.target.value)}
          />
          <input
            className="border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
            type="text"
            placeholder="Enter lab result here"
            value={editRecordLab}
            onChange={(e) => setEditRecordLab(e.target.value)}
          />

          <button
            onClick={async () => {
              await editRecords(
                patient.biodata.id,
                editRecordId,
                editRecordEnd,
                editRecordMed,
                editRecordLab
              );
            }}
            className="bg-green-600 rounded-lg p-2 text-white font-semibold hover:bg-green-800"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

export default Record;
