import { useContext, useEffect, useState } from "react";
import * as Icon from "react-bootstrap-icons";
import { AppContext } from "../App";
function AdminPage() {
  const {
    getContractForWrite,
    getOwnerData,
    getUserData,
    addAdmin,
    addDoctor,
    deleteAdmin,
    deleteDoctor,
    getAdmins,
    getDoctors,
    ownerName,
    ownerAddress,
    userName,
    userAddress,
  } = useContext(AppContext);

  const [adminName, setAdminName] = useState("");
  const [adminAddress, setAdminAddress] = useState("");

  const [doctorName, setDoctorName] = useState("");
  const [doctorAddress, setDoctorAddress] = useState("");

  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getContractForWrite();
        await getUserData();
        await getOwnerData();

        const admins = await getAdmins();
        const doctors = await getDoctors();

        const Members = [];

        admins.forEach((admin) => {
          Members.push({
            status: "admin",
            address: admin.account,
            name: admin.name,
          });
        });

        doctors.forEach((doctor) => {
          Members.push({
            status: "doctor",
            address: doctor.account,
            name: doctor.name,
          });
        });

        setMembers(Members);
      } catch (error) {
        console.log("Error loading data in AdminPage:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4  mt-4 mb-4">
      <img className="w-24 absolute top-1 left-1" src="./logo.png" alt="logo" />
      <h1 className="text-3xl font-bold text-gray-600 tracking-wide uppercase mb-4 bg-gray-200 py-2 px-4 border border-gray-300 rounded-lg">
        Admin Panel
      </h1>
      <div className=" rounded-sm border-[1px] border-gray-300 p-3">
        <span className="bg-gray-200 rounded-sm p-2 ">Owner:</span> {ownerName}-
        {ownerAddress}
      </div>
      <div className=" rounded-sm border-[1px] border-gray-300 p-3">
        <span className="bg-gray-200 rounded-sm p-2 ">You:</span> {userName} -
        {userAddress}
      </div>
      <label className=" text-gray-800 ">Add Admin here [only for owner]</label>
      <input
        className=" border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
        type="text"
        placeholder="Enter Name here"
        onChange={(e) => {
          setAdminName(e.target.value.trim());
        }}
      />
      <input
        className=" border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
        type="text"
        placeholder="Enter address here"
        onChange={(e) => {
          setAdminAddress(e.target.value.trim());
        }}
      />
      <div className="flex gap-3">
        <button
          className=" bg-blue-600 rounded-lg p-2 text-white font-semibold hover:bg-blue-800"
          onClick={() => {
            addAdmin(adminName, adminAddress);
          }}
        >
          Add
        </button>
      </div>
      <label className=" text-gray-800 ">Add Doctor here</label>
      <input
        className=" border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
        type="text"
        placeholder="Enter Name here"
        onChange={(e) => {
          setDoctorName(e.target.value.trim());
        }}
      />
      <input
        className=" border-b-[1px] border-gray-400 focus:outline-none w-[500px]"
        type="text"
        placeholder="Enter address here"
        onChange={(e) => {
          setDoctorAddress(e.target.value.trim());
        }}
      />
      <div className="flex gap-3">
        <button
          className=" bg-blue-600 rounded-lg p-2 text-white font-semibold hover:bg-blue-800"
          onClick={() => {
            addDoctor(doctorName, doctorAddress);
          }}
        >
          Add
        </button>
      </div>
      <div>
        <table className="w-[600px] text-left border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4">No.</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Address</th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {members.map((elem, index) => {
              return (
                <tr key={index + 1} className="hover:bg-gray-100">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{elem.status}</td>
                  <td className="py-2 px-4">{elem.name}</td>
                  <td className="py-2 px-4">{elem.address}</td>
                  <td className="py-2 px-4 hover:bg-gray-200">
                    <Icon.Trash
                      onClick={() => {
                        if (elem.status === "admin") {
                          deleteAdmin(elem.address);
                        } else {
                          deleteDoctor(elem.address);
                        }
                      }}
                      className=" cursor-pointer"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;
